const { handlePendingUploads } = require("../shared/internalPending");

module.exports = function pendingUploads(context, req) {
  return handlePendingUploads(context, req);
};
