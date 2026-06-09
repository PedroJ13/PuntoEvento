# TASK-240: Infra Azure - deploy refresh visual publico

## Equipo asignado

Infra Azure.

## Contexto

`TASK-239` debe aprobar local/estructuralmente el refresh visual publico antes de desplegar.

## Tarea

Desplegar a Azure el refresh visual de pagina publica y ficha publica de empresa/proveedor.

## Alcance

1. Confirmar que `tasks/TASK-239-HANDOFF.md` existe y aprueba o aprueba con observaciones no bloqueantes.
2. Confirmar archivos/versiones/cache busting desde `TASK-238-HANDOFF.md`.
3. Publicar en Azure Static Web Apps.
4. Verificar que Azure sirve:
   - `/`;
   - `/panel.html`;
   - `/admin.html`;
   - `/api/public/services?limit=1`;
   - CSS/JS con versiones nuevas si aplica;
   - asset de logo publico si aplica.

## No tocar

- No cambiar backend/API.
- No cambiar app settings.
- No rotar secretos.
- No limpiar datos.
- No cambiar dominio ni DNS.
- No ampliar alcance visual.

## Verificacion

- Commit/branch desplegado identificado.
- Static Web Apps queda `Ready`.
- Assets/versiones nuevos visibles en Azure.
- Smokes basicos pasan.
- API publica responde `200`.

## Handoff esperado

Crear `tasks/TASK-240-HANDOFF.md` con:

- Commit/branch desplegado.
- Assets/versiones observadas.
- Smokes ejecutados.
- Riesgos.
- Recomendacion para QA `TASK-241`.
