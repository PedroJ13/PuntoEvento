# TASK-244: Web Dev - mensaje inline para credenciales admin invalidas

## Equipo

Web Dev

## Estado

Completada local/estructuralmente.

## Contexto revisado

Se leyo `tasks/TASK-243-HANDOFF.md`.

Puntos relevantes de Backend/API:

- `requireAdminAuth` ya no devuelve `WWW-Authenticate`.
- Credenciales faltantes o invalidas devuelven `401`.
- Respuesta esperada: `{ "error": "Credenciales invalidas" }`.
- Mecanismo recomendado: `X-Punto-Admin-Credential`.
- La UI admin debe evitar `Authorization`.

## Resumen de cambios

- `admin.js` ahora mapea `401` y `403` a mensaje inline controlado:
  - `Credenciales invalidas. Verifica usuario y password.`
- Se agrego limpieza centralizada de sesion admin con `clearAdminAuth()`.
- Credenciales invalidas ya no se guardan en `sessionStorage`.
- Credenciales se persisten solo despues de validar exitosamente.
- `adminFetch` y `adminFetchBlob` eliminan defensivamente cualquier header `Authorization` / `authorization`.
- El wrapper usa `X-Punto-Admin-Credential` como header de autenticacion admin.
- `admin.html` agrega `role="status"` y `aria-live="polite"` al mensaje inline del login.
- Se mantiene modo demo local.
- No se tocaron backend/API, pagina publica, panel empresa, permisos ni moderacion.

## Archivos tocados

- `admin.html`
- `admin.js`
- `tasks/TASK-244-HANDOFF.md`

## Versiones / cache busting

- `admin.html` sube `admin.js?v=19`.
- `admin.css?v=14` se mantiene sin cambios.
- `styles.css?v=21` en `admin.html` se mantiene sin cambios.

## Evidencia de error inline

Playwright con servidor HTTP local embebido y API simulada:

- `POST/GET /api/admin/pending-providers` simulado con credenciales invalidas:
  - respuesta `401`;
  - body `{ "error": "Credenciales invalidas" }`;
  - sin header `WWW-Authenticate`.
- Resultado UI:
  - mensaje visible: `Credenciales invalidas. Verifica usuario y password.`;
  - `data-login-message` tiene clase `is-error`;
  - login sigue visible;
  - panel admin queda oculto;
  - `sessionStorage.puntoEventoAdminAuth` queda vacio;
  - sin overflow horizontal en `1440x900`.

## Confirmacion anti prompt nativo

En Playwright local:

- No se dispararon dialogs nativos/JS durante login invalido.
- Requests admin enviados:
  - `Authorization`: vacio/no enviado.
  - `X-Punto-Admin-Credential`: enviado con valor `Basic ...`.
- El flujo depende del header custom, no de Basic Auth nativo.

## Credenciales validas

Con API simulada aceptando `admin:good`:

- Login exitoso.
- Panel admin visible.
- Login oculto.
- `sessionStorage.puntoEventoAdminAuth` queda persistido.
- Sin overflow horizontal en `1440x900`.

Observacion:

- El servidor simulado solo respondio `/api/admin/pending-providers`; las llamadas posteriores al modelo nuevo devolvieron `404` no bloqueante en esta prueba local. El objetivo de TASK-244 era validar login/auth UI, no endpoints internos completos.

## Modo demo local

Con `admin.html?demo=local` en `390x844`:

- Panel admin visible.
- Login oculto.
- Banner demo visible.
- Conteo: `Modo demo local`.
- Sin overflow horizontal.

## Checks ejecutados

- `node --check admin.js`: OK.
- `git diff --check -- admin.html admin.css admin.js`: OK.
- `rg -n "Authorization|WWW-Authenticate|X-Punto-Admin-Credential|Credenciales invalidas" admin.js admin.html`:
  - no hay `WWW-Authenticate`;
  - `Authorization` solo aparece en deletes defensivos;
  - `X-Punto-Admin-Credential` sigue como header usado.

## Riesgos

- Validacion con credenciales reales queda para QA/Azure; esta tarea uso API simulada local.
- Si algun endpoint interno devuelve `404` despues del login, el admin puede mostrar errores en modelo nuevo, pero eso es separado del prompt nativo.
- El backend aun acepta `Authorization` por compatibilidad segun `TASK-243`, pero la UI ya no lo envia.

## Recomendacion para QA TASK-245

Validar en navegador real:

- Login admin con credenciales invalidas:
  - no aparece dialogo/prompt nativo del navegador;
  - aparece inline `Credenciales invalidas. Verifica usuario y password.`;
  - el boton/login no queda en `Validando credenciales...`;
  - no se entra al panel.
- Login admin con credenciales validas:
  - entra al panel;
  - carga modelo nuevo/listados protegidos;
  - acciones protegidas siguen usando sesion admin.
- Modo demo local:
  - `admin.html?demo=local` sigue funcionando.
- Mobile y desktop sin overflow.
- Confirmar que `admin.html` sirve `admin.js?v=19`.
