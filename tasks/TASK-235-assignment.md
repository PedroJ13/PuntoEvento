# TASK-235: Infra Azure - deploy paleta global Punto Evento CR

## Equipo asignado

Infra Azure.

## Contexto

`TASK-234` debe aprobar local/estructuralmente la aplicacion de paleta global antes de desplegar.

## Tarea

Desplegar a Azure los ajustes de paleta global de pagina publica, admin y emails.

## Alcance

1. Confirmar que `tasks/TASK-234-HANDOFF.md` existe y aprueba o aprueba con observaciones no bloqueantes.
2. Confirmar archivos/versiones desde `TASK-232-HANDOFF.md` y `TASK-233-HANDOFF.md`.
3. Publicar en Azure Static Web Apps / Azure Functions segun corresponda.
4. Verificar que Azure sirve:
   - `/`;
   - `/panel.html`;
   - `/admin.html`;
   - `/api/public/services?limit=1`;
   - assets CSS con versiones nuevas si aplica.
5. Si hubo cambios de Functions por emails, confirmar que el API queda saludable.

## No tocar

- No cambiar app settings salvo que el deploy lo requiera por versionado normal.
- No rotar secretos.
- No limpiar datos.
- No cambiar dominio, DNS ni proveedor email.
- No ampliar alcance visual.

## Verificacion

- Commit/branch desplegado identificado.
- Static Web Apps queda `Ready`.
- Assets/versiones nuevos visibles en Azure.
- Smokes basicos pasan.
- API publica responde `200`.

## Handoff esperado

Crear `tasks/TASK-235-HANDOFF.md` con:

- Commit/branch desplegado.
- Assets/versiones observadas.
- Smokes ejecutados.
- Riesgos.
- Recomendacion para QA `TASK-236`.
