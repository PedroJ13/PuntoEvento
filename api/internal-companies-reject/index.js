const { handleInternalModeration } = require("../shared/internalModeration");

module.exports = function rejectCompany(context, req) {
  return handleInternalModeration(context, req, {
    target: "company",
    action: "reject",
  });
};
