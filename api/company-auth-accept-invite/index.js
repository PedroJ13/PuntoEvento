const { ensureCompanyAuthTables, getConfig } = require("../shared/azure");
const { enforceAllowedOrigin } = require("../shared/guard");
const { badRequest, json, serverError } = require("../shared/http");
const {
  cleanToken,
  createCompanySession,
  findInviteByToken,
  markInviteUsed,
  publicSessionPayload,
  sessionCookie,
  validateActiveInvite,
} = require("../shared/companyAuth");

module.exports = async function acceptCompanyInvite(context, req) {
  try {
    if (String(req.method || "").toUpperCase() !== "POST") {
      context.res = json(405, { error: "Method not allowed" });
      return;
    }

    const token = cleanToken(req.body?.token, 512);
    if (!token) {
      context.res = badRequest("token is required");
      return;
    }

    const config = getConfig();
    const forbidden = enforceAllowedOrigin(req, config);
    if (forbidden) {
      context.res = forbidden;
      return;
    }

    await ensureCompanyAuthTables(config);

    const invite = await findInviteByToken(token, config);
    const inviteError = validateActiveInvite(invite);
    if (inviteError) {
      context.res = badRequest(inviteError);
      return;
    }

    const { session, sessionToken } = await createCompanySession(invite, config);
    await markInviteUsed(invite, config);

    context.res = {
      ...json(200, publicSessionPayload(session)),
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Set-Cookie": sessionCookie(sessionToken, config),
      },
    };
  } catch (error) {
    context.log.error(error);
    context.res = serverError(error);
  }
};
