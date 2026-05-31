const crypto = require("crypto");
const { odata } = require("@azure/data-tables");
const {
  ensureCompaniesTable,
  getConfig,
  getTableClient,
} = require("../shared/azure");
const { notifyCompanyRegistration } = require("../shared/email");
const { enforceAllowedOrigin } = require("../shared/guard");
const { badRequest, json, serverError } = require("../shared/http");
const { slugify, validateCompanyRegistrationPayload } = require("../shared/validation");

async function slugExists(table, slug) {
  const entities = table.listEntities({
    queryOptions: {
      filter: odata`PartitionKey eq ${"company"} and slug eq ${slug}`,
    },
  });

  for await (const _entity of entities) {
    return true;
  }
  return false;
}

async function uniqueCompanySlug(table, name) {
  const baseSlug = slugify(name).replace(/^provider-/, "company-");
  let candidate = baseSlug;
  let attempt = 0;

  while (await slugExists(table, candidate)) {
    attempt += 1;
    candidate = `${baseSlug}-${crypto.randomUUID().slice(0, 6)}`;
    if (attempt >= 5) break;
  }

  return candidate;
}

module.exports = async function registerCompany(context, req) {
  try {
    if (String(req.method || "").toUpperCase() !== "POST") {
      context.res = json(405, { error: "Method not allowed" });
      return;
    }

    const validation = validateCompanyRegistrationPayload(req.body || {});
    if (validation.error) {
      context.res = badRequest(validation.error, validation.details);
      return;
    }

    const config = getConfig();
    const forbidden = enforceAllowedOrigin(req, config);
    if (forbidden) {
      context.res = forbidden;
      return;
    }

    await ensureCompaniesTable(config);

    const table = getTableClient(config.companiesTable, config);
    const company = validation.company;
    const now = new Date().toISOString();
    const companyId = `company_${crypto.randomUUID()}`;
    const slug = await uniqueCompanySlug(table, company.name);

    const entity = {
      partitionKey: "company",
      rowKey: companyId,
      id: companyId,
      slug,
      name: company.name,
      email: company.email,
      whatsapp: company.whatsapp,
      phone: company.phone,
      website: company.website,
      instagram: company.instagram,
      facebook: company.facebook,
      tiktok: company.tiktok,
      province: company.province,
      canton: company.canton,
      description: company.description,
      status: "pending",
      plan: "free",
      createdAt: now,
      updatedAt: now,
    };

    await table.createEntity(entity);

    try {
      await notifyCompanyRegistration(context, entity, config);
    } catch (error) {
      context.log.warn(`Company registration notification failed: ${error.message}`);
    }

    context.res = json(201, {
      companyId,
      slug,
      status: "pending",
      plan: "free",
    });
  } catch (error) {
    context.log.error(error);
    context.res = serverError(error);
  }
};
