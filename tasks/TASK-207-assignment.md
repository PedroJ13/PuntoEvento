# TASK-207: Infra Azure - deploy refresh visual panel empresa

## Equipo asignado

Infra Azure.

## Contexto

`TASK-205` completo el refresh visual del panel empresa local/estructuralmente. `TASK-206` no aprobo Azure porque el ambiente desplegado todavia sirve la version anterior:

- Esperado: `panel.css?v=9`, `panel.js?v=8`.
- Observado en Azure: `panel.css?v=8`, `panel.js?v=7`.

## Tarea

Desplegar a Azure el refresh visual del panel empresa de `TASK-205`.

## Alcance

1. Confirmar que el deploy incluye:
   - `panel.html`;
   - `panel.css`;
   - `panel.js`.
2. Publicar en Azure Static Web Apps.
3. Verificar que Azure sirve:
   - `/panel.html` con `panel.css?v=9`;
   - `/panel.html` con `panel.js?v=8`.
4. Ejecutar smoke minimo:
   - `/panel.html` HTTP 200;
   - `/` HTTP 200;
   - `/admin.html` HTTP 200;
   - `/api/public/services?limit=1` HTTP 200.
5. No modificar app settings ni secretos.

## No tocar

- No cambiar API/backend.
- No rotar secretos.
- No limpiar datos.
- No modificar pagina publica/admin salvo que el deploy los incluya por arrastre inevitable; si ocurre, documentarlo.
- No ampliar el refresh fuera de panel empresa.

## Verificacion

- Commit/branch desplegado identificado.
- Static Web Apps queda `Ready`.
- Azure sirve `panel.css?v=9` y `panel.js?v=8`.
- Smokes HTTP/API basicos pasan.

## Handoff esperado

Crear `tasks/TASK-207-HANDOFF.md` con:

- Commit/branch desplegado.
- Assets/versiones observadas.
- Smokes ejecutados.
- Riesgos.
- Recomendacion para QA `TASK-208`.

