const crypto = require("crypto");
const { odata } = require("@azure/data-tables");
const {
  ensureCompanyAuthTables,
  ensureServicesTable,
  getConfig,
  getTableClient,
} = require("../shared/azure");
const { getCurrentCompanySession } = require("../shared/companyAuth");
const { enforceAllowedOrigin } = require("../shared/guard");
const { badRequest, json, serverError } = require("../shared/http");
const { cleanText, slugify } = require("../shared/validation");

function cleanArray(value, maxItems = 20, maxItemLength = 120) {
  if (!Array.isArray(value)) return null;

  return value
    .map((item) => cleanText(item, maxItemLength))
    .filter(Boolean)
    .slice(0, maxItems);
}

function validateServicePayload(body) {
  const service = {
    name: cleanText(body.name, 120),
    category: cleanText(body.category, 80),
    eventTypes: cleanArray(body.eventTypes || [], 20, 80),
    priceFrom: cleanText(body.priceFrom, 80),
    description: cleanText(body.description, 1200),
    coverUrl: cleanText(body.coverUrl, 600),
    gallery: cleanArray(body.gallery || [], 20, 600),
  };

  const missing = ["name", "category"].filter((field) => !service[field]);
  if (missing.length) {
    return { error: "Missing required fields", details: { missing } };
  }
  if (!service.eventTypes) {
    return { error: "eventTypes must be an array" };
  }
  if (!service.gallery) {
    return { error: "gallery must be an array" };
  }

  return { service };
}

async function serviceSlugExists(table, companyId, slug) {
  const entities = table.listEntities({
    queryOptions: {
      filter: odata`PartitionKey eq ${companyId} and slug eq ${slug}`,
    },
  });

  for await (const _entity of entities) {
    return true;
  }
  return false;
}

function publicServicePayload(service) {
  return {
    id: service.id,
    companyId: service.companyId,
    slug: service.slug,
    name: service.name,
    category: service.category,
    status: service.status,
    eventTypes: JSON.parse(service.eventTypes || "[]"),
    priceFrom: service.priceFrom || "",
    description: service.description || "",
    coverUrl: service.coverUrl || "",
    gallery: JSON.parse(service.gallery || "[]"),
    createdAt: service.createdAt,
    updatedAt: service.updatedAt,
  };
}

module.exports = async function createCurrentCompanyService(context, req) {
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
    if (!session) {
      context.res = json(401, { error: "Unauthorized" });
      return;
    }

    const companyId = session.partitionKey;
    const validation = validateServicePayload(req.body || {});
    if (validation.error) {
      context.res = badRequest(validation.error, validation.details);
      return;
    }

    const table = getTableClient(config.servicesTable, config);
    const service = validation.service;
    const slug = slugify(service.name);

    await ensureServicesTable(config);

    if (await serviceSlugExists(table, companyId, slug)) {
      context.res = json(409, { error: "Slug already exists for this company" });
      return;
    }

    const now = new Date().toISOString();
    const serviceId = `service_${crypto.randomUUID()}`;
    const entity = {
      partitionKey: companyId,
      rowKey: serviceId,
      id: serviceId,
      companyId,
      slug,
      name: service.name,
      category: service.category,
      status: "draft",
      eventTypes: JSON.stringify(service.eventTypes),
      priceFrom: service.priceFrom,
      description: service.description,
      coverUrl: service.coverUrl,
      gallery: JSON.stringify(service.gallery),
      createdAt: now,
      updatedAt: now,
    };

    await table.createEntity(entity);

    context.res = json(201, publicServicePayload(entity));
  } catch (error) {
    context.log.error(error);
    context.res = serverError(error);
  }
};
