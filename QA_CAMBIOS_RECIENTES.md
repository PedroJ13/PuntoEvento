# QA - Cambios recientes

## Objetivo

Resumen para QA de los cambios aplicados en registro de empresas, subida de imagenes, panel admin y flujo de aprobacion.

## Frontend publico

- Se actualizo el texto de carga de fotos.
- Ahora indica que en Azure las imagenes se cargan para revision y que en local solo se previsualizan si la API no esta disponible.
- Se actualizo cache-buster:

```text
app.js?v=15
```

Validar:

- Abrir la pagina publica despues del deploy.
- Ir a Empresas -> Crear perfil gratis.
- Confirmar que el texto de fotos no diga que en produccion "se guardarian" sino que se cargan para revision.
- Registrar una empresa con imagen valida.
- Confirmar que el mensaje final sea simple:

```text
Sus datos fueron recibidos y cargados.
Estaremos validando la informacion y, si todo esta bien, procederemos con la publicacion.
```

## Panel admin

- Se agrego `/admin` y `/admin.html`.
- El panel pide usuario/password.
- Las credenciales se validan en API con:

```text
ADMIN_USERNAME
ADMIN_PASSWORD
```

- Se actualizo cache-buster:

```text
admin.js?v=3
```

Validar:

- En Azure, abrir `/admin` despues de que termine el deploy.
- En servidor local simple, abrir `/admin.html`; `/admin` depende del rewrite de Azure Static Web Apps.
- Confirmar que ya no cae a la home.
- Entrar con credenciales configuradas en Azure.
- Ver lista de proveedores `pending`.
- Ver datos e imagenes del proveedor.

## Aprobacion de proveedores

- No se permite publicar un proveedor sin al menos una imagen aprobada.
- El frontend bloquea la accion si no hay imagen seleccionada.
- La API tambien responde error si no hay imagen aprobada.
- Al aprobar imagen:
  - se copia desde `uploads-pending` hacia `public`;
  - se marca como `published`;
  - se intenta borrar el blob pendiente original.
- Si falla el borrado del blob pendiente aprobado, la publicacion no se bloquea; queda warning en logs.
- La aprobacion es mas recuperable si una imagen ya quedo `published` por un intento anterior.

Validar:

- Intentar aprobar proveedor desmarcando todas las imagenes.
- Esperado: no debe publicar.
- Aprobar con al menos una imagen seleccionada.
- Esperado:
  - proveedor pasa a `published`;
  - imagen aprobada pasa a `published`;
  - `publicBlobUrl` queda lleno;
  - blob existe en `public/providers/<providerId>/`.

## Rechazo de proveedores

- El endpoint de rechazo ahora solo permite rechazar proveedores con `status = pending`.
- Esto evita bajar accidentalmente un proveedor ya publicado.

Validar:

- Rechazar proveedor pendiente.
- Esperado: proveedor pasa a `rejected` e imagenes pendientes pasan a `rejected`.
- Intentar rechazar proveedor ya publicado llamando endpoint manualmente.
- Esperado: error `Provider is not pending`.

## Registro de uploads

- `register-upload` ahora es mas idempotente.
- Si un retry llega cuando la imagen ya esta `pending`, responde OK si coincide la reserva.
- El slot se marca ocupado antes de actualizar la imagen a `pending`.

Validar:

- Subir imagen normalmente desde formulario.
- Reintentar llamada de `register-upload` con los mismos datos.
- Esperado: no debe romper el flujo si la imagen ya esta `pending`.

## Correo de notificacion

- Se agrego timeout de 5 segundos a SendGrid.
- El correo sigue siendo no bloqueante: si falla, el registro debe guardarse y el error queda en logs.
- Se elimino fallback hardcodeado de destinatario.
- Si se configura `SENDGRID_API_KEY`, tambien deben existir:

```text
NOTIFICATION_EMAIL_TO
NOTIFICATION_EMAIL_FROM
```

Validar:

- Registrar empresa con SendGrid configurado.
- Esperado: correo llega a `NOTIFICATION_EMAIL_TO`.
- Probar sin SendGrid o con sender faltante en ambiente controlado.
- Esperado: registro se guarda, correo se omite y queda warning en logs.

## Cache

- Se actualizaron query params para evitar que navegador use JS viejo:

```text
index.html -> app.js?v=15
admin.html -> admin.js?v=3
```

Validar:

- En DevTools Network, confirmar que se descargan esas versiones.
- Si aun se ve contenido viejo, hacer hard refresh o esperar fin del deploy.

## Riesgos conocidos pendientes

Estos puntos siguen documentados como pendientes para produccion:

- Endpoints admin usan `authLevel: anonymous` con Basic Auth propio.
- Falta Azure Static Web Apps Auth/roles, rate limit o lockout.
- Falta cleanup global programado para `uploads-pending`.
- Falta auditoria completa de acciones admin.
- El container `public` debe permitir lectura publica de blobs o definirse otra estrategia de entrega de imagenes.
