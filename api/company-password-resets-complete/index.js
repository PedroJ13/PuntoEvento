const { getConfig } = require("../shared/azure");
const { enforceAllowedOrigin } = require("../shared/guard");
const { json, serverError } = require("../shared/http");
const { completePasswordReset } = require("../shared/companyPasswordResets");

module.exports = async function completeCompanyPasswordReset(context, req) {
  try {
    if (String(req.method || "").toUpperCase() !== "POST") {
      context.res = json(405, { error: "Method not allowed" });
      return;
    }

    const config = getConfig();
    const forbidden = enforceAllowedOrigin(req, config);
    if (forbidden) {
      context.res = forbidden;
      return;
    }

    const result = await completePasswordReset(req.body || {}, config);
    context.res = result.ok ? json(200, result.body) : json(result.status, result.body);
  } catch (error) {
    context.log.error(error);
    context.res = serverError(error);
  }
};
