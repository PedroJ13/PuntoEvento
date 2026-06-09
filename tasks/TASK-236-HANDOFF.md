# TASK-236-HANDOFF: QA revalidacion paleta global en Azure

Equipo: QA  
Fecha: 2026-06-04  
Ambiente: Azure Static Web Apps / Azure Functions  
Base URL: `https://zealous-field-08fdd720f.7.azurestaticapps.net`

## Tarea validada

Revalidacion Azure de la paleta global `Punto Evento CR` desplegada por `TASK-235`, con foco en pagina publica, admin, panel empresa, API publica y evidencia disponible de emails.

## Resultado

Aprobado con observaciones P3.

No se detectan P0/P1 visuales, responsive, contraste de acciones principales ni regresiones de acceso para el alcance de paleta global. La validacion Azure confirma que los assets desplegados corresponden a las versiones esperadas.

## URLs validadas

- `https://zealous-field-08fdd720f.7.azurestaticapps.net/`
- `https://zealous-field-08fdd720f.7.azurestaticapps.net/#bodas`
- `https://zealous-field-08fdd720f.7.azurestaticapps.net/#proveedor/fatima-wedding-54311d/organizacion-completa`
- `https://zealous-field-08fdd720f.7.azurestaticapps.net/panel.html`
- `https://zealous-field-08fdd720f.7.azurestaticapps.net/admin.html`
- `https://zealous-field-08fdd720f.7.azurestaticapps.net/api/public/services?limit=1`
- `https://zealous-field-08fdd720f.7.azurestaticapps.net/styles.css?v=21`
- `https://zealous-field-08fdd720f.7.azurestaticapps.net/admin.css?v=14`

## Checks ejecutados

- `git rev-parse --show-toplevel`: confirma `C:/Users/pj13e/Digital Products/Punto Evento`.
- Lectura de contexto:
  - `tasks/TASK-231-HANDOFF.md`;
  - `tasks/TASK-232-HANDOFF.md`;
  - `tasks/TASK-233-HANDOFF.md`;
  - `tasks/TASK-235-HANDOFF.md`.
- HTTP Azure:
  - `/`: `200`;
  - `/panel.html`: `200`;
  - `/admin.html`: `200`;
  - `/api/public/services?limit=1`: `200`;
  - `/styles.css?v=21`: `200`;
  - `/admin.css?v=14`: `200`.
- Cache/assets:
  - `/` contiene `styles.css?v=21`;
  - `/` contiene `app.js?v=28`;
  - `/admin.html` contiene `styles.css?v=21`;
  - `/admin.html` contiene `admin.css?v=14`;
  - `/admin.html` contiene `admin.js?v=18`;
  - `styles.css?v=21` contiene `--brand-ink: #17191d`;
  - `styles.css?v=21` contiene `--brand-bg: #f8f5ef`;
  - `admin.css?v=14` contiene `var(--brand-bg)`.
- API publica:
  - `/api/public/services?limit=1` retorna `200`;
  - primer servicio observado: `Organización completa`;
  - empresa observada: `Fatima Wedding`;
  - slug observado: `organizacion-completa`.
- Playwright/Chromium contra Azure:
  - desktop `1440x900`;
  - mobile `390x844`;
  - pagina publica home/listado/ficha;
  - admin login y modo demo visual;
  - panel empresa como regresion minima.

## Evidencia desktop/mobile

Pagina publica:

- Desktop:
  - home carga sin errores de consola;
  - `body` usa fondo `rgb(248, 245, 239)`;
  - CTA primario `rgb(23, 25, 29)` / blanco, contraste aproximado `17.6`;
  - CTA secundario `rgb(239, 228, 207)` / ink, contraste aproximado `13.97`;
  - listado `#bodas` muestra servicios publicados desde API;
  - card/listado usa superficie `rgb(255, 253, 248)`;
  - ficha `#proveedor/fatima-wedding-54311d/organizacion-completa` carga con CTA visible;
  - sin overflow horizontal.
- Mobile:
  - home/listado/ficha cargan sin overflow horizontal;
  - CTAs mantienen contraste y ancho usable;
  - card de listado y ficha se apilan sin texto cortado observable;
  - contacto/solicitud visible en ficha.

Admin interno:

- Desktop:
  - `/admin.html` carga login con titulo `Admin | Punto Evento CR`;
  - login card usa `rgba(255, 253, 248, 0.96)`;
  - boton `Entrar` mantiene contraste aproximado `17.6`;
  - boton `Ver modo demo local` mantiene contraste aproximado `13.97`;
  - modo demo visual abre panel sin mutar datos reales;
  - status `Perfil pendiente` usa warning funcional `rgb(255, 242, 214)` / `rgb(139, 100, 29)`, contraste aproximado `4.8`;
  - sin overflow horizontal.
- Mobile:
  - login y demo visual cargan sin overflow horizontal;
  - botones ocupan ancho disponible y no presentan texto cortado;
  - superficies mantienen la paleta global.

Panel empresa:

- Desktop/mobile:
  - `/panel.html` carga con titulo `Panel empresa | Punto Evento CR`;
  - no se detecta overflow horizontal;
  - marca/logo y estructura principal visibles;
  - colores siguen coherentes con paleta premium existente.

Emails:

- No hubo evidencia de email real renderizado en ACS/inbox durante esta tarea.
- Se toma como evidencia disponible lo indicado por `TASK-233` y `TASK-235`: `api/shared/email.js` desplegado con `EMAIL_STYLES`, wrapper `emailShell`, CTA inline y marca `Punto Evento CR`.

## Hallazgos por severidad

P0:

- Ninguno.

P1:

- Ninguno.

P2:

- Ninguno.

P3:

- Sin credencial admin real disponible en esta asignacion; se valido login y modo demo visual, no expediente/admin real autenticado.
- `/panel.html` sin sesion genera errores `401` esperados en endpoints de sesion/perfil, pero la superficie carga y no afecta la validacion visual de paleta.
- No se envio ni renderizo un email real; queda pendiente solo si Product / Release quiere evidencia de inbox.
- Texto secundario/muted de ayuda en admin mide contraste aproximado `3.91`; no afecta CTAs ni estados, pero puede revisarse como mejora menor de accesibilidad si se quiere AA estricto para texto secundario.

## Riesgos o pendientes

- Esta validacion aprueba la paleta global en Azure, pero no reemplaza una prueba autenticada completa de admin con credenciales reales.
- Los emails siguen sin evidencia visual en cliente real; los estilos son inline y simples, pero cada cliente de correo puede variar bordes/radius.

## Recomendacion para Product / Architect / Release

Cerrar la cadena `TASK-231` a `TASK-236` como aprobada para paleta global en local y Azure. No bloquear release por la paleta global. Si se quiere mayor cobertura antes de un anuncio publico, abrir una tarea menor para captura de email real en inbox y otra para revisar contraste AA de textos secundarios muted.
