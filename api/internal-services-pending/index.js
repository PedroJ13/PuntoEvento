const { handlePendingServices } = require("../shared/internalPending");

module.exports = function pendingServices(context, req) {
  return handlePendingServices(context, req);
};
