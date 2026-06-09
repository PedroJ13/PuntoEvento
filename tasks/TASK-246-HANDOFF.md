# TASK-246 HANDOFF

Rol: Infra Azure
Fecha: 2026-06-05

## Resultado

Deploy completado en Azure Static Web Apps / Azure Functions para los ajustes finales visuales publicos y el manejo de credenciales admin invalidas sin prompt nativo.

No se modificaron app settings, secretos, datos, dominio ni DNS. No se imprimieron credenciales reales.

## Precondiciones revisadas

- `tasks/TASK-245-HANDOFF.md` existe.
- `TASK-245` aprobo local/estructuralmente con observaciones P3 no bloqueantes.
- `TASK-242` define ajustes publicos:
  - `index.html`
  - `styles.css`
  - `styles.css?v=23`
  - `app.js?v=28` se mantiene.
- `TASK-243` define ajuste backend/admin auth:
  - `api/shared/adminAuth.js`
  - `401` JSON `{ "error": "Credenciales invalidas" }`
  - sin `WWW-Authenticate`
  - contrato actualizado en `docs/API_CONTRACTS_MVP.md`
- `TASK-244` define ajuste UI admin:
  - `admin.html`
  - `admin.js`
  - `admin.js?v=19`
  - `styles.css?v=21` y `admin.css?v=14` se mantienen en admin.

## Commit / branch

- Branch: `main`
- Commit: `1cd2a6ffaa1d9897b9fcafd6a1268a3d47605c87`
- Mensaje: `Deploy public tweaks and admin auth handling`
- Push: `origin/main` actualizado al mismo SHA.

## Archivos desplegados

- `index.html`
- `styles.css`
- `admin.html`
- `admin.js`
- `api/shared/adminAuth.js`
- `docs/API_CONTRACTS_MVP.md`

Nota: `docs/ROUTE_MAP_MVP.md` aparece no rastreado en el workspace y no fue incluido en este deploy para no mezclar alcance.

## Assets / versiones observadas en Azure

Base URL:

`https://zealous-field-08fdd720f.7.azurestaticapps.net`

- `/`: `200`
- `/` contiene `styles.css?v=23`.
- `/` contiene `app.js?v=28`.
- Nav publico ya no contiene links visibles `Servicios` ni `Proveedor`.
- `/styles.css?v=23`: `200`
- `/styles.css?v=23` contiene ajustes de ficha para nombre largo:
  - `minmax(360px, 420px)`
  - `overflow-wrap: anywhere`
- `/admin.html`: `200`
- `/admin.html` contiene `admin.js?v=19`.
- `/admin.html` contiene `role="status"` en mensaje de login.
- `/admin.js?v=19`: `200`
- `/admin.js?v=19` contiene `Credenciales invalidas. Verifica usuario y password.`
- `/admin.js?v=19` contiene `X-Punto-Admin-Credential`.
- `/admin.js?v=19` elimina defensivamente `Authorization`.
- `/panel.html`: `200`
- `/api/public/services?limit=1`: `200`

Static Web Apps:

- Environment: `default`
- Status: `Ready`
- Hostname: `zealous-field-08fdd720f.7.azurestaticapps.net`
- Source branch: `main`

## Smokes / checks ejecutados

Locales antes del deploy:

- `node --check app.js`: OK
- `node --check admin.js`: OK
- `node --check api/shared/adminAuth.js`: OK
- `git diff --check -- index.html styles.css app.js admin.html admin.css admin.js api/shared/adminAuth.js docs/API_CONTRACTS_MVP.md`: OK
- `rg -n "WWW-Authenticate" api admin.js admin.html`: sin matches
- Smoke estructural con env dummy local:
  - credencial faltante -> `401`, `Credenciales invalidas`, sin `WWW-Authenticate`
  - credencial invalida -> `401`, `Credenciales invalidas`, sin `WWW-Authenticate`
  - credencial valida -> helper permite continuar

Azure post-deploy:

- `az staticwebapp environment list`: `Ready`
- `/`: `200`
- `/styles.css?v=23`: `200`
- `/admin.html`: `200`
- `/admin.js?v=19`: `200`
- `/panel.html`: `200`
- `/api/public/services?limit=1`: `200`
- `/api/internal/companies/pending` sin credenciales:
  - status `401`
  - body contiene `Credenciales invalidas`
  - sin header `WWW-Authenticate`

## Seguridad / secretos

- No se consultaron ni imprimieron credenciales admin reales.
- No se imprimieron tokens, cookies, SAS ni connection strings.
- La prueba de endpoint interno se hizo sin credenciales para validar el error controlado.

## Riesgos / observaciones

- QA debe validar en navegador real Azure que no aparece prompt nativo del navegador con credenciales invalidas.
- QA debe validar con credencial admin real/controlada que login correcto sigue cargando el admin y acciones protegidas.
- El logo publico sigue siendo raster, no vector definitivo.
- `overflow-wrap: anywhere` puede cortar palabras extremadamente largas solo como defensa contra overflow.

## Recomendacion para QA TASK-247

Ejecutar `TASK-247` contra Azure para validar:

- `/` y `/#bodas` con nav reducido, logo grande y `styles.css?v=23`.
- Ficha publica con nombre largo sin desbordes.
- Drawer de contacto/cotizacion desde home, resultados y ficha.
- `/admin.html` con `admin.js?v=19`.
- Credenciales invalidas sin prompt nativo y con mensaje inline.
- Credenciales validas siguen entrando al admin y cargando modelo nuevo/listados.
- `/panel.html` sin regresion basica.

## Comandos usados

Sin secretos impresos. No se usaron ni imprimieron tokens, cookies, SAS ni connection strings.

```text
git rev-parse --show-toplevel
git status --short
Get-Content tasks/TASK-246-assignment.md
Get-Content tasks/TASK-242-HANDOFF.md
Get-Content tasks/TASK-243-HANDOFF.md
Get-Content tasks/TASK-244-HANDOFF.md
Get-Content tasks/TASK-245-HANDOFF.md
git diff --stat -- index.html styles.css admin.html admin.js api/shared/adminAuth.js docs/API_CONTRACTS_MVP.md
git diff -- index.html styles.css admin.html admin.js api/shared/adminAuth.js docs/API_CONTRACTS_MVP.md
Select-String -Path index.html,styles.css,admin.html,admin.js,api/shared/adminAuth.js,docs/API_CONTRACTS_MVP.md -Pattern <versiones/auth/admin>
node --check app.js
node --check admin.js
node --check api/shared/adminAuth.js
git diff --check -- <archivos de deploy>
rg -n "WWW-Authenticate" api admin.js admin.html
node -e <smoke estructural adminAuth con env dummy>
git add -- index.html styles.css admin.html admin.js api/shared/adminAuth.js docs/API_CONTRACTS_MVP.md
git commit -m "Deploy public tweaks and admin auth handling"
git push origin main
az staticwebapp environment list --name puntoevento --resource-group resource_group_main --output table
Invoke-WebRequest <Azure URL publica/assets/API/internal sin credenciales>
git rev-parse HEAD
git rev-parse origin/main
```
