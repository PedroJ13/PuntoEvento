# TASK-335 HANDOFF - Infra Azure

## Resultado

Completado. Se desplego el fix completo para reemplazo/quitar portada publicada desde panel empresa y para permitir reemplazar portada publicada en `POST /api/uploads/sign`.

- Recurso Azure Static Web Apps: `puntoevento`
- Resource group: `resource_group_main`
- Dominio validado: `https://puntoeventocr.com`
- Branch desplegada: `main`
- Commit desplegado: `a96fdb4105740cbaf49cf4c6374bb02db2a6360c`
- Mensaje commit: `Deploy published cover replacement fix`

## Archivos publicados

- `panel.html`
- `panel.js`
- `api/shared/serviceUploadRules.js`

No se modificaron CORS, Blob Storage, app settings, datos productivos ni recursos Azure durante esta tarea.

## Evidencia de deploy

- Azure Static Web Apps environment `default` quedo en estado `Ready`.
- `panel.html` publicado sirve `panel.js?v=17`.
- `panel.html` ya no referencia `panel.js?v=16`.
- `panel.js?v=17` publicado contiene:
  - `existingImages`
  - `data-remove-existing-photo`
  - `data-set-existing-cover`
  - `applyExistingImagesToPayload`
- El commit desplegado incluye el fix Backend/API en `api/shared/serviceUploadRules.js`, separando:
  - estados que cuentan para limite total: `reserved`, `pending`, `published`;
  - estados que bloquean reemplazo de portada: `reserved`, `pending`.

## Smokes no destructivos

| URL | Resultado |
| --- | --- |
| `https://puntoeventocr.com/` | `200` |
| `https://puntoeventocr.com/panel.html` | `200` |
| `https://puntoeventocr.com/admin.html` | `200` |
| `https://puntoeventocr.com/proveedores/catering` | `200` |
| `https://puntoeventocr.com/san-jose` | `200` |
| `https://puntoeventocr.com/api/public/services?limit=1` | `200` |
| `POST https://puntoeventocr.com/api/uploads/sign` sin sesion | `401 Unauthorized` esperado |

El smoke a `/api/uploads/sign` fue intencionalmente no autenticado para confirmar que la Function responde y esta protegida, sin reservar uploads, sin generar SAS y sin tocar blobs ni datos productivos.

## Checks previos al deploy

```text
node --check panel.js
node --check api/shared/serviceUploadRules.js
node --check api/uploads-sign/index.js
node --check api/shared/internalModeration.js
git diff --check -- panel.html panel.js api/shared/serviceUploadRules.js
```

Resultado: OK.

## Confirmacion Azure

- Se uso el Static Web App existente `puntoevento`.
- Azure Static Web Apps sigue asociado a `main`.
- No se crearon recursos Azure nuevos.
- Se consulto el inventario del resource group `resource_group_main`.
- No se ejecutaron comandos de creacion de recursos.

## Riesgos / warnings

- No se ejecuto el flujo autenticado completo de editar servicio publicado con portada/fotos porque seria destructivo o modificaria datos productivos.
- La verificacion funcional real queda para QA Azure con sesion controlada.
- Hubo un primer intento de smoke a `/api/uploads/sign` con error de sintaxis PowerShell local; se repitio correctamente y devolvio `401 Unauthorized` esperado.

## QA puede iniciar

`TASK-331` puede iniciar QA Azure post-fix.

Validar especialmente:

- editar servicio publicado con portada visible;
- quitar portada publicada;
- marcar foto publicada de galeria como portada;
- agregar nueva foto y marcarla como portada;
- enviar servicio a revision;
- confirmar que queda `pending`, no `draft`;
- confirmar que intentar dejar dos portadas nuevas pendientes sigue bloqueado.

## Comandos usados

Secretos redactados/no impresos. No se pegaron tokens, cookies, SAS, connection strings, passwords, hashes de passwords ni emails reales completos.

```powershell
git rev-parse --show-toplevel
Get-Content chat-start/INFRA_AZURE.md
Get-Content AGENTS.md
Get-Content tasks/TASK-335-assignment.md
Get-Content tasks/TASK-332-HANDOFF.md
Get-Content tasks/TASK-333-HANDOFF.md
Get-Content docs/MVP_RELEASE_STATUS.md -TotalCount 130
Get-Content docs/API_CONTRACTS_MVP.md -TotalCount 120
git status --short -- panel.html panel.js api/shared/serviceUploadRules.js api/uploads-sign/index.js api/shared/internalModeration.js
git diff --stat -- panel.html panel.js api/shared/serviceUploadRules.js
git diff -- panel.html panel.js api/shared/serviceUploadRules.js
git diff --check -- panel.html panel.js api/shared/serviceUploadRules.js
node --check panel.js
node --check api/shared/serviceUploadRules.js
node --check api/uploads-sign/index.js
node --check api/shared/internalModeration.js
git add panel.html panel.js api/shared/serviceUploadRules.js
git diff --cached --name-only
git diff --cached --stat
git diff --cached --check
git commit -m "Deploy published cover replacement fix"
git push origin main
az staticwebapp environment list --name puntoevento --resource-group resource_group_main --query "[?name=='default'].{status:status,lastUpdatedOn:lastUpdatedOn}" -o json
Invoke-WebRequest -Uri "https://puntoeventocr.com/" -UseBasicParsing -TimeoutSec 30
Invoke-WebRequest -Uri "https://puntoeventocr.com/panel.html" -UseBasicParsing -TimeoutSec 30
Invoke-WebRequest -Uri "https://puntoeventocr.com/admin.html" -UseBasicParsing -TimeoutSec 30
Invoke-WebRequest -Uri "https://puntoeventocr.com/proveedores/catering" -UseBasicParsing -TimeoutSec 30
Invoke-WebRequest -Uri "https://puntoeventocr.com/san-jose" -UseBasicParsing -TimeoutSec 30
Invoke-WebRequest -Uri "https://puntoeventocr.com/api/public/services?limit=1" -UseBasicParsing -TimeoutSec 30
Invoke-WebRequest -Uri "https://puntoeventocr.com/panel.js?v=17" -UseBasicParsing -TimeoutSec 30
Invoke-WebRequest -Uri "https://puntoeventocr.com/api/uploads/sign" -Method POST -ContentType "application/json" -Body "{}" -UseBasicParsing -TimeoutSec 30
az resource list --resource-group resource_group_main --query "[].{name:name,type:type,location:location}" -o table
git rev-parse HEAD
```
