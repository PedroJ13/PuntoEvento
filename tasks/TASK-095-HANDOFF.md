# TASK-095 Handoff - QA Azure listados internos de moderacion

## Resultado general

Requiere cambios.

Los tres endpoints estan desplegados en Azure y funcionan con credencial admin valida, pero el caso requerido de metodo no permitido falla:

```text
POST /api/internal/companies/pending -> 404, esperado 405
POST /api/internal/services/pending -> 404, esperado 405
POST /api/internal/uploads/pending -> 404, esperado 405
```

El resto del alcance paso:

- Sin credencial admin: `401`.
- Credencial admin invalida: `401`.
- Credencial admin valida: `200`.
- Respuesta con objeto `{ items }`.
- `items` es array.
- Datos reales validables disponibles para Companies, Services y Uploads.
- No se observaron campos prohibidos en JSON.

## Ambiente

- Base URL: `https://zealous-field-08fdd720f.7.azurestaticapps.net`
- Deploy/commit exacto: no identificable desde la respuesta HTTP.
- Evidencia de deploy: los tres endpoints responden `401` sin credencial y `200` con credencial valida.

## Casos por endpoint

| Endpoint | Sin credencial | Credencial invalida | POST | Credencial valida | Shape | Campos prohibidos |
| --- | --- | --- | --- | --- | --- | --- |
| `/api/internal/companies/pending` | PASS `401` | PASS `401` | FAIL `404` | PASS `200` | PASS | PASS |
| `/api/internal/services/pending` | PASS `401` | PASS `401` | FAIL `404` | PASS `200` | PASS | PASS |
| `/api/internal/uploads/pending` | PASS `401` | PASS `401` | FAIL `404` | PASS `200` | PASS | PASS |

## Datos reales validados

No fue necesario crear datos QA nuevos para esta tarea porque Azure ya tenia pendientes.

Counts observados:

- Companies pendientes: 4.
- Services revisables: 3.
- Uploads pendientes: 6.

Muestras saneadas:

- Company: `company_72bca9dd-08d9-4824-974d-ac0d4ee8a05d`, slug `qa-task-092-empresa-20260529132722`, `status=pending`.
- Service: `service_1f8d9895-5006-480a-9ef2-c480db2caedc`, company `company_c0f05305-6b1d-4ba0-b4c2-cd987c324bd2`, `status=draft`.
- Upload: `upload_5933778d-14d9-4618-bab2-2a432b3c015a`, company `company_72bca9dd-08d9-4824-974d-ac0d4ee8a05d`, `status=pending`, `scope=service`, `imageType=cover`.

Validaciones sobre items:

- Companies: todos los samples tienen `status=pending` y usan `companyId`.
- Services: todos los samples tienen `status=draft` o `pending`, usan `companyId` y `serviceId`, y `eventTypes`/`gallery` son arrays.
- Services: `companyName` y `companySlug` estan presentes en los samples.
- Uploads: todos los samples tienen `status=pending` y usan `companyId`/`uploadId`.

## Campos prohibidos

PASS: no aparecieron en las respuestas JSON:

- `tokenHash`
- `sessionHash`
- `pendingBlobName`
- `pendingBlobUrl`
- `uploadUrl`
- `sig=`
- `AccountKey`
- `connectionString`
- `partitionKey`
- `rowKey`
- `cookie`
- `pe_company_session`

No se pegaron credenciales admin, cookies, tokens, URL de invitacion ni SAS en este handoff.

## Comandos ejecutados

Se ejecuto un script Node local contra Azure real usando credencial admin local de QA, sin imprimir secretos.

Validaciones incluidas:

- GET sin credencial.
- GET con credencial invalida.
- POST con credencial valida.
- GET con credencial valida.
- Shape `{ items: [] }`.
- Validacion de samples reales.
- Busqueda de campos prohibidos en JSON.

## Analisis del fallo

El handler en `api/shared/internalPending.js` devuelve `405` para metodos distintos de `GET`, pero Azure no invoca el handler para `POST` porque cada `function.json` registra solo:

```json
"methods": ["get"]
```

Por eso Azure Functions responde `404` para `POST` antes de llegar al codigo que retorna `405`.

## Riesgos pendientes

- Mientras `POST` devuelva `404`, TASK-095 no cumple el contrato QA solicitado.
- El flujo funcional de lectura si esta usable para Web Dev desde `GET`, pero el gate QA queda abierto por status code.
- Los listados incluyen datos reales pendientes de QA previas; conviene definir politica de limpieza de datos QA cuando Product/Architect lo considere.
- Uploads pendientes siguen sin preview visual; si admin necesita preview, debe ser por endpoint interno autenticado sin exponer SAS ni `pendingBlobUrl`.

## Recomendacion

Requiere Backend/API antes de aprobar TASK-095 completamente.

Cambio recomendado:

- Ajustar los `function.json` de los tres endpoints para que Azure enrute tambien metodos no GET esperados hacia el handler, permitiendo que `internalPending.js` responda `405`.

Despues del ajuste y deploy, repetir solo el smoke de metodos:

- `POST /api/internal/companies/pending`
- `POST /api/internal/services/pending`
- `POST /api/internal/uploads/pending`

Si Product/Architect acepta `404` como comportamiento suficiente para metodos no permitidos en Azure Functions, los endpoints quedan listos para que Web Dev conecte `admin.html`; si no, mantener bloqueo Backend/API.
