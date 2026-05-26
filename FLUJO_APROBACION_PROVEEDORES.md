# Flujo de aprobacion de proveedores

## Objetivo

Definir como pasa una empresa desde registro pendiente hasta publicacion visible en Punto Evento.

## Estados

```text
pending   -> recibido, pendiente de revision
published -> aprobado y visible en la pagina publica
rejected  -> rechazado, no visible
archived  -> oculto por decision admin
```

Para imagenes:

```text
reserved  -> cupo reservado antes de subir
pending   -> imagen subida, pendiente de revision
published -> imagen aprobada para uso publico
rejected  -> imagen rechazada
deleted   -> imagen eliminada
```

## Flujo actual

1. La empresa completa el formulario.
2. `/api/register-provider` crea el proveedor en `Providers` con `status: pending`.
3. La API intenta enviar correo de aviso al administrador.
4. Por cada imagen:
   - `/api/create-upload-url` reserva un slot y genera SAS temporal.
   - El frontend sube el archivo a `uploads-pending`.
   - `/api/register-upload` valida el blob real y registra la imagen como `pending`.
5. La pagina muestra una confirmacion simple al proveedor.

## Flujo admin implementado

La primera version del panel esta disponible en:

```text
/admin
/admin.html
```

En Azure se usa `/admin`. En servidor local simple se debe usar `/admin.html`, porque el rewrite de `/admin` vive en `staticwebapp.config.json`.

Usa Basic Auth contra la API. Las credenciales se configuran con:

```text
ADMIN_USERNAME
ADMIN_PASSWORD
```

Desde el panel se puede:

- Ver proveedores `pending`.
- Revisar datos enviados.
- Ver imagenes pendientes con URL temporal.
- Seleccionar imagenes aprobadas.
- Aprobar y publicar proveedor.
- Rechazar proveedor.

No se permite publicar un proveedor sin al menos una imagen aprobada.

## Flujo admin propuesto

1. Admin revisa datos del proveedor en tabla `Providers`.
2. Admin revisa imagenes en `ProviderImages` y blobs en `uploads-pending`.
3. Si todo esta correcto:
   - Cambiar proveedor a `published`.
   - Aprobar imagenes validas.
   - Copiar o mover imagenes aprobadas al container `public`.
   - Guardar `publicBlobUrl` en cada imagen publicada.
4. Si falta informacion:
   - Contactar al proveedor por email o telefono.
   - Mantener estado `pending`.
5. Si se rechaza:
   - Cambiar proveedor o imagen a `rejected`.
   - Liberar el slot de la imagen si aplica.
   - Borrar blob pendiente si no se conservara evidencia.

## Endpoints admin sugeridos

```text
GET  /api/admin/pending-providers
POST /api/admin/approve-provider
POST /api/admin/reject-provider
```

Pendientes para una fase siguiente:

```text
GET  /api/admin/provider-detail?id=<providerId>
POST /api/admin/approve-image
POST /api/admin/reject-image
POST /api/admin/delete-image
```

## Reglas importantes

- No publicar datos ni imagenes hasta que el estado sea `published`.
- No publicar proveedores sin imagen aprobada, salvo que exista una opcion explicita de negocio para hacerlo.
- Al rechazar o eliminar imagenes, liberar el `slotNumber` asociado.
- No liberar slots vencidos si ya existe una imagen activa asociada.
- Mantener `uploads-pending` con limpieza periodica por Timer Function o lifecycle rule.
- Registrar fecha, usuario/admin y motivo en acciones de aprobacion o rechazo.
