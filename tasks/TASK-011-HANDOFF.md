# TASK-011: Crear panel empresa demo para servicios

## Equipo

Web Dev.

## Estado

Completada.

## Resumen

Se creo una superficie separada para el panel empresa demo:

```text
panel.html
panel.js
panel.css
```

El panel permite a una empresa demo gestionar servicios con catalogos controlados, fotos con preview local, persistencia en `localStorage` y accion para enviar un servicio a revision (`status = pending`).

Tambien se ajusto `admin.html` para que deje de mostrarse como lugar de creacion/edicion de servicios. Admin queda orientado a revision interna y enlaza al panel empresa demo.

## Objetivo

Crear una demo separada de panel empresa para que una empresa pueda crear/editar servicios, sin mezclar este flujo con el admin interno.

## Archivos tocados

- `panel.html`
- `panel.js`
- `panel.css`
- `data/event-types.json`
- `admin.html`
- `admin.js`
- `admin.css`
- `tasks/TASK-011-HANDOFF.md`

## Cambios realizados

- Se creo `panel.html` con encabezado `Panel empresa demo`.
- Se agrego resumen de empresa demo `Aurisbel Eventos`.
- Se agrego lista de servicios existentes usando `localStorage` compartido con la llave `puntoEventoDemoServices`.
- Se agrego formulario de crear/editar servicio con:
  - nombre,
  - categoria como select controlado,
  - tipos de evento como opciones multiples,
  - precio desde,
  - estado,
  - descripcion,
  - fotos con preview local.
- Se agrego accion `Enviar a revision`, que guarda el servicio con `status = pending`.
- Se agrego mensaje claro: `Esta demo no guarda en Azure todavia.`
- Se agrego `data/event-types.json` como catalogo estatico versionado de tipos de evento.
- `panel.js` carga catalogos desde:
  - `data/categories.json`
  - `data/event-types.json`
- Se mantiene fallback local si los JSON no cargan.
- Se ajusto admin:
  - ya no muestra `Agregar servicio`,
  - ya no muestra `Editar` en tarjetas de servicio,
  - muestra copy de revision interna,
  - agrega link `Abrir panel empresa demo`.

## Verificacion

- Se leyeron los documentos obligatorios de `tasks/TASK-011-assignment.md`.
- Se leyo `tasks/TASK-010-CANCELLED.md` y se siguio la decision de separar panel empresa de admin interno.
- Se verifico HTTP `200` para:
  - `http://127.0.0.1:4173/panel.html`
  - `http://127.0.0.1:4173/data/event-types.json`
- Se valido parseo de:
  - `panel.js`
  - `admin.js`
- Se valido en navegador que `panel.html` renderiza:
  - titulo `Panel empresa demo`,
  - mensaje de que no guarda en Azure,
  - boton `Agregar servicio`,
  - servicios existentes,
  - categoria como `SELECT`,
  - 6 tipos de evento,
  - input multiple de fotos,
  - boton `Enviar a revision`.
- Se valido en navegador que `admin.html?demo=local`:
  - no muestra `Agregar servicio`,
  - no muestra botones `Editar` para servicios,
  - muestra link hacia `panel.html`,
  - comunica que admin es revision interna.
- Se reviso consola del navegador: sin errores/warnings capturados en las validaciones estructurales.
- Se reviso `git status --short` enfocado en archivos permitidos por la tarea.

Nota:

- La automatizacion disponible tuvo timeouts al ejecutar clicks reales sobre el navegador. Por eso la verificacion automatizada fue estructural/DOM. QA debe hacer la prueba manual completa de crear, editar, subir fotos y enviar a revision.

## Riesgos

- `panel.html` es una demo estatica sin auth real.
- `localStorage` no representa permisos, aislamiento por empresa ni persistencia productiva.
- Las fotos solo tienen preview local; no se suben a Azure ni se guardan como base64.
- Los catalogos ahora existen como JSON/constantes demo, pero aun falta definir una fuente unica de verdad para frontend y backend.
- Admin aun muestra servicios demo desde `localStorage` como vista de revision aproximada, no como flujo real de aprobacion de servicios.

## Pendientes

- QA debe validar manualmente:
  - abrir `panel.html`,
  - crear servicio,
  - editar servicio,
  - seleccionar categoria,
  - seleccionar varios tipos de evento,
  - seleccionar fotos y revisar preview,
  - guardar,
  - refrescar y confirmar persistencia,
  - enviar a revision,
  - abrir admin y confirmar que se entiende como revision interna.
- Product/Architect debe decidir si `panel.html` se mantiene como demo o si se convierte pronto a ruta `/panel/*`.
- Backend/API debe definir CRUD real de servicios.
- Infra debe definir flujo real de fotos por servicio en Blob Storage.
- Web Dev debe agregar un mecanismo de reset/restauracion de datos demo si QA/Product lo requiere para demos repetidas.

## Recomendacion para Product/Architect

Usar `panel.html` como demo separada del panel empresa y mantener `admin.html` como revision interna.

La siguiente decision recomendada es formalizar rutas:

- `/admin/*`: revision interna, aprobacion y moderacion.
- `/panel/*`: empresa proveedora, perfil, servicios, fotos y planes.

Tambien recomiendo decidir pronto si `data/categories.json` y `data/event-types.json` seran la fuente versionada oficial del MVP o si Backend/API tendra una tabla `Catalogs`.
