const { odata } = require("@azure/data-tables");
const {
  ensureCompanyAuthTables,
  ensureServicesTable,
  getConfig,
  getTableClient,
} = require("../shared/azure");
const { getCurrentCompanySession } = require("../shared/companyAuth");
const { enforceAllowedOrigin } = require("../shared/guard");
const { json, serverError } = require("../shared/http");

function parseArray(value) {
  if (Array.isArray(value)) return value.filter(Boolean);
  if (!value) return [];

  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) return [];

    try {
      const parsed = JSON.parse(trimmed);
      if (Array.isArray(parsed)) return parsed.filter(Boolean);
    } catch (_error) {
      // Fall back to comma-separated legacy/demo values.
    }

    return trimmed
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
}

function serviceTimestamp(service) {
  return Date.parse(service.updatedAt || service.createdAt || "") || 0;
}

function publicServicePayload(service, companyId) {
  return {
    id: service.id || service.rowKey || "",
    companyId,
    slug: service.slug || "",
    name: service.name || "",
    category: service.category || "",
    status: service.status || "",
    eventTypes: parseArray(service.eventTypes),
    priceFrom: service.priceFrom || "",
    description: service.description || "",
    coverUrl: service.coverUrl || "",
    gallery: parseArray(service.gallery),
    createdAt: service.createdAt || "",
    updatedAt: service.updatedAt || "",
  };
}

async function listCompanyServices(companyId, config) {
  const table = getTableClient(config.servicesTable, config);
  const entities = table.listEntities({
    queryOptions: {
      filter: odata`PartitionKey eq ${companyId}`,
    },
  });
  const services = [];

  for await (const service of entities) {
    services.push(service);
  }

  return services.sort((a, b) => serviceTimestamp(b) - serviceTimestamp(a));
}

module.exports = async function listCurrentCompanyServices(context, req) {
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
    await ensureServicesTable(config);

    const services = await listCompanyServices(companyId, config);
    context.res = json(
      200,
      services.map((service) => publicServicePayload(service, companyId)),
    );
  } catch (error) {
    context.log.error(error);
    context.res = serverError(error);
  }
};
