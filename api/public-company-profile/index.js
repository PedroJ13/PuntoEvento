const { handlePublicCompanyProfile } = require("../shared/publicCatalog");

module.exports = function publicCompanyProfile(context, req) {
  return handlePublicCompanyProfile(context, req);
};
