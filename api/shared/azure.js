const {
  BlobSASPermissions,
  BlobServiceClient,
  SASProtocol,
  StorageSharedKeyCredential,
  generateBlobSASQueryParameters,
} = require("@azure/storage-blob");
const { TableClient, odata } = require("@azure/data-tables");
const { getConfig } = require("./config");

const INACTIVE_IMAGE_STATUSES = new Set(["deleted", "rejected", "archived"]);

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

async function ensureCompaniesTable(config = getConfig()) {
  await getTableClient(config.companiesTable, config).createTable().catch((error) => {
    if (error.statusCode !== 409) throw error;
  });
}

async function ensureCompanyAuthTables(config = getConfig()) {
  await getTableClient(config.companyInvitesTable, config).createTable().catch((error) => {
    if (error.statusCode !== 409) throw error;
  });
  await getTableClient(config.companySessionsTable, config).createTable().catch((error) => {
    if (error.statusCode !== 409) throw error;
  });
  await getTableClient(config.usersTable, config).createTable().catch((error) => {
    if (error.statusCode !== 409) throw error;
  });
}

async function ensureCompanyPasswordResetsTable(config = getConfig()) {
  await getTableClient(config.companyPasswordResetsTable, config).createTable().catch((error) => {
    if (error.statusCode !== 409) throw error;
  });
}

async function ensureServicesTable(config = getConfig()) {
  await getTableClient(config.servicesTable, config).createTable().catch((error) => {
    if (error.statusCode !== 409) throw error;
  });
}

async function ensureUploadsTable(config = getConfig()) {
  await getTableClient(config.uploadsTable, config).createTable().catch((error) => {
    if (error.statusCode !== 409) throw error;
  });
}

async function ensureLeadsTable(config = getConfig()) {
  await getTableClient(config.leadsTable, config).createTable().catch((error) => {
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
  const now = Date.now();
  let count = 0;
  for await (const entity of entities) {
    if (String(entity.rowKey || "").startsWith("slot-")) continue;
    if (INACTIVE_IMAGE_STATUSES.has(entity.status)) continue;
    if (entity.status === "reserved" && entity.expiresAt && Date.parse(entity.expiresAt) <= now) {
      continue;
    }
    count += 1;
  }
  return count;
}

async function countProviderImagesWithoutSlots(providerId, config = getConfig()) {
  const table = getTableClient(config.providerImagesTable, config);
  const entities = table.listEntities({
    queryOptions: { filter: odata`PartitionKey eq ${providerId}` },
  });
  const now = Date.now();
  let count = 0;

  for await (const entity of entities) {
    if (String(entity.rowKey || "").startsWith("slot-")) continue;
    if (entity.slotNumber) continue;
    if (INACTIVE_IMAGE_STATUSES.has(entity.status)) continue;
    if (entity.status === "reserved" && entity.expiresAt && Date.parse(entity.expiresAt) <= now) {
      continue;
    }
    count += 1;
  }

  return count;
}

async function reserveImageSlot(
  providerId,
  imageId,
  maxSlots,
  expiresAt,
  config = getConfig(),
  startSlot = 1,
) {
  const table = getTableClient(config.providerImagesTable, config);
  const now = new Date().toISOString();

  for (let slotNumber = Math.max(1, startSlot); slotNumber <= maxSlots; slotNumber += 1) {
    try {
      await table.createEntity({
        partitionKey: providerId,
        rowKey: `slot-${slotNumber}`,
        imageId,
        status: "slot-reserved",
        expiresAt,
        createdAt: now,
        updatedAt: now,
      });
      return slotNumber;
    } catch (error) {
      if (error.statusCode !== 409) throw error;
    }
  }

  return null;
}

async function releaseImageSlot(providerId, slotNumber, config = getConfig()) {
  if (!slotNumber) return;

  await getTableClient(config.providerImagesTable, config)
    .deleteEntity(providerId, `slot-${slotNumber}`)
    .catch((error) => {
      if (error.statusCode !== 404) throw error;
    });
}

async function markImageSlotOccupied(providerId, slotNumber, imageId, config = getConfig()) {
  if (!slotNumber) return;

  const now = new Date().toISOString();
  await getTableClient(config.providerImagesTable, config).updateEntity(
    {
      partitionKey: providerId,
      rowKey: `slot-${slotNumber}`,
      imageId,
      status: "slot-occupied",
      expiresAt: "",
      updatedAt: now,
    },
    "Merge",
  );
}

function isActiveImageEntity(entity) {
  if (!entity || String(entity.rowKey || "").startsWith("slot-")) return false;
  if (INACTIVE_IMAGE_STATUSES.has(entity.status)) return false;
  if (entity.status === "reserved" && entity.expiresAt && Date.parse(entity.expiresAt) <= Date.now()) {
    return false;
  }
  return true;
}

async function hasActiveImageForSlot(providerId, slotNumber, imageId, config = getConfig()) {
  if (!slotNumber) return false;

  const table = getTableClient(config.providerImagesTable, config);
  if (imageId) {
    try {
      const entity = await table.getEntity(providerId, imageId);
      return Number(entity.slotNumber || 0) === Number(slotNumber) && isActiveImageEntity(entity);
    } catch (error) {
      if (error.statusCode !== 404) throw error;
    }
  }

  const entities = table.listEntities({
    queryOptions: { filter: odata`PartitionKey eq ${providerId}` },
  });
  for await (const entity of entities) {
    if (Number(entity.slotNumber || 0) === Number(slotNumber) && isActiveImageEntity(entity)) {
      return true;
    }
  }

  return false;
}

async function cleanupExpiredReservations(providerId, config = getConfig()) {
  const table = getTableClient(config.providerImagesTable, config);
  const container = getBlobServiceClient(config).getContainerClient(config.pendingContainer);
  const entities = table.listEntities({
    queryOptions: {
      filter: providerId
        ? odata`PartitionKey eq ${providerId} and status eq ${"reserved"}`
        : odata`status eq ${"reserved"}`,
    },
  });
  const now = Date.now();

  for await (const entity of entities) {
    if (entity.expiresAt && Date.parse(entity.expiresAt) <= now) {
      if (entity.blobName) {
        await container.deleteBlob(entity.blobName).catch((error) => {
          if (error.statusCode !== 404) throw error;
        });
      }
      await table.deleteEntity(entity.partitionKey, entity.rowKey).catch((error) => {
        if (error.statusCode !== 404) throw error;
      });
      if (entity.slotNumber) {
        const hasActiveImage = await hasActiveImageForSlot(
          entity.partitionKey,
          entity.slotNumber,
          entity.rowKey,
          config,
        );
        if (!hasActiveImage) {
          await releaseImageSlot(entity.partitionKey, entity.slotNumber, config);
        }
      }
    }
  }

  const expiredSlots = table.listEntities({
    queryOptions: {
      filter: providerId
        ? odata`PartitionKey eq ${providerId} and status eq ${"slot-reserved"}`
        : odata`status eq ${"slot-reserved"}`,
    },
  });

  for await (const slot of expiredSlots) {
    if (!slot.expiresAt || Date.parse(slot.expiresAt) > now) continue;
    const slotNumber = Number(String(slot.rowKey || "").replace("slot-", ""));
    const hasActiveImage = await hasActiveImageForSlot(
      slot.partitionKey,
      slotNumber,
      slot.imageId,
      config,
    );
    if (!hasActiveImage) {
      await releaseImageSlot(slot.partitionKey, slotNumber, config);
    }
  }
}

function getPendingBlobClient(blobName, config = getConfig()) {
  return getBlobServiceClient(config)
    .getContainerClient(config.pendingContainer)
    .getBlockBlobClient(blobName);
}

function getPublicBlobClient(blobName, config = getConfig()) {
  return getBlobServiceClient(config)
    .getContainerClient(config.publicContainer)
    .getBlockBlobClient(blobName);
}

async function ensurePublicContainer(config = getConfig()) {
  await getBlobServiceClient(config)
    .getContainerClient(config.publicContainer)
    .createIfNotExists();
}

function extensionFromBlobName(blobName, contentType) {
  const extension = String(blobName || "").toLowerCase().match(/\.([a-z0-9]+)$/)?.[1];
  if (["jpg", "jpeg", "png", "webp"].includes(extension)) {
    return extension === "jpeg" ? "jpg" : extension;
  }
  if (contentType === "image/png") return "png";
  if (contentType === "image/webp") return "webp";
  return "jpg";
}

async function copyPendingBlobToPublic(image, config = getConfig()) {
  await ensurePublicContainer(config);

  const extension = extensionFromBlobName(image.blobName, image.contentType);
  const publicBlobName = `providers/${image.partitionKey}/${image.rowKey}.${extension}`;
  const sourceBlob = getPendingBlobClient(image.blobName, config);
  const destinationBlob = getPublicBlobClient(publicBlobName, config);
  const download = await sourceBlob.downloadToBuffer();
  await destinationBlob.uploadData(download, {
    blobHTTPHeaders: {
      blobContentType: image.contentType || "image/jpeg",
    },
  });

  return {
    publicBlobName,
    publicBlobUrl: destinationBlob.url,
  };
}

async function deletePendingBlob(blobName, config = getConfig()) {
  if (!blobName) return;
  await getPendingBlobClient(blobName, config).deleteIfExists();
}

function createReadSasUrl({ blobName, expiresInMinutes = 30 }, config = getConfig()) {
  const credential = getStorageCredential(config);
  const startsOn = new Date(Date.now() - 60 * 1000);
  const expiresOn = new Date(Date.now() + expiresInMinutes * 60 * 1000);
  const sas = generateBlobSASQueryParameters(
    {
      containerName: config.pendingContainer,
      blobName,
      permissions: BlobSASPermissions.parse("r"),
      protocol: SASProtocol.Https,
      startsOn,
      expiresOn,
    },
    credential,
  ).toString();

  const blobClient = getPendingBlobClient(blobName, config);
  return `${blobClient.url}?${sas}`;
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
    blobName,
    pendingBlobUrl: blobClient.url,
    uploadUrl: `${blobClient.url}?${sas}`,
  };
}

module.exports = {
  countProviderImages,
  countProviderImagesWithoutSlots,
  cleanupExpiredReservations,
  copyPendingBlobToPublic,
  createReadSasUrl,
  createWriteSasUrl,
  ensureCompanyAuthTables,
  ensureCompanyPasswordResetsTable,
  ensureCompaniesTable,
  ensureLeadsTable,
  ensureServicesTable,
  ensureUploadsTable,
  deletePendingBlob,
  ensurePendingContainer,
  ensurePublicContainer,
  ensureTables,
  getConfig,
  getPendingBlobClient,
  getPublicBlobClient,
  getProvider,
  getTableClient,
  markImageSlotOccupied,
  releaseImageSlot,
  reserveImageSlot,
};
