const { handleInternalModeration } = require("../shared/internalModeration");

module.exports = function approveUpload(context, req) {
  return handleInternalModeration(context, req, {
    target: "upload",
    action: "approve",
  });
};
