# TASK-229: Infra Azure - deploy nuevo logo Punto Evento CR

## Equipo asignado

Infra Azure.

## Contexto

`TASK-228` debe aprobar local/estructuralmente el nuevo logo `Punto Evento CR` antes de desplegar.

## Tarea

Desplegar a Azure el nuevo logo del panel empresa.

## Alcance

1. Confirmar que `tasks/TASK-228-HANDOFF.md` existe y aprueba o aprueba con observaciones no bloqueantes.
2. Confirmar assets/versiones/cache busting desde `TASK-227-HANDOFF.md`.
3. Publicar en Azure Static Web Apps.
4. Verificar que Azure sirve:
   - `/panel.html` con assets/versiones nuevas;
   - el asset del logo nuevo;
   - `/`, `/admin.html`, `/api/public/services?limit=1` con HTTP 200.
5. No modificar app settings ni secretos.

## No tocar

- No cambiar backend/API.
- No rotar secretos.
- No limpiar datos.
- No cambiar dominio ni DNS.
- No ampliar cambios fuera del logo/panel.

## Verificacion

- Commit/branch desplegado identificado.
- Static Web Apps queda `Ready`.
- Azure sirve asset/versiones nuevos.
- Smokes basicos pasan.

## Handoff esperado

Crear `tasks/TASK-229-HANDOFF.md` con:

- Commit/branch desplegado.
- Assets/versiones observadas.
- Smokes ejecutados.
- Riesgos.
- Recomendacion para QA `TASK-230`.
