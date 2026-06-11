# TASK-328 HANDOFF - Infra Azure

## Resultado

Completado. Se desplego FAQ/schema JSON-LD base a Azure Static Web Apps.

- Recurso Azure Static Web Apps: `puntoevento`
- Resource group: `resource_group_main`
- Dominio validado: `https://puntoeventocr.com`
- Branch desplegada: `main`
- Commit desplegado: `9ecb9fa0aa543d84d73a8defa8d89fd3af6de32d`
- Mensaje commit: `Deploy FAQ schema JSON-LD`

## Archivos publicados

- `app.js`
- `index.html`

No se modificaron API, GA4, sitemap, rutas, blog, admin ni panel durante esta tarea.

## URLs verificadas en produccion

| URL | Resultado |
| --- | --- |
| `https://puntoeventocr.com/` | `200` |
| `https://puntoeventocr.com/proveedores/catering` | `200` |
| `https://puntoeventocr.com/proveedores/pasteleria-reposteria` | `200` |
| `https://puntoeventocr.com/san-jose` | `200` |
| `https://puntoeventocr.com/heredia` | `200` |
| `https://puntoeventocr.com/admin.html` | `200` |
| `https://puntoeventocr.com/panel.html` | `200` |

## Confirmacion de schema servido

- `https://puntoeventocr.com/` sirve `app.js?v=38`.
- `https://puntoeventocr.com/app.js?v=38` contiene la logica de JSON-LD:
  - `STRUCTURED_DATA_SCRIPT_ID`
  - `Organization`
  - `WebSite`
  - `FAQPage`
- DOM renderizado en produccion con Playwright:

| Ruta | Scripts JSON-LD | Tipos schema | FAQ questions | Robots |
| --- | ---: | --- | ---: | --- |
| `/` | 1 | `Organization`, `WebSite` | 0 | vacio |
| `/proveedores/catering` | 1 | `Organization`, `WebSite`, `FAQPage` | 3 | vacio |
| `/san-jose` | 1 | `Organization`, `WebSite`, `FAQPage` | 3 | vacio |
| `/admin.html` | 0 | ninguno | 0 | `noindex,nofollow` |
| `/panel.html` | 0 | ninguno | 0 | `noindex,nofollow` |

## Confirmacion Azure

- Se uso el Static Web App existente `puntoevento`.
- Azure Static Web Apps sigue asociado a `main`.
- No se crearon recursos Azure nuevos.
- Se consulto el inventario del resource group `resource_group_main`.
- No se ejecutaron comandos de creacion de recursos.

Nota operativa: tras el primer `Ready`, el edge todavia servia `app.js?v=37`. Se espero propagacion adicional y la validacion final confirmo `app.js?v=38` y schema en el asset/DOM.

## Pendiente QA Azure

Queda pendiente `TASK-329` para validar en dominio propio:

- JSON-LD renderizado en rutas principales.
- Validez del JSON en DOM.
- Coincidencia de FAQ visible vs `FAQPage`.
- Admin/panel sin schema publico y con `noindex,nofollow`.
- Rich Results Test o Schema Markup Validator si Product lo solicita.

## Comandos usados

Secretos redactados/no impresos. No se pegaron tokens, cookies, SAS, connection strings, passwords, hashes de passwords ni emails reales completos.

```powershell
git rev-parse --show-toplevel
Get-Content chat-start/INFRA_AZURE.md
Get-Content AGENTS.md
Get-Content tasks/TASK-328-assignment.md
Get-Content tasks/TASK-327-HANDOFF.md
Get-Content docs/MVP_RELEASE_STATUS.md -TotalCount 110
Get-Content docs/ARCHITECTURE.md -TotalCount 100
git status --short
Get-Content tasks/TASK-326-HANDOFF.md
git diff --stat -- index.html app.js admin.html panel.html staticwebapp.config.json sitemap.xml
git diff -- index.html app.js
git diff --check -- index.html app.js
node --check app.js
Select-String -Path index.html -Pattern "app.js|ga-measurement-id" -Context 0,0
Select-String -Path admin.html,panel.html -Pattern "application/ld\\+json|noindex,nofollow" -Context 0,0
git add app.js index.html
git diff --cached --name-only
git diff --cached --stat
git commit -m "Deploy FAQ schema JSON-LD"
git push origin main
az staticwebapp environment list --name puntoevento --resource-group resource_group_main --query "[?name=='default'].{status:status,lastUpdatedOn:lastUpdatedOn}" -o json
Invoke-WebRequest -Uri "https://puntoeventocr.com/" -UseBasicParsing -TimeoutSec 30
Invoke-WebRequest -Uri "https://puntoeventocr.com/app.js?v=38" -UseBasicParsing -TimeoutSec 30
Invoke-WebRequest -Uri "https://puntoeventocr.com/proveedores/catering" -UseBasicParsing -TimeoutSec 30
Invoke-WebRequest -Uri "https://puntoeventocr.com/proveedores/pasteleria-reposteria" -UseBasicParsing -TimeoutSec 30
Invoke-WebRequest -Uri "https://puntoeventocr.com/san-jose" -UseBasicParsing -TimeoutSec 30
Invoke-WebRequest -Uri "https://puntoeventocr.com/heredia" -UseBasicParsing -TimeoutSec 30
Invoke-WebRequest -Uri "https://puntoeventocr.com/admin.html" -UseBasicParsing -TimeoutSec 30
Invoke-WebRequest -Uri "https://puntoeventocr.com/panel.html" -UseBasicParsing -TimeoutSec 30
az resource list --resource-group resource_group_main --query "[].{name:name,type:type,location:location}" -o table
node - < Playwright DOM schema smoke script >
```
