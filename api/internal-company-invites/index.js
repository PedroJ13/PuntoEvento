const {
  ensureCompaniesTable,
  ensureCompanyAuthTables,
  getConfig,
  getTableClient,
} = require("../shared/azure");
const { requireAdminAuth } = require("../shared/adminAuth");
const { COMPANY_OWNER_ROLE, createCompanyInviteEntity } = require("../shared/companyInvites");
const { enforceAllowedOrigin } = require("../shared/guard");
const { badRequest, json, serverError } = require("../shared/http");

function cleanText(value, maxLength = 256) {
  return String(value || "").trim().slice(0, maxLength);
}

function notFound(message) {
  return json(404, { error: message });
}

async function getCompany(companyId, config) {
  try {
    return await getTableClient(config.companiesTable, config).getEntity("company", companyId);
  } catch (error) {
    if (error.statusCode === 404) return null;
    throw error;
  }
}

module.exports = async function createCompanyInvite(context, req) {
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

    const authError = requireAdminAuth(req, config);
    if (authError) {
      context.res = authError;
      return;
    }

    const companyId = cleanText(req.body?.companyId, 128);
    if (!companyId) {
      context.res = badRequest("companyId is required");
      return;
    }

    await ensureCompaniesTable(config);
    await ensureCompanyAuthTables(config);

    const company = await getCompany(companyId, config);
    if (!company) {
      context.res = notFound("Company not found");
      return;
    }

    const email = cleanText(req.body?.email || company.email, 320).toLowerCase();
    if (!email) {
      context.res = badRequest("email is required");
      return;
    }

    const { invite, inviteUrl } = await createCompanyInviteEntity({ companyId, email }, config);

    context.res = json(201, {
      inviteId: invite.id || invite.rowKey,
      companyId,
      email: invite.email,
      role: COMPANY_OWNER_ROLE,
      expiresAt: invite.expiresAt,
      inviteUrl,
    });
  } catch (error) {
    context.log.error(error);
    context.res = serverError(error);
  }
};
