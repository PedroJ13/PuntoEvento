# TASK-277: Infra Azure - deploy fix overflow ficha publica

## Equipo asignado

Infra Azure.

## Contexto

`TASK-276` debe aprobar local/estructuralmente el fix de overflow de ficha publica antes de deploy.

## Tarea

Desplegar a Azure el fix aprobado de `TASK-275`.

## Alcance

1. Confirmar que `TASK-276-HANDOFF.md` aprueba deploy.
2. Revisar diff de archivos tocados.
3. Desplegar a Azure Static Web Apps.
4. Confirmar cache busting servido.
5. Ejecutar smokes:
   - `/`
   - `/#bodas`
   - `/panel.html`
   - `/admin.html`
   - `/api/public/services?limit=50`

## No tocar

- No limpiar datos.
- No cambiar app settings.
- No rotar credenciales.
- No imprimir secretos.

## Verificacion

- Azure sirve assets nuevos.
- API publica responde.
- No se modifica backend/API salvo que `TASK-275` documente algo inesperado.

## Handoff esperado

Crear `tasks/TASK-277-HANDOFF.md` con:

- Commit/branch desplegado.
- Versiones servidas.
- Smokes ejecutados.
- Riesgos o bloqueos.
