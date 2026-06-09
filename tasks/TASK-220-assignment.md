# TASK-220: Infra Azure - deploy renombre Punto Evento CR

## Equipo asignado

Infra Azure.

## Contexto

`TASK-217` y `TASK-218` cambian el nombre visible de marca a `Punto Evento CR`. `TASK-219` debe aprobar local/estructuralmente antes de desplegar.

## Tarea

Desplegar a Azure el renombre de marca aprobado.

## Alcance

1. Confirmar que `tasks/TASK-219-HANDOFF.md` existe y aprueba o aprueba con observaciones no bloqueantes.
2. Confirmar assets/versiones/cache busting esperados desde handoffs.
3. Publicar en Azure Static Web Apps.
4. Verificar que Azure sirve nuevas versiones de frontend y backend si aplica.
5. Ejecutar smoke minimo:
   - `/` HTTP 200;
   - `/panel.html` HTTP 200;
   - `/admin.html` HTTP 200;
   - `/api/public/services?limit=1` HTTP 200.

## No tocar

- No cambiar app settings salvo que Backend/API lo haya documentado como necesario y Product lo apruebe.
- No rotar secretos.
- No limpiar datos.
- No cambiar dominio ni DNS.
- No modificar ACS Email fuera del deploy de codigo.

## Verificacion

- Commit/branch desplegado identificado.
- Static Web Apps queda `Ready`.
- Azure sirve assets/versiones nuevos.
- Smokes basicos pasan.

## Handoff esperado

Crear `tasks/TASK-220-HANDOFF.md` con:

- Commit/branch desplegado.
- Assets/versiones observadas.
- Smokes ejecutados.
- Riesgos.
- Recomendacion para QA `TASK-221`.
