# TASK-324 HANDOFF - Infra Azure

## Resultado

Completado. Se desplego la activacion de GA4 real a Azure Static Web Apps.

- Recurso Azure Static Web Apps: `puntoevento`
- Resource group: `resource_group_main`
- Dominio validado: `https://puntoeventocr.com`
- Branch desplegada: `main`
- Commit desplegado: `b3b867e39fee97527c832b554b250eadf39ee16a`
- Mensaje commit: `Deploy GA4 real measurement id`
- Measurement ID: `G-S3NK7BY9G7`

## Archivos publicados

- `index.html`
- `staticwebapp.config.json`

No se modificaron API, sitemap, rutas, blog, Google Tag Manager, admin ni panel durante esta tarea.

## URLs verificadas en produccion

| URL | Resultado |
| --- | --- |
| `https://puntoeventocr.com/` | `200` |
| `https://puntoeventocr.com/#inicio` | `200` |
| `https://puntoeventocr.com/san-jose` | `200` |
| `https://puntoeventocr.com/proveedores/catering` | `200` |
| `https://puntoeventocr.com/admin.html` | `200` |
| `https://puntoeventocr.com/panel.html` | `200` |

## Evidencia GA4 real servido

- `https://puntoeventocr.com/` sirve:
  - `<meta name="ga-measurement-id" content="G-S3NK7BY9G7" data-status="active" />`
  - `app.js?v=37`
- `Content-Security-Policy` publicado permite:
  - `script-src` con `https://www.googletagmanager.com`
  - `connect-src` con `https://www.google-analytics.com` y `https://*.google-analytics.com`
  - `img-src` con `https://www.google-analytics.com` y `https://*.google-analytics.com`
- `https://www.googletagmanager.com/gtag/js?id=G-S3NK7BY9G7` respondio `200`.
- El contenido de `gtag.js` incluye el Measurement ID `G-S3NK7BY9G7`.

## Admin y panel

Validado en produccion:

- `admin.html` responde `200`.
- `panel.html` responde `200`.
- Ambos mantienen `noindex,nofollow`.
- Ambos no contienen `ga-measurement-id`.
- Ambos no contienen `googletagmanager`.

## Confirmacion Azure

- Se uso el Static Web App existente `puntoevento`.
- Azure Static Web Apps sigue asociado a `main`.
- Entorno `default` quedo en estado `Ready`.
- No se crearon recursos Azure nuevos.
- Se consulto el inventario del resource group `resource_group_main`.
- No se ejecutaron comandos de creacion de recursos.

Nota operativa: durante la primera validacion post-push el entorno estaba en `Uploading` y produccion aun servia el meta GA pendiente/CSP anterior. Se espero a que Azure Static Web Apps quedara `Ready` y la validacion final confirmo GA4 activo.

## Pendiente QA Azure

Queda pendiente `TASK-325` para validar en dominio propio:

- Request real de `gtag.js?id=G-S3NK7BY9G7` desde navegador.
- Eventos MVP en Network/DebugView si aplica.
- Confirmar que los eventos no incluyen PII.
- Confirmar que admin/panel siguen sin tracking.

## Comandos usados

Secretos redactados/no impresos. No se pegaron tokens, cookies, SAS, connection strings, passwords, hashes de passwords ni emails reales completos.

```powershell
git rev-parse --show-toplevel
Get-Content chat-start/INFRA_AZURE.md
Get-Content AGENTS.md
Get-Content tasks/TASK-324-assignment.md
Get-Content docs/MVP_RELEASE_STATUS.md -TotalCount 100
Get-Content tasks/TASK-323-HANDOFF.md
Get-Content docs/ARCHITECTURE.md -TotalCount 100
git status --short
Get-Content tasks/TASK-322-HANDOFF.md
git diff --stat -- index.html staticwebapp.config.json app.js admin.html panel.html
git diff -- index.html staticwebapp.config.json
git diff --check -- index.html staticwebapp.config.json
Get-Content staticwebapp.config.json | ConvertFrom-Json
Select-String -Path admin.html,panel.html -Pattern "ga-measurement-id|googletagmanager|noindex,nofollow" -Context 0,0
Select-String -Path index.html -Pattern "ga-measurement-id|app.js" -Context 0,0
git add index.html staticwebapp.config.json
git diff --cached --name-only
git diff --cached --stat
git commit -m "Deploy GA4 real measurement id"
git push origin main
Invoke-WebRequest -Uri "https://puntoeventocr.com/" -UseBasicParsing -TimeoutSec 30
Invoke-WebRequest -Uri "https://puntoeventocr.com/#inicio" -UseBasicParsing -TimeoutSec 30
Invoke-WebRequest -Uri "https://puntoeventocr.com/san-jose" -UseBasicParsing -TimeoutSec 30
Invoke-WebRequest -Uri "https://puntoeventocr.com/proveedores/catering" -UseBasicParsing -TimeoutSec 30
Invoke-WebRequest -Uri "https://puntoeventocr.com/admin.html" -UseBasicParsing -TimeoutSec 30
Invoke-WebRequest -Uri "https://puntoeventocr.com/panel.html" -UseBasicParsing -TimeoutSec 30
Invoke-WebRequest -Uri "https://www.googletagmanager.com/gtag/js?id=G-S3NK7BY9G7" -UseBasicParsing -TimeoutSec 30
az staticwebapp environment list --name puntoevento --resource-group resource_group_main -o table
az resource list --resource-group resource_group_main --query "[].{name:name,type:type,location:location}" -o table
```
