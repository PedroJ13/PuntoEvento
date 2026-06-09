# TASK-265: Infra Azure - deploy fix catalogo vacio publico

## Equipo asignado

Infra Azure.

## Contexto

`TASK-264` quedo completado local/estructuralmente por Web Dev.

Cambio principal:

- En productivo, cuando `/api/public/services` responde OK pero `items.length === 0`, la pagina publica ya no debe mostrar la banda estatica de paquetes/proveedores de referencia.
- Cache busting esperado: `app.js?v=32`.

## Tarea

Desplegar a Azure el fix de `TASK-264`.

## Alcance

- `app.js`
- `index.html`
- Verificar que Azure sirva `app.js?v=32`.

## No tocar

- No modificar datos Azure.
- No limpiar tablas.
- No rotar secretos.
- No cambiar app settings.
- No mezclar cambios no relacionados.

## Verificacion

- `/` responde `200`.
- `/app.js?v=32` responde `200`.
- `index.html` servido por Azure referencia `app.js?v=32`.
- `/api/public/services?limit=50` sigue respondiendo `200` con `0` items en ambiente limpio.

## Handoff esperado

Crear `tasks/TASK-265-HANDOFF.md` con:

- Commit/branch desplegado.
- Assets/versiones servidas por Azure.
- Smokes ejecutados.
- Confirmacion de que no se tocaron datos ni secretos.
- Riesgos.
