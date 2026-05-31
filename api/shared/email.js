const https = require("https");

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

function postSendGridEmail(apiKey, payload) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify(payload);
    let settled = false;
    const request = https.request(
      {
        hostname: "api.sendgrid.com",
        path: "/v3/mail/send",
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(body),
        },
      },
      (response) => {
        const chunks = [];
        response.on("data", (chunk) => chunks.push(chunk));
        response.on("end", () => {
          if (settled) return;
          settled = true;
          if (response.statusCode >= 200 && response.statusCode < 300) {
            resolve();
            return;
          }
          reject(
            new Error(
              `SendGrid returned ${response.statusCode}: ${Buffer.concat(chunks).toString("utf8")}`,
            ),
          );
        });
      },
    );

    request.setTimeout(5000, () => {
      if (settled) return;
      const timeoutError = new Error("SendGrid request timed out");
      settled = true;
      reject(timeoutError);
      request.destroy(timeoutError);
    });
    request.on("error", (error) => {
      if (settled && error.message === "SendGrid request timed out") {
        return;
      }
      if (!settled) {
        settled = true;
        reject(error);
      }
    });
    request.write(body);
    request.end();
  });
}

async function sendEmail(config, message) {
  if (!config.sendGridApiKey) {
    throw new Error("Missing SENDGRID_API_KEY");
  }
  if (!config.notificationEmailFrom) {
    throw new Error("Missing NOTIFICATION_EMAIL_FROM");
  }

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
}

async function sendInternalNotification(context, config, message) {
  if (!config.sendGridApiKey) {
    context.log.warn("Internal notification skipped: missing SendGrid configuration.");
    return;
  }
  if (!config.notificationEmailFrom || !config.notificationEmailTo) {
    context.log.warn("Internal notification skipped: missing sender or recipient.");
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
  if (!config.sendGridApiKey) {
    context.log.warn("Provider notification email skipped: missing SendGrid configuration.");
    return;
  }
  if (!config.notificationEmailFrom || !config.notificationEmailTo) {
    context.log.warn("Provider notification email skipped: missing sender or recipient.");
    return;
  }

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

  await postSendGridEmail(config.sendGridApiKey, {
    personalizations: [
      {
        to: [{ email: config.notificationEmailTo }],
        subject: `Nuevo registro de empresa: ${provider.name}`,
      },
    ],
    from: {
      email: config.notificationEmailFrom,
      name: config.notificationEmailFromName,
    },
    reply_to: provider.email ? { email: provider.email, name: provider.name } : undefined,
    content: [
      {
        type: "text/html",
        value: `
          <h2>Nuevo registro de empresa</h2>
          <p>Una empresa envio sus datos para revision en Punto Evento.</p>
          <table style="border-collapse:collapse;">${rows}</table>
          <p><strong>Descripcion</strong></p>
          <p>${escapeText(provider.description)}</p>
          ${appLink}
        `,
      },
    ],
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
    subject: `Nueva empresa registrada: ${plainText(company.name)}`,
    replyTo: company.email ? { email: company.email, name: company.name } : undefined,
    html: `
      <h2>Nueva empresa registrada</h2>
      <p>Una empresa se registro en Punto Evento y queda pendiente de revision.</p>
      <table style="border-collapse:collapse;">${rows}</table>
      <p><strong>Descripcion</strong></p>
      <p>${escapeText(company.description)}</p>
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
    subject: `Servicio enviado a revision: ${plainText(service.name)}`,
    replyTo: company.email ? { email: company.email, name: company.name } : undefined,
    html: `
      <h2>Servicio enviado a revision</h2>
      <p>Una empresa envio un servicio para moderacion interna.</p>
      <table style="border-collapse:collapse;">${rows}</table>
      <p><strong>Descripcion</strong></p>
      <p>${escapeText(service.description)}</p>
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
    subject: `Nueva cotizacion para ${plainText(service.name)}`,
    replyTo: lead.email ? { email: lead.email, name: lead.name } : undefined,
    html: `
      <h2>Nueva solicitud de cotizacion</h2>
      <p>Recibiste una solicitud desde Punto Evento.</p>
      <table style="border-collapse:collapse;">${rows}</table>
      <p><strong>Mensaje</strong></p>
      <p>${escapeText(lead.message)}</p>
    `,
  });
}

module.exports = {
  notifyCompanyRegistration,
  notifyProviderRegistration,
  notifyServiceSubmittedForReview,
  sendLeadEmailToCompany,
};
