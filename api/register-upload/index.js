const { ensureTables, getConfig, getProvider, getTableClient } = require("../shared/azure");
const { badRequest, json, serverError } = require("../shared/http");
const { cleanText } = require("../shared/validation");

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

    const config = getConfig();
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
    await getTableClient(config.providerImagesTable, config).upsertEntity(
      {
        partitionKey: providerId,
        rowKey: imageId,
        type: imageType,
        pendingBlobUrl,
        publicBlobUrl: "",
        status: "pending",
        createdAt: now,
        updatedAt: now,
      },
      "Replace",
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
