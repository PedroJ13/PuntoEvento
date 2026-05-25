const image = (id, params = "auto=format&fit=crop&w=1200&q=80") =>
  `https://images.unsplash.com/${id}?${params}`;

const CONFIG = {
  providersUrl: "data/providers.json",
  packagesUrl: "data/packages.json",
  categoriesUrl: "data/categories.json",
  fallbackProviderImage: "assets/images/fallback-provider.svg",
};

let providers = [];
let providerGallery = [];
let packages = [];
let categories = [];

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
  providerGallery = providers[0]?.gallery || [];
}

function imageFallbackAttribute() {
  return `onerror="this.onerror=null;this.src='${CONFIG.fallbackProviderImage}'"`;
}

function providerHref(provider) {
  return `#proveedor/${provider.id}`;
}

function packagesForProvider(providerId) {
  return packages.filter((pack) => pack.providerId === providerId);
}

function providerCard(provider) {
  return `
    <article class="provider-card">
      <img src="${provider.image}" alt="${provider.category} ${provider.name}" loading="lazy" ${imageFallbackAttribute()}>
      <div class="card-body">
        <div class="tag-row">
          ${provider.tags.map((tag, index) => `<span class="tag ${index === 0 ? "verified" : ""}">${tag}</span>`).join("")}
        </div>
        <div>
          <h3>${provider.name}</h3>
          <p class="card-meta">${provider.category} · ${provider.location}</p>
        </div>
        <p>${provider.description}</p>
        <strong>${provider.price}</strong>
        <div class="card-actions">
          <a class="ghost-button" href="${providerHref(provider)}">Ver ficha</a>
          <button class="secondary-button" data-open-quote>Cotizar</button>
        </div>
      </div>
    </article>
  `;
}

function wideProviderCard(provider) {
  return `
    <article class="wide-card" data-category="${provider.category}">
      <img src="${provider.image}" alt="${provider.name}" loading="lazy" ${imageFallbackAttribute()}>
      <div class="card-body">
        <div class="tag-row">
          ${provider.tags.map((tag, index) => `<span class="tag ${index === 0 ? "verified" : ""}">${tag}</span>`).join("")}
        </div>
        <div>
          <h3>${provider.name}</h3>
          <p class="card-meta">${provider.category} · ${provider.location}</p>
          ${ratingStars(provider.rating, provider.reviews)}
        </div>
        <p>${provider.description}</p>
        <strong>${provider.price}</strong>
        <div class="card-actions">
          <a class="ghost-button" href="${providerHref(provider)}">Ver ficha</a>
          <button class="primary-button" data-open-quote>Pedir presupuesto</button>
        </div>
      </div>
    </article>
  `;
}

function ratingStars(rating, reviews) {
  return `
    <div class="rating-row" aria-label="${rating} de 5 estrellas, ${reviews} opiniones">
      <span class="stars" aria-hidden="true">★★★★★</span>
      <span>${rating}</span>
      <span class="dot" aria-hidden="true">·</span>
      <span>${reviews} opiniones</span>
    </div>
  `;
}

function packageCard(pack) {
  return `
    <article class="package-card">
      <p class="package-meta">${pack.vendor}</p>
      <h3>${pack.title}</h3>
      <p>${pack.details}</p>
      <div class="package-price">${pack.price}</div>
      <button class="secondary-button" data-open-quote>Cotizar paquete</button>
    </article>
  `;
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
              <a class="category-tile" href="${category.href}">
                <img src="${category.image}" alt="${category.name}" loading="lazy" ${imageFallbackAttribute()}>
                <span>${category.name}</span>
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
          <h2>Proveedores listos para cotizar</h2>
        </div>
        <button class="ghost-button" data-open-quote>Cotizacion multiple</button>
      </div>
      <div class="cards-grid">
        ${providers.slice(0, 3).map(providerCard).join("")}
      </div>
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
            <option>Todos</option>
            <option>Salon y jardin</option>
            <option>Catering</option>
            <option>Musica y luces</option>
            <option>Decoracion floral</option>
          </select>
        </div>
        <div class="field">
          <label>Provincia</label>
          <select name="province">
            <option>San Jose</option>
            <option>Heredia</option>
            <option>Alajuela</option>
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
              <h2>Opciones recomendadas</h2>
            </div>
            <button class="ghost-button" data-open-quote>Cotizar seleccionados</button>
          </div>
          <div class="result-list" id="providerResults">
            ${providers.map(wideProviderCard).join("")}
          </div>
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

function providerPage(providerId) {
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
  providerGallery = provider.gallery;

  return `
    <section class="provider-hero">
      <div>
        <div class="provider-carousel" aria-label="Galeria de fotos del proveedor">
          <div class="carousel-stage">
            <button class="carousel-nav prev" type="button" data-carousel-prev aria-label="Foto anterior">‹</button>
            <img class="carousel-image" src="${providerGallery[0].src}" alt="${providerGallery[0].alt}" data-carousel-image ${imageFallbackAttribute()}>
            <button class="carousel-nav next" type="button" data-carousel-next aria-label="Foto siguiente">›</button>
            <div class="carousel-count" data-carousel-count>1 / ${providerGallery.length}</div>
          </div>
          <div class="carousel-thumbs" aria-label="Miniaturas">
            ${providerGallery
              .map(
                (item, index) => `
                  <button class="thumb ${index === 0 ? "is-active" : ""}" type="button" data-carousel-thumb="${index}" aria-label="Ver foto ${index + 1}">
                    <img src="${item.src}" alt="${item.alt}" loading="lazy" ${imageFallbackAttribute()}>
                  </button>
                `,
              )
              .join("")}
          </div>
        </div>
      </div>
      <aside class="provider-summary">
        <div class="tag-row">
          ${provider.tags.map((tag, index) => `<span class="tag ${index === 0 ? "verified" : ""}">${tag}</span>`).join("")}
        </div>
        <h1 class="provider-title">${provider.name}</h1>
        <p class="card-meta">${provider.category} · ${provider.location}</p>
        ${ratingStars(provider.rating, provider.reviews)}
        <div class="summary-price">
          <span>Paquetes</span>
          <strong>${provider.price}</strong>
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
            <h2>${provider.category} para eventos</h2>
            <p>${provider.description}</p>
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
            <li><span class="check">✓</span><span>${provider.location}.</span></li>
            <li><span class="check">✓</span><span>${provider.price}.</span></li>
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
          <button class="primary-button" data-toast="Registro demo: aqui empezaria el alta de empresa.">Crear perfil gratis</button>
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
            <button class="ghost-button" data-toast="Plan gratis seleccionado.">Empezar</button>
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

function render() {
  const [route = "inicio", providerId] = window.location.hash.replace("#", "").split("/");
  const pages = {
    inicio: homePage,
    bodas: weddingsPage,
    proveedor: () => providerPage(providerId),
    empresas: companiesPage,
  };
  app.innerHTML = `<div class="page">${(pages[route] || homePage)()}</div>`;
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

  const homeSearch = document.querySelector("#homeSearch");
  if (homeSearch) {
    homeSearch.addEventListener("submit", (event) => {
      event.preventDefault();
      window.location.hash = "bodas";
      showToast("Busqueda demo aplicada: mostrando proveedores recomendados.");
    });
  }

  const filters = document.querySelector("#weddingFilters");
  if (filters) {
    filters.addEventListener("submit", (event) => {
      event.preventDefault();
      showToast("Filtros demo aplicados.");
    });
  }

  bindCarousel();
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
