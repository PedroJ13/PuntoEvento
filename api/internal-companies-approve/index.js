const { handleInternalModeration } = require("../shared/internalModeration");

module.exports = function approveCompany(context, req) {
  return handleInternalModeration(context, req, {
    target: "company",
    action: "approve",
  });
};
