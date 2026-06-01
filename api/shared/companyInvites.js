const crypto = require("crypto");
const { odata } = require("@azure/data-tables");
const { createSecureToken, hashSecret, normalizeEmail } = require("./companyAuth");
const { getConfig } = require("./config");
const { getTableClient } = require("./azure");

const COMPANY_OWNER_ROLE = "company_owner";

function inviteUrl(token, config = getConfig()) {
  const path = `/panel.html?invite=${encodeURIComponent(token)}`;
  const baseUrl = String(config.appPublicUrl || "").trim().replace(/\/+$/, "");
  return baseUrl ? `${baseUrl}${path}` : path;
}

function isInviteActive(invite) {
  if (!invite || invite.status !== "active" || invite.usedAt) return false;
  return Boolean(invite.expiresAt && Date.parse(invite.expiresAt) > Date.now());
}

async function findActiveCompanyInvite(companyId, email, config = getConfig()) {
  const table = getTableClient(config.companyInvitesTable, config);
  const entities = table.listEntities({
    queryOptions: {
      filter: odata`PartitionKey eq ${companyId} and status eq ${"active"}`,
    },
  });
  const normalizedEmail = normalizeEmail(email);

  for await (const invite of entities) {
    if (!isInviteActive(invite)) continue;
    if (normalizedEmail && normalizeEmail(invite.email) !== normalizedEmail) continue;
    return invite;
  }
  return null;
}

async function createCompanyInviteEntity({ companyId, email }, config = getConfig()) {
  const now = new Date().toISOString();
  const expiresAt = new Date(
    Date.now() + Math.max(1, Number(config.companyInviteTokenTtlMinutes || 1440)) * 60 * 1000,
  ).toISOString();
  const inviteId = `invite_${crypto.randomUUID()}`;
  const token = createSecureToken(32);
  const normalizedEmail = normalizeEmail(email);
  const invite = {
    partitionKey: companyId,
    rowKey: inviteId,
    id: inviteId,
    tokenHash: hashSecret(token),
    email: normalizedEmail,
    role: COMPANY_OWNER_ROLE,
    status: "active",
    expiresAt,
    usedAt: "",
    createdAt: now,
    updatedAt: now,
  };

  await getTableClient(config.companyInvitesTable, config).createEntity(invite);

  return {
    invite,
    token,
    inviteUrl: inviteUrl(token, config),
  };
}

async function getOrCreateCompanyInvite({ companyId, email }, config = getConfig()) {
  const activeInvite = await findActiveCompanyInvite(companyId, email, config);
  if (activeInvite) {
    return {
      created: false,
      invite: activeInvite,
      inviteUrl: "",
    };
  }

  const createdInvite = await createCompanyInviteEntity({ companyId, email }, config);
  return {
    created: true,
    ...createdInvite,
  };
}

module.exports = {
  COMPANY_OWNER_ROLE,
  createCompanyInviteEntity,
  findActiveCompanyInvite,
  getOrCreateCompanyInvite,
  inviteUrl,
  isInviteActive,
};
