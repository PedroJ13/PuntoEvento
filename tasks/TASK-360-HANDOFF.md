# TASK-360 HANDOFF - Infra Azure

## Resumen

Deploy completado de los ajustes visuales publicos post-logica de aprobacion (`TASK-356` a `TASK-358`), aprobados localmente por `TASK-359`.

No se cambiaron API/backend, app settings, infraestructura, CORS, Blob Storage ni datos.

## Commit desplegado

- Branch: `main`
- Commit deploy: `ae196c04cc77bdcdaf907a7c34e4eef4ec95521e`
- Mensaje: `Deploy public visual CTA cleanup`

## Precondicion verificada

- `tasks/TASK-359-HANDOFF.md` existe.
- QA local/estructural recomienda deploy con observacion P3.

## Archivos incluidos en el deploy

- `index.html`
- `app.js`

## Assets / versiones verificadas en produccion

Dominio validado: `https://puntoeventocr.com`

- `GET https://puntoeventocr.com/` -> 200
  - referencia `app.js?v=39`.
- `GET https://puntoeventocr.com/app.js?v=39` -> 200
  - contiene `Contactar empresa`.
  - contiene `Pedir cotización`.
  - no contiene `Solicitar cotización`.
  - no contiene `Comparación rápida de precios` / `Comparacion rapida de precios`.

## Smokes ejecutados

| URL | Status | Asset esperado |
| --- | --- | --- |
| `https://puntoeventocr.com/` | 200 | `app.js?v=39` |
| `https://puntoeventocr.com/proveedores/salones-eventos` | 200 | `app.js?v=39` |
| `https://puntoeventocr.com/proveedores/catering` | 200 | `app.js?v=39` |
| `https://puntoeventocr.com/proveedores/fotografia-video` | 200 | `app.js?v=39` |
| `https://puntoeventocr.com/proveedores/musica-dj` | 200 | `app.js?v=39` |
| `https://puntoeventocr.com/proveedores/decoracion` | 200 | `app.js?v=39` |
| `https://puntoeventocr.com/proveedores/pasteleria-reposteria` | 200 | `app.js?v=39` |
| `https://puntoeventocr.com/#bodas` | 200 | `app.js?v=39` |
| `https://puntoeventocr.com/#empresas` | 200 | `app.js?v=39` |
| `https://puntoeventocr.com/#proveedor/aurisbel-pasteleria-341388` | 200 | `app.js?v=39` |
| `https://puntoeventocr.com/api/public/services?limit=50` | 200 | API publica |

API publica:

- `GET https://puntoeventocr.com/api/public/services?limit=50` -> 200.
- Devuelve 3 servicios publicos al momento del smoke.

## Validaciones antes de deploy

- `node --check app.js` -> OK.
- `git diff --check -- app.js index.html` -> OK, solo warnings normales CRLF en Windows.
- Revision de copy en `index.html` / `app.js`:
  - `app.js?v=39` presente.
  - `Contactar empresa` presente.
  - `Pedir cotización` presente.
  - textos antiguos principales ausentes.

## App settings / recursos

- App settings: sin cambios.
- Recursos Azure: sin cambios.
- CORS/Blob Storage: sin cambios.
- Secretos: no rotados.
- Datos: sin cambios.

## Comandos usados

No se imprimieron secretos, tokens, cookies, SAS ni connection strings.

```powershell
git rev-parse --show-toplevel
Get-Content AGENTS.md
Get-Content chat-start/INFRA_AZURE.md
Get-Content docs/MVP_RELEASE_STATUS.md
Get-Content tasks/TASK-360-assignment.md
Get-Content tasks/TASK-359-HANDOFF.md -TotalCount 80
git status --short
git diff --stat -- app.js index.html
git diff -- app.js index.html
node --check app.js
rg -n "Comparacion rapida de precios|Comparación rápida de precios|Paquetes de boda|Elegir servicio|Solicitar cotizaci[oó]n|Enviar por formulario|Contactar empresa|Pedir cotizaci[oó]n|app\\.js\\?v=" index.html app.js
git diff --check -- app.js index.html
git add -- app.js index.html
git commit -m "Deploy public visual CTA cleanup"
git push
Invoke-WebRequest -Uri "https://puntoeventocr.com/" -Method Get -TimeoutSec 30 -UseBasicParsing
Invoke-WebRequest -Uri "https://puntoeventocr.com/app.js?v=39" -Method Get -TimeoutSec 30 -UseBasicParsing
Invoke-WebRequest -Uri "https://puntoeventocr.com/proveedores/salones-eventos" -Method Get -TimeoutSec 30 -UseBasicParsing
Invoke-WebRequest -Uri "https://puntoeventocr.com/proveedores/catering" -Method Get -TimeoutSec 30 -UseBasicParsing
Invoke-WebRequest -Uri "https://puntoeventocr.com/proveedores/fotografia-video" -Method Get -TimeoutSec 30 -UseBasicParsing
Invoke-WebRequest -Uri "https://puntoeventocr.com/proveedores/musica-dj" -Method Get -TimeoutSec 30 -UseBasicParsing
Invoke-WebRequest -Uri "https://puntoeventocr.com/proveedores/decoracion" -Method Get -TimeoutSec 30 -UseBasicParsing
Invoke-WebRequest -Uri "https://puntoeventocr.com/proveedores/pasteleria-reposteria" -Method Get -TimeoutSec 30 -UseBasicParsing
Invoke-WebRequest -Uri "https://puntoeventocr.com/#bodas" -Method Get -TimeoutSec 30 -UseBasicParsing
Invoke-WebRequest -Uri "https://puntoeventocr.com/#empresas" -Method Get -TimeoutSec 30 -UseBasicParsing
Invoke-WebRequest -Uri "https://puntoeventocr.com/#proveedor/aurisbel-pasteleria-341388" -Method Get -TimeoutSec 30 -UseBasicParsing
Invoke-WebRequest -Uri "https://puntoeventocr.com/api/public/services?limit=50" -Method Get -TimeoutSec 30 -UseBasicParsing
Invoke-RestMethod -Uri "https://puntoeventocr.com/api/public/services?limit=50" -TimeoutSec 30
git rev-parse HEAD
```

## Pendientes para QA Azure

- Ejecutar `TASK-361` contra `https://puntoeventocr.com`.
- Validar visualmente en Azure:
  - home sin comparacion/paquetes;
  - cards/listado con `Contactar empresa` y `Pedir cotización`;
  - ficha publica con mismos CTAs;
  - rutas limpias funcionando con render completo, no solo HTML fallback;
  - hashes legacy principales sin regresion;
  - desktop/mobile sin overflow.
