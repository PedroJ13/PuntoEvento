const { ensureCompanyAuthTables, getConfig } = require("../shared/azure");
const { enforceAllowedOrigin } = require("../shared/guard");
const { json, serverError } = require("../shared/http");
const {
  clearSessionCookie,
  getCurrentCompanySession,
  revokeSession,
} = require("../shared/companyAuth");

module.exports = async function logoutCompany(context, req) {
  try {
    if (String(req.method || "").toUpperCase() !== "POST") {
      context.res = json(405, { error: "Method not allowed" });
      return;
    }

    const config = getConfig();
    const forbidden = enforceAllowedOrigin(req, config);
    if (forbidden) {
      context.res = forbidden;
      return;
    }

    await ensureCompanyAuthTables(config);

    const session = await getCurrentCompanySession(req, config);
    if (session) {
      await revokeSession(session, config);
    }

    context.res = {
      ...json(200, { ok: true }),
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Set-Cookie": clearSessionCookie(config),
      },
    };
  } catch (error) {
    context.log.error(error);
    context.res = serverError(error);
  }
};
