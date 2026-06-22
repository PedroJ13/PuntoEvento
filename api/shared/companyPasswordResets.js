const crypto = require("crypto");
const { odata } = require("@azure/data-tables");
const { getConfig } = require("./config");
const {
  ensureCompaniesTable,
  ensureCompanyAuthTables,
  ensureCompanyPasswordResetsTable,
  getTableClient,
} = require("./azure");
const {
  cleanPassword,
  cleanToken,
  createSecureToken,
  findCompanyOwnerUser,
  hashSecret,
  listUsersByEmail,
  normalizeEmail,
  revokeCompanySessionsForUser,
  updateCompanyOwnerPassword,
  validateCompanyPassword,
} = require("./companyAuth");
const { sendCompanyPasswordResetEmail } = require("./email");

const RESET_STATUS_PENDING = "pending";
const RESET_STATUS_USED = "used";
const RESET_STATUS_REVOKED = "revoked";
const PANEL_ALLOWED_COMPANY_STATUSES = new Set(["pending", "published"]);
const DEFAULT_PUBLIC_BASE_URL = "https://puntoeventocr.com";

function genericResetRequestResponse() {
  return {
    ok: true,
    message: "Si el correo esta registrado, enviaremos instrucciones para recuperar el acceso.",
  };
}

function invalidResetResponse(status = "invalid") {
  return { valid: false, status };
}

function resetTokenFromBody(body = {}) {
  return cleanToken(body.token || body.resetToken || "", 512);
}

function passwordPayloadError(body = {}) {
  const password = cleanPassword(body.password || body.newPassword || "");
  const confirmation = cleanPassword(body.passwordConfirmation || body.passwordConfirm || "");
  if (!password || !confirmation) {
    return { code: "MISSING_PASSWORD_FIELDS", message: "Password and confirmation are required" };
  }
  if (password !== confirmation) {
    return { code: "PASSWORD_CONFIRMATION_MISMATCH", message: "Password confirmation does not match" };
  }
  return validateCompanyPassword(password);
}

function resetExpiresAt(config = getConfig()) {
  const minutes = Math.max(5, Number(config.companyPasswordResetTtlMinutes || 30));
  return new Date(Date.now() + minutes * 60 * 1000).toISOString();
}

function isExpired(expiresAt) {
  return !expiresAt || Date.parse(expiresAt) <= Date.now();
}

function publicResetUrl(token, config = getConfig()) {
  const base = String(config.appPublicUrl || DEFAULT_PUBLIC_BASE_URL).replace(/\/+$/, "");
  return `${base}/panel.html?reset=${encodeURIComponent(token)}`;
}

async function getCompany(companyId, config = getConfig()) {
  if (!companyId) return null;
  try {
    return await getTableClient(config.companiesTable, config).getEntity("company", companyId);
  } catch (error) {
    if (error.statusCode === 404) return null;
    throw error;
  }
}

function companyIdOf(entity) {
  return entity?.companyId || entity?.partitionKey || entity?.id || "";
}

function userSortValue(user) {
  return Date.parse(user.passwordSetAt || user.updatedAt || user.createdAt || "") || 0;
}

async function findResetCandidateByEmail(email, config = getConfig()) {
  const normalizedEmail = normalizeEmail(email);
  if (!normalizedEmail) return null;

  const users = (await listUsersByEmail(normalizedEmail, config))
    .filter((user) => user.status === "active" && user.passwordHash)
    .sort((a, b) => userSortValue(b) - userSortValue(a));

  for (const user of users) {
    const company = await getCompany(user.partitionKey, config);
    if (!company || !PANEL_ALLOWED_COMPANY_STATUSES.has(company.status || "pending")) continue;
    if (normalizeEmail(company.email) !== normalizedEmail) continue;
    return { user, company };
  }
  return null;
}

async function revokePendingResets({ companyId, userId, email }, config = getConfig()) {
  if (!companyId) return 0;

  const table = getTableClient(config.companyPasswordResetsTable, config);
  const normalizedEmail = normalizeEmail(email);
  const entities = table.listEntities({
    queryOptions: { filter: odata`PartitionKey eq ${companyId} and status eq ${RESET_STATUS_PENDING}` },
  });
  const now = new Date().toISOString();
  let revoked = 0;

  for await (const reset of entities) {
    if (userId && reset.userId !== userId) continue;
    if (normalizedEmail && normalizeEmail(reset.email) !== normalizedEmail) continue;
    await table.updateEntity(
      {
        partitionKey: reset.partitionKey,
        rowKey: reset.rowKey,
        status: RESET_STATUS_REVOKED,
        revokedAt: now,
        updatedAt: now,
      },
      "Merge",
    );
    revoked += 1;
  }

  return revoked;
}

async function createPasswordReset({ company, user, requestedBy = "public" }, config = getConfig()) {
  const now = new Date().toISOString();
  const token = createSecureToken(32);
  const resetId = `reset_${crypto.randomUUID()}`;
  const companyId = companyIdOf(company) || user.partitionKey;
  const email = normalizeEmail(user.email || company.email);

  await revokePendingResets(
    {
      companyId,
      userId: user.id || user.rowKey,
      email,
    },
    config,
  );

  await getTableClient(config.companyPasswordResetsTable, config).createEntity({
    partitionKey: companyId,
    rowKey: resetId,
    id: resetId,
    companyId,
    userId: user.id || user.rowKey,
    email,
    tokenHash: hashSecret(token),
    status: RESET_STATUS_PENDING,
    requestedBy,
    expiresAt: resetExpiresAt(config),
    createdAt: now,
    updatedAt: now,
  });

  return {
    token,
    resetUrl: publicResetUrl(token, config),
  };
}

async function sendResetForCandidate({ company, user, requestedBy }, config = getConfig()) {
  const reset = await createPasswordReset({ company, user, requestedBy }, config);
  await sendCompanyPasswordResetEmail({ company: { ...company, email: normalizeEmail(user.email || company.email) }, resetUrl: reset.resetUrl }, config);
}

async function requestPublicPasswordReset(email, context, config = getConfig()) {
  await ensureCompaniesTable(config);
  await ensureCompanyAuthTables(config);
  await ensureCompanyPasswordResetsTable(config);

  const candidate = await findResetCandidateByEmail(email, config);
  if (!candidate) return genericResetRequestResponse();

  try {
    await sendResetForCandidate({ ...candidate, requestedBy: "public" }, config);
  } catch (error) {
    context?.log?.warn?.(`Company password reset email failed for ${candidate.company.partitionKey || candidate.company.rowKey || "company"}.`);
  }

  return genericResetRequestResponse();
}

async function findPasswordResetByToken(token, config = getConfig()) {
  const clean = cleanToken(token, 512);
  if (!clean) return null;

  const table = getTableClient(config.companyPasswordResetsTable, config);
  const tokenHash = hashSecret(clean);
  const entities = table.listEntities({
    queryOptions: { filter: odata`tokenHash eq ${tokenHash}` },
  });

  for await (const reset of entities) {
    return reset;
  }
  return null;
}

function resetPublicStatus(reset) {
  if (!reset) return "invalid";
  if (reset.status === RESET_STATUS_USED || reset.usedAt) return "used";
  if (reset.status !== RESET_STATUS_PENDING) return "invalid";
  if (isExpired(reset.expiresAt)) return "expired";
  return "valid";
}

async function validatePasswordResetToken(token, config = getConfig()) {
  await ensureCompanyPasswordResetsTable(config);

  const reset = await findPasswordResetByToken(token, config);
  const status = resetPublicStatus(reset);
  if (status !== "valid") return invalidResetResponse(status);
  return { valid: true, status: "valid" };
}

async function completePasswordReset(body = {}, config = getConfig()) {
  await ensureCompanyAuthTables(config);
  await ensureCompanyPasswordResetsTable(config);

  const token = resetTokenFromBody(body);
  const reset = await findPasswordResetByToken(token, config);
  const status = resetPublicStatus(reset);
  if (status !== "valid") {
    return { ok: false, status: 400, body: { error: "Invalid reset token", code: `RESET_${status.toUpperCase()}` } };
  }

  const payloadError = passwordPayloadError(body);
  if (payloadError) {
    return {
      ok: false,
      status: 400,
      body: { error: payloadError.message, code: payloadError.code },
    };
  }

  const user = await findCompanyOwnerUser(reset.partitionKey, reset.email, config);
  if (!user || user.status !== "active" || String(user.id || user.rowKey) !== String(reset.userId || "")) {
    return { ok: false, status: 400, body: { error: "Invalid reset token", code: "RESET_INVALID" } };
  }

  const now = new Date().toISOString();
  const table = getTableClient(config.companyPasswordResetsTable, config);
  await updateCompanyOwnerPassword(user, body.password || body.newPassword, config);
  await table.updateEntity(
    {
      partitionKey: reset.partitionKey,
      rowKey: reset.rowKey,
      status: RESET_STATUS_USED,
      usedAt: now,
      updatedAt: now,
    },
    "Merge",
  );
  const revokedSessions = await revokeCompanySessionsForUser(
    { companyId: reset.partitionKey, email: reset.email },
    config,
  );

  return { ok: true, body: { ok: true, revokedSessions } };
}

async function requestAdminPasswordReset(companyId, config = getConfig()) {
  await ensureCompaniesTable(config);
  await ensureCompanyAuthTables(config);
  await ensureCompanyPasswordResetsTable(config);

  const company = await getCompany(companyId, config);
  if (!company) {
    return { ok: false, status: 404, body: { error: "Company not found", code: "COMPANY_NOT_FOUND" } };
  }

  const email = normalizeEmail(company.email);
  const user = await findCompanyOwnerUser(companyId, email, config);
  if (!email || !user || user.status !== "active" || !user.passwordHash) {
    return {
      ok: false,
      status: 409,
      body: { error: "Company cannot receive password reset", code: "RESET_RECIPIENT_UNAVAILABLE" },
    };
  }

  await sendResetForCandidate({ company, user, requestedBy: "admin" }, config);
  return { ok: true, body: { ok: true } };
}

module.exports = {
  completePasswordReset,
  genericResetRequestResponse,
  requestAdminPasswordReset,
  requestPublicPasswordReset,
  validatePasswordResetToken,
};
