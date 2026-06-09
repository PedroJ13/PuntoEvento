# TASK-224: Infra Azure - deploy fix visual final panel empresa desbloqueado

## Equipo asignado

Infra Azure.

## Contexto

`TASK-215` quedo bloqueada porque `TASK-214` no aprobo. `TASK-222`/`TASK-223` deben cerrar el P1 de logout antes de desplegar.

## Tarea

Desplegar a Azure el fix visual final del panel empresa una vez QA local apruebe.

## Alcance

1. Confirmar que `tasks/TASK-223-HANDOFF.md` existe y aprueba o aprueba con observaciones no bloqueantes.
2. Confirmar versiones/cache busting esperadas desde `TASK-222-HANDOFF.md`.
3. Publicar en Azure Static Web Apps.
4. Verificar que Azure sirve assets nuevos del panel.
5. Ejecutar smoke minimo:
   - `/panel.html` HTTP 200;
   - `/panel.html` contiene assets/versiones nuevas;
   - `/` HTTP 200;
   - `/admin.html` HTTP 200;
   - `/api/public/services?limit=1` HTTP 200.

## No tocar

- No cambiar app settings.
- No rotar secretos.
- No limpiar datos.
- No ampliar cambios fuera del panel empresa.

## Verificacion

- Commit/branch desplegado identificado.
- Static Web Apps queda `Ready`.
- Azure sirve assets/versiones nuevos.
- Smokes basicos pasan.

## Handoff esperado

Crear `tasks/TASK-224-HANDOFF.md` con:

- Commit/branch desplegado.
- Assets/versiones observadas.
- Smokes ejecutados.
- Riesgos.
- Recomendacion para QA `TASK-225`.
