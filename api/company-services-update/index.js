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

const EDITABLE_FIELDS = new Set([
  "name",
  "category",
  "eventTypes",
  "priceFrom",
  "description",
  "coverUrl",
  "gallery",
]);

function parseStoredArray(value) {
  if (Array.isArray(value)) return value.filter(Boolean);
  if (!value) return [];

  try {
    const parsed = JSON.parse(String(value));
    if (Array.isArray(parsed)) return parsed.filter(Boolean);
  } catch (_error) {
    // Older/demo values may not be JSON; expose an empty array instead of failing PATCH responses.
  }

  return [];
}

function cleanArray(value, maxItems = 20, maxItemLength = 120) {
  if (!Array.isArray(value)) return null;

  return value
    .map((item) => cleanText(item, maxItemLength))
    .filter(Boolean)
    .slice(0, maxItems);
}

function hasOwn(body, field) {
  return Object.prototype.hasOwnProperty.call(body, field);
}

function validateServicePatchPayload(body) {
  const updates = {};
  const hasEditableField = Object.keys(body || {}).some((field) => EDITABLE_FIELDS.has(field));
  if (!hasEditableField) {
    return { error: "No editable fields provided" };
  }

  if (hasOwn(body, "name")) {
    updates.name = cleanText(body.name, 120);
    if (!updates.name) return { error: "name is required" };
  }
  if (hasOwn(body, "category")) {
    updates.category = cleanText(body.category, 80);
    if (!updates.category) return { error: "category is required" };
  }
  if (hasOwn(body, "eventTypes")) {
    updates.eventTypes = cleanArray(body.eventTypes, 20, 80);
    if (!updates.eventTypes) return { error: "eventTypes must be an array" };
  }
  if (hasOwn(body, "priceFrom")) {
    updates.priceFrom = cleanText(body.priceFrom, 80);
  }
  if (hasOwn(body, "description")) {
    updates.description = cleanText(body.description, 1200);
  }
  if (hasOwn(body, "coverUrl")) {
    updates.coverUrl = cleanText(body.coverUrl, 600);
  }
  if (hasOwn(body, "gallery")) {
    updates.gallery = cleanArray(body.gallery, 20, 600);
    if (!updates.gallery) return { error: "gallery must be an array" };
  }

  return { updates };
}

async function getService(table, companyId, serviceId) {
  try {
    return await table.getEntity(companyId, serviceId);
  } catch (error) {
    if (error.statusCode === 404) return null;
    throw error;
  }
}

async function slugExistsOnAnotherService(table, companyId, slug, serviceId) {
  const entities = table.listEntities({
    queryOptions: {
      filter: odata`PartitionKey eq ${companyId} and slug eq ${slug}`,
    },
  });

  for await (const service of entities) {
    if (service.rowKey !== serviceId) return true;
  }
  return false;
}

function publicServicePayload(service, companyId, serviceId) {
  return {
    id: service.id || serviceId,
    companyId,
    slug: service.slug || "",
    name: service.name || "",
    category: service.category || "",
    status: service.status || "draft",
    eventTypes: parseStoredArray(service.eventTypes),
    priceFrom: service.priceFrom || "",
    description: service.description || "",
    coverUrl: service.coverUrl || "",
    gallery: parseStoredArray(service.gallery),
    createdAt: service.createdAt || "",
    updatedAt: service.updatedAt || "",
  };
}

module.exports = async function updateCurrentCompanyService(context, req) {
  try {
    if (String(req.method || "").toUpperCase() !== "PATCH") {
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

    const validation = validateServicePatchPayload(req.body || {});
    if (validation.error) {
      context.res = badRequest(validation.error, validation.details);
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

    const updates = validation.updates;
    const patch = {
      partitionKey: companyId,
      rowKey: serviceId,
      updatedAt: new Date().toISOString(),
    };

    if (hasOwn(updates, "name")) {
      const nextSlug = slugify(updates.name);
      if (nextSlug !== existing.slug && (await slugExistsOnAnotherService(table, companyId, nextSlug, serviceId))) {
        context.res = json(409, { error: "Slug already exists for this company" });
        return;
      }
      patch.name = updates.name;
      patch.slug = nextSlug;
    }
    if (hasOwn(updates, "category")) patch.category = updates.category;
    if (hasOwn(updates, "eventTypes")) patch.eventTypes = JSON.stringify(updates.eventTypes);
    if (hasOwn(updates, "priceFrom")) patch.priceFrom = updates.priceFrom;
    if (hasOwn(updates, "description")) patch.description = updates.description;
    if (hasOwn(updates, "coverUrl")) patch.coverUrl = updates.coverUrl;
    if (hasOwn(updates, "gallery")) patch.gallery = JSON.stringify(updates.gallery);

    await table.updateEntity(patch, "Merge");

    context.res = json(
      200,
      publicServicePayload(
        {
          ...existing,
          ...patch,
        },
        companyId,
        serviceId,
      ),
    );
  } catch (error) {
    context.log.error(error);
    context.res = serverError(error);
  }
};
