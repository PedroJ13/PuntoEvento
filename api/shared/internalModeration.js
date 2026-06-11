const { odata } = require("@azure/data-tables");
const {
  ensureCompanyAuthTables,
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
const { getOrCreateCompanyInvite } = require("./companyInvites");
const { sendCompanyActivationInviteEmail } = require("./email");
const { enforceAllowedOrigin } = require("./guard");
const { badRequest, json, serverError } = require("./http");
const { validateServiceUploadCapacity } = require("./serviceUploadRules");
const { cleanText } = require("./validation");

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

async function listPublishedServiceCoverUploads(uploadsTable, companyId, serviceId) {
  const entities = uploadsTable.listEntities({
    queryOptions: {
      filter: odata`PartitionKey eq ${companyId} and scope eq ${"service"} and serviceId eq ${serviceId} and status eq ${"published"} and imageType eq ${"cover"}`,
    },
  });
  const uploads = [];

  for await (const upload of entities) {
    if (
      upload.status === "published" &&
      upload.scope === "service" &&
      upload.serviceId === serviceId &&
      upload.imageType === "cover"
    ) {
      uploads.push(upload);
    }
  }

  return uploads;
}

async function listPublishedServiceUploads(uploadsTable, companyId, serviceId, excludedUploadId = "") {
  const entities = uploadsTable.listEntities({
    queryOptions: {
      filter: odata`PartitionKey eq ${companyId} and scope eq ${"service"} and serviceId eq ${serviceId} and status eq ${"published"}`,
    },
  });
  const uploads = [];

  for await (const upload of entities) {
    const uploadId = upload.rowKey || upload.id || "";
    if (
      uploadId !== excludedUploadId &&
      upload.status === "published" &&
      upload.scope === "service" &&
      upload.serviceId === serviceId &&
      upload.publicBlobUrl
    ) {
      uploads.push(upload);
    }
  }

  return uploads.sort(
    (a, b) =>
      (Date.parse(b.updatedAt || b.createdAt || "") || 0) -
      (Date.parse(a.updatedAt || a.createdAt || "") || 0),
  );
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

async function demotePreviousPublishedCovers(uploadsTable, companyId, serviceId, exceptUploadIds, now) {
  const publishedCovers = await listPublishedServiceCoverUploads(uploadsTable, companyId, serviceId);
  await Promise.all(
    publishedCovers
      .filter((upload) => !exceptUploadIds.has(upload.rowKey || upload.id))
      .map((upload) =>
        uploadsTable.updateEntity(
          {
            partitionKey: companyId,
            rowKey: upload.rowKey || upload.id,
            imageType: "gallery",
            updatedAt: now,
          },
          "Merge",
        ),
      ),
  );
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
    const gallery = parseStoredArray(service.gallery);
    const currentCoverUrl = cleanText(service.coverUrl, 600);
    if (currentCoverUrl && currentCoverUrl !== publicBlobUrl && !gallery.includes(currentCoverUrl)) {
      gallery.push(currentCoverUrl);
    }
    patch.gallery = JSON.stringify(gallery);
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

async function unpublishServiceImage(upload, config, now) {
  if (upload.scope !== "service") return {};

  const companyId = upload.partitionKey || "";
  const serviceId = cleanText(upload.serviceId, 160);
  const publicBlobUrl = cleanText(upload.publicBlobUrl, 600);
  if (!companyId || !serviceId || !publicBlobUrl) return {};

  await ensureServicesTable(config);
  const servicesTable = getTableClient(config.servicesTable, config);
  const service = await getEntity(servicesTable, companyId, serviceId);
  if (!service) return { error: notFound("Not found") };

  await ensureUploadsTable(config);
  const uploadsTable = getTableClient(config.uploadsTable, config);
  const remainingPublishedUploads = await listPublishedServiceUploads(
    uploadsTable,
    companyId,
    serviceId,
    upload.rowKey || upload.id || "",
  );
  const replacementCover =
    remainingPublishedUploads.find((item) => item.imageType === "cover") ||
    remainingPublishedUploads[0] ||
    null;
  const replacementCoverUrl = replacementCover?.publicBlobUrl || "";
  const nextGallery = parseStoredArray(service.gallery).filter(
    (url) => url !== publicBlobUrl && url !== replacementCoverUrl,
  );
  const patch = {
    partitionKey: companyId,
    rowKey: serviceId,
    updatedAt: now,
    gallery: JSON.stringify(nextGallery),
  };

  if (service.coverUrl === publicBlobUrl) {
    patch.coverUrl = replacementCoverUrl;
  } else if (replacementCoverUrl && !service.coverUrl) {
    patch.coverUrl = replacementCoverUrl;
  }

  await servicesTable.updateEntity(patch, "Merge");

  if (replacementCover && replacementCover.imageType !== "cover") {
    await uploadsTable.updateEntity(
      {
        partitionKey: companyId,
        rowKey: replacementCover.rowKey || replacementCover.id,
        imageType: "cover",
        updatedAt: now,
      },
      "Merge",
    );
  }

  return {};
}

async function unpublishCompanyImage(upload, config, now) {
  if (upload.scope !== "company" || !["cover", "logo"].includes(upload.imageType)) return {};

  const companyId = upload.partitionKey || "";
  const publicBlobUrl = cleanText(upload.publicBlobUrl, 600);
  if (!companyId || !publicBlobUrl) return {};

  await ensureCompaniesTable(config);
  const companiesTable = getTableClient(config.companiesTable, config);
  const company = await getEntity(companiesTable, "company", companyId);
  if (!company) return { error: notFound("Not found") };

  const patch = {
    partitionKey: "company",
    rowKey: companyId,
    updatedAt: now,
  };
  if (upload.imageType === "cover" && company.coverUrl === publicBlobUrl) patch.coverUrl = "";
  if (upload.imageType === "logo" && company.logoUrl === publicBlobUrl) patch.logoUrl = "";

  if (Object.keys(patch).length > 3) {
    await companiesTable.updateEntity(patch, "Merge");
  }

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

  if (action !== "approve") {
    context.res = success(status);
    return;
  }

  const approvedCompany = {
    ...company,
    status,
    updatedAt: now,
    rejectionReason: "",
  };

  try {
    if (!approvedCompany.email) {
      context.res = success(status, {
        invite: {
          status: "missing_email",
          emailSent: false,
        },
        warning: "Company approved, but activation email was not sent because company email is missing.",
      });
      return;
    }

    await ensureCompanyAuthTables(config);
    const inviteResult = await getOrCreateCompanyInvite(
      {
        companyId,
        email: approvedCompany.email,
      },
      config,
    );

    if (!inviteResult.created) {
      context.res = success(status, {
        invite: {
          status: "active_exists",
          inviteId: inviteResult.invite.id || inviteResult.invite.rowKey,
          expiresAt: inviteResult.invite.expiresAt,
          emailSent: false,
        },
        warning: "Company approved, but activation email was not sent because an active invite already exists.",
      });
      return;
    }

    try {
      await sendCompanyActivationInviteEmail(
        {
          company: approvedCompany,
          inviteUrl: inviteResult.inviteUrl,
        },
        config,
      );
      context.res = success(status, {
        invite: {
          status: "email_sent",
          inviteId: inviteResult.invite.id || inviteResult.invite.rowKey,
          expiresAt: inviteResult.invite.expiresAt,
          emailSent: true,
        },
      });
      return;
    } catch (error) {
      context.log.warn("Company activation invite email failed.");
      context.res = success(status, {
        invite: {
          status: "email_failed",
          inviteId: inviteResult.invite.id || inviteResult.invite.rowKey,
          expiresAt: inviteResult.invite.expiresAt,
          emailSent: false,
        },
        warning: "Company approved and invite created, but activation email could not be sent.",
      });
      return;
    }
  } catch (error) {
    context.log.warn("Company activation invite generation failed.");
    context.res = success(status, {
      invite: {
        status: "invite_failed",
        emailSent: false,
      },
      warning: "Company approved, but activation invite could not be created.",
    });
  }
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

    const now = new Date().toISOString();
    await servicesTable.updateEntity(
      {
        partitionKey: companyId,
        rowKey: serviceId,
        status: "published",
        rejectionReason: "",
        updatedAt: now,
      },
      "Merge",
    );

    context.res = success("published");
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

  if (upload.scope === "service" && upload.imageType === "cover") {
    await demotePreviousPublishedCovers(uploadsTable, companyId, upload.serviceId, new Set([uploadId]), now);
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
    const now = new Date().toISOString();
    const uploadForUpdate = { ...upload, partitionKey: companyId, rowKey: uploadId };
    const relatedUpdate =
      upload.scope === "service"
        ? await unpublishServiceImage(uploadForUpdate, config, now)
        : await unpublishCompanyImage(uploadForUpdate, config, now);

    if (relatedUpdate.error) {
      context.res = relatedUpdate.error;
      return;
    }

    await uploadsTable.updateEntity(
      {
        partitionKey: companyId,
        rowKey: uploadId,
        status: "rejected",
        rejectionReason: cleanText(req.body?.reason, 500),
        updatedAt: now,
      },
      "Merge",
    );

    context.res = success("rejected");
    return;
  }
  if (upload.status === "rejected") {
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
