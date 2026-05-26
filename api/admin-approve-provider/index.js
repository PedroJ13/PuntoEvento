const { odata } = require("@azure/data-tables");
const {
  copyPendingBlobToPublic,
  deletePendingBlob,
  ensureTables,
  getConfig,
  getProvider,
  getTableClient,
  markImageSlotOccupied,
  releaseImageSlot,
} = require("../shared/azure");
const { requireAdminAuth } = require("../shared/adminAuth");
const { enforceAllowedOrigin } = require("../shared/guard");
const { badRequest, json, serverError } = require("../shared/http");
const { cleanText, isSafeId } = require("../shared/validation");

async function activeImages(providerId, config) {
  const table = getTableClient(config.providerImagesTable, config);
  const images = [];
  const entities = table.listEntities({
    queryOptions: { filter: odata`PartitionKey eq ${providerId}` },
  });

  for await (const image of entities) {
    if (String(image.rowKey || "").startsWith("slot-")) continue;
    if (image.status === "pending" || image.status === "published") {
      images.push(image);
    }
  }

  return images;
}

module.exports = async function approveProvider(context, req) {
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
    const approvedImageIds = new Set(
      Array.isArray(req.body?.approvedImageIds)
        ? req.body.approvedImageIds.map((id) => cleanText(id, 80))
        : [],
    );
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
    if (provider.status !== "pending") {
      context.res = badRequest("Provider is not pending");
      return;
    }

    const now = new Date().toISOString();
    const imageTable = getTableClient(config.providerImagesTable, config);
    const images = await activeImages(providerId, config);
    const imagesToApprove = images.filter(
      (image) => approvedImageIds.has(image.rowKey) || image.status === "published",
    );
    if (!imagesToApprove.length) {
      context.res = badRequest("At least one image must be approved before publishing");
      return;
    }

    let coverImage = provider.coverImage || "";
    let approvedCount = 0;
    let rejectedCount = 0;

    for (const image of images) {
      if (image.status === "published") {
        if (!coverImage || image.type === "cover") {
          coverImage = image.publicBlobUrl || coverImage;
        }
        await markImageSlotOccupied(image.partitionKey, image.slotNumber, image.rowKey, config);
        approvedCount += 1;
      } else if (approvedImageIds.has(image.rowKey)) {
        const publicBlob = await copyPendingBlobToPublic(image, config);
        if (!coverImage || image.type === "cover") {
          coverImage = publicBlob.publicBlobUrl;
        }
        await imageTable.updateEntity(
          {
            partitionKey: providerId,
            rowKey: image.rowKey,
            publicBlobUrl: publicBlob.publicBlobUrl,
            publicBlobName: publicBlob.publicBlobName,
            status: "published",
            updatedAt: now,
          },
          "Merge",
        );
        await markImageSlotOccupied(providerId, image.slotNumber, image.rowKey, config);
        await deletePendingBlob(image.blobName, config).catch((error) => {
          context.log.warn("Could not delete approved pending blob.", error);
        });
        approvedCount += 1;
      } else {
        await deletePendingBlob(image.blobName, config);
        await imageTable.updateEntity(
          {
            partitionKey: providerId,
            rowKey: image.rowKey,
            status: "rejected",
            updatedAt: now,
          },
          "Merge",
        );
        await releaseImageSlot(providerId, image.slotNumber, config);
        rejectedCount += 1;
      }
    }

    await getTableClient(config.providersTable, config).updateEntity(
      {
        partitionKey: "provider",
        rowKey: providerId,
        status: "published",
        coverImage,
        updatedAt: now,
      },
      "Merge",
    );

    context.res = json(200, {
      providerId,
      status: "published",
      approvedImages: approvedCount,
      rejectedImages: rejectedCount,
    });
  } catch (error) {
    context.log.error(error);
    context.res = serverError(error);
  }
};
