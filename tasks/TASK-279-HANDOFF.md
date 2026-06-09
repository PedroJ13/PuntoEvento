# TASK-279 HANDOFF: permitir registro desde dominio propio

## Resumen

Infra Azure completo el ajuste de configuracion para que el registro publico de empresas funcione desde el dominio propio.

- Ambiente: Azure Static Web Apps `puntoevento`.
- Resource group: `resource_group_main`.
- Dominio canonico aprobado: `https://puntoeventocr.com`.
- Codigo frontend/backend: no modificado.
- Email, endpoints, pipeline, DNS y blobs: no modificados.
- Hard delete: no ejecutado.
- Secretos/tokens/cookies/SAS/connection strings/passwords/password hashes/emails reales: no impresos ni documentados.

## Configuracion ajustada

App settings no sensibles verificados:

```text
ALLOWED_ORIGINS=https://puntoeventocr.com,https://www.puntoeventocr.com,https://zealous-field-08fdd720f.7.azurestaticapps.net
APP_PUBLIC_URL=https://puntoeventocr.com
```

Antes de la correccion:

```text
ALLOWED_ORIGINS=https://zealous-field-08fdd720f.7.azurestaticapps.net
APP_PUBLIC_URL=https://zealous-field-08fdd720f.7.azurestaticapps.net
```

## Smokes ejecutados

| Check | Resultado |
|---|---|
| `GET https://puntoeventocr.com/` | `200` |
| `GET https://www.puntoeventocr.com/` | `200` |
| `GET https://puntoeventocr.com/api/public/services?limit=5` | `200`, `items=0` |
| `GET https://www.puntoeventocr.com/api/public/services?limit=5` | `200`, `items=0` |
| `POST https://puntoeventocr.com/api/companies/register` con `Origin: https://puntoeventocr.com` | `201` |
| `POST https://www.puntoeventocr.com/api/companies/register` con `Origin: https://www.puntoeventocr.com` | `201` |

El `403` reportado desde el dominio propio queda corregido tecnicamente.

## Empresas QA creadas y limpieza

Se crearon dos empresas QA controladas para validar el registro desde los dos origenes del dominio propio. Luego se aplico soft cleanup en Table Storage.

| Uso | Company ID | Slug | Estado al crear | Estado final |
|---|---|---|---|---|
| Smoke apex | `company_38bea0d0-d35f-4507-bcb3-bf12a53b885e` | `qa-task-279-apex-20260609133250` | `pending` | `rejected` |
| Smoke www | `company_ce772dc9-4dd2-42ee-838b-668f6b44dbca` | `qa-task-279-www-20260609133250` | `pending` | `rejected` |
| Comparacion hostname viejo | `company_848b9fa5-51f8-4221-aea8-98542dc8bdf0` | `qa-domain-old-host-20260609` | creado antes de TASK-279 | `rejected` |

Campos de auditoria agregados por cleanup:

```text
cleanupTask=TASK-279
rejectionReason=TASK-279 QA cleanup after domain origin smoke
updatedAt=<timestamp UTC>
```

No se borraron entidades ni blobs.

## Recomendacion para QA

Ejecutar `TASK-280` contra Azure usando el dominio propio:

- Revalidar registro desde `https://puntoeventocr.com/#empresas`.
- Revalidar registro desde `https://www.puntoeventocr.com/#empresas`.
- Confirmar que la UI ya no muestra error por `403`.
- Confirmar que el admin lista las empresas pendientes nuevas si QA crea una empresa de prueba y aun no la limpia.
- Confirmar que los enlaces de activacion generados por admin usan `https://puntoeventocr.com` como base por `APP_PUBLIC_URL`.

## Riesgos / notas

- El dominio propio ya esta habilitado para registro por configuracion. Falta QA funcional completa (`TASK-280`) antes de levantar el NO-GO para primera empresa real.
- Los registros QA de este handoff quedaron rechazados, por lo que no deben aparecer en catalogo publico.
- El smoke de registro puede haber disparado la notificacion interna normal de nueva empresa; no se documento ningun destinatario ni contenido de email.

## Comandos usados con secretos redactados

No se imprimieron secretos. Los comandos representativos fueron:

```powershell
git rev-parse --show-toplevel
Get-Content -Raw chat-start/INFRA_AZURE.md
Get-Content -Raw AGENTS.md
Get-Content -Raw docs/MVP_RELEASE_STATUS.md
Get-Content -Raw tasks/TASK-279-assignment.md
Get-Content -Raw docs/API_CONTRACTS_MVP.md
Get-Content -Raw api/shared/config.js
Get-Content -Raw api/companies-register/index.js
az staticwebapp appsettings list --name puntoevento --resource-group resource_group_main --query "{ALLOWED_ORIGINS:properties.ALLOWED_ORIGINS, APP_PUBLIC_URL:properties.APP_PUBLIC_URL}" -o json
az staticwebapp appsettings set --name puntoevento --resource-group resource_group_main --setting-names ALLOWED_ORIGINS=<redacted-nonsecret-origin-list> APP_PUBLIC_URL=<canonical-public-url>
Invoke-WebRequest -Uri https://puntoeventocr.com/ -Method Head
Invoke-WebRequest -Uri https://www.puntoeventocr.com/ -Method Head
Invoke-WebRequest -Uri https://puntoeventocr.com/api/public/services?limit=5
Invoke-WebRequest -Uri https://www.puntoeventocr.com/api/public/services?limit=5
Invoke-WebRequest -Method Post -Uri https://puntoeventocr.com/api/companies/register -Headers @{ Origin = "https://puntoeventocr.com" } -ContentType "application/json" -Body <redacted-task-279-smoke-payload>
Invoke-WebRequest -Method Post -Uri https://www.puntoeventocr.com/api/companies/register -Headers @{ Origin = "https://www.puntoeventocr.com" } -ContentType "application/json" -Body <redacted-task-279-smoke-payload>
az storage entity merge --account-name storagepuntoevento --auth-mode key --table-name Companies --entity PartitionKey=company RowKey=<company_id> status=rejected rejectionReason=<redacted-cleanup-reason> cleanupTask=TASK-279 updatedAt=<timestamp>
Invoke-RestMethod -Uri https://puntoeventocr.com/api/public/services?limit=5
Invoke-RestMethod -Uri https://www.puntoeventocr.com/api/public/services?limit=5
```

`az storage entity merge --auth-mode key` mostro advertencias de Azure CLI sobre obtencion de credenciales de la cuenta, pero no imprimio account keys ni connection strings.
