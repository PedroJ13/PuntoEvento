const { odata } = require("@azure/data-tables");
const {
  createReadSasUrl,
  ensureTables,
  getConfig,
  getTableClient,
} = require("../shared/azure");
const { requireAdminAuth } = require("../shared/adminAuth");
const { enforceAllowedOrigin } = require("../shared/guard");
const { json, serverError } = require("../shared/http");

async function imagesForProvider(providerId, config) {
  const table = getTableClient(config.providerImagesTable, config);
  const images = [];
  const entities = table.listEntities({
    queryOptions: { filter: odata`PartitionKey eq ${providerId}` },
  });

  for await (const image of entities) {
    if (String(image.rowKey || "").startsWith("slot-")) continue;
    images.push({
      id: image.rowKey,
      type: image.type || "gallery",
      status: image.status || "",
      contentType: image.contentType || "",
      size: image.size || 0,
      originalFileName: image.originalFileName || "",
      pendingBlobUrl: image.pendingBlobUrl || "",
      previewUrl:
        image.status === "pending" && image.blobName
          ? createReadSasUrl({ blobName: image.blobName }, config)
          : image.publicBlobUrl || "",
      slotNumber: image.slotNumber || 0,
      createdAt: image.createdAt || "",
    });
  }

  return images;
}

module.exports = async function pendingProviders(context, req) {
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

    await ensureTables(config);

    const table = getTableClient(config.providersTable, config);
    const providers = [];
    const entities = table.listEntities({
      queryOptions: {
        filter: odata`PartitionKey eq ${"provider"} and status eq ${"pending"}`,
      },
    });

    for await (const provider of entities) {
      providers.push({
        id: provider.rowKey,
        name: provider.name || "",
        email: provider.email || "",
        phone: provider.phone || "",
        category: provider.category || "",
        location: provider.location || "",
        description: provider.description || "",
        price: provider.price || "",
        website: provider.website || "",
        status: provider.status || "",
        createdAt: provider.createdAt || "",
        images: await imagesForProvider(provider.rowKey, config),
      });
    }

    providers.sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)));
    context.res = json(200, providers);
  } catch (error) {
    context.log.error(error);
    context.res = serverError(error);
  }
};
