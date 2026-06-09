# TASK-201 HANDOFF: deploy ajustes cliente 2026-06-03

## Resumen

Infra Azure desplego a Azure Static Web Apps el bloque cliente `TASK-193` a `TASK-198`.

- Ambiente: `https://zealous-field-08fdd720f.7.azurestaticapps.net`
- Static Web App: `puntoevento`
- Branch desplegada: `main`
- Commit desplegado: `f3b8951dadf1f8b9210290cadb2bfca4c93c7738`
- Commit corto: `f3b8951`
- Mensaje: `Deploy client feedback adjustments`
- Estado SWA final: `Ready`
- App settings: no modificados.
- Secretos/tokens/cookies/keys/connection strings: no impresos.

## Alcance incluido

El commit incluye los archivos runtime/documentacion de contrato necesarios para el bloque:

| Tarea | Evidencia incluida |
|---|---|
| `TASK-193` | `index.html`, `app.js`, `styles.css` con CTA publico `Contactar`, WhatsApp primario y email/formulario como respaldo. |
| `TASK-194` | `app.js` y `docs/API_CONTRACTS_MVP.md` alineados a contacto/cotizacion con ambos canales. |
| `TASK-195` | `panel.html`, `panel.js`, `panel.css`, `styles.css` con lenguaje simple y accion principal `Guardar y enviar`. |
| `TASK-196` | `admin.html`, `admin.js`, `admin.css`, `styles.css` con admin enfocado en estados reales de empresa/servicios. |
| `TASK-197` | `index.html`, `app.js`, `styles.css` con categorias publicas enfocadas en servicios/resultados. |
| `TASK-198` | `api/shared/email.js` con copy actualizado de emails transaccionales. |

`git show --name-only HEAD` confirma que `api/shared/email.js` esta dentro del commit desplegado.

## Assets/versiones observadas en Azure

HTML servido por Azure:

| Pagina | Status | Versiones esperadas observadas |
|---|---:|---|
| `/index.html` | 200 | `app.js?v=27`, `styles.css?v=20` |
| `/panel.html` | 200 | `panel.js?v=7`, `panel.css?v=8`, `styles.css?v=20` |
| `/admin.html` | 200 | `admin.js?v=18`, `admin.css?v=13`, `styles.css?v=20` |

Assets directos servidos por Azure:

| Asset | Status | Bytes observados |
|---|---:|---:|
| `/app.js?v=27` | 200 | 76310 |
| `/styles.css?v=20` | 200 | 21575 |
| `/panel.js?v=7` | 200 | 31926 |
| `/panel.css?v=8` | 200 | 7433 |
| `/admin.js?v=18` | 200 | 47390 |
| `/admin.css?v=13` | 200 | 13429 |

## Smokes ejecutados

| Smoke | Resultado |
|---|---|
| Static Web Apps environment | `default` / `Ready` / `zealous-field-08fdd720f.7.azurestaticapps.net` |
| `GET /` | 200 |
| `GET /panel.html` | 200 |
| `GET /admin.html` | 200 |
| `GET /api/public/services?limit=5` | 200 |
| Sintaxis `node --check app.js` | OK |
| Sintaxis `node --check panel.js` | OK |
| Sintaxis `node --check admin.js` | OK |
| Sintaxis `node --check api/shared/email.js` | OK |
| `git diff --check` sobre archivos del bloque | OK |

## Backend email

`api/shared/email.js` quedo incluido en el commit `f3b8951dadf1f8b9210290cadb2bfca4c93c7738`, que fue empujado a `origin/main`.

No se ejecuto smoke funcional de email de negocio en esta tarea para no crear datos ni enviar correos adicionales fuera del alcance. La verificacion infra de ACS/base URL ya quedo aprobada en `TASK-199`; QA `TASK-202` debe validar el copy nuevo mediante flujo funcional si lo requiere.

## Riesgos

- No se pudo monitorear GitHub Actions con `gh` porque no esta instalado; se confirmo el deploy por `origin/main`, estado SWA `Ready`, HTML con cache busting esperado y assets/API servidos desde Azure.
- El ambiente publico ya sirve el bloque nuevo; QA debe reintentar `TASK-202` para validar comportamiento integrado y copy real.
- Hay muchos cambios/untracked previos en el workspace no relacionados con este deploy. El commit fue acotado a 11 archivos del bloque `TASK-193` a `TASK-198`.

## Recomendacion para QA TASK-202

Reintentar validacion integrada en Azure usando:

- `https://zealous-field-08fdd720f.7.azurestaticapps.net/`
- `https://zealous-field-08fdd720f.7.azurestaticapps.net/panel.html`
- `https://zealous-field-08fdd720f.7.azurestaticapps.net/admin.html`

Primero confirmar las versiones:

- Publica: `app.js?v=27`, `styles.css?v=20`.
- Panel: `panel.js?v=7`, `panel.css?v=8`, `styles.css?v=20`.
- Admin: `admin.js?v=18`, `admin.css?v=13`, `styles.css?v=20`.

Luego validar flujo funcional cliente 2026-06-03: contacto/WhatsApp, formulario email, categorias/resultados, lenguaje panel, admin por estado real y emails transaccionales.

## Comandos usados

Comandos representativos:

```powershell
git rev-parse --show-toplevel
Get-Content -Raw chat-start/INFRA_AZURE.md
Get-Content -Raw docs/MVP_RELEASE_STATUS.md
Get-Content -Raw tasks/TASK-201-assignment.md
git status --short
git branch --show-current
git rev-parse HEAD
git log --oneline -8
rg -n "app.js\\?v=27|styles.css\\?v=20|panel.js\\?v=7|panel.css\\?v=8|admin.js\\?v=18|admin.css\\?v=13|TASK-193|TASK-194|TASK-195|TASK-196|TASK-197|TASK-198" ...
node --check app.js
node --check panel.js
node --check admin.js
node --check api/shared/email.js
git diff --check -- <archivos-del-bloque>
git add -- index.html app.js styles.css panel.html panel.js panel.css admin.html admin.js admin.css api/shared/email.js docs/API_CONTRACTS_MVP.md
git commit -m "Deploy client feedback adjustments"
git push origin main
git ls-remote origin refs/heads/main
az staticwebapp show --name puntoevento --resource-group resource_group_main
az staticwebapp environment list --name puntoevento --resource-group resource_group_main
Invoke-WebRequest https://zealous-field-08fdd720f.7.azurestaticapps.net/
Invoke-WebRequest https://zealous-field-08fdd720f.7.azurestaticapps.net/panel.html
Invoke-WebRequest https://zealous-field-08fdd720f.7.azurestaticapps.net/admin.html
Invoke-WebRequest https://zealous-field-08fdd720f.7.azurestaticapps.net/api/public/services?limit=5
```

No se rotaron secretos, no se cambiaron app settings y no se limpiaron datos.
