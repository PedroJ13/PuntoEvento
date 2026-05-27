const crypto = require("crypto");
const {
  ensureCompaniesTable,
  ensureCompanyAuthTables,
  getConfig,
  getTableClient,
} = require("../shared/azure");
const { requireAdminAuth } = require("../shared/adminAuth");
const { createSecureToken, hashSecret } = require("../shared/companyAuth");
const { enforceAllowedOrigin } = require("../shared/guard");
const { badRequest, json, serverError } = require("../shared/http");

const COMPANY_OWNER_ROLE = "company_owner";

function cleanText(value, maxLength = 256) {
  return String(value || "").trim().slice(0, maxLength);
}

function notFound(message) {
  return json(404, { error: message });
}

function inviteUrl(token, config) {
  const path = `/panel.html?invite=${encodeURIComponent(token)}`;
  const baseUrl = String(config.appPublicUrl || "").trim().replace(/\/+$/, "");
  return baseUrl ? `${baseUrl}${path}` : path;
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

    const now = new Date().toISOString();
    const expiresAt = new Date(
      Date.now() + Math.max(1, Number(config.companyInviteTokenTtlMinutes || 1440)) * 60 * 1000,
    ).toISOString();
    const inviteId = `invite_${crypto.randomUUID()}`;
    const token = createSecureToken(32);

    await getTableClient(config.companyInvitesTable, config).createEntity({
      partitionKey: companyId,
      rowKey: inviteId,
      id: inviteId,
      tokenHash: hashSecret(token),
      email,
      role: COMPANY_OWNER_ROLE,
      status: "active",
      expiresAt,
      usedAt: "",
      createdAt: now,
      updatedAt: now,
    });

    context.res = json(201, {
      inviteId,
      companyId,
      email,
      role: COMPANY_OWNER_ROLE,
      expiresAt,
      inviteUrl: inviteUrl(token, config),
    });
  } catch (error) {
    context.log.error(error);
    context.res = serverError(error);
  }
};
