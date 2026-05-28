# TASK-070 Handoff

## Resultado general

La pagina publica ahora carga resultados como servicios publicados. Primero intenta usar `GET /api/public/services`; si la API no responde, mantiene el fallback demo construido desde `data/providers.json` y `data/packages.json`.

El perfil `#proveedor/{companySlug}/{serviceSlug}` intenta usar `GET /api/public/companies/{slug}` para mostrar la empresa publicada con sus servicios. Si la API falla o no hay perfil, conserva el perfil demo anterior usando `data/providers.json`.

## Archivos modificados

- `app.js`
- `styles.css`
- `index.html`
- `tasks/TASK-070-HANDOFF.md`

## Rutas y flows revisados

- `#inicio`: conserva la home actual y cambia destacados a cards de servicios.
- `#bodas`: muestra resultados por servicio, con empresa, categoria, provincia/zona, precio desde, imagen y acciones.
- `#proveedor/{empresa}`: mantiene compatibilidad con perfiles demo existentes.
- `#proveedor/{empresa}/{servicio}`: nueva ruta para abrir perfil de empresa con el servicio seleccionado destacado.

## Fuente de datos y fallback

- Fuente principal: `/api/public/services`.
- Perfil principal: `/api/public/companies/{slug}`.
- Fallback: datos demo locales.
- Cuando se usa fallback demo, se muestra un aviso discreto debajo de los listados/destacados.

## Busqueda y filtros

La primera implementacion filtra client-side sobre la lista cargada de servicios normalizados. Esto evita cambiar contratos y permite que el fallback demo funcione igual que la API.

Campos usados:

- Home: tipo de evento y ubicacion.
- Listado bodas: servicio/categoria y provincia.

Siguiente iteracion recomendada: mapear estos filtros a query params reales cuando Product/Backend definan nombres finales (`q`, `category`, `province`, `eventType`, etc.) y paginacion.

## Validaciones manuales realizadas

- `node --check app.js` con runtime empaquetado de Codex: OK.
- Evaluacion de render con mock DOM y API fallando:
  - Home carga con destacados de servicios.
  - `#bodas` carga resultados por servicio.
  - `#proveedor/casa-arboleda/boda-esencial` conserva fallback demo.
- Evaluacion de render con mock de API publica:
  - Se llama `/api/public/services`.
  - Se llama `/api/public/companies/aurisbel`.
  - Home muestra servicio y empresa.
  - Perfil muestra servicio seleccionado.
  - No aparece aviso demo cuando la API responde.
- Servidor local detectado en `http://127.0.0.1:4173/index.html` con status 200.

No se pudo usar Playwright del bundle porque el paquete local `playwright` no encontro `playwright-core`; se sustituyo por validacion con runtime Node y mocks de DOM/fetch.

## Descripcion visual

La home mantiene el look actual. Los destacados siguen usando las mismas cards, pero ahora el titulo de cada card es el servicio y el metadato muestra empresa, categoria y zona.

El listado de bodas conserva el layout de filtros + sidebar + resultados, pero cada resultado representa un servicio. El boton principal cotiza el servicio y el link abre el perfil de empresa.

El perfil de empresa mantiene galeria/carrusel y agrega una seccion de servicios publicados, destacando el servicio por el que entro el usuario.

## Riesgos restantes

- Los filtros son client-side y no paginan; si la API devuelve muchos servicios, habra que pasar a filtros server-side.
- La ruta nueva depende de `company.slug` y `service.slug`; si algun slug viene vacio, la card puede no tener una ruta util.
- La verificacion fue estructural/mock por limitacion local de Playwright; QA visual en navegador real sigue recomendada.
- La API debe seguir excluyendo servicios/empresas no publicados; el frontend no debe ser la fuente de seguridad.

## Siguiente tarea recomendada

QA local de pagina publica conectada:

- Validar desktop y mobile en navegador real.
- Probar con Azure desplegado y al menos una empresa con multiples servicios publicados.
- Confirmar nombres finales de query params para mover filtros a API si Backend ya los soporta.
