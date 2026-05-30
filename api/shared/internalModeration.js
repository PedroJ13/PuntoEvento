const { odata } = require("@azure/data-tables");
const {
  deletePendingBlob,
  ensureCompaniesTable,
  ensurePublicContainer,
  ensureServicesTable,
  ensureUploadsTable,
  getConfig,
  getPendingBlobClient,
  getPublicBlobClient,
  getTableClient,
} = require("./azure");
const { requireAdminAuth } = require("./adminAuth");
const { enforceAllowedOrigin } = require("./guard");
const { badRequest, json, serverError } = require("./http");
const { validateServiceUploadCapacity } = require("./serviceUploadRules");
const { cleanText } = require("./validation");

const SERVICE_UPLOAD_IMAGE_TYPES = new Set(["cover", "gallery"]);
const MAX_SERVICE_IMAGES = 10;

function notFound(message = "Not found") {
  return json(404, { error: message });
}

function conflict(message = "Invalid state") {
  return json(409, { error: message });
}

function success(status, extra = {}) {
  return json(200, {
    ok: true,
    status,
    ...extra,
  });
}

function parseStoredArray(value) {
  if (Array.isArray(value)) return value.filter(Boolean);
  if (!value) return [];

  try {
    const parsed = JSON.parse(String(value));
    if (Array.isArray(parsed)) return parsed.filter(Boolean);
  } catch (_error) {
    // Older/demo values may not be JSON.
  }

  return [];
}

async function listPendingServiceUploads(uploadsTable, companyId, serviceId) {
  const entities = uploadsTable.listEntities({
    queryOptions: {
      filter: odata`PartitionKey eq ${companyId} and scope eq ${"service"} and serviceId eq ${serviceId} and status eq ${"pending"}`,
    },
  });
  const uploads = [];

  for await (const upload of entities) {
    if (
      upload.status === "pending" &&
      upload.scope === "service" &&
      upload.serviceId === serviceId
    ) {
      uploads.push(upload);
    }
  }

  return uploads.sort((a, b) => {
    const left = Date.parse(a.createdAt || a.updatedAt || "") || 0;
    const right = Date.parse(b.createdAt || b.updatedAt || "") || 0;
    return left - right;
  });
}

function validateServiceImageApproval(service, uploads) {
  const coverUploads = uploads.filter((upload) => upload.imageType === "cover");
  const galleryUploads = uploads.filter((upload) => upload.imageType === "gallery");
  const invalidUpload = uploads.find((upload) => !SERVICE_UPLOAD_IMAGE_TYPES.has(upload.imageType));
  if (invalidUpload) {
    return { error: conflict("Service upload imageType is invalid") };
  }
  if (coverUploads.length > 1) {
    return { error: conflict("Service cannot publish more than one cover image") };
  }

  const existingGallery = parseStoredArray(service.gallery);
  const hasCover = Boolean(coverUploads.length || cleanText(service.coverUrl, 600));
  const nextImageCount = (hasCover ? 1 : 0) + existingGallery.length + galleryUploads.length;
  if (nextImageCount > MAX_SERVICE_IMAGES) {
    return { error: conflict(`Service image limit reached (${MAX_SERVICE_IMAGES})`) };
  }
  if (nextImageCount > 0 && !hasCover) {
    return { error: conflict("Service images require one cover image") };
  }

  return {};
}

async function getEntity(table, partitionKey, rowKey) {
  try {
    return await table.getEntity(partitionKey, rowKey);
  } catch (error) {
    if (error.statusCode === 404) return null;
    throw error;
  }
}

function publicBlobNameForUpload(upload, companyId) {
  const pendingBlobName = cleanText(upload.pendingBlobName, 600);
  if (!pendingBlobName || !pendingBlobName.startsWith(`companies/${companyId}/`)) {
    return "";
  }
  return pendingBlobName;
}

async function publishUploadBlob(upload, companyId, config) {
  const publicBlobName = publicBlobNameForUpload(upload, companyId);
  if (!publicBlobName) {
    return { error: conflict("Invalid state") };
  }

  try {
    await ensurePublicContainer(config);
    const sourceBlob = getPendingBlobClient(upload.pendingBlobName, config);
    const destinationBlob = getPublicBlobClient(publicBlobName, config);
    const bytes = await sourceBlob.downloadToBuffer();
    await destinationBlob.uploadData(bytes, {
      blobHTTPHeaders: {
        blobContentType: upload.contentType || "image/jpeg",
      },
    });

    return {
      publicBlobName,
      publicBlobUrl: destinationBlob.url,
    };
  } catch (error) {
    if (error.statusCode === 404) {
      return { error: notFound("Not found") };
    }
    throw error;
  }
}

async function publishServiceUploadsToPublic(uploads, companyId, config) {
  const published = [];

  for (const upload of uploads) {
    const result = await publishUploadBlob(upload, companyId, config);
    if (result.error) return { error: result.error };
    published.push({
      upload,
      publicBlobName: result.publicBlobName,
      publicBlobUrl: result.publicBlobUrl,
    });
  }

  return { published };
}

async function updateServiceImage(upload, publicBlobUrl, config, now) {
  const serviceId = cleanText(upload.serviceId, 160);
  if (!serviceId) return { error: conflict("Invalid state") };

  await ensureServicesTable(config);
  const servicesTable = getTableClient(config.servicesTable, config);
  const service = await getEntity(servicesTable, upload.partitionKey, serviceId);
  if (!service) return { error: notFound("Not found") };

  const patch = {
    partitionKey: upload.partitionKey,
    rowKey: serviceId,
    updatedAt: now,
  };

  if (upload.imageType === "cover") {
    patch.coverUrl = publicBlobUrl;
  } else if (upload.imageType === "gallery") {
    const gallery = parseStoredArray(service.gallery);
    if (!gallery.includes(publicBlobUrl)) gallery.push(publicBlobUrl);
    patch.gallery = JSON.stringify(gallery);
  } else {
    return { error: conflict("Invalid state") };
  }

  await servicesTable.updateEntity(patch, "Merge");
  return {};
}

async function updateCompanyImage(upload, publicBlobUrl, config, now) {
  if (!["cover", "logo"].includes(upload.imageType)) return {};

  await ensureCompaniesTable(config);
  const companiesTable = getTableClient(config.companiesTable, config);
  const company = await getEntity(companiesTable, "company", upload.partitionKey);
  if (!company) return { error: notFound("Not found") };

  const patch = {
    partitionKey: "company",
    rowKey: upload.partitionKey,
    updatedAt: now,
  };
  if (upload.imageType === "cover") patch.coverUrl = publicBlobUrl;
  if (upload.imageType === "logo") patch.logoUrl = publicBlobUrl;

  await companiesTable.updateEntity(patch, "Merge");
  return {};
}

async function validateUploadTarget(upload, config) {
  await ensureCompaniesTable(config);
  const companiesTable = getTableClient(config.companiesTable, config);
  const company = await getEntity(companiesTable, "company", upload.partitionKey);
  if (!company || company.status !== "published") {
    return { error: conflict("Company must be published before approving uploads") };
  }

  if (upload.scope === "service") {
    const serviceId = cleanText(upload.serviceId, 160);
    if (!serviceId || !["cover", "gallery"].includes(upload.imageType)) {
      return { error: conflict("Invalid state") };
    }

    await ensureServicesTable(config);
    const servicesTable = getTableClient(config.servicesTable, config);
    const service = await getEntity(servicesTable, upload.partitionKey, serviceId);
    if (!service) return { error: notFound("Not found") };
    if (service.status !== "published") {
      return { error: conflict("Service must be published before approving service uploads") };
    }
    return {};
  }

  if (upload.scope === "company") {
    if (!["cover", "logo", "gallery"].includes(upload.imageType)) {
      return { error: conflict("Invalid state") };
    }
    return {};
  }

  return { error: conflict("Invalid state") };
}

async function moderateCompany(context, action, req, config) {
  const companyId = cleanText(req.params?.companyId, 160);
  if (!companyId) {
    context.res = badRequest("companyId is required");
    return;
  }

  await ensureCompaniesTable(config);
  const companiesTable = getTableClient(config.companiesTable, config);
  const company = await getEntity(companiesTable, "company", companyId);
  if (!company) {
    context.res = notFound("Not found");
    return;
  }

  const now = new Date().toISOString();
  const status = action === "approve" ? "published" : "rejected";
  const patch = {
    partitionKey: "company",
    rowKey: companyId,
    status,
    updatedAt: now,
  };

  if (action === "approve") patch.rejectionReason = "";
  if (action === "reject") patch.rejectionReason = cleanText(req.body?.reason, 500);

  await companiesTable.updateEntity(patch, "Merge");
  context.res = success(status);
}

async function moderateService(context, action, req, config) {
  const companyId = cleanText(req.params?.companyId, 160);
  const serviceId = cleanText(req.params?.serviceId, 160);
  if (!companyId || !serviceId) {
    context.res = badRequest("companyId and serviceId are required");
    return;
  }

  await ensureServicesTable(config);
  const servicesTable = getTableClient(config.servicesTable, config);
  const service = await getEntity(servicesTable, companyId, serviceId);
  if (!service) {
    context.res = notFound("Not found");
    return;
  }
  if (action === "approve") {
    await ensureCompaniesTable(config);
    const companiesTable = getTableClient(config.companiesTable, config);
    const company = await getEntity(companiesTable, "company", companyId);
    if (!company || company.status !== "published") {
      context.res = conflict("Company must be published before approving services");
      return;
    }

    await ensureUploadsTable(config);
    const uploadsTable = getTableClient(config.uploadsTable, config);
    const pendingUploads = await listPendingServiceUploads(uploadsTable, companyId, serviceId);
    const imageValidation = validateServiceImageApproval(service, pendingUploads);
    if (imageValidation.error) {
      context.res = imageValidation.error;
      return;
    }

    const now = new Date().toISOString();
    const publishedUploads = await publishServiceUploadsToPublic(pendingUploads, companyId, config);
    if (publishedUploads.error) {
      context.res = publishedUploads.error;
      return;
    }

    const nextGallery = parseStoredArray(service.gallery);
    let nextCoverUrl = service.coverUrl || "";

    for (const item of publishedUploads.published) {
      if (item.upload.imageType === "cover") {
        nextCoverUrl = item.publicBlobUrl;
      } else if (item.upload.imageType === "gallery" && !nextGallery.includes(item.publicBlobUrl)) {
        nextGallery.push(item.publicBlobUrl);
      }
    }

    for (const item of publishedUploads.published) {
      await uploadsTable.updateEntity(
        {
          partitionKey: companyId,
          rowKey: item.upload.rowKey || item.upload.id,
          status: "published",
          publicBlobName: item.publicBlobName,
          publicBlobUrl: item.publicBlobUrl,
          updatedAt: now,
        },
        "Merge",
      );
    }

    await servicesTable.updateEntity(
      {
        partitionKey: companyId,
        rowKey: serviceId,
        status: "published",
        rejectionReason: "",
        coverUrl: nextCoverUrl,
        gallery: JSON.stringify(nextGallery),
        updatedAt: now,
      },
      "Merge",
    );

    await Promise.all(
      publishedUploads.published.map((item) =>
        deletePendingBlob(item.upload.pendingBlobName, config).catch((error) => {
          context.log.warn("Could not delete published pending blob.", error);
        }),
      ),
    );

    context.res = success("published", {
      publishedUploads: publishedUploads.published.length,
    });
    return;
  }

  const now = new Date().toISOString();
  const status = action === "approve" ? "published" : "rejected";
  const patch = {
    partitionKey: companyId,
    rowKey: serviceId,
    status,
    updatedAt: now,
  };

  if (action === "approve") patch.rejectionReason = "";
  if (action === "reject") patch.rejectionReason = cleanText(req.body?.reason, 500);

  await servicesTable.updateEntity(patch, "Merge");
  context.res = success(status);
}

async function approveUpload(context, req, config) {
  const companyId = cleanText(req.params?.companyId, 160);
  const uploadId = cleanText(req.params?.uploadId, 160);
  if (!companyId || !uploadId) {
    context.res = badRequest("companyId and uploadId are required");
    return;
  }

  await ensureUploadsTable(config);
  const uploadsTable = getTableClient(config.uploadsTable, config);
  const upload = await getEntity(uploadsTable, companyId, uploadId);
  if (!upload) {
    context.res = notFound("Not found");
    return;
  }
  if (upload.status !== "pending") {
    context.res = conflict("Invalid state");
    return;
  }

  const now = new Date().toISOString();
  const uploadForUpdate = { ...upload, partitionKey: companyId, rowKey: uploadId };
  const targetValidation = await validateUploadTarget(uploadForUpdate, config);
  if (targetValidation.error) {
    context.res = targetValidation.error;
    return;
  }
  if (upload.scope === "service") {
    const capacity = await validateServiceUploadCapacity(
      uploadsTable,
      companyId,
      upload.serviceId,
      upload.imageType,
      { uploadId },
    );
    if (capacity.error) {
      context.res = json(capacity.status, { error: capacity.error });
      return;
    }
  }

  const publishedBlob = await publishUploadBlob(upload, companyId, config);
  if (publishedBlob.error) {
    context.res = publishedBlob.error;
    return;
  }

  let relatedUpdate = {};
  if (upload.scope === "service") {
    relatedUpdate = await updateServiceImage(uploadForUpdate, publishedBlob.publicBlobUrl, config, now);
  } else if (upload.scope === "company") {
    relatedUpdate = await updateCompanyImage(uploadForUpdate, publishedBlob.publicBlobUrl, config, now);
  }
  if (relatedUpdate.error) {
    context.res = relatedUpdate.error;
    return;
  }

  await uploadsTable.updateEntity(
    {
      partitionKey: companyId,
      rowKey: uploadId,
      status: "published",
      publicBlobName: publishedBlob.publicBlobName,
      publicBlobUrl: publishedBlob.publicBlobUrl,
      updatedAt: now,
    },
    "Merge",
  );

  await deletePendingBlob(upload.pendingBlobName, config).catch((error) => {
    context.log.warn("Could not delete published pending blob.", error);
  });

  context.res = success("published", {
    publicBlobUrl: publishedBlob.publicBlobUrl,
  });
}

async function rejectUpload(context, req, config) {
  const companyId = cleanText(req.params?.companyId, 160);
  const uploadId = cleanText(req.params?.uploadId, 160);
  if (!companyId || !uploadId) {
    context.res = badRequest("companyId and uploadId are required");
    return;
  }

  await ensureUploadsTable(config);
  const uploadsTable = getTableClient(config.uploadsTable, config);
  const upload = await getEntity(uploadsTable, companyId, uploadId);
  if (!upload) {
    context.res = notFound("Not found");
    return;
  }
  if (upload.status === "published") {
    context.res = conflict("Invalid state");
    return;
  }

  await uploadsTable.updateEntity(
    {
      partitionKey: companyId,
      rowKey: uploadId,
      status: "rejected",
      rejectionReason: cleanText(req.body?.reason, 500),
      updatedAt: new Date().toISOString(),
    },
    "Merge",
  );

  context.res = success("rejected");
}

async function handleInternalModeration(context, req, options) {
  try {
    if (String(req.method || "").toUpperCase() !== "POST") {
      context.res = json(405, { error: "Method not allowed" });
      return;
    }

    const config = getConfig();
    const forbidden = enforceAllowedOrigin(req, config);
    if (forbidden) {
      context.res = forbidden;
      return;
    }

    const authError = requireAdminAuth(req, config);
    if (authError) {
      context.res = authError;
      return;
    }

    if (options.target === "company") {
      await moderateCompany(context, options.action, req, config);
      return;
    }
    if (options.target === "service") {
      await moderateService(context, options.action, req, config);
      return;
    }
    if (options.target === "upload" && options.action === "approve") {
      await approveUpload(context, req, config);
      return;
    }
    if (options.target === "upload" && options.action === "reject") {
      await rejectUpload(context, req, config);
      return;
    }

    context.res = badRequest("Invalid moderation target");
  } catch (error) {
    context.log.error(error);
    context.res = serverError(error);
  }
}

module.exports = { handleInternalModeration };
