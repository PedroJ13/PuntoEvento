const { handleInternalModeration } = require("../shared/internalModeration");

module.exports = function approveService(context, req) {
  return handleInternalModeration(context, req, {
    target: "service",
    action: "approve",
  });
};
