const image = (id, params = "auto=format&fit=crop&w=1200&q=80") =>
  `https://images.unsplash.com/${id}?${params}`;

const CONFIG = {
  providersUrl: "data/providers.json",
  packagesUrl: "data/packages.json",
  categoriesUrl: "data/categories.json",
  publicServicesUrl: "/api/public/services",
  publicCompanyUrl: (slug) => `/api/public/companies/${encodeURIComponent(slug)}`,
  publicLeadsUrl: "/api/public/leads",
  fallbackProviderImage: "assets/images/fallback-provider.svg",
  apiBaseUrl: "/api",
  maxProviderImages: 6,
  maxProviderImageSize: 5 * 1024 * 1024,
};
const PROVINCE_OPTIONS = [
  "San José",
  "Alajuela",
  "Cartago",
  "Heredia",
  "Guanacaste",
  "Puntarenas",
  "Limón",
];
const PUBLIC_SERVICE_CATEGORIES = [
  {
    label: "Salón y jardín",
    route: "/proveedores/salones-eventos",
    image: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=1200&q=80",
  },
  {
    label: "Catering",
    route: "/proveedores/catering",
    image: "https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=1200&q=80",
  },
  {
    label: "Fotografía",
    route: "/proveedores/fotografia-video",
    image: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80",
  },
  {
    label: "Música y DJ",
    route: "/proveedores/musica-dj",
    image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1200&q=80",
  },
  {
    label: "Decoración",
    route: "/proveedores/decoracion",
    image: "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=1200&q=80",
  },
  {
    label: "Mesa dulce",
    route: "/proveedores/pasteleria-reposteria",
    image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=1200&q=80",
  },
];
const SITE_ORIGIN = "https://puntoeventocr.com";
const CATEGORY_SEO_PAGES = [
  {
    slug: "salones-eventos",
    route: "/proveedores/salones-eventos",
    eyebrow: "Salones y espacios",
    h1: "Salones y espacios para eventos en Costa Rica",
    title: "Salones para eventos en Costa Rica | Punto Evento CR",
    description: "Encuentra salones, jardines y espacios para bodas, fiestas y eventos corporativos en Costa Rica.",
    intro:
      "Compara salones, jardines y espacios para celebrar eventos en Costa Rica. Revisa opciones publicadas y contacta proveedores cuando encuentres una propuesta que se ajuste a tu evento.",
    aliases: ["Salones", "Salon", "Salon y jardin", "Jardin", "Espacios"],
    emptyTitle: "Pronto mostraremos salones y espacios publicados",
    emptyText:
      "Pronto mostraremos salones y espacios publicados para eventos en Costa Rica. Puedes explorar el catalogo general mientras sumamos nuevas opciones.",
    faqs: [
      {
        question: "Como elegir un salon para eventos?",
        answer: "Revisa ubicacion, capacidad, servicios incluidos, fotos y condiciones antes de contactar.",
      },
      {
        question: "Puedo contactar directamente al proveedor?",
        answer: "Si el proveedor tiene contacto publicado, puedes usar WhatsApp o enviar una solicitud desde Punto Evento CR.",
      },
      {
        question: "Aparecen solo salones publicados?",
        answer: "Si. La pagina publica debe mostrar solo servicios aprobados/publicados.",
      },
    ],
  },
  {
    slug: "catering",
    route: "/proveedores/catering",
    eyebrow: "Catering y banquetes",
    h1: "Catering y banquetes para eventos en Costa Rica",
    title: "Catering para eventos en Costa Rica | Punto Evento CR",
    description: "Busca proveedores de catering, banquetes y comida para bodas, fiestas y eventos corporativos en Costa Rica.",
    intro:
      "Encuentra opciones de catering y banquetes para eventos sociales o corporativos. Compara servicios publicados, precios desde cuando esten disponibles y formas de contacto.",
    aliases: ["Catering", "Banquetes", "Comida", "Alimentos"],
    emptyTitle: "Todavia no hay proveedores de catering publicados",
    emptyText:
      "Todavia no hay proveedores de catering publicados en esta categoria. Vuelve pronto o explora otros servicios del catalogo.",
    faqs: [
      {
        question: "Que debo revisar antes de contratar catering?",
        answer: "Revisa tipo de menu, cobertura, cantidad de invitados, precio desde y condiciones del proveedor.",
      },
      {
        question: "Puedo solicitar informacion por servicio?",
        answer: "Si. El contacto debe estar asociado a un servicio publicado especifico.",
      },
      {
        question: "Punto Evento CR cobra por contactar?",
        answer: "El MVP permite contactar proveedores publicados desde la pagina publica.",
      },
    ],
  },
  {
    slug: "decoracion",
    route: "/proveedores/decoracion",
    eyebrow: "Decoracion y ambientacion",
    h1: "Decoracion y ambientacion para eventos en Costa Rica",
    title: "Decoracion para eventos en Costa Rica | Punto Evento CR",
    description: "Encuentra proveedores de decoracion, flores, ambientacion y montaje para eventos en Costa Rica.",
    intro:
      "Explora proveedores de decoracion y ambientacion para bodas, fiestas y eventos corporativos. Revisa servicios publicados y contacta opciones que se ajusten al estilo de tu evento.",
    aliases: ["Decoracion", "Decoración", "Decoracion floral", "Ambientacion", "Flores", "Montaje"],
    emptyTitle: "Estamos sumando proveedores de decoracion",
    emptyText: "Estamos sumando proveedores de decoracion y ambientacion. Mientras tanto, puedes revisar el catalogo general.",
    faqs: [
      {
        question: "Que incluye un servicio de decoracion?",
        answer: "Depende del proveedor; puede incluir flores, centros de mesa, montaje, ambientacion o elementos decorativos.",
      },
      {
        question: "Puedo comparar estilos?",
        answer: "Si hay fotos publicadas, la ficha del proveedor debe ayudar a comparar estilos y propuestas.",
      },
      {
        question: "La decoracion se solicita por evento?",
        answer: "Si. El contacto debe partir de un servicio publicado y del tipo de evento que necesitas.",
      },
    ],
  },
  {
    slug: "musica-dj",
    route: "/proveedores/musica-dj",
    eyebrow: "Musica y DJ",
    h1: "Musica y DJ para eventos en Costa Rica",
    title: "Musica y DJ para eventos en Costa Rica | Punto Evento CR",
    description: "Busca DJs, musica, sonido e iluminacion para bodas, fiestas y eventos corporativos en Costa Rica.",
    intro:
      "Encuentra proveedores de musica, DJ, sonido e iluminacion para crear el ambiente de tu evento. Compara servicios publicados y contacta opciones disponibles.",
    aliases: ["Musica y DJ", "Musica", "Música", "DJ", "Sonido", "Luces", "Musica y luces", "Entretenimiento"],
    emptyTitle: "Pronto mostraremos proveedores de musica y DJ",
    emptyText:
      "Pronto mostraremos proveedores de musica, DJ, sonido y luces. Por ahora puedes explorar el catalogo general.",
    faqs: [
      {
        question: "Como elegir DJ o musica para un evento?",
        answer: "Revisa experiencia, tipo de evento, cobertura, equipo incluido y referencias visuales si estan disponibles.",
      },
      {
        question: "Esta categoria incluye sonido y luces?",
        answer: "Puede incluirlos si el proveedor los publica como parte del servicio.",
      },
      {
        question: "Puedo contactar por WhatsApp?",
        answer: "Si el proveedor tiene WhatsApp disponible, debe mostrarse como canal primario.",
      },
    ],
  },
  {
    slug: "fotografia-video",
    route: "/proveedores/fotografia-video",
    eyebrow: "Fotografia y video",
    h1: "Fotografia y video para eventos en Costa Rica",
    title: "Fotografia y video para eventos en Costa Rica | Punto Evento CR",
    description: "Encuentra fotografos y proveedores de video para bodas, fiestas y eventos en Costa Rica.",
    intro:
      "Busca proveedores de fotografia y video para documentar tu evento. Revisa servicios publicados, ubicacion y formas de contacto antes de solicitar informacion.",
    aliases: ["Fotografia", "Fotografía", "Video", "Foto y video", "Fotografia y video"],
    emptyTitle: "Todavia no hay servicios de fotografia y video publicados",
    emptyText:
      "Todavia no hay servicios de fotografia y video publicados en esta categoria. Puedes revisar otros proveedores del catalogo.",
    faqs: [
      {
        question: "Que debo comparar en fotografia y video?",
        answer: "Revisa estilo, cobertura, entregables, precio desde y fotos o ejemplos publicados.",
      },
      {
        question: "Puedo ver trabajos antes de contactar?",
        answer: "Si el proveedor cargo imagenes, la ficha publica debe mostrarlas.",
      },
      {
        question: "La solicitud se asocia a un servicio?",
        answer: "Si. El contacto debe salir desde un servicio publicado especifico.",
      },
    ],
  },
  {
    slug: "pasteleria-reposteria",
    route: "/proveedores/pasteleria-reposteria",
    eyebrow: "Pasteleria y reposteria",
    h1: "Pasteleria y reposteria para eventos en Costa Rica",
    title: "Pasteleria y reposteria para eventos en Costa Rica | Punto Evento CR",
    description: "Encuentra queques, mesas dulces, postres y reposteria para bodas, fiestas y eventos en Costa Rica.",
    intro:
      "Explora proveedores de pasteleria, queques, mesas dulces y reposteria para eventos. Compara servicios publicados y contacta opciones para tu celebracion.",
    aliases: ["Pasteleria", "Reposteria", "Queques", "Pastel", "Pasteles", "Mesa dulce", "Postres", "Candy bar"],
    emptyTitle: "Estamos preparando proveedores de pasteleria y reposteria",
    emptyText:
      "Estamos preparando proveedores de pasteleria y reposteria para eventos. Puedes explorar el catalogo general mientras se publican nuevas opciones.",
    faqs: [
      {
        question: "Que servicios incluye pasteleria y reposteria?",
        answer: "Puede incluir queques, postres, mesas dulces, cupcakes, candy bar u otras opciones publicadas por cada proveedor.",
      },
      {
        question: "Puedo pedir informacion por un producto especifico?",
        answer: "Si. El contacto debe estar asociado al servicio publicado que estas revisando.",
      },
      {
        question: "Los precios son finales?",
        answer: "Los precios visibles son desde cuando el proveedor los publica. La confirmacion depende del detalle del evento.",
      },
    ],
  },
];
const LOCATION_SEO_PAGES = [
  {
    slug: "san-jose",
    route: "/san-jose",
    eyebrow: "San Jose",
    h1: "Proveedores para eventos en San Jose",
    title: "Proveedores para eventos en San Jose | Punto Evento CR",
    description: "Encuentra proveedores para bodas, fiestas y eventos corporativos en San Jose, Costa Rica.",
    intro:
      "Explora proveedores publicados para eventos en San Jose. Compara servicios disponibles por categoria, revisa detalles y contacta opciones que se ajusten a tu celebracion.",
    aliases: ["San José", "San Jose", "SJ"],
    emptyTitle: "Pronto mostraremos proveedores publicados en San Jose",
    emptyText:
      "Pronto mostraremos proveedores publicados en San Jose. Puedes explorar el catalogo general mientras sumamos nuevas opciones.",
    faqs: [
      {
        question: "Que proveedores puedo encontrar en San Jose?",
        answer:
          "Servicios publicados para eventos, como catering, salones, decoracion, musica, fotografia o reposteria cuando esten disponibles.",
      },
      {
        question: "Puedo contactar proveedores directamente?",
        answer: "Si el proveedor tiene contacto publicado, puedes usar WhatsApp o enviar una solicitud desde Punto Evento CR.",
      },
      {
        question: "La pagina muestra solo servicios aprobados?",
        answer: "Si. La pagina publica debe mostrar solo servicios publicados.",
      },
    ],
  },
  {
    slug: "heredia",
    route: "/heredia",
    eyebrow: "Heredia",
    h1: "Proveedores para eventos en Heredia",
    title: "Proveedores para eventos en Heredia | Punto Evento CR",
    description: "Busca proveedores para bodas, fiestas y eventos en Heredia, Costa Rica.",
    intro:
      "Encuentra proveedores publicados para eventos en Heredia. Revisa servicios, ubicacion y formas de contacto antes de solicitar informacion.",
    aliases: ["Heredia"],
    emptyTitle: "Todavia no hay proveedores publicados en Heredia",
    emptyText:
      "Todavia no hay proveedores publicados en Heredia. Puedes explorar el catalogo general o registrar tu empresa para futuras publicaciones.",
    faqs: [
      {
        question: "Puedo buscar proveedores por Heredia?",
        answer: "Si. Esta pagina agrupa servicios publicados asociados a proveedores de Heredia.",
      },
      {
        question: "Que pasa si no hay proveedores publicados?",
        answer: "Se muestra un estado vacio controlado y puedes volver al catalogo general.",
      },
      {
        question: "Puedo registrar mi empresa en Heredia?",
        answer: "Si. Las empresas pueden solicitar registro desde la pagina publica.",
      },
    ],
  },
  {
    slug: "alajuela",
    route: "/alajuela",
    eyebrow: "Alajuela",
    h1: "Proveedores para eventos en Alajuela",
    title: "Proveedores para eventos en Alajuela | Punto Evento CR",
    description: "Encuentra proveedores de servicios para eventos en Alajuela, Costa Rica.",
    intro:
      "Busca servicios publicados para eventos en Alajuela. Punto Evento CR te ayuda a comparar proveedores y contactar opciones disponibles.",
    aliases: ["Alajuela"],
    emptyTitle: "Estamos preparando proveedores publicados en Alajuela",
    emptyText: "Estamos preparando proveedores publicados en Alajuela. Mientras tanto, puedes revisar el catalogo general.",
    faqs: [
      {
        question: "Que servicios se muestran en Alajuela?",
        answer: "Solo servicios publicados de proveedores asociados a esta provincia.",
      },
      {
        question: "Puedo ver precios?",
        answer: "Cuando el proveedor publica precio desde, se muestra como referencia inicial.",
      },
      {
        question: "Puedo contactar sin salir de Punto Evento CR?",
        answer: "Puedes usar los canales visibles de contacto o solicitud segun cada servicio publicado.",
      },
    ],
  },
  {
    slug: "cartago",
    route: "/cartago",
    eyebrow: "Cartago",
    h1: "Proveedores para eventos en Cartago",
    title: "Proveedores para eventos en Cartago | Punto Evento CR",
    description: "Busca proveedores para eventos sociales y corporativos en Cartago, Costa Rica.",
    intro:
      "Encuentra proveedores publicados para eventos en Cartago. Revisa servicios disponibles y contacta opciones cuando encuentres una propuesta adecuada.",
    aliases: ["Cartago"],
    emptyTitle: "Pronto mostraremos proveedores publicados en Cartago",
    emptyText: "Pronto mostraremos proveedores publicados en Cartago. Puedes explorar otras zonas o categorias del catalogo.",
    faqs: [
      {
        question: "La pagina incluye proveedores de todo Cartago?",
        answer: "Agrupa servicios publicados por proveedores asociados a la provincia de Cartago.",
      },
      {
        question: "Puedo comparar categorias?",
        answer: "Si hay servicios publicados, puedes revisar categoria, descripcion, precio desde y contacto.",
      },
      {
        question: "Los proveedores pasan revision?",
        answer: "La pagina publica muestra servicios publicados despues del flujo de revision interno.",
      },
    ],
  },
  {
    slug: "guanacaste",
    route: "/guanacaste",
    eyebrow: "Guanacaste",
    h1: "Proveedores para eventos en Guanacaste",
    title: "Proveedores para eventos en Guanacaste | Punto Evento CR",
    description: "Encuentra proveedores para bodas, fiestas y eventos en Guanacaste, Costa Rica.",
    intro:
      "Explora proveedores publicados para eventos en Guanacaste. Revisa servicios disponibles para celebraciones, bodas y eventos corporativos.",
    aliases: ["Guanacaste"],
    emptyTitle: "Todavia no hay proveedores publicados en Guanacaste",
    emptyText: "Todavia no hay proveedores publicados en Guanacaste. Puedes explorar el catalogo general mientras se suman nuevas opciones.",
    faqs: [
      {
        question: "Puedo encontrar proveedores para bodas en Guanacaste?",
        answer: "Si existen servicios publicados en la zona, apareceran en esta pagina.",
      },
      {
        question: "La pagina muestra servicios disponibles por categoria?",
        answer: "Esta fase agrupa por ubicacion; las combinaciones ubicacion + categoria quedan para una fase posterior.",
      },
      {
        question: "Que hago si no hay resultados?",
        answer: "Puedes explorar el catalogo general o registrar tu empresa si ofreces servicios en Guanacaste.",
      },
    ],
  },
];
const DEFAULT_SEO_METADATA = {
  title: "Punto Evento CR | Proveedores para eventos en Costa Rica",
  description: "Encuentra y contacta proveedores para eventos en Costa Rica.",
  canonical: `${SITE_ORIGIN}/`,
  image: `${SITE_ORIGIN}/assets/images/logo-punto-evento-cr-panel.png`,
};
const STRUCTURED_DATA_SCRIPT_ID = "punto-evento-json-ld";

let providers = [];
let providerGallery = [];
let packages = [];
let categories = [];
let services = [];
let serviceDataSource = "idle";
let serviceDataNotice = "";
let currentSearchFilters = {};
const companyProfileCache = new Map();
let quoteContext = null;
let isQuoteSubmitting = false;
let shouldFocusResults = false;

const app = document.querySelector("#app");
const drawer = document.querySelector("#quoteDrawer");
const quoteForm = document.querySelector("#quoteForm");
const quoteConfirmation = document.querySelector("#quoteConfirmation");
const quoteTitle = document.querySelector("#quoteTitle");
const quoteStatus = document.querySelector("[data-quote-status]");
const quoteContextNode = document.querySelector("[data-quote-context]");
const focusableSelector =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
let lastFocusedElement = null;

const ANALYTICS_ALLOWED_PARAMS = {
  search: ["search_term", "event_type", "province", "results_count"],
  contact_click: ["channel", "company_id", "company_slug", "service_id", "service_slug", "source_surface"],
  quote_submit: ["company_id", "company_slug", "service_id", "service_slug", "status", "source_surface"],
  company_registration_submit: ["status", "province", "source_surface"],
  publish_company_click: ["source_surface", "target_section"],
};

const analyticsState = {
  initialized: false,
  enabled: false,
  measurementId: "",
};

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
    vendor: providers.find((provider) => provider.id === pack.providerId)?.name || "Proveedor de referencia",
  }));
  categories = categoryData;
  try {
    const publicServices = await fetchPublicServices();
    if (!publicServices.length && shouldUsePublicDemoData()) {
      services = buildDemoServices();
      serviceDataSource = "demo";
      serviceDataNotice = "Mostrando información de referencia porque no hay servicios publicados en esta API local.";
    } else {
      services = publicServices;
      serviceDataSource = "api";
      serviceDataNotice = "";
    }
  } catch (error) {
    if (shouldUsePublicDemoData()) {
      services = buildDemoServices();
      serviceDataSource = "demo";
      serviceDataNotice = "Mostrando información de referencia porque los servicios publicados no están disponibles en este momento.";
      console.info("Usando información de referencia de servicios.", error);
    } else {
      services = [];
      serviceDataSource = "error";
      serviceDataNotice = "No pudimos cargar los servicios publicados. Intenta de nuevo en unos minutos.";
      console.warn("No se pudieron cargar los servicios públicos.", error);
    }
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
      whatsapp: company.whatsapp || service.whatsapp || "",
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
          plan: "referencia",
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

function formatVisiblePrice(value) {
  return String(value ?? "").replace(/\d[\d,]*/g, (match) => {
    const digits = match.replaceAll(",", "");
    if (!/^\d+$/.test(digits) || digits.length <= 3) return match;
    return Number(digits).toLocaleString("en-US");
  });
}

function safePrice(value, fallback = "") {
  return safeText(formatVisiblePrice(value ?? fallback));
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

function shouldUsePublicDemoData() {
  const params = new URLSearchParams(window.location.search);
  return isLocalDemoEnvironment() || params.get("demo") === "local";
}

function shouldShowReferenceCatalog() {
  if (shouldUsePublicDemoData()) return true;
  if (serviceDataSource === "error") return false;
  if (serviceDataSource === "api" && services.length === 0) return false;
  return true;
}

function analyticsDebugEnabled() {
  const params = new URLSearchParams(window.location.search);
  return params.get("analytics") === "debug" || isLocalDemoEnvironment();
}

function analyticsMeasurementId() {
  return document.querySelector('meta[name="ga-measurement-id"]')?.content.trim() || "";
}

function isValidGaMeasurementId(value) {
  return /^G-[A-Z0-9]+$/i.test(String(value || "").trim());
}

function initAnalytics() {
  if (analyticsState.initialized) return analyticsState.enabled;
  analyticsState.initialized = true;
  analyticsState.measurementId = analyticsMeasurementId();
  window.__puntoEventoAnalyticsEvents = window.__puntoEventoAnalyticsEvents || [];

  if (!isValidGaMeasurementId(analyticsState.measurementId)) {
    analyticsState.enabled = false;
    if (analyticsDebugEnabled()) {
      console.info("Punto Evento analytics preparado sin GA_MEASUREMENT_ID real.");
    }
    return false;
  }

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    window.dataLayer.push(arguments);
  };
  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(analyticsState.measurementId)}`;
  document.head.appendChild(script);
  window.gtag("js", new Date());
  window.gtag("config", analyticsState.measurementId, {
    send_page_view: true,
    debug_mode: analyticsDebugEnabled(),
  });
  analyticsState.enabled = true;
  return true;
}

function analyticsParamValue(value) {
  if (value === undefined || value === null) return "";
  if (typeof value === "number") return Number.isFinite(value) ? value : "";
  if (typeof value === "boolean") return value;
  return String(value).slice(0, 120);
}

function analyticsParams(eventName, params = {}) {
  const allowed = ANALYTICS_ALLOWED_PARAMS[eventName] || [];
  return allowed.reduce((payload, key) => {
    const value = analyticsParamValue(params[key]);
    if (value !== "") payload[key] = value;
    return payload;
  }, {});
}

function trackAnalyticsEvent(eventName, params = {}) {
  if (!ANALYTICS_ALLOWED_PARAMS[eventName]) return false;
  const payload = analyticsParams(eventName, params);
  const eventRecord = { event: eventName, params: payload };
  window.__puntoEventoAnalyticsEvents = window.__puntoEventoAnalyticsEvents || [];
  if (analyticsDebugEnabled() || !analyticsState.enabled) {
    window.__puntoEventoAnalyticsEvents.push(eventRecord);
  }
  if (!analyticsState.enabled || typeof window.gtag !== "function") {
    return false;
  }
  window.gtag("event", eventName, payload);
  return true;
}

function analyticsSourceSurface(element = null) {
  const route = window.location.hash.replace("#", "").split("/")[0] || "inicio";
  if (element?.closest?.("#registro-empresa") || route === "empresas") return "company_register";
  if (route === "proveedor") return "company_profile";
  if (route === "bodas") return "services_list";
  if (categorySeoPageForPath()) return "seo_category";
  if (locationSeoPageForPath()) return "seo_location";
  return "home";
}

function contactAnalyticsParams(trigger = null, extra = {}) {
  return {
    company_id: trigger?.dataset.companyId || quoteContext?.companyId || "",
    company_slug: trigger?.dataset.companySlug || quoteContext?.companySlug || "",
    service_id: trigger?.dataset.serviceId || quoteContext?.serviceId || "",
    service_slug: trigger?.dataset.serviceSlug || quoteContext?.serviceSlug || "",
    source_surface: analyticsSourceSurface(trigger),
    ...extra,
  };
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

function whatsappUrl(service) {
  const rawPhone = service.company?.whatsapp || service.whatsapp || "";
  const digits = String(rawPhone).replace(/\D/g, "");
  if (!digits) return "";
  const normalizedPhone = digits.startsWith("506") ? digits : `506${digits}`;
  const message = [
    `Hola, vi ${service.name || "tu servicio"} en Punto Evento CR.`,
    "Me gustaría recibir información.",
  ].join(" ");
  return `https://wa.me/${normalizedPhone}?text=${encodeURIComponent(message)}`;
}

function quoteButtonAttributes(service) {
  const companyId = service.company?.id || "";
  const serviceId = service.id || "";
  if (!companyId || !serviceId || serviceDataSource !== "api") return "";
  return ` data-company-id="${safeText(companyId)}" data-service-id="${safeText(serviceId)}" data-company-slug="${safeText(service.company?.slug || "")}" data-service-slug="${safeText(service.slug || "")}" data-service-name="${safeText(service.name)}" data-company-name="${safeText(service.company?.name || "")}"`;
}

function contactActionsMarkup(service, primaryClass = "primary-button") {
  const whatsappHref = whatsappUrl(service);
  const companyName = service.company?.name || "la empresa";
  if (whatsappHref) {
    return `
      <a class="${primaryClass}" href="${safeUrl(whatsappHref)}" target="_blank" rel="noopener" data-whatsapp-contact${quoteButtonAttributes(service)}>Contactar empresa</a>
      <p class="contact-note full-note">Te abriremos WhatsApp con ${safeText(companyName)} para consultar por ${safeText(service.name)}.</p>
      <button class="secondary-button" data-open-quote${quoteButtonAttributes(service)}>Pedir cotización</button>
      <p class="contact-note full-note">También puedes enviar una solicitud registrada por Punto Evento CR.</p>
    `;
  }
  return `
    <button class="${primaryClass}" data-open-quote${quoteButtonAttributes(service)}>Pedir cotización</button>
    <p class="contact-note full-note">Enviaremos tu solicitud a ${safeText(companyName)} y quedará registrada por Punto Evento CR.</p>
  `;
}

function packagesForProvider(providerId) {
  return packages.filter((pack) => pack.providerId === providerId);
}

function dataSourceNotice() {
  if (!serviceDataNotice) return "";
  return `<p class="data-source-note">${safeText(serviceDataNotice)}</p>`;
}

function packageBandMarkup() {
  return "";
}

function weddingPackagesMarkup() {
  return "";
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
        <strong>${safePrice(provider.price)}</strong>
        <div class="card-actions">
          <a class="ghost-button" href="${safeText(providerHref(provider))}">Ver ficha</a>
          <a class="secondary-button" href="#bodas" data-results-link>Ver servicios</a>
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
          <p class="card-meta">Servicio de ${safeText(service.company?.name)}${meta ? ` · ${safeText(meta)}` : ""}</p>
        </div>
        <p>${safeText(service.description)}</p>
        <strong>${safePrice(service.priceFrom)}</strong>
        <div class="card-actions">
          <a class="ghost-button" href="${safeText(serviceHref(service))}">Ver empresa</a>
          ${contactActionsMarkup(service, "secondary-button")}
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
        <strong>${safePrice(provider.price)}</strong>
        <div class="card-actions">
          <a class="ghost-button" href="${safeText(providerHref(provider))}">Ver ficha</a>
          <a class="primary-button" href="#bodas" data-results-link>Ver servicios</a>
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
          <p class="card-meta">Servicio de ${safeText(service.company?.name)}${meta ? ` · ${safeText(meta)}` : ""}</p>
        </div>
        <p>${safeText(service.description)}</p>
        <strong>${safePrice(service.priceFrom)}</strong>
        <div class="card-actions">
          <a class="ghost-button" href="${safeText(serviceHref(service))}">Ver empresa</a>
          ${contactActionsMarkup(service, "primary-button")}
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
      <div class="package-price">${safePrice(pack.price)}</div>
      <a class="secondary-button" href="#bodas" data-results-link>Ver servicios</a>
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
      service.company?.slug,
      service.company?.id,
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

function serviceMatchesAliases(service, aliases = []) {
  const serviceText = normalizeFilterValue(
    [
      service.name,
      service.category,
      service.description,
      service.company?.name,
      ...(service.eventTypes || []),
    ].join(" "),
  );
  return aliases.some((alias) => {
    const normalizedAlias = normalizeFilterValue(alias);
    return normalizedAlias && serviceText.includes(normalizedAlias);
  });
}

function serviceMatchesLocationAliases(service, aliases = []) {
  const locationText = normalizeFilterValue(
    [
      service.company?.province,
      service.company?.canton,
      service.company?.location,
      service.location,
    ].join(" "),
  );
  return aliases.some((alias) => {
    const normalizedAlias = normalizeFilterValue(alias);
    return normalizedAlias && locationText.includes(normalizedAlias);
  });
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
  if (serviceDataSource === "error" && !hasActiveServiceFilters(currentSearchFilters)) {
    return `
      <article class="empty-results" role="status">
        <p class="eyebrow">Servicios no disponibles</p>
        <h3>No pudimos cargar los servicios publicados</h3>
        <p>Intenta de nuevo en unos minutos.</p>
      </article>
    `;
  }

  if (serviceDataSource === "api" && services.length === 0 && !hasActiveServiceFilters(currentSearchFilters)) {
    return `
      <article class="empty-results" role="status">
        <p class="eyebrow">Catálogo en preparación</p>
        <h3>No hay servicios publicados todavía</h3>
        <p>Estamos preparando el catálogo de proveedores verificados. Si tienes una empresa de eventos, puedes solicitar acceso gratis.</p>
        <a class="primary-button" href="#empresas" data-publish-company-click data-target-section="company_register">Solicitar acceso gratis</a>
      </article>
    `;
  }

  return `
    <article class="empty-results" role="status">
      <p class="eyebrow">Sin coincidencias</p>
      <h3>No encontramos servicios con esos filtros</h3>
      <p>Prueba con otra categoría o provincia para ver más opciones disponibles.</p>
      <button class="secondary-button" type="button" data-clear-service-filters>Limpiar filtros</button>
    </article>
  `;
}

function selectedOption(currentValue, optionValue) {
  return normalizeFilterValue(currentValue) === normalizeFilterValue(optionValue) ? "selected" : "";
}

function provinceOptionsMarkup(currentValue = "", includeAll = false) {
  const allOption = includeAll
    ? `<option value="Todos" ${selectedOption(currentValue || "Todos", "Todos")}>Todos</option>`
    : '<option value="">Seleccionar provincia</option>';
  return `
    ${allOption}
    ${PROVINCE_OPTIONS.map(
      (province) => `<option value="${safeText(province)}" ${selectedOption(currentValue, province)}>${safeText(province)}</option>`,
    ).join("")}
  `;
}

function serviceCategoryOptionsMarkup(currentValue = "") {
  return `
    <option value="Todos" ${selectedOption(currentValue || "Todos", "Todos")}>Todos</option>
    ${PUBLIC_SERVICE_CATEGORIES.map(
      (category) => `<option value="${safeText(category.label)}" ${selectedOption(currentValue, category.label)}>${safeText(category.label)}</option>`,
    ).join("")}
  `;
}

function categorySeoPageForPath(pathname = window.location.pathname) {
  const cleanPath = pathname.replace(/\/+$/, "") || "/";
  return CATEGORY_SEO_PAGES.find((page) => page.route === cleanPath) || null;
}

function locationSeoPageForPath(pathname = window.location.pathname) {
  const cleanPath = pathname.replace(/\/+$/, "") || "/";
  return LOCATION_SEO_PAGES.find((page) => page.route === cleanPath) || null;
}

function setMetaContent(selector, content) {
  const element = document.querySelector(selector);
  if (element) element.setAttribute("content", content);
}

function setCanonicalHref(href) {
  const canonical = document.querySelector('link[rel="canonical"]');
  if (canonical) canonical.setAttribute("href", href);
}

function updateDocumentMetadata(page = null) {
  const metadata = page
    ? {
        title: page.title,
        description: page.description,
        canonical: `${SITE_ORIGIN}${page.route}`,
        image: DEFAULT_SEO_METADATA.image,
      }
    : DEFAULT_SEO_METADATA;

  document.title = metadata.title;
  setMetaContent('meta[name="description"]', metadata.description);
  setCanonicalHref(metadata.canonical);
  setMetaContent('meta[property="og:title"]', metadata.title);
  setMetaContent('meta[property="og:description"]', metadata.description);
  setMetaContent('meta[property="og:url"]', metadata.canonical);
  setMetaContent('meta[property="og:image"]', metadata.image);
  setMetaContent('meta[name="twitter:title"]', metadata.title);
  setMetaContent('meta[name="twitter:description"]', metadata.description);
  setMetaContent('meta[name="twitter:image"]', metadata.image);
}

function baseStructuredData() {
  const logoUrl = `${SITE_ORIGIN}/assets/images/logo-punto-evento-cr-panel.png`;
  return [
    {
      "@type": "Organization",
      "@id": `${SITE_ORIGIN}/#organization`,
      name: "Punto Evento CR",
      url: `${SITE_ORIGIN}/`,
      logo: {
        "@type": "ImageObject",
        url: logoUrl,
      },
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_ORIGIN}/#website`,
      url: `${SITE_ORIGIN}/`,
      name: "Punto Evento CR",
      publisher: {
        "@id": `${SITE_ORIGIN}/#organization`,
      },
      inLanguage: "es-CR",
    },
  ];
}

function faqStructuredData(page) {
  if (!page?.faqs?.length) return null;
  return {
    "@type": "FAQPage",
    "@id": `${SITE_ORIGIN}${page.route}#faq`,
    mainEntityOfPage: `${SITE_ORIGIN}${page.route}`,
    inLanguage: "es-CR",
    mainEntity: page.faqs.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

function structuredDataPayload(page = null) {
  const graph = baseStructuredData();
  const faq = faqStructuredData(page);
  if (faq) graph.push(faq);
  return {
    "@context": "https://schema.org",
    "@graph": graph,
  };
}

function safeJsonLd(schema) {
  return JSON.stringify(schema).replace(/</g, "\\u003c");
}

function updateStructuredData(page = null) {
  document.querySelector(`#${STRUCTURED_DATA_SCRIPT_ID}`)?.remove();
  const script = document.createElement("script");
  script.id = STRUCTURED_DATA_SCRIPT_ID;
  script.type = "application/ld+json";
  script.textContent = safeJsonLd(structuredDataPayload(page));
  document.head.appendChild(script);
}

function categorySeoEmptyState(page) {
  return `
    <article class="empty-results seo-empty" role="status">
      <p class="eyebrow">Catalogo en preparacion</p>
      <h3>${safeText(page.emptyTitle)}</h3>
      <p>${safeText(page.emptyText)}</p>
      <div class="seo-category-actions">
        <a class="secondary-button" href="#bodas" data-results-link>Explorar catalogo general</a>
        <a class="ghost-button" href="#empresas" data-publish-company-click data-source-surface="seo_category" data-target-section="company_register">Registrar empresa</a>
      </div>
    </article>
  `;
}

function categorySeoHeroImage(page) {
  const category = PUBLIC_SERVICE_CATEGORIES.find((item) =>
    page.aliases.some((alias) => {
      const categoryLabel = normalizeFilterValue(item.label);
      const categoryAlias = normalizeFilterValue(alias);
      return categoryLabel.includes(categoryAlias) || categoryAlias.includes(categoryLabel);
    }),
  );
  return category?.image || PUBLIC_SERVICE_CATEGORIES[0].image;
}

function seoCategoryPage(page) {
  const results = services.filter((service) => serviceMatchesAliases(service, page.aliases));
  const resultLabel = results.length === 1 ? "1 servicio publicado" : `${results.length} servicios publicados`;
  return `
    <section class="subhero seo-category-hero">
      <div class="subhero-inner">
        <div>
          <p class="eyebrow">${safeText(page.eyebrow)}</p>
          <h1>${safeText(page.h1)}</h1>
          <p>${safeText(page.intro)}</p>
          <div class="seo-category-actions">
            <a class="primary-button" href="#bodas" data-results-link>Ver catalogo general</a>
            <a class="secondary-button" href="#empresas" data-publish-company-click data-source-surface="seo_category" data-target-section="company_register">Publicar empresa</a>
          </div>
        </div>
        <img src="${safeImageUrl(categorySeoHeroImage(page))}" alt="${safeText(page.eyebrow)}">
      </div>
    </section>
    <section class="section">
      <div class="section-header">
        <div>
          <p class="eyebrow">Resultados por categoria</p>
          <h2>${safeText(resultLabel)}</h2>
        </div>
        <a class="ghost-button" href="/">Volver al inicio</a>
      </div>
      <div class="result-list" id="providerResults" tabindex="-1" aria-live="polite">
        ${results.length ? results.map(wideServiceCard).join("") : categorySeoEmptyState(page)}
      </div>
      ${dataSourceNotice()}
    </section>
    <section class="band">
      <div class="section">
        <div class="section-header">
          <div>
            <p class="eyebrow">Preguntas frecuentes</p>
            <h2>Antes de contactar</h2>
          </div>
        </div>
        <div class="seo-faq-grid">
          ${page.faqs
            .map(
              (item) => `
                <article class="step">
                  <h3>${safeText(item.question)}</h3>
                  <p>${safeText(item.answer)}</p>
                </article>
              `,
            )
            .join("")}
        </div>
      </div>
    </section>
  `;
}

function locationSeoEmptyState(page) {
  return `
    <article class="empty-results seo-empty" role="status">
      <p class="eyebrow">Zona en preparacion</p>
      <h3>${safeText(page.emptyTitle)}</h3>
      <p>${safeText(page.emptyText)}</p>
      <div class="seo-category-actions">
        <a class="secondary-button" href="#bodas" data-results-link>Explorar catalogo general</a>
        <a class="ghost-button" href="#empresas" data-publish-company-click data-source-surface="seo_location" data-target-section="company_register">Registrar empresa</a>
      </div>
    </article>
  `;
}

function seoLocationPage(page) {
  const results = services.filter((service) => serviceMatchesLocationAliases(service, page.aliases));
  const resultLabel = results.length === 1 ? "1 servicio publicado" : `${results.length} servicios publicados`;
  return `
    <section class="subhero seo-category-hero">
      <div class="subhero-inner">
        <div>
          <p class="eyebrow">Proveedores por ubicacion</p>
          <h1>${safeText(page.h1)}</h1>
          <p>${safeText(page.intro)}</p>
          <div class="seo-category-actions">
            <a class="primary-button" href="#bodas" data-results-link>Ver catalogo general</a>
            <a class="secondary-button" href="#empresas" data-publish-company-click data-source-surface="seo_location" data-target-section="company_register">Publicar empresa</a>
          </div>
        </div>
        <img src="${image("photo-1511795409834-ef04bbd61622")}" alt="${safeText(page.eyebrow)}">
      </div>
    </section>
    <section class="section">
      <div class="section-header">
        <div>
          <p class="eyebrow">${safeText(page.eyebrow)}</p>
          <h2>${safeText(resultLabel)}</h2>
        </div>
        <a class="ghost-button" href="/">Volver al inicio</a>
      </div>
      <div class="result-list" id="providerResults" tabindex="-1" aria-live="polite">
        ${results.length ? results.map(wideServiceCard).join("") : locationSeoEmptyState(page)}
      </div>
      ${dataSourceNotice()}
    </section>
    <section class="band">
      <div class="section">
        <div class="section-header">
          <div>
            <p class="eyebrow">Preguntas frecuentes</p>
            <h2>Antes de contactar</h2>
          </div>
        </div>
        <div class="seo-faq-grid">
          ${page.faqs
            .map(
              (item) => `
                <article class="step">
                  <h3>${safeText(item.question)}</h3>
                  <p>${safeText(item.answer)}</p>
                </article>
              `,
            )
            .join("")}
        </div>
      </div>
    </section>
  `;
}

function homePage() {
  return `
    <section class="hero" style="--hero-image: url('${image("photo-1511795409834-ef04bbd61622")}')">
      <div class="hero-inner">
        <div class="hero-copy">
          <p class="eyebrow">Eventos en Costa Rica</p>
          <h1>Encuentra proveedores confiables para tu evento</h1>
          <p>Compara salones, catering, música, decoración y otros servicios. Elige un servicio publicado para contactar a la empresa correcta.</p>
        </div>
        <form class="search-panel" id="homeSearch">
          <div class="field">
            <label for="homeQuery">Servicio o empresa</label>
            <input id="homeQuery" name="q" type="search" placeholder="Ej. Jardines del Sol">
          </div>
          <div class="field">
            <label for="eventType">Tipo de evento</label>
            <select id="eventType" name="eventType">
              <option value="Todos">Todos</option>
              <option>Boda</option>
              <option>Evento corporativo</option>
              <option>Fiesta infantil</option>
              <option>Graduacion</option>
            </select>
          </div>
          <div class="field">
            <label for="location">Ubicacion</label>
            <select id="location" name="location">
              ${provinceOptionsMarkup("Todos", true)}
            </select>
          </div>
          <button class="primary-button" type="submit">Ver resultados</button>
        </form>
      </div>
    </section>

    <section class="trust-strip" aria-label="Beneficios">
      <div class="metric"><strong>Servicios</strong><span>busqueda por necesidad real</span></div>
      <div class="metric"><strong>Empresas</strong><span>perfil completo antes del contacto</span></div>
      <div class="metric"><strong>Contacto</strong><span>solicitud dirigida por servicio</span></div>
      <div class="metric"><strong>Registro</strong><span>gratis para proveedores</span></div>
    </section>

    <section class="section">
      <div class="section-header">
        <div>
          <p class="eyebrow">Categorias</p>
          <h2>Atajos para empezar</h2>
        </div>
        <a class="ghost-button" href="#bodas" data-results-link>Ver servicios</a>
      </div>
      <div class="category-grid">
        ${PUBLIC_SERVICE_CATEGORIES
          .map(
            (category) => `
              <a class="category-tile" href="${safeText(category.route)}">
                <img src="${safeImageUrl(category.image)}" alt="${safeText(category.label)}" loading="lazy" ${imageFallbackAttribute()}>
                <span>${safeText(category.label)}</span>
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
            <p class="eyebrow">Flujo de contacto</p>
            <h2>Busca, revisa y solicita información</h2>
          </div>
        </div>
        <div class="steps">
          <article class="step"><span class="step-number">01</span><h3>Elige un servicio</h3><p>Empieza por lo que necesitas: salón, catering, fotos, música o decoración.</p></article>
          <article class="step"><span class="step-number">02</span><h3>Revisa opciones</h3><p>Fotos, zona, precio desde y descripción ayudan a decidir más rápido.</p></article>
          <article class="step"><span class="step-number">03</span><h3>Contacta directo</h3><p>Usa WhatsApp cuando esté disponible o envía una solicitud asociada al servicio elegido.</p></article>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="section-header">
        <div>
          <p class="eyebrow">Destacados</p>
          <h2>Servicios listos para contactar</h2>
        </div>
        <a class="ghost-button" href="#bodas" data-results-link>Ver servicios</a>
      </div>
      <div class="cards-grid">
        ${services.slice(0, 3).map(serviceCard).join("")}
      </div>
      ${dataSourceNotice()}
    </section>

    ${packageBandMarkup()}

    <section class="cta-band">
      <div class="section">
        <div>
          <p class="eyebrow">Para proveedores</p>
          <h2>Convierte visibilidad en solicitudes</h2>
          <p>Una página para vender el registro antes de mostrar formularios largos.</p>
        </div>
        <a class="primary-button" href="#empresas" data-publish-company-click data-target-section="company_register">Crear perfil gratis</a>
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
          <p class="eyebrow">Servicios en Costa Rica</p>
          <h1>Encuentra proveedores por categoria de servicio</h1>
          <p>Revisa salones, catering, decoración, música y fotografía con información clara y contacto directo.</p>
          <a class="primary-button" href="#bodas" data-results-link>Ver servicios</a>
        </div>
        <img src="${image("photo-1523438885200-e635ba2c371e")}" alt="Decoracion de boda">
      </div>
    </section>
    <section class="section">
      <form class="filter-bar" id="weddingFilters">
        <div class="field">
          <label>Buscar</label>
          <input name="q" type="search" value="${safeText(currentSearchFilters.q || "")}" placeholder="Servicio, categoria o empresa">
        </div>
        <div class="field">
          <label>Servicio</label>
          <select name="service">
            ${serviceCategoryOptionsMarkup(currentSearchFilters.service || "Todos")}
          </select>
        </div>
        <div class="field">
          <label>Provincia</label>
          <select name="province">
            ${provinceOptionsMarkup(currentSearchFilters.province || "Todos", true)}
          </select>
        </div>
        <button class="primary-button" type="submit">Aplicar filtros</button>
      </form>

      <div class="results-layout no-sidebar">
        <div>
          <div class="section-header">
            <div>
            <p class="eyebrow">Resultados</p>
              <h2>Servicios recomendados</h2>
            </div>
            <a class="ghost-button" href="#bodas" data-results-link>Ver servicios</a>
          </div>
          <div class="result-list" id="providerResults" tabindex="-1" aria-live="polite">
            ${results.length ? results.map(wideServiceCard).join("") : emptyServicesState()}
          </div>
          ${dataSourceNotice()}
        </div>
      </div>
    </section>

    ${weddingPackagesMarkup()}
  `;
}

async function providerPage(companySlug, serviceSlug = "") {
  if (serviceDataSource === "api" && services.length === 0 && !shouldUsePublicDemoData()) {
    return `
      <section class="section">
        <p class="eyebrow">Catálogo en preparación</p>
        <h1>No hay servicios publicados todavía</h1>
        <p>Estamos preparando el catálogo de proveedores verificados. Si tienes una empresa de eventos, puedes solicitar acceso gratis.</p>
        <a class="primary-button" href="#empresas" data-publish-company-click data-target-section="company_register">Solicitar acceso gratis</a>
      </section>
    `;
  }

  if (serviceDataSource === "error" && !shouldUsePublicDemoData()) {
    return `
      <section class="section">
        <p class="eyebrow">Servicios no disponibles</p>
        <h1>No pudimos cargar los servicios publicados</h1>
        <p>Intenta de nuevo en unos minutos.</p>
        <a class="primary-button" href="#bodas">Volver al listado</a>
      </section>
    `;
  }

  if (serviceDataSource === "api" && companySlug) {
    try {
      const company = await fetchPublicCompany(companySlug, serviceSlug);
      return companyProfilePage(company, serviceSlug || company.selectedServiceSlug || "");
    } catch (error) {
      console.info("No se pudo cargar el perfil publicado.", error);
      if (!shouldUsePublicDemoData()) {
        return `
          <section class="section">
            <p class="eyebrow">Empresa no disponible</p>
            <h1>No pudimos cargar los servicios publicados</h1>
            <p>Intenta de nuevo en unos minutos o vuelve al listado.</p>
            <a class="primary-button" href="#bodas">Ver servicios</a>
          </section>
        `;
      }
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
          whatsapp: company.whatsapp,
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
          <span class="tag verified">Servicio publicado</span>
          <span class="tag">${safeText(selectedService.category || "Servicio")}</span>
        </div>
        <h1 class="provider-title">${safeText(selectedService.name)}</h1>
        <p class="card-meta">De ${safeText(company.name)}${location ? ` · ${safeText(location)}` : ""}</p>
        <div class="summary-price">
          <span>Precio desde</span>
          <strong>${safePrice(selectedService.priceFrom || "Consultar")}</strong>
        </div>
        <p class="contact-note full-note">Estás cotizando este servicio de ${safeText(company.name)}.</p>
        <div class="card-actions">
          ${contactActionsMarkup(selectedService, "primary-button")}
          <a class="secondary-button" href="#bodas">Ver más servicios</a>
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
              <li><span class="check">&#10003;</span><span>${safePrice(selectedService.priceFrom || "Precio a consultar")}.</span></li>
              <li><span class="check">&#10003;</span><span>Solicitud asociada a este servicio.</span></li>
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
                        <strong>${safePrice(service.priceFrom)}</strong>
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
          ${contactActionsMarkup(selectedService, "primary-button")}
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
        <p>Vuelve al inicio para revisar los servicios disponibles.</p>
        <a class="primary-button" href="/">Volver al inicio</a>
      </section>
    `;
  }

  if (providerId && !selectedProvider) {
    return `
      <section class="section">
        <p class="eyebrow">Proveedor no encontrado</p>
        <h1>Ese proveedor no está publicado</h1>
        <p>Vuelve al listado para elegir una ficha disponible.</p>
        <a class="primary-button" href="#bodas">Ver proveedores</a>
      </section>
    `;
  }

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
          <span>Precio desde</span>
          <strong>${safePrice(provider.price)}</strong>
        </div>
        <div class="card-actions">
          <a class="primary-button" href="#bodas" data-results-link>Ver servicios</a>
          <button class="secondary-button" data-toast="Elige un servicio publicado para contactar por WhatsApp cuando este disponible.">WhatsApp</button>
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
              <li><span class="check">✓</span><span>Perfil con información comercial lista para revisar.</span></li>
              <li><span class="check">✓</span><span>Precio, ubicación, fotos y descripción visibles antes del contacto.</span></li>
              <li><span class="check">✓</span><span>Solicitud por formulario cuando exista un servicio publicado.</span></li>
            </ul>
          </article>

          <article class="content-block">
            <p class="eyebrow">Servicios</p>
            <h2>Opciones publicadas</h2>
            <p>El catálogo público prioriza servicios aprobados con fotos visibles y contacto directo con la empresa.</p>
            <a class="secondary-button" href="#bodas" data-results-link>Ver servicios</a>
          </article>

          <article class="content-block">
            <p class="eyebrow">Opiniones</p>
            <h2>Clientes recientes</h2>
            <div class="review-grid">
              <article class="review-card"><h3>Excelente atención</h3><p>Respondieron rápido, el montaje quedó igual a las fotos y el presupuesto fue claro.</p><strong>Mariana R.</strong></article>
              <article class="review-card"><h3>Muy buena experiencia</h3><p>Nos ayudaron con salon, cena y coordinacion. La ficha tenia todo lo necesario para decidir.</p><strong>Carlos M.</strong></article>
            </div>
          </article>
        </div>

        <aside class="side-panel">
          <h3>Datos clave</h3>
          <ul class="feature-list">
            <li><span class="check">✓</span><span>${safeText(provider.location)}.</span></li>
            <li><span class="check">✓</span><span>${safePrice(provider.price)}.</span></li>
            <li><span class="check">✓</span><span>Contacto directo cuando haya WhatsApp publicado.</span></li>
            <li><span class="check">✓</span><span>Solicitud por formulario asociada a servicio publicado.</span></li>
          </ul>
          <a class="primary-button" href="#bodas" data-results-link>Ver servicios</a>
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
          <h1>Recibe clientes interesados en tus servicios de eventos</h1>
          <p>Crea un perfil profesional, publica servicios, muestra fotos y recibe solicitudes de presupuesto desde un solo lugar.</p>
          <a class="primary-button" href="#registro-empresa" data-scroll-register>Crear perfil gratis</a>
        </div>
        <img src="${image("photo-1556761175-b413da4baf72")}" alt="Equipo revisando solicitudes">
      </div>
    </section>

    <section class="section split">
      <div>
        <p class="eyebrow">Valor para empresas</p>
        <h2>Una página que vende antes del formulario</h2>
        <ul class="feature-list">
          <li><span class="check">✓</span><span>Perfil con galería, servicios publicados y datos de contacto.</span></li>
          <li><span class="check">✓</span><span>Solicitudes de presupuesto de personas con intencion real.</span></li>
          <li><span class="check">✓</span><span>Insignias y estadisticas para mejorar confianza y conversion.</span></li>
          <li><span class="check">✓</span><span>Opciones destacadas para aparecer en categorías clave.</span></li>
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
        <p>Por ahora el registro es gratis. El pago entraría después solo para empresas que quieran mejor posición, aparecer arriba o estar destacadas en categorías clave.</p>
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
          <p class="form-help">Sube logo, portada y fotos de galería. En Azure se cargan para revisión; en local solo se previsualizan si la API no está disponible.</p>
          <label class="upload-box">
            <input id="companyPhotos" name="photos" type="file" accept="image/jpeg,image/png,image/webp" multiple>
            <span>Agregar fotos</span>
            <small>Máximo 6 imágenes JPG, PNG o WEBP. Hasta 5 MB cada una.</small>
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
              <span>Perfil publicado en categoría principal, con fotos, descripción y contacto.</span>
            </div>
            <div>
              <strong>Destacado después</strong>
              <span>Pago único o plan para aparecer arriba, en portada o en el top de resultados.</span>
            </div>
          </div>
          <label class="consent-row">
            <input name="terms" type="checkbox" required>
            Confirmo que tengo permiso para publicar esta información y estas imágenes.
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
            <p class="eyebrow">Planes para empresas</p>
            <h2>De registro gratis a visibilidad premium</h2>
          </div>
        </div>
        <div class="plan-grid">
          <article class="plan-card">
            <h3>Gratis</h3>
            <div class="plan-price">₡0</div>
            <ul>
              <li>Perfil básico</li>
              <li>Categoria principal</li>
              <li>Contacto directo</li>
            </ul>
            <a class="ghost-button" href="#registro-empresa" data-scroll-register data-publish-company-click data-target-section="company_register">Empezar</a>
          </article>
          <article class="plan-card featured">
            <span class="tag verified">Recomendado</span>
            <h3>Destacado</h3>
            <div class="plan-price">₡29k</div>
            <ul>
              <li>Mayor posicion en listados</li>
              <li>Servicios destacados</li>
              <li>Solicitudes priorizadas</li>
            </ul>
            <button class="primary-button" data-toast="Plan destacado seleccionado.">Destacar empresa</button>
          </article>
          <article class="plan-card">
            <h3>Premium</h3>
            <div class="plan-price">₡59k</div>
            <ul>
              <li>Portada en categorías</li>
              <li>Campañas por temporada</li>
              <li>Reportes y optimización</li>
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
          <h1>Recibe clientes interesados en tus servicios de eventos</h1>
          <p>Registra tu empresa gratis. Luego recibes acceso al panel para crear servicios, subir fotos y prepararlos para publicación.</p>
          <div class="card-actions">
            <a class="primary-button" href="#registro-empresa" data-scroll-register data-publish-company-click data-target-section="company_register">Crear perfil gratis</a>
            <a class="secondary-button" href="panel.html">Ya tengo acceso</a>
          </div>
        </div>
        <img src="${image("photo-1556761175-b413da4baf72")}" alt="Equipo revisando solicitudes">
      </div>
    </section>

    <section class="section split">
      <div>
        <p class="eyebrow">Valor para empresas</p>
        <h2>Una página que vende antes del formulario</h2>
        <ul class="feature-list">
          <li><span class="check">&#10003;</span><span>Registro gratis para preparar la publicación de la empresa.</span></li>
          <li><span class="check">&#10003;</span><span>Acceso posterior al panel para crear servicios y subir fotos.</span></li>
            <li><span class="check">&#10003;</span><span>Publicación pronta con la información lista para mostrar.</span></li>
          <li><span class="check">&#10003;</span><span>Opciones destacadas para aparecer en categorías clave.</span></li>
        </ul>
      </div>
      <div class="image-stack">
        <img src="${image("photo-1551836022-d5d88e9218df")}" alt="Proveedor administrando perfil" loading="lazy">
        <img src="${image("photo-1556761175-4b46a572b786")}" alt="Dashboard de trabajo" loading="lazy">
      </div>
    </section>

    <section class="section" id="registro-empresa">
      <div class="registration-guide" aria-labelledby="registrationGuideTitle">
        <div class="registration-guide-intro">
          <p class="eyebrow">Como funciona</p>
          <h2 id="registrationGuideTitle">De solicitud a perfil listo en 5 pasos</h2>
          <p>Te acompañamos desde el registro inicial hasta que tus servicios y fotos queden listos para mostrarse a personas que organizan eventos.</p>
          <a class="primary-button" href="#companyForm">Completar registro</a>
        </div>
        <ol class="registration-steps" aria-label="Pasos para registrar una empresa">
          <li>
            <span>1</span>
            <strong>Registra tu empresa</strong>
            <p>Envía los datos básicos para que sepamos quién ofrece el servicio.</p>
          </li>
          <li>
            <span>2</span>
            <strong>Revisamos tu información</strong>
            <p>Validamos que la solicitud esté clara antes de activar tu acceso.</p>
          </li>
          <li>
            <span>3</span>
            <strong>Recibes un correo de bienvenida</strong>
            <p>Te avisamos cuando puedas entrar al panel de empresa.</p>
          </li>
          <li>
            <span>4</span>
            <strong>Completa tu perfil</strong>
            <p>Agrega descripción, ubicación, canales de contacto y detalles útiles.</p>
          </li>
          <li>
            <span>5</span>
            <strong>Carga servicios y fotos</strong>
            <p>Prepara lo que quieres publicar para que los clientes puedan comparar.</p>
          </li>
        </ol>
      </div>

      <div class="section-header">
        <div>
          <p class="eyebrow">Alta gratuita</p>
          <h2 id="registroEmpresaTitle" tabindex="-1">Registra tu empresa</h2>
        </div>
        <p>Luego de recibir tus datos, Punto Evento CR enviará acceso al panel para crear servicios, subir fotos y prepararlos para publicación.</p>
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
              <select name="province" autocomplete="address-level1" required>
                ${provinceOptionsMarkup()}
              </select>
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
            <label>
              Telefono local
              <input name="phone" type="tel" placeholder="50622222222" inputmode="tel" autocomplete="tel">
            </label>
            <label>
              Instagram
              <input name="instagram" type="text" placeholder="@tuempresa o https://instagram.com/tuempresa">
            </label>
            <label>
              Facebook
              <input name="facebook" type="text" placeholder="https://facebook.com/tuempresa">
            </label>
            <label>
              Pagina web
              <input name="website" type="url" placeholder="https://tuempresa.com" autocomplete="url">
            </label>
            <label>
              TikTok
              <input name="tiktok" type="text" placeholder="@tuempresa o https://tiktok.com/@tuempresa">
            </label>
            <label class="full">
              Descripcion de la empresa
              <textarea name="description" rows="4" placeholder="Describe que ofrece la empresa, en que zonas trabaja y que la hace diferente." required></textarea>
            </label>
          </div>
        </div>

        <div class="form-panel">
          <h3>Siguiente paso</h3>
          <p class="form-help">Cuando la empresa quede registrada, recibirás acceso al panel para preparar tus servicios.</p>
          <div class="publish-summary">
            <div>
              <strong>1. Registro</strong>
              <span>Envías los datos básicos de la empresa.</span>
            </div>
            <div>
              <strong>2. Panel empresa</strong>
              <span>Creas servicios, subes fotos y los preparas para publicación.</span>
            </div>
            <div>
              <strong>3. Publicacion</strong>
              <span>Punto Evento CR modera y publica lo aprobado.</span>
            </div>
          </div>
          <a class="secondary-button" href="panel.html">Ya tengo acceso</a>
        </div>

        <div class="form-panel">
          <h3>Publicacion</h3>
          <div class="publish-summary">
            <div>
              <strong>Plan gratis</strong>
              <span>Registro revisado por Punto Evento CR antes de activar el panel.</span>
            </div>
            <div>
              <strong>Destacado después</strong>
              <span>Pago único o plan para aparecer arriba, en portada o en el top de resultados.</span>
            </div>
          </div>
          <label class="consent-row">
            <input name="terms" type="checkbox" required>
            Confirmo que tengo permiso para registrar esta empresa y compartir esta información.
          </label>
          <button class="primary-button" type="submit">Enviar registro gratis</button>
          <p class="form-help company-submit-status" data-company-submit-status aria-live="polite"></p>
        </div>
      </form>
      <div class="company-confirmation is-hidden" id="companyConfirmation" tabindex="-1" aria-live="polite"></div>
    </section>

    <section class="band">
      <div class="section">
        <div class="section-header">
          <div>
            <p class="eyebrow">Opciones de visibilidad</p>
            <h2>De registro gratis a visibilidad premium</h2>
          </div>
        </div>
        <div class="plan-grid">
          <article class="plan-card">
            <h3>Gratis</h3>
            <div class="plan-price">CRC 0</div>
            <ul>
              <li>Perfil básico</li>
              <li>Servicios desde panel empresa</li>
              <li>Revision antes de publicar</li>
            </ul>
            <a class="ghost-button" href="#registro-empresa" data-scroll-register data-publish-company-click data-target-section="company_register">Empezar</a>
          </article>
          <article class="plan-card featured">
            <span class="tag verified">Recomendado</span>
            <h3>Destacado</h3>
            <div class="plan-price">CRC 29k</div>
            <ul>
              <li>Mayor posicion en listados</li>
              <li>Servicios destacados</li>
              <li>Solicitudes priorizadas</li>
            </ul>
            <button class="primary-button" data-toast="Plan destacado seleccionado.">Destacar empresa</button>
          </article>
          <article class="plan-card">
            <h3>Premium</h3>
            <div class="plan-price">CRC 59k</div>
            <ul>
              <li>Portada en categorías</li>
              <li>Campañas por temporada</li>
              <li>Reportes y optimización</li>
            </ul>
            <button class="secondary-button" data-toast="Plan premium seleccionado.">Solicitar llamada</button>
          </article>
        </div>
      </div>
    </section>
  `;
}

function focusResultsArea(behavior = "smooth") {
  const target = document.querySelector("#providerResults") || document.querySelector("#weddingFilters");
  if (!target) return;
  target.scrollIntoView({ behavior, block: "start" });
  target.focus?.({ preventScroll: true });
}

async function render() {
  const [route = "inicio", providerId, serviceSlug] = window.location.hash.replace("#", "").split("/");
  const cleanCategoryPage = categorySeoPageForPath();
  if (cleanCategoryPage && !window.location.hash) {
    updateDocumentMetadata(cleanCategoryPage);
    updateStructuredData(cleanCategoryPage);
    app.innerHTML = `<div class="page">${seoCategoryPage(cleanCategoryPage)}</div>`;
    document.querySelectorAll(".nav a").forEach((link) => {
      link.classList.remove("is-active");
    });
    bindPageEvents();
    window.scrollTo({ top: 0, behavior: "instant" });
    return;
  }

  const cleanLocationPage = locationSeoPageForPath();
  if (cleanLocationPage && !window.location.hash) {
    updateDocumentMetadata(cleanLocationPage);
    updateStructuredData(cleanLocationPage);
    app.innerHTML = `<div class="page">${seoLocationPage(cleanLocationPage)}</div>`;
    document.querySelectorAll(".nav a").forEach((link) => {
      link.classList.remove("is-active");
    });
    bindPageEvents();
    window.scrollTo({ top: 0, behavior: "instant" });
    return;
  }

  updateDocumentMetadata();
  updateStructuredData();
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
  bindPageEvents();
  if (shouldFocusResults && route === "bodas") {
    shouldFocusResults = false;
    requestAnimationFrame(() => focusResultsArea("smooth"));
  } else {
    window.scrollTo({ top: 0, behavior: "instant" });
  }
}

function bindPageEvents() {
  document.querySelectorAll("[data-open-quote]").forEach((button) => {
    button.addEventListener("click", openQuote);
  });
  document.querySelectorAll("[data-toast]").forEach((button) => {
    button.addEventListener("click", () => showToast(button.dataset.toast));
  });
  document.querySelectorAll("[data-whatsapp-contact]").forEach((link) => {
    link.addEventListener("click", () => {
      trackAnalyticsEvent("contact_click", contactAnalyticsParams(link, { channel: "whatsapp" }));
      showToast("WhatsApp listo para enviar.");
    });
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
        q: formData.get("q"),
        eventType: formData.get("eventType"),
        province: formData.get("location"),
      };
      trackAnalyticsEvent("search", {
        search_term: currentSearchFilters.q,
        event_type: currentSearchFilters.eventType,
        province: currentSearchFilters.province,
        results_count: filteredServices().length,
      });
      shouldFocusResults = true;
      if (window.location.hash === "#bodas") {
        render();
      } else {
        window.location.hash = "bodas";
      }
      showToast("Busqueda aplicada: mostrando servicios recomendados.");
    });
  }

  document.querySelectorAll("[data-service-category]").forEach((trigger) => {
    trigger.addEventListener("click", (event) => {
      event.preventDefault();
      currentSearchFilters = {
        service: trigger.dataset.serviceCategory,
      };
      shouldFocusResults = true;
      if (window.location.hash === "#bodas") {
        render();
      } else {
        window.location.hash = "bodas";
      }
    });
  });

  document.querySelectorAll("[data-results-link]").forEach((trigger) => {
    trigger.addEventListener("click", (event) => {
      event.preventDefault();
      shouldFocusResults = true;
      if (window.location.hash === "#bodas") {
        render();
      } else {
        window.location.hash = "bodas";
      }
    });
  });

  const filters = document.querySelector("#weddingFilters");
  if (filters) {
    filters.addEventListener("submit", (event) => {
      event.preventDefault();
      const formData = new FormData(filters);
      currentSearchFilters = {
        q: formData.get("q"),
        service: formData.get("service"),
        province: formData.get("province"),
      };
      trackAnalyticsEvent("search", {
        search_term: currentSearchFilters.q,
        event_type: currentSearchFilters.service,
        province: currentSearchFilters.province,
        results_count: filteredServices().length,
      });
      shouldFocusResults = true;
      render();
      const resultCount = filteredServices().length;
      showToast(resultCount ? `${resultCount} servicio(s) encontrado(s).` : "No encontramos servicios con esos filtros.");
    });
  }

  document.querySelector("[data-clear-service-filters]")?.addEventListener("click", () => {
    currentSearchFilters = {};
    shouldFocusResults = true;
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
  const submitStatus = document.querySelector("[data-company-submit-status]");
  let isSubmitting = false;
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
    location = "Prueba local",
    photosCount = 0,
    providerId = "",
    mode = "demo",
  }) => {
    const isAzure = mode === "azure";
    const title = isAzure
      ? "Recibimos tu solicitud"
      : "Registro local recibido";
    const message = isAzure
      ? "Te enviaremos las instrucciones de acceso por correo cuando tu cuenta esté lista."
      : "Esta prueba local no guarda datos en Azure. Puedes editar el formulario o limpiar la simulacion.";
    confirmation.innerHTML = `
      <div class="form-panel">
        <p class="eyebrow">${isAzure ? "Solicitud recibida" : "Registro local recibido"}</p>
        <h3>${escapeHtml(title)}</h3>
        <p class="form-help">${escapeHtml(message)}</p>
        ${isAzure ? `<p class="form-help">No necesitas crear contraseña ahora. El acceso al panel llega en un paso posterior.</p>` : ""}
        ${!isAzure ? `<p class="form-help">${escapeHtml(category)} · ${escapeHtml(location)} · ${photosCount} archivo(s)</p>` : ""}
        <div class="card-actions">
          <button class="${isAzure ? "primary-button" : "secondary-button"}" type="button" data-edit-company>${isAzure ? "Registrar otra empresa" : "Editar datos"}</button>
          ${!isAzure ? `<button class="primary-button" type="button" data-reset-company>Limpiar prueba</button>` : ""}
        </div>
      </div>
    `;
    confirmation.classList.remove("is-hidden");
    confirmation.focus();

    confirmation.querySelector("[data-edit-company]").addEventListener("click", () => {
      if (isAzure) {
        form.reset();
        resetPreview();
        form.classList.remove("is-hidden");
        if (submitStatus) submitStatus.textContent = "";
        confirmation.classList.add("is-hidden");
        confirmation.innerHTML = "";
      }
      const firstField = form.querySelector("input, select, textarea, button");
      firstField?.focus({ preventScroll: true });
      form.scrollIntoView({ behavior: "smooth", block: "start" });
    });

    confirmation.querySelector("[data-reset-company]")?.addEventListener("click", () => {
        form.reset();
        resetPreview();
        form.classList.remove("is-hidden");
        if (submitStatus) submitStatus.textContent = "";
        confirmation.classList.add("is-hidden");
        confirmation.innerHTML = "";
        const firstField = form.querySelector("input, select, textarea, button");
        firstField?.focus({ preventScroll: true });
      });
  };

  const renderCompanyError = (message) => {
    form.classList.remove("is-hidden");
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
        phone: formData.get("phone"),
        website: formData.get("website"),
        instagram: formData.get("instagram"),
        facebook: formData.get("facebook"),
        tiktok: formData.get("tiktok"),
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
      showToast("Usa máximo 6 imágenes JPG, PNG o WEBP de hasta 5 MB.");
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

    if (isSubmitting) {
      return;
    }

    if (!form.reportValidity()) {
      return;
    }

    const formData = new FormData(form);
    const files = selectedValidFiles();
    const submitButton = form.querySelector('button[type="submit"]');
    if ((photoInput?.files?.length || 0) !== files.length) {
      showToast("Algunas imágenes no cumplen formato o peso máximo.");
      return;
    }

    isSubmitting = true;
    if (submitStatus) {
      submitStatus.textContent = "Enviando registro. Espera un momento...";
    }
    confirmation.classList.add("is-hidden");
    confirmation.innerHTML = "";
    setButtonLoading(submitButton, true, "Enviando registro...");
    const companyName = formData.get("companyName") || "Empresa de referencia";
    const province = formData.get("province") || "Provincia pendiente";
    const canton = formData.get("canton") || "";

    try {
      const result = await registerCompanyInAzure(formData);
      form.reset();
      resetPreview();
      form.classList.add("is-hidden");
      if (submitStatus) {
        submitStatus.textContent = "";
      }
      renderCompanyConfirmation({
        companyName,
        category: "Registro empresa",
        location: [canton, province].filter(Boolean).join(", "),
        providerId: result.companyId,
        mode: "azure",
      });
      trackAnalyticsEvent("company_registration_submit", {
        status: "success",
        province,
        source_surface: "company_register",
      });
      showToast("Solicitud recibida. Te enviaremos instrucciones por correo.");
    } catch (error) {
      console.warn(error);
      if (submitStatus) {
        submitStatus.textContent = "No se pudo completar el registro. Los datos siguen en el formulario.";
      }
      renderCompanyError("El registro no pudo completarse. Revisa los datos e inténtalo de nuevo en unos minutos.");
      showToast("No se pudo enviar el registro.");
    } finally {
      isSubmitting = false;
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

function setQuoteStatus(message, tone = "") {
  if (!quoteStatus) return;
  quoteStatus.textContent = message;
  quoteStatus.dataset.tone = tone;
}

function quoteContextFromTrigger(trigger) {
  const companyId = trigger?.dataset.companyId || "";
  const serviceId = trigger?.dataset.serviceId || "";
  if (!companyId || !serviceId) return null;
  return {
    companyId,
    serviceId,
    companySlug: trigger.dataset.companySlug || "",
    serviceSlug: trigger.dataset.serviceSlug || "",
    serviceName: trigger.dataset.serviceName || "servicio seleccionado",
    companyName: trigger.dataset.companyName || "",
  };
}

function goToServiceResults() {
  closeQuote();
  shouldFocusResults = true;
  if (window.location.hash === "#bodas") {
    render();
  } else {
    window.location.hash = "bodas";
  }
}

function showQuoteGuidance() {
  if (quoteTitle) {
    quoteTitle.textContent = "Elige un servicio publicado";
  }
  if (quoteContextNode) {
    quoteContextNode.textContent = "Para contactar a una empresa, primero selecciona un servicio publicado desde el listado o el perfil.";
  }
  quoteForm.classList.add("is-hidden");
  quoteConfirmation.classList.remove("is-hidden");
  quoteConfirmation.innerHTML = `
    <p class="eyebrow">Servicio requerido</p>
    <h3>Selecciona un servicio antes de enviar</h3>
    <p>Las solicitudes reales necesitan empresa y servicio para llegar al proveedor correcto.</p>
    <div class="card-actions">
      <button class="primary-button" type="button" data-guidance-results>Ver servicios</button>
      <button class="secondary-button" type="button" data-guidance-close>Cerrar</button>
    </div>
  `;
  quoteConfirmation.querySelector("[data-guidance-results]")?.addEventListener("click", goToServiceResults);
  quoteConfirmation.querySelector("[data-guidance-close]")?.addEventListener("click", () => closeQuote());
  setQuoteStatus("");
}

function openQuote(event) {
  lastFocusedElement = event?.currentTarget || document.activeElement;
  quoteContext = quoteContextFromTrigger(event?.currentTarget);
  if (quoteContext) {
    trackAnalyticsEvent("contact_click", contactAnalyticsParams(event?.currentTarget, { channel: "form" }));
  }
  const serviceName = quoteContext?.serviceName || event?.currentTarget?.dataset.serviceName || "";
  drawer.classList.add("is-open");
  drawer.setAttribute("aria-hidden", "false");

  const dialog = drawer.querySelector('[role="dialog"]');
  if (!quoteContext) {
    showQuoteGuidance();
    quoteConfirmation.focus();
    return;
  }

  if (quoteTitle) {
    quoteTitle.textContent = serviceName ? `Pedir cotización por ${serviceName}` : "Pedir cotización";
  }
  if (quoteContextNode) {
    quoteContextNode.textContent = quoteContext.companyName
      ? `Enviaremos tu solicitud a ${quoteContext.companyName} y quedará registrada por Punto Evento CR.`
      : "Enviaremos tu solicitud a la empresa del servicio seleccionado y quedará registrada por Punto Evento CR.";
  }
  setQuoteStatus("");
  quoteForm.classList.remove("is-hidden");
  quoteConfirmation.classList.add("is-hidden");
  const firstField = quoteForm.querySelector("input, select, textarea, button");
  (firstField || dialog)?.focus();
}

function closeQuote({ submitted = false } = {}) {
  if (submitted) {
    quoteForm.reset();
    quoteForm.classList.add("is-hidden");
    quoteConfirmation.classList.remove("is-hidden");
    quoteConfirmation.innerHTML = `
      <p class="eyebrow">Solicitud enviada</p>
      <h3>Solicitud enviada por formulario</h3>
      <p>Recibimos tu solicitud, la enviaremos a la empresa y quedará registrada por Punto Evento CR.</p>
      <button class="primary-button" type="button" data-close-quote>Cerrar</button>
    `;
    quoteConfirmation.querySelector("[data-close-quote]")?.addEventListener("click", () => closeQuote());
    quoteConfirmation.focus();
    setQuoteStatus("");
    showToast("Solicitud enviada por formulario.");
    return;
  }

  drawer.classList.remove("is-open");
  drawer.setAttribute("aria-hidden", "true");
  quoteForm.classList.remove("is-hidden");
  quoteConfirmation.classList.add("is-hidden");
  quoteConfirmation.innerHTML = `
    <p class="eyebrow">Solicitud enviada</p>
    <h3>Solicitud enviada por formulario</h3>
    <p>Recibimos tu solicitud, la enviaremos a la empresa y quedará registrada por Punto Evento CR.</p>
    <button class="primary-button" type="button" data-close-quote>Cerrar</button>
  `;
  quoteConfirmation.querySelector("[data-close-quote]")?.addEventListener("click", () => closeQuote());
  setQuoteStatus("");
  quoteContext = null;

  if (lastFocusedElement && document.contains(lastFocusedElement)) {
    lastFocusedElement.focus();
  }
}

async function submitPublicLead(form) {
  if (!quoteContext) {
    throw new Error("Selecciona un servicio publicado antes de enviar la solicitud.");
  }

  const formData = new FormData(form);
  const response = await fetch(CONFIG.publicLeadsUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      companyId: quoteContext.companyId,
      serviceId: quoteContext.serviceId,
      name: String(formData.get("name") || "").trim(),
      email: String(formData.get("email") || "").trim(),
      phone: String(formData.get("phone") || "").trim(),
      eventType: String(formData.get("eventType") || "").trim(),
      eventDate: String(formData.get("date") || "").trim(),
      guests: String(formData.get("guests") || "").trim(),
      message: String(formData.get("message") || "").trim(),
    }),
  });

  const text = await response.text();
  let payload = null;
  try {
    payload = text ? JSON.parse(text) : null;
  } catch {
    payload = null;
  }

  if (!response.ok) {
    const error = new Error(payload?.error || "No se pudo enviar la solicitud.");
    error.status = response.status;
    error.data = payload;
    throw error;
  }

  return payload;
}

function quoteErrorMessage(error) {
  if (error.status === 400) return "Revisa los datos requeridos antes de enviar.";
  if (error.status === 404) return "Este servicio ya no está disponible para cotizar.";
  if (error.status === 409) return "La empresa no tiene un canal operativo para recibir cotizaciones.";
  if (error.status === 502 && error.data?.leadId) {
    return "Recibimos la solicitud, pero no pudimos notificar a la empresa en este momento.";
  }
  return error.message || "No se pudo enviar la solicitud. Inténtalo de nuevo en unos minutos.";
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

document.addEventListener("click", (event) => {
  const trigger = event.target.closest("[data-publish-company-click]");
  if (!trigger) return;
  trackAnalyticsEvent("publish_company_click", {
    source_surface: trigger.dataset.sourceSurface || analyticsSourceSurface(trigger),
    target_section: trigger.dataset.targetSection || "company_register",
  });
});

quoteForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  if (!quoteForm.reportValidity()) {
    return;
  }

  if (isQuoteSubmitting) return;

  const submitButton = quoteForm.querySelector('button[type="submit"]');
  isQuoteSubmitting = true;
  setButtonLoading(submitButton, true, "Enviando...");
  setQuoteStatus("Enviando solicitud...");

  try {
    await submitPublicLead(quoteForm);
    trackAnalyticsEvent("quote_submit", contactAnalyticsParams(null, { status: "success" }));
    closeQuote({ submitted: true });
  } catch (error) {
    console.warn(error);
    setQuoteStatus(quoteErrorMessage(error), "error");
    showToast("No se pudo enviar la solicitud.");
  } finally {
    isQuoteSubmitting = false;
    setButtonLoading(submitButton, false);
  }
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
      '<div class="page"><section class="section"><p>No se pudieron cargar los proveedores. Inténtalo de nuevo en unos minutos.</p></section></div>';
    showToast("No se pudieron cargar los proveedores.");
    console.error(error);
  }
}

initAnalytics();
init();
