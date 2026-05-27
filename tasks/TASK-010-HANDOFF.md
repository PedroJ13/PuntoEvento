# TASK-010: Catalogos y fotos en formulario demo de servicio

## Equipo

Web Dev.

## Estado

Completada.

## Resumen

Se mejoro el formulario demo de servicios en `admin.html` para usar catalogos controlados de categoria y tipos de evento, y para permitir seleccionar fotos con preview local.

La implementacion sigue siendo demo local:

- No sube fotos a Azure.
- No toca `/api`.
- No toca la pagina publica.
- Guarda servicios y metadata de fotos en `localStorage`.
- No guarda base64 de imagenes.

## Objetivo

Mejorar el formulario demo de servicios para que:

- `Categoria` ya no sea texto libre.
- `Tipos de evento` use opciones controladas.
- El servicio permita seleccionar fotos y ver previews locales.
- `Cantidad de fotos` se actualice automaticamente.

## Archivos tocados

- `admin.html`
- `admin.js`
- `admin.css`
- `tasks/TASK-010-HANDOFF.md`

## Cambios realizados

- Se cambio `Categoria` de input texto a `select`.
- Se alinearon categorias con `data/categories.json`:
  - Bodas
  - Salones
  - Catering
  - Corporativos
  - Fiestas infantiles
  - Decoracion
- Se cambio `Tipos de evento` de texto libre a checkboxes controlados:
  - Bodas
  - Cumpleanos
  - Eventos corporativos
  - Baby Shower
  - Graduaciones
  - Fiestas infantiles
- Se agrego input multiple de fotos del servicio.
- Se agrego preview local de fotos seleccionadas.
- Se cambio `Cantidad de fotos` a campo readonly actualizado desde la seleccion/metadata de fotos.
- Se agrego metadata demo de fotos a los servicios iniciales.
- Se mantiene guardado en `localStorage` con la llave `puntoEventoDemoServices`.
- Se evita guardar base64 grande; solo se guarda metadata `{ name, size, type }`.
- Se actualizaron versiones cache-bust:
  - `admin.css?v=5`
  - `admin.js?v=8`

## Verificacion

- Se leyeron los documentos obligatorios de `tasks/TASK-010-assignment.md`.
- Se verifico `http://127.0.0.1:4173/admin.html?demo=local` con respuesta HTTP `200`.
- Se valido parseo de `admin.js`.
- Se valido en navegador que:
  - existe la pestana `Servicios`,
  - el campo `Categoria` renderiza como `SELECT`,
  - las opciones de categoria estan presentes,
  - los tipos de evento renderizan como opciones multiples,
  - existe input de fotos `type=file` con `multiple`,
  - `Cantidad de fotos` es readonly,
  - los servicios demo siguen visibles,
  - no hay errores/warnings de consola capturados.
- Se reviso `git status --short` enfocado en archivos permitidos.

Nota de verificacion:

- La seleccion real de archivos desde el file picker debe validarla QA manualmente. La automatizacion disponible no expuso una accion confiable para adjuntar archivos locales al input.

## Riesgos

- Los catalogos estan definidos como constantes en `admin.js`, alineadas con `data/categories.json`, pero aun no hay un modulo/catalogo compartido consumido por todas las superficies.
- `localStorage` solo guarda metadata de fotos, no imagenes reales; al recargar se conserva la cantidad/nombre, no el preview binario.
- Si existen servicios viejos en `localStorage` con categorias libres, al editarlos se normalizan hacia una categoria controlada.
- La galeria real por servicio todavia depende de definicion Backend/API e Infra Azure.

## Pendientes

- QA debe validar manualmente:
  - seleccionar categoria,
  - seleccionar multiples tipos de evento,
  - seleccionar multiples fotos,
  - ver previews,
  - confirmar conteo de fotos,
  - guardar,
  - editar,
  - refrescar y revisar persistencia de metadata.
- Product/Architect debe decidir si los catalogos quedan como JSON estatico versionado o si pasan a tabla `Catalogs`.
- Web Dev debe considerar un helper/catalogo compartido cuando se implemente busqueda publica por servicio.
- Backend/API debe validar los mismos catalogos cuando exista CRUD real de servicios.
- Infra debe definir flujo real de fotos por servicio en Blob Storage.

## Recomendacion para Product/Architect

Mantener estos catalogos como JSON/constantes versionadas durante la demo, pero definir pronto una fuente unica de verdad para `Category` y `EventType`.

Para el MVP real recomiendo:

- `data/categories.json` y `data/event-types.json` como fuente versionada inicial.
- Backend validando contra la misma lista.
- Migrar a tabla `Catalogs` solo cuando necesiten editar catalogos desde admin.

Tambien recomiendo confirmar la regla de fotos por servicio antes de API real:

- maximo de fotos por servicio,
- peso maximo,
- formatos permitidos,
- portada obligatoria o no,
- si los cambios publicados requieren nueva revision.
