const crypto = require("crypto");
const {
  createWriteSasUrl,
  ensureCompanyAuthTables,
  ensurePendingContainer,
  ensureServicesTable,
  ensureUploadsTable,
  getConfig,
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

const ALLOWED_SCOPES = new Set(["company", "service"]);
const ALLOWED_IMAGE_TYPES = new Set(["cover", "gallery", "logo"]);
const EXTENSION_BY_CONTENT_TYPE = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

function extensionFromFileName(fileName) {
  const match = String(fileName || "").toLowerCase().match(/\.(jpe?g|png|webp)$/);
  if (!match) return "";
  return match[1] === "jpeg" ? "jpg" : match[1];
}

function validateSignUploadPayload(body) {
  const payload = {
    scope: cleanText(body.scope, 40),
    serviceId: cleanText(body.serviceId, 160),
    imageType: cleanText(body.imageType || "gallery", 40),
    fileName: cleanText(body.fileName, 240),
    contentType: cleanText(body.contentType, 80),
    size: Number(body.size || 0),
  };

  if (!payload.scope || !ALLOWED_SCOPES.has(payload.scope)) {
    return { status: 400, error: "Invalid scope" };
  }
  if (payload.scope === "service" && !payload.serviceId) {
    return { status: 400, error: "serviceId is required for service uploads" };
  }
  if (!payload.fileName || !payload.contentType) {
    return { status: 400, error: "fileName and contentType are required" };
  }
  if (!ALLOWED_IMAGE_TYPES.has(payload.imageType)) {
    return { status: 400, error: "Invalid imageType" };
  }
  if (!ALLOWED_CONTENT_TYPES.has(payload.contentType)) {
    return { status: 415, error: "Unsupported media type" };
  }
  if (!Number.isFinite(payload.size) || payload.size < 0) {
    return { status: 400, error: "Invalid size" };
  }
  if (payload.size > MAX_IMAGE_SIZE_BYTES) {
    return { status: 413, error: "File too large" };
  }

  const extension = extensionFromFileName(payload.fileName);
  if (!extension) {
    return { status: 415, error: "Unsupported file extension" };
  }
  const expectedExtension = EXTENSION_BY_CONTENT_TYPE[payload.contentType];
  const validJpegPair =
    payload.contentType === "image/jpeg" && ["jpg", "jpeg"].includes(extension);
  if (extension !== expectedExtension && !validJpegPair) {
    return { status: 415, error: "File extension does not match contentType" };
  }

  return { payload: { ...payload, extension } };
}

async function serviceExists(table, companyId, serviceId) {
  try {
    await table.getEntity(companyId, serviceId);
    return true;
  } catch (error) {
    if (error.statusCode === 404) return false;
    throw error;
  }
}

function blobNameForUpload({ companyId, uploadId, scope, serviceId, imageType, extension }) {
  if (scope === "service") {
    return `companies/${companyId}/services/${serviceId}/${imageType}/${uploadId}.${extension}`;
  }
  return `companies/${companyId}/company/${imageType}/${uploadId}.${extension}`;
}

module.exports = async function signUpload(context, req) {
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

    const validation = validateSignUploadPayload(req.body || {});
    if (validation.error) {
      context.res =
        validation.status === 400
          ? badRequest(validation.error)
          : json(validation.status, { error: validation.error });
      return;
    }

    const companyId = session.partitionKey;
    const upload = validation.payload;
    await ensureUploadsTable(config);
    await ensurePendingContainer(config);

    if (upload.scope === "service") {
      await ensureServicesTable(config);
      const exists = await serviceExists(
        getTableClient(config.servicesTable, config),
        companyId,
        upload.serviceId,
      );
      if (!exists) {
        context.res = json(404, { error: "Service not found" });
        return;
      }
    }

    const uploadId = `upload_${crypto.randomUUID()}`;
    const now = new Date().toISOString();
    const expiresInMinutes = 10;
    const expiresAt = new Date(Date.now() + expiresInMinutes * 60 * 1000).toISOString();
    const pendingBlobName = blobNameForUpload({
      companyId,
      uploadId,
      scope: upload.scope,
      serviceId: upload.serviceId,
      imageType: upload.imageType,
      extension: upload.extension,
    });
    const sas = createWriteSasUrl(
      {
        blobName: pendingBlobName,
        contentType: upload.contentType,
        expiresInMinutes,
      },
      config,
    );

    await getTableClient(config.uploadsTable, config).createEntity({
      partitionKey: companyId,
      rowKey: uploadId,
      id: uploadId,
      companyId,
      status: "reserved",
      scope: upload.scope,
      serviceId: upload.scope === "service" ? upload.serviceId : "",
      imageType: upload.imageType,
      fileName: upload.fileName,
      contentType: upload.contentType,
      size: upload.size || 0,
      pendingBlobName,
      pendingBlobUrl: sas.pendingBlobUrl,
      createdAt: now,
      updatedAt: now,
      expiresAt,
    });

    context.res = json(200, {
      uploadId,
      uploadUrl: sas.uploadUrl,
      pendingBlobUrl: sas.pendingBlobUrl,
      expiresInMinutes,
    });
  } catch (error) {
    context.log.error(error);
    context.res = serverError(error);
  }
};
