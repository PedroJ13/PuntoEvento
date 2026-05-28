const { handleInternalModeration } = require("../shared/internalModeration");

module.exports = function rejectService(context, req) {
  return handleInternalModeration(context, req, {
    target: "service",
    action: "reject",
  });
};
