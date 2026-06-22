const {
  ensureCompaniesTable,
  ensureCompanyAuthTables,
  getConfig,
  getTableClient,
} = require("../shared/azure");
const { enforceAllowedOrigin } = require("../shared/guard");
const { json, serverError } = require("../shared/http");
const {
  cleanPassword,
  findCompanyOwnerUser,
  getCurrentCompanySession,
  revokeOtherCompanySessions,
  updateCompanyOwnerPassword,
  validatePasswordChangePayload,
  verifyPassword,
} = require("../shared/companyAuth");

const PANEL_ALLOWED_COMPANY_STATUSES = new Set(["pending", "published"]);

function validationError(error) {
  return json(400, {
    error: error.message,
    code: error.code,
    ...(error.details ? { details: error.details } : {}),
  });
}

function invalidCurrentPassword() {
  return json(401, {
    error: "Invalid current password",
    code: "INVALID_CURRENT_PASSWORD",
  });
}

async function getCompany(companyId, config) {
  try {
    return await getTableClient(config.companiesTable, config).getEntity("company", companyId);
  } catch (error) {
    if (error.statusCode === 404) return null;
    throw error;
  }
}

module.exports = async function changeCompanyPassword(context, req) {
  try {
    if (String(req.method || "").toUpperCase() !== "POST") {
      context.res = json(405, { error: "Method not allowed" });
      return;
    }

    const payloadError = validatePasswordChangePayload(req.body || {});
    if (payloadError) {
      context.res = validationError(payloadError);
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

    const session = await getCurrentCompanySession(req, config);
    if (!session) {
      context.res = json(401, { error: "Unauthorized", code: "UNAUTHORIZED" });
      return;
    }

    const company = await getCompany(session.partitionKey, config);
    if (!company) {
      context.res = json(404, { error: "Company not found", code: "COMPANY_NOT_FOUND" });
      return;
    }
    if (!PANEL_ALLOWED_COMPANY_STATUSES.has(company.status || "pending")) {
      context.res = json(403, {
        error: "Company status cannot access panel",
        code: "COMPANY_STATUS_FORBIDDEN",
      });
      return;
    }

    const user = await findCompanyOwnerUser(session.partitionKey, session.email, config);
    if (!user || user.status !== "active" || !user.passwordHash) {
      context.res = json(401, { error: "Unauthorized", code: "UNAUTHORIZED" });
      return;
    }

    const currentPassword = cleanPassword(req.body.currentPassword);
    if (!verifyPassword(currentPassword, user.passwordHash)) {
      context.res = invalidCurrentPassword();
      return;
    }

    await updateCompanyOwnerPassword(user, req.body.newPassword, config);
    const revokedSessions = await revokeOtherCompanySessions(session, config);

    context.res = json(200, {
      ok: true,
      revokedSessions,
    });
  } catch (error) {
    context.log.error(error);
    context.res = serverError(error);
  }
};
