const crypto = require("crypto");
const { getConfig } = require("./config");
const { json } = require("./http");

function safeCompare(left, right) {
  const leftBuffer = Buffer.from(String(left || ""));
  const rightBuffer = Buffer.from(String(right || ""));
  if (leftBuffer.length !== rightBuffer.length) return false;
  return crypto.timingSafeEqual(leftBuffer, rightBuffer);
}

function parseBasicAuth(header) {
  const value = String(header || "");
  if (!value.startsWith("Basic ")) return null;

  try {
    const decoded = Buffer.from(value.slice(6), "base64").toString("utf8");
    const separator = decoded.indexOf(":");
    if (separator < 0) return null;
    return {
      username: decoded.slice(0, separator),
      password: decoded.slice(separator + 1),
    };
  } catch (_error) {
    return null;
  }
}

function unauthorized() {
  return {
    ...json(401, { error: "Unauthorized" }),
    headers: {
      "WWW-Authenticate": 'Basic realm="Punto Evento Admin"',
      "Content-Type": "application/json",
    },
  };
}

function headerValue(headers, name) {
  const expected = String(name || "").toLowerCase();
  for (const [key, value] of Object.entries(headers || {})) {
    if (String(key).toLowerCase() === expected) return value;
  }
  return "";
}

function requireAdminAuth(req, config = getConfig()) {
  if (!config.adminUsername || !config.adminPassword) {
    return json(503, { error: "Admin credentials are not configured" });
  }

  const credentials = parseBasicAuth(headerValue(req.headers, "authorization"));
  if (!credentials) return unauthorized();

  const validUsername = safeCompare(credentials.username, config.adminUsername);
  const validPassword = safeCompare(credentials.password, config.adminPassword);
  if (!validUsername || !validPassword) return unauthorized();

  return null;
}

module.exports = { requireAdminAuth };
