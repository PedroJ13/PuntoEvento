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
    Authorization: `Basic ${state.auth}`,
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
          return `
            <article class="admin-image">
              ${
                image.previewUrl
                  ? `<img src="${escapeHtml(image.previewUrl)}" alt="${escapeHtml(image.originalFileName || image.type)}">`
                  : ""
              }
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
    await loadProviders().catch((error) => setStatus(error.message));
  }

  if (event.target.matches("[data-logout]")) {
    sessionStorage.removeItem(AUTH_KEY);
    state.auth = "";
    state.providers = [];
    state.activeTab = "revision";
    showLogin();
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
