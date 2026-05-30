const crypto = require("crypto");

const ALLOWED_IMAGE_TYPES = new Set(["logo", "cover", "gallery"]);
const ALLOWED_CONTENT_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;
const MAX_IMAGES_PER_PROVIDER = 6;

function cleanText(value, maxLength = 500) {
  return String(value || "").trim().slice(0, maxLength);
}

function isEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || "").trim());
}

function slugify(value) {
  const base = cleanText(value, 80)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return base || `provider-${crypto.randomUUID().slice(0, 8)}`;
}

function safeExtension(fileName, contentType) {
  const ext = String(fileName || "").toLowerCase().match(/\.(jpe?g|png|webp)$/)?.[1];
  if (ext === "jpeg") return "jpg";
  if (ext) return ext;
  if (contentType === "image/jpeg") return "jpg";
  if (contentType === "image/png") return "png";
  if (contentType === "image/webp") return "webp";
  return "";
}

function isSafeId(value) {
  return /^[a-z0-9][a-z0-9-]{0,119}$/i.test(String(value || ""));
}

function validateProviderPayload(body) {
  const provider = {
    name: cleanText(body.name || body.companyName, 120),
    email: cleanText(body.email, 160),
    phone: cleanText(body.phone || body.whatsapp, 40),
    category: cleanText(body.category, 80),
    location: cleanText(body.location, 120),
    description: cleanText(body.description, 900),
    price: cleanText(body.price, 80),
    website: cleanText(body.website, 240),
  };

  const missing = ["name", "email", "phone", "category", "location", "description"].filter(
    (field) => !provider[field],
  );
  if (missing.length) {
    return { error: "Missing required fields", details: { missing } };
  }
  if (!isEmail(provider.email)) {
    return { error: "Invalid email" };
  }
  return { provider };
}

function validateCompanyRegistrationPayload(body) {
  const phone = cleanText(
    body.phone || body.telephone || body.localPhone || body.phoneLocal || body.telefono,
    40,
  );
  const company = {
    name: cleanText(body.companyName || body.name, 120),
    email: cleanText(body.email, 160).toLowerCase(),
    whatsapp: cleanText(
      body.whatsapp || body.whatsApp || body.whatsappNumber || body.whatsappPhone || body.phone,
      40,
    ),
    phone,
    website: cleanText(body.website || body.web || body.webpage || body.url, 240),
    instagram: cleanText(body.instagram || body.instagramUrl || body.instagramHandle, 240),
    facebook: cleanText(body.facebook || body.facebookUrl || body.facebookPage, 240),
    tiktok: cleanText(body.tiktok || body.tikTok || body.tiktokUrl || body.tikTokUrl, 240),
    province: cleanText(body.province, 80),
    canton: cleanText(body.canton, 120),
    description: cleanText(body.description, 900),
  };

  const missing = ["name", "email", "whatsapp", "province", "description"].filter(
    (field) => !company[field],
  );
  if (missing.length) {
    return { error: "Missing required fields", details: { missing } };
  }
  if (!isEmail(company.email)) {
    return { error: "Invalid email" };
  }

  return { company };
}

function validateUploadPayload(body) {
  const providerId = cleanText(body.providerId, 120);
  const fileName = cleanText(body.fileName, 240);
  const contentType = cleanText(body.contentType, 80);
  const imageType = cleanText(body.imageType || "gallery", 40);
  const size = Number(body.size || 0);

  if (!providerId || !fileName || !contentType) {
    return { error: "providerId, fileName and contentType are required" };
  }
  if (!isSafeId(providerId)) {
    return { error: "Invalid providerId" };
  }
  if (!ALLOWED_IMAGE_TYPES.has(imageType)) {
    return { error: "Invalid imageType" };
  }
  if (!ALLOWED_CONTENT_TYPES.has(contentType)) {
    return { error: "Invalid contentType" };
  }
  if (size && size > MAX_IMAGE_SIZE_BYTES) {
    return { error: "Image is too large" };
  }

  const extension = safeExtension(fileName, contentType);
  if (!extension) {
    return { error: "Invalid image extension" };
  }

  return { providerId, fileName, contentType, imageType, extension, size };
}

module.exports = {
  ALLOWED_CONTENT_TYPES,
  MAX_IMAGE_SIZE_BYTES,
  MAX_IMAGES_PER_PROVIDER,
  cleanText,
  isSafeId,
  slugify,
  validateCompanyRegistrationPayload,
  validateProviderPayload,
  validateUploadPayload,
};
