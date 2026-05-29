const { handlePendingCompanies } = require("../shared/internalPending");

module.exports = function pendingCompanies(context, req) {
  return handlePendingCompanies(context, req);
};
