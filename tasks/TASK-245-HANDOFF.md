# TASK-245-HANDOFF: QA ajustes visuales publicos y login admin local/estructural

Equipo: QA  
Fecha: 2026-06-05  
Ambiente: local/estructural con servidor `http://127.0.0.1:60228`

## Tarea validada

Validacion local/estructural de:

- ajustes visuales publicos de `TASK-242`;
- flujo admin sin prompt nativo e inline error de `TASK-243` / `TASK-244`.

## Resultado

Aprobado con observaciones P3.

No se detectan P0/P1 visuales o funcionales. La pagina publica mantiene home/listado/ficha/contacto accesibles, nombres largos no desbordan el panel, y admin muestra error inline ante credenciales invalidas sin prompt nativo del navegador.

## Superficies validadas

- Pagina publica:
  - home al 100%;
  - `#bodas`;
  - ficha publica con nombre largo;
  - logo publico;
  - nav publica;
  - drawer de contacto/cotizacion.
- Admin:
  - credenciales invalidas;
  - ausencia de prompt/dialog nativo;
  - mensaje inline;
  - credenciales validas con API local controlada/simulada;
  - modo demo local.
- Panel empresa:
  - regresion minima `panel.html?demo=local`.

## Checks ejecutados

- `git rev-parse --show-toplevel`: confirma `C:/Users/pj13e/Digital Products/Punto Evento`.
- Lectura de contexto:
  - `tasks/TASK-242-HANDOFF.md`;
  - `tasks/TASK-243-HANDOFF.md`;
  - `tasks/TASK-244-HANDOFF.md`.
- Versiones/cache busting:
  - `index.html` usa `styles.css?v=23`;
  - `index.html` mantiene `app.js?v=28`;
  - `admin.html` usa `styles.css?v=21`;
  - `admin.html` usa `admin.css?v=14`;
  - `admin.html` usa `admin.js?v=19`.
- Checks de sintaxis:
  - `node --check app.js`: OK;
  - `node --check admin.js`: OK;
  - `node --check api/shared/adminAuth.js`: OK.
- `git diff --check -- index.html styles.css app.js admin.html admin.css admin.js api/shared/adminAuth.js`: OK, solo warnings esperados LF/CRLF.
- Revision estructural:
  - `api/shared/adminAuth.js` devuelve `Credenciales invalidas`;
  - no hay `WWW-Authenticate` en `admin.js`, `admin.html` ni `api/shared/adminAuth.js`;
  - `admin.js` usa `X-Punto-Admin-Credential`;
  - `admin.js` elimina defensivamente `Authorization` / `authorization`;
  - `admin.html` tiene `role="status"` y `aria-live="polite"` en el mensaje de login.
- Playwright/Chromium local:
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
  - `Servicios` y `Proveedor` no aparecen como links visibles del nav;
  - logo `assets/images/logo-punto-evento-cr-panel.png`;
  - `alt="Punto Evento CR"`;
  - logo renderizado `216 x 62`;
  - hero renderizado aprox. `646.6px`;
  - buscador visible con radio `16px`;
  - CTA primario con contraste aprox. `17.6`.
- Home wide `1920x1080`:
  - sin overflow horizontal;
  - misma estructura de nav/logo/home al 100%.
- Home mobile `390x844`:
  - sin overflow horizontal;
  - logo visible y no cortado;
  - nav conserva solo opciones esperadas;
  - drawer abre.

Listado `#bodas`:

- Datos simulados controlados con empresa de nombre largo.
- Desktop/mobile:
  - ruta `#bodas` carga;
  - cards renderizadas;
  - link `Ver empresa` visible;
  - CTA de card `Enviar solicitud` visible;
  - drawer de resultados abre con contexto de servicio;
  - sin overflow horizontal.

Ficha publica con nombre largo:

- Empresa usada:
  - `Fatima Wedding Celebraciones y Producciones Premium Costa Rica`.
- Desktop `1440x900`:
  - ruta `#proveedor/fatima-wedding-largo/organizacion-completa-premium` carga;
  - summary width `420px`;
  - titulo largo queda dentro del summary:
    - titulo right `1285`;
    - summary right `1310`;
    - titulo bottom `400.36`;
    - summary bottom `747.45`;
  - `.provider-title` usa `Georgia, "Times New Roman", serif`;
  - CTAs `Contactar` / `Enviar solicitud` visibles;
  - sin overflow horizontal.
- Mobile `390x844`:
  - summary width `362px`;
  - titulo largo se envuelve sin desbordar;
  - CTAs ocupan ancho disponible;
  - sin overflow horizontal.

Drawer contacto/cotizacion:

- Desde home:
  - abre `.quote-drawer.is-open`;
  - boton `Enviar solicitud` visible;
  - sin overflow.
- Desde resultados:
  - abre con contexto de servicio;
  - muestra `Solicitud por formulario/email dirigida a Fatima...`;
  - boton `Enviar solicitud` visible;
  - sin overflow.
- Desde ficha:
  - abre con contexto de servicio;
  - boton `Enviar solicitud` visible;
  - sin overflow.

Admin:

- Credenciales invalidas, desktop/mobile:
  - request protegido a `/api/admin/pending-providers`;
  - status simulado `401`;
  - respuesta JSON `{ "error": "Credenciales invalidas" }`;
  - sin header `WWW-Authenticate`;
  - no se dispararon dialogs nativos/JS en Playwright;
  - request no envia `Authorization`;
  - request envia `X-Punto-Admin-Credential`;
  - mensaje inline visible: `Credenciales invalidas. Verifica usuario y password.`;
  - `data-login-message` tiene `is-error`;
  - login queda visible;
  - panel admin queda oculto;
  - `sessionStorage.puntoEventoAdminAuth` queda vacio;
  - sin overflow horizontal.
- Credenciales validas controladas/simuladas, desktop/mobile:
  - request no envia `Authorization`;
  - request usa `X-Punto-Admin-Credential`;
  - login queda oculto;
  - panel admin visible;
  - `sessionStorage.puntoEventoAdminAuth` queda persistido;
  - status: `Modelo nuevo actualizado.`;
  - sin overflow horizontal.
- Modo demo local, desktop/mobile:
  - `admin.html?demo=local`;
  - login oculto;
  - panel visible;
  - banner demo visible;
  - conteo `Modo demo local`;
  - sin overflow horizontal.

Panel empresa:

- `panel.html?demo=local` desktop/mobile:
  - carga `Panel empresa | Punto Evento CR`;
  - estructura y logo visibles;
  - sin errores de consola;
  - sin overflow horizontal.

## Hallazgos por severidad

P0:

- Ninguno.

P1:

- Ninguno.

P2:

- Ninguno.

P3:

- Validacion de credenciales validas fue local/controlada con API simulada; no se usaron credenciales reales.
- El logo publico sigue siendo raster del asset aprobado del panel, no vector definitivo.
- `overflow-wrap: anywhere` puede cortar palabras extremadamente largas sin espacios, pero solo como mecanismo defensivo para evitar overflow.

## Riesgos o pendientes

- Esta aprobacion es local/estructural y no sustituye la validacion Azure posterior.
- En Azure debe confirmarse que `/` sirve `styles.css?v=23` y `/admin.html` sirve `admin.js?v=19`.
- En Azure debe repetirse el caso de credenciales invalidas contra Functions reales para confirmar ausencia de prompt nativo con backend desplegado.

## Recomendacion para Infra Azure TASK-246

Avanzar con `TASK-246` para desplegar `index.html`, `styles.css`, `admin.html`, `admin.js` y `api/shared/adminAuth.js`, confirmando:

- pagina publica mantiene nav reducido y logo grande sin corte;
- home/listado/ficha/drawer funcionan en Azure;
- admin invalido devuelve inline `Credenciales invalidas. Verifica usuario y password.`;
- respuesta `401` real no incluye `WWW-Authenticate`;
- UI admin no envia `Authorization` y usa `X-Punto-Admin-Credential`;
- panel empresa no presenta regresion basica.
