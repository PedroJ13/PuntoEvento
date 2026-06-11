# TASK-337 HANDOFF - Infra Azure

## Resultado

Completado. Se desplego el ajuste del panel empresa para conservar la portada publicada al agregar fotos nuevas, salvo seleccion explicita de otra portada.

- Recurso Azure Static Web Apps: `puntoevento`
- Resource group: `resource_group_main`
- Dominio validado: `https://puntoeventocr.com`
- Branch desplegada: `main`
- Commit desplegado: `e6826f0c0bf1df43f7e9133cc1937ba3b51ede35`
- Mensaje commit: `Deploy panel cover selection fix`

## Archivos publicados

- `panel.html`
- `panel.js`

No se modificaron API, CORS, Blob Storage, app settings, datos productivos ni recursos Azure durante esta tarea.

## Evidencia de `panel.js?v=18`

- Azure Static Web Apps environment `default` quedo en estado `Ready`.
- `https://puntoeventocr.com/panel.html` responde `200`.
- `panel.html` publicado referencia `panel.js?v=18`.
- `panel.html` publicado ya no referencia `panel.js?v=17`.
- `https://puntoeventocr.com/panel.js?v=18` responde `200`.
- `panel.js?v=18` publicado contiene:
  - `function ensureCoverSelection()`
  - `function demoteExistingCover()`
  - mensaje `Puedes mantener la portada actual o elegir otra`

## Smokes no destructivos

| URL | Resultado |
| --- | --- |
| `https://puntoeventocr.com/` | `200` |
| `https://puntoeventocr.com/panel.html` | `200` |
| `https://puntoeventocr.com/admin.html` | `200` |
| `https://puntoeventocr.com/proveedores/catering` | `200` |
| `https://puntoeventocr.com/san-jose` | `200` |
| `https://puntoeventocr.com/api/public/services?limit=1` | `200` |

## Checks previos al deploy

```text
node --check panel.js
git diff --check -- panel.html panel.js
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

- No se ejecuto flujo autenticado de edicion de servicio para no modificar datos productivos.
- La validacion funcional real queda para QA Azure con sesion controlada.

## QA puede iniciar

`TASK-338` puede iniciar QA Azure post-deploy.

Validar especialmente:

1. Servicio publicado con una sola imagen/portada.
2. Agregar fotos nuevas sin presionar `Usar como portada`.
3. Enviar servicio a revision.
4. Confirmar que queda `pending`.
5. Confirmar que la portada anterior se mantiene y las nuevas entran como galeria.
6. Repetir eligiendo una nueva foto como portada y confirmar que ahi si reemplaza la portada.

## Comandos usados

Secretos redactados/no impresos. No se pegaron tokens, cookies, SAS, connection strings, passwords, hashes de passwords ni emails reales completos.

```powershell
git rev-parse --show-toplevel
Get-Content chat-start/INFRA_AZURE.md
Get-Content AGENTS.md
Get-Content tasks/TASK-337-assignment.md
Get-Content tasks/TASK-336-HANDOFF.md
Get-Content docs/MVP_RELEASE_STATUS.md -TotalCount 140
git status --short -- panel.html panel.js api staticwebapp.config.json
git diff --stat -- panel.html panel.js api staticwebapp.config.json
git diff -- panel.html panel.js
git diff --check -- panel.html panel.js
node --check panel.js
Select-String -Path panel.html -Pattern "panel.js" -Context 0,0
git add panel.html panel.js
git diff --cached --name-only
git diff --cached --stat
git diff --cached --check
git commit -m "Deploy panel cover selection fix"
git push origin main
az staticwebapp environment list --name puntoevento --resource-group resource_group_main --query "[?name=='default'].{status:status,lastUpdatedOn:lastUpdatedOn}" -o json
Invoke-WebRequest -Uri "https://puntoeventocr.com/" -UseBasicParsing -TimeoutSec 30
Invoke-WebRequest -Uri "https://puntoeventocr.com/panel.html" -UseBasicParsing -TimeoutSec 30
Invoke-WebRequest -Uri "https://puntoeventocr.com/admin.html" -UseBasicParsing -TimeoutSec 30
Invoke-WebRequest -Uri "https://puntoeventocr.com/proveedores/catering" -UseBasicParsing -TimeoutSec 30
Invoke-WebRequest -Uri "https://puntoeventocr.com/san-jose" -UseBasicParsing -TimeoutSec 30
Invoke-WebRequest -Uri "https://puntoeventocr.com/api/public/services?limit=1" -UseBasicParsing -TimeoutSec 30
Invoke-WebRequest -Uri "https://puntoeventocr.com/panel.js?v=18" -UseBasicParsing -TimeoutSec 30
az resource list --resource-group resource_group_main --query "[].{name:name,type:type,location:location}" -o table
git rev-parse HEAD
```
