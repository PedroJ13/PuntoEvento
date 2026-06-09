# TASK-259 HANDOFF

Equipo: QA

Tarea validada: `TASK-259` - revalidacion pre-lanzamiento copy, flujo y responsive despues del bloque `TASK-249` a `TASK-258`, incluyendo `TASK-254`/`TASK-255`.

Ambiente usado:

- Local/estructural: `http://127.0.0.1:60259`, servido con `python -m http.server`.
- Navegador: Playwright Chromium headless, mobile `390x844` y desktop `1366x768`.
- Datos: mocks locales para servicios publicos, perfil publico y admin interno. No se enviaron leads reales, no se registraron empresas reales y no se usaron credenciales reales en el handoff.
- Azure solo lectura: `https://zealous-field-08fdd720f.7.azurestaticapps.net`.

Resultado general: **no aprobado**.

Resumen:

- La mayoria de flujos locales del bloque pasa: home/resultados/ficha, CTA global sin servicio, drawer mobile, registro empresa, panel empresa login, admin productivo con expediente mock y responsive basico.
- Se encontro un P1 en pagina publica: cuando falla `/api/public/services` en un host no-local, se muestra el error controlado, pero siguen visibles paquetes/proveedores estaticos de referencia debajo del listado.
- Azure queda limpio de catalogo publico por `TASK-248`, pero no sirve todavia los assets locales del bloque `TASK-249` a `TASK-258`; por tanto este handoff no aprueba Azure post-deploy.

Checks ejecutados:

- `git rev-parse --show-toplevel` -> `C:/Users/pj13e/Digital Products/Punto Evento`.
- Lectura de `AGENTS.md`, `chat-start/QA.md`, `docs/README.md`, `docs/WORKFLOW_CODEX.md`, `docs/MVP_RELEASE_STATUS.md`, `docs/MVP_CRITERIA.md`, `docs/QA_TEST_PLAN.md`, `tasks/generated/prompts/qa-next-prompt.md` y `tasks/TASK-259-assignment.md`.
- Versiones locales observadas:
  - `index.html`: `styles.css?v=25`, `app.js?v=30`.
  - `panel.html`: `panel.css?v=13`, `panel.js?v=13`.
  - `admin.html`: `admin.css?v=14`, `admin.js?v=20`.
- Sintaxis:
  - `node --check app.js` -> OK.
  - `node --check panel.js` -> OK.
  - `node --check admin.js` -> OK.
  - `node --check api/shared/email.js` -> OK.
  - `git diff --check -- index.html app.js styles.css panel.html panel.css panel.js admin.html admin.js api/shared/email.js data/categories.json data/event-types.json` -> sin errores; solo warnings LF/CRLF de Windows.
- Smoke Playwright local:
  - Home publica sin `demo` visible ni `Cotizacion multiple`.
  - CTA global sin servicio navega a resultados, no abre drawer y no dispara `POST /api/public/leads`.
  - Resultados publicos con servicio mock muestran servicio y CTA de servicio abre drawer.
  - Drawer mobile: submit visible en viewport `390x844` (`y=760`, `height=44`).
  - Ficha publica mobile: servicio seleccionado visible, resumen antes del carrusel, carrusel `280px`, sin overflow horizontal.
  - Registro empresa visible, sin `demo`, `Cotizacion multiple` ni `password` visibles.
  - Panel empresa login normal: usa `Contraseña`, no muestra `password`, `revisión`, `moderación`, `aprobada` ni `pendiente`; sin overflow horizontal.
  - Admin normal: login y panel con expediente mock no muestran modo local/demo/legacy/flujo anterior en modo productivo; sin overflow horizontal.
  - Desktop ficha publica: sin overflow horizontal.
- Smoke productivo simulado:
  - Host no-local `http://puntoevento.test:60259` con `/api/public/services` forzado a `500`.
  - Muestra error controlado `No pudimos cargar los servicios publicados`.
  - Falla porque permanecen visibles paquetes estaticos de referencia.
- Emails estructurales:
  - `sendLeadEmailToCompany` no contiene `aprobada`, `revision`, `revisión`, `moderacion`, `moderación` ni `pendiente`.
  - `sendCompanyActivationInviteEmail` no contiene `aprobada`, `revision`, `revisión`, `moderacion`, `moderación` ni `pendiente`.
  - Las menciones de `pendiente/revisión interna` quedan solo en notificaciones internas.
- Azure solo lectura:
  - `GET /api/public/services?limit=50` -> `items.length = 0`.
  - `/`, `/panel.html`, `/admin.html` -> `200`.
  - Assets Azure observados: `app.js?v=28`, `styles.css?v=23`, `panel.js?v=11`, `panel.css?v=12`, `admin.js?v=19`; no corresponden a los assets locales del bloque `TASK-249` a `TASK-258`.

Hallazgos:

## P0

- Ninguno.

## P1

- **P1 - Pagina publica muestra datos de referencia cuando falla la API publica en modo productivo.**
  - Evidencia: con host no-local y `/api/public/services` forzado a `500`, el listado muestra el mensaje controlado de servicios no disponibles, pero debajo siguen visibles `Paquetes de boda` con nombres como `Casa Arboleda Eventos`, `Bocados y Copas`, `Luz Viva Producciones`, `Flor de Abril`, `Captura Dorada` y `Nexo Corporativo`.
  - Archivo probable: `app.js`, bloque de `#bodas` que siempre renderiza `packages.map(packageCard)` cerca de las lineas 792-797.
  - Impacto: contradice la verificacion de `TASK-259` sobre no mostrar datos demo/referencia cuando falla la API publica en productivo. Puede confundir a usuarios reales y dar apariencia de catalogo disponible cuando el catalogo real fallo o esta vacio.

## P2

- **P2 - Azure no esta en version local del bloque `TASK-249` a `TASK-258`.**
  - Evidencia: Azure sirve `app.js?v=28`, `styles.css?v=23`, `panel.js?v=11`, `panel.css?v=12`, `admin.js?v=19`; local tiene `app.js?v=30`, `styles.css?v=25`, `panel.js?v=13`, `panel.css?v=13`, `admin.js?v=20`.
  - Impacto: no se puede considerar aprobacion Azure del bloque actual. Requiere deploy posterior y QA post-deploy.

## P3

- **P3 - Smoke de emails fue estructural, no inbox real.**
  - Evidencia: se valido el codigo de plantillas company-facing, no recepcion real en mailbox.
  - Impacto: aceptable para esta tarea si Product no pidio prueba end-to-end de correo real.

Riesgos o pendientes:

- El ambiente Azure esta limpio de datos operativos (`/api/public/services?limit=50` devuelve 0), pero al no estar desplegados los assets del bloque actual no representa la version local validada.
- No se probaron credenciales reales ni se mutaron datos reales por restriccion explicita de la tarea.
- El P1 de paquetes de referencia deberia corregirse antes de usar la pagina publica con empresas reales, especialmente si el catalogo esta vacio o la API falla.

Recomendacion release/no release:

- **No release / no-go para siguiente test con empresa real** hasta corregir el P1 de datos de referencia en la pagina publica y desplegar el bloque `TASK-249` a `TASK-258`.
- Siguiente recomendado: Web Dev debe ocultar o reemplazar la seccion de paquetes estaticos de referencia en modo productivo cuando no haya servicios reales o cuando `serviceDataSource === "error"`, y QA debe revalidar local/estructuralmente antes de pedir deploy Azure.
