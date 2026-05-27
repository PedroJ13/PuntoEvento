const {
  ensureCompaniesTable,
  ensureCompanyAuthTables,
  getConfig,
  getTableClient,
} = require("../shared/azure");
const { getCurrentCompanySession } = require("../shared/companyAuth");
const { enforceAllowedOrigin } = require("../shared/guard");
const { json, serverError } = require("../shared/http");

function publicCompanyPayload(company) {
  return {
    id: company.id || company.rowKey || "",
    slug: company.slug || "",
    name: company.name || "",
    status: company.status || "",
    plan: company.plan || "free",
    email: company.email || "",
    whatsapp: company.whatsapp || "",
    phone: company.phone || "",
    website: company.website || "",
    instagram: company.instagram || "",
    province: company.province || "",
    canton: company.canton || "",
    district: company.district || "",
    address: company.address || "",
    description: company.description || "",
    logoUrl: company.logoUrl || "",
    coverUrl: company.coverUrl || "",
    createdAt: company.createdAt || "",
    updatedAt: company.updatedAt || "",
  };
}

async function getCompany(companyId, config) {
  try {
    return await getTableClient(config.companiesTable, config).getEntity("company", companyId);
  } catch (error) {
    if (error.statusCode === 404) return null;
    throw error;
  }
}

module.exports = async function getCurrentCompany(context, req) {
  try {
    if (String(req.method || "").toUpperCase() !== "GET") {
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
    if (!session) {
      context.res = json(401, { error: "Unauthorized" });
      return;
    }

    const companyId = session.partitionKey;
    await ensureCompaniesTable(config);

    const company = await getCompany(companyId, config);
    if (!company) {
      context.res = json(404, { error: "Company not found" });
      return;
    }

    context.res = json(200, publicCompanyPayload(company));
  } catch (error) {
    context.log.error(error);
    context.res = serverError(error);
  }
};
