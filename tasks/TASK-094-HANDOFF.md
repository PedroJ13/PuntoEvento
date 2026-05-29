# TASK-094 Handoff - QA local/estructural listados internos de moderacion

## Resultado general

Aprobado.

Los tres endpoints internos de listado pasan QA local/estructural para el alcance de TASK-094:

```text
GET /api/internal/companies/pending
GET /api/internal/services/pending
GET /api/internal/uploads/pending
```

No se encontraron bugs P0/P1. No se modifico implementacion.

## Archivos revisados

- `AGENTS.md`
- `chat-start/QA.md`
- `docs/API_CONTRACTS_MVP.md`
- `docs/BACKLOG.md`
- `docs/MVP_RELEASE_STATUS.md`
- `tasks/TASK-093-HANDOFF.md`
- `api/shared/internalPending.js`
- `api/shared/adminAuth.js`
- `api/shared/guard.js`
- `api/internal-companies-pending/function.json`
- `api/internal-companies-pending/index.js`
- `api/internal-services-pending/function.json`
- `api/internal-services-pending/index.js`
- `api/internal-uploads-pending/function.json`
- `api/internal-uploads-pending/index.js`

## Archivos modificados

- `tasks/TASK-094-HANDOFF.md`

## Casos ejecutados

| Caso | Resultado | Nota |
| --- | --- | --- |
| `function.json` companies | PASS | `authLevel=anonymous`, metodo `get`, ruta `internal/companies/pending`. |
| `function.json` services | PASS | `authLevel=anonymous`, metodo `get`, ruta `internal/services/pending`. |
| `function.json` uploads | PASS | `authLevel=anonymous`, metodo `get`, ruta `internal/uploads/pending`. |
| Sintaxis `internalPending.js` | PASS | `node --check` OK. |
| Sintaxis indexes | PASS | `node --check` OK en los tres endpoints. |
| JSON de function files | PASS | `ConvertFrom-Json` OK por archivo. |
| Auth sin credencial | PASS | Los tres handlers devuelven `401`. |
| Auth invalida | PASS | Los tres handlers devuelven `401`. |
| Metodo no GET | PASS | Los tres handlers devuelven `405`. |
| Companies pendientes | PASS | Lista solo `status=pending` y usa `companyId`. |
| Services revisables | PASS | Lista solo `draft` y `pending`. |
| Services arrays | PASS | `eventTypes` y `gallery` salen como arrays desde JSON string o CSV. |
| Services enrichment | PASS | Agrega `companyName` y `companySlug` cuando existe empresa. |
| Uploads pendientes | PASS | Lista solo `status=pending` y usa `uploadId`. |
| Campos prohibidos | PASS | No aparecen en payloads mockeados. |

## Comandos ejecutados

```powershell
C:\Users\pj13e\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe --check api/shared/internalPending.js
C:\Users\pj13e\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe --check api/internal-companies-pending/index.js
C:\Users\pj13e\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe --check api/internal-services-pending/index.js
C:\Users\pj13e\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe --check api/internal-uploads-pending/index.js
Get-Content -Raw api/internal-companies-pending/function.json | ConvertFrom-Json
Get-Content -Raw api/internal-services-pending/function.json | ConvertFrom-Json
Get-Content -Raw api/internal-uploads-pending/function.json | ConvertFrom-Json
```

Tambien se ejecuto un harness Node local con mocks de Table Storage para validar auth, metodo, filtros, shape de payload, parseo de arrays, enriquecimiento y campos prohibidos.

## Confirmacion de campos prohibidos

PASS: las respuestas mockeadas no incluyeron:

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

Los IDs se exponen con nombres seguros:

- `companyId`
- `serviceId`
- `uploadId`

## Riesgos pendientes

- No se probo Azure real ni emulador de Table Storage; esta tarea fue local/estructural con mocks.
- Los listados dependen de queries por estado en Table Storage. Para MVP esta bien, pero si aumenta el volumen conviene evaluar indices/materializacion para moderacion.
- `services` devuelve `coverUrl` y `gallery` porque forman parte del contrato de moderacion. El flujo actual no deberia guardar SAS ahi, pero si datos corruptos llegaran a esos campos, el endpoint los expondria. Mantener validacion de escritura y aprobacion como control.
- Uploads pendientes no tienen preview visual. Si admin necesita ver la imagen, debe hacerse con endpoint interno autenticado que no exponga SAS ni `pendingBlobUrl`.

## Recomendacion

Listo para commit/push y QA Azure de los endpoints internos.

Despues de deploy, Web Dev puede conectar la pestana `Modelo nuevo` de `admin.html` a estos listados reales y QA debe validar la UI contra Azure.
