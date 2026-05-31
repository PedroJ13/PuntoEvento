const API_BASE = "/api";
const SERVICE_STATUSES = ["draft", "pending", "published", "rejected", "inactive"];
const MAX_SERVICE_IMAGES = 10;
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const FALLBACK_CATEGORIES = [
  "Salon y jardin",
  "Catering",
  "Fotografia",
  "Video",
  "Musica y DJ",
  "Decoracion",
  "Flores",
  "Mesa dulce",
  "Queques",
  "Wedding planner",
  "Mobiliario",
  "Animacion",
  "Alquiler de menaje",
];
const FALLBACK_EVENT_TYPES = [
  "Bodas",
  "Cumpleanos",
  "Eventos corporativos",
  "Baby Shower",
  "Graduaciones",
  "Fiestas infantiles",
];
const DEMO_SERVICES = [
  {
    id: "service-queques",
    slug: "queques-personalizados",
    name: "Queques personalizados",
    category: "Catering",
  eventTypes: ["Bodas", "Cumpleanos"],
    priceFrom: "CRC 85000",
    status: "published",
    description: "Queques decorados para eventos sociales con entrega coordinada.",
    coverUrl: "",
    gallery: [],
    updatedAt: "2026-05-27",
  },
  {
    id: "service-mesa-dulce",
    slug: "mesa-dulce",
    name: "Mesa dulce",
    category: "Catering",
    eventTypes: ["Bodas", "Eventos corporativos"],
    priceFrom: "CRC 120000",
    status: "draft",
    description: "Mesa dulce personalizada con bocadillos, montaje y decoracion.",
    coverUrl: "",
    gallery: [],
    updatedAt: "2026-05-27",
  },
];

const state = {
  company: null,
  services: [],
  categories: FALLBACK_CATEGORIES,
  eventTypes: FALLBACK_EVENT_TYPES,
  mode: new URLSearchParams(window.location.search).get("demo") === "local" ? "demo" : "real",
  pendingImages: [],
  inviteToken: "",
};

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

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

function setPanelMessage(message, tone = "") {
  const node = $("[data-panel-message]");
  if (!node) return;
  node.textContent = message;
  node.dataset.tone = tone;
}

function setFormMessage(message, tone = "") {
  const node = $("[data-form-message]");
  if (!node) return;
  node.textContent = message;
  node.dataset.tone = tone;
}

function setAuthMessage(message, tone = "") {
  const node = $("[data-auth-message]");
  if (!node) return;
  node.textContent = message;
  node.dataset.tone = tone;
}

function normalizeStatus(status) {
  return SERVICE_STATUSES.includes(status) ? status : "draft";
}

function parseArray(value) {
  if (Array.isArray(value)) return value.filter(Boolean);
  if (!value) return [];
  try {
    const parsed = JSON.parse(String(value));
    return Array.isArray(parsed) ? parsed.filter(Boolean) : [];
  } catch {
    return [];
  }
}

function serviceImageCount(service) {
  return Number(Boolean(service.coverUrl)) + parseArray(service.gallery).length;
}

function isAllowedServiceImage(file) {
  return ALLOWED_IMAGE_TYPES.includes(file.type) && file.size <= MAX_IMAGE_SIZE;
}

function serviceStatusLabel(status) {
  const labels = {
    draft: "Borrador",
    pending: "Pendiente",
    published: "Publicado",
    rejected: "Rechazado",
    inactive: "Inactivo",
  };
  return labels[normalizeStatus(status)];
}

function canSubmitReview(service) {
  return ["draft", "rejected"].includes(normalizeStatus(service?.status));
}

function submitReviewStatusMessage(status) {
  const messages = {
    pending: "Este servicio ya esta en revision.",
    published: "Este servicio ya esta publicado. Editalo para guardarlo como borrador antes de enviarlo de nuevo.",
    inactive: "Este servicio esta inactivo. Activalo o crea uno nuevo antes de enviarlo a revision.",
  };
  return messages[normalizeStatus(status)] || "Este servicio no se puede enviar a revision en su estado actual.";
}

function publicCompanyHref(service = null) {
  if (!state.company?.slug) return "index.html#inicio";
  const serviceSlug = service?.slug ? `/${encodeURIComponent(service.slug)}` : "";
  return `index.html#proveedor/${encodeURIComponent(state.company.slug)}${serviceSlug}`;
}

async function apiJson(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  const text = await response.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = null;
  }
  if (!response.ok) {
    const error = new Error(data?.error || "No se pudo completar la accion.");
    error.status = response.status;
    error.data = data;
    throw error;
  }
  return data;
}

function getInviteTokenFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get("invite") || params.get("token") || "";
}

function cleanInviteParams() {
  const params = new URLSearchParams(window.location.search);
  params.delete("invite");
  params.delete("token");
  const cleanUrl = `${window.location.pathname}${params.toString() ? `?${params}` : ""}`;
  window.history.replaceState({}, "", cleanUrl);
}

function genericAuthError(error) {
  if (error.status === 400) return "Revisa los datos e intentalo de nuevo.";
  if (error.status === 403) return "Este acceso no esta disponible. Contacta al equipo de Punto Evento.";
  return "No pudimos validar el acceso. Revisa los datos e intentalo de nuevo.";
}

function renderAuthMode(mode = "login", message = "") {
  const isActivation = mode === "activate";
  const section = $("[data-auth-section]");
  if (!section) return;
  section.hidden = false;
  $("[data-auth-eyebrow]").textContent = isActivation ? "Activacion inicial" : "Acceso empresa";
  $("[data-auth-title]").textContent = isActivation ? "Activa tu acceso" : "Iniciar sesion";
  $("[data-auth-copy]").textContent = isActivation
    ? "Define un password para entrar al panel ahora y volver despues con tu email."
    : "Entra con el email y password activados para tu empresa.";
  $("[data-login-form]")?.classList.toggle("is-hidden", isActivation);
  $("[data-activate-form]")?.classList.toggle("is-hidden", !isActivation);
  const tokenInput = $("[data-activate-form] input[name='token']");
  if (tokenInput) tokenInput.value = state.inviteToken || "";
  setAuthMessage(message || (isActivation ? "Usa el enlace de invitacion para activar tu acceso." : ""), message ? "error" : "");
}

function setAuthenticatedView(isAuthenticated) {
  $$("[data-authenticated-only]").forEach((node) => {
    node.classList.toggle("is-hidden", !isAuthenticated);
  });
  $("[data-logout]")?.classList.toggle("is-hidden", !isAuthenticated);
  const authSection = $("[data-auth-section]");
  if (authSection) authSection.hidden = isAuthenticated;
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
    const serviceCategories = categories
      .filter((item) => item.label || item.id || item.group)
      .map((item) => item.label || item.name)
      .filter(Boolean);
    if (serviceCategories.length) {
      state.categories = serviceCategories;
    }
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

function renderCompany() {
  const company = state.company || {};
  $("[data-panel-mode]").textContent = state.mode === "demo" ? "Panel empresa demo" : "Panel empresa";
  $("[data-company-name]").textContent = company.name || "Empresa sin sesion";
  $("[data-company-description]").textContent =
    company.description || "Necesitas abrir el enlace de invitacion para entrar al panel.";
  $("[data-plan]").textContent = company.plan || "-";
  $("[data-company-status]").textContent = serviceStatusLabel(company.status || "draft");
  $("[data-service-count]").textContent = String(state.services.length);
}

function renderAuthRequired() {
  state.company = null;
  state.services = [];
  setAuthenticatedView(false);
  renderAuthMode(state.inviteToken ? "activate" : "login");
  renderCompany();
  const list = $("[data-services-list]");
  list.innerHTML = `
    <div class="panel-empty">
      <strong>Necesitas iniciar sesion para entrar al panel.</strong>
      <p>Si recibiste invitacion, abre el enlace completo para activar tu password. Si ya activaste acceso, usa tu email y password.</p>
      <a class="primary-button compact-button" href="index.html#empresas">Registrar empresa</a>
    </div>
  `;
  $("[data-service-form]")?.classList.add("is-hidden");
}

function serviceMarkup(service) {
  const eventTypes = parseArray(service.eventTypes);
  const publicLink =
    normalizeStatus(service.status) === "published"
      ? `<a class="ghost-button compact-button" href="${escapeHtml(publicCompanyHref(service))}">Ver publico</a>`
      : `<span class="review-note">Visible cuando sea publicado.</span>`;
  const reviewAction = canSubmitReview(service)
    ? `<button class="primary-button compact-button" type="button" data-submit-review>Enviar a revision</button>`
    : `<span class="review-note">${escapeHtml(submitReviewStatusMessage(service.status))}</span>`;
  return `
    <article class="service-card" data-service-id="${escapeHtml(service.id)}">
      <div class="service-card-header">
        <div>
          <span class="status-pill status-${escapeHtml(normalizeStatus(service.status))}">
            ${escapeHtml(serviceStatusLabel(service.status))}
          </span>
          <h3>${escapeHtml(service.name)}</h3>
        </div>
        <div class="service-actions">
          ${publicLink}
          ${reviewAction}
          <button class="ghost-button compact-button" type="button" data-edit-service>Editar</button>
          <button class="secondary-button compact-button" type="button" data-delete-service>Desactivar</button>
        </div>
      </div>
      <p>${escapeHtml(service.description)}</p>
      <div class="service-meta">
        <div><strong>Categoria</strong><span>${escapeHtml(service.category)}</span></div>
        <div><strong>Eventos</strong><span>${escapeHtml(eventTypes.join(", ") || "Sin eventos")}</span></div>
        <div><strong>Precio desde</strong><span>${escapeHtml(service.priceFrom || "Consultar")}</span></div>
        <div><strong>Fotos</strong><span>${serviceImageCount(service)} archivo(s)</span></div>
        <div><strong>Actualizado</strong><span>${escapeHtml(String(service.updatedAt || "").slice(0, 10))}</span></div>
      </div>
    </article>
  `;
}

function renderServices() {
  renderCompany();
  const list = $("[data-services-list]");
  if (!state.services.length) {
    list.innerHTML = '<div class="panel-empty">Todavia no hay servicios. Agrega el primero para iniciar la revision.</div>';
    return;
  }
  list.innerHTML = state.services.map(serviceMarkup).join("");
}

function setActionsDisabled(isDisabled) {
  $$("[data-add-service], [data-logout], [data-submit-review]").forEach((button) => {
    button.disabled = isDisabled;
  });
}

async function loadRealPanel() {
  setActionsDisabled(true);
  try {
    const [company, services] = await Promise.all([
      apiJson("/companies/me"),
      apiJson("/companies/me/services"),
    ]);
    state.company = company;
    state.services = Array.isArray(services) ? services : [];
    setAuthenticatedView(true);
    setPanelMessage("");
    setAuthMessage("");
    renderServices();
  } catch (error) {
    if (error.status === 401) {
      renderAuthRequired();
      setAuthMessage(state.inviteToken ? "Activa tu acceso para continuar." : "Inicia sesion para entrar al panel.", "");
    } else {
      renderAuthRequired();
      setAuthMessage("No pudimos cargar el panel. Intentalo de nuevo en unos minutos.", "error");
      console.warn(error);
    }
  } finally {
    setActionsDisabled(false);
  }
}

function loadDemoPanel() {
  setAuthenticatedView(true);
  state.company = {
    name: "Aurisbel Eventos",
    slug: "aurisbel-eventos",
    description: "Demo local explicita. No guarda en Azure.",
    plan: "free",
    status: "pending",
  };
  state.services = JSON.parse(JSON.stringify(DEMO_SERVICES));
  setPanelMessage("Modo demo local activo. No guarda en Azure.");
  renderServices();
}

function revokePendingImageUrls() {
  state.pendingImages.forEach((image) => {
    if (image.previewUrl) URL.revokeObjectURL(image.previewUrl);
  });
}

function setDefaultCoverImage() {
  if (!state.pendingImages.length) return;
  if (!state.pendingImages.some((image) => image.isCover)) {
    state.pendingImages[0].isCover = true;
  }
}

function currentServiceImages(service = null) {
  const images = [];
  if (service?.coverUrl) {
    images.push({ name: "Cover aprobado", src: service.coverUrl, type: "cover" });
  }
  parseArray(service?.gallery).forEach((src, index) => {
    images.push({ name: `Galeria aprobada ${index + 1}`, src, type: "gallery" });
  });
  return images;
}

function renderPhotoPreview(service = null) {
  const preview = $("[data-photo-preview]");
  if (!preview) return;
  const approvedImages = currentServiceImages(service);
  if (!approvedImages.length && !state.pendingImages.length) {
    preview.innerHTML = '<div class="photo-preview-empty">Sin imagenes seleccionadas.</div>';
    return;
  }
  const approvedMarkup = approvedImages
    .map(
      (image) => `
        <article class="photo-preview-item">
          <img src="${escapeHtml(image.src)}" alt="${escapeHtml(image.name)}">
          <span>${escapeHtml(image.type === "cover" ? "Cover aprobado" : image.name)}</span>
        </article>
      `,
    )
    .join("");
  const pendingMarkup = state.pendingImages
    .map(
      (image, index) => `
        <article class="photo-preview-item ${image.isCover ? "is-cover" : ""}">
          <img src="${escapeHtml(image.previewUrl)}" alt="${escapeHtml(image.name)}">
          <span>${escapeHtml(image.name)}</span>
          <div class="photo-actions">
            <button class="ghost-button compact-button" type="button" data-set-cover="${index}">${image.isCover ? "Cover" : "Usar como cover"}</button>
            <button class="secondary-button compact-button" type="button" data-remove-photo="${index}">Quitar</button>
          </div>
        </article>
      `,
    )
    .join("");
  preview.innerHTML = `${approvedMarkup}${pendingMarkup}`;
}

function renderReadonlySummary(service = null) {
  const statusNode = $("[data-current-service-status]");
  const photoCountNode = $("[data-current-photo-count]");
  if (statusNode) {
    statusNode.textContent = service ? serviceStatusLabel(service.status) : "Borrador nuevo";
  }
  if (photoCountNode) {
  const count = serviceImageCount(service || {});
    const pendingCount = state.pendingImages.length;
    photoCountNode.textContent = pendingCount ? `${count} aprobado(s), ${pendingCount} pendiente(s)` : `${count} archivo(s)`;
  }
}

function resetServiceForm(service = null) {
  const form = $("[data-service-form]");
  form.reset();
  form.classList.remove("is-hidden");
  revokePendingImageUrls();
  state.pendingImages = [];
  $("[data-service-form-mode]").textContent = service ? "Editar servicio" : "Nuevo servicio";
  setFormMessage("");
  form.elements.id.value = service?.id || "";
  form.elements.name.value = service?.name || "";
  form.elements.category.value = service?.category || state.categories[0] || "";
  const selectedEventTypes = parseArray(service?.eventTypes);
  $$('input[name="eventTypes"]', form).forEach((input) => {
    input.checked = selectedEventTypes.includes(input.value);
  });
  form.elements.priceFrom.value = service?.priceFrom || "";
  form.elements.description.value = service?.description || "";
  renderReadonlySummary(service);
  const reviewButton = $("[data-send-review]", form);
  if (reviewButton) {
    reviewButton.disabled = !service?.id || !canSubmitReview(service);
    reviewButton.dataset.serviceId = service?.id || "";
    reviewButton.title = service?.id
      ? canSubmitReview(service)
        ? "Enviar este borrador a revision interna."
        : submitReviewStatusMessage(service.status)
      : "Guarda el borrador antes de enviarlo a revision.";
  }
  renderPhotoPreview(service);
  form.elements.name.focus();
}

function closeServiceForm() {
  const form = $("[data-service-form]");
  revokePendingImageUrls();
  state.pendingImages = [];
  form.reset();
  form.classList.add("is-hidden");
  renderPhotoPreview();
}

function servicePayloadFromForm(form) {
  const formData = new FormData(form);
  const eventTypes = $$('input[name="eventTypes"]:checked', form).map((input) => input.value);
  return {
    name: String(formData.get("name") || "").trim(),
    category: String(formData.get("category") || "").trim(),
    eventTypes,
    priceFrom: String(formData.get("priceFrom") || "").trim(),
    description: String(formData.get("description") || "").trim(),
    coverUrl: "",
    gallery: [],
  };
}

function validateServicePayload(payload) {
  if (!payload.name) {
    return "Completa el nombre del servicio.";
  }
  if (!payload.category) {
    return "Selecciona la categoria del servicio.";
  }
  if (!payload.eventTypes.length) {
    return "Selecciona al menos un tipo de evento.";
  }
  if (!payload.description) {
    return "Completa la descripcion del servicio.";
  }
  if (!payload.priceFrom) {
    return "Completa el precio desde antes de enviar a revision.";
  }
  return "";
}

function validateServiceForReview(service) {
  return validateServicePayload({
    name: service?.name || "",
    category: service?.category || "",
    eventTypes: parseArray(service?.eventTypes),
    description: service?.description || "",
    priceFrom: service?.priceFrom || "",
  });
}

async function saveService(form) {
  const id = form.elements.id.value;
  const existing = state.services.find((service) => service.id === id);
  const payload = servicePayloadFromForm(form);
  if (existing) {
    payload.coverUrl = existing.coverUrl || "";
    payload.gallery = parseArray(existing.gallery);
  }
  const error = validateServicePayload(payload);
  if (error) {
    setFormMessage(error, "error");
    return;
  }

  setFormMessage("Guardando servicio...");
  const saved =
    state.mode === "demo"
      ? {
          ...existing,
          ...payload,
          id: existing?.id || `demo_${Date.now()}`,
          slug: existing?.slug || "",
          status: "draft",
          updatedAt: new Date().toISOString(),
        }
      : id
        ? await apiJson(`/companies/me/services/${encodeURIComponent(id)}`, {
            method: "PATCH",
            body: JSON.stringify(payload),
          })
        : await apiJson("/companies/me/services", {
            method: "POST",
            body: JSON.stringify(payload),
          });

  if (state.pendingImages.length) {
    await uploadServiceImages(saved.id);
    setPanelMessage("Borrador guardado. Imagenes enviadas a revision.", "success");
  } else {
    setPanelMessage("Borrador guardado. Cuando este completo, envialo a revision.", "success");
  }

  closeServiceForm();
  if (state.mode === "demo") {
    const index = state.services.findIndex((service) => service.id === saved.id);
    if (index >= 0) state.services.splice(index, 1, saved);
    else state.services.unshift(saved);
    renderServices();
  } else {
    await loadRealPanel();
  }
}

function reviewErrorMessage(error, service = null) {
  if (error.status === 400) {
    return error.data?.error || validateServiceForReview(service) || "Completa los campos minimos antes de enviar a revision.";
  }
  if (error.status === 401) {
    return "Tu sesion expiro. Abre de nuevo el enlace de invitacion o inicia sesion otra vez.";
  }
  if (error.status === 404) {
    return "No encontramos este servicio en tu empresa. Recarga el panel e intenta de nuevo.";
  }
  if (error.status === 409) {
    return error.data?.error || submitReviewStatusMessage(service?.status);
  }
  return "No se pudo enviar a revision. Intentalo de nuevo en unos minutos.";
}

async function submitServiceForReview(serviceId, trigger = null) {
  const service = state.services.find((item) => item.id === serviceId);
  if (!service) return;

  const validationError = validateServiceForReview(service);
  if (validationError) {
    setPanelMessage(validationError, "error");
    setFormMessage(validationError, "error");
    return;
  }
  if (!canSubmitReview(service)) {
    const message = submitReviewStatusMessage(service.status);
    setPanelMessage(message, "error");
    setFormMessage(message, "error");
    return;
  }

  const originalText = trigger?.textContent;
  if (trigger) {
    trigger.disabled = true;
    trigger.textContent = "Enviando...";
  }
  setPanelMessage(`Enviando "${service.name}" a revision...`);
  setFormMessage("");

  try {
    const updated =
      state.mode === "demo"
        ? { ...service, status: "pending", updatedAt: new Date().toISOString() }
        : await apiJson(`/companies/me/services/${encodeURIComponent(serviceId)}/submit-review`, {
            method: "POST",
            body: "{}",
          });

    service.status = normalizeStatus(updated.status);
    service.updatedAt = updated.updatedAt || service.updatedAt;
    setPanelMessage("Servicio enviado a revision.", "success");
    renderServices();
    const form = $("[data-service-form]");
    if (form && !form.classList.contains("is-hidden") && form.elements.id.value === serviceId) {
      resetServiceForm(service);
    }
  } catch (error) {
    console.warn(error);
    const message = reviewErrorMessage(error, service);
    setPanelMessage(message, "error");
    setFormMessage(message, "error");
  } finally {
    if (trigger) {
      const latestService = state.services.find((item) => item.id === serviceId);
      trigger.textContent = originalText;
      trigger.disabled = latestService ? !canSubmitReview(latestService) : false;
    }
  }
}

async function deleteService(serviceId) {
  const service = state.services.find((item) => item.id === serviceId);
  if (!service) return;
  const confirmed = window.confirm(`Desactivar "${service.name}"?`);
  if (!confirmed) return;

  if (state.mode === "demo") {
    service.status = "inactive";
    service.updatedAt = new Date().toISOString();
    renderServices();
    setPanelMessage("Servicio demo desactivado.", "success");
    return;
  }

  await apiJson(`/companies/me/services/${encodeURIComponent(serviceId)}`, { method: "DELETE" });
  setPanelMessage("Servicio desactivado.", "success");
  await loadRealPanel();
}

async function uploadOneServiceImage(serviceId, image) {
  if (state.mode === "demo") return;
  if (!image?.file) return;

  const signed = await apiJson("/uploads/sign", {
    method: "POST",
    body: JSON.stringify({
      scope: "service",
      serviceId,
      imageType: image.isCover ? "cover" : "gallery",
      fileName: image.file.name,
      contentType: image.file.type,
      size: image.file.size,
    }),
  });

  const uploadResponse = await fetch(signed.uploadUrl, {
    method: "PUT",
    headers: {
      "x-ms-blob-type": "BlockBlob",
      "Content-Type": image.file.type,
    },
    body: image.file,
  });
  if (!uploadResponse.ok) {
    throw new Error("No se pudo subir la imagen.");
  }

  await apiJson("/uploads/confirm", {
    method: "POST",
    body: JSON.stringify({ uploadId: signed.uploadId }),
  });
}

async function uploadServiceImages(serviceId) {
  setDefaultCoverImage();
  for (const image of state.pendingImages) {
    await uploadOneServiceImage(serviceId, image);
  }
}

async function logout() {
  if (state.mode === "demo") {
    window.location.href = "index.html#empresas";
    return;
  }
  try {
    await apiJson("/company-auth/logout", { method: "POST", body: "{}" });
  } finally {
    state.inviteToken = "";
    cleanInviteParams();
    renderAuthRequired();
    setAuthMessage("Sesion cerrada.");
  }
}

async function activateAccess(form) {
  const password = String(form.elements.password.value || "");
  const passwordConfirm = String(form.elements.passwordConfirm.value || "");
  if (password.length < 8) {
    setAuthMessage("Usa un password de al menos 8 caracteres.", "error");
    return;
  }
  if (password !== passwordConfirm) {
    setAuthMessage("Los passwords no coinciden.", "error");
    return;
  }

  const button = form.querySelector('button[type="submit"]');
  button.disabled = true;
  button.textContent = "Activando...";
  setAuthMessage("Activando acceso...");
  try {
    await apiJson("/company-auth/activate", {
      method: "POST",
      body: JSON.stringify({ token: form.elements.token.value, password }),
    });
    state.inviteToken = "";
    cleanInviteParams();
    form.reset();
    setPanelMessage("Acceso activado. Sesion iniciada.", "success");
    await loadRealPanel();
  } catch (error) {
    console.warn(error);
    setAuthMessage(genericAuthError(error), "error");
  } finally {
    button.disabled = false;
    button.textContent = "Activar acceso";
  }
}

async function loginCompany(form) {
  const email = String(form.elements.email.value || "").trim();
  const password = String(form.elements.password.value || "");
  if (!email || !password) {
    setAuthMessage("Completa email y password.", "error");
    return;
  }

  const button = form.querySelector('button[type="submit"]');
  button.disabled = true;
  button.textContent = "Ingresando...";
  setAuthMessage("Validando acceso...");
  try {
    await apiJson("/company-auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    form.reset();
    setPanelMessage("Sesion iniciada.", "success");
    await loadRealPanel();
  } catch (error) {
    console.warn(error);
    setAuthMessage(genericAuthError(error), "error");
  } finally {
    button.disabled = false;
    button.textContent = "Iniciar sesion";
  }
}

document.addEventListener("submit", async (event) => {
  if (event.target.matches("[data-activate-form]")) {
    event.preventDefault();
    await activateAccess(event.target);
    return;
  }

  if (event.target.matches("[data-login-form]")) {
    event.preventDefault();
    await loginCompany(event.target);
    return;
  }

  if (!event.target.matches("[data-service-form]")) return;
  event.preventDefault();
  try {
    await saveService(event.target);
  } catch (error) {
    console.warn(error);
    setFormMessage("No se pudo guardar el servicio. Revisa los datos e intentalo de nuevo.", "error");
  }
});

document.addEventListener("click", async (event) => {
  if (event.target.matches("[data-add-service]")) {
    resetServiceForm();
  }

  if (event.target.matches("[data-cancel-service]")) {
    closeServiceForm();
  }

  if (event.target.matches("[data-send-review]")) {
    const serviceId = event.target.dataset.serviceId || $("[data-service-form]")?.elements.id.value;
    if (!serviceId) {
      setFormMessage("Guarda el borrador antes de enviarlo a revision.", "error");
    } else {
      await submitServiceForReview(serviceId, event.target);
    }
  }

  if (event.target.matches("[data-logout]")) {
    await logout();
  }

  const editButton = event.target.closest("[data-edit-service]");
  if (editButton) {
    const serviceId = editButton.closest("[data-service-id]")?.dataset.serviceId;
    const service = state.services.find((item) => item.id === serviceId);
    if (service) resetServiceForm(service);
  }

  const deleteButton = event.target.closest("[data-delete-service]");
  if (deleteButton) {
    const serviceId = deleteButton.closest("[data-service-id]")?.dataset.serviceId;
    try {
      await deleteService(serviceId);
    } catch (error) {
      console.warn(error);
      setPanelMessage("No se pudo desactivar el servicio.", "error");
    }
  }

  const reviewButton = event.target.closest("[data-submit-review]");
  if (reviewButton) {
    const serviceId = reviewButton.closest("[data-service-id]")?.dataset.serviceId;
    await submitServiceForReview(serviceId, reviewButton);
  }
});

document.addEventListener("change", (event) => {
  if (!event.target.matches("[data-service-photos]")) return;
  const form = event.target.closest("[data-service-form]");
  const service = state.services.find((item) => item.id === form?.elements.id.value);
  const existingCount = serviceImageCount(service || {});
  const files = [...(event.target.files || [])];
  const invalid = files.filter((file) => !isAllowedServiceImage(file));
  if (invalid.length) {
    setFormMessage("Usa solo JPG, PNG o WEBP de hasta 5 MB por imagen.", "error");
    event.target.value = "";
    return;
  }
  if (existingCount + state.pendingImages.length + files.length > MAX_SERVICE_IMAGES) {
    setFormMessage(`Maximo ${MAX_SERVICE_IMAGES} imagenes por servicio, incluyendo el cover.`, "error");
    event.target.value = "";
    return;
  }
  files.forEach((file) => {
    state.pendingImages.push({
      file,
      name: file.name,
      size: file.size,
      type: file.type,
      previewUrl: URL.createObjectURL(file),
      isCover: false,
    });
  });
  setDefaultCoverImage();
  setFormMessage("Imagenes listas. Marca una como cover antes de guardar.");
  renderReadonlySummary(service);
  renderPhotoPreview(service);
  event.target.value = "";
});

document.addEventListener("click", (event) => {
  const coverButton = event.target.closest("[data-set-cover]");
  if (coverButton) {
    const index = Number(coverButton.dataset.setCover);
    state.pendingImages.forEach((image, imageIndex) => {
      image.isCover = imageIndex === index;
    });
    const form = coverButton.closest("[data-service-form]");
    const service = state.services.find((item) => item.id === form?.elements.id.value);
    renderPhotoPreview(service);
  }

  const removeButton = event.target.closest("[data-remove-photo]");
  if (removeButton) {
    const index = Number(removeButton.dataset.removePhoto);
    const [removed] = state.pendingImages.splice(index, 1);
    if (removed?.previewUrl) URL.revokeObjectURL(removed.previewUrl);
    setDefaultCoverImage();
    const form = removeButton.closest("[data-service-form]");
    const service = state.services.find((item) => item.id === form?.elements.id.value);
    renderReadonlySummary(service);
    renderPhotoPreview(service);
  }
});

async function init() {
  state.inviteToken = getInviteTokenFromUrl();
  await loadCatalogs();
  renderCatalogControls();
  renderPhotoPreview();
  if (state.mode === "demo") {
    loadDemoPanel();
  } else {
    await loadRealPanel();
  }
}

init();
