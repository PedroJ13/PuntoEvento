# TASK-201: Infra Azure - deploy ajustes cliente 2026-06-03

## Equipo asignado

Infra Azure.

## Contexto

`TASK-193` a `TASK-198` quedaron completadas local/estructuralmente, pero `TASK-200` no aprobo Azure porque el ambiente desplegado sigue sirviendo versiones anteriores:

- `index.html`: falta `app.js?v=27` y `styles.css?v=20`.
- `panel.html`: falta `panel.js?v=7`, `panel.css?v=8` y `styles.css?v=20`.
- `admin.html`: falta `admin.js?v=18`, `admin.css?v=13` y `styles.css?v=20`.
- Backend email: falta desplegar cambios de `api/shared/email.js` de `TASK-198`.

## Tarea

Desplegar a Azure el bloque completo de ajustes cliente 2026-06-03 para que QA pueda reintentar la validacion integrada.

## Alcance

1. Confirmar que el deploy incluye los cambios de:
   - `TASK-193`
   - `TASK-194`
   - `TASK-195`
   - `TASK-196`
   - `TASK-197`
   - `TASK-198`
2. Publicar frontend/backend en Azure Static Web Apps.
3. Verificar assets servidos:
   - `app.js?v=27`
   - `styles.css?v=20`
   - `panel.js?v=7`
   - `panel.css?v=8`
   - `admin.js?v=18`
   - `admin.css?v=13`
4. Verificar que `api/shared/email.js` actualizado quedo en el deployment backend.
5. Ejecutar smoke minimo:
   - home publica HTTP 200;
   - `panel.html` HTTP 200;
   - `admin.html` HTTP 200;
   - `/api/public/services?limit=5` HTTP 200;
   - no exponer secretos en salida.

## No tocar

- No rotar secretos.
- No cambiar app settings salvo que el deploy lo requiera y quede justificado.
- No limpiar datos.
- No modificar alcance funcional de las tareas ya completadas.
- No imprimir tokens, cookies, keys, connection strings ni password hashes.

## Verificacion

- Azure sirve los cache busting esperados.
- `origin/main` o branch desplegada contiene los cambios del bloque.
- Static Web Apps queda `Ready`.
- Smoke HTTP/API basico pasa.

## Handoff esperado

Crear `tasks/TASK-201-HANDOFF.md` con:

- Commit/branch desplegado.
- Assets/versiones observadas en Azure.
- Smokes ejecutados.
- Riesgos.
- Recomendacion para QA `TASK-202`.

