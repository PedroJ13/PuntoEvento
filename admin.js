const API_BASE = "/api";
const AUTH_KEY = "puntoEventoAdminAuth";

const state = {
  auth: sessionStorage.getItem(AUTH_KEY) || "",
  providers: [],
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

function authHeaders() {
  return {
    Authorization: `Basic ${state.auth}`,
    "Content-Type": "application/json",
  };
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
}

function showAdmin() {
  $("[data-login-panel]").classList.add("is-hidden");
  $("[data-admin-panel]").classList.remove("is-hidden");
  $("[data-refresh]").disabled = false;
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

async function loadProviders() {
  setStatus("Cargando pendientes...");
  const providers = await adminFetchWithFallback(
    "/admin/pending-providers",
    "/admin-pending-providers",
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
  if (!event.target.matches("[data-login-form]")) return;
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
});

document.addEventListener("click", async (event) => {
  const approveButton = event.target.closest("[data-approve]");
  const rejectButton = event.target.closest("[data-reject]");

  if (event.target.matches("[data-refresh]")) {
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
    showLogin();
  }

  if (approveButton) {
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
        "/admin-approve-provider",
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
    const { providerId } = providerFromButton(rejectButton);
    const reason = window.prompt("Motivo de rechazo");
    if (reason === null) return;
    rejectButton.disabled = true;
    setStatus("Rechazando proveedor...");
    try {
      await adminFetchWithFallback(
        "/admin/reject-provider",
        "/admin-reject-provider",
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

if (state.auth) {
  loadProviders().catch((error) => {
    showLogin();
    setLoginMessage(error.message, true);
  });
} else {
  showLogin();
}
