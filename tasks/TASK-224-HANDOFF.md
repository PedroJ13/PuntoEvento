# TASK-224 HANDOFF

Rol: Infra Azure
Fecha: 2026-06-04

## Resultado

Deploy completado en Azure Static Web Apps para el fix visual final del panel empresa y el cierre del P1 de logout del icon button.

Se desplego en conjunto con `TASK-220` porque el renombre a `Punto Evento CR` tambien modificaba `panel.html` / `panel.js`. Por eso Azure sirve la version final `panel.js?v=11`, que incluye el fix de `TASK-222`, en vez de publicar el `panel.js?v=10` intermedio.

## Precondiciones revisadas

- `tasks/TASK-223-HANDOFF.md` existe y aprueba QA local/estructural.
- `TASK-223` reporta P0/P1/P2: ninguno.
- `TASK-222` reporta fix de logout usando `event.target.closest("[data-logout]")`.
- Cache busting esperado por la cadena combinada:
  - `panel.css?v=11`
  - `panel.js?v=11` final, supersede `panel.js?v=10` de `TASK-222` por renombre de marca de `TASK-217`/`TASK-220`.

## Commit / branch

- Branch: `main`
- Commit: `3a56d898b2f35bf04d271bbdb2c62dde632d666b`
- Mensaje: `Deploy brand rename and panel logout fix`
- Push: `origin/main` actualizado al mismo SHA.

## Assets observados en Azure

Base URL:

`https://zealous-field-08fdd720f.7.azurestaticapps.net`

- `/panel.html`: `200`
- `/panel.html` contiene `panel.css?v=11`.
- `/panel.html` contiene `panel.js?v=11`.
- `/panel.html` contiene `Punto Evento CR`.
- `/panel.css?v=11`: `200`
- `/panel.js?v=11`: `200`
- `/panel.js?v=11` contiene `closest("[data-logout]")`.
- `/`: `200`
- `/admin.html`: `200`
- `/api/public/services?limit=1`: `200`

## Smokes / checks ejecutados

Locales antes del deploy:

- `node --check panel.js`: OK
- `git diff --check -- panel.html panel.css panel.js`: OK dentro del set completo de deploy.

Azure:

- Azure Static Web Apps environment: `default` / `Ready`
- `/panel.html`: `200`
- `/panel.css?v=11`: `200`
- `/panel.js?v=11`: `200`
- `/`: `200`
- `/admin.html`: `200`
- `/api/public/services?limit=1`: `200`
- Logout fix servido en asset publicado: `event.target.closest("[data-logout]")` presente.

## Riesgos / observaciones

- QA Azure debe validar interaccion real de logout sobre boton/SVG/path en `TASK-225`.
- El deploy combinado deja el panel con marca final `Punto Evento CR`; no hay deploy separado del estado intermedio `panel.js?v=10`.
- No se cambiaron secretos, storage, blobs ni tablas para esta tarea.

## Recomendacion

Ejecutar `TASK-225` para revalidar en Azure:

- click real sobre icon button de logout, incluyendo SVG/path;
- sidebar/logo/contactanos en desktop/mobile;
- regresion minima de `/`, `/admin.html` y flujo panel esperado.

## Comandos usados

Sin secretos impresos. No se imprimieron tokens, cookies, SAS ni connection strings.

```text
git rev-parse --show-toplevel
git status --short
Select-String ... -Pattern <versiones/marca/logout>
git diff --stat -- <archivos de deploy>
git diff -- <archivos de deploy>
node --check app.js
node --check panel.js
node --check admin.js
node --check api/shared/email.js
node --check api/shared/config.js
node --check api/shared/adminAuth.js
git diff --check -- <archivos de deploy>
git add -- <archivos de deploy>
git commit -m "Deploy brand rename and panel logout fix"
git push origin main
az staticwebapp environment list --name puntoevento --resource-group resource_group_main --output table
Invoke-WebRequest <Azure URL publica/assets/API>
git rev-parse HEAD
git rev-parse origin/main
```
