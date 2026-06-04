const crypto = require("crypto");
const https = require("https");

const ACS_EMAIL_API_VERSION = "2023-03-31";
const EMAIL_PROVIDER_ACS = "acs";
const EMAIL_PROVIDER_SENDGRID = "sendgrid";

function escapeText(value) {
  return String(value || "").replace(/[<>&]/g, (char) => {
    if (char === "<") return "&lt;";
    if (char === ">") return "&gt;";
    return "&amp;";
  });
}

function plainText(value) {
  return String(value || "").replace(/[\r\n]+/g, " ").trim();
}

function htmlToText(html) {
  return String(html || "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function parseConnectionString(connectionString) {
  return Object.fromEntries(
    String(connectionString || "")
      .split(";")
      .filter(Boolean)
      .map((part) => {
        const index = part.indexOf("=");
        return [part.slice(0, index).toLowerCase(), part.slice(index + 1)];
      }),
  );
}

function requestWithTimeout(options, body, timeoutMessage) {
  return new Promise((resolve, reject) => {
    let settled = false;
    const request = https.request(options, (response) => {
      const chunks = [];
      response.on("data", (chunk) => chunks.push(chunk));
      response.on("end", () => {
        if (settled) return;
        settled = true;
        const responseBody = Buffer.concat(chunks).toString("utf8");
        if (response.statusCode >= 200 && response.statusCode < 300) {
          resolve(responseBody);
          return;
        }
        reject(new Error(`${options.providerName} returned ${response.statusCode}: ${responseBody}`));
      });
    });

    request.setTimeout(5000, () => {
      if (settled) return;
      const timeoutError = new Error(timeoutMessage);
      settled = true;
      reject(timeoutError);
      request.destroy(timeoutError);
    });
    request.on("error", (error) => {
      if (settled && error.message === timeoutMessage) return;
      if (!settled) {
        settled = true;
        reject(error);
      }
    });
    request.write(body);
    request.end();
  });
}

async function postSendGridEmail(apiKey, payload) {
  const body = JSON.stringify(payload);
  await requestWithTimeout(
    {
      providerName: "SendGrid",
      hostname: "api.sendgrid.com",
      path: "/v3/mail/send",
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(body),
      },
    },
    body,
    "SendGrid request timed out",
  );
}

async function postAcsEmail(connectionString, payload) {
  const parsed = parseConnectionString(connectionString);
  const endpoint = String(parsed.endpoint || "").replace(/\/+$/, "");
  const accessKey = parsed.accesskey;
  if (!endpoint || !accessKey) {
    throw new Error("Missing Azure Communication Services Email connection string");
  }

  const url = new URL(`/emails:send?api-version=${ACS_EMAIL_API_VERSION}`, endpoint);
  const body = JSON.stringify(payload);
  const contentHash = crypto.createHash("sha256").update(body).digest("base64");
  const date = new Date().toUTCString();
  const signedHeaders = "x-ms-date;host;x-ms-content-sha256";
  const stringToSign = [
    "POST",
    `${url.pathname}${url.search}`,
    `${date};${url.host};${contentHash}`,
  ].join("\n");
  const signature = crypto
    .createHmac("sha256", Buffer.from(accessKey, "base64"))
    .update(stringToSign)
    .digest("base64");

  await requestWithTimeout(
    {
      providerName: "ACS Email",
      hostname: url.hostname,
      path: `${url.pathname}${url.search}`,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(body),
        "x-ms-date": date,
        "x-ms-content-sha256": contentHash,
        Authorization: `HMAC-SHA256 SignedHeaders=${signedHeaders}&Signature=${signature}`,
      },
    },
    body,
    "ACS Email request timed out",
  );
}

function providerKey(config) {
  return config.emailProvider === EMAIL_PROVIDER_SENDGRID
    ? EMAIL_PROVIDER_SENDGRID
    : EMAIL_PROVIDER_ACS;
}

function providerName(config) {
  return providerKey(config) === EMAIL_PROVIDER_SENDGRID ? "SendGrid" : "ACS Email";
}

function hasEmailProviderConfig(config) {
  if (providerKey(config) === EMAIL_PROVIDER_SENDGRID) {
    return Boolean(config.sendGridApiKey && config.notificationEmailFrom);
  }
  return Boolean(config.azureCommunicationConnectionString && config.azureCommunicationEmailFrom);
}

async function sendEmail(config, message) {
  if (providerKey(config) === EMAIL_PROVIDER_SENDGRID) {
    if (!config.sendGridApiKey) throw new Error("Missing SENDGRID_API_KEY");
    if (!config.notificationEmailFrom) throw new Error("Missing NOTIFICATION_EMAIL_FROM");

    await postSendGridEmail(config.sendGridApiKey, {
      personalizations: [
        {
          to: message.to.map((email) => ({ email })),
          subject: message.subject,
        },
      ],
      from: {
        email: config.notificationEmailFrom,
        name: config.notificationEmailFromName,
      },
      reply_to: message.replyTo || undefined,
      content: [
        {
          type: "text/html",
          value: message.html,
        },
      ],
    });
    return;
  }

  if (!config.azureCommunicationConnectionString) {
    throw new Error("Missing AZURE_COMMUNICATION_CONNECTION_STRING");
  }
  if (!config.azureCommunicationEmailFrom) {
    throw new Error("Missing AZURE_COMMUNICATION_EMAIL_FROM");
  }

  await postAcsEmail(config.azureCommunicationConnectionString, {
    senderAddress: config.azureCommunicationEmailFrom,
    recipients: {
      to: message.to.map((email) => ({ address: email })),
    },
    content: {
      subject: message.subject,
      plainText: message.text || htmlToText(message.html),
      html: message.html,
    },
    replyTo: message.replyTo?.email
      ? [
          {
            address: message.replyTo.email,
            displayName: message.replyTo.name,
          },
        ]
      : undefined,
  });
}

async function sendInternalNotification(context, config, message) {
  if (!hasEmailProviderConfig(config)) {
    context.log.warn(`Internal notification skipped: missing ${providerName(config)} configuration.`);
    return;
  }
  if (!config.notificationEmailTo) {
    context.log.warn("Internal notification skipped: missing recipient.");
    return;
  }

  await sendEmail(config, {
    to: [config.notificationEmailTo],
    subject: message.subject,
    html: message.html,
    replyTo: message.replyTo,
  });
}

async function notifyProviderRegistration(context, provider, config) {
  const details = [
    ["Empresa", provider.name],
    ["Categoria", provider.category],
    ["Zona", provider.location],
    ["Telefono", provider.phone],
    ["Email", provider.email],
    ["Precio", provider.price],
    ["Web", provider.website],
    ["ID interno", provider.rowKey],
  ];
  const rows = details
    .map(
      ([label, value]) =>
        `<tr><td style="padding:6px 10px;font-weight:bold;">${escapeText(label)}</td><td style="padding:6px 10px;">${escapeText(value || "-")}</td></tr>`,
    )
    .join("");
  const appLink = config.appPublicUrl
    ? `<p><a href="${escapeText(config.appPublicUrl)}">Abrir Punto Evento</a></p>`
    : "";

  await sendInternalNotification(context, config, {
    subject: `Nueva empresa registrada en Punto Evento: ${plainText(provider.name)}`,
    replyTo: provider.email ? { email: provider.email, name: provider.name } : undefined,
    html: `
      <h2>Nuevo registro de empresa</h2>
      <p>Una empresa envio sus datos a Punto Evento y queda pendiente de revision interna.</p>
      <table style="border-collapse:collapse;">${rows}</table>
      <p><strong>Descripcion</strong></p>
      <p>${escapeText(provider.description)}</p>
      <p>Revisar la informacion y aprobar o rechazar la empresa desde el admin interno.</p>
      ${appLink}
    `,
  });
}

async function notifyCompanyRegistration(context, company, config) {
  const rows = [
    ["Empresa", company.name],
    ["Email", company.email],
    ["WhatsApp", company.whatsapp],
    ["Telefono", company.phone],
    ["Provincia", company.province],
    ["Canton", company.canton],
    ["ID interno", company.id || company.rowKey],
  ]
    .map(
      ([label, value]) =>
        `<tr><td style="padding:6px 10px;font-weight:bold;">${escapeText(label)}</td><td style="padding:6px 10px;">${escapeText(value || "-")}</td></tr>`,
    )
    .join("");

  await sendInternalNotification(context, config, {
    subject: `Nueva empresa registrada en Punto Evento: ${plainText(company.name)}`,
    replyTo: company.email ? { email: company.email, name: company.name } : undefined,
    html: `
      <h2>Nueva empresa registrada</h2>
      <p>Una empresa se registro en Punto Evento y queda pendiente de revision interna.</p>
      <table style="border-collapse:collapse;">${rows}</table>
      <p><strong>Descripcion</strong></p>
      <p>${escapeText(company.description)}</p>
      <p>Revisar la informacion y aprobar o rechazar la empresa desde el admin interno.</p>
    `,
  });
}

async function notifyServiceSubmittedForReview(context, { company, service }, config) {
  const rows = [
    ["Empresa", company.name],
    ["Email empresa", company.email],
    ["Servicio", service.name],
    ["Categoria", service.category],
    ["Precio desde", service.priceFrom],
    ["Empresa ID", service.partitionKey],
    ["Servicio ID", service.rowKey],
  ]
    .map(
      ([label, value]) =>
        `<tr><td style="padding:6px 10px;font-weight:bold;">${escapeText(label)}</td><td style="padding:6px 10px;">${escapeText(value || "-")}</td></tr>`,
    )
    .join("");

  await sendInternalNotification(context, config, {
    subject: `Servicio enviado a revision en Punto Evento: ${plainText(service.name)}`,
    replyTo: company.email ? { email: company.email, name: company.name } : undefined,
    html: `
      <h2>Servicio enviado a revision</h2>
      <p>Una empresa envio un servicio a Punto Evento para moderacion interna.</p>
      <table style="border-collapse:collapse;">${rows}</table>
      <p><strong>Descripcion</strong></p>
      <p>${escapeText(service.description)}</p>
      <p>Revisar el servicio, sus datos publicos y sus imagenes antes de aprobarlo.</p>
    `,
  });
}

async function sendLeadEmailToCompany({ company, service, lead }, config) {
  const rows = [
    ["Servicio", service.name],
    ["Empresa", company.name],
    ["Nombre cliente", lead.name],
    ["Email cliente", lead.email],
    ["WhatsApp cliente", lead.phone],
    ["Tipo de evento", lead.eventType],
    ["Fecha", lead.eventDate],
    ["Invitados", lead.guests],
    ["Lead ID", lead.id],
  ]
    .map(
      ([label, value]) =>
        `<tr><td style="padding:6px 10px;font-weight:bold;">${escapeText(label)}</td><td style="padding:6px 10px;">${escapeText(value || "-")}</td></tr>`,
    )
    .join("");

  await sendEmail(config, {
    to: [company.email],
    subject: `Nueva solicitud desde Punto Evento: ${plainText(service.name)}`,
    replyTo: lead.email ? { email: lead.email, name: lead.name } : undefined,
    html: `
      <h2>Nueva solicitud de cotizacion</h2>
      <p>Hola ${escapeText(company.name)}.</p>
      <p>Recibiste una solicitud desde Punto Evento para el servicio <strong>${escapeText(service.name)}</strong>.</p>
      <p>Este correo queda como respaldo y trazabilidad del contacto. Puedes responder directo a este email o contactar al cliente por WhatsApp.</p>
      <table style="border-collapse:collapse;">${rows}</table>
      <p><strong>Mensaje</strong></p>
      <p>${escapeText(lead.message)}</p>
    `,
  });
}

async function sendCompanyActivationInviteEmail({ company, inviteUrl }, config) {
  await sendEmail(config, {
    to: [company.email],
    subject: "Tu empresa fue aprobada en Punto Evento",
    html: `
      <h2>Tu empresa fue aprobada en Punto Evento</h2>
      <p>Hola ${escapeText(company.name)}.</p>
      <p>Bienvenido a Punto Evento. Tu empresa fue aprobada y ya puedes activar tu acceso al panel.</p>
      <p>Desde el panel podras revisar tu perfil, cargar servicios y mantener tu informacion actualizada.</p>
      <p><a href="${escapeText(inviteUrl)}">Activar acceso</a></p>
      <p>Por seguridad, este enlace vence automaticamente.</p>
    `,
  });
}

module.exports = {
  notifyCompanyRegistration,
  notifyProviderRegistration,
  notifyServiceSubmittedForReview,
  sendCompanyActivationInviteEmail,
  sendLeadEmailToCompany,
  sendEmail,
};
