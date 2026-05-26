const crypto = require("crypto");
const {
  cleanupExpiredReservations,
  countProviderImages,
  countProviderImagesWithoutSlots,
  createWriteSasUrl,
  ensurePendingContainer,
  ensureTables,
  getConfig,
  getProvider,
  getTableClient,
  releaseImageSlot,
  reserveImageSlot,
} = require("../shared/azure");
const { enforceAllowedOrigin } = require("../shared/guard");
const { badRequest, json, serverError } = require("../shared/http");
const { MAX_IMAGES_PER_PROVIDER, validateUploadPayload } = require("../shared/validation");

module.exports = async function createUploadUrl(context, req) {
  try {
    const validation = validateUploadPayload(req.body || {});
    if (validation.error) {
      context.res = badRequest(validation.error);
      return;
    }

    const config = getConfig();
    const forbidden = enforceAllowedOrigin(req, config);
    if (forbidden) {
      context.res = forbidden;
      return;
    }
    await ensureTables(config);
    await ensurePendingContainer(config);

    const provider = await getProvider(validation.providerId, config);
    if (!provider) {
      context.res = badRequest("Provider not found");
      return;
    }
    if (!["pending", "draft"].includes(provider.status)) {
      context.res = badRequest("Provider is not editable");
      return;
    }

    await cleanupExpiredReservations(validation.providerId, config);
    const imageCount = await countProviderImages(validation.providerId, config);
    if (imageCount >= MAX_IMAGES_PER_PROVIDER) {
      context.res = badRequest(`Maximum ${MAX_IMAGES_PER_PROVIDER} images per provider`);
      return;
    }
    const legacyImagesWithoutSlots = await countProviderImagesWithoutSlots(
      validation.providerId,
      config,
    );

    const now = new Date().toISOString();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString();
    const imageId = `image-${crypto.randomUUID().slice(0, 12)}`;
    const slotNumber = await reserveImageSlot(
      validation.providerId,
      imageId,
      MAX_IMAGES_PER_PROVIDER,
      expiresAt,
      config,
      legacyImagesWithoutSlots + 1,
    );
    if (!slotNumber) {
      context.res = badRequest(`Maximum ${MAX_IMAGES_PER_PROVIDER} images per provider`);
      return;
    }

    const blobName = `providers/${validation.providerId}/${imageId}.${validation.extension}`;
    const sas = createWriteSasUrl(
      {
        blobName,
        contentType: validation.contentType,
        expiresInMinutes: 10,
      },
      config,
    );
    try {
      await getTableClient(config.providerImagesTable, config).createEntity({
        partitionKey: validation.providerId,
        rowKey: imageId,
        type: validation.imageType,
        slotNumber,
        blobName: sas.blobName,
        contentType: validation.contentType,
        size: validation.size || 0,
        originalFileName: validation.fileName,
        pendingBlobUrl: sas.pendingBlobUrl,
        publicBlobUrl: "",
        status: "reserved",
        expiresAt,
        createdAt: now,
        updatedAt: now,
      });
    } catch (error) {
      await releaseImageSlot(validation.providerId, slotNumber, config);
      throw error;
    }

    context.res = json(200, {
      imageId,
      imageType: validation.imageType,
      slotNumber,
      uploadUrl: sas.uploadUrl,
      pendingBlobUrl: sas.pendingBlobUrl,
      expiresInMinutes: 10,
      reservationExpiresInMinutes: 15,
      expiresAt,
    });
  } catch (error) {
    context.log.error(error);
    context.res = serverError(error);
  }
};
