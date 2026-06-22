const { getConfig } = require("../shared/azure");
const { enforceAllowedOrigin } = require("../shared/guard");
const { json, serverError } = require("../shared/http");
const { requestPublicPasswordReset } = require("../shared/companyPasswordResets");

module.exports = async function requestCompanyPasswordReset(context, req) {
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

    const body = await requestPublicPasswordReset(req.body?.email, context, config);
    context.res = json(200, body);
  } catch (error) {
    context.log.error(error);
    context.res = serverError(error);
  }
};
