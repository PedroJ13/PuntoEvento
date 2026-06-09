# TASK-220 HANDOFF

Rol: Infra Azure
Fecha: 2026-06-04

## Resultado

Deploy completado en Azure Static Web Apps para el renombre visible a `Punto Evento CR`.

Se desplego en conjunto con `TASK-224` porque ambos cambios aprobados tocaban `panel.html` / `panel.js` y el asset final del panel debia quedar en una sola version consistente.

## Commit / branch

- Branch: `main`
- Commit: `3a56d898b2f35bf04d271bbdb2c62dde632d666b`
- Mensaje: `Deploy brand rename and panel logout fix`
- Push: `origin/main` actualizado al mismo SHA.

## App settings

Se reviso `NOTIFICATION_EMAIL_FROM_NAME` sin imprimir el listado completo de app settings.

- Estado previo observado: `Punto Evento`
- Accion: actualizado a `Punto Evento CR`
- Estado posterior observado: `Punto Evento CR`

No se modificaron otros app settings.

## Assets / versiones observadas en Azure

Base URL:

`https://zealous-field-08fdd720f.7.azurestaticapps.net`

- `/` responde `200`.
- `/` contiene `app.js?v=28`.
- `/` contiene `Punto Evento CR`.
- `/app.js?v=28` responde `200`.
- `/app.js?v=28` contiene `Punto Evento CR`.
- `/panel.html` responde `200`.
- `/panel.html` contiene `panel.css?v=11`.
- `/panel.html` contiene `panel.js?v=11`.
- `/panel.html` contiene `Punto Evento CR`.
- `/panel.js?v=11` responde `200`.
- `/panel.js?v=11` contiene `Punto Evento CR`.
- `/admin.html` responde `200`.
- `/admin.html` contiene `Admin | Punto Evento CR`.
- `/api/public/services?limit=1` responde `200`.

Revisiones anti-regresion de marca sobre assets frontend servidos:

- `/`: 0 coincidencias de `Punto Evento` sin `CR`.
- `/app.js?v=28`: 0 coincidencias de `Punto Evento` sin `CR`.
- `/panel.html`: 0 coincidencias de `Punto Evento` sin `CR`.
- `/panel.js?v=11`: 0 coincidencias de `Punto Evento` sin `CR`.
- `/admin.html`: 0 coincidencias de `Punto Evento` sin `CR`.

Nota: el logo raster de referencia puede contener arte visual interno anterior; queda como observacion P3 ya registrada por QA.

## Smokes / checks ejecutados

Locales antes del deploy:

- `node --check app.js`: OK
- `node --check panel.js`: OK
- `node --check admin.js`: OK
- `node --check api/shared/email.js`: OK
- `node --check api/shared/config.js`: OK
- `node --check api/shared/adminAuth.js`: OK
- `git diff --check -- <archivos de deploy>`: OK

Azure:

- Azure Static Web Apps environment: `default` / `Ready`
- `/`: `200`
- `/panel.html`: `200`
- `/admin.html`: `200`
- `/api/public/services?limit=1`: `200`
- Assets cache-busted esperados: `app.js?v=28`, `panel.css?v=11`, `panel.js?v=11`

## Riesgos / observaciones

- Validacion funcional final queda para QA Azure en `TASK-221`.
- Backend/email fue desplegado por codigo y `NOTIFICATION_EMAIL_FROM_NAME` se corrigio en app settings; no se ejecuto envio real de correo en esta tarea para evitar datos/efectos no pedidos.
- El deploy fue combinado con `TASK-224`; esto evita publicar una version intermedia del panel y deja `panel.js?v=11` como version final.

## Recomendacion

Ejecutar `TASK-221` contra Azure para validar marca `Punto Evento CR` en pagina publica, panel, admin y emails/acciones que QA considere seguras.

## Comandos usados

Sin secretos impresos. App settings sensibles no se volcaron.

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
az staticwebapp appsettings list --name puntoevento --resource-group resource_group_main --output json
az staticwebapp appsettings set --name puntoevento --resource-group resource_group_main --setting-names NOTIFICATION_EMAIL_FROM_NAME="<valor no secreto>"
git add -- <archivos de deploy>
git commit -m "Deploy brand rename and panel logout fix"
git push origin main
az staticwebapp environment list --name puntoevento --resource-group resource_group_main --output table
Invoke-WebRequest <Azure URL publica/assets/API>
git rev-parse HEAD
git rev-parse origin/main
```
