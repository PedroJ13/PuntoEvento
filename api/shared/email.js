const crypto = require("crypto");
const https = require("https");

const ACS_EMAIL_API_VERSION = "2023-03-31";
const EMAIL_PROVIDER_ACS = "acs";
const EMAIL_PROVIDER_SENDGRID = "sendgrid";
const EMAIL_STYLES = {
  page:
    "background:#f8f5ef;padding:24px;font-family:Arial,sans-serif;color:#17191d;",
  card:
    "background:#fffdf8;border:1px solid #e4dacb;border-radius:12px;padding:24px;color:#17191d;",
  brand:
    "font-size:13px;font-weight:bold;letter-spacing:.08em;text-transform:uppercase;color:#17191d;margin:0 0 10px;",
  accent: "height:3px;background:#b9934b;margin:0 0 20px;",
  h2: "color:#17191d;font-size:22px;line-height:1.25;margin:0 0 14px;",
  p: "color:#2a2c31;font-size:15px;line-height:1.55;margin:0 0 14px;",
  table:
    "border-collapse:collapse;width:100%;margin:16px 0;border:1px solid #e4dacb;",
  labelCell:
    "padding:8px 10px;font-weight:bold;background:#f3eee6;border:1px solid #e4dacb;color:#17191d;",
  valueCell: "padding:8px 10px;border:1px solid #e4dacb;color:#2a2c31;",
  sectionLabel: "color:#17191d;font-size:15px;line-height:1.4;margin:16px 0 8px;",
  cta:
    "background:#17191d;color:#ffffff;border-radius:8px;padding:10px 14px;display:inline-block;text-decoration:none;font-weight:bold;",
};

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

function emailShell(content) {
  return `
    <div style="${EMAIL_STYLES.page}">
      <div style="${EMAIL_STYLES.card}">
        <p style="${EMAIL_STYLES.brand}">Punto Evento CR</p>
        <div style="${EMAIL_STYLES.accent}"></div>
        ${content}
      </div>
    </div>
  `;
}

function emailRows(details) {
  return details
    .map(
      ([label, value]) =>
        `<tr><td style="${EMAIL_STYLES.labelCell}">${escapeText(label)}</td><td style="${EMAIL_STYLES.valueCell}">${escapeText(value || "-")}</td></tr>`,
    )
    .join("");
}

function emailCta(href, label) {
  return `<p style="${EMAIL_STYLES.p}"><a href="${escapeText(href)}" style="${EMAIL_STYLES.cta}">${escapeText(label)}</a></p>`;
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
    ["Categoría", provider.category],
    ["Zona", provider.location],
    ["Teléfono", provider.phone],
    ["Email", provider.email],
    ["Precio", provider.price],
    ["Web", provider.website],
    ["ID interno", provider.rowKey],
  ];
  const rows = emailRows(details);
  const appLink = config.appPublicUrl
    ? emailCta(config.appPublicUrl, "Abrir Punto Evento CR")
    : "";

  await sendInternalNotification(context, config, {
    subject: `Nueva empresa registrada en Punto Evento CR: ${plainText(provider.name)}`,
    replyTo: provider.email ? { email: provider.email, name: provider.name } : undefined,
    html: emailShell(`
      <h2 style="${EMAIL_STYLES.h2}">Nuevo registro de empresa</h2>
      <p style="${EMAIL_STYLES.p}">Una empresa envió sus datos a Punto Evento CR y queda pendiente de revisión interna.</p>
      <table style="${EMAIL_STYLES.table}">${rows}</table>
      <p style="${EMAIL_STYLES.sectionLabel}"><strong>Descripción</strong></p>
      <p style="${EMAIL_STYLES.p}">${escapeText(provider.description)}</p>
      <p style="${EMAIL_STYLES.p}">Revisar la información y aprobar o rechazar la empresa desde el admin interno.</p>
      ${appLink}
    `),
  });
}

async function notifyCompanyRegistration(context, company, config) {
  const rows = emailRows([
    ["Empresa", company.name],
    ["Email", company.email],
    ["WhatsApp", company.whatsapp],
    ["Teléfono", company.phone],
    ["Provincia", company.province],
    ["Cantón", company.canton],
    ["ID interno", company.id || company.rowKey],
  ]);

  await sendInternalNotification(context, config, {
    subject: `Nueva empresa registrada en Punto Evento CR: ${plainText(company.name)}`,
    replyTo: company.email ? { email: company.email, name: company.name } : undefined,
    html: emailShell(`
      <h2 style="${EMAIL_STYLES.h2}">Nueva empresa registrada</h2>
      <p style="${EMAIL_STYLES.p}">Una empresa se registró en Punto Evento CR y queda pendiente de revisión interna.</p>
      <table style="${EMAIL_STYLES.table}">${rows}</table>
      <p style="${EMAIL_STYLES.sectionLabel}"><strong>Descripción</strong></p>
      <p style="${EMAIL_STYLES.p}">${escapeText(company.description)}</p>
      <p style="${EMAIL_STYLES.p}">Revisar la información y aprobar o rechazar la empresa desde el admin interno.</p>
    `),
  });
}

async function notifyServiceSubmittedForReview(context, { company, service }, config) {
  const rows = emailRows([
    ["Empresa", company.name],
    ["Email empresa", company.email],
    ["Servicio", service.name],
    ["Categoría", service.category],
    ["Precio desde", service.priceFrom],
    ["Empresa ID", service.partitionKey],
    ["Servicio ID", service.rowKey],
  ]);

  await sendInternalNotification(context, config, {
    subject: `Servicio enviado en Punto Evento CR: ${plainText(service.name)}`,
    replyTo: company.email ? { email: company.email, name: company.name } : undefined,
    html: emailShell(`
      <h2 style="${EMAIL_STYLES.h2}">Servicio enviado</h2>
      <p style="${EMAIL_STYLES.p}">Una empresa envió un servicio a Punto Evento CR para revisión interna.</p>
      <table style="${EMAIL_STYLES.table}">${rows}</table>
      <p style="${EMAIL_STYLES.sectionLabel}"><strong>Descripción</strong></p>
      <p style="${EMAIL_STYLES.p}">${escapeText(service.description)}</p>
      <p style="${EMAIL_STYLES.p}">Revisar el servicio, sus datos públicos y sus imágenes antes de aprobarlo.</p>
    `),
  });
}

async function sendLeadEmailToCompany({ company, service, lead }, config) {
  const rows = emailRows([
    ["Servicio", service.name],
    ["Empresa", company.name],
    ["Nombre cliente", lead.name],
    ["Email cliente", lead.email],
    ["WhatsApp cliente", lead.phone],
    ["Tipo de evento", lead.eventType],
    ["Fecha", lead.eventDate],
    ["Invitados", lead.guests],
    ["Lead ID", lead.id],
  ]);

  await sendEmail(config, {
    to: [company.email],
    subject: `Nueva solicitud desde Punto Evento CR: ${plainText(service.name)}`,
    replyTo: lead.email ? { email: lead.email, name: lead.name } : undefined,
    html: emailShell(`
      <h2 style="${EMAIL_STYLES.h2}">Nueva solicitud de cotización</h2>
      <p style="${EMAIL_STYLES.p}">Hola ${escapeText(company.name)}.</p>
      <p style="${EMAIL_STYLES.p}">Recibiste una solicitud desde Punto Evento CR para el servicio <strong>${escapeText(service.name)}</strong>.</p>
      <p style="${EMAIL_STYLES.p}">Este correo queda como respaldo y trazabilidad del contacto. Puedes responder directo a este email o contactar al cliente por WhatsApp.</p>
      <table style="${EMAIL_STYLES.table}">${rows}</table>
      <p style="${EMAIL_STYLES.sectionLabel}"><strong>Mensaje</strong></p>
      <p style="${EMAIL_STYLES.p}">${escapeText(lead.message)}</p>
    `),
  });
}

async function sendCompanyActivationInviteEmail({ company, inviteUrl }, config) {
  await sendEmail(config, {
    to: [company.email],
    subject: "Tu acceso a Punto Evento CR está listo",
    html: emailShell(`
      <h2 style="${EMAIL_STYLES.h2}">Tu acceso a Punto Evento CR está listo</h2>
      <p style="${EMAIL_STYLES.p}">Hola ${escapeText(company.name)}.</p>
      <p style="${EMAIL_STYLES.p}">Ya puedes activar tu acceso al panel.</p>
      <p style="${EMAIL_STYLES.p}">Desde el panel podrás revisar tu perfil, cargar servicios y mantener tu información actualizada.</p>
      ${emailCta(inviteUrl, "Activar acceso")}
      <p style="${EMAIL_STYLES.p}">Por seguridad, este enlace vence automáticamente.</p>
    `),
  });
}

async function sendCompanyPasswordResetEmail({ company, resetUrl }, config) {
  await sendEmail(config, {
    to: [company.email],
    subject: "Recupera tu acceso a Punto Evento CR",
    html: emailShell(`
      <h2 style="${EMAIL_STYLES.h2}">Recupera tu acceso</h2>
      <p style="${EMAIL_STYLES.p}">Hola ${escapeText(company.name || "equipo")}.</p>
      <p style="${EMAIL_STYLES.p}">Recibimos una solicitud para crear una nueva contraseña del panel de empresa.</p>
      ${emailCta(resetUrl, "Crear nueva contraseña")}
      <p style="${EMAIL_STYLES.p}">Por seguridad, este enlace vence automáticamente. Si no solicitaste este cambio, puedes ignorar este correo.</p>
    `),
  });
}

module.exports = {
  notifyCompanyRegistration,
  notifyProviderRegistration,
  notifyServiceSubmittedForReview,
  sendCompanyActivationInviteEmail,
  sendCompanyPasswordResetEmail,
  sendLeadEmailToCompany,
  sendEmail,
};
