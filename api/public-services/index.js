const { handlePublicServices } = require("../shared/publicCatalog");

module.exports = function publicServices(context, req) {
  return handlePublicServices(context, req);
};
