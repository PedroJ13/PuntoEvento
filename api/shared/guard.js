const { getConfig } = require("./config");
const { json } = require("./http");

function requestOrigin(req) {
  if (req.headers?.origin) return req.headers.origin;
  if (!req.headers?.referer) return "";

  try {
    return new URL(req.headers.referer).origin;
  } catch (_error) {
    return "";
  }
}

function enforceAllowedOrigin(req, config = getConfig()) {
  if (!config.allowedOrigins.length) return null;

  const origin = requestOrigin(req);
  if (!origin) return null;
  if (origin && config.allowedOrigins.includes(origin)) return null;

  return json(403, { error: "Forbidden" });
}

module.exports = { enforceAllowedOrigin };
