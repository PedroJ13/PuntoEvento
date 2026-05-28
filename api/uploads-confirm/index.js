const {
  ensureCompanyAuthTables,
  ensureUploadsTable,
  getConfig,
  getPendingBlobClient,
  getTableClient,
} = require("../shared/azure");
const { getCurrentCompanySession } = require("../shared/companyAuth");
const { enforceAllowedOrigin } = require("../shared/guard");
const { badRequest, json, serverError } = require("../shared/http");
const {
  ALLOWED_CONTENT_TYPES,
  MAX_IMAGE_SIZE_BYTES,
  cleanText,
} = require("../shared/validation");

function pendingUploadPayload(upload) {
  return {
    uploadId: upload.id || upload.rowKey || "",
    status: "pending",
    scope: upload.scope || "",
    serviceId: upload.serviceId || "",
    imageType: upload.imageType || "",
    pendingBlobUrl: upload.pendingBlobUrl || "",
  };
}

async function getUpload(table, companyId, uploadId) {
  try {
    return await table.getEntity(companyId, uploadId);
  } catch (error) {
    if (error.statusCode === 404) return null;
    throw error;
  }
}

async function getUploadedBlobProperties(upload, config) {
  if (!upload.pendingBlobName) {
    return { status: 409, error: "Upload reservation is not confirmable" };
  }

  try {
    const properties = await getPendingBlobClient(upload.pendingBlobName, config).getProperties();
    return { properties };
  } catch (error) {
    if (error.statusCode === 404) {
      return { status: 404, error: "Upload or blob not found" };
    }
    throw error;
  }
}

async function validateUploadedBlob(upload, config, companyId) {
  if (!upload.pendingBlobName || !upload.pendingBlobName.startsWith(`companies/${companyId}/`)) {
    return { status: 409, error: "Upload reservation is not confirmable" };
  }

  const blobResult = await getUploadedBlobProperties(upload, config);
  if (blobResult.error) return blobResult;

  const actualContentType = cleanText(
    blobResult.properties.contentType || blobResult.properties.blobContentType,
    80,
  );
  const actualSize = Number(blobResult.properties.contentLength || 0);

  if (!ALLOWED_CONTENT_TYPES.has(actualContentType)) {
    return { status: 415, error: "Uploaded blob contentType is not allowed" };
  }
  if (actualContentType !== upload.contentType) {
    return { status: 400, error: "Uploaded blob contentType does not match reservation" };
  }
  if (!actualSize) {
    return { status: 400, error: "Uploaded blob size is not allowed" };
  }
  if (actualSize > MAX_IMAGE_SIZE_BYTES) {
    return { status: 413, error: "File too large" };
  }

  return { actualSize };
}

module.exports = async function confirmUpload(context, req) {
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

    const uploadId = cleanText((req.body || {}).uploadId, 160);
    if (!uploadId) {
      context.res = badRequest("uploadId is required");
      return;
    }

    const companyId = session.partitionKey;
    await ensureUploadsTable(config);
    const uploadsTable = getTableClient(config.uploadsTable, config);
    const upload = await getUpload(uploadsTable, companyId, uploadId);

    if (!upload) {
      context.res = json(404, { error: "Upload or blob not found" });
      return;
    }

    if (upload.status === "pending") {
      const validation = await validateUploadedBlob(upload, config, companyId);
      if (validation.error) {
        context.res =
          validation.status === 400
            ? badRequest(validation.error)
            : json(validation.status, { error: validation.error });
        return;
      }
      context.res = json(200, pendingUploadPayload(upload));
      return;
    }

    if (upload.status !== "reserved") {
      context.res = json(409, { error: "Upload is not confirmable" });
      return;
    }

    if (upload.expiresAt && Date.parse(upload.expiresAt) <= Date.now()) {
      context.res = json(409, { error: "Upload reservation expired" });
      return;
    }

    const validation = await validateUploadedBlob(upload, config, companyId);
    if (validation.error) {
      context.res =
        validation.status === 400
          ? badRequest(validation.error)
          : json(validation.status, { error: validation.error });
      return;
    }

    const now = new Date().toISOString();
    const updatedUpload = {
      partitionKey: companyId,
      rowKey: uploadId,
      status: "pending",
      size: validation.actualSize,
      expiresAt: "",
      updatedAt: now,
    };

    await uploadsTable.updateEntity(updatedUpload, "Merge");

    context.res = json(201, pendingUploadPayload({ ...upload, ...updatedUpload }));
  } catch (error) {
    context.log.error(error);
    context.res = serverError(error);
  }
};
