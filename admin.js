const API_BASE = "/api";
const AUTH_KEY = "puntoEventoAdminAuth";
const SERVICES_KEY = "puntoEventoDemoServices";
const DEMO_PARAM_VALUE = "local";
const SERVICE_STATUSES = ["draft", "pending", "published", "rejected", "inactive"];
const CATEGORY_OPTIONS = ["Bodas", "Salones", "Catering", "Corporativos", "Fiestas infantiles", "Decoracion"];
const EVENT_TYPE_OPTIONS = [
  "Bodas",
  "Cumpleanos",
  "Eventos corporativos",
  "Baby Shower",
  "Graduaciones",
  "Fiestas infantiles",
];
const INTERNAL_MODERATION = {
  companies: {
    endpoint: "/internal/companies/pending",
    label: "empresas",
  },
  services: {
    endpoint: "/internal/services/pending",
    label: "servicios",
  },
  uploads: {
    endpoint: "/internal/uploads/pending",
    label: "uploads",
  },
};

const DEFAULT_SERVICES = [
  {
    id: "service-queques",
    name: "Queques personalizados",
    category: "Catering",
    eventTypes: ["Bodas", "Cumpleanos", "Baby Shower"],
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
    eventTypes: ["Bodas", "Eventos corporativos", "Cumpleanos"],
    priceFrom: "CRC 120000",
    status: "draft",
    photoCount: 3,
    photos: [
      { name: "mesa-dulce.jpg", size: 0, type: "image/jpeg" },
      { name: "postres-mini.jpg", size: 0, type: "image/jpeg" },
      { name: "montaje-dulce.jpg", size: 0, type: "image/jpeg" },
    ],
    updatedAt: "2026-05-27",
    description: "Mesa dulce personalizada con bocadillos, montaje y decoracion.",
  },
];

const state = {
  auth: sessionStorage.getItem(AUTH_KEY) || "",
  providers: [],
  activeTab: "revision",
  demoMode: false,
  pendingPhotos: [],
  services: loadServices(),
  internal: {
    companies: { items: [], loading: false, loaded: false, error: "" },
    services: { items: [], loading: false, loaded: false, error: "" },
    uploads: { items: [], loading: false, loaded: false, error: "" },
    selectedCompanyId: "",
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

function setStatus(message) {
  const status = $("[data-status]");
  if (status) status.textContent = message;
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
    name: `Foto demo ${index + 1}`,
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
  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      ...authHeaders(),
      ...(options.headers || {}),
    },
  });

  if (response.status === 401 || response.status === 503) {
    sessionStorage.removeItem(AUTH_KEY);
    state.auth = "";
    showLogin();
  }
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    if (response.status === 404) {
      throw new Error("API admin no encontrada. Revisa que el workflow haya desplegado api_location: api.");
    }
    const message = body.error || `No se pudo completar la accion. HTTP ${response.status}`;
    throw new Error(message);
  }
  return response.json();
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
  sessionStorage.removeItem(AUTH_KEY);
  state.auth = "";
  state.providers = [];
  state.activeTab = "empresa";
  setDemoMode(true);
  showAdmin();
  setStatus("Modo demo local activo.");
  const count = $("[data-count]");
  if (count) count.textContent = "Modo demo local";
}

function imageMarkup(provider) {
  if (!provider.images.length) {
    return '<div class="admin-empty">Este registro no tiene imagenes pendientes.</div>';
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

function internalActionButton(type, action, ids, disabledReason = "") {
  const attrs = Object.entries(ids)
    .map(([key, value]) => `data-${key}="${escapeHtml(value)}"`)
    .join(" ");
  const label = action === "approve" ? "Aprobar" : "Rechazar";
  return `<button class="${action === "approve" ? "primary-button" : "secondary-button"} compact-button" type="button" data-internal-action="${action}" data-internal-type="${type}" ${attrs} ${disabledReason ? "disabled" : ""} title="${escapeHtml(disabledReason)}">${label}</button>`;
}

function scopedInternalActionsMarkup(type, ids, disabledApproveReason = "") {
  return `
    <div class="internal-item-actions">
      ${internalActionButton(type, "approve", ids, disabledApproveReason)}
      ${internalActionButton(type, "reject", ids)}
    </div>
    ${disabledApproveReason ? `<p class="dependency-note">${escapeHtml(disabledApproveReason)}</p>` : ""}
  `;
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
          <h4>${escapeHtml(upload.fileName || uploadId || "Upload pendiente")}</h4>
        </div>
      </div>
      <div class="internal-item-meta">
        <div><strong>Upload ID</strong><span>${escapeHtml(uploadId)}</span></div>
        <div><strong>Empresa ID</strong><span>${escapeHtml(companyId)}</span></div>
        <div><strong>Scope</strong><span>${escapeHtml(upload.scope || "-")}</span></div>
        <div><strong>Servicio ID</strong><span>${escapeHtml(upload.serviceId || "-")}</span></div>
        <div><strong>Tipo</strong><span>${escapeHtml(upload.imageType || "-")}</span></div>
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
        description: "Empresa incluida por imagenes pendientes.",
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

function serviceForUpload(upload) {
  if (!upload?.serviceId) return null;
  return state.internal.services.items.find(
    (service) => companyIdOf(service) === companyIdOf(upload) && (service.serviceId || service.id) === upload.serviceId,
  );
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

function caseCompanyDetail(company) {
  if (!company) return '<div class="admin-empty">Selecciona una empresa para revisar su expediente.</div>';
  const companyId = companyIdOf(company);
  const location = [company.province, company.canton].filter(Boolean).join(", ") || "-";
  return `
    <article class="internal-item">
      <div class="internal-item-header">
        <div>
          <span class="status-pill status-${statusClass(company.status)}">${escapeHtml(internalStatusLabel(company.status))}</span>
          <h4>${escapeHtml(company.name || "Empresa sin nombre")}</h4>
        </div>
      </div>
      <p>${escapeHtml(truncateText(company.description, 240))}</p>
      <div class="internal-item-meta">
        <div><strong>ID</strong><span>${escapeHtml(companyId)}</span></div>
        <div><strong>Email</strong><span>${escapeHtml(company.email || "-")}</span></div>
        <div><strong>Telefono</strong><span>${escapeHtml(company.whatsapp || "-")}</span></div>
        <div><strong>Zona</strong><span>${escapeHtml(location)}</span></div>
      </div>
      ${scopedInternalActionsMarkup("companies", { "company-id": companyId })}
    </article>
  `;
}

function caseServiceMarkup(service, company) {
  const companyPublished = company?.status === "published" || service.companyStatus === "published";
  const companyId = companyIdOf(service);
  const serviceId = service.serviceId || service.id || "";
  const disabledReason = companyPublished ? "" : "Publica la empresa antes de aprobar servicios.";
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
      ${scopedInternalActionsMarkup("services", { "company-id": companyId, "service-id": serviceId }, disabledReason)}
    </article>
  `;
}

function caseUploadMarkup(upload, company) {
  const companyPublished = company?.status === "published" || upload.companyStatus === "published";
  const service = serviceForUpload(upload);
  const servicePublished = upload.scope !== "service" || service?.status === "published" || upload.serviceStatus === "published";
  const uploadId = upload.uploadId || upload.id || "";
  const companyId = companyIdOf(upload);
  const disabledReason = !companyPublished
    ? "Publica la empresa antes de aprobar imagenes."
    : !servicePublished
      ? "Publica el servicio antes de aprobar imagenes de servicio."
      : "";
  return `
    <article class="internal-item">
      <div class="internal-item-header">
        <div>
          <span class="status-pill status-${statusClass(upload.status)}">${escapeHtml(internalStatusLabel(upload.status))}</span>
          <h4>${escapeHtml(upload.fileName || uploadId || "Upload pendiente")}</h4>
        </div>
      </div>
      <div class="internal-item-meta">
        <div><strong>Upload ID</strong><span>${escapeHtml(uploadId)}</span></div>
        <div><strong>Scope</strong><span>${escapeHtml(upload.scope || "-")}</span></div>
        <div><strong>Servicio</strong><span>${escapeHtml(upload.serviceId || "-")}</span></div>
        <div><strong>Tipo</strong><span>${escapeHtml(upload.imageType || "-")}</span></div>
      </div>
      ${scopedInternalActionsMarkup("uploads", { "company-id": companyId, "upload-id": uploadId }, disabledReason)}
    </article>
  `;
}

function renderCompanyCase() {
  const list = $("[data-case-company-list]");
  const detail = $("[data-case-detail]");
  const servicesNode = $("[data-case-services]");
  const uploadsNode = $("[data-case-uploads]");
  if (!list || !detail || !servicesNode || !uploadsNode) return;
  const companies = getCaseCompanies();
  const company = selectedCaseCompany();
  if (!companies.length || !company) {
    list.innerHTML = '<div class="admin-empty">No hay expedientes con actividad.</div>';
    detail.innerHTML = '<div class="admin-empty">Carga el modelo nuevo para seleccionar una empresa.</div>';
    servicesNode.innerHTML = '<div class="admin-empty">Sin servicios.</div>';
    uploadsNode.innerHTML = '<div class="admin-empty">Sin imagenes.</div>';
    return;
  }
  const companyId = companyIdOf(company);
  const scopedServices = servicesForCompany(companyId);
  const scopedUploads = uploadsForCompany(companyId);
  list.innerHTML = companies.map(caseCompanyCard).join("");
  detail.innerHTML = caseCompanyDetail(company);
  servicesNode.innerHTML = scopedServices.length
    ? scopedServices.map((service) => caseServiceMarkup(service, company)).join("")
    : '<div class="admin-empty">Esta empresa no tiene servicios revisables en el listado actual.</div>';
  uploadsNode.innerHTML = scopedUploads.length
    ? scopedUploads.map((upload) => caseUploadMarkup(upload, company)).join("")
    : '<div class="admin-empty">Esta empresa no tiene imagenes pendientes en el listado actual.</div>';
}

function renderInternalList(type) {
  const section = state.internal[type];
  const list = $(`[data-internal-list="${type}"]`);
  const count = $(`[data-internal-count="${type}"]`);
  if (!section || !list) return;

  if (count) count.textContent = String(section.items.length);
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
    const total = Object.values(state.internal).reduce((sum, section) => sum + section.items.length, 0);
    const count = $("[data-count]");
    if (count) count.textContent = `${total} item(s) modelo nuevo`;
  }
}

async function loadInternalList(type) {
  const section = state.internal[type];
  if (!section) return;
  section.loading = true;
  section.error = "";
  renderInternalList(type);
  try {
    const response = await adminFetch(INTERNAL_MODERATION[type].endpoint);
    section.items = Array.isArray(response) ? response : Array.isArray(response?.items) ? response.items : [];
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
  const hasErrors = Object.values(state.internal).some((section) => section.error);
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

async function handleInternalAction(button) {
  if (state.demoMode) {
    setStatus("La moderacion nueva requiere login admin real.");
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
    await adminFetch(path, {
      method: "POST",
      body: action === "reject" ? JSON.stringify({ reason }) : "{}",
    });
    setStatus(action === "approve" ? "Item aprobado." : "Item rechazado.");
    await loadInternalList(type);
  } catch (error) {
    setStatus(error.message);
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
    if (count) count.textContent = "Modo demo local";
    setStatus("Empresa demo y Servicios disponibles sin API.");
  } else if (tabName === "modelo" && state.auth) {
    const needsLoad = Object.values(state.internal).some((section) => !section.loaded && !section.loading);
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
        <span class="admin-review-label">Revision</span>
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
    list.innerHTML = '<div class="admin-empty">Todavia no hay servicios demo.</div>';
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
    sessionStorage.setItem(AUTH_KEY, state.auth);
    setLoginMessage("Validando credenciales...");
    try {
      await loadProviders();
      setLoginMessage("Las credenciales se validan contra la API de Azure.");
    } catch (error) {
      showLogin();
      setLoginMessage(error.message, true);
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
    setStatus("Servicio demo guardado localmente.");
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
      setStatus("La revision interna requiere login admin real.");
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
    sessionStorage.removeItem(AUTH_KEY);
    state.auth = "";
    state.providers = [];
    Object.values(state.internal).forEach((section) => {
      section.items = [];
      section.loading = false;
      section.loaded = false;
      section.error = "";
    });
    state.activeTab = "revision";
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
      setStatus("La revision interna requiere login admin real.");
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
      setStatus("La revision interna requiere login admin real.");
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
    showLogin();
    setLoginMessage(error.message, true);
  });
} else {
  showLogin();
  renderServices();
}
