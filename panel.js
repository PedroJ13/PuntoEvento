const SERVICES_KEY = "puntoEventoDemoServices";
const SERVICE_STATUSES = ["draft", "pending", "published", "rejected", "inactive"];
const FALLBACK_CATEGORIES = ["Bodas", "Salones", "Catering", "Corporativos", "Fiestas infantiles", "Decoracion"];
const FALLBACK_EVENT_TYPES = [
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
    photos: [
      { name: "queque-boda.jpg", size: 0, type: "image/jpeg" },
      { name: "queque-flores.jpg", size: 0, type: "image/jpeg" },
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
    photos: [{ name: "ceremonia.jpg", size: 0, type: "image/jpeg" }],
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
    photos: [{ name: "mesa-dulce.jpg", size: 0, type: "image/jpeg" }],
    updatedAt: "2026-05-27",
    description: "Mesa dulce personalizada con bocadillos, montaje y decoracion.",
  },
];

const state = {
  categories: FALLBACK_CATEGORIES,
  eventTypes: FALLBACK_EVENT_TYPES,
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

function loadServices() {
  try {
    const stored = localStorage.getItem(SERVICES_KEY);
    if (!stored) return defaultServices();
    const services = JSON.parse(stored);
    return Array.isArray(services) ? services : defaultServices();
  } catch {
    return defaultServices();
  }
}

function defaultServices() {
  return JSON.parse(JSON.stringify(DEFAULT_SERVICES));
}

function saveServices() {
  localStorage.setItem(SERVICES_KEY, JSON.stringify(state.services));
}

function setPanelMessage(message) {
  const messageNode = $("[data-panel-message]");
  if (messageNode) messageNode.textContent = message;
}

function todayStamp() {
  return new Date().toISOString().slice(0, 10);
}

function normalizeStatus(status) {
  return SERVICE_STATUSES.includes(status) ? status : "draft";
}

function normalizeCategory(category) {
  return state.categories.includes(category) ? category : state.categories[0];
}

function normalizeEventTypes(eventTypes) {
  const values = Array.isArray(eventTypes) ? eventTypes : [];
  return values
    .map((value) => (value === "Corporativo" ? "Eventos corporativos" : value))
    .filter((value) => state.eventTypes.includes(value));
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

async function loadCatalogs() {
  const [categories, eventTypes] = await Promise.all([
    fetch("data/categories.json")
      .then((response) => response.ok ? response.json() : null)
      .catch(() => null),
    fetch("data/event-types.json")
      .then((response) => response.ok ? response.json() : null)
      .catch(() => null),
  ]);

  if (Array.isArray(categories)) {
    state.categories = categories.map((item) => item.label || item.name).filter(Boolean);
  }
  if (Array.isArray(eventTypes)) {
    state.eventTypes = eventTypes.map((item) => item.label || item.name).filter(Boolean);
  }
}

function renderCatalogControls() {
  const categorySelect = $("[data-category-select]");
  if (categorySelect) {
    categorySelect.innerHTML = state.categories
      .map((category) => `<option value="${escapeHtml(category)}">${escapeHtml(category)}</option>`)
      .join("");
  }

  const eventTypes = $("[data-event-type-options]");
  if (eventTypes) {
    eventTypes.innerHTML = state.eventTypes
      .map(
        (eventType) => `
          <label class="choice-pill">
            <input type="checkbox" name="eventTypes" value="${escapeHtml(eventType)}">
            <span>${escapeHtml(eventType)}</span>
          </label>
        `,
      )
      .join("");
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
  const eventTypes = normalizeEventTypes(service.eventTypes);
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
        <button class="ghost-button compact-button" type="button" data-edit-service>Editar</button>
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
  $("[data-service-count]").textContent = String(state.services.length);
  if (!state.services.length) {
    list.innerHTML = '<div class="panel-empty">Todavia no hay servicios demo.</div>';
    return;
  }
  list.innerHTML = state.services.map(serviceMarkup).join("");
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

function resetServiceForm(service = null) {
  const form = $("[data-service-form]");
  form.reset();
  form.classList.remove("is-hidden");
  state.pendingPhotos = service ? photoList(service) : [];
  $("[data-service-form-mode]").textContent = service ? "Editar servicio" : "Nuevo servicio";
  $("[data-form-message]").textContent = "";
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
  state.pendingPhotos.forEach((photo) => {
    if (photo.previewUrl) URL.revokeObjectURL(photo.previewUrl);
  });
  state.pendingPhotos = [];
  form.reset();
  form.classList.add("is-hidden");
  renderPhotoPreview();
}

function restoreDemoServices() {
  state.services = defaultServices();
  saveServices();
  closeServiceForm();
  renderServices();
  setPanelMessage("Demo restaurada. Se volvieron a cargar los servicios base.");
}

function photoMetadataFromFiles(files) {
  return [...files].map((file) => ({
    name: file.name,
    size: file.size,
    type: file.type || "image/*",
    previewUrl: URL.createObjectURL(file),
  }));
}

function serviceFromForm(form, forcedStatus = null) {
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
    status: normalizeStatus(forcedStatus || String(formData.get("status") || "")),
    photoCount: photos.length,
    photos,
    updatedAt: todayStamp(),
    description: String(formData.get("description") || "").trim(),
  };
}

function saveService(service) {
  const existingIndex = state.services.findIndex((item) => item.id === service.id);
  if (existingIndex >= 0) {
    state.services.splice(existingIndex, 1, service);
  } else {
    state.services.unshift(service);
  }
  saveServices();
  renderServices();
}

function validateService(service) {
  if (!service.eventTypes.length) return "Selecciona al menos un tipo de evento.";
  if (!service.name || !service.category || !service.priceFrom || !service.description) {
    return "Completa los campos requeridos.";
  }
  return "";
}

document.addEventListener("submit", (event) => {
  if (!event.target.matches("[data-service-form]")) return;
  event.preventDefault();
  const service = serviceFromForm(event.target);
  const error = validateService(service);
  if (error) {
    $("[data-form-message]").textContent = error;
    return;
  }
  saveService(service);
  closeServiceForm();
});

document.addEventListener("click", (event) => {
  if (event.target.matches("[data-add-service]")) {
    setPanelMessage("");
    resetServiceForm();
  }

  if (event.target.matches("[data-reset-demo]")) {
    const confirmed = window.confirm("Esto borrara los servicios demo creados en este navegador. Deseas continuar?");
    if (!confirmed) return;
    restoreDemoServices();
  }

  if (event.target.matches("[data-cancel-service]")) {
    closeServiceForm();
  }

  if (event.target.matches("[data-send-review]")) {
    const form = event.target.closest("[data-service-form]");
    const service = serviceFromForm(form, "pending");
    const error = validateService(service);
    if (error) {
      $("[data-form-message]").textContent = error;
      return;
    }
    saveService(service);
    closeServiceForm();
  }

  const editButton = event.target.closest("[data-edit-service]");
  if (editButton) {
    const card = editButton.closest("[data-service-id]");
    const service = state.services.find((item) => item.id === card?.dataset.serviceId);
    if (service) resetServiceForm(service);
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

async function init() {
  await loadCatalogs();
  renderCatalogControls();
  renderServices();
  renderPhotoPreview();
}

init();
