# TASK-215: Infra Azure - deploy fix visual final panel empresa

## Equipo asignado

Infra Azure.

## Contexto

`TASK-213` corrige el overflow del sidebar del panel empresa, convierte botones superiores a icon buttons e integra mejor el fondo del logo. `TASK-214` debe aprobarlo local/estructuralmente antes de desplegar.

## Tarea

Desplegar a Azure el fix visual final del panel empresa.

## Alcance

1. Confirmar que `tasks/TASK-214-HANDOFF.md` existe y aprueba el fix o lo aprueba con observaciones no bloqueantes.
2. Confirmar versiones/cache busting esperadas desde `TASK-213-HANDOFF.md`.
3. Publicar en Azure Static Web Apps.
4. Verificar que Azure sirve los assets nuevos.
5. Ejecutar smoke minimo:
   - `/panel.html` HTTP 200;
   - `/panel.css` version nueva HTTP 200;
   - `/panel.js` si cambio, version nueva HTTP 200;
   - `/` HTTP 200;
   - `/admin.html` HTTP 200.

## No tocar

- No cambiar API/backend.
- No rotar secretos.
- No limpiar datos.
- No ampliar cambios fuera del panel empresa.

## Verificacion

- Commit/branch desplegado identificado.
- Static Web Apps queda `Ready`.
- Azure sirve assets/versiones nuevos.
- Smokes basicos pasan.

## Handoff esperado

Crear `tasks/TASK-215-HANDOFF.md` con:

- Commit/branch desplegado.
- Assets/versiones observadas.
- Smokes ejecutados.
- Riesgos.
- Recomendacion para QA `TASK-216`.
