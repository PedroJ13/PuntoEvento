const {
  ensureUploadsTable,
  getConfig,
  getPendingBlobClient,
  getTableClient,
} = require("../shared/azure");
const { requireAdminAuth } = require("../shared/adminAuth");
const { enforceAllowedOrigin } = require("../shared/guard");
const { badRequest, json, serverError } = require("../shared/http");
const { cleanText } = require("../shared/validation");

function safeInlineFileName(value) {
  return cleanText(value, 120).replace(/["\r\n]/g, "") || "preview";
}

async function getUpload(table, companyId, uploadId) {
  try {
    return await table.getEntity(companyId, uploadId);
  } catch (error) {
    if (error.statusCode === 404) return null;
    throw error;
  }
}

module.exports = async function previewInternalUpload(context, req) {
  try {
    if (String(req.method || "").toUpperCase() !== "GET") {
      context.res = json(405, { error: "Method not allowed" });
      return;
    }

    const companyId = cleanText(req.params?.companyId, 160);
    const uploadId = cleanText(req.params?.uploadId, 160);
    if (!companyId || !uploadId) {
      context.res = badRequest("companyId and uploadId are required");
      return;
    }

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

    await ensureUploadsTable(config);
    const uploadsTable = getTableClient(config.uploadsTable, config);
    const upload = await getUpload(uploadsTable, companyId, uploadId);
    if (!upload || upload.status !== "pending") {
      context.res = json(404, { error: "Upload preview not found" });
      return;
    }

    const pendingBlobName = cleanText(upload.pendingBlobName, 600);
    if (!pendingBlobName || !pendingBlobName.startsWith(`companies/${companyId}/`)) {
      context.res = json(409, { error: "Upload preview is not available" });
      return;
    }

    let bytes;
    try {
      bytes = await getPendingBlobClient(pendingBlobName, config).downloadToBuffer();
    } catch (error) {
      if (error.statusCode === 404) {
        context.res = json(404, { error: "Upload preview not found" });
        return;
      }
      throw error;
    }

    context.res = {
      status: 200,
      headers: {
        "Content-Type": upload.contentType || "application/octet-stream",
        "Cache-Control": "no-store",
        "Content-Disposition": `inline; filename="${safeInlineFileName(upload.fileName)}"`,
      },
      body: bytes,
      isRaw: true,
    };
  } catch (error) {
    context.log.error(error);
    context.res = serverError(error);
  }
};
