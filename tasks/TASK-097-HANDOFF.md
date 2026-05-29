# TASK-097 Handoff - Re-smoke Azure listados internos de moderacion

## Resultado general

Aprobado.

Revalidado nuevamente contra Azure real el `2026-05-29T15:58:38Z` con resultado PASS.

El fallo de TASK-095 quedo corregido en Azure:

```text
POST /api/internal/companies/pending -> 405
POST /api/internal/services/pending -> 405
POST /api/internal/uploads/pending -> 405
```

Tambien se confirmo el smoke minimo de seguridad/shape:

- `GET` sin credencial admin responde `401`.
- `GET` con credencial admin valida responde `200`.
- La respuesta es objeto con `items`.
- `items` es array.
- No aparecen campos prohibidos en JSON.

## Ambiente

- Base URL: `https://zealous-field-08fdd720f.7.azurestaticapps.net`
- Commit/deploy exacto: no identificable desde respuestas HTTP.
- Evidencia de deploy TASK-096: `POST` ya enruta al handler y responde `405`, no `404`.

## Casos ejecutados

| Endpoint | POST esperado 405 | GET sin credencial | GET con credencial valida | Shape | Campos prohibidos |
| --- | --- | --- | --- | --- | --- |
| `/api/internal/companies/pending` | PASS `405` | PASS `401` | PASS `200` | PASS | PASS |
| `/api/internal/services/pending` | PASS `405` | PASS `401` | PASS `200` | PASS | PASS |
| `/api/internal/uploads/pending` | PASS `405` | PASS `401` | PASS `200` | PASS | PASS |

## Datos observados

No se crearon datos QA nuevos. Azure ya tenia items pendientes.

Counts observados:

- Companies pendientes: 4.
- Services revisables: 3.
- Uploads pendientes: 6.

Muestras saneadas:

- Company: `company_72bca9dd-08d9-4824-974d-ac0d4ee8a05d`, slug `qa-task-092-empresa-20260529132722`, `status=pending`.
- Service: `service_1f8d9895-5006-480a-9ef2-c480db2caedc`, company `company_c0f05305-6b1d-4ba0-b4c2-cd987c324bd2`, slug `qa-patch-duplicate-20260528-20260528-090858`, `status=draft`.
- Upload: `upload_5933778d-14d9-4618-bab2-2a432b3c015a`, company `company_72bca9dd-08d9-4824-974d-ac0d4ee8a05d`, `status=pending`, `scope=service`, `imageType=cover`.

Validaciones adicionales en sample de services:

- `eventTypes` es array.
- `gallery` es array.

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

No se pegaron credenciales admin, cookies, tokens, URL de invitacion ni SAS.

## Comandos ejecutados

Se ejecuto un script Node local contra Azure real usando la credencial admin local de QA sin imprimir secretos.

Validaciones incluidas:

- `POST` con credencial admin valida.
- `GET` sin credencial.
- `GET` con credencial admin valida.
- Shape `{ items: [] }`.
- Busqueda de campos prohibidos.
- Muestras saneadas de datos reales.

## Riesgos pendientes

- Otros metodos no incluidos en `function.json` pueden seguir respondiendo `404`; TASK-097 solo cubre el smoke requerido con `POST`.
- Los listados contienen datos QA pendientes de tareas anteriores; conviene definir politica de limpieza cuando Product/Architect lo considere.
- Uploads pendientes siguen sin preview visual; si admin requiere preview, debe implementarse con endpoint interno autenticado sin exponer SAS ni `pendingBlobUrl`.

## Recomendacion

Listo para que Web Dev conecte la pestana `Modelo nuevo` de `admin.html` a estos listados reales.

No requiere Backend/API adicional para el bloqueo detectado en TASK-095.
