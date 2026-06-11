const { odata } = require("@azure/data-tables");

function parseStoredArray(value) {
  if (Array.isArray(value)) return value.filter(Boolean);
  if (!value) return [];

  const text = String(value).trim();
  if (!text) return [];

  try {
    const parsed = JSON.parse(text);
    if (Array.isArray(parsed)) return parsed.filter(Boolean);
  } catch (_error) {
    // Demo/legacy values can be comma-separated instead of JSON arrays.
  }

  return text
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function servicePublicImageUrls(service) {
  const urls = new Set(parseStoredArray(service.gallery));
  if (service.coverUrl) urls.add(String(service.coverUrl));
  return urls;
}

async function hasPublishedServiceUpload(service, uploadsTable) {
  const companyId = service.partitionKey || service.companyId || "";
  const serviceId = service.rowKey || service.id || "";
  const publicImageUrls = servicePublicImageUrls(service);

  if (!companyId || !serviceId || !publicImageUrls.size) return false;

  const entities = uploadsTable.listEntities({
    queryOptions: {
      filter: odata`PartitionKey eq ${companyId} and scope eq ${"service"} and serviceId eq ${serviceId} and status eq ${"published"}`,
    },
  });

  for await (const upload of entities) {
    if (
      upload.status === "published" &&
      upload.scope === "service" &&
      upload.serviceId === serviceId &&
      upload.publicBlobUrl &&
      publicImageUrls.has(upload.publicBlobUrl)
    ) {
      return true;
    }
  }

  return false;
}

async function isPubliclyVisibleService(service, uploadsTable) {
  if (!service || service.status !== "published") return false;
  return hasPublishedServiceUpload(service, uploadsTable);
}

async function filterPubliclyVisibleServices(services, uploadsTable) {
  const visible = [];

  for (const service of services) {
    if (await isPubliclyVisibleService(service, uploadsTable)) {
      visible.push(service);
    }
  }

  return visible;
}

module.exports = {
  filterPubliclyVisibleServices,
  hasPublishedServiceUpload,
  isPubliclyVisibleService,
  servicePublicImageUrls,
};
