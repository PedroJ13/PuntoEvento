const https = require("https");

function escapeText(value) {
  return String(value || "").replace(/[<>&]/g, (char) => {
    if (char === "<") return "&lt;";
    if (char === ">") return "&gt;";
    return "&amp;";
  });
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

module.exports = { notifyProviderRegistration };
