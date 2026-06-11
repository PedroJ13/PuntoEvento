const { odata } = require("@azure/data-tables");
const { cleanText } = require("./validation");

const MAX_SERVICE_IMAGES = 10;
const COUNTED_SERVICE_UPLOAD_STATUSES = new Set(["reserved", "pending", "published"]);
const REPLACEMENT_BLOCKING_UPLOAD_STATUSES = new Set(["reserved", "pending"]);

function uploadEntityId(upload) {
  return cleanText(upload.rowKey || upload.id, 160);
}

function isCountedServiceUpload(upload, now = Date.now()) {
  if (!upload || upload.scope !== "service") return false;
  if (!COUNTED_SERVICE_UPLOAD_STATUSES.has(upload.status)) return false;
  if (upload.status === "reserved" && upload.expiresAt && Date.parse(upload.expiresAt) <= now) {
    return false;
  }
  return true;
}

function isBlockingCoverReplacement(upload, now = Date.now()) {
  if (!upload || upload.scope !== "service") return false;
  if (upload.imageType !== "cover") return false;
  if (!REPLACEMENT_BLOCKING_UPLOAD_STATUSES.has(upload.status)) return false;
  if (upload.status === "reserved" && upload.expiresAt && Date.parse(upload.expiresAt) <= now) {
    return false;
  }
  return true;
}

async function listCountedServiceUploads(uploadsTable, companyId, serviceId) {
  const entities = uploadsTable.listEntities({
    queryOptions: {
      filter: odata`PartitionKey eq ${companyId} and scope eq ${"service"} and serviceId eq ${serviceId}`,
    },
  });
  const uploads = [];

  for await (const upload of entities) {
    if (isCountedServiceUpload(upload)) uploads.push(upload);
  }

  return uploads;
}

async function validateServiceUploadCapacity(
  uploadsTable,
  companyId,
  serviceId,
  imageType,
  options = {},
) {
  const uploadId = cleanText(options.uploadId, 160);
  const uploads = await listCountedServiceUploads(uploadsTable, companyId, serviceId);
  const otherUploads = uploadId
    ? uploads.filter((upload) => uploadEntityId(upload) !== uploadId)
    : uploads;

  if (otherUploads.length + 1 > MAX_SERVICE_IMAGES) {
    return {
      status: 409,
      error: `Service image limit reached (${MAX_SERVICE_IMAGES})`,
    };
  }

  if (imageType === "cover" && otherUploads.some((upload) => isBlockingCoverReplacement(upload))) {
    return {
      status: 409,
      error: "Service already has a reserved or pending cover image",
    };
  }

  return {};
}

module.exports = {
  MAX_SERVICE_IMAGES,
  validateServiceUploadCapacity,
};
