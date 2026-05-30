const { odata } = require("@azure/data-tables");
const {
  ensureCompaniesTable,
  ensureServicesTable,
  ensureUploadsTable,
  getConfig,
  getTableClient,
} = require("./azure");
const { requireAdminAuth } = require("./adminAuth");
const { enforceAllowedOrigin } = require("./guard");
const { json, serverError } = require("./http");
const { cleanText } = require("./validation");

const REVIEWABLE_SERVICE_STATUSES = new Set(["draft", "pending"]);

function internalUploadPreviewUrl(upload) {
  const companyId = cleanText(upload.partitionKey || upload.companyId, 160);
  const uploadId = cleanText(upload.id || upload.rowKey, 160);
  if (!companyId || !uploadId) return "";
  return `/api/internal/uploads/${encodeURIComponent(companyId)}/${encodeURIComponent(uploadId)}/preview`;
}

function parseArray(value) {
  if (Array.isArray(value)) return value.filter(Boolean);
  if (!value) return [];

  const text = String(value).trim();
  if (!text) return [];

  try {
    const parsed = JSON.parse(text);
    if (Array.isArray(parsed)) return parsed.filter(Boolean);
  } catch (_error) {
    // Older/demo values may be comma-separated.
  }

  return text
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function timestamp(entity) {
  return Date.parse(entity.updatedAt || entity.createdAt || "") || 0;
}

async function getCompany(companyId, companiesTable) {
  try {
    return await companiesTable.getEntity("company", companyId);
  } catch (error) {
    if (error.statusCode === 404) return null;
    throw error;
  }
}

function companyPendingPayload(company) {
  return {
    companyId: company.id || company.rowKey || "",
    slug: company.slug || "",
    name: company.name || "",
    email: company.email || "",
    whatsapp: company.whatsapp || "",
    phone: company.phone || "",
    website: company.website || "",
    instagram: company.instagram || "",
    facebook: company.facebook || "",
    tiktok: company.tiktok || "",
    province: company.province || "",
    canton: company.canton || "",
    description: cleanText(company.description, 1200),
    status: company.status || "",
    plan: company.plan || "free",
    createdAt: company.createdAt || "",
    updatedAt: company.updatedAt || "",
  };
}

function servicePendingPayload(service, company = null, uploads = []) {
  return {
    companyId: service.partitionKey || service.companyId || "",
    companyName: company?.name || "",
    companySlug: company?.slug || "",
    serviceId: service.id || service.rowKey || "",
    slug: service.slug || "",
    name: service.name || "",
    category: service.category || "",
    eventTypes: parseArray(service.eventTypes),
    priceFrom: service.priceFrom || "",
    description: cleanText(service.description, 1200),
    status: service.status || "",
    coverUrl: service.coverUrl || "",
    gallery: parseArray(service.gallery),
    images: uploads.map(uploadPendingPayload),
    createdAt: service.createdAt || "",
    updatedAt: service.updatedAt || "",
  };
}

function uploadPendingPayload(upload) {
  return {
    companyId: upload.partitionKey || upload.companyId || "",
    uploadId: upload.id || upload.rowKey || "",
    scope: upload.scope || "",
    serviceId: upload.serviceId || "",
    imageType: upload.imageType || "",
    fileName: upload.fileName || "",
    contentType: upload.contentType || "",
    size: Number(upload.size || 0),
    status: upload.status || "",
    previewUrl: internalUploadPreviewUrl(upload),
    createdAt: upload.createdAt || "",
    updatedAt: upload.updatedAt || "",
  };
}

async function listEntities(table, filter) {
  const entities = table.listEntities({
    queryOptions: { filter },
  });
  const items = [];

  for await (const entity of entities) {
    items.push(entity);
  }

  return items.sort((a, b) => timestamp(b) - timestamp(a));
}

async function listPendingUploadsForService(uploadsTable, companyId, serviceId) {
  const uploads = await listEntities(
    uploadsTable,
    odata`PartitionKey eq ${companyId} and scope eq ${"service"} and serviceId eq ${serviceId} and status eq ${"pending"}`,
  );

  return uploads.filter(
    (upload) =>
      upload.status === "pending" &&
      upload.scope === "service" &&
      upload.serviceId === serviceId,
  );
}

async function requireInternalAccess(context, req, config) {
  const forbidden = enforceAllowedOrigin(req, config);
  if (forbidden) {
    context.res = forbidden;
    return false;
  }

  const authError = requireAdminAuth(req, config);
  if (authError) {
    context.res = authError;
    return false;
  }

  return true;
}

async function handlePendingCompanies(context, req) {
  try {
    if (String(req.method || "").toUpperCase() !== "GET") {
      context.res = json(405, { error: "Method not allowed" });
      return;
    }

    const config = getConfig();
    if (!(await requireInternalAccess(context, req, config))) return;

    await ensureCompaniesTable(config);
    const companiesTable = getTableClient(config.companiesTable, config);
    const companies = await listEntities(
      companiesTable,
      odata`PartitionKey eq ${"company"} and status eq ${"pending"}`,
    );

    context.res = json(200, {
      items: companies
        .filter((company) => company.partitionKey === "company" && company.status === "pending")
        .map(companyPendingPayload),
    });
  } catch (error) {
    context.log.error(error);
    context.res = serverError(error);
  }
}

async function handlePendingServices(context, req) {
  try {
    if (String(req.method || "").toUpperCase() !== "GET") {
      context.res = json(405, { error: "Method not allowed" });
      return;
    }

    const config = getConfig();
    if (!(await requireInternalAccess(context, req, config))) return;

    await ensureCompaniesTable(config);
    await ensureServicesTable(config);
    await ensureUploadsTable(config);

    const servicesTable = getTableClient(config.servicesTable, config);
    const companiesTable = getTableClient(config.companiesTable, config);
    const uploadsTable = getTableClient(config.uploadsTable, config);
    const services = await listEntities(
      servicesTable,
      odata`status eq ${"draft"} or status eq ${"pending"}`,
    );
    const companyCache = new Map();
    const items = [];

    for (const service of services) {
      if (!REVIEWABLE_SERVICE_STATUSES.has(service.status)) continue;

      const companyId = service.partitionKey || service.companyId || "";
      if (!companyCache.has(companyId)) {
        companyCache.set(companyId, await getCompany(companyId, companiesTable));
      }
      const uploads = await listPendingUploadsForService(
        uploadsTable,
        companyId,
        service.id || service.rowKey || "",
      );
      items.push(servicePendingPayload(service, companyCache.get(companyId), uploads));
    }

    context.res = json(200, { items });
  } catch (error) {
    context.log.error(error);
    context.res = serverError(error);
  }
}

async function handlePendingUploads(context, req) {
  try {
    if (String(req.method || "").toUpperCase() !== "GET") {
      context.res = json(405, { error: "Method not allowed" });
      return;
    }

    const config = getConfig();
    if (!(await requireInternalAccess(context, req, config))) return;

    await ensureUploadsTable(config);
    const uploadsTable = getTableClient(config.uploadsTable, config);
    const uploads = await listEntities(uploadsTable, odata`status eq ${"pending"}`);

    context.res = json(200, {
      items: uploads
        .filter((upload) => upload.status === "pending")
        .map(uploadPendingPayload),
    });
  } catch (error) {
    context.log.error(error);
    context.res = serverError(error);
  }
}

module.exports = {
  handlePendingCompanies,
  handlePendingServices,
  handlePendingUploads,
};
