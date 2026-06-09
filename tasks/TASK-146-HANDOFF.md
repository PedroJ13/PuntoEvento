# TASK-146 - QA Azure enfocada admin contactos

## Resultado

Aprobado con observacion menor.

Azure ya sirve el fix de admin contactos (`admin.js?v=16`, `admin.css?v=10`) y el expediente de empresa muestra los contactos ampliados que antes faltaban. No quedan P0/P1 abiertos en el alcance de esta QA enfocada.

Observacion menor: Chromium reporto un `404` de recurso no bloqueante durante la carga del admin, consistente con corridas anteriores. No afecto login, render del expediente ni acciones internas.

## Ambiente probado

- Azure: `https://zealous-field-08fdd720f.7.azurestaticapps.net`
- Admin interno: `/admin.html`
- Registro publico: `/index.html#empresas`
- Fecha local: 2026-05-30
- Navegador: Chromium headless con Playwright
- Admin auth: `local-secrets/qa-admin.ps1`, sin imprimir valores

## Versiones servidas

| Asset | Esperado | Observado |
| --- | --- | --- |
| `/admin.html` -> `admin.js` | `v=16` | PASS |
| `/admin.html` -> `admin.css` | `v=10` | PASS |

Validacion adicional:

```text
adminHtmlHasOldSelectors=false
```

## Datos QA usados

Empresa principal de validacion:

- Company: `company_18e53c66-e430-49fd-be3d-fb824692c065`
- Slug: `qa-task-146-contactos-20260530211757`
- Email QA: `qa-task-146-20260530211757@example.test`
- WhatsApp: `50688881460`
- Telefono local: `50622221460`
- Provincia: `San Jose`
- Canton: `Canton QA 20260530211757`
- Instagram: `https://instagram.com/qatask14620260530211757`
- Facebook: `https://facebook.com/qatask14620260530211757`
- Website: `https://qatask14620260530211757.example.test`
- TikTok: `https://tiktok.com/@qatask14620260530211757`

Empresa auxiliar creada durante ajuste del script y limpiada:

- Company: `company_57e49346-3e07-4f95-8187-1abd72c41e20`
- Slug: `qa-task-146-contactos-20260530211623`

## Registro y API interna

Registro publico:

```text
provinceIsSelect=true
POST /api/companies/register=201
consoleErrors=0
```

API interna:

```text
GET /api/internal/companies/pending=200
pendingCount=4
found=true
email=presente
whatsapp=presente
phone=presente
instagram=presente
facebook=presente
website=presente
tiktok=presente
province=presente
canton=presente
```

## Admin expediente

Campos visibles en `[data-case-detail]` para la empresa QA:

```text
email=true
whatsapp=true
phone=true
instagram=true
facebook=true
website=true
tiktok=true
province=true
canton=true
```

Labels esperados:

```text
Telefono local=true
Sitio web=true
TikTok=true
Zona=true
```

Ruido visual:

```text
hasUndefined=false
hasNull=false
```

Elementos viejos:

```text
oldGlobalGridCount=0
oldGlobalUploadListCount=0
caseUploadsColumnCount=0
```

Patrones sensibles en DOM:

```text
sensitiveInDom=false
```

Patrones revisados:

- `sig=`
- `tokenHash`
- `sessionHash`
- `pendingBlobName`
- `uploadUrl`

## Limpieza soft

- Empresa principal rechazada via admin API: `200`
- Empresa auxiliar rechazada via admin API: `200`

No se hizo hard delete.

## Bugs encontrados

No se encontraron bugs P0/P1 en el alcance de TASK-146.

Observacion menor:

- `404` no bloqueante en consola durante la carga de admin. No impacto la validacion funcional.

## Recomendacion para Product / Architect / Release

Dar por cerrada la QA enfocada del fix de contactos admin y actualizar `docs/MVP_RELEASE_STATUS.md` para mover TASK-146 a hecho. El siguiente paso recomendado es avisar al Product Owner que ya puede hacer la re-prueba, manteniendo como observacion aceptable el `404` no bloqueante si no corresponde a un asset visible del flujo MVP.
