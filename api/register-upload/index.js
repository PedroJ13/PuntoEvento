const {
  ensureTables,
  getConfig,
  getPendingBlobClient,
  getProvider,
  getTableClient,
  markImageSlotOccupied,
} = require("../shared/azure");
const { enforceAllowedOrigin } = require("../shared/guard");
const { badRequest, json, serverError } = require("../shared/http");
const {
  ALLOWED_CONTENT_TYPES,
  MAX_IMAGE_SIZE_BYTES,
  cleanText,
  isSafeId,
} = require("../shared/validation");

module.exports = async function registerUpload(context, req) {
  try {
    const body = req.body || {};
    const providerId = cleanText(body.providerId, 120);
    const imageId = cleanText(body.imageId, 80);
    const imageType = cleanText(body.imageType || "gallery", 40);
    const pendingBlobUrl = cleanText(body.pendingBlobUrl, 600);

    if (!providerId || !imageId || !pendingBlobUrl) {
      context.res = badRequest("providerId, imageId and pendingBlobUrl are required");
      return;
    }
    if (!isSafeId(providerId) || !/^image-[a-z0-9-]{1,40}$/i.test(imageId)) {
      context.res = badRequest("Invalid providerId or imageId");
      return;
    }

    const config = getConfig();
    const forbidden = enforceAllowedOrigin(req, config);
    if (forbidden) {
      context.res = forbidden;
      return;
    }
    await ensureTables(config);

    const provider = await getProvider(providerId, config);
    if (!provider) {
      context.res = badRequest("Provider not found");
      return;
    }
    if (!["pending", "draft"].includes(provider.status)) {
      context.res = badRequest("Provider is not editable");
      return;
    }

    const now = new Date().toISOString();
    const imageTable = getTableClient(config.providerImagesTable, config);
    let reservedImage;
    try {
      reservedImage = await imageTable.getEntity(providerId, imageId);
    } catch (error) {
      if (error.statusCode === 404) {
        context.res = badRequest("Upload reservation not found");
        return;
      }
      throw error;
    }

    if (reservedImage.status !== "reserved") {
      context.res = badRequest("Upload is not in a registerable state");
      return;
    }
    if (reservedImage.expiresAt && Date.parse(reservedImage.expiresAt) <= Date.now()) {
      context.res = badRequest("Upload reservation expired");
      return;
    }
    if (reservedImage.pendingBlobUrl !== pendingBlobUrl) {
      context.res = badRequest("pendingBlobUrl does not match upload reservation");
      return;
    }
    if (reservedImage.type !== imageType) {
      context.res = badRequest("imageType does not match upload reservation");
      return;
    }
    if (!reservedImage.blobName || !reservedImage.blobName.startsWith(`providers/${providerId}/`)) {
      context.res = badRequest("Invalid upload reservation");
      return;
    }

    let blobProperties;
    try {
      blobProperties = await getPendingBlobClient(reservedImage.blobName, config).getProperties();
    } catch (error) {
      if (error.statusCode === 404) {
        context.res = badRequest("Uploaded blob not found");
        return;
      }
      throw error;
    }

    const actualContentType = cleanText(
      blobProperties.contentType || blobProperties.blobContentType,
      80,
    );
    const actualSize = Number(blobProperties.contentLength || 0);

    if (!ALLOWED_CONTENT_TYPES.has(actualContentType)) {
      context.res = badRequest("Uploaded blob contentType is not allowed");
      return;
    }
    if (actualContentType !== reservedImage.contentType) {
      context.res = badRequest("Uploaded blob contentType does not match reservation");
      return;
    }
    if (!actualSize || actualSize > MAX_IMAGE_SIZE_BYTES) {
      context.res = badRequest("Uploaded blob size is not allowed");
      return;
    }

    await imageTable.updateEntity(
      {
        partitionKey: providerId,
        rowKey: imageId,
        type: imageType,
        slotNumber: reservedImage.slotNumber || 0,
        blobName: reservedImage.blobName,
        contentType: reservedImage.contentType || "",
        size: actualSize,
        originalFileName: reservedImage.originalFileName || "",
        pendingBlobUrl,
        publicBlobUrl: reservedImage.publicBlobUrl || "",
        status: "pending",
        expiresAt: "",
        createdAt: reservedImage.createdAt || now,
        updatedAt: now,
      },
      "Replace",
    );
    await markImageSlotOccupied(
      providerId,
      reservedImage.slotNumber,
      imageId,
      config,
    );

    context.res = json(201, {
      imageId,
      status: "pending",
    });
  } catch (error) {
    context.log.error(error);
    context.res = serverError(error);
  }
};
