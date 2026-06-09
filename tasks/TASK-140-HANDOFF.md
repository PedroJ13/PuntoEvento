# TASK-140 Handoff

## Resultado general

Implementada persistencia de contactos ampliados para empresas registradas por `POST /api/companies/register`.

Los datos se aceptan desde el registro, se guardan en `Companies`, se devuelven en `GET /api/companies/me`, se exponen en listados internos admin y se publican solo en endpoints publicos donde el contrato los considera publicos. `email` sigue sin exponerse en endpoints publicos.

## Campos aceptados y persistidos

Campos nuevos/opcionales:

- `phone`
- `website`
- `instagram`
- `facebook`
- `tiktok`

Aliases aceptados:

- `phone`: `phone`, `telephone`, `localPhone`, `phoneLocal`, `telefono`
- `whatsapp`: `whatsapp`, `whatsApp`, `whatsappNumber`, `whatsappPhone`, y fallback compatible a `phone`
- `website`: `website`, `web`, `webpage`, `url`
- `instagram`: `instagram`, `instagramUrl`, `instagramHandle`
- `facebook`: `facebook`, `facebookUrl`, `facebookPage`
- `tiktok`: `tiktok`, `tikTok`, `tiktokUrl`, `tikTokUrl`

Se mantiene compatibilidad con empresas existentes: campos ausentes salen como string vacio en responses propias/admin/publicas.

## Endpoints afectados

- `POST /api/companies/register`
  - Persiste `phone`, `website`, `instagram`, `facebook` y `tiktok`.

- `GET /api/companies/me`
  - Devuelve `phone`, `website`, `instagram`, `facebook` y `tiktok`.

- `GET /api/internal/companies/pending`
  - Devuelve contactos ampliados para revision admin.

- `GET /api/public/services`
  - Incluye contactos publicos en `company`: `whatsapp`, `website`, `instagram`, `facebook`, `tiktok`.
  - No incluye `email`.

- `GET /api/public/companies/{slug}`
  - Incluye `whatsapp`, `website`, `instagram`, `facebook`, `tiktok`.
  - No incluye `email`.

## Archivos modificados

- `api/shared/validation.js`
- `api/companies-register/index.js`
- `api/companies-me/index.js`
- `api/shared/internalPending.js`
- `api/shared/publicCatalog.js`
- `docs/API_CONTRACTS_MVP.md`
- `tasks/TASK-140-HANDOFF.md`

## Verificacion ejecutada

- `node --check api/shared/validation.js`
- `node --check api/companies-register/index.js`
- `node --check api/companies-me/index.js`
- `node --check api/shared/internalPending.js`
- `node --check api/shared/publicCatalog.js`
- Script local con mocks para:
  - `POST /api/companies/register` con contactos nuevos persiste todos los campos;
  - `GET /api/companies/me` devuelve `phone`, `facebook` y `tiktok`;
  - `GET /api/public/services` no expone `email` y si expone contactos publicos;
  - `GET /api/public/companies/{slug}` no expone `email` y si expone `website`, `facebook` y `tiktok`.

## Riesgos o pendientes

- No se agrego validacion estricta de formato URL/red social para no bloquear aliases o handles usados por el formulario actual/futuro. Hoy se normaliza con `cleanText` y limites de longitud.
- No se cambio UI del formulario publico; Web Dev debe conectar estos campos en `TASK-141`.
- Si Product decide que algun contacto social no sea publico, hay que retirarlo de `publicCatalog`.

## Deploy

Requiere deploy antes de QA/Web Dev final porque cambia el contrato runtime de registro y responses publicas/internas.
