# TASK-349 HANDOFF - Infra Azure

## Resumen

Deploy completado del lote de visibilidad publica por imagen aprobada y copy/admin asociado.

No se crearon recursos Azure nuevos. No se cambiaron app settings, CORS, Blob Storage, secretos ni reglas de negocio fuera del lote ya entregado por Backend/API y Admin/Web.

## Commit desplegado

- Branch: `main`
- Commit deploy: `96eac456449b96ca6f0b6d8256eb373abb4dbfb5`
- Mensaje: `Deploy public visibility image rule`

## Precondiciones verificadas

- `tasks/TASK-347-HANDOFF.md` existe y documenta la regla Backend/API:
  - servicio visible publicamente solo si empresa y servicio estan `published` y existe al menos un upload de servicio `published` aplicado en `coverUrl` o `gallery`.
- `tasks/TASK-348-HANDOFF.md` existe y documenta el copy Admin/Web:
  - `Pendiente de imagen`
  - `Visible publico`
  - `No visible publico`

## Archivos incluidos en el deploy

- `api/shared/publicVisibility.js`
- `api/shared/publicCatalog.js`
- `api/public-leads/index.js`
- `admin.html`
- `admin.js`
- `admin.css`
- `docs/API_CONTRACTS_MVP.md`
- `docs/DATA_MODEL.md`

## Versiones / assets verificados en produccion

Dominio validado: `https://puntoeventocr.com`

- `GET https://puntoeventocr.com/admin.html` -> 200
  - referencia `admin.js?v=24`
  - referencia `admin.css?v=16`
- `GET https://puntoeventocr.com/admin.js?v=24` -> 200
  - contiene copy/estado nuevo de visibilidad publica.
- `GET https://puntoeventocr.com/admin.css?v=16` -> 200
  - contiene estilos `.service-public-state`.

## Smokes ejecutados

- `GET https://puntoeventocr.com/` -> 200
- `GET https://puntoeventocr.com/admin.html` -> 200
- `GET https://puntoeventocr.com/panel.html` -> 200
- `GET https://puntoeventocr.com/api/public/services?limit=50` -> 200
  - devuelve 3 servicios publicos.
  - los 3 servicios devueltos tienen imagen publica aplicada (`coverUrl` o `gallery`).
- `GET https://puntoeventocr.com/api/internal/services/pending` -> 200 con credencial admin cargada desde app settings.

## Validaciones locales antes de deploy

- `node --check admin.js` -> OK
- `node --check api/shared/publicVisibility.js` -> OK
- `node --check api/shared/publicCatalog.js` -> OK
- `node --check api/public-leads/index.js` -> OK
- `git diff --check` sobre archivos del lote -> OK, solo warnings normales CRLF en Windows.

## App settings / recursos

- App settings: sin cambios.
- Recursos Azure: sin cambios.
- CORS/Blob Storage: sin cambios.
- Secretos: no rotados.
- Connection strings, tokens, cookies, SAS y credenciales no fueron impresos.

## Comandos usados

Secretos y credenciales fueron cargados en variables locales cuando hizo falta y no se imprimieron.

```powershell
git rev-parse --show-toplevel
Get-Content AGENTS.md
Get-Content chat-start/INFRA_AZURE.md
Get-Content tasks/TASK-349-assignment.md
Get-Content docs/MVP_RELEASE_STATUS.md
Get-Content docs/ARCHITECTURE.md
Get-Content docs/API_CONTRACTS_MVP.md -TotalCount 980
Get-Content tasks/TASK-347-HANDOFF.md
Get-Content tasks/TASK-348-HANDOFF.md
git status --short
git diff --stat -- <TASK-347-348_FILES>
git diff -- <TASK-347-348_FILES>
node --check admin.js
node --check api/shared/publicVisibility.js
node --check api/shared/publicCatalog.js
node --check api/public-leads/index.js
git diff --check -- <TASK-347-348_FILES>
git add -- <TASK-347-348_FILES>
git commit -m "Deploy public visibility image rule"
git push
gh run list --branch main --limit 5 --json <FIELDS>
Invoke-WebRequest -Uri "https://puntoeventocr.com/admin.html" -Method Get -TimeoutSec 30 -UseBasicParsing
Invoke-WebRequest -Uri "https://puntoeventocr.com/admin.js?v=24" -Method Get -TimeoutSec 30 -UseBasicParsing
Invoke-WebRequest -Uri "https://puntoeventocr.com/admin.css?v=16" -Method Get -TimeoutSec 30 -UseBasicParsing
az staticwebapp appsettings list --name puntoevento --resource-group resource_group_main -o json
Invoke-WebRequest -Uri "https://puntoeventocr.com/" -Method Get -TimeoutSec 30 -UseBasicParsing
Invoke-WebRequest -Uri "https://puntoeventocr.com/admin.html" -Method Get -TimeoutSec 30 -UseBasicParsing
Invoke-WebRequest -Uri "https://puntoeventocr.com/panel.html" -Method Get -TimeoutSec 30 -UseBasicParsing
Invoke-WebRequest -Uri "https://puntoeventocr.com/api/public/services?limit=50" -Method Get -TimeoutSec 30 -UseBasicParsing
Invoke-WebRequest -Uri "https://puntoeventocr.com/api/internal/services/pending" -Headers <REDACTED_ADMIN_HEADER> -Method Get -TimeoutSec 30 -UseBasicParsing
Invoke-RestMethod -Uri "https://puntoeventocr.com/api/public/services?limit=50" -TimeoutSec 30
```

Nota: `gh` no esta instalado en este entorno, por lo que el seguimiento del deploy se confirmo por contenido y endpoints servidos desde produccion.

## Pendientes para QA Azure

- Validar en Admin con datos reales que un servicio aprobado internamente sin imagen publicada muestre `Pendiente de imagen`.
- Validar que un servicio con imagen publicada asociada a `coverUrl` o `gallery` muestre `Visible publico`.
- Validar que `GET /api/public/services` y `GET /api/public/companies/{slug}` no expongan servicios aprobados internamente sin imagen publicada.
- Validar que `POST /api/public/leads` responda `404` para un servicio aprobado internamente pero no visible publicamente.
