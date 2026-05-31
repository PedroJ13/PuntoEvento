const {
  ensureCompaniesTable,
  ensureCompanyAuthTables,
  getConfig,
  getTableClient,
} = require("../shared/azure");
const { enforceAllowedOrigin } = require("../shared/guard");
const { badRequest, json, serverError } = require("../shared/http");
const {
  cleanPassword,
  cleanToken,
  createCompanySessionForCompany,
  findInviteByToken,
  markInviteUsed,
  publicSessionPayload,
  sessionCookie,
  upsertCompanyOwnerPassword,
  validateActiveInvite,
} = require("../shared/companyAuth");

const LOGIN_ALLOWED_COMPANY_STATUSES = new Set(["pending", "published"]);

function validatePassword(password) {
  const value = cleanPassword(password);
  if (value.length < 8) return "password must be at least 8 characters";
  return "";
}

async function getCompany(companyId, config) {
  try {
    return await getTableClient(config.companiesTable, config).getEntity("company", companyId);
  } catch (error) {
    if (error.statusCode === 404) return null;
    throw error;
  }
}

module.exports = async function activateCompanyPassword(context, req) {
  try {
    if (String(req.method || "").toUpperCase() !== "POST") {
      context.res = json(405, { error: "Method not allowed" });
      return;
    }

    const token = cleanToken(req.body?.token, 512);
    const password = cleanPassword(req.body?.password);
    if (!token) {
      context.res = badRequest("token is required");
      return;
    }
    const passwordError = validatePassword(password);
    if (passwordError) {
      context.res = badRequest(passwordError);
      return;
    }

    const config = getConfig();
    const forbidden = enforceAllowedOrigin(req, config);
    if (forbidden) {
      context.res = forbidden;
      return;
    }

    await ensureCompaniesTable(config);
    await ensureCompanyAuthTables(config);

    const invite = await findInviteByToken(token, config);
    const inviteError = validateActiveInvite(invite);
    if (inviteError) {
      context.res = badRequest(inviteError);
      return;
    }

    const company = await getCompany(invite.partitionKey, config);
    if (!company) {
      context.res = json(404, { error: "Company not found" });
      return;
    }
    if (!LOGIN_ALLOWED_COMPANY_STATUSES.has(company.status || "pending")) {
      context.res = json(403, { error: "Company status cannot access panel" });
      return;
    }

    const user = await upsertCompanyOwnerPassword(
      {
        companyId: invite.partitionKey,
        email: invite.email,
        password,
      },
      config,
    );
    const { session, sessionToken } = await createCompanySessionForCompany(
      {
        companyId: invite.partitionKey,
        email: user.email,
        role: user.role,
      },
      config,
    );
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
