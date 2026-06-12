# TASK-353 HANDOFF - Infra Azure

## Resumen

Deploy completado del lote de despublicacion/rechazo de imagenes publicadas.

No se crearon recursos Azure nuevos. No se cambiaron app settings, CORS, Blob Storage ni secretos. No se borraron datos.

## Commit desplegado

- Branch: `main`
- Commit deploy: `1d438da65ca8178c6f39e275d96177e26cf61cc1`
- Mensaje: `Deploy published image unpublish flow`

## Precondiciones verificadas

- `tasks/TASK-351-HANDOFF.md` existe y documenta Backend/API:
  - `POST /api/internal/uploads/{companyId}/{uploadId}/reject` puede despublicar uploads `published`.
  - No borra blobs ni cambia `Companies.status` / `Services.status`.
  - Recalcula `Services.coverUrl` / `Services.gallery` cuando aplica.
- `tasks/TASK-352-HANDOFF.md` existe y documenta Admin/Web:
  - accion `Despublicar imagen` para imagenes `published`.
  - copy de advertencia cuando puede salir del catalogo publico.
  - cache busting esperado `admin.js?v=25`.

## Archivos incluidos en el deploy

- `api/shared/internalModeration.js`
- `admin.html`
- `admin.js`
- `docs/API_CONTRACTS_MVP.md`
- `docs/DATA_MODEL.md`

## Assets / versiones verificadas en produccion

Dominio validado: `https://puntoeventocr.com`

- `GET https://puntoeventocr.com/admin.html` -> 200
  - referencia `admin.js?v=25`.
- `GET https://puntoeventocr.com/admin.js?v=25` -> 200
  - contiene copy `Despublicar imagen`.
  - contiene copy `Imagen despublicada...`.

Nota operativa: en el primer intento post-push aun se servia version anterior; tras esperar el ciclo de deploy de Azure Static Web Apps, `admin.js?v=25` quedo servido correctamente.

## Smokes ejecutados

- `GET https://puntoeventocr.com/` -> 200
- `GET https://puntoeventocr.com/admin.html` -> 200
- `GET https://puntoeventocr.com/panel.html` -> 200
- `GET https://puntoeventocr.com/api/public/services?limit=50` -> 200
  - devuelve 4 servicios publicos al momento del smoke.
- `GET https://puntoeventocr.com/api/internal/services/pending` -> 200 con credencial admin cargada desde app settings.
- `GET https://puntoeventocr.com/api/internal/uploads/pending` -> 200 con credencial admin cargada desde app settings.

## Validaciones locales antes de deploy

- `node --check admin.js` -> OK
- `node --check api/shared/internalModeration.js` -> OK
- `node --check api/shared/publicVisibility.js` -> OK
- `node --check api/shared/publicCatalog.js` -> OK
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
Get-Content docs/MVP_RELEASE_STATUS.md
Get-Content tasks/TASK-353-assignment.md
Get-Content tasks/TASK-351-HANDOFF.md
Get-Content tasks/TASK-352-HANDOFF.md
git status --short
git diff --stat -- <TASK-351-352_FILES>
git diff -- <TASK-351-352_FILES>
node --check admin.js
node --check api/shared/internalModeration.js
node --check api/shared/publicVisibility.js
node --check api/shared/publicCatalog.js
git diff --check -- <TASK-351-352_FILES>
git add -- <TASK-351-352_FILES>
git commit -m "Deploy published image unpublish flow"
git push
Invoke-WebRequest -Uri "https://puntoeventocr.com/admin.html" -Method Get -TimeoutSec 30 -UseBasicParsing
Invoke-WebRequest -Uri "https://puntoeventocr.com/admin.js?v=25" -Method Get -TimeoutSec 30 -UseBasicParsing
az staticwebapp appsettings list --name puntoevento --resource-group resource_group_main -o json
Invoke-WebRequest -Uri "https://puntoeventocr.com/" -Method Get -TimeoutSec 30 -UseBasicParsing
Invoke-WebRequest -Uri "https://puntoeventocr.com/admin.html" -Method Get -TimeoutSec 30 -UseBasicParsing
Invoke-WebRequest -Uri "https://puntoeventocr.com/panel.html" -Method Get -TimeoutSec 30 -UseBasicParsing
Invoke-WebRequest -Uri "https://puntoeventocr.com/api/public/services?limit=50" -Method Get -TimeoutSec 30 -UseBasicParsing
Invoke-WebRequest -Uri "https://puntoeventocr.com/api/internal/services/pending" -Headers <REDACTED_ADMIN_HEADER> -Method Get -TimeoutSec 30 -UseBasicParsing
Invoke-WebRequest -Uri "https://puntoeventocr.com/api/internal/uploads/pending" -Headers <REDACTED_ADMIN_HEADER> -Method Get -TimeoutSec 30 -UseBasicParsing
Invoke-RestMethod -Uri "https://puntoeventocr.com/api/public/services?limit=50" -TimeoutSec 30
```

## Pendientes para QA Azure

- Validar en Admin con credencial real que una imagen `published` muestra accion `Despublicar imagen`.
- Despublicar la unica imagen aprobada de un servicio visible y confirmar que:
  - `Uploads.status` pasa a `rejected`;
  - `Services.status` sigue `published`;
  - `Companies.status` sigue `published`;
  - el servicio desaparece de `GET /api/public/services`;
  - el perfil publico de empresa sigue respondiendo y no muestra ese servicio.
- Despublicar una imagen de varias y confirmar que el servicio sigue visible si queda otra imagen `published` aplicada.
- Confirmar que no se borran blobs y que `publicBlobUrl/publicBlobName` quedan como trazabilidad operativa.
