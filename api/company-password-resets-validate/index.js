const { getConfig } = require("../shared/azure");
const { enforceAllowedOrigin } = require("../shared/guard");
const { json, serverError } = require("../shared/http");
const { validatePasswordResetToken } = require("../shared/companyPasswordResets");

module.exports = async function validateCompanyPasswordReset(context, req) {
  try {
    if (String(req.method || "").toUpperCase() !== "GET") {
      context.res = json(405, { error: "Method not allowed" });
      return;
    }

    const config = getConfig();
    const forbidden = enforceAllowedOrigin(req, config);
    if (forbidden) {
      context.res = forbidden;
      return;
    }

    const body = await validatePasswordResetToken(req.query?.token || "", config);
    context.res = json(200, body);
  } catch (error) {
    context.log.error(error);
    context.res = serverError(error);
  }
};
