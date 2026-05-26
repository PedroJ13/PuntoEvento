const { odata } = require("@azure/data-tables");
const {
  deletePendingBlob,
  ensureTables,
  getConfig,
  getProvider,
  getTableClient,
  releaseImageSlot,
} = require("../shared/azure");
const { requireAdminAuth } = require("../shared/adminAuth");
const { enforceAllowedOrigin } = require("../shared/guard");
const { badRequest, json, serverError } = require("../shared/http");
const { cleanText, isSafeId } = require("../shared/validation");

module.exports = async function rejectProvider(context, req) {
  try {
    const config = getConfig();
    const forbidden = enforceAllowedOrigin(req, config);
    if (forbidden) {
      context.res = forbidden;
      return;
    }
    const authError = requireAdminAuth(req, config);
    if (authError) {
      context.res = authError;
      return;
    }

    const providerId = cleanText(req.body?.providerId, 120);
    const reason = cleanText(req.body?.reason, 500);
    if (!providerId || !isSafeId(providerId)) {
      context.res = badRequest("Invalid providerId");
      return;
    }

    await ensureTables(config);

    const provider = await getProvider(providerId, config);
    if (!provider) {
      context.res = badRequest("Provider not found");
      return;
    }

    const now = new Date().toISOString();
    const imageTable = getTableClient(config.providerImagesTable, config);
    const images = imageTable.listEntities({
      queryOptions: { filter: odata`PartitionKey eq ${providerId}` },
    });
    let rejectedImages = 0;

    for await (const image of images) {
      if (String(image.rowKey || "").startsWith("slot-")) continue;
      if (image.status === "pending" || image.status === "reserved") {
        await deletePendingBlob(image.blobName, config);
      }
      await imageTable.updateEntity(
        {
          partitionKey: providerId,
          rowKey: image.rowKey,
          status: "rejected",
          rejectionReason: reason,
          updatedAt: now,
        },
        "Merge",
      );
      await releaseImageSlot(providerId, image.slotNumber, config);
      rejectedImages += 1;
    }

    await getTableClient(config.providersTable, config).updateEntity(
      {
        partitionKey: "provider",
        rowKey: providerId,
        status: "rejected",
        rejectionReason: reason,
        updatedAt: now,
      },
      "Merge",
    );

    context.res = json(200, {
      providerId,
      status: "rejected",
      rejectedImages,
    });
  } catch (error) {
    context.log.error(error);
    context.res = serverError(error);
  }
};
