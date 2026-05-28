const { handleInternalModeration } = require("../shared/internalModeration");

module.exports = function rejectUpload(context, req) {
  return handleInternalModeration(context, req, {
    target: "upload",
    action: "reject",
  });
};
