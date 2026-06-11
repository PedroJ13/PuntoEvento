# TASK-346 HANDOFF - Infra Azure

## Resumen

Cleanup no destructivo completado para el servicio QA dejado publico por TASK-345.

No hubo cambios de codigo, configuracion, app settings, recursos Azure ni pipeline. No se borraron blobs ni entidades.

## Entidades auditadas

- Empresa: `Aurisbel Pasteleria`
- Company ID: `company_3ef11610-54e6-44e8-84df-e4144ca563e8`
- Company slug publico: `aurisbel-pasteleria-341388`
- Servicio: `QA TASK-345 moderacion 20260611T220445`
- Service ID: `service_4f87fe02-6c90-4a2b-9bee-b9df791e89f5`

## Estado antes

- Servicio: `published`
- Uploads asociados al servicio: 5
- Uploads por estado:
  - `published`: 3
  - `rejected`: 2
- Uploads auditados:
  - `upload_729c1ebe-df0b-46cb-b341-4aade20bea4f`: `rejected`, gallery
  - `upload_7ade0501-daf5-4065-80e0-51fd3191e058`: `published`, gallery
  - `upload_7d66ee79-ba85-43ae-b29e-50907f556d5a`: `published`, gallery
  - `upload_93b9879f-53ad-4742-bb48-11ebc77e887d`: `rejected`, gallery
  - `upload_c9b30dfe-3510-4273-81d5-59a1aa205a79`: `published`, cover

## Cambios aplicados

- Servicio `service_4f87fe02-6c90-4a2b-9bee-b9df791e89f5` actualizado a `rejected`.
- Los 5 uploads asociados al servicio quedaron en `rejected`.
- Se agrego razon operativa de rechazo para identificar el cleanup TASK-346.
- No se tocaron servicios reales de Aurisbel.
- No se eliminaron blobs.
- No se eliminaron entidades de Table Storage.

## Estado despues

- Servicio: `rejected`
- Uploads asociados al servicio: 5
- Uploads por estado:
  - `rejected`: 5
  - `published`: 0

## Confirmacion publica

- `GET https://puntoeventocr.com/api/public/services?limit=50&q=QA%20TASK-345`
  - No devuelve el servicio QA por `id` ni por nombre.
- `GET https://puntoeventocr.com/api/public/companies/aurisbel-pasteleria-341388`
  - Responde 200.
  - No incluye el servicio QA en `services`.
  - Mantiene 3 servicios publicos reales para la empresa.

## Smokes Azure

- `GET https://puntoeventocr.com/` -> 200
- `GET https://puntoeventocr.com/panel.html` -> 200
- `GET https://puntoeventocr.com/admin.html` -> 200
- `GET https://puntoeventocr.com/api/public/services?limit=1` -> 200
- `GET https://puntoeventocr.com/api/public/companies/aurisbel-pasteleria-341388` -> 200

## Comandos usados

Secretos y connection strings fueron cargados en variables locales y no se imprimieron.

```powershell
git rev-parse --show-toplevel
Get-Content chat-start/INFRA_AZURE.md
Get-Content AGENTS.md
Get-Content tasks/TASK-346-assignment.md
Get-Content tasks/TASK-345-HANDOFF.md
Get-Content docs/MVP_RELEASE_STATUS.md -TotalCount 180
git status --short
az staticwebapp appsettings list --name puntoevento --resource-group resource_group_main -o json
az storage entity query --table-name Services --connection-string <REDACTED> --filter "PartitionKey eq '<companyId>' and RowKey eq '<serviceId>'" -o json
az storage entity query --table-name Uploads --connection-string <REDACTED> --filter "PartitionKey eq '<companyId>' and serviceId eq '<serviceId>' and scope eq 'service'" -o json
az storage entity merge --table-name Services --connection-string <REDACTED> --entity "PartitionKey=<companyId>" "RowKey=<serviceId>" "status=rejected" "rejectionReason=<REDACTED_OPERATIONAL_REASON>" "updatedAt=<UTC_TIMESTAMP>" --output none
az storage entity merge --table-name Uploads --connection-string <REDACTED> --entity "PartitionKey=<companyId>" "RowKey=<uploadId>" "status=rejected" "rejectionReason=<REDACTED_OPERATIONAL_REASON>" "updatedAt=<UTC_TIMESTAMP>" --output none
Invoke-RestMethod -Uri "https://puntoeventocr.com/api/public/services?limit=50&q=QA%20TASK-345" -TimeoutSec 30
Invoke-RestMethod -Uri "https://puntoeventocr.com/api/public/companies/aurisbel-pasteleria-341388" -TimeoutSec 30
Invoke-WebRequest -Uri "https://puntoeventocr.com/" -Method Get -TimeoutSec 30 -UseBasicParsing
Invoke-WebRequest -Uri "https://puntoeventocr.com/panel.html" -Method Get -TimeoutSec 30 -UseBasicParsing
Invoke-WebRequest -Uri "https://puntoeventocr.com/admin.html" -Method Get -TimeoutSec 30 -UseBasicParsing
Invoke-WebRequest -Uri "https://puntoeventocr.com/api/public/services?limit=1" -Method Get -TimeoutSec 30 -UseBasicParsing
Invoke-WebRequest -Uri "https://puntoeventocr.com/api/public/companies/aurisbel-pasteleria-341388" -Method Get -TimeoutSec 30 -UseBasicParsing
```

## Riesgos / pendientes

- Los blobs fisicos quedan en storage por diseno del cleanup no destructivo.
- Si Product/Release quiere borrado fisico futuro, debe salir como tarea separada con confirmacion explicita y criterio de retencion.
- El repositorio local ya tenia cambios no relacionados antes de esta tarea; esta entrega solo agrega este handoff.
