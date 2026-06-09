# TASK-125: Panel empresa - imagenes de servicio hasta 10 y cover

## Estado

Completada.

## Resultado general

El panel empresa ahora permite seleccionar multiples imagenes para un servicio, con maximo 10 en total incluyendo cover, preview local, seleccion de cover y remocion antes de guardar. El flujo `Guardar borrador -> Enviar a revision` se mantiene.

## Archivos modificados

- `panel.html`
- `panel.js`
- `panel.css`
- `tasks/TASK-125-HANDOFF.md`

## Flujo de imagenes implementado

- El input de imagenes acepta multiples archivos.
- Al seleccionar imagenes, se muestran previews.
- La primera imagen nueva queda como cover por defecto.
- El usuario puede marcar otra imagen como cover con `Usar como cover`.
- El usuario puede quitar imagenes nuevas antes de guardar.
- Al guardar en modo real:
  - la imagen marcada como cover se envia con `imageType: "cover"`;
  - las demas se envian con `imageType: "gallery"`;
  - cada imagen usa `/api/uploads/sign`, subida `PUT` y `/api/uploads/confirm`.
- En modo demo no se suben archivos, pero la UI permite validar experiencia.

## Validaciones UI

- Maximo 10 imagenes por servicio, contando imagenes aprobadas existentes y nuevas pendientes.
- Tipos permitidos: `image/jpeg`, `image/png`, `image/webp`.
- Tamano maximo por archivo: 5 MB.
- Mensaje visible cuando una seleccion no cumple formato/tamano/limite.
- Copy indica que las imagenes nuevas quedan pendientes de aprobacion.

## Dependencias API pendientes

- TASK-127 debe confirmar/validar en backend:
  - maximo 10 imagenes por servicio;
  - cover unico activo/pendiente;
  - reservas `cover` y `gallery` por `serviceId`;
  - respuesta clara para `409` si ya existe cover o se supera limite.
- Puede haber tension entre cambiar cover y permitir cover anterior publicado mientras el nuevo esta pendiente; QA/API deben confirmar la regla final.

## Verificacion

- `node --check panel.js`: OK.
- `git diff --check -- panel.html panel.js panel.css`: OK, solo avisos LF -> CRLF.
- Smoke navegador local:
  - input de imagenes tiene `multiple`;
  - acepta `image/jpeg,image/png,image/webp`;
  - copy muestra maximo 10, cover y aprobacion pendiente.
- Captura:
  - `tasks/generated/TASK-125-mobile.png`.

## Recomendacion QA

Validar en Azure con sesion real:

- seleccionar 1, 2 y 10 imagenes;
- marcar cover distinto al primero;
- quitar una imagen antes de guardar;
- intentar 11 imagenes;
- intentar formato no permitido y archivo mayor a 5 MB;
- confirmar que backend recibe `cover` para una imagen y `gallery` para las demas.
