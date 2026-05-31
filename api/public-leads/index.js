const crypto = require("crypto");
const {
  ensureCompaniesTable,
  ensureLeadsTable,
  ensureServicesTable,
  getConfig,
  getTableClient,
} = require("../shared/azure");
const { sendLeadEmailToCompany } = require("../shared/email");
const { enforceAllowedOrigin } = require("../shared/guard");
const { badRequest, json, serverError } = require("../shared/http");
const { cleanText } = require("../shared/validation");

function isEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || "").trim());
}

function isSafeEntityId(value) {
  return /^[a-z0-9][a-z0-9_-]{0,139}$/i.test(String(value || ""));
}

function validateLeadPayload(body) {
  const lead = {
    companyId: cleanText(body.companyId, 140),
    serviceId: cleanText(body.serviceId, 140),
    name: cleanText(body.name, 120),
    email: cleanText(body.email, 160).toLowerCase(),
    phone: cleanText(body.phone || body.whatsapp, 40),
    eventType: cleanText(body.eventType, 120),
    eventDate: cleanText(body.eventDate || body.date, 40),
    guests: cleanText(body.guests, 40),
    message: cleanText(body.message, 1200),
  };

  const missing = ["companyId", "serviceId", "name", "email", "phone", "message"].filter(
    (field) => !lead[field],
  );
  if (missing.length) return { error: "Missing required fields", details: { missing } };
  if (!isSafeEntityId(lead.companyId) || !isSafeEntityId(lead.serviceId)) {
    return { error: "Invalid companyId or serviceId" };
  }
  if (!isEmail(lead.email)) return { error: "Invalid email" };

  return { lead };
}

async function getPublishedCompany(companyId, config) {
  try {
    const company = await getTableClient(config.companiesTable, config).getEntity("company", companyId);
    if (company.status !== "published") return null;
    return company;
  } catch (error) {
    if (error.statusCode === 404) return null;
    throw error;
  }
}

async function getPublishedService(companyId, serviceId, config) {
  try {
    const service = await getTableClient(config.servicesTable, config).getEntity(companyId, serviceId);
    if (service.status !== "published") return null;
    return service;
  } catch (error) {
    if (error.statusCode === 404) return null;
    throw error;
  }
}

module.exports = async function createPublicLead(context, req) {
  try {
    if (String(req.method || "").toUpperCase() !== "POST") {
      context.res = json(405, { error: "Method not allowed" });
      return;
    }

    const validation = validateLeadPayload(req.body || {});
    if (validation.error) {
      context.res = badRequest(validation.error, validation.details);
      return;
    }

    const config = getConfig();
    const forbidden = enforceAllowedOrigin(req, config);
    if (forbidden) {
      context.res = forbidden;
      return;
    }

    await ensureCompaniesTable(config);
    await ensureServicesTable(config);
    await ensureLeadsTable(config);

    const lead = validation.lead;
    const company = await getPublishedCompany(lead.companyId, config);
    const service = company
      ? await getPublishedService(lead.companyId, lead.serviceId, config)
      : null;
    if (!company || !service) {
      context.res = json(404, { error: "Service not found" });
      return;
    }
    if (!company.email) {
      context.res = json(409, { error: "Company cannot receive leads" });
      return;
    }

    const now = new Date().toISOString();
    const leadId = `lead_${crypto.randomUUID()}`;
    const entity = {
      partitionKey: lead.companyId,
      rowKey: leadId,
      id: leadId,
      companyId: lead.companyId,
      serviceId: lead.serviceId,
      serviceName: service.name || "",
      companyName: company.name || "",
      name: lead.name,
      email: lead.email,
      phone: lead.phone,
      eventType: lead.eventType,
      eventDate: lead.eventDate,
      guests: lead.guests,
      message: lead.message,
      status: "received",
      emailStatus: "pending",
      createdAt: now,
      updatedAt: now,
    };
    const leadsTable = getTableClient(config.leadsTable, config);
    await leadsTable.createEntity(entity);

    try {
      await sendLeadEmailToCompany({ company, service, lead: entity }, config);
      await leadsTable.updateEntity(
        {
          partitionKey: lead.companyId,
          rowKey: leadId,
          emailStatus: "sent",
          emailSentAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        "Merge",
      );
    } catch (error) {
      context.log.warn(`Lead email failed: ${error.message}`);
      await leadsTable.updateEntity(
        {
          partitionKey: lead.companyId,
          rowKey: leadId,
          emailStatus: "failed",
          updatedAt: new Date().toISOString(),
        },
        "Merge",
      );
      context.res = json(502, {
        error: "Lead email could not be sent",
        leadId,
      });
      return;
    }

    context.res = json(201, {
      ok: true,
      leadId,
    });
  } catch (error) {
    context.log.error(error);
    context.res = serverError(error);
  }
};
