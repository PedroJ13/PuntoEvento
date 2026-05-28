const { odata } = require("@azure/data-tables");
const {
  ensureCompaniesTable,
  ensureServicesTable,
  getConfig,
  getTableClient,
} = require("./azure");
const { json, serverError } = require("./http");
const { cleanText } = require("./validation");

const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 50;

function parseArray(value) {
  if (Array.isArray(value)) return value.filter(Boolean);
  if (!value) return [];

  const text = String(value).trim();
  if (!text) return [];

  try {
    const parsed = JSON.parse(text);
    if (Array.isArray(parsed)) return parsed.filter(Boolean);
  } catch (_error) {
    // Demo/legacy values can be comma-separated instead of JSON arrays.
  }

  return text
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function normalizeSearch(value, maxLength = 120) {
  return cleanText(value, maxLength).toLowerCase();
}

function normalizeLimit(value) {
  const limit = Number(value || DEFAULT_LIMIT);
  if (!Number.isFinite(limit) || limit <= 0) return DEFAULT_LIMIT;
  return Math.min(Math.floor(limit), MAX_LIMIT);
}

function serviceTimestamp(service) {
  return Date.parse(service.updatedAt || service.createdAt || "") || 0;
}

function serviceMatchesText(service, q) {
  if (!q) return true;

  const eventTypes = parseArray(service.eventTypes).join(" ");
  const haystack = [
    service.name,
    service.description,
    service.category,
    eventTypes,
  ]
    .join(" ")
    .toLowerCase();

  return haystack.includes(q);
}

function serviceMatchesFilter(service, field, value) {
  if (!value) return true;
  if (field === "eventType") {
    return parseArray(service.eventTypes)
      .map((eventType) => eventType.toLowerCase())
      .includes(value);
  }
  return String(service[field] || "").toLowerCase() === value;
}

function companyMatchesProvince(company, province) {
  if (!province) return true;
  return String(company.province || "").toLowerCase() === province;
}

function companyCardPayload(company) {
  return {
    id: company.id || company.rowKey || "",
    slug: company.slug || "",
    name: company.name || "",
    province: company.province || "",
    canton: company.canton || "",
    plan: company.plan || "free",
    logoUrl: company.logoUrl || "",
  };
}

function serviceListPayload(service, company) {
  return {
    id: service.id || service.rowKey || "",
    slug: service.slug || "",
    name: service.name || "",
    category: service.category || "",
    eventTypes: parseArray(service.eventTypes),
    description: service.description || "",
    priceFrom: service.priceFrom || "",
    coverUrl: service.coverUrl || "",
    gallery: parseArray(service.gallery),
    company: companyCardPayload(company),
  };
}

function serviceProfilePayload(service) {
  return {
    id: service.id || service.rowKey || "",
    slug: service.slug || "",
    name: service.name || "",
    category: service.category || "",
    status: "published",
    eventTypes: parseArray(service.eventTypes),
    description: service.description || "",
    priceFrom: service.priceFrom || "",
    coverUrl: service.coverUrl || "",
    gallery: parseArray(service.gallery),
  };
}

function companyProfilePayload(company, services, selectedServiceSlug) {
  return {
    id: company.id || company.rowKey || "",
    slug: company.slug || "",
    name: company.name || "",
    status: "published",
    description: company.description || "",
    logoUrl: company.logoUrl || "",
    coverUrl: company.coverUrl || "",
    whatsapp: company.whatsapp || "",
    website: company.website || "",
    instagram: company.instagram || "",
    province: company.province || "",
    canton: company.canton || "",
    district: company.district || "",
    plan: company.plan || "free",
    selectedServiceSlug,
    services: services.map(serviceProfilePayload),
  };
}

async function getPublishedCompany(companyId, companiesTable) {
  try {
    const company = await companiesTable.getEntity("company", companyId);
    if (company.status !== "published") return null;
    return company;
  } catch (error) {
    if (error.statusCode === 404) return null;
    throw error;
  }
}

async function findPublishedCompanyBySlug(slug, companiesTable) {
  const companies = companiesTable.listEntities({
    queryOptions: {
      filter: odata`PartitionKey eq ${"company"} and slug eq ${slug}`,
    },
  });

  for await (const company of companies) {
    if (company.status === "published" && company.slug === slug) return company;
  }
  return null;
}

async function listPublishedServices(config, companyId = "") {
  const servicesTable = getTableClient(config.servicesTable, config);
  const filter = companyId
    ? odata`PartitionKey eq ${companyId} and status eq ${"published"}`
    : odata`status eq ${"published"}`;
  const entities = servicesTable.listEntities({
    queryOptions: { filter },
  });
  const services = [];

  for await (const service of entities) {
    services.push(service);
  }

  return services.sort((a, b) => serviceTimestamp(b) - serviceTimestamp(a));
}

async function handlePublicServices(context, req) {
  try {
    if (String(req.method || "").toUpperCase() !== "GET") {
      context.res = json(405, { error: "Method not allowed" });
      return;
    }

    const config = getConfig();
    await ensureCompaniesTable(config);
    await ensureServicesTable(config);

    const query = req.query || {};
    const q = normalizeSearch(query.q, 160);
    const category = normalizeSearch(query.category, 120);
    const eventType = normalizeSearch(query.eventType, 120);
    const province = normalizeSearch(query.province, 120);
    const limit = normalizeLimit(query.limit);
    const companiesTable = getTableClient(config.companiesTable, config);
    const services = await listPublishedServices(config);
    const items = [];
    const companyCache = new Map();

    for (const service of services) {
      if (!serviceMatchesText(service, q)) continue;
      if (!serviceMatchesFilter(service, "category", category)) continue;
      if (!serviceMatchesFilter(service, "eventType", eventType)) continue;

      const companyId = service.partitionKey;
      if (!companyCache.has(companyId)) {
        companyCache.set(companyId, await getPublishedCompany(companyId, companiesTable));
      }
      const company = companyCache.get(companyId);
      if (!company || !companyMatchesProvince(company, province)) continue;

      items.push(serviceListPayload(service, company));
      if (items.length >= limit) break;
    }

    context.res = json(200, {
      items,
      nextCursor: "",
    });
  } catch (error) {
    context.log.error(error);
    context.res = serverError(error);
  }
}

async function handlePublicCompanyProfile(context, req) {
  try {
    if (String(req.method || "").toUpperCase() !== "GET") {
      context.res = json(405, { error: "Method not allowed" });
      return;
    }

    const slug = normalizeSearch(req.params?.slug, 160);
    if (!slug) {
      context.res = json(404, { error: "Company not found" });
      return;
    }

    const config = getConfig();
    await ensureCompaniesTable(config);
    await ensureServicesTable(config);

    const companiesTable = getTableClient(config.companiesTable, config);
    const company = await findPublishedCompanyBySlug(slug, companiesTable);
    if (!company) {
      context.res = json(404, { error: "Company not found" });
      return;
    }

    const services = await listPublishedServices(config, company.rowKey);
    const requestedServiceSlug = normalizeSearch(req.query?.service, 160);
    const selectedServiceSlug = services.some((service) => service.slug === requestedServiceSlug)
      ? requestedServiceSlug
      : "";

    context.res = json(200, companyProfilePayload(company, services, selectedServiceSlug));
  } catch (error) {
    context.log.error(error);
    context.res = serverError(error);
  }
}

module.exports = {
  handlePublicCompanyProfile,
  handlePublicServices,
};
