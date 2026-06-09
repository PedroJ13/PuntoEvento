# TASK-246: Infra Azure - deploy ajustes visuales publicos y login admin

## Equipo asignado

Infra Azure.

## Contexto

`TASK-245` debe aprobar local/estructuralmente los ajustes visuales publicos y el manejo de credenciales admin invalidas antes de desplegar.

## Tarea

Desplegar a Azure los ajustes aprobados.

## Alcance

1. Confirmar que `tasks/TASK-245-HANDOFF.md` existe y aprueba o aprueba con observaciones no bloqueantes.
2. Confirmar archivos/versiones/cache busting desde:
   - `tasks/TASK-242-HANDOFF.md`;
   - `tasks/TASK-243-HANDOFF.md`;
   - `tasks/TASK-244-HANDOFF.md`.
3. Publicar en Azure Static Web Apps / Azure Functions segun corresponda.
4. Verificar que Azure sirve:
   - `/`;
   - `/#bodas`;
   - `/admin.html`;
   - `/panel.html`;
   - `/api/public/services?limit=1`;
   - assets CSS/JS nuevos;
   - endpoints internos/admin saludables sin imprimir secretos.

## No tocar

- No cambiar app settings.
- No rotar secretos.
- No limpiar datos.
- No cambiar dominio/DNS.
- No ampliar alcance.

## Verificacion

- Commit/branch desplegado identificado.
- Static Web Apps queda `Ready`.
- Assets/versiones nuevos visibles.
- API publica `200`.
- Admin sigue servido.
- No se imprimen secretos.

## Handoff esperado

Crear `tasks/TASK-246-HANDOFF.md` con:

- Commit/branch desplegado.
- Assets/versiones observadas.
- Smokes ejecutados.
- Riesgos.
- Recomendacion para QA `TASK-247`.
