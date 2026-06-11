# TASK-315 HANDOFF - Infra Azure

## Resultado

Completado. Se desplegaron a Azure Static Web Apps las primeras rutas SEO limpias por categoria aprobadas por `TASK-314`.

- Recurso Azure Static Web Apps: `puntoevento`
- Resource group: `resource_group_main`
- Dominio validado: `https://puntoeventocr.com`
- Branch desplegada: `main`
- Commit desplegado: `b823e2d3930e1015e8baffdeec4a954576d74ca6`
- Mensaje commit: `Deploy SEO category routes`

## Archivos publicados

- `index.html`
- `app.js`
- `styles.css`
- `sitemap.xml`

No se modificaron `staticwebapp.config.json`, API, app settings, dominio, blog ni GA4 real durante esta tarea.

## URLs verificadas en produccion

| URL | Resultado |
| --- | --- |
| `https://puntoeventocr.com/` | `200` |
| `https://puntoeventocr.com/proveedores/salones-eventos` | `200` |
| `https://puntoeventocr.com/proveedores/catering` | `200` |
| `https://puntoeventocr.com/proveedores/decoracion` | `200` |
| `https://puntoeventocr.com/proveedores/musica-dj` | `200` |
| `https://puntoeventocr.com/proveedores/fotografia-video` | `200` |
| `https://puntoeventocr.com/proveedores/pasteleria-reposteria` | `200` |
| `https://puntoeventocr.com/sitemap.xml` | `200` |
| `https://puntoeventocr.com/robots.txt` | `200` |
| `https://puntoeventocr.com/admin.html` | `200` |
| `https://puntoeventocr.com/panel.html` | `200` |

## Verificaciones de contenido

- `https://puntoeventocr.com/` sirve `app.js?v=36`.
- `index.html` publicado incluye `<base href="/" />`.
- `https://puntoeventocr.com/app.js?v=36` contiene las rutas SEO de categoria esperadas.
- `https://puntoeventocr.com/sitemap.xml` contiene home y las seis rutas limpias:
  - `/proveedores/salones-eventos`
  - `/proveedores/catering`
  - `/proveedores/decoracion`
  - `/proveedores/musica-dj`
  - `/proveedores/fotografia-video`
  - `/proveedores/pasteleria-reposteria`
- `https://puntoeventocr.com/robots.txt` referencia `Sitemap: https://puntoeventocr.com/sitemap.xml`.

Nota: un primer chequeo automatizado busco el literal `<base href="/">` y devolvio falso por el formato real autocerrado `<base href="/" />`; se confirmo el formato correcto en el archivo desplegado.

## Confirmacion Azure

- Se uso el Static Web App existente `puntoevento`.
- No se crearon recursos Azure nuevos.
- Se consulto el inventario del resource group `resource_group_main` para confirmar contexto operativo.
- No se ejecutaron comandos de creacion de recursos.

## Pendiente QA Azure

Queda pendiente `TASK-316` para validar en dominio propio:

- DOM renderizado, H1, canonical y metadata por ruta.
- Regresion de rutas hash existentes.
- Desktop/mobile.
- Conteos/estado vacio con datos productivos.

## Comandos usados

Secretos redactados/no impresos. No se pegaron tokens, cookies, SAS, connection strings, passwords, hashes de passwords ni emails reales completos.

```powershell
git rev-parse --show-toplevel
Get-Content chat-start/INFRA_AZURE.md
Get-Content AGENTS.md
Get-Content docs/MVP_RELEASE_STATUS.md
Get-Content tasks/TASK-315-assignment.md
Get-Content tasks/TASK-314-HANDOFF.md
Get-Content tasks/TASK-313-HANDOFF.md
git diff --stat -- app.js index.html sitemap.xml styles.css staticwebapp.config.json
git diff --check -- app.js index.html sitemap.xml styles.css staticwebapp.config.json
node --check app.js
Test-Path staticwebapp.config.json
rg -n "navigationFallback|rewrite|routes|proveedores" staticwebapp.config.json
Get-Content staticwebapp.config.json
git add index.html app.js styles.css sitemap.xml
git diff --cached --name-only
git commit -m "Deploy SEO category routes"
git push origin main
az staticwebapp show --name puntoevento --resource-group resource_group_main --query "{name:name,defaultHostname:defaultHostname,repositoryUrl:repositoryUrl,branch:branch,sku:sku.name}" -o json
az resource list --resource-group resource_group_main --query "[].{name:name,type:type,location:location}" -o table
git rev-parse HEAD
Invoke-WebRequest -Uri "https://puntoeventocr.com/" -UseBasicParsing -TimeoutSec 30
Invoke-WebRequest -Uri "https://puntoeventocr.com/proveedores/salones-eventos" -UseBasicParsing -TimeoutSec 30
Invoke-WebRequest -Uri "https://puntoeventocr.com/proveedores/catering" -UseBasicParsing -TimeoutSec 30
Invoke-WebRequest -Uri "https://puntoeventocr.com/proveedores/decoracion" -UseBasicParsing -TimeoutSec 30
Invoke-WebRequest -Uri "https://puntoeventocr.com/proveedores/musica-dj" -UseBasicParsing -TimeoutSec 30
Invoke-WebRequest -Uri "https://puntoeventocr.com/proveedores/fotografia-video" -UseBasicParsing -TimeoutSec 30
Invoke-WebRequest -Uri "https://puntoeventocr.com/proveedores/pasteleria-reposteria" -UseBasicParsing -TimeoutSec 30
Invoke-WebRequest -Uri "https://puntoeventocr.com/sitemap.xml" -UseBasicParsing -TimeoutSec 30
Invoke-WebRequest -Uri "https://puntoeventocr.com/robots.txt" -UseBasicParsing -TimeoutSec 30
Invoke-WebRequest -Uri "https://puntoeventocr.com/admin.html" -UseBasicParsing -TimeoutSec 30
Invoke-WebRequest -Uri "https://puntoeventocr.com/panel.html" -UseBasicParsing -TimeoutSec 30
Invoke-WebRequest -Uri "https://puntoeventocr.com/app.js?v=36" -UseBasicParsing -TimeoutSec 30
rg -n "TASK-315|TASK-316|TASK-313|TASK-314" docs/BACKLOG.md docs/MVP_RELEASE_STATUS.md
git status --short
```
