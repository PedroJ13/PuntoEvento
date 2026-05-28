const {
  ensureCompanyAuthTables,
  ensureServicesTable,
  getConfig,
  getTableClient,
} = require("../shared/azure");
const { getCurrentCompanySession } = require("../shared/companyAuth");
const { enforceAllowedOrigin } = require("../shared/guard");
const { badRequest, json, serverError } = require("../shared/http");
const { cleanText } = require("../shared/validation");

async function getService(table, companyId, serviceId) {
  try {
    return await table.getEntity(companyId, serviceId);
  } catch (error) {
    if (error.statusCode === 404) return null;
    throw error;
  }
}

function publicDeletePayload(service, companyId, serviceId, updatedAt) {
  return {
    id: service.id || serviceId,
    companyId,
    status: "inactive",
    updatedAt,
  };
}

module.exports = async function deleteCurrentCompanyService(context, req) {
  try {
    if (String(req.method || "").toUpperCase() !== "DELETE") {
      context.res = json(405, { error: "Method not allowed" });
      return;
    }

    const serviceId = cleanText(req.params?.serviceId, 160);
    if (!serviceId) {
      context.res = badRequest("serviceId is required");
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

    const companyId = session.partitionKey;
    await ensureServicesTable(config);

    const table = getTableClient(config.servicesTable, config);
    const existing = await getService(table, companyId, serviceId);
    if (!existing) {
      context.res = json(404, { error: "Service not found" });
      return;
    }

    const updatedAt = new Date().toISOString();
    await table.updateEntity(
      {
        partitionKey: companyId,
        rowKey: serviceId,
        status: "inactive",
        updatedAt,
      },
      "Merge",
    );

    context.res = json(200, publicDeletePayload(existing, companyId, serviceId, updatedAt));
  } catch (error) {
    context.log.error(error);
    context.res = serverError(error);
  }
};
