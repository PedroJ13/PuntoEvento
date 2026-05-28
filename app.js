const image = (id, params = "auto=format&fit=crop&w=1200&q=80") =>
  `https://images.unsplash.com/${id}?${params}`;

const CONFIG = {
  providersUrl: "data/providers.json",
  packagesUrl: "data/packages.json",
  categoriesUrl: "data/categories.json",
  publicServicesUrl: "/api/public/services",
  publicCompanyUrl: (slug) => `/api/public/companies/${encodeURIComponent(slug)}`,
  fallbackProviderImage: "assets/images/fallback-provider.svg",
  apiBaseUrl: "/api",
  maxProviderImages: 6,
  maxProviderImageSize: 5 * 1024 * 1024,
};

let providers = [];
let providerGallery = [];
let packages = [];
let categories = [];
let services = [];
let serviceDataSource = "demo";
let serviceDataNotice = "";
let currentSearchFilters = {};
const companyProfileCache = new Map();

const app = document.querySelector("#app");
const drawer = document.querySelector("#quoteDrawer");
const quoteForm = document.querySelector("#quoteForm");
const quoteConfirmation = document.querySelector("#quoteConfirmation");
const focusableSelector =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
let lastFocusedElement = null;

async function loadProviderData() {
  const [providersResponse, packagesResponse, categoriesResponse] = await Promise.all([
    fetch(CONFIG.providersUrl),
    fetch(CONFIG.packagesUrl),
    fetch(CONFIG.categoriesUrl),
  ]);

  if (!providersResponse.ok) {
    throw new Error(`No se pudo cargar ${CONFIG.providersUrl}`);
  }
  if (!packagesResponse.ok) {
    throw new Error(`No se pudo cargar ${CONFIG.packagesUrl}`);
  }
  if (!categoriesResponse.ok) {
    throw new Error(`No se pudo cargar ${CONFIG.categoriesUrl}`);
  }

  const [providerData, packageData, categoryData] = await Promise.all([
    providersResponse.json(),
    packagesResponse.json(),
    categoriesResponse.json(),
  ]);
  providers = providerData
    .filter((provider) => provider.status === "published")
    .map((provider) => ({
      ...provider,
      image: provider.coverImage || CONFIG.fallbackProviderImage,
      gallery: provider.gallery?.length
        ? provider.gallery
        : [
            {
              src: provider.coverImage || CONFIG.fallbackProviderImage,
              alt: provider.name,
            },
          ],
    }));
  packages = packageData.map((pack) => ({
    ...pack,
    vendor: providers.find((provider) => provider.id === pack.providerId)?.name || "Proveedor demo",
  }));
  categories = categoryData;
  services = buildDemoServices();
  serviceDataSource = "demo";
  serviceDataNotice = "Mostrando datos demo porque la API publica no respondio.";

  try {
    const publicServices = await fetchPublicServices();
    services = publicServices;
    serviceDataSource = "api";
    serviceDataNotice = "";
  } catch (error) {
    console.info("Usando fallback demo de servicios.", error);
  }

  providerGallery = providers[0]?.gallery || [];
}

async function fetchPublicServices(params = {}) {
  const url = new URL(CONFIG.publicServicesUrl, window.location.href);
  Object.entries(params).forEach(([key, value]) => {
    if (value) url.searchParams.set(key, value);
  });

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`No se pudo cargar ${CONFIG.publicServicesUrl}`);
  }

  const payload = await response.json();
  const items = Array.isArray(payload) ? payload : payload.items;
  if (!Array.isArray(items)) {
    throw new Error("Respuesta inesperada de servicios publicos");
  }

  return items.map(normalizePublicService).filter((service) => service.name && service.company.slug);
}

function normalizePublicService(service) {
  const company = service.company || {};
  const companySlug = company.slug || company.id || service.companySlug || service.providerId || "";
  const gallery = normalizeGallery(service.gallery, service.coverUrl || company.coverUrl, service.name);

  return {
    id: service.id || service.slug || `${companySlug}-${service.name || "servicio"}`,
    slug: service.slug || service.id || "",
    name: service.name || "Servicio publicado",
    category: service.category || "",
    eventTypes: Array.isArray(service.eventTypes) ? service.eventTypes : [],
    description: service.description || "",
    priceFrom: service.priceFrom || service.price || "Consultar",
    coverUrl: service.coverUrl || company.coverUrl || CONFIG.fallbackProviderImage,
    hasServiceCoverUrl: Boolean(service.coverUrl),
    gallery,
    company: {
      id: company.id || companySlug,
      slug: companySlug,
      name: company.name || "Empresa publicada",
      province: company.province || "",
      canton: company.canton || "",
      plan: company.plan || "free",
      logoUrl: company.logoUrl || "",
    },
  };
}

function buildDemoServices() {
  return packages
    .map((pack) => {
      const provider = providers.find((item) => item.id === pack.providerId);
      if (!provider) return null;

      return {
        id: pack.id,
        slug: pack.id,
        name: pack.title,
        category: provider.category,
        eventTypes: pack.eventType ? [pack.eventType] : [],
        description: pack.details || provider.description,
        priceFrom: pack.price || provider.price || "Consultar",
        coverUrl: provider.image || CONFIG.fallbackProviderImage,
        hasServiceCoverUrl: Boolean(provider.image),
        gallery: normalizeGallery(provider.gallery, provider.image, provider.name),
        company: {
          id: provider.id,
          slug: provider.id,
          name: provider.name,
          province: provider.location,
          canton: "",
          plan: "demo",
          logoUrl: "",
        },
      };
    })
    .filter(Boolean);
}

function normalizeGallery(gallery, fallbackImage, fallbackAlt) {
  if (Array.isArray(gallery) && gallery.length) {
    return gallery
      .map((item) => ({
        src: typeof item === "string" ? item : item.src,
        alt: typeof item === "string" ? fallbackAlt : item.alt || fallbackAlt,
      }))
      .filter((item) => item.src);
  }

  return [
    {
      src: fallbackImage || CONFIG.fallbackProviderImage,
      alt: fallbackAlt || "Servicio",
    },
  ];
}

function galleryKey(src) {
  try {
    return new URL(String(src || ""), window.location.href).href;
  } catch {
    return String(src || "").trim();
  }
}

function serviceVisualGallery(service, fallbackImage, fallbackAlt) {
  const items = [];
  const seen = new Set();
  const addItem = (item, defaultAlt) => {
    const src = typeof item === "string" ? item : item?.src;
    if (!src) return;

    const key = galleryKey(src);
    if (seen.has(key)) return;

    seen.add(key);
    items.push({
      src,
      alt: typeof item === "string" ? defaultAlt : item.alt || defaultAlt,
    });
  };

  if (service?.hasServiceCoverUrl !== false) {
    addItem(service?.coverUrl, service?.name || fallbackAlt);
  }
  normalizeGallery(service?.gallery, "", fallbackAlt).forEach((item) => addItem(item, fallbackAlt));

  return items.length
    ? items
    : normalizeGallery([], fallbackImage || CONFIG.fallbackProviderImage, fallbackAlt);
}

function imageFallbackAttribute() {
  return `onerror="this.onerror=null;this.src='${CONFIG.fallbackProviderImage}'"`;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function safeText(value, fallback = "") {
  return escapeHtml(value ?? fallback);
}

function safeUrl(value, fallback = "#") {
  try {
    const url = new URL(String(value || ""), window.location.href);
    if (["http:", "https:"].includes(url.protocol)) return escapeHtml(url.href);
    if (url.hash && url.origin === window.location.origin && url.pathname === window.location.pathname) {
      return escapeHtml(`${url.hash}`);
    }
  } catch {
    // Fall through to fallback.
  }
  return escapeHtml(fallback);
}

function safeImageUrl(value) {
  if (String(value || "").startsWith("assets/")) return escapeHtml(value);

  try {
    const url = new URL(String(value || ""), window.location.href);
    if (url.protocol === "https:") return escapeHtml(url.href);
    if (url.origin === window.location.origin && url.pathname.startsWith("/assets/")) {
      return escapeHtml(`${url.pathname}${url.search}`);
    }
  } catch {
    // Fall through to fallback.
  }
  return escapeHtml(CONFIG.fallbackProviderImage);
}

function isLocalDemoEnvironment() {
  return ["localhost", "127.0.0.1", ""].includes(window.location.hostname);
}

function isAllowedProviderImage(file) {
  return ["image/jpeg", "image/png", "image/webp"].includes(file.type);
}

function setButtonLoading(button, isLoading, loadingText = "Procesando...") {
  if (!button) return;
  if (isLoading) {
    button.dataset.originalText = button.textContent;
    button.textContent = loadingText;
    button.disabled = true;
  } else {
    button.textContent = button.dataset.originalText || button.textContent;
    button.disabled = false;
    delete button.dataset.originalText;
  }
}

function providerHref(provider) {
  return `#proveedor/${encodeURIComponent(provider.id || "")}`;
}

function serviceHref(service) {
  const companySlug = service.company?.slug || "";
  const serviceSlug = service.slug || "";
  const suffix = serviceSlug ? `/${encodeURIComponent(serviceSlug)}` : "";
  return `#proveedor/${encodeURIComponent(companySlug)}${suffix}`;
}

function packagesForProvider(providerId) {
  return packages.filter((pack) => pack.providerId === providerId);
}

function dataSourceNotice() {
  if (serviceDataSource !== "demo" || !serviceDataNotice) return "";
  return `<p class="data-source-note">${safeText(serviceDataNotice)}</p>`;
}

function providerCard(provider) {
  const tags = Array.isArray(provider.tags) ? provider.tags : [];
  return `
    <article class="provider-card">
      <img src="${safeImageUrl(provider.image)}" alt="${safeText(`${provider.category || ""} ${provider.name || ""}`)}" loading="lazy" ${imageFallbackAttribute()}>
      <div class="card-body">
        <div class="tag-row">
          ${tags.map((tag, index) => `<span class="tag ${index === 0 ? "verified" : ""}">${safeText(tag)}</span>`).join("")}
        </div>
        <div>
          <h3>${safeText(provider.name)}</h3>
          <p class="card-meta">${safeText(provider.category)} · ${safeText(provider.location)}</p>
        </div>
        <p>${safeText(provider.description)}</p>
        <strong>${safeText(provider.price)}</strong>
        <div class="card-actions">
          <a class="ghost-button" href="${safeText(providerHref(provider))}">Ver ficha</a>
          <button class="secondary-button" data-open-quote>Cotizar</button>
        </div>
      </div>
    </article>
  `;
}

function serviceCard(service) {
  const meta = [service.category, service.company?.province].filter(Boolean).join(" · ");
  return `
    <article class="provider-card">
      <img src="${safeImageUrl(service.coverUrl)}" alt="${safeText(service.name)}" loading="lazy" ${imageFallbackAttribute()}>
      <div class="card-body">
        <div class="tag-row">
          <span class="tag verified">Servicio publicado</span>
          ${service.company?.plan && service.company.plan !== "free" ? `<span class="tag">${safeText(service.company.plan)}</span>` : ""}
        </div>
        <div>
          <h3>${safeText(service.name)}</h3>
          <p class="card-meta">${safeText(service.company?.name)}${meta ? ` · ${safeText(meta)}` : ""}</p>
        </div>
        <p>${safeText(service.description)}</p>
        <strong>${safeText(service.priceFrom)}</strong>
        <div class="card-actions">
          <a class="ghost-button" href="${safeText(serviceHref(service))}">Ver empresa</a>
          <button class="secondary-button" data-open-quote data-service-name="${safeText(service.name)}">Cotizar servicio</button>
        </div>
      </div>
    </article>
  `;
}

function wideProviderCard(provider) {
  const tags = Array.isArray(provider.tags) ? provider.tags : [];
  return `
    <article class="wide-card" data-category="${safeText(provider.category)}">
      <img src="${safeImageUrl(provider.image)}" alt="${safeText(provider.name)}" loading="lazy" ${imageFallbackAttribute()}>
      <div class="card-body">
        <div class="tag-row">
          ${tags.map((tag, index) => `<span class="tag ${index === 0 ? "verified" : ""}">${safeText(tag)}</span>`).join("")}
        </div>
        <div>
          <h3>${safeText(provider.name)}</h3>
          <p class="card-meta">${safeText(provider.category)} · ${safeText(provider.location)}</p>
          ${ratingStars(provider.rating, provider.reviews)}
        </div>
        <p>${safeText(provider.description)}</p>
        <strong>${safeText(provider.price)}</strong>
        <div class="card-actions">
          <a class="ghost-button" href="${safeText(providerHref(provider))}">Ver ficha</a>
          <button class="primary-button" data-open-quote>Pedir presupuesto</button>
        </div>
      </div>
    </article>
  `;
}

function wideServiceCard(service) {
  const meta = [service.category, service.company?.province].filter(Boolean).join(" · ");
  const eventTags = Array.isArray(service.eventTypes) ? service.eventTypes.slice(0, 2) : [];
  return `
    <article class="wide-card" data-category="${safeText(service.category)}">
      <img src="${safeImageUrl(service.coverUrl)}" alt="${safeText(service.name)}" loading="lazy" ${imageFallbackAttribute()}>
      <div class="card-body">
        <div class="tag-row">
          <span class="tag verified">Servicio</span>
          ${eventTags.map((eventType) => `<span class="tag">${safeText(eventType)}</span>`).join("")}
        </div>
        <div>
          <h3>${safeText(service.name)}</h3>
          <p class="card-meta">${safeText(service.company?.name)}${meta ? ` · ${safeText(meta)}` : ""}</p>
        </div>
        <p>${safeText(service.description)}</p>
        <strong>${safeText(service.priceFrom)}</strong>
        <div class="card-actions">
          <a class="ghost-button" href="${safeText(serviceHref(service))}">Ver empresa</a>
          <button class="primary-button" data-open-quote data-service-name="${safeText(service.name)}">Cotizar servicio</button>
        </div>
      </div>
    </article>
  `;
}

function ratingStars(rating, reviews) {
  return `
    <div class="rating-row" aria-label="${safeText(rating)} de 5 estrellas, ${safeText(reviews)} opiniones">
      <span class="stars" aria-hidden="true">★★★★★</span>
      <span>${safeText(rating)}</span>
      <span class="dot" aria-hidden="true">·</span>
      <span>${safeText(reviews)} opiniones</span>
    </div>
  `;
}

function packageCard(pack) {
  return `
    <article class="package-card">
      <p class="package-meta">${safeText(pack.vendor)}</p>
      <h3>${safeText(pack.title)}</h3>
      <p>${safeText(pack.details)}</p>
      <div class="package-price">${safeText(pack.price)}</div>
      <button class="secondary-button" data-open-quote>Cotizar paquete</button>
    </article>
  `;
}

function normalizeFilterValue(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function serviceMatchesFilters(service, filters = {}) {
  const serviceText = normalizeFilterValue(
    [
      service.name,
      service.category,
      service.description,
      service.company?.name,
      service.company?.province,
      ...(service.eventTypes || []),
    ].join(" "),
  );
  const q = normalizeFilterValue(filters.q);
  const eventType = normalizeFilterValue(filters.eventType);
  const province = normalizeFilterValue(filters.province);
  const serviceCategory = normalizeFilterValue(filters.service);

  if (q && !serviceText.includes(q)) return false;
  if (eventType && eventType !== "todos" && !serviceText.includes(eventType)) return false;
  if (province && province !== "todos" && !normalizeFilterValue(service.company?.province).includes(province)) return false;
  if (serviceCategory && serviceCategory !== "todos" && !serviceText.includes(serviceCategory)) return false;
  return true;
}

function hasActiveServiceFilters(filters = {}) {
  return ["q", "eventType", "province", "service"].some((key) => {
    const value = normalizeFilterValue(filters[key]);
    return value && value !== "todos";
  });
}

function filteredServices() {
  if (!hasActiveServiceFilters(currentSearchFilters)) return services;
  return services.filter((service) => serviceMatchesFilters(service, currentSearchFilters));
}

function emptyServicesState() {
  return `
    <article class="empty-results" role="status">
      <p class="eyebrow">Sin coincidencias</p>
      <h3>No encontramos servicios con esos filtros</h3>
      <p>Prueba con otra categoria o provincia para ver mas opciones disponibles.</p>
      <button class="secondary-button" type="button" data-clear-service-filters>Limpiar filtros</button>
    </article>
  `;
}

function selectedOption(currentValue, optionValue) {
  return normalizeFilterValue(currentValue) === normalizeFilterValue(optionValue) ? "selected" : "";
}

function homePage() {
  return `
    <section class="hero" style="--hero-image: url('${image("photo-1511795409834-ef04bbd61622")}')">
      <div class="hero-inner">
        <div class="hero-copy">
          <p class="eyebrow">Eventos en Costa Rica</p>
          <h1>Encontra proveedores confiables para tu evento</h1>
          <p>Compara salones, catering, musica, decoracion y paquetes. Pedi cotizaciones gratis y reserva con mas seguridad.</p>
        </div>
        <form class="search-panel" id="homeSearch">
          <div class="field">
            <label for="eventType">Tipo de evento</label>
            <select id="eventType" name="eventType">
              <option>Boda</option>
              <option>Evento corporativo</option>
              <option>Fiesta infantil</option>
              <option>Graduacion</option>
            </select>
          </div>
          <div class="field">
            <label for="location">Ubicacion</label>
            <select id="location" name="location">
              <option>San Jose</option>
              <option>Heredia</option>
              <option>Alajuela</option>
              <option>Guanacaste</option>
            </select>
          </div>
          <div class="field">
            <label for="guests">Invitados</label>
            <input id="guests" name="guests" type="number" value="80" min="10" max="1000">
          </div>
          <button class="primary-button" type="submit">Encontrar proveedores</button>
        </form>
      </div>
    </section>

    <section class="trust-strip" aria-label="Indicadores">
      <div class="metric"><strong>13k+</strong><span>proveedores registrados</span></div>
      <div class="metric"><strong>15+</strong><span>anos conectando eventos</span></div>
      <div class="metric"><strong>50+</strong><span>categorias de servicio</span></div>
      <div class="metric"><strong>1</strong><span>solicitud para varias cotizaciones</span></div>
    </section>

    <section class="section">
      <div class="section-header">
        <div>
          <p class="eyebrow">Categorias</p>
          <h2>Atajos para empezar</h2>
        </div>
        <a class="ghost-button" href="#bodas">Ver bodas</a>
      </div>
      <div class="category-grid">
        ${categories
          .map(
            (category) => `
              <a class="category-tile" href="${safeUrl(category.href, "#inicio")}">
                <img src="${safeImageUrl(category.image)}" alt="${safeText(category.name)}" loading="lazy" ${imageFallbackAttribute()}>
                <span>${safeText(category.name)}</span>
              </a>
            `,
          )
          .join("")}
      </div>
    </section>

    <section class="band">
      <div class="section">
        <div class="section-header">
          <div>
            <p class="eyebrow">Flujo de conversion</p>
            <h2>Busca, compara y cotiza</h2>
          </div>
        </div>
        <div class="steps">
          <article class="step"><span class="step-number">01</span><h3>Filtra por evento</h3><p>El cliente llega directo a opciones relevantes por tipo de evento, zona y tamano.</p></article>
          <article class="step"><span class="step-number">02</span><h3>Compara proveedores</h3><p>Precios, fotos, opiniones, insignias y paquetes ayudan a decidir mas rapido.</p></article>
          <article class="step"><span class="step-number">03</span><h3>Pide cotizaciones</h3><p>Una solicitud puede enviarse a varios proveedores para aumentar conversion.</p></article>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="section-header">
        <div>
          <p class="eyebrow">Destacados</p>
          <h2>Servicios listos para cotizar</h2>
        </div>
        <button class="ghost-button" data-open-quote>Cotizacion multiple</button>
      </div>
      <div class="cards-grid">
        ${services.slice(0, 3).map(serviceCard).join("")}
      </div>
      ${dataSourceNotice()}
    </section>

    <section class="band">
      <div class="section split">
        <div>
          <p class="eyebrow">Paquetes</p>
          <h2>Precios que ayudan a decidir</h2>
          <ul class="feature-list">
            <li><span class="check">✓</span><span>Paquetes comparables por evento y presupuesto.</span></li>
            <li><span class="check">✓</span><span>Proveedor, precio, ubicacion y beneficios visibles desde el listado.</span></li>
            <li><span class="check">✓</span><span>Contacto directo para convertir busquedas en oportunidades.</span></li>
          </ul>
          <a class="primary-button" href="#bodas">Explorar paquetes</a>
        </div>
        <div class="image-stack">
          <img src="${image("photo-1520854221256-17451cc331bf")}" alt="Recepcion de boda" loading="lazy">
          <img src="${image("photo-1546032996-6dfacbacbf3f")}" alt="Mesa de evento" loading="lazy">
        </div>
      </div>
    </section>

    <section class="cta-band">
      <div class="section">
        <div>
          <p class="eyebrow">Para proveedores</p>
          <h2>Convierte visibilidad en solicitudes</h2>
          <p>Una pagina para vender el registro antes de mostrar formularios largos.</p>
        </div>
        <a class="primary-button" href="#empresas">Crear perfil gratis</a>
      </div>
    </section>
  `;
}

function weddingsPage() {
  const results = filteredServices();
  return `
    <section class="subhero">
      <div class="subhero-inner">
        <div>
          <p class="eyebrow">Bodas en Costa Rica</p>
          <h1>Organiza tu boda con proveedores verificados</h1>
          <p>Compara salones, catering, decoracion, musica y fotografia con paquetes claros y contacto directo.</p>
          <button class="primary-button" data-open-quote>Pedir cotizacion a varios</button>
        </div>
        <img src="${image("photo-1523438885200-e635ba2c371e")}" alt="Decoracion de boda">
      </div>
    </section>
    <section class="section">
      <form class="filter-bar" id="weddingFilters">
        <div class="field">
          <label>Servicio</label>
          <select name="service">
            <option ${selectedOption(currentSearchFilters.service, "Todos")}>Todos</option>
            <option ${selectedOption(currentSearchFilters.service, "Salon y jardin")}>Salon y jardin</option>
            <option ${selectedOption(currentSearchFilters.service, "Catering")}>Catering</option>
            <option ${selectedOption(currentSearchFilters.service, "Musica y luces")}>Musica y luces</option>
            <option ${selectedOption(currentSearchFilters.service, "Decoracion floral")}>Decoracion floral</option>
          </select>
        </div>
        <div class="field">
          <label>Provincia</label>
          <select name="province">
            <option ${selectedOption(currentSearchFilters.province, "Todos")}>Todos</option>
            <option ${selectedOption(currentSearchFilters.province, "San Jose")}>San Jose</option>
            <option ${selectedOption(currentSearchFilters.province, "Heredia")}>Heredia</option>
            <option ${selectedOption(currentSearchFilters.province, "Alajuela")}>Alajuela</option>
          </select>
        </div>
        <div class="field">
          <label>Invitados</label>
          <input name="guests" type="number" value="120" min="20">
        </div>
        <div class="field">
          <label>Presupuesto</label>
          <select name="budget">
            <option>Medio</option>
            <option>Economico</option>
            <option>Premium</option>
          </select>
        </div>
        <button class="primary-button" type="submit">Aplicar filtros</button>
      </form>

      <div class="results-layout">
        <aside class="side-panel">
          <h3>Servicios para boda</h3>
          <div class="checkbox-list">
            <label><input type="checkbox" checked> Salones</label>
            <label><input type="checkbox" checked> Catering</label>
            <label><input type="checkbox"> Fotografia</label>
            <label><input type="checkbox"> Decoracion</label>
            <label><input type="checkbox"> Musica</label>
            <label><input type="checkbox"> Wedding planner</label>
          </div>
        </aside>
        <div>
          <div class="section-header">
            <div>
            <p class="eyebrow">Resultados</p>
              <h2>Servicios recomendados</h2>
            </div>
            <button class="ghost-button" data-open-quote>Cotizar seleccionados</button>
          </div>
          <div class="result-list" id="providerResults">
            ${results.length ? results.map(wideServiceCard).join("") : emptyServicesState()}
          </div>
          ${dataSourceNotice()}
        </div>
      </div>
    </section>

    <section class="band">
      <div class="section">
        <div class="section-header">
          <div>
            <p class="eyebrow">Paquetes de boda</p>
            <h2>Comparacion rapida de precios</h2>
          </div>
        </div>
        <div class="cards-grid">
          ${packages.map(packageCard).join("")}
        </div>
      </div>
    </section>
  `;
}

async function providerPage(companySlug, serviceSlug = "") {
  if (serviceDataSource === "api" && companySlug) {
    try {
      const company = await fetchPublicCompany(companySlug, serviceSlug);
      return companyProfilePage(company, serviceSlug || company.selectedServiceSlug || "");
    } catch (error) {
      console.info("Usando fallback demo de perfil.", error);
    }
  }

  return providerDemoPage(companySlug);
}

async function fetchPublicCompany(companySlug, serviceSlug = "") {
  const cacheKey = `${companySlug}:${serviceSlug}`;
  if (companyProfileCache.has(cacheKey)) return companyProfileCache.get(cacheKey);

  const url = new URL(CONFIG.publicCompanyUrl(companySlug), window.location.href);
  if (serviceSlug) url.searchParams.set("service", serviceSlug);
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`No se pudo cargar la empresa ${companySlug}`);
  }

  const company = await response.json();
  companyProfileCache.set(cacheKey, company);
  return company;
}

function companyProfilePage(company, selectedServiceSlug = "") {
  const publishedServices = (Array.isArray(company.services) ? company.services : [])
    .filter((service) => !service.status || service.status === "published")
    .map((service) =>
      normalizePublicService({
        ...service,
        company: {
          id: company.id,
          slug: company.slug,
          name: company.name,
          province: company.province,
          canton: company.canton,
          plan: company.plan,
          logoUrl: company.logoUrl,
        },
      }),
    );
  const selectedService =
    publishedServices.find((service) => service.slug === selectedServiceSlug) || publishedServices[0];

  if (!company || company.status !== "published" || !publishedServices.length || !selectedService) {
    return `
      <section class="section">
        <p class="eyebrow">Empresa no disponible</p>
        <h1>No encontramos servicios publicados</h1>
        <p>Vuelve al listado para elegir una empresa disponible.</p>
        <a class="primary-button" href="#bodas">Ver servicios</a>
      </section>
    `;
  }

  providerGallery = serviceVisualGallery(
    selectedService,
    selectedService.coverUrl || company.coverUrl || CONFIG.fallbackProviderImage,
    selectedService.name,
  );
  const location = [company.canton, company.province].filter(Boolean).join(", ");

  return `
    <section class="provider-hero">
      <div>
        <div class="provider-carousel" aria-label="Galeria de fotos de la empresa">
          <div class="carousel-stage">
            <button class="carousel-nav prev" type="button" data-carousel-prev aria-label="Foto anterior">&lsaquo;</button>
            <img class="carousel-image" src="${safeImageUrl(providerGallery[0].src)}" alt="${safeText(providerGallery[0].alt)}" data-carousel-image ${imageFallbackAttribute()}>
            <button class="carousel-nav next" type="button" data-carousel-next aria-label="Foto siguiente">&rsaquo;</button>
            <div class="carousel-count" data-carousel-count>1 / ${providerGallery.length}</div>
          </div>
          <div class="carousel-thumbs" aria-label="Miniaturas">
            ${providerGallery
              .map(
                (item, index) => `
                  <button class="thumb ${index === 0 ? "is-active" : ""}" type="button" data-carousel-thumb="${index}" aria-label="Ver foto ${index + 1}">
                    <img src="${safeImageUrl(item.src)}" alt="${safeText(item.alt)}" loading="lazy" ${imageFallbackAttribute()}>
                  </button>
                `,
              )
              .join("")}
          </div>
        </div>
      </div>
      <aside class="provider-summary">
        <div class="tag-row">
          <span class="tag verified">Empresa publicada</span>
          <span class="tag">${safeText(company.plan || "free")}</span>
        </div>
        <h1 class="provider-title">${safeText(company.name)}</h1>
        <p class="card-meta">${safeText(location || company.province || "Costa Rica")}</p>
        <div class="summary-price">
          <span>Servicio destacado</span>
          <strong>${safeText(selectedService.name)}</strong>
        </div>
        <div class="card-actions">
          <button class="primary-button" data-open-quote data-service-name="${safeText(selectedService.name)}">Cotizar servicio</button>
          <a class="secondary-button" href="#bodas">Ver mas servicios</a>
        </div>
      </aside>
    </section>

    <section class="provider-content">
      <div class="content-grid">
        <div>
          <article class="content-block">
            <p class="eyebrow">Servicio seleccionado</p>
            <h2>${safeText(selectedService.name)}</h2>
            <p>${safeText(selectedService.description || company.description)}</p>
            <ul class="feature-list">
              <li><span class="check">&#10003;</span><span>${safeText(selectedService.category || "Servicio para eventos")}.</span></li>
              <li><span class="check">&#10003;</span><span>${safeText(selectedService.priceFrom || "Precio a consultar")}.</span></li>
              <li><span class="check">&#10003;</span><span>Cotizacion por servicio desde la ficha de empresa.</span></li>
            </ul>
          </article>

          <article class="content-block">
            <p class="eyebrow">Servicios de la empresa</p>
            <h2>Opciones publicadas</h2>
            <div class="service-list">
              ${publishedServices
                .map(
                  (service) => `
                    <article class="service-option ${service.slug === selectedService.slug ? "is-selected" : ""}">
                      <div>
                        <p class="package-meta">${safeText(service.category)}</p>
                        <h3>${safeText(service.name)}</h3>
                        <p>${safeText(service.description)}</p>
                      </div>
                      <div>
                        <strong>${safeText(service.priceFrom)}</strong>
                        <a class="ghost-button" href="${safeText(serviceHref(service))}">Ver servicio</a>
                      </div>
                    </article>
                  `,
                )
                .join("")}
            </div>
          </article>
        </div>

        <aside class="side-panel">
          <h3>Datos clave</h3>
          <ul class="feature-list">
            <li><span class="check">&#10003;</span><span>${safeText(location || "Costa Rica")}.</span></li>
            <li><span class="check">&#10003;</span><span>${publishedServices.length} servicio(s) publicado(s).</span></li>
            <li><span class="check">&#10003;</span><span>Perfil revisado antes de publicarse.</span></li>
          </ul>
          <button class="primary-button" data-open-quote data-service-name="${safeText(selectedService.name)}">Pedir presupuesto</button>
        </aside>
      </div>
    </section>
  `;
}

function providerDemoPage(providerId) {
  const selectedProvider = providerId ? providers.find((item) => item.id === providerId) : providers[0];
  const provider = selectedProvider || providers[0];
  if (!provider) {
    return `
      <section class="section">
        <p class="eyebrow">Proveedor no disponible</p>
        <h1>No encontramos proveedores publicados</h1>
        <p>Revisa data/providers.json o vuelve al inicio para continuar la demo.</p>
        <a class="primary-button" href="#inicio">Volver al inicio</a>
      </section>
    `;
  }

  if (providerId && !selectedProvider) {
    return `
      <section class="section">
        <p class="eyebrow">Proveedor no encontrado</p>
        <h1>Ese proveedor no esta publicado en la demo</h1>
        <p>Vuelve al listado para elegir una ficha disponible.</p>
        <a class="primary-button" href="#bodas">Ver proveedores</a>
      </section>
    `;
  }

  const providerPackages = packagesForProvider(provider.id);
  providerGallery = Array.isArray(provider.gallery) && provider.gallery.length
    ? provider.gallery
    : [{ src: provider.image || CONFIG.fallbackProviderImage, alt: provider.name || "Proveedor" }];
  const tags = Array.isArray(provider.tags) ? provider.tags : [];

  return `
    <section class="provider-hero">
      <div>
        <div class="provider-carousel" aria-label="Galeria de fotos del proveedor">
          <div class="carousel-stage">
            <button class="carousel-nav prev" type="button" data-carousel-prev aria-label="Foto anterior">‹</button>
            <img class="carousel-image" src="${safeImageUrl(providerGallery[0].src)}" alt="${safeText(providerGallery[0].alt)}" data-carousel-image ${imageFallbackAttribute()}>
            <button class="carousel-nav next" type="button" data-carousel-next aria-label="Foto siguiente">›</button>
            <div class="carousel-count" data-carousel-count>1 / ${providerGallery.length}</div>
          </div>
          <div class="carousel-thumbs" aria-label="Miniaturas">
            ${providerGallery
              .map(
                (item, index) => `
                  <button class="thumb ${index === 0 ? "is-active" : ""}" type="button" data-carousel-thumb="${index}" aria-label="Ver foto ${index + 1}">
                    <img src="${safeImageUrl(item.src)}" alt="${safeText(item.alt)}" loading="lazy" ${imageFallbackAttribute()}>
                  </button>
                `,
              )
              .join("")}
          </div>
        </div>
      </div>
      <aside class="provider-summary">
        <div class="tag-row">
          ${tags.map((tag, index) => `<span class="tag ${index === 0 ? "verified" : ""}">${safeText(tag)}</span>`).join("")}
        </div>
        <h1 class="provider-title">${safeText(provider.name)}</h1>
        <p class="card-meta">${safeText(provider.category)} · ${safeText(provider.location)}</p>
        ${ratingStars(provider.rating, provider.reviews)}
        <div class="summary-price">
          <span>Paquetes</span>
          <strong>${safeText(provider.price)}</strong>
        </div>
        <div class="card-actions">
          <button class="primary-button" data-open-quote>Pedir presupuesto</button>
          <button class="secondary-button" data-toast="WhatsApp demo: se abriria una conversacion con el proveedor.">WhatsApp</button>
        </div>
      </aside>
    </section>

    <section class="provider-content">
      <div class="content-grid">
        <div>
          <article class="content-block">
            <p class="eyebrow">Servicios</p>
            <h2>${safeText(provider.category)} para eventos</h2>
            <p>${safeText(provider.description)}</p>
            <ul class="feature-list">
              <li><span class="check">✓</span><span>Perfil demo con informacion comercial lista para validar.</span></li>
              <li><span class="check">✓</span><span>Precio, ubicacion, fotos y paquetes visibles antes del contacto.</span></li>
              <li><span class="check">✓</span><span>Cotizacion demo por formulario; sin envio real en esta fase.</span></li>
            </ul>
          </article>

          <article class="content-block">
            <p class="eyebrow">Paquetes</p>
            <h2>Opciones disponibles</h2>
            <div class="cards-grid">
              ${
                providerPackages.length
                  ? providerPackages.map(packageCard).join("")
                  : '<article class="package-card"><p class="package-meta">Demo</p><h3>Paquetes por definir</h3><p>Este proveedor todavia no tiene paquetes cargados en data/packages.json.</p><div class="package-price">Consultar</div><button class="secondary-button" data-open-quote>Cotizar servicio</button></article>'
              }
            </div>
          </article>

          <article class="content-block">
            <p class="eyebrow">Opiniones</p>
            <h2>Clientes recientes</h2>
            <div class="review-grid">
              <article class="review-card"><h3>Excelente atencion</h3><p>Respondieron rapido, el montaje quedo igual a las fotos y el presupuesto fue claro.</p><strong>Mariana R.</strong></article>
              <article class="review-card"><h3>Muy buena experiencia</h3><p>Nos ayudaron con salon, cena y coordinacion. La ficha tenia todo lo necesario para decidir.</p><strong>Carlos M.</strong></article>
            </div>
          </article>
        </div>

        <aside class="side-panel">
          <h3>Datos clave</h3>
          <ul class="feature-list">
            <li><span class="check">✓</span><span>${safeText(provider.location)}.</span></li>
            <li><span class="check">✓</span><span>${safeText(provider.price)}.</span></li>
            <li><span class="check">✓</span><span>${providerPackages.length} paquete(s) demo disponible(s).</span></li>
            <li><span class="check">✓</span><span>Cotizacion por formulario demo.</span></li>
          </ul>
          <button class="primary-button" data-open-quote>Pedir presupuesto</button>
        </aside>
      </div>
    </section>
  `;
}

function companiesPage() {
  return `
    <section class="subhero">
      <div class="subhero-inner">
        <div>
          <p class="eyebrow">Proveedores</p>
          <h1>Recibi clientes interesados en tus servicios de eventos</h1>
          <p>Crea un perfil profesional, publica paquetes, muestra fotos y recibe solicitudes de presupuesto desde un solo lugar.</p>
          <a class="primary-button" href="#registro-empresa" data-scroll-register>Crear perfil gratis</a>
        </div>
        <img src="${image("photo-1556761175-b413da4baf72")}" alt="Equipo revisando solicitudes">
      </div>
    </section>

    <section class="section split">
      <div>
        <p class="eyebrow">Valor para empresas</p>
        <h2>Una pagina que vende antes del formulario</h2>
        <ul class="feature-list">
          <li><span class="check">✓</span><span>Perfil con galeria, paquetes, promociones y datos de contacto.</span></li>
          <li><span class="check">✓</span><span>Solicitudes de presupuesto de personas con intencion real.</span></li>
          <li><span class="check">✓</span><span>Insignias y estadisticas para mejorar confianza y conversion.</span></li>
          <li><span class="check">✓</span><span>Opciones destacadas para aparecer en categorias clave.</span></li>
        </ul>
      </div>
      <div class="image-stack">
        <img src="${image("photo-1551836022-d5d88e9218df")}" alt="Proveedor administrando perfil" loading="lazy">
        <img src="${image("photo-1556761175-4b46a572b786")}" alt="Dashboard de trabajo" loading="lazy">
      </div>
    </section>

    <section class="section" id="registro-empresa">
      <div class="section-header">
        <div>
          <p class="eyebrow">Alta gratuita</p>
          <h2 id="registroEmpresaTitle" tabindex="-1">Registra tu empresa y publica tu perfil</h2>
        </div>
        <p>Por ahora el registro es gratis. El pago entraria despues solo para empresas que quieran mejor posicion, aparecer arriba o estar destacadas en categorias clave.</p>
      </div>
      <form class="company-form" id="companyForm">
        <div class="form-panel">
          <h3>Datos de la empresa</h3>
          <div class="company-form-grid">
            <label>
              Nombre comercial
              <input name="companyName" type="text" placeholder="Ej. Casa Arboleda Eventos" required>
            </label>
            <label>
              Categoria principal
              <select name="category" required>
                <option value="">Seleccionar categoria</option>
                <option>Salon y jardin</option>
                <option>Catering</option>
                <option>Musica y luces</option>
                <option>Decoracion</option>
                <option>Fotografia</option>
                <option>Organizacion de eventos</option>
              </select>
            </label>
            <label>
              Provincia / zona
              <input name="location" type="text" placeholder="Ej. Santa Ana, San Jose" required>
            </label>
            <label>
              WhatsApp comercial
              <input name="whatsapp" type="tel" placeholder="50688888888" inputmode="tel" required>
            </label>
            <label>
              Email de contacto
              <input name="email" type="email" placeholder="contacto@empresa.com" autocomplete="email" required>
            </label>
            <label>
              Precio desde
              <input name="price" type="text" placeholder="Ej. Desde CRC 28,500 / pers.">
            </label>
            <label>
              Sitio web o Instagram
              <input name="website" type="url" placeholder="https://...">
            </label>
            <label class="full">
              Descripcion corta
              <textarea name="description" rows="4" placeholder="Describe que ofrecen, para que eventos trabajan y que los hace diferentes." required></textarea>
            </label>
          </div>
        </div>

        <div class="form-panel">
          <h3>Fotos del perfil</h3>
          <p class="form-help">Sube logo, portada y fotos de galeria. En Azure se cargan para revision; en local solo se previsualizan si la API no esta disponible.</p>
          <label class="upload-box">
            <input id="companyPhotos" name="photos" type="file" accept="image/jpeg,image/png,image/webp" multiple>
            <span>Agregar fotos</span>
            <small>Maximo 6 imagenes JPG, PNG o WEBP. Hasta 5 MB cada una.</small>
          </label>
          <div class="upload-preview" id="companyPhotoPreview" aria-live="polite">
            <div class="preview-empty">Las fotos cargadas apareceran aqui.</div>
          </div>
        </div>

        <div class="form-panel">
          <h3>Publicacion</h3>
          <div class="publish-summary">
            <div>
              <strong>Plan gratis</strong>
              <span>Perfil publicado en categoria principal, con fotos, descripcion y contacto.</span>
            </div>
            <div>
              <strong>Destacado despues</strong>
              <span>Pago unico o plan para aparecer arriba, en portada o en el top de resultados.</span>
            </div>
          </div>
          <label class="consent-row">
            <input name="terms" type="checkbox" required>
            Confirmo que tengo permiso para publicar esta informacion y estas imagenes.
          </label>
          <button class="primary-button" type="submit">Enviar registro gratis</button>
        </div>
      </form>
      <div class="company-confirmation is-hidden" id="companyConfirmation" tabindex="-1" aria-live="polite"></div>
    </section>

    <section class="band">
      <div class="section">
        <div class="section-header">
          <div>
            <p class="eyebrow">Planes demo</p>
            <h2>De registro gratis a visibilidad premium</h2>
          </div>
        </div>
        <div class="plan-grid">
          <article class="plan-card">
            <h3>Gratis</h3>
            <div class="plan-price">₡0</div>
            <ul>
              <li>Perfil basico</li>
              <li>Categoria principal</li>
              <li>Contacto directo</li>
            </ul>
            <a class="ghost-button" href="#registro-empresa" data-scroll-register>Empezar</a>
          </article>
          <article class="plan-card featured">
            <span class="tag verified">Recomendado</span>
            <h3>Destacado</h3>
            <div class="plan-price">₡29k</div>
            <ul>
              <li>Mayor posicion en listados</li>
              <li>Paquetes y promociones</li>
              <li>Solicitudes priorizadas</li>
            </ul>
            <button class="primary-button" data-toast="Plan destacado seleccionado.">Destacar empresa</button>
          </article>
          <article class="plan-card">
            <h3>Premium</h3>
            <div class="plan-price">₡59k</div>
            <ul>
              <li>Portada en categorias</li>
              <li>Campanas por temporada</li>
              <li>Reportes y optimizacion</li>
            </ul>
            <button class="secondary-button" data-toast="Plan premium seleccionado.">Solicitar llamada</button>
          </article>
        </div>
      </div>
    </section>
  `;
}

function companiesPageNew() {
  return `
    <section class="subhero">
      <div class="subhero-inner">
        <div>
          <p class="eyebrow">Proveedores</p>
          <h1>Recibi clientes interesados en tus servicios de eventos</h1>
          <p>Registra tu empresa gratis. Luego recibes acceso al panel para crear servicios, subir fotos y enviarlos a revision.</p>
          <div class="card-actions">
            <a class="primary-button" href="#registro-empresa" data-scroll-register>Crear perfil gratis</a>
            <a class="secondary-button" href="panel.html">Ya tengo acceso</a>
          </div>
        </div>
        <img src="${image("photo-1556761175-b413da4baf72")}" alt="Equipo revisando solicitudes">
      </div>
    </section>

    <section class="section split">
      <div>
        <p class="eyebrow">Valor para empresas</p>
        <h2>Una pagina que vende antes del formulario</h2>
        <ul class="feature-list">
          <li><span class="check">&#10003;</span><span>Registro gratis para iniciar la revision de la empresa.</span></li>
          <li><span class="check">&#10003;</span><span>Acceso posterior al panel para crear servicios y subir fotos.</span></li>
          <li><span class="check">&#10003;</span><span>Publicacion despues de moderacion interna de Punto Evento.</span></li>
          <li><span class="check">&#10003;</span><span>Opciones destacadas para aparecer en categorias clave.</span></li>
        </ul>
      </div>
      <div class="image-stack">
        <img src="${image("photo-1551836022-d5d88e9218df")}" alt="Proveedor administrando perfil" loading="lazy">
        <img src="${image("photo-1556761175-4b46a572b786")}" alt="Dashboard de trabajo" loading="lazy">
      </div>
    </section>

    <section class="section" id="registro-empresa">
      <div class="section-header">
        <div>
          <p class="eyebrow">Alta gratuita</p>
          <h2 id="registroEmpresaTitle" tabindex="-1">Registra tu empresa</h2>
        </div>
        <p>Luego de recibir tus datos, Punto Evento revisara la empresa y enviara acceso al panel para crear servicios, subir fotos y enviarlos a revision.</p>
      </div>
      <form class="company-form" id="companyForm">
        <div class="form-panel">
          <h3>Datos de la empresa</h3>
          <div class="company-form-grid">
            <label>
              Nombre comercial
              <input name="companyName" type="text" placeholder="Ej. Casa Arboleda Eventos" required>
            </label>
            <label>
              Provincia
              <input name="province" type="text" placeholder="Ej. San Jose" autocomplete="address-level1" required>
            </label>
            <label>
              Canton
              <input name="canton" type="text" placeholder="Ej. Santa Ana" autocomplete="address-level2">
            </label>
            <label>
              WhatsApp comercial
              <input name="whatsapp" type="tel" placeholder="50688888888" inputmode="tel" required>
            </label>
            <label>
              Email de contacto
              <input name="email" type="email" placeholder="contacto@empresa.com" autocomplete="email" required>
            </label>
            <label class="full">
              Descripcion de la empresa
              <textarea name="description" rows="4" placeholder="Describe que ofrece la empresa, en que zonas trabaja y que la hace diferente." required></textarea>
            </label>
          </div>
        </div>

        <div class="form-panel">
          <h3>Siguiente paso</h3>
          <p class="form-help">Cuando la empresa quede registrada, el equipo revisara la informacion y enviara acceso al panel.</p>
          <div class="publish-summary">
            <div>
              <strong>1. Registro</strong>
              <span>Envias los datos basicos de la empresa.</span>
            </div>
            <div>
              <strong>2. Panel empresa</strong>
              <span>Creas servicios, subes fotos y envias a revision.</span>
            </div>
            <div>
              <strong>3. Publicacion</strong>
              <span>Punto Evento modera y publica lo aprobado.</span>
            </div>
          </div>
          <a class="secondary-button" href="panel.html">Ya tengo acceso</a>
        </div>

        <div class="form-panel">
          <h3>Publicacion</h3>
          <div class="publish-summary">
            <div>
              <strong>Plan gratis</strong>
              <span>Registro revisado por Punto Evento antes de activar el panel.</span>
            </div>
            <div>
              <strong>Destacado despues</strong>
              <span>Pago unico o plan para aparecer arriba, en portada o en el top de resultados.</span>
            </div>
          </div>
          <label class="consent-row">
            <input name="terms" type="checkbox" required>
            Confirmo que tengo permiso para registrar esta empresa y compartir esta informacion.
          </label>
          <button class="primary-button" type="submit">Enviar registro gratis</button>
        </div>
      </form>
      <div class="company-confirmation is-hidden" id="companyConfirmation" tabindex="-1" aria-live="polite"></div>
    </section>

    <section class="band">
      <div class="section">
        <div class="section-header">
          <div>
            <p class="eyebrow">Planes demo</p>
            <h2>De registro gratis a visibilidad premium</h2>
          </div>
        </div>
        <div class="plan-grid">
          <article class="plan-card">
            <h3>Gratis</h3>
            <div class="plan-price">CRC 0</div>
            <ul>
              <li>Perfil basico</li>
              <li>Servicios desde panel empresa</li>
              <li>Revision antes de publicar</li>
            </ul>
            <a class="ghost-button" href="#registro-empresa" data-scroll-register>Empezar</a>
          </article>
          <article class="plan-card featured">
            <span class="tag verified">Recomendado</span>
            <h3>Destacado</h3>
            <div class="plan-price">CRC 29k</div>
            <ul>
              <li>Mayor posicion en listados</li>
              <li>Paquetes y promociones</li>
              <li>Solicitudes priorizadas</li>
            </ul>
            <button class="primary-button" data-toast="Plan destacado seleccionado.">Destacar empresa</button>
          </article>
          <article class="plan-card">
            <h3>Premium</h3>
            <div class="plan-price">CRC 59k</div>
            <ul>
              <li>Portada en categorias</li>
              <li>Campanas por temporada</li>
              <li>Reportes y optimizacion</li>
            </ul>
            <button class="secondary-button" data-toast="Plan premium seleccionado.">Solicitar llamada</button>
          </article>
        </div>
      </div>
    </section>
  `;
}

async function render() {
  const [route = "inicio", providerId, serviceSlug] = window.location.hash.replace("#", "").split("/");
  const pages = {
    inicio: homePage,
    bodas: weddingsPage,
    proveedor: () => providerPage(providerId, serviceSlug),
    empresas: companiesPageNew,
  };
  const page = pages[route] || homePage;
  app.innerHTML = `<div class="page">${await page()}</div>`;
  document.querySelectorAll(".nav a").forEach((link) => {
    link.classList.toggle("is-active", link.getAttribute("href") === `#${route}`);
  });
  window.scrollTo({ top: 0, behavior: "instant" });
  bindPageEvents();
}

function bindPageEvents() {
  document.querySelectorAll("[data-open-quote]").forEach((button) => {
    button.addEventListener("click", openQuote);
  });
  document.querySelectorAll("[data-toast]").forEach((button) => {
    button.addEventListener("click", () => showToast(button.dataset.toast));
  });
  document.querySelectorAll("[data-scroll-register]").forEach((trigger) => {
    trigger.addEventListener("click", (event) => {
      event.preventDefault();
      document.querySelector("#registro-empresa")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
      document.querySelector("#registroEmpresaTitle")?.focus({ preventScroll: true });
    });
  });

  const homeSearch = document.querySelector("#homeSearch");
  if (homeSearch) {
    homeSearch.addEventListener("submit", (event) => {
      event.preventDefault();
      const formData = new FormData(homeSearch);
      currentSearchFilters = {
        eventType: formData.get("eventType"),
        province: formData.get("location"),
      };
      window.location.hash = "bodas";
      showToast("Busqueda aplicada: mostrando servicios recomendados.");
    });
  }

  const filters = document.querySelector("#weddingFilters");
  if (filters) {
    filters.addEventListener("submit", (event) => {
      event.preventDefault();
      const formData = new FormData(filters);
      currentSearchFilters = {
        service: formData.get("service"),
        province: formData.get("province"),
      };
      render();
      const resultCount = filteredServices().length;
      showToast(resultCount ? `${resultCount} servicio(s) encontrado(s).` : "No encontramos servicios con esos filtros.");
    });
  }

  document.querySelector("[data-clear-service-filters]")?.addEventListener("click", () => {
    currentSearchFilters = {};
    render();
    showToast("Filtros limpiados.");
  });

  bindCompanyRegistration();
  bindCarousel();
}

function bindCompanyRegistration() {
  const form = document.querySelector("#companyForm");
  if (!form) return;

  const photoInput = document.querySelector("#companyPhotos");
  const preview = document.querySelector("#companyPhotoPreview");
  const confirmation = document.querySelector("#companyConfirmation");
  let previewUrls = [];

  const clearPreviewUrls = () => {
    previewUrls.forEach((url) => URL.revokeObjectURL(url));
    previewUrls = [];
  };

  const resetPreview = () => {
    clearPreviewUrls();
    if (!preview) return;
    preview.innerHTML = '<div class="preview-empty">Las fotos cargadas apareceran aqui.</div>';
  };

  const selectedValidFiles = () =>
    [...(photoInput?.files || [])]
      .slice(0, CONFIG.maxProviderImages)
      .filter((file) => isAllowedProviderImage(file) && file.size <= CONFIG.maxProviderImageSize);

  const renderCompanyConfirmation = ({
    companyName,
    category = "Registro",
    location = "Demo local",
    photosCount = 0,
    providerId = "",
    mode = "demo",
  }) => {
    const isAzure = mode === "azure";
    const title = isAzure
      ? "Registro recibido"
      : "Registro demo recibido";
    const message = isAzure
      ? "Registro recibido. Punto Evento revisara la empresa y enviara acceso al panel para crear servicios, subir fotos y enviarlos a revision."
      : "Esta demo no guarda datos en Azure. Puedes editar el formulario o limpiar la simulacion.";
    confirmation.innerHTML = `
      <div class="form-panel">
        <p class="eyebrow">${isAzure ? "Registro recibido" : "Registro demo recibido"}</p>
        <h3>${escapeHtml(title)}</h3>
        <p class="form-help">${escapeHtml(message)}</p>
        ${isAzure ? `<p class="form-help">Te contactaremos si necesitamos confirmar algun dato de ${escapeHtml(companyName)}.</p>` : ""}
        ${!isAzure ? `<p class="form-help">${escapeHtml(category)} · ${escapeHtml(location)} · ${photosCount} archivo(s)</p>` : ""}
        <div class="card-actions">
          <button class="${isAzure ? "primary-button" : "secondary-button"}" type="button" data-edit-company>${isAzure ? "Registrar otra empresa" : "Editar datos"}</button>
          ${!isAzure ? `<button class="primary-button" type="button" data-reset-company>Limpiar demo</button>` : ""}
        </div>
      </div>
    `;
    confirmation.classList.remove("is-hidden");
    confirmation.focus();

    confirmation.querySelector("[data-edit-company]").addEventListener("click", () => {
      if (isAzure) {
        form.reset();
        resetPreview();
        confirmation.classList.add("is-hidden");
        confirmation.innerHTML = "";
      }
      document.querySelector("#registroEmpresaTitle")?.focus({ preventScroll: true });
      form.scrollIntoView({ behavior: "smooth", block: "start" });
    });

    confirmation.querySelector("[data-reset-company]")?.addEventListener("click", () => {
        form.reset();
        resetPreview();
        confirmation.classList.add("is-hidden");
        confirmation.innerHTML = "";
        document.querySelector("#registroEmpresaTitle")?.focus({ preventScroll: true });
      });
  };

  const renderCompanyError = (message) => {
    confirmation.innerHTML = `
      <div class="form-panel">
        <p class="eyebrow">Registro no enviado</p>
        <h3>No pudimos completar el registro</h3>
        <p class="form-help">${safeText(message)}</p>
        <div class="card-actions">
          <button class="primary-button" type="button" data-edit-company>Volver al formulario</button>
        </div>
      </div>
    `;
    confirmation.classList.remove("is-hidden");
    confirmation.focus();
    confirmation.querySelector("[data-edit-company]").addEventListener("click", () => {
      document.querySelector("#registroEmpresaTitle")?.focus({ preventScroll: true });
      form.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  const registerCompanyInAzure = async (formData) => {
    const response = await fetch(`${CONFIG.apiBaseUrl}/companies/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        companyName: formData.get("companyName"),
        email: formData.get("email"),
        whatsapp: formData.get("whatsapp"),
        province: formData.get("province"),
        canton: formData.get("canton"),
        description: formData.get("description"),
      }),
    });

    if (!response.ok) {
      throw new Error("No se pudo registrar la empresa.");
    }

    return response.json();
  };

  photoInput?.addEventListener("change", () => {
    clearPreviewUrls();
    const allFiles = [...photoInput.files];
    const invalidFiles = allFiles.filter(
      (file) => !isAllowedProviderImage(file) || file.size > CONFIG.maxProviderImageSize,
    );
    if (allFiles.length > CONFIG.maxProviderImages || invalidFiles.length) {
      showToast("Usa maximo 6 imagenes JPG, PNG o WEBP de hasta 5 MB.");
    }
    const files = selectedValidFiles();
    if (!files.length) {
      resetPreview();
      return;
    }

    preview.innerHTML = files
      .map((file) => {
        const url = URL.createObjectURL(file);
        previewUrls.push(url);
        const safeName = escapeHtml(file.name);
        return `
          <figure class="preview-item">
            <img src="${url}" alt="Vista previa ${safeName}">
            <figcaption>${safeName}</figcaption>
          </figure>
        `;
      })
      .join("");
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!form.reportValidity()) {
      return;
    }

    const formData = new FormData(form);
    const files = selectedValidFiles();
    const submitButton = form.querySelector('button[type="submit"]');
    if ((photoInput?.files?.length || 0) !== files.length) {
      showToast("Algunas imagenes no cumplen formato o peso maximo.");
      return;
    }

    setButtonLoading(submitButton, true, "Enviando registro...");
    const companyName = formData.get("companyName") || "Empresa demo";
    const province = formData.get("province") || "Provincia pendiente";
    const canton = formData.get("canton") || "";

    try {
      const result = await registerCompanyInAzure(formData);
      renderCompanyConfirmation({
        companyName,
        category: "Registro empresa",
        location: [canton, province].filter(Boolean).join(", "),
        providerId: result.companyId,
        mode: "azure",
      });
      showToast("Datos recibidos. Validaremos la informacion.");
    } catch (error) {
      console.warn(error);
      renderCompanyError("El registro no pudo completarse. Revisa los datos e intentalo de nuevo en unos minutos.");
      showToast("No se pudo enviar el registro.");
    } finally {
      setButtonLoading(submitButton, false);
    }
  });
}

function bindCarousel() {
  const stageImage = document.querySelector("[data-carousel-image]");
  if (!stageImage) return;

  const count = document.querySelector("[data-carousel-count]");
  const thumbs = [...document.querySelectorAll("[data-carousel-thumb]")];
  let current = 0;

  const setImage = (index) => {
    current = (index + providerGallery.length) % providerGallery.length;
    stageImage.src = providerGallery[current].src;
    stageImage.alt = providerGallery[current].alt;
    count.textContent = `${current + 1} / ${providerGallery.length}`;
    thumbs.forEach((thumb, thumbIndex) => {
      thumb.classList.toggle("is-active", thumbIndex === current);
    });
  };

  document.querySelector("[data-carousel-prev]")?.addEventListener("click", () => {
    setImage(current - 1);
  });

  document.querySelector("[data-carousel-next]")?.addEventListener("click", () => {
    setImage(current + 1);
  });

  thumbs.forEach((thumb) => {
    thumb.addEventListener("click", () => {
      setImage(Number(thumb.dataset.carouselThumb));
    });
  });
}

function openQuote(event) {
  lastFocusedElement = event?.currentTarget || document.activeElement;
  quoteForm.classList.remove("is-hidden");
  quoteConfirmation.classList.add("is-hidden");
  drawer.classList.add("is-open");
  drawer.setAttribute("aria-hidden", "false");

  const firstField = quoteForm.querySelector("input, select, textarea, button");
  const dialog = drawer.querySelector('[role="dialog"]');
  (firstField || dialog)?.focus();
}

function closeQuote({ submitted = false } = {}) {
  if (submitted) {
    quoteForm.reset();
    quoteForm.classList.add("is-hidden");
    quoteConfirmation.classList.remove("is-hidden");
    quoteConfirmation.focus();
    showToast("Solicitud demo registrada.");
    return;
  }

  drawer.classList.remove("is-open");
  drawer.setAttribute("aria-hidden", "true");
  quoteForm.classList.remove("is-hidden");
  quoteConfirmation.classList.add("is-hidden");

  if (lastFocusedElement && document.contains(lastFocusedElement)) {
    lastFocusedElement.focus();
  }
}

function showToast(message) {
  document.querySelector(".toast")?.remove();
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 2800);
}

document.querySelectorAll("[data-close-quote]").forEach((button) => {
  button.addEventListener("click", () => closeQuote());
});

quoteForm.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!quoteForm.reportValidity()) {
    return;
  }

  closeQuote({ submitted: true });
});

document.addEventListener("keydown", (event) => {
  if (!drawer.classList.contains("is-open")) return;

  if (event.key === "Escape") {
    event.preventDefault();
    closeQuote();
    return;
  }

  if (event.key !== "Tab") return;

  const focusableElements = [...drawer.querySelectorAll(focusableSelector)].filter(
    (element) => element.offsetParent !== null,
  );

  if (focusableElements.length === 0) return;

  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  if (event.shiftKey && document.activeElement === firstElement) {
    event.preventDefault();
    lastElement.focus();
  } else if (!event.shiftKey && document.activeElement === lastElement) {
    event.preventDefault();
    firstElement.focus();
  }
});

window.addEventListener("hashchange", render);

async function init() {
  app.innerHTML = '<div class="page"><section class="section"><p>Cargando proveedores...</p></section></div>';

  try {
    await loadProviderData();
    render();
  } catch (error) {
    app.innerHTML =
      '<div class="page"><section class="section"><p>No se pudieron cargar los proveedores demo. Revisa data/providers.json.</p></section></div>';
    showToast("No se pudieron cargar los proveedores demo.");
    console.error(error);
  }
}

init();
