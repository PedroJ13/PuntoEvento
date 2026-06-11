# TASK-344 HANDOFF - Infra Azure

## Resultado

Completado. Se desplegaron a Azure los cambios Backend/API y Admin UI para moderacion separada de servicio e imagenes.

- Recurso Azure Static Web Apps: `puntoevento`
- Resource group: `resource_group_main`
- Dominio validado: `https://puntoeventocr.com`
- Branch desplegada: `main`
- Commit desplegado: `24d8df7a5cb90b5bd2b5acf1fe5e452c71112ea0`
- Mensaje commit: `Deploy separate service image moderation`

## Archivos publicados

- `api/shared/internalModeration.js`
- `docs/API_CONTRACTS_MVP.md`
- `admin.html`
- `admin.js`
- `admin.css`

No se modificaron CORS, Blob Storage, app settings ni datos productivos durante esta tarea.

## Assets/Admin publicados

- `https://puntoeventocr.com/admin.html` responde `200`.
- `admin.html` referencia `admin.css?v=15`.
- `admin.html` referencia `admin.js?v=23`.
- `admin.html` ya no referencia `admin.css?v=14`.
- `admin.html` ya no referencia `admin.js?v=22`.
- `https://puntoeventocr.com/admin.css?v=15` responde `200`.
- `https://puntoeventocr.com/admin.js?v=23` responde `200`.
- `admin.js?v=23` contiene acciones individuales:
  - `Aprobar imagen`
  - `Rechazar imagen`
  - `Imagen aprobada. Solo esta imagen cambio de estado.`
- `admin.js?v=23` no contiene el copy masivo `Aprobar servicio e imágenes`.
- `admin.css?v=15` contiene estilos `.image-actions`.

## Smokes no destructivos

| URL | Resultado |
| --- | --- |
| `https://puntoeventocr.com/` | `200` |
| `https://puntoeventocr.com/admin.html` | `200` |
| `https://puntoeventocr.com/panel.html` | `200` |
| `https://puntoeventocr.com/api/public/services?limit=1` | `200` |
| `POST /api/internal/services/company_dummy/service_dummy/approve` sin credenciales | `401` esperado |
| `POST /api/internal/uploads/company_dummy/upload_dummy/approve` sin credenciales | `401` esperado |

Los smokes internos usaron IDs ficticios y no incluyeron credenciales; no aprobaron ni rechazaron datos reales.

## Evidencia de deploy

- Azure Static Web Apps environment `default` quedo en estado `Ready`.
- API publica respondio `200`.
- Endpoints internos reales responden protegidos (`401`) sin credenciales.
- Admin UI sirve los assets nuevos.
- No se crearon recursos Azure nuevos.
- Se consulto inventario del resource group `resource_group_main`.

## Checks previos al deploy

```text
node --check admin.js
node --check api/shared/internalModeration.js
node --check api/shared/serviceUploadRules.js
git diff --check -- admin.html admin.js admin.css api/shared/internalModeration.js docs/API_CONTRACTS_MVP.md
git diff --cached --check
```

Resultado: OK.

## Riesgos / warnings

- No se ejecuto flujo autenticado de moderacion para evitar aprobar/rechazar datos reales.
- La validacion funcional real queda para QA Azure.
- No se hizo data repair, segun alcance de la tarea.

## QA puede iniciar

`TASK-345` puede iniciar QA Azure.

Validar especialmente:

- Aprobar servicio no publica imagenes pendientes.
- Aprobar imagen publica solo esa imagen.
- Rechazar imagen rechaza solo esa imagen.
- Aprobar portada reemplaza la portada activa y conserva la anterior segun regla Backend/API.
- Servicio ya publicado con nuevas imagenes pendientes aparece en expediente y permite moderacion individual.
- No hay accion masiva accidental.

## Comandos usados

Secretos redactados/no impresos. No se pegaron tokens, cookies, SAS, connection strings, passwords, hashes de passwords ni emails reales completos.

```powershell
git rev-parse --show-toplevel
Get-Content chat-start/INFRA_AZURE.md
Get-Content AGENTS.md
Get-Content tasks/TASK-344-assignment.md
Get-Content tasks/TASK-342-HANDOFF.md
Get-Content tasks/TASK-343-HANDOFF.md
Get-Content docs/MVP_RELEASE_STATUS.md -TotalCount 170
git status --short
git diff --stat -- admin.html admin.js admin.css api/shared/internalModeration.js docs/API_CONTRACTS_MVP.md
git diff -- admin.html admin.js admin.css api/shared/internalModeration.js docs/API_CONTRACTS_MVP.md
git diff --check -- admin.html admin.js admin.css api/shared/internalModeration.js docs/API_CONTRACTS_MVP.md
node --check admin.js
node --check api/shared/internalModeration.js
node --check api/shared/serviceUploadRules.js
Select-String -Path admin.html -Pattern "admin.css|admin.js" -Context 0,0
git add admin.html admin.js admin.css api/shared/internalModeration.js docs/API_CONTRACTS_MVP.md
git diff --cached --name-only
git diff --cached --stat
git diff --cached --check
git commit -m "Deploy separate service image moderation"
git push origin main
az staticwebapp environment list --name puntoevento --resource-group resource_group_main --query "[?name=='default'].{status:status,lastUpdatedOn:lastUpdatedOn}" -o json
Invoke-WebRequest -Uri "https://puntoeventocr.com/" -UseBasicParsing -TimeoutSec 30
Invoke-WebRequest -Uri "https://puntoeventocr.com/admin.html" -UseBasicParsing -TimeoutSec 30
Invoke-WebRequest -Uri "https://puntoeventocr.com/panel.html" -UseBasicParsing -TimeoutSec 30
Invoke-WebRequest -Uri "https://puntoeventocr.com/api/public/services?limit=1" -UseBasicParsing -TimeoutSec 30
Invoke-WebRequest -Uri "https://puntoeventocr.com/admin.js?v=23" -UseBasicParsing -TimeoutSec 30
Invoke-WebRequest -Uri "https://puntoeventocr.com/admin.css?v=15" -UseBasicParsing -TimeoutSec 30
Invoke-WebRequest -Uri "https://puntoeventocr.com/api/internal/services/company_dummy/service_dummy/approve" -Method POST -ContentType "application/json" -Body "{}" -UseBasicParsing -TimeoutSec 30
Invoke-WebRequest -Uri "https://puntoeventocr.com/api/internal/uploads/company_dummy/upload_dummy/approve" -Method POST -ContentType "application/json" -Body "{}" -UseBasicParsing -TimeoutSec 30
az resource list --resource-group resource_group_main --query "[].{name:name,type:type,location:location}" -o table
git rev-parse HEAD
```
