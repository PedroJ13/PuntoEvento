# TASK-229 HANDOFF

Rol: Infra Azure
Fecha: 2026-06-04

## Resultado

Deploy completado en Azure Static Web Apps para el nuevo logo `Punto Evento CR` del panel empresa.

No se modificaron app settings, secretos, backend/API, datos, dominio ni DNS.

## Precondiciones revisadas

- `tasks/TASK-228-HANDOFF.md` existe.
- `TASK-228` aprobo local/estructuralmente con observaciones no bloqueantes.
- No hay P0/P1/P2 nuevos segun QA.
- `TASK-227` define las versiones/cache busting:
  - `panel.css?v=12`
  - `panel.js?v=11`
  - asset `assets/images/logo-punto-evento-cr-panel.png`

## Commit / branch

- Branch: `main`
- Commit: `28d731bfd98ec1e18c96848ed8ab7a69ce4f3dcc`
- Mensaje: `Deploy panel logo refresh`
- Push: `origin/main` actualizado al mismo SHA.

## Archivos desplegados

- `panel.html`
- `panel.css`
- `assets/images/logo-punto-evento-cr-panel.png`

Asset local:

- Ruta: `assets/images/logo-punto-evento-cr-panel.png`
- Peso: `288158` bytes
- SHA256: `1FD084114150A591C1B783B3F2F7C796E6E7756F5A0E61396B0E9D83B1981A71`

## Assets / versiones observadas en Azure

Base URL:

`https://zealous-field-08fdd720f.7.azurestaticapps.net`

- `/panel.html`: `200`
- `/panel.html` contiene `panel.css?v=12`.
- `/panel.html` contiene `panel.js?v=11`.
- `/panel.html` contiene `assets/images/logo-punto-evento-cr-panel.png`.
- `/panel.html` sirve `alt="Punto Evento CR"`.
- `/assets/images/logo-punto-evento-cr-panel.png`: `200`
- Logo servido con `288158` bytes.
- `/panel.css?v=12`: `200`
- `/panel.js?v=11`: `200`
- `/`: `200`
- `/admin.html`: `200`
- `/api/public/services?limit=1`: `200`

Static Web Apps:

- Environment: `default`
- Status: `Ready`
- Hostname: `zealous-field-08fdd720f.7.azurestaticapps.net`
- Source branch: `main`

## Smokes / checks ejecutados

Locales antes del deploy:

- `node --check panel.js`: OK
- `git diff --check -- panel.html panel.css assets/images/logo-punto-evento-cr-panel.png`: OK

Azure post-deploy:

- `az staticwebapp environment list`: `Ready`
- `/panel.html`: `200`
- `/panel.css?v=12`: `200`
- `/panel.js?v=11`: `200`
- `/assets/images/logo-punto-evento-cr-panel.png`: `200`
- `/`: `200`
- `/admin.html`: `200`
- `/api/public/services?limit=1`: `200`

## Riesgos / observaciones

- QA debe validar visualmente en Azure que el PNG no muestra patron falso ni fondo montado evidente en desktop/mobile.
- El asset sigue siendo raster derivado de JPEG, no SVG/vector definitivo; riesgo aceptado como P3 en `TASK-228`.
- El tagline puede verse pequeno en mobile; QA lo acepto como no bloqueante localmente.

## Recomendacion para QA TASK-230

Ejecutar `TASK-230` contra Azure para validar:

- logo visible `Punto Evento CR`;
- PNG servido desde `assets/images/logo-punto-evento-cr-panel.png`;
- `panel.css?v=12` y `panel.js?v=11`;
- desktop/mobile sin overflow;
- regresion minima de panel, `/`, `/admin.html` y `/api/public/services?limit=1`.

## Comandos usados

Sin secretos impresos. No se usaron ni imprimieron tokens, cookies, SAS ni connection strings.

```text
git rev-parse --show-toplevel
git status --short
Get-Content tasks/TASK-229-assignment.md
Get-Content tasks/TASK-227-HANDOFF.md
Get-Content tasks/TASK-228-HANDOFF.md
Get-Content chat-start/INFRA_AZURE.md
git diff --stat -- panel.html panel.css assets/images/logo-punto-evento-cr-panel.png
git diff -- panel.html panel.css
Get-Item assets/images/logo-punto-evento-cr-panel.png
Get-FileHash assets/images/logo-punto-evento-cr-panel.png -Algorithm SHA256
Select-String -Path panel.html,panel.css -Pattern <versiones/logo/css>
node --check panel.js
git diff --check -- panel.html panel.css assets/images/logo-punto-evento-cr-panel.png
git add -- panel.html panel.css assets/images/logo-punto-evento-cr-panel.png
git commit -m "Deploy panel logo refresh"
git push origin main
az staticwebapp environment list --name puntoevento --resource-group resource_group_main --output table
Invoke-WebRequest <Azure URL publica/assets/API>
git rev-parse HEAD
git rev-parse origin/main
```
