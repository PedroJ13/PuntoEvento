# TASK-340 HANDOFF - Infra Azure

## Resultado

Completado. Se desplego el fix Backend/API de unicidad de portada publicada y se reparo el dato puntual de Aurisbel sin borrar blobs ni entidades.

- Recurso Azure Static Web Apps: `puntoevento`
- Resource group: `resource_group_main`
- Dominio validado: `https://puntoeventocr.com`
- Branch desplegada: `main`
- Commit desplegado: `415961d77edcd5d76207702ef78b3a697da1a747`
- Mensaje commit: `Deploy service cover uniqueness fix`

## Archivos publicados

- `api/shared/internalModeration.js`
- `docs/API_CONTRACTS_MVP.md`

No se modificaron CORS, Blob Storage, app settings ni recursos Azure durante esta tarea.

## Evidencia de deploy

- Azure Static Web Apps environment `default` quedo en estado `Ready`.
- Endpoint publico `/api/public/services?limit=1` respondio `200`.
- Endpoint interno real `POST /api/internal/services/{companyId}/{serviceId}/approve` con IDs ficticios y sin credenciales respondio `401`, esperado.
- Smokes publicos basicos respondieron `200`.

## Smokes no destructivos

| URL | Resultado |
| --- | --- |
| `https://puntoeventocr.com/` | `200` |
| `https://puntoeventocr.com/panel.html` | `200` |
| `https://puntoeventocr.com/admin.html` | `200` |
| `https://puntoeventocr.com/proveedores/catering` | `200` |
| `https://puntoeventocr.com/san-jose` | `200` |
| `https://puntoeventocr.com/api/public/services?limit=1` | `200` |
| `POST /api/internal/services/company_dummy/service_dummy/approve` sin credenciales | `401` esperado |

## Data repair aplicado

Empresa auditada:

- Nombre publico: `Aurisbel Pasteleria`
- `companyId`: `company_3ef11610-54e6-44e8-84df-e4144ca563e8`

Servicio auditado:

- Nombre publico: `Queque personalizado de cumpleaños`
- `serviceId`: `service_ee421aa6-b409-4e55-ae6e-42a66411800f`
- Estado: `published`

Antes del repair:

- `Services.coverUrl`: presente.
- `Services.gallery`: 2 items.
- Uploads publicados del servicio: 8.
- Uploads `published` + `imageType=cover`: 3.
- Uploads `published` + `imageType=gallery`: 5.
- Solo 1 de los 3 uploads cover coincidia con `Services.coverUrl`.

Cambios aplicados:

- Se dejo como `cover` solo `upload_fc8189d5-b09d-42b1-b6f5-325962c61dee`, que corresponde a `Services.coverUrl`.
- Se demovieron a `imageType=gallery`:
  - `upload_3656784f-e024-4018-b89d-431a4a000696`
  - `upload_afbde69c-31ae-450b-a251-872b5cbc6ca7`
- Se reconstruyo `Services.gallery` como JSON valido desde los uploads publicados `gallery`, excluyendo `Services.coverUrl`.
- No se borraron blobs.
- No se borraron empresas, servicios ni uploads.
- No se aprobo/rechazo ningun servicio.

Despues del repair:

- Uploads publicados del servicio: 8.
- Uploads `published` + `imageType=cover`: 1.
- Uploads `published` + `imageType=gallery`: 7.
- `Services.gallery`: 7 items.
- El unico upload `cover` publicado coincide con `Services.coverUrl`.
- `Services.coverUrl` no queda duplicado dentro de `Services.gallery`.
- API publica muestra el servicio con portada presente y `galleryCount=7`.

Nota operativa: durante el primer merge de `Services.gallery`, Azure CLI dejo el campo como string JSON no parseable. Se reconstruyo inmediatamente desde `Uploads` publicados `gallery` y se verifico parseo correcto (`storedGalleryCount=7`).

## Checks previos al deploy

```text
node --check api/shared/internalModeration.js
node --check api/internal-services-approve/index.js
git diff --check -- api/shared/internalModeration.js docs/API_CONTRACTS_MVP.md
git diff --cached --check
```

Resultado: OK.

## Confirmacion Azure

- Se uso el Static Web App existente `puntoevento`.
- Azure Static Web Apps sigue asociado a `main`.
- No se crearon recursos Azure nuevos.
- Se consulto el inventario del resource group `resource_group_main`.
- No se ejecutaron comandos de creacion de recursos.

## Riesgos / warnings

- La verificacion funcional completa de aprobar una nueva portada queda para QA Azure.
- La reparacion fue puntual para el servicio indicado por Product; no se ejecuto cleanup masivo.
- No se imprimieron connection strings, SAS, tokens, cookies ni credenciales.

## QA puede iniciar

`TASK-341` puede iniciar QA Azure.

Validar especialmente:

- El servicio `Aurisbel / Queque personalizado de cumpleaños` muestra una sola portada activa.
- La galeria mantiene las imagenes publicadas esperadas.
- Al aprobar una nueva portada en otro flujo controlado, la portada anterior pasa a galeria y no queda otro upload `published cover` activo.

## Comandos usados

Secretos redactados/no impresos. No se pegaron tokens, cookies, SAS, connection strings, passwords, hashes de passwords ni emails reales completos.

```powershell
git rev-parse --show-toplevel
Get-Content chat-start/INFRA_AZURE.md
Get-Content AGENTS.md
Get-Content tasks/TASK-340-assignment.md
Get-Content tasks/TASK-339-HANDOFF.md
Get-Content docs/MVP_RELEASE_STATUS.md -TotalCount 150
git status --short -- api/shared/internalModeration.js docs/API_CONTRACTS_MVP.md
git diff --stat -- api/shared/internalModeration.js docs/API_CONTRACTS_MVP.md
git diff -- api/shared/internalModeration.js docs/API_CONTRACTS_MVP.md
git diff --check -- api/shared/internalModeration.js docs/API_CONTRACTS_MVP.md
node --check api/shared/internalModeration.js
node --check api/internal-services-approve/index.js
git add api/shared/internalModeration.js docs/API_CONTRACTS_MVP.md
git diff --cached --name-only
git diff --cached --stat
git diff --cached --check
git commit -m "Deploy service cover uniqueness fix"
git push origin main
az staticwebapp environment list --name puntoevento --resource-group resource_group_main --query "[?name=='default'].{status:status,lastUpdatedOn:lastUpdatedOn}" -o json
Invoke-WebRequest -Uri "https://puntoeventocr.com/" -UseBasicParsing -TimeoutSec 30
Invoke-WebRequest -Uri "https://puntoeventocr.com/panel.html" -UseBasicParsing -TimeoutSec 30
Invoke-WebRequest -Uri "https://puntoeventocr.com/admin.html" -UseBasicParsing -TimeoutSec 30
Invoke-WebRequest -Uri "https://puntoeventocr.com/proveedores/catering" -UseBasicParsing -TimeoutSec 30
Invoke-WebRequest -Uri "https://puntoeventocr.com/san-jose" -UseBasicParsing -TimeoutSec 30
Invoke-WebRequest -Uri "https://puntoeventocr.com/api/public/services?limit=1" -UseBasicParsing -TimeoutSec 30
Invoke-WebRequest -Uri "https://puntoeventocr.com/api/internal/services/company_dummy/service_dummy/approve" -Method POST -ContentType "application/json" -Body "{}" -UseBasicParsing -TimeoutSec 30
az resource list --resource-group resource_group_main --query "[].{name:name,type:type,location:location}" -o table
az staticwebapp appsettings list --name puntoevento --resource-group resource_group_main
az storage entity query --table-name Services --filter "<redacted-filter>"
az storage entity query --table-name Uploads --filter "<redacted-filter>"
az storage entity merge --table-name Uploads --entity "<redacted-entity>"
az storage entity merge --table-name Services --entity "<redacted-entity>"
```
