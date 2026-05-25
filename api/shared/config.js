const DEFAULT_PENDING_CONTAINER = "uploads-pending";
const DEFAULT_PUBLIC_CONTAINER = "public";
const DEFAULT_PROVIDERS_TABLE = "Providers";
const DEFAULT_PROVIDER_IMAGES_TABLE = "ProviderImages";

function getConfig() {
  const storageConnectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
  const tableConnectionString =
    process.env.AZURE_TABLE_CONNECTION_STRING || storageConnectionString;

  if (!storageConnectionString) {
    throw new Error("Missing AZURE_STORAGE_CONNECTION_STRING");
  }
  if (!tableConnectionString) {
    throw new Error("Missing AZURE_TABLE_CONNECTION_STRING");
  }

  return {
    storageConnectionString,
    tableConnectionString,
    storageAccountName: process.env.AZURE_STORAGE_ACCOUNT_NAME,
    pendingContainer:
      process.env.AZURE_STORAGE_PENDING_CONTAINER || DEFAULT_PENDING_CONTAINER,
    publicContainer:
      process.env.AZURE_STORAGE_PUBLIC_CONTAINER || DEFAULT_PUBLIC_CONTAINER,
    providersTable:
      process.env.AZURE_TABLE_PROVIDERS || DEFAULT_PROVIDERS_TABLE,
    providerImagesTable:
      process.env.AZURE_TABLE_PROVIDER_IMAGES || DEFAULT_PROVIDER_IMAGES_TABLE,
  };
}

module.exports = { getConfig };
