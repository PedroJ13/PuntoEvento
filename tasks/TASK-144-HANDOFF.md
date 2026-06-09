# TASK-144 Handoff

## Estado

Completado.

## Archivos modificados

- `admin.js`
- `admin.html`
- `admin.css`

## Cache busting final

- `admin.js`: `v=15` -> `v=16`
- `admin.css`: `v=9` -> `v=10`

`admin.css` solo se toco para eliminar una referencia CSS huerfana a `.internal-grid`, de modo que la validacion estatica de selectores viejos quede limpia.

## Cambios realizados

- `caseCompanyDetail()` ahora muestra, cuando existen:
  - `Email`
  - `WhatsApp`
  - `Telefono local` (`phone`)
  - `Instagram`
  - `Facebook`
  - `Sitio web` (`website`)
  - `TikTok`
  - `Zona` (`province`, `canton`)
- Se agregaron helpers para no renderizar ruido visual:
  - no imprime `undefined`;
  - no imprime `null`;
  - no imprime spans vacios ni guiones para campos ausentes;
  - no deja descripcion vacia como `<p></p>`.
- Se filtran valores que contengan patrones sensibles antes de renderizar:
  - `sig=`
  - `tokenHash`
  - `sessionHash`
  - `pendingBlobName`
  - `uploadUrl`

## Comportamiento preservado

- Las imagenes siguen dentro del servicio.
- No volvio el bloque global viejo de tres columnas.
- No volvio la columna separada de imagenes.
- No hay accion primaria separada para aprobar uploads.

## Validacion realizada

- PASS: `node --check admin.js`
- PASS: smoke local con `caseCompanyDetail()` ejecutado en VM:
  - renderiza email, WhatsApp, telefono local, Instagram, Facebook, sitio web, TikTok y zona cuando existen;
  - no imprime `undefined` ni `null`;
  - no imprime campos vacios como ruido visual;
  - filtra un website mock con `sig=secret`;
  - conserva zona cuando solo existe provincia.
- PASS: `rg` sobre `admin.html`, `admin.js`, `admin.css`:
  - no hay `.internal-grid`;
  - no hay `[data-internal-list="uploads"]`;
  - no hay `[data-case-uploads]`.
- PASS: `git diff --check -- admin.html admin.js admin.css`
  - solo warnings esperados de LF/CRLF en Windows.

## Riesgos / notas para Infra y QA

- No se hizo deploy desde esta tarea.
- QA puede hacer una revalidacion enfocada en Azure registrando una empresa con contactos ampliados y confirmando que `admin.js?v=16` muestra todos esos campos en el expediente.
- El cambio es frontend-only; depende de que el backend de TASK-140 siga devolviendo los campos en `GET /api/internal/companies/pending`.
