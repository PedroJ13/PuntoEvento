# TASK-277 HANDOFF: deploy fix overflow ficha publica

## Resumen

Infra Azure desplego a Azure Static Web Apps el fix aprobado en `TASK-276` para cerrar el overflow horizontal de ficha publica detectado en `TASK-274`.

- Ambiente: `https://zealous-field-08fdd720f.7.azurestaticapps.net`
- Static Web App: `puntoevento`
- Resource group: `resource_group_main`
- Resultado: deploy servido y smokes basicos OK.
- Datos Azure: no modificados.
- App settings/secretos/dominio/DNS: no modificados.
- Secretos/tokens/cookies/SAS/connection strings: no impresos.

## Precondiciones revisadas

- `tasks/TASK-276-HANDOFF.md` existe.
- `TASK-276` aprobo local/estructuralmente.
- QA recomendo go para deploy del fix de `TASK-275`.
- `TASK-276` confirmo que no hubo cambios API/backend: `git diff --name-only -- api data` sin archivos.

## Commit / branch desplegado

- Branch: `main`
- Commit: `7ee2ab5bec203f4a09d4981de9c78446c766b0d8`
- Mensaje: `Deploy public profile overflow fix`
- Push: `origin/main` actualizado al mismo SHA.
- Commit anterior desplegado: `7286682ba6719eec16c92164dc68955b089b17eb`

## Archivos incluidos en el deploy

- `index.html`
- `styles.css`

No se incluyeron cambios documentales ni archivos no relacionados que ya estaban modificados/no rastreados en el workspace.

## Assets / versiones servidas por Azure

| Ruta | Status | Evidencia |
|---|---:|---|
| `/` | 200 | contiene `styles.css?v=27` y `app.js?v=33`; ya no contiene `styles.css?v=26` |
| `/#bodas` | 200 | ruta estatica servida |
| `/panel.html` | 200 | smoke basico OK |
| `/admin.html` | 200 | smoke basico OK |
| `/api/public/services?limit=50` | 200 | `items=0` |
| `/styles.css?v=27` | 200 | contiene `flex-wrap: wrap` y `overflow-wrap: anywhere` |

Static Web Apps:

| Campo | Valor |
|---|---|
| Environment | `default` |
| Status | `Ready` |
| Source branch | `main` |
| LastUpdatedOn | `2026-06-08T22:26:25.317847+00:00` |

## Smokes ejecutados

Locales antes del commit:

| Check | Resultado |
|---|---|
| `git diff --check -- index.html styles.css` | OK, solo warnings LF/CRLF de Windows |
| `git diff --name-only -- api data app.js panel.js admin.js` | sin cambios |
| `index.html` referencia `styles.css?v=27` | OK |

Azure post-deploy:

| Check | Resultado |
|---|---|
| `GET /` | 200 |
| `GET /#bodas` | 200 |
| `GET /panel.html` | 200 |
| `GET /admin.html` | 200 |
| `GET /api/public/services?limit=50` | 200, `items=0` |
| `GET /styles.css?v=27` | 200, contiene fix |
| Azure Static Web Apps | `Ready` |

## Seguridad / datos

- No se tocaron datos en Azure Table Storage.
- No se limpiaron tablas.
- No se rotaron credenciales.
- No se cambiaron app settings.
- No se imprimieron secretos, tokens, cookies, SAS ni connection strings.

## Riesgos / pendientes

- QA debe ejecutar `TASK-278` en Azure para revalidar visualmente desktop/mobile que el overflow queda cerrado.
- Esta tarea no uso navegador real ni Playwright contra Azure; solo smokes HTTP y verificacion de version/contenido CSS.
- La API publica sigue devolviendo 0 items por el ambiente limpio.
- El workspace sigue teniendo muchos cambios no relacionados/no rastreados previos; este deploy solo incluyo `index.html` y `styles.css`.

## Comandos usados con secretos redactados

No se imprimieron secretos, tokens, cookies, SAS ni connection strings.

```powershell
git rev-parse --show-toplevel
Get-Content -Raw chat-start/INFRA_AZURE.md
Get-Content -Raw docs/MVP_RELEASE_STATUS.md
Get-Content -Raw tasks/TASK-277-assignment.md
Get-Content -Raw tasks/TASK-276-HANDOFF.md
Get-Content -Raw tasks/TASK-275-HANDOFF.md
git status --short
git diff --stat -- index.html styles.css
git diff --check -- index.html styles.css
git diff --name-only -- api data app.js panel.js admin.js
Select-String -Path index.html -Pattern <asset-version-patterns>
git add -- index.html styles.css
git commit -m "Deploy public profile overflow fix"
git push origin main
git rev-parse HEAD
git rev-parse origin/main
az staticwebapp environment list --name puntoevento --resource-group resource_group_main --output table
Invoke-WebRequest <Azure URL publica/assets/API publica>
```

## Recomendacion para TASK-278

Validar en Azure:

- Ficha publica desktop `1366x768` y mobile.
- Confirmar sin scroll horizontal.
- Confirmar `.contact-note.full-note` y `Ver mas servicios` dentro del viewport.
- Confirmar que WhatsApp/formulario mantienen copy y comportamiento.
