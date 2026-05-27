# Flujo de revision y publicacion de proveedores

## Objetivo

Definir que hacer despues de que una empresa se registra desde la web y sube imagenes a Azure.

El flujo actual ya permite:

- Registrar empresa desde la pagina.
- Guardar datos en Azure Table Storage.
- Subir imagenes a Blob Storage.
- Dejar todo en estado pendiente de revision.

Este documento explica como revisar, aprobar y publicar proveedores.

## Estado actual del flujo

Cuando una empresa envia el formulario:

```text
Datos de empresa -> Table Storage -> Providers
Imagenes -> Blob Storage -> uploads-pending
Referencias de imagenes -> Table Storage -> ProvidersImages
Estado inicial -> pending
```

Nada debe aparecer automaticamente en la pagina publica hasta que sea aprobado.

## Principio importante

La pagina publica no debe mover imagenes ni aprobar proveedores.

La pagina publica solo debe leer:

```text
Proveedores con status = published
Imagenes desde container public
```

La aprobacion debe hacerse por:

- Proceso manual en Azure para MVP.
- Panel/admin protegido en una fase posterior.
- API admin en una fase posterior.

## Flujo correcto

```text
Empresa se registra
        ->
Datos e imagenes quedan pending
        ->
Admin revisa informacion
        ->
Admin revisa imagenes
        ->
Admin aprueba o rechaza
        ->
Si aprueba: imagenes pasan de uploads-pending a public
        ->
Datos cambian de pending a published
        ->
Pagina publica muestra el proveedor
```

## Donde revisar datos

En Azure Portal:

```text
Storage Account
-> Storage browser
-> Tables
-> Providers
```

Buscar el proveedor por:

```text
PartitionKey = provider
RowKey = provider-id
```

Ejemplo:

```text
RowKey = demo-1-ffecbd9a
```

Revisar campos:

```text
name
email
phone
category
location
description
price
website
status
createdAt
```

El estado esperado al inicio:

```text
status = pending
```

## Donde revisar imagenes

En Azure Portal:

```text
Storage Account
-> Storage browser
-> Blob containers
-> uploads-pending
-> providers
-> provider-id
```

Ejemplo:

```text
uploads-pending/providers/demo-1-ffecbd9a/
```

Tambien revisar la tabla:

```text
Storage Account
-> Storage browser
-> Tables
-> ProvidersImages
```

Buscar:

```text
PartitionKey = provider-id
```

Ejemplo:

```text
PartitionKey = demo-1-ffecbd9a
```

Debe haber una fila por imagen.

Estados esperados:

```text
status = pending
```

## Criterios de revision

Antes de publicar, revisar:

- Nombre de la empresa correcto.
- Telefono o WhatsApp valido.
- Email valido.
- Categoria correcta.
- Ubicacion clara.
- Descripcion entendible.
- Imagenes reales del negocio.
- Imagenes sin contenido inapropiado.
- Imagenes con calidad suficiente.
- No publicar imagenes duplicadas o inutiles.

## Opcion 1: aprobacion manual en Azure

Esta opcion sirve para MVP con pocos proveedores.

## Paso 1: revisar el proveedor

Ir a:

```text
Storage browser
-> Tables
-> Providers
```

Confirmar que el proveedor este correcto.

## Paso 2: revisar imagenes pendientes

Ir a:

```text
Storage browser
-> Blob containers
-> uploads-pending
-> providers
-> provider-id
```

Abrir/descargar las imagenes y decidir cuales se aprueban.

## Paso 3: copiar imagenes al container public

Copiar las imagenes aprobadas desde:

```text
uploads-pending/providers/provider-id/
```

hacia:

```text
public/providers/provider-id/
```

Nombres sugeridos:

```text
cover.webp
gallery-01.webp
gallery-02.webp
gallery-03.webp
```

Si las imagenes siguen en JPG o PNG, se pueden publicar asi temporalmente, pero la recomendacion es convertir a WEBP despues.

## Paso 4: actualizar ProviderImages

Ir a:

```text
Storage browser
-> Tables
-> ProvidersImages
```

Para cada imagen aprobada, actualizar:

```text
status = published
publicBlobUrl = https://storagepuntoevento.blob.core.windows.net/public/providers/provider-id/nombre-imagen
updatedAt = fecha actual
```

Ejemplo:

```text
publicBlobUrl = https://storagepuntoevento.blob.core.windows.net/public/providers/demo-1-ffecbd9a/cover.webp
```

Para imagenes rechazadas:

```text
status = rejected
```

## Paso 5: actualizar Providers

Ir a:

```text
Storage browser
-> Tables
-> Providers
```

Actualizar el proveedor:

```text
status = published
updatedAt = fecha actual
```

Opcionalmente agregar:

```text
coverImage = URL publica de la imagen principal
```

## Paso 6: revisar pagina publica

Abrir:

```text
https://zealous-field-08fdd720f.7.azurestaticapps.net/
```

Confirmar que el proveedor aparezca si la pagina ya esta leyendo desde:

```text
GET /api/providers
```

Si la pagina todavia usa datos locales en `data/providers.json`, el proveedor no aparecera automaticamente hasta ajustar el frontend.

## Opcion 2: aprobacion automatizada con API admin

Esta es la opcion recomendada como siguiente desarrollo.

Crear una API:

```text
POST /api/admin/approve-provider
```

Request sugerido:

```json
{
  "providerId": "demo-1-ffecbd9a"
}
```

La API debe:

- Buscar proveedor en `Providers`.
- Validar que tenga `status = pending`.
- Buscar imagenes en `ProvidersImages`.
- Copiar blobs de `uploads-pending` a `public`.
- Generar nombres finales.
- Guardar `publicBlobUrl`.
- Cambiar imagenes aprobadas a `published`.
- Cambiar proveedor a `published`.

## APIs admin sugeridas

```text
GET /api/admin/pending-providers
GET /api/admin/provider-detail?id=provider-id
POST /api/admin/approve-provider
POST /api/admin/reject-provider
POST /api/admin/approve-image
POST /api/admin/reject-image
```

## Panel admin sugerido

Crear una pantalla protegida para administracion:

```text
/admin
```

Funciones:

- Ver proveedores pendientes.
- Ver datos enviados.
- Ver imagenes pendientes.
- Aprobar proveedor.
- Rechazar proveedor.
- Aprobar/rechazar imagenes individuales.

No debe ser publica.

Para MVP puede protegerse inicialmente con:

- Password simple en Static Web Apps Standard.
- Authentication de Static Web Apps.
- Acceso restringido por roles.
- O una herramienta admin interna separada.

## Recomendacion para MVP actual

Para pocos proveedores:

```text
Usar aprobacion manual desde Azure.
```

Para operar con mas comodidad:

```text
Desarrollar /api/admin/approve-provider y un panel admin basico.
```

## Checklist manual de publicacion

Antes de marcar como published:

- [ ] Datos de empresa revisados.
- [ ] Telefono/WhatsApp revisado.
- [ ] Categoria revisada.
- [ ] Ubicacion revisada.
- [ ] Imagen principal seleccionada.
- [ ] Imagenes aprobadas copiadas a `public`.
- [ ] `ProviderImages.publicBlobUrl` actualizado.
- [ ] `ProviderImages.status` actualizado.
- [ ] `Providers.status = published`.
- [ ] Pagina publica revisada.

## Resultado esperado

Despues de aprobar:

```text
Providers.status = published
ProviderImages.status = published
ProviderImages.publicBlobUrl apunta al container public
Imagenes aprobadas existen en public/providers/provider-id/
Pagina publica puede mostrar el proveedor
```

