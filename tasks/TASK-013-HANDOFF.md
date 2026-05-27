# TASK-013: Boton Restaurar demo en panel empresa

## Equipo

Web Dev.

## Estado

Completada.

## Resumen

Se agrego un control visible `Restaurar demo` en `panel.html` para limpiar los servicios creados durante pruebas y volver a cargar los servicios base del panel empresa demo.

El control usa `confirm()` antes de restaurar y solo reemplaza la llave:

```text
localStorage.puntoEventoDemoServices
```

No afecta otros datos del navegador.

## Objetivo

Evitar que pruebas repetidas acumulen servicios en `localStorage` y permitan a Product/QA volver rapidamente al estado base de la demo.

## Archivos tocados

- `panel.html`
- `panel.js`
- `panel.css`
- `tasks/TASK-013-HANDOFF.md`

## Cambios realizados

- Se agrego boton visible `Restaurar demo` junto a `Agregar servicio`.
- Se agrego confirmacion con `confirm()` antes de borrar/reemplazar datos demo.
- Se agrego funcion `defaultServices()` para clonar los servicios base sin mutar `DEFAULT_SERVICES`.
- Se agrego funcion `restoreDemoServices()` que:
  - reemplaza `state.services` por servicios base,
  - guarda la lista base en `localStorage.puntoEventoDemoServices`,
  - cierra y limpia el formulario si estaba abierto,
  - vuelve a renderizar servicios,
  - muestra mensaje de confirmacion.
- Se agrego mensaje global de panel en `data-panel-message`.
- Se agregaron estilos para agrupar acciones del panel.
- Se actualizaron cache-bust:
  - `panel.css?v=2`
  - `panel.js?v=2`

## Verificacion

- Se leyeron los documentos obligatorios de `tasks/TASK-013-assignment.md`.
- Se verifico `http://127.0.0.1:4173/panel.html` con respuesta HTTP `200`.
- Se valido parseo de `panel.js`.
- Se valido en navegador que:
  - existe el boton `Restaurar demo`,
  - sigue existiendo el boton `Agregar servicio`,
  - `panel.css?v=2` carga en el HTML,
  - `panel.js?v=2` carga en el HTML,
  - no hay errores/warnings de consola capturados.
- Se reviso `git status --short` enfocado en archivos de la tarea.

Nota:

- La prueba completa de crear un servicio, refrescar, hacer click real en `Restaurar demo` y confirmar debe validarla QA manualmente. La automatizacion disponible ya habia presentado timeouts con clicks reales en esta superficie.
- El repo ya tenia cambios previos en `admin.*`, `docs/` y `tasks/`; esta tarea no toco admin, pagina publica ni `/api`.

## Riesgos

- `Restaurar demo` elimina servicios demo creados en el navegador actual, por diseno.
- La restauracion solo aplica a `localStorage.puntoEventoDemoServices`; si en el futuro se agregan mas llaves demo, habra que incluirlas explicitamente.
- `panel.html` sigue siendo una demo estatica sin auth real.
- Los previews de fotos son temporales y no se conservan como imagen real tras recarga.

## Pendientes

- QA debe validar manualmente:
  - crear servicio,
  - refrescar,
  - confirmar que aparece,
  - usar `Restaurar demo`,
  - aceptar el `confirm()`,
  - confirmar que desaparece el servicio creado,
  - confirmar que vuelven los servicios base,
  - revisar consola.
- Product/Architect debe decidir si el reset de demo debe limpiar tambien otros datos futuros del panel.
- Cuando exista API real, este boton debe mantenerse solo para demo/local o protegerse por entorno.

## Recomendacion para Product/Architect

Mantener `Restaurar demo` como herramienta visible para QA/Product mientras el panel siga usando `localStorage`.

Antes de mover a MVP real, recomiendo definir una bandera o entorno demo para que este control no aparezca en un panel productivo con datos reales.
