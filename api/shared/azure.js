const {
  BlobSASPermissions,
  BlobServiceClient,
  SASProtocol,
  StorageSharedKeyCredential,
  generateBlobSASQueryParameters,
} = require("@azure/storage-blob");
const { TableClient, odata } = require("@azure/data-tables");
const { getConfig } = require("./config");

function parseConnectionString(connectionString) {
  return Object.fromEntries(
    connectionString
      .split(";")
      .filter(Boolean)
      .map((part) => {
        const index = part.indexOf("=");
        return [part.slice(0, index), part.slice(index + 1)];
      }),
  );
}

function getStorageCredential(config = getConfig()) {
  const parsed = parseConnectionString(config.storageConnectionString);
  const accountName = config.storageAccountName || parsed.AccountName;
  const accountKey = parsed.AccountKey;
  if (!accountName || !accountKey) {
    throw new Error("Storage connection string must include AccountName and AccountKey");
  }
  return new StorageSharedKeyCredential(accountName, accountKey);
}

function getBlobServiceClient(config = getConfig()) {
  return BlobServiceClient.fromConnectionString(config.storageConnectionString);
}

function getTableClient(tableName, config = getConfig()) {
  return TableClient.fromConnectionString(config.tableConnectionString, tableName);
}

async function ensureTables(config = getConfig()) {
  await getTableClient(config.providersTable, config).createTable().catch((error) => {
    if (error.statusCode !== 409) throw error;
  });
  await getTableClient(config.providerImagesTable, config).createTable().catch((error) => {
    if (error.statusCode !== 409) throw error;
  });
}

async function ensurePendingContainer(config = getConfig()) {
  await getBlobServiceClient(config)
    .getContainerClient(config.pendingContainer)
    .createIfNotExists();
}

async function getProvider(providerId, config = getConfig()) {
  try {
    return await getTableClient(config.providersTable, config).getEntity("provider", providerId);
  } catch (error) {
    if (error.statusCode === 404) return null;
    throw error;
  }
}

async function countProviderImages(providerId, config = getConfig()) {
  const table = getTableClient(config.providerImagesTable, config);
  const entities = table.listEntities({
    queryOptions: { filter: odata`PartitionKey eq ${providerId}` },
  });
  let count = 0;
  for await (const _entity of entities) count += 1;
  return count;
}

function createWriteSasUrl({ blobName, contentType, expiresInMinutes = 10 }, config = getConfig()) {
  const credential = getStorageCredential(config);
  const startsOn = new Date(Date.now() - 60 * 1000);
  const expiresOn = new Date(Date.now() + expiresInMinutes * 60 * 1000);
  const sas = generateBlobSASQueryParameters(
    {
      containerName: config.pendingContainer,
      blobName,
      permissions: BlobSASPermissions.parse("cw"),
      protocol: SASProtocol.Https,
      startsOn,
      expiresOn,
      contentType,
    },
    credential,
  ).toString();

  const containerClient = getBlobServiceClient(config).getContainerClient(config.pendingContainer);
  const blobClient = containerClient.getBlockBlobClient(blobName);
  return {
    pendingBlobUrl: blobClient.url,
    uploadUrl: `${blobClient.url}?${sas}`,
  };
}

module.exports = {
  countProviderImages,
  createWriteSasUrl,
  ensurePendingContainer,
  ensureTables,
  getConfig,
  getProvider,
  getTableClient,
};
