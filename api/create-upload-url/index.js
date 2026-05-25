const crypto = require("crypto");
const {
  countProviderImages,
  createWriteSasUrl,
  ensurePendingContainer,
  ensureTables,
  getConfig,
  getProvider,
} = require("../shared/azure");
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

    const imageCount = await countProviderImages(validation.providerId, config);
    if (imageCount >= MAX_IMAGES_PER_PROVIDER) {
      context.res = badRequest(`Maximum ${MAX_IMAGES_PER_PROVIDER} images per provider`);
      return;
    }

    const imageId = `image-${crypto.randomUUID().slice(0, 12)}`;
    const blobName = `providers/${validation.providerId}/${imageId}.${validation.extension}`;
    const sas = createWriteSasUrl(
      {
        blobName,
        contentType: validation.contentType,
        expiresInMinutes: 10,
      },
      config,
    );

    context.res = json(200, {
      imageId,
      imageType: validation.imageType,
      uploadUrl: sas.uploadUrl,
      pendingBlobUrl: sas.pendingBlobUrl,
      expiresInMinutes: 10,
    });
  } catch (error) {
    context.log.error(error);
    context.res = serverError(error);
  }
};
