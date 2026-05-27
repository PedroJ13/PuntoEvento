const { getConfig } = require("../shared/config");
const { json, serverError } = require("../shared/http");

function headerValue(headers, name) {
  const expected = String(name || "").toLowerCase();
  for (const [key, value] of Object.entries(headers || {})) {
    if (String(key).toLowerCase() === expected) return value;
  }
  return "";
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

module.exports = async function authDiagnostics(context, req) {
  try {
    if (String(req.method || "").toUpperCase() !== "POST") {
      context.res = json(405, { error: "Method not allowed" });
      return;
    }

    const config = getConfig();
    const headerNames = Object.keys(req.headers || {}).sort();
    const rawHeader =
      headerValue(req.headers, "authorization") ||
      headerValue(req.headers, "x-punto-admin-authorization") ||
      headerValue(req.headers, "x-punto-admin-credential") ||
      headerValue(req.headers, "x-admin-authorization");
    const credentials = parseBasicAuth(rawHeader);

    context.res = json(200, {
      hasAdminUsername: Boolean(config.adminUsername),
      hasAdminPassword: Boolean(config.adminPassword),
      adminUsernameLength: String(config.adminUsername || "").length,
      adminPasswordLength: String(config.adminPassword || "").length,
      receivedHeaderNames: headerNames,
      hasSupportedAuthHeader: Boolean(rawHeader),
      authHeaderStartsWithBasic: String(rawHeader || "").startsWith("Basic "),
      parsedCredentials: Boolean(credentials),
      parsedUsernameLength: credentials ? String(credentials.username || "").length : 0,
      parsedPasswordLength: credentials ? String(credentials.password || "").length : 0,
      usernameMatches: credentials
        ? String(credentials.username || "") === String(config.adminUsername || "")
        : false,
      passwordMatches: credentials
        ? String(credentials.password || "") === String(config.adminPassword || "")
        : false,
    });
  } catch (error) {
    context.log.error(error);
    context.res = serverError(error);
  }
};
