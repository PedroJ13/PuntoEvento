# TASK-211: Infra Azure - deploy ajustes finales panel empresa

## Equipo asignado

Infra Azure.

## Contexto

`TASK-209` implementa ajustes finales del panel empresa y `TASK-210` debe aprobarlos local/estructuralmente antes de desplegar.

## Tarea

Desplegar a Azure los ajustes finales del panel empresa aprobados por QA.

## Alcance

1. Confirmar que existe `tasks/TASK-210-HANDOFF.md` con resultado aprobado o aprobado con observaciones no bloqueantes.
2. Confirmar los assets/versiones esperadas desde el handoff de Web Dev:
   - `panel.html`;
   - `panel.css`;
   - `panel.js`;
   - cualquier asset local de logo si Web Dev lo agrego.
3. Publicar en Azure Static Web Apps.
4. Verificar que Azure sirve las nuevas versiones/cache busting indicadas por Web Dev.
5. Ejecutar smoke minimo:
   - `/panel.html` HTTP 200;
   - `/` HTTP 200;
   - `/admin.html` HTTP 200;
   - `/api/public/services?limit=1` HTTP 200.

## No tocar

- No cambiar API/backend.
- No rotar secretos.
- No limpiar datos.
- No modificar pagina publica/admin salvo arrastre normal del deploy; si ocurre, documentarlo.
- No ampliar el cambio fuera del panel empresa.

## Verificacion

- Commit/branch desplegado identificado.
- Static Web Apps queda `Ready`.
- Azure sirve los nuevos assets/versiones.
- Smokes HTTP/API basicos pasan.

## Handoff esperado

Crear `tasks/TASK-211-HANDOFF.md` con:

- Commit/branch desplegado.
- Assets/versiones observadas.
- Smokes ejecutados.
- Riesgos.
- Recomendacion para QA `TASK-212`.
