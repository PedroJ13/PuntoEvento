const crypto = require("crypto");
const { ensureTables, getConfig, getTableClient } = require("../shared/azure");
const { badRequest, json, serverError } = require("../shared/http");
const { slugify, validateProviderPayload } = require("../shared/validation");

module.exports = async function registerProvider(context, req) {
  try {
    const validation = validateProviderPayload(req.body || {});
    if (validation.error) {
      context.res = badRequest(validation.error, validation.details);
      return;
    }

    const config = getConfig();
    await ensureTables(config);

    const provider = validation.provider;
    const now = new Date().toISOString();
    const providerId = `${slugify(provider.name)}-${crypto.randomUUID().slice(0, 8)}`;
    const entity = {
      partitionKey: "provider",
      rowKey: providerId,
      name: provider.name,
      email: provider.email,
      phone: provider.phone,
      category: provider.category,
      location: provider.location,
      description: provider.description,
      price: provider.price,
      website: provider.website,
      status: "pending",
      plan: "free",
      createdAt: now,
      updatedAt: now,
    };

    await getTableClient(config.providersTable, config).createEntity(entity);

    context.res = json(201, {
      providerId,
      status: "pending",
      message: "Provider registration received and pending review.",
    });
  } catch (error) {
    context.log.error(error);
    context.res = serverError(error);
  }
};
