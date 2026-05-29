const {
  ensureCompanyAuthTables,
  ensureServicesTable,
  getConfig,
  getTableClient,
} = require("../shared/azure");
const { getCurrentCompanySession } = require("../shared/companyAuth");
const { enforceAllowedOrigin } = require("../shared/guard");
const { badRequest, json, serverError } = require("../shared/http");
const { cleanText } = require("../shared/validation");

const REVIEWABLE_STATUSES = new Set(["draft", "rejected"]);

function parseStoredArray(value) {
  if (Array.isArray(value)) return value.filter(Boolean);
  if (!value) return [];

  try {
    const parsed = JSON.parse(String(value));
    if (Array.isArray(parsed)) return parsed.filter(Boolean);
  } catch (_error) {
    // Older/demo values may not be JSON; treat them as missing review data.
  }

  return [];
}

function missingReviewFields(service) {
  const eventTypes = parseStoredArray(service.eventTypes);

  return [
    ["name", cleanText(service.name, 120)],
    ["category", cleanText(service.category, 80)],
    ["eventTypes", eventTypes.length > 0],
    ["description", cleanText(service.description, 1200)],
    ["priceFrom", cleanText(service.priceFrom, 80)],
  ]
    .filter(([_field, value]) => !value)
    .map(([field]) => field);
}

async function getService(table, companyId, serviceId) {
  try {
    return await table.getEntity(companyId, serviceId);
  } catch (error) {
    if (error.statusCode === 404) return null;
    throw error;
  }
}

module.exports = async function submitCurrentCompanyServiceForReview(context, req) {
  try {
    if (String(req.method || "").toUpperCase() !== "POST") {
      context.res = json(405, { error: "Method not allowed" });
      return;
    }

    const serviceId = cleanText(req.params?.serviceId, 160);
    if (!serviceId) {
      context.res = badRequest("serviceId is required");
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

    const table = getTableClient(config.servicesTable, config);
    const existing = await getService(table, companyId, serviceId);
    if (!existing) {
      context.res = json(404, { error: "Service not found" });
      return;
    }

    if (!REVIEWABLE_STATUSES.has(existing.status || "draft")) {
      context.res = json(409, { error: "Service status cannot be submitted for review" });
      return;
    }

    const missing = missingReviewFields(existing);
    if (missing.length) {
      context.res = badRequest("Missing required fields for review", { missing });
      return;
    }

    const updatedAt = new Date().toISOString();
    await table.updateEntity(
      {
        partitionKey: companyId,
        rowKey: serviceId,
        status: "pending",
        updatedAt,
      },
      "Merge",
    );

    context.res = json(200, {
      id: existing.id || serviceId,
      companyId,
      status: "pending",
      updatedAt,
    });
  } catch (error) {
    context.log.error(error);
    context.res = serverError(error);
  }
};
