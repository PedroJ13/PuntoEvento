# TASK-355 HANDOFF - Infra Azure

## Resumen

Cleanup no destructivo completado para datos QA de visibilidad publica creados en `TASK-350` y `TASK-354`.

No hubo cambios de codigo, app settings, infraestructura, CORS, Blob Storage ni secretos. No se borraron blobs ni entidades.

## Empresa auditada

- Empresa: `Aurisbel Pasteleria`
- Company ID: `company_3ef11610-54e6-44e8-84df-e4144ca563e8`
- Company slug publico: `aurisbel-pasteleria-341388`

## Servicios afectados

| Servicio | Service ID | Estado antes | Estado despues | Uploads |
| --- | --- | --- | --- | --- |
| `QA TASK-350 visibilidad 20260611T232139` | `service_3d11028a-136c-4cda-9a23-ef90eeef29a4` | `published` | `rejected` | 3 |
| `QA TASK-354 cascada 20260612001016` | `service_53616c74-c6c6-4147-b8df-82c39d4376f7` | `published` | `rejected` | 3 |

## Uploads afectados

### TASK-350

| Upload ID | Estado antes | Estado despues | Tipo |
| --- | --- | --- | --- |
| `upload_33a99657-2ddc-4247-ba75-d05a26b9bae0` | `rejected` | `rejected` | gallery |
| `upload_ac1ba44e-e7d1-4902-858a-a07dd3755aa0` | `published` | `rejected` | gallery |
| `upload_cd93252c-7433-4a4a-bede-556a691b316d` | `published` | `rejected` | cover |

### TASK-354

| Upload ID | Estado antes | Estado despues | Tipo |
| --- | --- | --- | --- |
| `upload_4114f313-d8e4-4915-89fe-d5343a7b2f6e` | `rejected` | `rejected` | cover |
| `upload_4fc5e4b2-c76b-448f-9837-3be9528bba7a` | `rejected` | `rejected` | gallery |
| `upload_f6826e88-80b6-4f07-bf89-04990f4caaee` | `rejected` | `rejected` | cover |

## Cambios aplicados

- Los 2 servicios QA quedaron en `rejected`.
- Los 6 uploads asociados quedaron en `rejected`.
- Se agrego razon operativa de rechazo para identificar `TASK-355`.
- No se tocaron servicios reales de Aurisbel.
- No se borraron blobs.
- No se borraron entidades de Table Storage.
- No se limpiaron `publicBlobUrl` / `publicBlobName`; quedan como trazabilidad operativa.

## Confirmacion posterior

Azure Table Storage:

- `QA TASK-350 visibilidad 20260611T232139`: servicio `rejected`, uploads `rejected:3`.
- `QA TASK-354 cascada 20260612001016`: servicio `rejected`, uploads `rejected:3`.

Catalogo publico:

- `GET https://puntoeventocr.com/api/public/services?limit=50` -> 3 servicios publicos.
- `GET https://puntoeventocr.com/api/public/services?limit=50&q=QA%20TASK-350` -> 0 servicios.
- `GET https://puntoeventocr.com/api/public/services?limit=50&q=QA%20TASK-354` -> 0 servicios.
- Los service IDs QA no aparecen en el listado publico general.

Perfil publico:

- `GET https://puntoeventocr.com/api/public/companies/aurisbel-pasteleria-341388` -> 200.
- El perfil mantiene 3 servicios publicos reales.
- Los service IDs QA no aparecen en el perfil publico.

## Smokes publicos

- `GET https://puntoeventocr.com/` -> 200
- `GET https://puntoeventocr.com/admin.html` -> 200
- `GET https://puntoeventocr.com/panel.html` -> 200
- `GET https://puntoeventocr.com/api/public/services?limit=50` -> 200
- `GET https://puntoeventocr.com/api/public/companies/aurisbel-pasteleria-341388` -> 200

## Comandos usados

Secretos y connection strings fueron cargados en variables locales y no se imprimieron.

```powershell
git rev-parse --show-toplevel
Get-Content AGENTS.md
Get-Content chat-start/INFRA_AZURE.md
Get-Content docs/MVP_RELEASE_STATUS.md
Get-Content tasks/TASK-355-assignment.md
Get-Content tasks/TASK-354-HANDOFF.md
Get-Content tasks/TASK-350-HANDOFF.md
rg -n "QA TASK-35[04]|service_|upload_|company_" tasks/TASK-350-HANDOFF.md tasks/TASK-354-HANDOFF.md
git status --short
az staticwebapp appsettings list --name puntoevento --resource-group resource_group_main -o json
az storage entity query --table-name Services --connection-string <REDACTED> --filter "PartitionKey eq '<companyId>'" -o json
az storage entity query --table-name Uploads --connection-string <REDACTED> --filter "PartitionKey eq '<companyId>' and serviceId eq '<serviceId>' and scope eq 'service'" -o json
az storage entity merge --table-name Services --connection-string <REDACTED> --entity "PartitionKey=<companyId>" "RowKey=<serviceId>" "status=rejected" "rejectionReason=<REDACTED_OPERATIONAL_REASON>" "updatedAt=<UTC_TIMESTAMP>" --output none
az storage entity merge --table-name Uploads --connection-string <REDACTED> --entity "PartitionKey=<companyId>" "RowKey=<uploadId>" "status=rejected" "rejectionReason=<REDACTED_OPERATIONAL_REASON>" "updatedAt=<UTC_TIMESTAMP>" --output none
Invoke-RestMethod -Uri "https://puntoeventocr.com/api/public/services?limit=50" -TimeoutSec 30
Invoke-RestMethod -Uri "https://puntoeventocr.com/api/public/services?limit=50&q=QA%20TASK-350" -TimeoutSec 30
Invoke-RestMethod -Uri "https://puntoeventocr.com/api/public/services?limit=50&q=QA%20TASK-354" -TimeoutSec 30
Invoke-RestMethod -Uri "https://puntoeventocr.com/api/public/companies/aurisbel-pasteleria-341388" -TimeoutSec 30
Invoke-WebRequest -Uri "https://puntoeventocr.com/" -Method Get -TimeoutSec 30 -UseBasicParsing
Invoke-WebRequest -Uri "https://puntoeventocr.com/admin.html" -Method Get -TimeoutSec 30 -UseBasicParsing
Invoke-WebRequest -Uri "https://puntoeventocr.com/panel.html" -Method Get -TimeoutSec 30 -UseBasicParsing
Invoke-WebRequest -Uri "https://puntoeventocr.com/api/public/services?limit=50" -Method Get -TimeoutSec 30 -UseBasicParsing
Invoke-WebRequest -Uri "https://puntoeventocr.com/api/public/companies/aurisbel-pasteleria-341388" -Method Get -TimeoutSec 30 -UseBasicParsing
```

## Riesgos / pendientes

- Los blobs fisicos quedan en storage por diseno del cleanup no destructivo.
- Los campos de trazabilidad de uploads publicados previamente pueden seguir conservando `publicBlobUrl` / `publicBlobName`, pero no cuentan como publicos porque `Uploads.status=rejected`.
- Si Release quiere borrado fisico futuro, debe salir como tarea separada con confirmacion explicita y criterio de retencion.
- El repositorio local ya tenia cambios no relacionados antes de esta tarea; esta entrega solo agrega este handoff.
