const API_BASE = "/api";
const AUTH_KEY = "puntoEventoAdminAuth";
const SERVICES_KEY = "puntoEventoDemoServices";
const DEMO_PARAM_VALUE = "local";
const INVALID_ADMIN_CREDENTIALS_MESSAGE = "Credenciales inválidas. Verifica usuario y contraseña.";
const SERVICE_STATUSES = ["draft", "pending", "published", "rejected", "inactive"];
const CATEGORY_OPTIONS = ["Bodas", "Salones", "Catering", "Corporativos", "Fiestas infantiles", "Decoracion"];
const EVENT_TYPE_OPTIONS = [
  "Bodas",
  "Cumpleaños",
  "Eventos corporativos",
  "Baby Shower",
  "Graduaciones",
  "Fiestas infantiles",
];
const INTERNAL_MODERATION = {
  companies: {
    endpoint: "/internal/companies/pending",
    label: "empresas",
    responseKey: "companies",
  },
  services: {
    endpoint: "/internal/services/pending",
    label: "servicios",
    responseKey: "services",
  },
  uploads: {
    endpoint: "/internal/uploads/pending",
    label: "imágenes",
    responseKey: "uploads",
  },
};

const DEFAULT_SERVICES = [
  {
    id: "service-queques",
    name: "Queques personalizados",
    category: "Catering",
    eventTypes: ["Bodas", "Cumpleaños", "Baby Shower"],
    priceFrom: "CRC 85000",
    status: "published",
    photoCount: 6,
    photos: [
      { name: "queque-boda.jpg", size: 0, type: "image/jpeg" },
      { name: "queque-flores.jpg", size: 0, type: "image/jpeg" },
      { name: "queque-infantil.jpg", size: 0, type: "image/jpeg" },
      { name: "mesa-postres.jpg", size: 0, type: "image/jpeg" },
      { name: "detalle-decorado.jpg", size: 0, type: "image/jpeg" },
      { name: "empaque-evento.jpg", size: 0, type: "image/jpeg" },
    ],
    updatedAt: "2026-05-27",
    description: "Queques decorados para eventos sociales con entrega coordinada.",
  },
  {
    id: "service-wedding-planner",
    name: "Wedding planner",
    category: "Bodas",
    eventTypes: ["Bodas"],
    priceFrom: "CRC 250000",
    status: "pending",
    photoCount: 4,
    photos: [
      { name: "ceremonia.jpg", size: 0, type: "image/jpeg" },
      { name: "timeline.jpg", size: 0, type: "image/jpeg" },
      { name: "montaje.jpg", size: 0, type: "image/jpeg" },
      { name: "recepcion.jpg", size: 0, type: "image/jpeg" },
    ],
    updatedAt: "2026-05-27",
    description: "Planificacion, proveedores y coordinacion del dia del evento.",
  },
  {
    id: "service-mesa-dulce",
    name: "Mesa dulce",
    category: "Catering",
    eventTypes: ["Bodas", "Eventos corporativos", "Cumpleaños"],
    priceFrom: "CRC 120000",
    status: "draft",
    photoCount: 3,
    photos: [
      { name: "mesa-dulce.jpg", size: 0, type: "image/jpeg" },
      { name: "postres-mini.jpg", size: 0, type: "image/jpeg" },
      { name: "montaje-dulce.jpg", size: 0, type: "image/jpeg" },
    ],
    updatedAt: "2026-05-27",
    description: "Mesa dulce personalizada con bocadillos, montaje y decoración.",
  },
];

const state = {
  auth: sessionStorage.getItem(AUTH_KEY) || "",
  providers: [],
  activeTab: "modelo",
  demoMode: false,
  pendingPhotos: [],
  services: loadServices(),
  internal: {
    companies: { items: [], loading: false, loaded: false, error: "" },
    services: { items: [], loading: false, loaded: false, error: "" },
    uploads: { items: [], loading: false, loaded: false, error: "" },
    selectedCompanyId: "",
    previewUrls: new Map(),
  },
};

const $ = (selector, root = document) => root.querySelector(selector);

function escapeHtml(value) {
  return String(value || "").replace(/[&<>"']/g, (char) => {
    const map = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;",
    };
    return map[char];
  });
}

function truncateText(value, maxLength = 180) {
  const text = String(value || "").trim();
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength - 1)}...`;
}

function formatDate(value) {
  return value ? String(value).slice(0, 10) : "-";
}

function parseList(value) {
  if (Array.isArray(value)) return value.filter(Boolean);
  if (!value) return [];
  try {
    const parsed = JSON.parse(String(value));
    return Array.isArray(parsed) ? parsed.filter(Boolean) : [];
  } catch {
    return [];
  }
}

function setStatus(message, tone = "") {
  const status = $("[data-status]");
  if (!status) return;
  status.textContent = message;
  status.dataset.tone = tone;
}

function setLoginMessage(message, isError = false) {
  const messageNode = $("[data-login-message]");
  if (!messageNode) return;
  messageNode.textContent = message;
  messageNode.classList.toggle("is-error", isError);
}

function setDemoMode(enabled) {
  state.demoMode = enabled;
  document.body.classList.toggle("is-demo-mode", enabled);
  const banner = $("[data-demo-banner]");
  if (banner) banner.classList.toggle("is-hidden", !enabled);
  const lock = $("[data-demo-review-lock]");
  if (lock) lock.classList.toggle("is-hidden", !enabled);
  const list = $("[data-provider-list]");
  if (list) list.classList.toggle("is-hidden", enabled);
  const refresh = $("[data-refresh]");
  if (refresh) refresh.disabled = enabled || !state.auth;
}

function authHeaders() {
  return {
    "X-Punto-Admin-Credential": `Basic ${state.auth}`,
    "Content-Type": "application/json",
  };
}

function clearAdminAuth() {
  sessionStorage.removeItem(AUTH_KEY);
  state.auth = "";
}

function isAuthFailureStatus(status) {
  return status === 401 || status === 403;
}

function loadServices() {
  try {
    const stored = localStorage.getItem(SERVICES_KEY);
    if (!stored) return DEFAULT_SERVICES;
    const services = JSON.parse(stored);
    return Array.isArray(services) ? services : DEFAULT_SERVICES;
  } catch {
    return DEFAULT_SERVICES;
  }
}

function saveServices() {
  localStorage.setItem(SERVICES_KEY, JSON.stringify(state.services));
}

function todayStamp() {
  return new Date().toISOString().slice(0, 10);
}

function normalizeStatus(status) {
  return SERVICE_STATUSES.includes(status) ? status : "draft";
}

function normalizeCategory(category) {
  return CATEGORY_OPTIONS.includes(category) ? category : CATEGORY_OPTIONS[0];
}

function normalizeEventTypes(eventTypes) {
  const values = Array.isArray(eventTypes) ? eventTypes : [];
  return values
    .map((value) => (value === "Corporativo" ? "Eventos corporativos" : value))
    .filter((value) => EVENT_TYPE_OPTIONS.includes(value));
}

function photoList(service) {
  if (Array.isArray(service?.photos)) return service.photos;
  const count = Number(service?.photoCount || 0);
  return Array.from({ length: count }, (_, index) => ({
    name: `Foto de referencia ${index + 1}`,
    size: 0,
    type: "image/*",
  }));
}

function renderCatalogControls() {
  const categorySelect = $("[data-category-select]");
  if (categorySelect && !categorySelect.options.length) {
    categorySelect.innerHTML = CATEGORY_OPTIONS.map(
      (category) => `<option value="${escapeHtml(category)}">${escapeHtml(category)}</option>`,
    ).join("");
  }

  const eventTypes = $("[data-event-type-options]");
  if (eventTypes && !eventTypes.children.length) {
    eventTypes.innerHTML = EVENT_TYPE_OPTIONS.map(
      (eventType) => `
        <label class="choice-pill">
          <input type="checkbox" name="eventTypes" value="${escapeHtml(eventType)}">
          <span>${escapeHtml(eventType)}</span>
        </label>
      `,
    ).join("");
  }
}

function renderPhotoPreview(photos = []) {
  const preview = $("[data-photo-preview]");
  if (!preview) return;
  if (!photos.length) {
    preview.innerHTML = '<div class="photo-preview-empty">Sin fotos seleccionadas.</div>';
    return;
  }
  preview.innerHTML = photos
    .map((photo) => {
      const previewMarkup = photo.previewUrl
        ? `<img src="${escapeHtml(photo.previewUrl)}" alt="${escapeHtml(photo.name)}">`
        : '<div class="photo-file-placeholder">IMG</div>';
      return `
        <article class="photo-preview-item">
          ${previewMarkup}
          <span>${escapeHtml(photo.name)}</span>
        </article>
      `;
    })
    .join("");
}

function photoMetadataFromFiles(files) {
  return [...files].map((file) => ({
    name: file.name,
    size: file.size,
    type: file.type || "image/*",
    previewUrl: URL.createObjectURL(file),
  }));
}

async function adminFetch(path, options = {}) {
  const headers = {
    ...authHeaders(),
    ...(options.headers || {}),
  };
  delete headers.Authorization;
  delete headers.authorization;
  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });
  const body = await response.json().catch(() => ({}));

  if (isAuthFailureStatus(response.status)) {
    clearAdminAuth();
    showLogin();
    throw new Error(INVALID_ADMIN_CREDENTIALS_MESSAGE);
  }
  if (response.status === 503) {
    clearAdminAuth();
    showLogin();
    throw new Error(body.error || "Admin no esta configurado. Intenta mas tarde.");
  }
  if (!response.ok) {
    if (response.status === 404) {
      throw new Error("API admin no encontrada. Revisa que el workflow haya desplegado api_location: api.");
    }
    const message = body.error || `No se pudo completar la accion. HTTP ${response.status}`;
    throw new Error(message);
  }
  return body;
}

async function adminFetchWithFallback(primaryPath, fallbackPath, options = {}) {
  try {
    return await adminFetch(primaryPath, options);
  } catch (error) {
    if (!String(error.message || "").includes("API admin no encontrada") || !fallbackPath) {
      throw error;
    }
    return adminFetch(fallbackPath, options);
  }
}

async function adminFetchBlob(path) {
  const headers = authHeaders();
  delete headers.Authorization;
  delete headers.authorization;
  const response = await fetch(path, {
    headers,
  });

  if (isAuthFailureStatus(response.status)) {
    clearAdminAuth();
    showLogin();
    throw new Error(INVALID_ADMIN_CREDENTIALS_MESSAGE);
  }
  if (!response.ok) {
    throw new Error(`No se pudo cargar la vista previa. HTTP ${response.status}`);
  }
  return response.blob();
}

function showLogin() {
  $("[data-login-panel]").classList.remove("is-hidden");
  $("[data-admin-panel]").classList.add("is-hidden");
  $("[data-refresh]").disabled = true;
  setDemoMode(false);
}

function showAdmin() {
  $("[data-login-panel]").classList.add("is-hidden");
  $("[data-admin-panel]").classList.remove("is-hidden");
  $("[data-refresh]").disabled = state.demoMode;
  renderCatalogControls();
  renderServices();
  setActiveTab(state.activeTab);
}

function showDemo() {
  clearAdminAuth();
  state.providers = [];
  state.activeTab = "empresa";
  setDemoMode(true);
  showAdmin();
  setStatus("Modo local de referencia activo.");
  const count = $("[data-count]");
  if (count) count.textContent = "Modo local";
}

function imageMarkup(provider) {
  if (!provider.images.length) {
    return '<div class="admin-empty">Este registro no tiene imágenes pendientes.</div>';
  }

  return `
    <div class="admin-images">
      ${provider.images
        .map((image) => {
          const checked = image.status === "pending" ? "checked" : "";
          const label = image.originalFileName || image.type || "Imagen legacy";
          return `
            <article class="admin-image">
              <div class="admin-image-placeholder">
                <strong>${escapeHtml(image.type || "Imagen")}</strong>
                <span>${escapeHtml(label)}</span>
                <span>${escapeHtml(image.status || "Sin estado")}</span>
              </div>
              <label>
                <input type="checkbox" data-image-id="${escapeHtml(image.id)}" ${checked}>
                Aprobar ${escapeHtml(image.type)}
              </label>
            </article>
          `;
        })
        .join("")}
    </div>
  `;
}

function providerMarkup(provider) {
  return `
    <article class="admin-provider" data-provider-id="${escapeHtml(provider.id)}">
      <div class="admin-provider-header">
        <div>
          <p class="eyebrow">Pendiente</p>
          <h2>${escapeHtml(provider.name)}</h2>
          <p>${escapeHtml(provider.id)}</p>
        </div>
        <a class="ghost-button" href="mailto:${escapeHtml(provider.email)}">Contactar</a>
      </div>
      <div class="admin-meta">
        <div><strong>Categoria</strong>${escapeHtml(provider.category)}</div>
        <div><strong>Zona</strong>${escapeHtml(provider.location)}</div>
        <div><strong>Telefono</strong>${escapeHtml(provider.phone)}</div>
        <div><strong>Email</strong>${escapeHtml(provider.email)}</div>
      </div>
      <div class="admin-description">
        <strong>Descripcion</strong>
        ${escapeHtml(provider.description)}
      </div>
      ${imageMarkup(provider)}
      <div class="admin-actions">
        <button class="primary-button" type="button" data-approve>Aprobar y publicar</button>
        <button class="secondary-button" type="button" data-reject>Rechazar</button>
      </div>
    </article>
  `;
}

function renderProviders() {
  const list = $("[data-provider-list]");
  $("[data-count]").textContent = `${state.providers.length} pendiente(s)`;
  if (!state.providers.length) {
    list.innerHTML = '<div class="admin-empty">No hay proveedores pendientes.</div>';
    return;
  }
  list.innerHTML = state.providers.map(providerMarkup).join("");
}

function internalStatusLabel(status) {
  const labels = {
    draft: "Borrador",
    pending: "Pendiente",
    published: "Publicado",
    rejected: "Rechazado",
    inactive: "Inactivo",
    suspended: "Suspendido",
  };
  return labels[status] || status || "-";
}

function statusClass(status) {
  return ["draft", "pending", "published", "rejected", "inactive"].includes(status) ? status : "draft";
}

function setInternalState(type, message, status = "pending") {
  const node = $(`[data-internal-state="${type}"]`);
  if (!node) return;
  node.textContent = message;
  node.className = `status-pill status-${statusClass(status)}`;
}

function internalActionsMarkup(type, ids) {
  const attrs = Object.entries(ids)
    .map(([key, value]) => `data-${key}="${escapeHtml(value)}"`)
    .join(" ");
  return `
    <div class="internal-item-actions">
      <button class="primary-button compact-button" type="button" data-internal-action="approve" data-internal-type="${type}" ${attrs}>Aprobar</button>
      <button class="secondary-button compact-button" type="button" data-internal-action="reject" data-internal-type="${type}" ${attrs}>Rechazar</button>
    </div>
  `;
}

function internalActionButton(type, action, ids, disabledReason = "", customLabel = "") {
  const attrs = Object.entries(ids)
    .map(([key, value]) => `data-${key}="${escapeHtml(value)}"`)
    .join(" ");
  const label = customLabel || (action === "approve" ? "Aprobar" : "Rechazar");
  return `<button class="${action === "approve" ? "primary-button" : "secondary-button"} compact-button" type="button" data-internal-action="${action}" data-internal-type="${type}" ${attrs} ${disabledReason ? "disabled" : ""} title="${escapeHtml(disabledReason)}">${label}</button>`;
}

function scopedInternalActionsMarkup(type, ids, disabledApproveReason = "", approveLabel = "", rejectLabel = "") {
  return `
    <div class="internal-item-actions">
      ${internalActionButton(type, "approve", ids, disabledApproveReason, approveLabel)}
      ${internalActionButton(type, "reject", ids, "", rejectLabel)}
    </div>
    ${disabledApproveReason ? `<p class="dependency-note">${escapeHtml(disabledApproveReason)}</p>` : ""}
  `;
}

function companyCanBeReviewed(company) {
  return ["pending", "draft"].includes(String(company?.status || ""));
}

function companyActionNote(company) {
  const status = String(company?.status || "");
  if (status === "published") {
    return "Empresa aprobada. Revisa los servicios pendientes de esta empresa.";
  }
  if (status === "rejected") {
    return "Empresa rechazada. No hay accion principal de empresa en este estado.";
  }
  return "Empresa sin accion principal disponible en este estado.";
}

function companyItemMarkup(company) {
  const companyId = company.companyId || company.id || "";
  const location = [company.province, company.canton].filter(Boolean).join(", ") || "-";
  return `
    <article class="internal-item">
      <div class="internal-item-header">
        <div>
          <span class="status-pill status-${statusClass(company.status)}">${escapeHtml(internalStatusLabel(company.status))}</span>
          <h4>${escapeHtml(company.name || "Empresa sin nombre")}</h4>
        </div>
      </div>
      <p>${escapeHtml(truncateText(company.description))}</p>
      <div class="internal-item-meta">
        <div><strong>ID</strong><span>${escapeHtml(companyId)}</span></div>
        <div><strong>Email</strong><span>${escapeHtml(company.email || "-")}</span></div>
        <div><strong>Telefono</strong><span>${escapeHtml(company.whatsapp || "-")}</span></div>
        <div><strong>Zona</strong><span>${escapeHtml(location)}</span></div>
        <div><strong>Plan</strong><span>${escapeHtml(company.plan || "-")}</span></div>
        <div><strong>Creado</strong><span>${escapeHtml(formatDate(company.createdAt))}</span></div>
      </div>
      <div class="internal-item-actions">
        <button class="ghost-button compact-button" type="button" data-select-company="${escapeHtml(companyId)}">Ver expediente</button>
      </div>
    </article>
  `;
}

function serviceItemMarkup(service) {
  const companyId = service.companyId || "";
  const serviceId = service.serviceId || service.id || "";
  const eventTypes = parseList(service.eventTypes);
  const gallery = parseList(service.gallery);
  const imageCount = Number(Boolean(service.coverUrl)) + gallery.length;
  return `
    <article class="internal-item">
      <div class="internal-item-header">
        <div>
          <span class="status-pill status-${statusClass(service.status)}">${escapeHtml(internalStatusLabel(service.status))}</span>
          <h4>${escapeHtml(service.name || "Servicio sin nombre")}</h4>
        </div>
      </div>
      <p>${escapeHtml(truncateText(service.description))}</p>
      <div class="internal-item-meta">
        <div><strong>Empresa</strong><span>${escapeHtml(service.companyName || companyId || "-")}</span></div>
        <div><strong>Servicio ID</strong><span>${escapeHtml(serviceId)}</span></div>
        <div><strong>Categoria</strong><span>${escapeHtml(service.category || "-")}</span></div>
        <div><strong>Eventos</strong><span>${escapeHtml(eventTypes.join(", ") || "-")}</span></div>
        <div><strong>Precio</strong><span>${escapeHtml(service.priceFrom || "-")}</span></div>
        <div><strong>Imagenes</strong><span>${imageCount} archivo(s)</span></div>
      </div>
      <div class="internal-item-actions">
        <button class="ghost-button compact-button" type="button" data-select-company="${escapeHtml(companyId)}">Ver expediente</button>
      </div>
    </article>
  `;
}

function uploadItemMarkup(upload) {
  const companyId = upload.companyId || "";
  const uploadId = upload.uploadId || upload.id || "";
  return `
    <article class="internal-item">
      <div class="internal-item-header">
        <div>
          <span class="status-pill status-${statusClass(upload.status)}">${escapeHtml(internalStatusLabel(upload.status))}</span>
          <h4>${escapeHtml(upload.fileName || uploadId || "Imagen pendiente")}</h4>
        </div>
      </div>
      <div class="internal-item-meta">
        <div><strong>Imagen ID</strong><span>${escapeHtml(uploadId)}</span></div>
        <div><strong>Empresa ID</strong><span>${escapeHtml(companyId)}</span></div>
        <div><strong>Ambito</strong><span>${escapeHtml(upload.scope || "-")}</span></div>
        <div><strong>Servicio ID</strong><span>${escapeHtml(upload.serviceId || "-")}</span></div>
        <div><strong>Tipo</strong><span>${escapeHtml(imageTypeLabel(upload.imageType))}</span></div>
        <div><strong>Archivo</strong><span>${escapeHtml(upload.contentType || "-")} - ${escapeHtml(String(upload.size || "-"))} bytes</span></div>
      </div>
      <div class="internal-item-actions">
        <button class="ghost-button compact-button" type="button" data-select-company="${escapeHtml(companyId)}">Ver expediente</button>
      </div>
    </article>
  `;
}

function companyIdOf(item) {
  return item?.companyId || item?.id || "";
}

function getCaseCompanies() {
  const map = new Map();
  state.internal.companies.items.forEach((company) => {
    const companyId = companyIdOf(company);
    if (companyId) map.set(companyId, { ...company, companyId });
  });
  state.internal.services.items.forEach((service) => {
    const companyId = companyIdOf(service);
    if (companyId && !map.has(companyId)) {
      map.set(companyId, {
        companyId,
        name: service.companyName || companyId,
        slug: service.companySlug || "",
        status: service.companyStatus || "published",
        description: "Empresa incluida por servicios revisables.",
      });
    }
  });
  state.internal.uploads.items.forEach((upload) => {
    const companyId = companyIdOf(upload);
    if (companyId && !map.has(companyId)) {
      map.set(companyId, {
        companyId,
        name: upload.companyName || companyId,
        status: upload.companyStatus || "",
        description: "Empresa incluida por imágenes pendientes.",
      });
    }
  });
  return [...map.values()];
}

function selectedCaseCompany() {
  const companies = getCaseCompanies();
  if (!companies.length) return null;
  if (!state.internal.selectedCompanyId || !companies.some((company) => companyIdOf(company) === state.internal.selectedCompanyId)) {
    state.internal.selectedCompanyId = companyIdOf(companies[0]);
  }
  return companies.find((company) => companyIdOf(company) === state.internal.selectedCompanyId) || companies[0];
}

function servicesForCompany(companyId) {
  return state.internal.services.items.filter((service) => companyIdOf(service) === companyId);
}

function uploadsForCompany(companyId) {
  return state.internal.uploads.items.filter((upload) => companyIdOf(upload) === companyId);
}

function serviceIdOf(service) {
  return service?.serviceId || service?.id || "";
}

function serviceImages(service) {
  const companyId = companyIdOf(service);
  const serviceId = serviceIdOf(service);
  const imagesById = new Map();
  const addImage = (image) => {
    const uploadId = image?.uploadId || image?.id || image?.previewUrl || image?.fileName || "";
    if (!uploadId) return;
    imagesById.set(uploadId, {
      ...image,
      companyId: image.companyId || companyId,
      serviceId: image.serviceId || serviceId,
      uploadId,
    });
  };

  if (Array.isArray(service?.images)) {
    service.images.forEach(addImage);
  }
  uploadsForCompany(companyId)
    .filter((upload) => upload.scope === "service" && upload.serviceId === serviceId)
    .forEach(addImage);

  return [...imagesById.values()].sort((a, b) => {
    const rank = (image) => (image.imageType === "cover" ? 0 : 1);
    return rank(a) - rank(b);
  });
}

function imageTypeLabel(value) {
  const type = String(value || "").toLowerCase();
  if (type === "cover") return "Portada";
  if (type === "gallery") return "Galeria";
  return value || "-";
}

function imageRoleLabel(image) {
  const label = imageTypeLabel(image.imageType);
  return label === "-" ? "Imagen" : label;
}

function serviceImagesMarkup(service) {
  const images = serviceImages(service);
  if (!images.length) {
    return '<div class="admin-empty compact-empty">Este servicio no tiene imágenes pendientes asociadas.</div>';
  }

  return `
    <div class="service-image-grid">
      ${images
        .map((image) => {
          const uploadId = image.uploadId || image.id || "";
          const previewUrl = image.previewUrl || "";
          const label = image.fileName || uploadId || "Imagen pendiente";
          const previewMarkup = previewUrl
            ? `<img alt="${escapeHtml(label)}" data-internal-preview-src="${escapeHtml(previewUrl)}">`
            : '<div class="service-image-placeholder">Sin vista previa</div>';
          return `
            <figure class="service-image-card" data-service-image="${escapeHtml(uploadId)}">
              ${previewMarkup}
              <figcaption>
                <span class="status-pill status-${statusClass(image.status)}">${escapeHtml(internalStatusLabel(image.status))}</span>
                <strong>${escapeHtml(imageRoleLabel(image))}</strong>
                <small>${escapeHtml(label)}</small>
              </figcaption>
            </figure>
          `;
        })
        .join("")}
    </div>
  `;
}

function loadInternalPreviews() {
  document.querySelectorAll("[data-internal-preview-src]").forEach((image) => {
    const src = image.dataset.internalPreviewSrc;
    if (!src || image.dataset.previewLoaded === "true") return;
    image.dataset.previewLoaded = "true";
    if (state.internal.previewUrls.has(src)) {
      image.src = state.internal.previewUrls.get(src);
      return;
    }

    adminFetchBlob(src)
      .then((blob) => {
        const objectUrl = URL.createObjectURL(blob);
        state.internal.previewUrls.set(src, objectUrl);
        image.src = objectUrl;
      })
      .catch(() => {
        image.replaceWith(Object.assign(document.createElement("div"), {
          className: "service-image-placeholder",
          textContent: "Vista previa no disponible",
        }));
      });
  });
}

function caseCompanyCard(company) {
  const companyId = companyIdOf(company);
  return `
    <button class="case-company-button ${companyId === state.internal.selectedCompanyId ? "is-active" : ""}" type="button" data-select-company="${escapeHtml(companyId)}">
      <span class="status-pill status-${statusClass(company.status)}">${escapeHtml(internalStatusLabel(company.status))}</span>
      <strong>${escapeHtml(company.name || companyId)}</strong>
      <small>${escapeHtml(companyId)}</small>
    </button>
  `;
}

function safeCompanyContactValue(value) {
  const text = String(value ?? "").trim();
  if (!text || text === "undefined" || text === "null") return "";
  if (/sig=|tokenHash|sessionHash|pendingBlobName|uploadUrl/i.test(text)) return "";
  return text;
}

function companyMetaRow(label, value) {
  const cleanValue = safeCompanyContactValue(value);
  if (!cleanValue) return "";
  return `<div><strong>${escapeHtml(label)}</strong><span>${escapeHtml(cleanValue)}</span></div>`;
}

function caseCompanyDetail(company) {
  if (!company) return '<div class="admin-empty">Selecciona una empresa para revisar su expediente.</div>';
  const companyId = companyIdOf(company);
  const location = [company.province, company.canton].map(safeCompanyContactValue).filter(Boolean).join(", ");
  const description = safeCompanyContactValue(company.description);
  const contactRows = [
    companyMetaRow("ID", companyId),
    companyMetaRow("Email", company.email),
    companyMetaRow("WhatsApp", company.whatsapp),
    companyMetaRow("Telefono local", company.phone),
    companyMetaRow("Instagram", company.instagram),
    companyMetaRow("Facebook", company.facebook),
    companyMetaRow("Sitio web", company.website),
    companyMetaRow("TikTok", company.tiktok),
    companyMetaRow("Zona", location),
  ].join("");
  const companyActions = companyCanBeReviewed(company)
    ? scopedInternalActionsMarkup("companies", { "company-id": companyId }, "", "Aprobar empresa", "Rechazar empresa")
    : `<p class="admin-note compact-empty">${escapeHtml(companyActionNote(company))}</p>`;
  return `
    <article class="internal-item">
      <div class="internal-item-header">
        <div>
          <span class="status-pill status-${statusClass(company.status)}">${escapeHtml(internalStatusLabel(company.status))}</span>
          <h4>${escapeHtml(company.name || "Empresa sin nombre")}</h4>
        </div>
      </div>
      ${description ? `<p>${escapeHtml(truncateText(description, 240))}</p>` : ""}
      <div class="internal-item-meta">
        ${contactRows}
      </div>
      ${companyActions}
    </article>
  `;
}

function caseServiceMarkup(service, company) {
  const companyPublished = company?.status === "published" || service.companyStatus === "published";
  const companyId = companyIdOf(service);
  const serviceId = serviceIdOf(service);
  const disabledReason = companyPublished ? "" : "Publica la empresa antes de aprobar servicios.";
  const images = serviceImages(service);
  const approveLabel = images.length ? "Aprobar servicio e imágenes" : "Aprobar servicio";
  return `
    <article class="internal-item">
      <div class="internal-item-header">
        <div>
          <span class="status-pill status-${statusClass(service.status)}">${escapeHtml(internalStatusLabel(service.status))}</span>
          <h4>${escapeHtml(service.name || "Servicio sin nombre")}</h4>
        </div>
      </div>
      <p>${escapeHtml(truncateText(service.description))}</p>
      <div class="internal-item-meta">
        <div><strong>Servicio ID</strong><span>${escapeHtml(serviceId)}</span></div>
        <div><strong>Categoria</strong><span>${escapeHtml(service.category || "-")}</span></div>
        <div><strong>Precio</strong><span>${escapeHtml(service.priceFrom || "-")}</span></div>
        <div><strong>Empresa</strong><span>${escapeHtml(company?.name || service.companyName || companyId || "-")}</span></div>
      </div>
      <div class="service-images-section">
        <div>
          <strong>Imagenes del servicio</strong>
          <p>Se publican junto con el servicio aprobado.</p>
        </div>
        ${serviceImagesMarkup(service)}
      </div>
      ${scopedInternalActionsMarkup("services", { "company-id": companyId, "service-id": serviceId }, disabledReason, approveLabel, "Rechazar servicio")}
    </article>
  `;
}

function renderCompanyCase() {
  const list = $("[data-case-company-list]");
  const detail = $("[data-case-detail]");
  const servicesNode = $("[data-case-services]");
  if (!list || !detail || !servicesNode) return;
  const companies = getCaseCompanies();
  const company = selectedCaseCompany();
  if (!companies.length || !company) {
    list.innerHTML = '<div class="admin-empty">No hay expedientes con actividad.</div>';
    detail.innerHTML = '<div class="admin-empty">Carga el modelo nuevo para seleccionar una empresa.</div>';
    servicesNode.innerHTML = '<div class="admin-empty">Sin servicios.</div>';
    return;
  }
  const companyId = companyIdOf(company);
  const scopedServices = servicesForCompany(companyId);
  list.innerHTML = companies.map(caseCompanyCard).join("");
  detail.innerHTML = caseCompanyDetail(company);
  servicesNode.innerHTML = scopedServices.length
    ? scopedServices.map((service) => caseServiceMarkup(service, company)).join("")
    : '<div class="admin-empty">Esta empresa no tiene servicios revisables en el listado actual.</div>';
  loadInternalPreviews();
}

function renderInternalList(type) {
  const section = state.internal[type];
  const list = $(`[data-internal-list="${type}"]`);
  const count = $(`[data-internal-count="${type}"]`);
  if (!section) return;

  if (count) count.textContent = String(section.items.length);
  if (!list) return;
  if (section.loading) {
    setInternalState(type, "Cargando", "pending");
    list.innerHTML = '<div class="admin-empty">Cargando pendientes...</div>';
    return;
  }
  if (section.error) {
    setInternalState(type, "Error", "rejected");
    list.innerHTML = `<div class="admin-empty internal-error">${escapeHtml(section.error)}</div>`;
    return;
  }
  if (!section.items.length) {
    setInternalState(type, "Vacio", "published");
    list.innerHTML = '<div class="admin-empty">No hay items pendientes.</div>';
    return;
  }

  setInternalState(type, `${section.items.length} item(s)`, "pending");
  const renderers = {
    companies: companyItemMarkup,
    services: serviceItemMarkup,
    uploads: uploadItemMarkup,
  };
  list.innerHTML = section.items.map(renderers[type]).join("");
}

function renderInternalModeration() {
  Object.keys(INTERNAL_MODERATION).forEach(renderInternalList);
  renderCompanyCase();
  if (state.activeTab === "modelo") {
    const total = internalSections().reduce((sum, section) => sum + section.items.length, 0);
    const count = $("[data-count]");
    if (count) count.textContent = `${total} item(s) modelo nuevo`;
  }
}

function internalSections() {
  return Object.keys(INTERNAL_MODERATION).map((type) => state.internal[type]);
}

function internalItemsFromResponse(type, response) {
  const key = INTERNAL_MODERATION[type]?.responseKey;
  const candidates = [
    response,
    response?.items,
    key ? response?.[key] : null,
    response?.data,
    response?.result,
    response?.result?.items,
    key ? response?.result?.[key] : null,
  ];
  const items = candidates.find(Array.isArray);

  if (items) return items;
  if (response && typeof response === "object" && Object.keys(response).length) {
    throw new Error(`Respuesta invalida de ${INTERNAL_MODERATION[type].label}.`);
  }
  return [];
}

async function loadInternalList(type) {
  const section = state.internal[type];
  if (!section) return;
  section.loading = true;
  section.error = "";
  renderInternalList(type);
  try {
    const response = await adminFetch(INTERNAL_MODERATION[type].endpoint);
    section.items = internalItemsFromResponse(type, response);
    section.loaded = true;
  } catch (error) {
    section.error = error.message;
  } finally {
    section.loading = false;
    renderInternalModeration();
  }
}

async function loadInternalModeration() {
  setStatus("Cargando modelo nuevo...");
  await Promise.all(Object.keys(INTERNAL_MODERATION).map(loadInternalList));
  const hasErrors = internalSections().some((section) => section.error);
  setStatus(hasErrors ? "Modelo nuevo actualizado con errores." : "Modelo nuevo actualizado.");
}

function internalActionPath(type, action, ids) {
  if (type === "companies") {
    if (!ids.companyId) return "";
    return `/internal/companies/${encodeURIComponent(ids.companyId)}/${action}`;
  }
  if (type === "services") {
    if (!ids.companyId || !ids.serviceId) return "";
    return `/internal/services/${encodeURIComponent(ids.companyId)}/${encodeURIComponent(ids.serviceId)}/${action}`;
  }
  if (type === "uploads") {
    if (!ids.companyId || !ids.uploadId) return "";
    return `/internal/uploads/${encodeURIComponent(ids.companyId)}/${encodeURIComponent(ids.uploadId)}/${action}`;
  }
  return "";
}

function companyApproveMessage(response = {}) {
  const inviteStatus = response?.invite?.status || "";
  if (inviteStatus === "email_sent") {
    return {
    message: "Empresa aprobada e invitación enviada.",
      tone: "success",
    };
  }
  if (inviteStatus === "active_exists") {
    return {
      message: "Empresa aprobada; ya existia invitacion activa.",
      tone: "warning",
    };
  }
  if (["email_failed", "missing_email", "invite_failed"].includes(inviteStatus) || response?.warning) {
    return {
      message: "Empresa aprobada, pero no se pudo enviar la invitación. Reintentar o enviar manualmente.",
      tone: "warning",
    };
  }
  return {
    message: "Empresa aprobada.",
    tone: "success",
  };
}

function internalActionSuccessMessage(type, action, response = {}) {
  if (type === "companies" && action === "approve") {
    return companyApproveMessage(response);
  }
  if (type === "services") {
    return {
      message: action === "approve" ? "Servicio aprobado." : "Servicio rechazado.",
      tone: action === "approve" ? "success" : "warning",
    };
  }
  return {
    message: action === "approve" ? "Item aprobado." : "Item rechazado.",
    tone: action === "approve" ? "success" : "warning",
  };
}

async function handleInternalAction(button) {
  if (state.demoMode) {
    setStatus("La moderación nueva requiere login admin real.");
    return;
  }
  const type = button.dataset.internalType;
  const action = button.dataset.internalAction;
  const ids = {
    companyId: button.dataset.companyId || "",
    serviceId: button.dataset.serviceId || "",
    uploadId: button.dataset.uploadId || "",
  };
  const path = internalActionPath(type, action, ids);
  if (!path) {
    setStatus("No se pudo ejecutar la accion: faltan IDs.");
    return;
  }

  let reason = "";
  if (action === "reject") {
    const promptedReason = window.prompt("Motivo de rechazo");
    if (promptedReason === null) return;
    reason = promptedReason;
    if (reason === "" && !window.confirm("Rechazar sin motivo?")) return;
  }

  button.disabled = true;
  setStatus(action === "approve" ? "Aprobando item..." : "Rechazando item...");
  try {
    const response = await adminFetch(path, {
      method: "POST",
      body: action === "reject" ? JSON.stringify({ reason }) : "{}",
    });
    const result = internalActionSuccessMessage(type, action, response);
    setStatus(result.message, result.tone);
    await loadInternalList(type);
  } catch (error) {
    setStatus(error.message, "error");
    button.disabled = false;
  }
}

function setActiveTab(tabName) {
  state.activeTab = tabName;
  document.querySelectorAll("[data-tab-target]").forEach((button) => {
    const isActive = button.dataset.tabTarget === tabName;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-selected", String(isActive));
  });
  document.querySelectorAll("[data-tab-panel]").forEach((panel) => {
    panel.classList.toggle("is-hidden", panel.dataset.tabPanel !== tabName);
  });
  if (state.demoMode) {
    const count = $("[data-count]");
    if (count) count.textContent = "Modo local";
    setStatus("Empresa y servicios de referencia disponibles sin API.");
  } else if (tabName === "modelo" && state.auth) {
    const needsLoad = internalSections().some((section) => !section.loaded && !section.loading);
    renderInternalModeration();
    if (needsLoad) {
      loadInternalModeration().catch((error) => setStatus(error.message));
    }
  }
}

function serviceStatusLabel(status) {
  const labels = {
    draft: "Borrador",
    pending: "Pendiente",
    published: "Publicado",
    rejected: "Rechazado",
    inactive: "Inactivo",
  };
  return labels[status] || labels.draft;
}

function serviceMarkup(service) {
  const eventTypes = Array.isArray(service.eventTypes) ? service.eventTypes : [];
  const photos = photoList(service);
  return `
    <article class="service-card" data-service-id="${escapeHtml(service.id)}">
      <div class="service-card-header">
        <div>
          <span class="status-pill status-${escapeHtml(normalizeStatus(service.status))}">
            ${escapeHtml(serviceStatusLabel(service.status))}
          </span>
          <h3>${escapeHtml(service.name)}</h3>
        </div>
        <span class="admin-review-label">Revisión</span>
      </div>
      <p>${escapeHtml(service.description)}</p>
      <div class="service-meta">
        <div><strong>Categoria</strong><span>${escapeHtml(service.category)}</span></div>
        <div><strong>Eventos</strong><span>${escapeHtml(eventTypes.join(", "))}</span></div>
        <div><strong>Precio desde</strong><span>${escapeHtml(service.priceFrom)}</span></div>
        <div><strong>Fotos</strong><span>${photos.length} archivo(s)</span></div>
        <div><strong>Actualizado</strong><span>${escapeHtml(service.updatedAt)}</span></div>
      </div>
    </article>
  `;
}

function renderServices() {
  const list = $("[data-services-list]");
  if (!list) return;
  if (!state.services.length) {
    list.innerHTML = '<div class="admin-empty">Todavia no hay servicios de referencia.</div>';
    return;
  }
  list.innerHTML = state.services.map(serviceMarkup).join("");
}

function resetServiceForm(service = null) {
  const form = $("[data-service-form]");
  if (!form) return;
  renderCatalogControls();
  form.reset();
  form.classList.remove("is-hidden");
  state.pendingPhotos = service ? photoList(service) : [];
  $("[data-service-form-mode]").textContent = service ? "Editar servicio" : "Nuevo servicio";
  form.elements.id.value = service?.id || "";
  form.elements.name.value = service?.name || "";
  form.elements.category.value = normalizeCategory(service?.category);
  const selectedEventTypes = normalizeEventTypes(service?.eventTypes);
  form.querySelectorAll('input[name="eventTypes"]').forEach((input) => {
    input.checked = selectedEventTypes.includes(input.value);
  });
  form.elements.priceFrom.value = service?.priceFrom || "";
  form.elements.status.value = normalizeStatus(service?.status);
  form.elements.photoCount.value = state.pendingPhotos.length;
  form.elements.description.value = service?.description || "";
  renderPhotoPreview(state.pendingPhotos);
  form.elements.name.focus();
}

function closeServiceForm() {
  const form = $("[data-service-form]");
  if (!form) return;
  state.pendingPhotos.forEach((photo) => {
    if (photo.previewUrl) URL.revokeObjectURL(photo.previewUrl);
  });
  state.pendingPhotos = [];
  form.reset();
  form.classList.add("is-hidden");
  renderPhotoPreview();
}

function serviceFromForm(form) {
  const formData = new FormData(form);
  const id = String(formData.get("id") || "").trim() || `service-${Date.now()}`;
  const selectedEventTypes = [...form.querySelectorAll('input[name="eventTypes"]:checked')].map(
    (input) => input.value,
  );
  const photos = state.pendingPhotos.map(({ name, size, type }) => ({ name, size, type }));
  return {
    id,
    name: String(formData.get("name") || "").trim(),
    category: normalizeCategory(String(formData.get("category") || "")),
    eventTypes: selectedEventTypes,
    priceFrom: String(formData.get("priceFrom") || "").trim(),
    status: normalizeStatus(String(formData.get("status") || "")),
    photoCount: photos.length,
    photos,
    updatedAt: todayStamp(),
    description: String(formData.get("description") || "").trim(),
  };
}

async function loadProviders() {
  setStatus("Cargando pendientes...");
  const providers = await adminFetchWithFallback(
    "/admin/pending-providers",
    "/providers?admin=pending-providers",
  );
  state.providers = providers;
  showAdmin();
  renderProviders();
  setStatus("Lista actualizada.");
}

function providerFromButton(button) {
  const card = button.closest("[data-provider-id]");
  return {
    card,
    providerId: card?.dataset.providerId || "",
  };
}

document.addEventListener("submit", async (event) => {
  if (event.target.matches("[data-login-form]")) {
    event.preventDefault();
    const form = new FormData(event.target);
    state.auth = btoa(`${form.get("username")}:${form.get("password")}`);
    setLoginMessage("Validando credenciales...");
    try {
      await loadProviders();
      sessionStorage.setItem(AUTH_KEY, state.auth);
      setLoginMessage("Las credenciales se validan contra la API de Azure.");
    } catch (error) {
      clearAdminAuth();
      showLogin();
      setLoginMessage(error.message || INVALID_ADMIN_CREDENTIALS_MESSAGE, true);
    }
    return;
  }

  if (event.target.matches("[data-service-form]")) {
    event.preventDefault();
    const service = serviceFromForm(event.target);
    if (!service.eventTypes.length) {
      setStatus("Selecciona al menos un tipo de evento.");
      return;
    }
    const existingIndex = state.services.findIndex((item) => item.id === service.id);
    if (existingIndex >= 0) {
      state.services.splice(existingIndex, 1, service);
    } else {
      state.services.unshift(service);
    }
    saveServices();
    renderServices();
    closeServiceForm();
    setStatus("Servicio de referencia guardado localmente.");
  }
});

document.addEventListener("change", (event) => {
  if (!event.target.matches("[data-service-photos]")) return;
  state.pendingPhotos.forEach((photo) => {
    if (photo.previewUrl) URL.revokeObjectURL(photo.previewUrl);
  });
  state.pendingPhotos = photoMetadataFromFiles(event.target.files || []);
  const form = event.target.closest("[data-service-form]");
  if (form?.elements.photoCount) {
    form.elements.photoCount.value = state.pendingPhotos.length;
  }
  renderPhotoPreview(state.pendingPhotos);
});

document.addEventListener("click", async (event) => {
  const approveButton = event.target.closest("[data-approve]");
  const rejectButton = event.target.closest("[data-reject]");
  const tabButton = event.target.closest("[data-tab-target]");
  const editServiceButton = event.target.closest("[data-edit-service]");
  const internalButton = event.target.closest("[data-internal-action]");

  if (event.target.matches("[data-demo-login]")) {
    showDemo();
  }

  if (tabButton) {
    setActiveTab(tabButton.dataset.tabTarget);
  }

  if (event.target.matches("[data-add-service]")) {
    setActiveTab("servicios");
    resetServiceForm();
  }

  if (event.target.matches("[data-cancel-service]")) {
    closeServiceForm();
  }

  if (editServiceButton) {
    const card = editServiceButton.closest("[data-service-id]");
    const service = state.services.find((item) => item.id === card?.dataset.serviceId);
    if (service) {
      setActiveTab("servicios");
      resetServiceForm(service);
    }
  }

  if (event.target.matches("[data-refresh]")) {
    if (state.demoMode) {
      setStatus("La revisión interna requiere login admin real.");
      return;
    }
    if (!state.auth) {
      showLogin();
      setLoginMessage("Ingresa credenciales para actualizar.", true);
      return;
    }
    if (state.activeTab === "modelo") {
      await loadInternalModeration().catch((error) => setStatus(error.message));
      return;
    }
    await loadProviders().catch((error) => setStatus(error.message));
  }

  if (event.target.matches("[data-logout]")) {
    clearAdminAuth();
    state.providers = [];
    internalSections().forEach((section) => {
      section.items = [];
      section.loading = false;
      section.loaded = false;
      section.error = "";
    });
    state.internal.previewUrls.forEach((url) => URL.revokeObjectURL(url));
    state.internal.previewUrls.clear();
    state.activeTab = "modelo";
    showLogin();
  }

  if (internalButton) {
    await handleInternalAction(internalButton);
  }

  const companySelectButton = event.target.closest("[data-select-company]");
  if (companySelectButton) {
    state.internal.selectedCompanyId = companySelectButton.dataset.selectCompany;
    renderCompanyCase();
  }

  if (approveButton) {
    if (state.demoMode) {
      setStatus("La revisión interna requiere login admin real.");
      return;
    }
    const { card, providerId } = providerFromButton(approveButton);
    const approvedImageIds = [...card.querySelectorAll("[data-image-id]:checked")].map(
      (input) => input.dataset.imageId,
    );
    if (!approvedImageIds.length) {
      setStatus("Selecciona al menos una imagen antes de publicar.");
      return;
    }
    approveButton.disabled = true;
    setStatus("Publicando proveedor...");
    try {
      await adminFetchWithFallback(
        "/admin/approve-provider",
        "/providers?admin=approve-provider",
        {
          method: "POST",
          body: JSON.stringify({ providerId, approvedImageIds }),
        },
      );
      await loadProviders();
    } catch (error) {
      approveButton.disabled = false;
      setStatus(error.message);
    }
  }

  if (rejectButton) {
    if (state.demoMode) {
      setStatus("La revisión interna requiere login admin real.");
      return;
    }
    const { providerId } = providerFromButton(rejectButton);
    const reason = window.prompt("Motivo de rechazo");
    if (reason === null) return;
    rejectButton.disabled = true;
    setStatus("Rechazando proveedor...");
    try {
      await adminFetchWithFallback(
        "/admin/reject-provider",
        "/providers?admin=reject-provider",
        {
          method: "POST",
          body: JSON.stringify({ providerId, reason }),
        },
      );
      await loadProviders();
    } catch (error) {
      rejectButton.disabled = false;
      setStatus(error.message);
    }
  }
});

const query = new URLSearchParams(window.location.search);

if (query.get("demo") === DEMO_PARAM_VALUE) {
  showDemo();
} else if (state.auth) {
  loadProviders().catch((error) => {
    clearAdminAuth();
    showLogin();
    setLoginMessage(error.message || INVALID_ADMIN_CREDENTIALS_MESSAGE, true);
  });
} else {
  showLogin();
  renderServices();
}
