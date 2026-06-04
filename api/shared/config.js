const DEFAULT_PENDING_CONTAINER = "uploads-pending";
const DEFAULT_PUBLIC_CONTAINER = "public";
const DEFAULT_PROVIDERS_TABLE = "Providers";
const DEFAULT_PROVIDER_IMAGES_TABLE = "ProviderImages";
const DEFAULT_COMPANIES_TABLE = "Companies";
const DEFAULT_COMPANY_INVITES_TABLE = "CompanyInvites";
const DEFAULT_COMPANY_SESSIONS_TABLE = "CompanySessions";
const DEFAULT_USERS_TABLE = "Users";
const DEFAULT_SERVICES_TABLE = "Services";
const DEFAULT_LEADS_TABLE = "Leads";
const DEFAULT_UPLOADS_TABLE = "Uploads";
const DEFAULT_COMPANY_SESSION_COOKIE_NAME = "pe_company_session";
const DEFAULT_COMPANY_INVITE_TOKEN_TTL_MINUTES = 1440;
const DEFAULT_COMPANY_SESSION_TTL_DAYS = 14;

function normalizeOrigin(value) {
  const origin = String(value || "").trim();
  if (!origin) return "";

  try {
    return new URL(origin).origin;
  } catch (_error) {
    return origin.replace(/\/+$/, "");
  }
}

function getConfig() {
  const storageConnectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
  const tableConnectionString =
    process.env.AZURE_TABLE_CONNECTION_STRING || storageConnectionString;
  const isProduction =
    process.env.AZURE_FUNCTIONS_ENVIRONMENT === "Production" ||
    process.env.NODE_ENV === "production";
  const allowedOrigins = (process.env.ALLOWED_ORIGINS || "")
    .split(",")
    .map(normalizeOrigin)
    .filter(Boolean);

  if (!storageConnectionString) {
    throw new Error("Missing AZURE_STORAGE_CONNECTION_STRING");
  }
  if (!tableConnectionString) {
    throw new Error("Missing AZURE_TABLE_CONNECTION_STRING");
  }
  if (isProduction && !allowedOrigins.length) {
    throw new Error("Missing ALLOWED_ORIGINS");
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
    companiesTable:
      process.env.AZURE_TABLE_COMPANIES || DEFAULT_COMPANIES_TABLE,
    servicesTable:
      process.env.AZURE_TABLE_SERVICES || DEFAULT_SERVICES_TABLE,
    uploadsTable:
      process.env.AZURE_TABLE_UPLOADS || DEFAULT_UPLOADS_TABLE,
    companyInvitesTable:
      process.env.AZURE_TABLE_COMPANY_INVITES || DEFAULT_COMPANY_INVITES_TABLE,
    companySessionsTable:
      process.env.AZURE_TABLE_COMPANY_SESSIONS || DEFAULT_COMPANY_SESSIONS_TABLE,
    usersTable:
      process.env.AZURE_TABLE_USERS || DEFAULT_USERS_TABLE,
    companySessionCookieName:
      process.env.COMPANY_SESSION_COOKIE_NAME || DEFAULT_COMPANY_SESSION_COOKIE_NAME,
    leadsTable:
      process.env.AZURE_TABLE_LEADS || DEFAULT_LEADS_TABLE,
    companyInviteTokenTtlMinutes:
      Number(process.env.COMPANY_INVITE_TOKEN_TTL_MINUTES || 0) ||
      DEFAULT_COMPANY_INVITE_TOKEN_TTL_MINUTES,
    companySessionTtlDays:
      Number(process.env.COMPANY_SESSION_TTL_DAYS || 0) || DEFAULT_COMPANY_SESSION_TTL_DAYS,
    allowedOrigins,
    emailProvider: String(process.env.EMAIL_PROVIDER || "acs").trim().toLowerCase(),
    azureCommunicationConnectionString:
      process.env.AZURE_COMMUNICATION_CONNECTION_STRING || "",
    azureCommunicationEmailFrom:
      process.env.AZURE_COMMUNICATION_EMAIL_FROM || process.env.NOTIFICATION_EMAIL_FROM || "",
    sendGridApiKey: process.env.SENDGRID_API_KEY || "",
    notificationEmailTo: process.env.NOTIFICATION_EMAIL_TO || "",
    notificationEmailFrom: process.env.NOTIFICATION_EMAIL_FROM || "",
    notificationEmailFromName:
      process.env.NOTIFICATION_EMAIL_FROM_NAME || "Punto Evento CR",
    appPublicUrl: process.env.APP_PUBLIC_URL || "",
    adminUsername: process.env.ADMIN_USERNAME || "",
    adminPassword: process.env.ADMIN_PASSWORD || "",
  };
}

module.exports = { getConfig, normalizeOrigin };
