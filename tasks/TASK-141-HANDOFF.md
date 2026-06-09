# TASK-141 Handoff

## Estado

Completado.

## Archivos modificados

- `app.js`
- `index.html`

No se modifico `styles.css`.

## Cache busting

- `app.js`: `v=22` -> `v=23`
- `styles.css` queda en `v=17`.

## Campos agregados / ajustados

En el formulario publico `#empresas`:

- `province` ahora es `<select>`.
- Se agregaron campos opcionales:
  - `phone` / Telefono local
  - `instagram`
  - `facebook`
  - `website` / Pagina web
  - `tiktok`
- Se mantienen:
  - `companyName`
  - `whatsapp`
  - `email`
  - `canton`
  - `description`
  - `terms`

## Provincias

Se centralizo `PROVINCE_OPTIONS` en `app.js` y se usa en:

- filtro de home `#location`;
- filtro de bodas `name="province"`;
- registro empresa `name="province"`.

Lista:

- `San Jose`
- `Alajuela`
- `Cartago`
- `Heredia`
- `Guanacaste`
- `Puntarenas`
- `Limon`

## Payload final a `POST /api/companies/register`

```json
{
  "companyName": "...",
  "email": "...",
  "whatsapp": "...",
  "phone": "...",
  "website": "...",
  "instagram": "...",
  "facebook": "...",
  "tiktok": "...",
  "province": "...",
  "canton": "...",
  "description": "..."
}
```

## Verificacion ejecutada

- PASS: `node --check app.js`
- PASS: smoke estructural con Node:
  - `province` en el registro es `<select>`;
  - las 7 provincias estan en `PROVINCE_OPTIONS`;
  - filtros publicos y registro usan `provinceOptionsMarkup()`;
  - existen campos `phone`, `instagram`, `facebook`, `website`, `tiktok`;
  - payload incluye `phone`, `website`, `instagram`, `facebook`, `tiktok`;
  - cache busting de `index.html` apunta a `app.js?v=23`.

## Riesgos o pendientes

- No se pudo ejecutar smoke visual desktop/mobile con navegador embebido porque la sesion reporto `No active Codex browser pane available`.
- No se cambio backend; depende del deploy de TASK-140 para persistir los campos nuevos.
- No se agrego validacion estricta de URL/handles para redes sociales, alineado con TASK-140.

## Deploy

Requiere deploy de `index.html` y `app.js`. Backend de TASK-140 debe estar desplegado para QA completo de persistencia.
