const crypto = require("crypto");
const { odata } = require("@azure/data-tables");
const { getConfig } = require("./config");
const { getTableClient } = require("./azure");

const SESSION_COOKIE_PATH = "/api";
const COMPANY_OWNER_ROLE = "company_owner";
const PASSWORD_HASH_PREFIX = "scrypt";
const PASSWORD_KEY_LENGTH = 64;

function cleanToken(value, maxLength = 512) {
  return String(value || "").trim().slice(0, maxLength);
}

function normalizeEmail(value) {
  return String(value || "").trim().toLowerCase().slice(0, 320);
}

function cleanPassword(value, maxLength = 256) {
  return String(value || "").slice(0, maxLength);
}

function validateCompanyPassword(password) {
  const value = String(password || "");
  if (value.length < 10) {
    return { code: "PASSWORD_TOO_SHORT", message: "Password must be at least 10 characters" };
  }
  if (value.length > 128) {
    return { code: "PASSWORD_TOO_LONG", message: "Password must be at most 128 characters" };
  }
  if (!/[A-Za-z]/.test(value) || !/[0-9]/.test(value)) {
    return {
      code: "PASSWORD_WEAK",
      message: "Password must include letters and numbers",
    };
  }
  return null;
}

function validatePasswordChangePayload(body = {}) {
  const forbiddenFields = ["email", "companyId", "userId"].filter((field) =>
    Object.prototype.hasOwnProperty.call(body, field),
  );
  if (forbiddenFields.length) {
    return {
      code: "FORBIDDEN_FIELDS",
      message: "Request includes fields that cannot be changed here",
      details: { fields: forbiddenFields },
    };
  }

  const currentPassword = String(body.currentPassword || "");
  const newPassword = String(body.newPassword || "");
  const passwordConfirmation = String(body.passwordConfirmation || "");
  if (!currentPassword || !newPassword || !passwordConfirmation) {
    return {
      code: "MISSING_PASSWORD_FIELDS",
      message: "currentPassword, newPassword and passwordConfirmation are required",
    };
  }
  if (newPassword !== passwordConfirmation) {
    return {
      code: "PASSWORD_CONFIRMATION_MISMATCH",
      message: "Password confirmation does not match",
    };
  }
  if (currentPassword === newPassword) {
    return {
      code: "PASSWORD_UNCHANGED",
      message: "New password must be different from current password",
    };
  }

  return validateCompanyPassword(newPassword);
}

function createSecureToken(bytes = 32) {
  return crypto.randomBytes(bytes).toString("base64url");
}

function hashSecret(value) {
  return crypto.createHash("sha256").update(String(value || ""), "utf8").digest("hex");
}

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("base64url");
  const hash = crypto.scryptSync(cleanPassword(password), salt, PASSWORD_KEY_LENGTH).toString("base64url");
  return `${PASSWORD_HASH_PREFIX}$${salt}$${hash}`;
}

function verifyPassword(password, storedHash) {
  const [prefix, salt, hash] = String(storedHash || "").split("$");
  if (prefix !== PASSWORD_HASH_PREFIX || !salt || !hash) return false;

  const expected = Buffer.from(hash, "base64url");
  const actual = crypto.scryptSync(cleanPassword(password), salt, expected.length);
  if (actual.length !== expected.length) return false;
  return crypto.timingSafeEqual(actual, expected);
}

function parseCookies(header) {
  const cookies = {};
  String(header || "")
    .split(";")
    .map((part) => part.trim())
    .filter(Boolean)
    .forEach((part) => {
      const separator = part.indexOf("=");
      if (separator < 0) return;
      const name = part.slice(0, separator).trim();
      const value = part.slice(separator + 1).trim();
      if (name) cookies[name] = decodeURIComponent(value);
    });
  return cookies;
}

function sessionCookie(sessionToken, config = getConfig()) {
  const maxAge = Math.max(1, Number(config.companySessionTtlDays || 14)) * 24 * 60 * 60;
  return [
    `${config.companySessionCookieName}=${encodeURIComponent(sessionToken)}`,
    "HttpOnly",
    "Secure",
    "SameSite=Lax",
    `Path=${SESSION_COOKIE_PATH}`,
    `Max-Age=${maxAge}`,
  ].join("; ");
}

function clearSessionCookie(config = getConfig()) {
  return [
    `${config.companySessionCookieName}=`,
    "HttpOnly",
    "Secure",
    "SameSite=Lax",
    `Path=${SESSION_COOKIE_PATH}`,
    "Max-Age=0",
  ].join("; ");
}

function isExpired(expiresAt) {
  return !expiresAt || Date.parse(expiresAt) <= Date.now();
}

function publicSessionPayload(session) {
  return {
    companyId: session.partitionKey,
    email: session.email || "",
    role: session.role || COMPANY_OWNER_ROLE,
  };
}

async function findInviteByToken(token, config = getConfig()) {
  const tokenHash = hashSecret(token);
  const table = getTableClient(config.companyInvitesTable, config);
  const entities = table.listEntities({
    queryOptions: { filter: odata`tokenHash eq ${tokenHash}` },
  });

  for await (const invite of entities) {
    return invite;
  }
  return null;
}

function validateActiveInvite(invite) {
  if (!invite) return "Invitation not found";
  if (invite.status !== "active") return "Invitation is not active";
  if (invite.usedAt) return "Invitation was already used";
  if (isExpired(invite.expiresAt)) return "Invitation expired";
  if (!invite.partitionKey || !invite.rowKey || !invite.email) return "Invitation is invalid";
  return "";
}

async function markInviteUsed(invite, config = getConfig()) {
  const now = new Date().toISOString();
  await getTableClient(config.companyInvitesTable, config).updateEntity(
    {
      partitionKey: invite.partitionKey,
      rowKey: invite.rowKey,
      status: "used",
      usedAt: now,
      updatedAt: now,
    },
    "Merge",
  );
}

async function createCompanySession(invite, config = getConfig()) {
  return createCompanySessionForCompany(
    {
      companyId: invite.partitionKey,
      email: invite.email,
      role: invite.role || COMPANY_OWNER_ROLE,
    },
    config,
  );
}

async function createCompanySessionForCompany(identity, config = getConfig()) {
  const now = new Date().toISOString();
  const sessionId = `session_${crypto.randomUUID()}`;
  const sessionToken = createSecureToken(32);
  const expiresAt = new Date(
    Date.now() + Math.max(1, Number(config.companySessionTtlDays || 14)) * 24 * 60 * 60 * 1000,
  ).toISOString();
  const session = {
    partitionKey: identity.companyId,
    rowKey: sessionId,
    id: sessionId,
    sessionHash: hashSecret(sessionToken),
    email: normalizeEmail(identity.email),
    role: identity.role || COMPANY_OWNER_ROLE,
    status: "active",
    expiresAt,
    createdAt: now,
    updatedAt: now,
    lastSeenAt: now,
  };

  await getTableClient(config.companySessionsTable, config).createEntity(session);
  return { session, sessionToken };
}

async function findUserByEmail(email, config = getConfig()) {
  const users = await listUsersByEmail(email, config);
  return users[0] || null;
}

async function listUsersByEmail(email, config = getConfig()) {
  const normalizedEmail = normalizeEmail(email);
  if (!normalizedEmail) return [];

  const table = getTableClient(config.usersTable, config);
  const entities = table.listEntities({
    queryOptions: { filter: odata`email eq ${normalizedEmail}` },
  });
  const users = [];

  for await (const user of entities) {
    users.push(user);
  }
  return users;
}

async function findCompanyOwnerUser(companyId, email, config = getConfig()) {
  const normalizedEmail = normalizeEmail(email);
  if (!companyId || !normalizedEmail) return null;

  const table = getTableClient(config.usersTable, config);
  const entities = table.listEntities({
    queryOptions: {
      filter: odata`PartitionKey eq ${companyId} and email eq ${normalizedEmail}`,
    },
  });

  for await (const user of entities) {
    return user;
  }
  return null;
}

async function updateCompanyOwnerPassword(user, password, config = getConfig()) {
  const now = new Date().toISOString();
  await getTableClient(config.usersTable, config).updateEntity(
    {
      partitionKey: user.partitionKey,
      rowKey: user.rowKey,
      passwordHash: hashPassword(password),
      passwordSetAt: now,
      updatedAt: now,
    },
    "Merge",
  );
}

async function upsertCompanyOwnerPassword({ companyId, email, password }, config = getConfig()) {
  const normalizedEmail = normalizeEmail(email);
  const existing = await findCompanyOwnerUser(companyId, normalizedEmail, config);
  const now = new Date().toISOString();
  const userId = existing?.id || existing?.rowKey || `user_${crypto.randomUUID()}`;
  const user = {
    partitionKey: companyId,
    rowKey: existing?.rowKey || userId,
    id: userId,
    companyId,
    email: normalizedEmail,
    role: existing?.role || COMPANY_OWNER_ROLE,
    status: "active",
    passwordHash: hashPassword(password),
    passwordSetAt: now,
    createdAt: existing?.createdAt || now,
    updatedAt: now,
  };

  if (existing) {
    await getTableClient(config.usersTable, config).updateEntity(user, "Merge");
  } else {
    await getTableClient(config.usersTable, config).createEntity(user);
  }

  return user;
}

async function findSessionByToken(sessionToken, config = getConfig()) {
  const sessionHash = hashSecret(sessionToken);
  const table = getTableClient(config.companySessionsTable, config);
  const entities = table.listEntities({
    queryOptions: { filter: odata`sessionHash eq ${sessionHash}` },
  });

  for await (const session of entities) {
    return session;
  }
  return null;
}

async function getCurrentCompanySession(req, config = getConfig()) {
  const cookies = parseCookies(req.headers?.cookie);
  const sessionToken = cleanToken(cookies[config.companySessionCookieName], 512);
  if (!sessionToken) return null;

  const session = await findSessionByToken(sessionToken, config);
  if (!session || session.status !== "active" || isExpired(session.expiresAt)) return null;

  await getTableClient(config.companySessionsTable, config).updateEntity(
    {
      partitionKey: session.partitionKey,
      rowKey: session.rowKey,
      lastSeenAt: new Date().toISOString(),
    },
    "Merge",
  );

  return session;
}

async function revokeSession(session, config = getConfig()) {
  if (!session) return;
  const now = new Date().toISOString();
  await getTableClient(config.companySessionsTable, config).updateEntity(
    {
      partitionKey: session.partitionKey,
      rowKey: session.rowKey,
      status: "revoked",
      revokedAt: now,
      updatedAt: now,
    },
    "Merge",
  );
}

async function revokeOtherCompanySessions(session, config = getConfig()) {
  if (!session?.partitionKey || !session?.rowKey) return 0;

  const table = getTableClient(config.companySessionsTable, config);
  const email = normalizeEmail(session.email);
  const entities = table.listEntities({
    queryOptions: { filter: odata`PartitionKey eq ${session.partitionKey} and status eq ${"active"}` },
  });
  const now = new Date().toISOString();
  let revoked = 0;

  for await (const entity of entities) {
    if (entity.rowKey === session.rowKey) continue;
    if (email && normalizeEmail(entity.email) !== email) continue;

    await table.updateEntity(
      {
        partitionKey: entity.partitionKey,
        rowKey: entity.rowKey,
        status: "revoked",
        revokedAt: now,
        updatedAt: now,
      },
      "Merge",
    );
    revoked += 1;
  }

  return revoked;
}

async function revokeCompanySessionsForUser({ companyId, email }, config = getConfig()) {
  const normalizedEmail = normalizeEmail(email);
  if (!companyId || !normalizedEmail) return 0;

  const table = getTableClient(config.companySessionsTable, config);
  const entities = table.listEntities({
    queryOptions: { filter: odata`PartitionKey eq ${companyId} and status eq ${"active"}` },
  });
  const now = new Date().toISOString();
  let revoked = 0;

  for await (const entity of entities) {
    if (normalizeEmail(entity.email) !== normalizedEmail) continue;
    await table.updateEntity(
      {
        partitionKey: entity.partitionKey,
        rowKey: entity.rowKey,
        status: "revoked",
        revokedAt: now,
        updatedAt: now,
      },
      "Merge",
    );
    revoked += 1;
  }

  return revoked;
}

module.exports = {
  clearSessionCookie,
  cleanToken,
  cleanPassword,
  createCompanySession,
  createCompanySessionForCompany,
  createSecureToken,
  findUserByEmail,
  findCompanyOwnerUser,
  listUsersByEmail,
  findInviteByToken,
  getCurrentCompanySession,
  hashPassword,
  hashSecret,
  parseCookies,
  publicSessionPayload,
  normalizeEmail,
  revokeSession,
  revokeOtherCompanySessions,
  revokeCompanySessionsForUser,
  sessionCookie,
  updateCompanyOwnerPassword,
  upsertCompanyOwnerPassword,
  validateActiveInvite,
  validateCompanyPassword,
  validatePasswordChangePayload,
  verifyPassword,
  markInviteUsed,
};
