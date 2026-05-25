const { odata } = require("@azure/data-tables");
const { ensureTables, getConfig, getTableClient } = require("../shared/azure");
const { json, serverError } = require("../shared/http");

async function publicImagesForProvider(providerId, config) {
  const table = getTableClient(config.providerImagesTable, config);
  const images = [];
  const entities = table.listEntities({
    queryOptions: {
      filter: odata`PartitionKey eq ${providerId} and status eq ${"published"}`,
    },
  });

  for await (const image of entities) {
    if (!image.publicBlobUrl) continue;
    images.push({
      id: image.rowKey,
      type: image.type || "gallery",
      url: image.publicBlobUrl,
    });
  }

  return images;
}

module.exports = async function providers(context) {
  try {
    const config = getConfig();
    await ensureTables(config);

    const table = getTableClient(config.providersTable, config);
    const publishedProviders = [];
    const entities = table.listEntities({
      queryOptions: {
        filter: odata`PartitionKey eq ${"provider"} and status eq ${"published"}`,
      },
    });

    for await (const provider of entities) {
      const images = await publicImagesForProvider(provider.rowKey, config);
      const coverImage =
        images.find((image) => image.type === "cover")?.url ||
        provider.coverImage ||
        "";
      const gallery = images
        .filter((image) => image.type === "gallery")
        .map((image) => ({
          src: image.url,
          alt: provider.name,
        }));

      publishedProviders.push({
        id: provider.rowKey,
        name: provider.name,
        category: provider.category,
        location: provider.location,
        description: provider.description,
        price: provider.price,
        rating: provider.rating || "",
        reviews: provider.reviews || 0,
        tags: provider.tags ? String(provider.tags).split(",").map((tag) => tag.trim()) : [],
        coverImage,
        gallery,
        whatsapp: provider.phone || provider.whatsapp || "",
        status: "published",
      });
    }

    context.res = json(200, publishedProviders);
  } catch (error) {
    context.log.error(error);
    context.res = serverError(error);
  }
};
