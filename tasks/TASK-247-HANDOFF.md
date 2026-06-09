# TASK-247-HANDOFF: QA revalidacion ajustes publicos y login admin en Azure

Equipo: QA  
Fecha: 2026-06-05  
Ambiente: Azure Static Web Apps / Azure Functions  
Base URL: `https://zealous-field-08fdd720f.7.azurestaticapps.net`

## Tarea validada

Revalidacion Azure del bloque desplegado por `TASK-246`:

- ajustes visuales publicos finales;
- ficha publica con defensa para nombres largos;
- admin con credenciales invalidas sin prompt nativo y con mensaje inline;
- regresion basica de panel/admin.

## Resultado

Aprobado con observaciones P3.

No se detectan P0/P1. La pagina publica sirve las versiones esperadas, mantiene home/listado/ficha/contacto accesibles, el admin invalido muestra mensaje inline sin prompt nativo del navegador y el panel no presenta regresion basica.

## URLs validadas

- `https://zealous-field-08fdd720f.7.azurestaticapps.net/`
- `https://zealous-field-08fdd720f.7.azurestaticapps.net/#bodas`
- `https://zealous-field-08fdd720f.7.azurestaticapps.net/#proveedor/fatima-wedding-54311d/organizacion-completa`
- `https://zealous-field-08fdd720f.7.azurestaticapps.net/admin.html`
- `https://zealous-field-08fdd720f.7.azurestaticapps.net/panel.html`
- `https://zealous-field-08fdd720f.7.azurestaticapps.net/api/public/services?limit=1`
- `https://zealous-field-08fdd720f.7.azurestaticapps.net/api/public/services?limit=50`
- `https://zealous-field-08fdd720f.7.azurestaticapps.net/api/internal/companies/pending`
- `https://zealous-field-08fdd720f.7.azurestaticapps.net/styles.css?v=23`
- `https://zealous-field-08fdd720f.7.azurestaticapps.net/admin.js?v=19`

## Checks ejecutados

- `git rev-parse --show-toplevel`: confirma `C:/Users/pj13e/Digital Products/Punto Evento`.
- Lectura de contexto:
  - `tasks/TASK-242-HANDOFF.md`;
  - `tasks/TASK-243-HANDOFF.md`;
  - `tasks/TASK-244-HANDOFF.md`;
  - `tasks/TASK-246-HANDOFF.md`.
- HTTP Azure:
  - `/`: `200`;
  - `/styles.css?v=23`: `200`;
  - `/admin.html`: `200`;
  - `/admin.js?v=19`: `200`;
  - `/panel.html`: `200`;
  - `/api/public/services?limit=1`: `200`;
  - `/api/public/services?limit=50`: `200`;
  - `/api/internal/companies/pending` sin credenciales: `401`.
- Respuesta interna sin credenciales:
  - status `401`;
  - body `{ "error": "Credenciales invalidas" }`;
  - header `WWW-Authenticate`: ausente.
- Cache/assets:
  - `/` contiene `styles.css?v=23`;
  - `/` contiene `app.js?v=28`;
  - `/` contiene el logo `assets/images/logo-punto-evento-cr-panel.png`;
  - `/` no contiene links visibles `Servicios` ni `Proveedor` en nav;
  - `styles.css?v=23` contiene `minmax(360px, 420px)`;
  - `styles.css?v=23` contiene `overflow-wrap: anywhere`;
  - `/admin.html` contiene `admin.js?v=19`;
  - `/admin.html` contiene `role="status"`;
  - `admin.js?v=19` contiene `Credenciales invalidas. Verifica usuario y password.`;
  - `admin.js?v=19` contiene `X-Punto-Admin-Credential`;
  - `admin.js?v=19` elimina defensivamente `Authorization`.
- API publica:
  - `/api/public/services?limit=50` retorna 3 servicios.
  - Proveedor mas largo observado en datos reales Azure: `Aurisbel Pastelería` (`19` caracteres).
- Playwright/Chromium contra Azure:
  - publico desktop `1440x900`;
  - publico wide `1920x1080`;
  - publico mobile `390x844`;
  - admin desktop/mobile;
  - panel desktop/mobile.

## Evidencia desktop/mobile

Pagina publica:

- Home desktop `1440x900`:
  - sin overflow horizontal;
  - nav visible: `Inicio`, `Buscar`, `Empresas`, `Publicar empresa`;
  - `Servicios` y `Proveedor` no aparecen como opciones visibles del nav;
  - logo carga `assets/images/logo-punto-evento-cr-panel.png`;
  - `alt="Punto Evento CR"`;
  - logo renderizado `216 x 62`;
  - hero renderizado aprox. `646.6px`;
  - buscador visible;
  - CTA primario contraste aprox. `17.6`;
  - CTA secundario contraste aprox. `13.97`.
- Home wide `1920x1080`:
  - sin overflow horizontal;
  - home al 100% mantiene escala equilibrada.
- Home mobile `390x844`:
  - sin overflow horizontal;
  - logo visible y no cortado;
  - nav conserva solo opciones esperadas.

Listado `#bodas`:

- Desktop/mobile:
  - ruta carga con 3 cards desde API Azure;
  - primera ficha observada: `Fatima Wedding` / `Organización completa`;
  - card con radio `16px`;
  - `Ver empresa` visible;
  - `Enviar solicitud` visible;
  - drawer abre desde resultados con contexto de servicio;
  - sin overflow horizontal.

Ficha publica:

- Ruta real validada:
  - `#proveedor/fatima-wedding-54311d/organizacion-completa`.
- Desktop/mobile:
  - ficha carga;
  - summary visible;
  - galeria visible;
  - CTAs `Contactar` y `Enviar solicitud` visibles;
  - drawer abre desde ficha con contexto `Contactar por Organización completa`;
  - sin overflow horizontal.
- Validacion de nombre largo:
  - Los datos reales Azure no contienen un proveedor con nombre largo extremo; el mas largo mide 19 caracteres.
  - Se hizo simulacion DOM temporal en navegador, sin cambiar datos reales, con:
    - `Aurisbel Pastelería Celebraciones y Producciones Premium Costa Rica`.
  - Desktop:
    - titulo queda dentro del summary;
    - `summary width`: `420px`;
    - overflow horizontal: `0`.
  - Mobile:
    - titulo se envuelve dentro de `362px`;
    - overflow horizontal: `0`.

Admin:

- `/admin.html` desktop/mobile:
  - `admin.js?v=19` servido;
  - login visible;
  - sin overflow horizontal.
- Credenciales invalidas contra Azure real:
  - request a `/api/admin/pending-providers`;
  - no envia `Authorization`;
  - envia `X-Punto-Admin-Credential`;
  - no se dispararon dialogs nativos/JS en Playwright (`dialogs: []`);
  - mensaje inline visible:
    - `Credenciales invalidas. Verifica usuario y password.`;
  - `data-login-message` tiene `is-error`;
  - login queda visible;
  - panel admin queda oculto;
  - `sessionStorage.puntoEventoAdminAuth` queda vacio;
  - sin overflow horizontal.

Panel:

- `/panel.html` desktop/mobile:
  - carga `Panel empresa | Punto Evento CR`;
  - estructura y logo visibles;
  - sin overflow horizontal.

## Hallazgos por severidad

P0:

- Ninguno.

P1:

- Ninguno.

P2:

- Ninguno.

P3:

- Azure no tiene actualmente un proveedor con nombre largo extremo; la defensa CSS se valido con simulacion DOM temporal en navegador, sin persistir datos.
- No se valido login admin con credenciales reales/controladas; la tarea se limito al caso invalido y regresion visual basica por no disponer de credenciales en este chat.
- `/panel.html` sin sesion puede generar `401` esperados en endpoints protegidos, pero la superficie visual carga sin regresion.
- El logo publico sigue siendo raster, no vector definitivo.
- El texto inline de error admin mide contraste aproximado `3.53`; es visible, pero queda como posible mejora menor de accesibilidad si se exige AA estricto para texto pequeno.

## Riesgos o pendientes

- Esta aprobacion cubre el bloque desplegado en Azure y el caso invalido real; no reemplaza una prueba autenticada completa de admin con credenciales reales.
- Si Product carga proveedores con nombres mucho mas largos o palabras sin espacios, `overflow-wrap: anywhere` puede cortar palabras como defensa contra overflow.

## Recomendacion para Product / Architect / Release

Cerrar la cadena `TASK-242` a `TASK-247` como aprobada para ajustes visuales publicos finales y manejo de credenciales admin invalidas en Azure. No bloquear release por este bloque. Crear tareas separadas solo si se quiere:

- prueba admin autenticada completa con credencial controlada;
- mejora de contraste del mensaje inline de error;
- reemplazo futuro del logo raster por vector definitivo.
