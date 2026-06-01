const {
  ensureCompaniesTable,
  ensureCompanyAuthTables,
  getConfig,
  getTableClient,
} = require("../shared/azure");
const { enforceAllowedOrigin } = require("../shared/guard");
const { badRequest, json, serverError } = require("../shared/http");
const {
  cleanPassword,
  createCompanySessionForCompany,
  listUsersByEmail,
  normalizeEmail,
  publicSessionPayload,
  sessionCookie,
  verifyPassword,
} = require("../shared/companyAuth");

const LOGIN_ALLOWED_COMPANY_STATUSES = new Set(["pending", "published"]);

function invalidCredentials() {
  return json(401, { error: "Invalid email or password" });
}

function userTimestamp(user) {
  return (
    Date.parse(user.passwordSetAt || user.updatedAt || user.createdAt || "") ||
    0
  );
}

async function getCompany(companyId, config) {
  try {
    return await getTableClient(config.companiesTable, config).getEntity("company", companyId);
  } catch (error) {
    if (error.statusCode === 404) return null;
    throw error;
  }
}

module.exports = async function loginCompany(context, req) {
  try {
    if (String(req.method || "").toUpperCase() !== "POST") {
      context.res = json(405, { error: "Method not allowed" });
      return;
    }

    const email = normalizeEmail(req.body?.email);
    const password = cleanPassword(req.body?.password);
    if (!email || !password) {
      context.res = badRequest("email and password are required");
      return;
    }

    const config = getConfig();
    const forbidden = enforceAllowedOrigin(req, config);
    if (forbidden) {
      context.res = forbidden;
      return;
    }

    await ensureCompaniesTable(config);
    await ensureCompanyAuthTables(config);

    const users = await listUsersByEmail(email, config);
    const passwordMatches = users.filter(
      (candidate) =>
        candidate.status === "active" &&
        candidate.passwordHash &&
        verifyPassword(password, candidate.passwordHash),
    );
    if (!passwordMatches.length) {
      context.res = invalidCredentials();
      return;
    }

    const allowedMatches = [];
    let existingCompanyMatches = 0;
    for (const user of passwordMatches) {
      const company = await getCompany(user.partitionKey, config);
      if (!company) continue;
      existingCompanyMatches += 1;
      if (LOGIN_ALLOWED_COMPANY_STATUSES.has(company.status || "pending")) {
        allowedMatches.push({ user, company });
      }
    }

    if (!allowedMatches.length) {
      if (!existingCompanyMatches) {
        context.res = invalidCredentials();
        return;
      }
      context.res = json(403, { error: "Company status cannot access panel" });
      return;
    }

    allowedMatches.sort((left, right) => userTimestamp(right.user) - userTimestamp(left.user));
    const { user } = allowedMatches[0];

    const { session, sessionToken } = await createCompanySessionForCompany(
      {
        companyId: user.partitionKey,
        email: user.email,
        role: user.role,
      },
      config,
    );

    context.res = {
      ...json(200, publicSessionPayload(session)),
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Set-Cookie": sessionCookie(sessionToken, config),
      },
    };
  } catch (error) {
    context.log.error(error);
    context.res = serverError(error);
  }
};
