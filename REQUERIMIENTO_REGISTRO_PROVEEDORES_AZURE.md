# Requerimiento: registro de proveedores e imagenes en Azure

## Objetivo

Implementar el flujo base para que las empresas/proveedores se registren desde la web y suban sus imagenes a Azure, manteniendo costos bajos y evitando publicacion automatica sin revision.

La pagina ya esta publicada en Azure Static Web Apps. El desarrollo debe mantener el frontend lo mas estatico posible y agregar solo la API minima necesaria para:

- Registrar empresas.
- Guardar datos como pendientes.
- Generar permisos temporales para subir imagenes.
- Guardar imagenes en un storage de revision.
- Publicar solo empresas e imagenes aprobadas.

## Arquitectura MVP esperada

```text
Frontend:
Azure Static Web Apps

API:
Azure Functions bajo /api

Datos:
Azure Table Storage

Imagenes pendientes:
Blob container uploads-pending

Imagenes publicas:
Blob container public
```

## Principios de costo

Para esta fase no usar:

- App Service.
- Maquinas virtuales.
- Kubernetes.
- Contenedores.
- Azure SQL.
- Cosmos DB.
- CDN o Front Door, salvo que luego haya trafico real.

Usar:

- Azure Static Web Apps.
- Azure Functions Consumption o API integrada de Static Web Apps.
- Azure Table Storage.
- Azure Blob Storage Standard LRS Hot.

## Flujo funcional

```text
Empresa llena formulario de registro
        ->
Frontend llama POST /api/register-provider
        ->
API guarda empresa en Table Storage con status pending
        ->
Empresa selecciona imagenes
        ->
Frontend llama POST /api/create-upload-url por cada imagen
        ->
API genera SAS temporal para uploads-pending
        ->
Frontend sube imagen directo a Azure Blob Storage
        ->
Frontend llama POST /api/register-upload
        ->
API guarda referencia de imagen como pending
        ->
Admin revisa empresa e imagenes
        ->
Admin aprueba
        ->
API copia/mueve imagenes a container public
        ->
Proveedor queda published
        ->
Pagina publica muestra solo datos e imagenes publicadas
```

## Containers de Blob Storage

Crear dos containers:

```text
uploads-pending
public
```

Uso:

- `uploads-pending`: imagenes subidas por proveedores, pendientes de revision.
- `public`: imagenes aprobadas que la pagina publica puede mostrar.

Estructura sugerida:

```text
uploads-pending/
  providers/
    provider-id/
      image-id-01.webp
      image-id-02.webp

public/
  providers/
    provider-id/
      cover.webp
      gallery-01.webp
      gallery-02.webp
```

La pagina publica nunca debe leer desde `uploads-pending`.

## Azure Table Storage

Crear al menos dos tablas:

```text
Providers
ProviderImages
```

## Tabla Providers

Guardar los datos principales de la empresa.

Ejemplo:

```json
{
  "PartitionKey": "provider",
  "RowKey": "casa-arboleda",
  "name": "Casa Arboleda Eventos",
  "email": "contacto@empresa.com",
  "phone": "8888-8888",
  "category": "Salon y jardin",
  "location": "Santa Ana, San Jose",
  "description": "Salon para bodas y eventos.",
  "status": "pending",
  "createdAt": "2026-05-25T00:00:00Z",
  "updatedAt": "2026-05-25T00:00:00Z"
}
```

Estados posibles:

```text
pending
published
rejected
```

## Tabla ProviderImages

Guardar las referencias de imagenes asociadas a cada proveedor.

Ejemplo:

```json
{
  "PartitionKey": "casa-arboleda",
  "RowKey": "image-001",
  "type": "cover",
  "pendingBlobUrl": "https://<storage>.blob.core.windows.net/uploads-pending/providers/casa-arboleda/image-001.webp",
  "publicBlobUrl": "",
  "status": "pending",
  "createdAt": "2026-05-25T00:00:00Z",
  "updatedAt": "2026-05-25T00:00:00Z"
}
```

Tipos sugeridos:

```text
logo
cover
gallery
```

Estados posibles:

```text
pending
published
rejected
```

## APIs minimas

Estado en repo:

- `POST /api/register-provider`: implementado.
- `POST /api/create-upload-url`: implementado; reserva un slot atomico y el `imageId` en `ProviderImages` antes de devolver SAS, y limpia reservas vencidas junto con sus blobs pendientes.
- `POST /api/register-upload`: implementado; verifica reserva vigente, URL esperada, existencia del blob, tipo MIME real y tamano real antes de marcar la imagen como `pending`.
- `GET /api/providers`: implementado para devolver solo proveedores publicados e imagenes publicas.

Nota:

La pagina publica todavia puede seguir leyendo `data/providers.json` como fallback barato. Cuando se decida activar lectura dinamica, el frontend puede cambiar `CONFIG.providersUrl` a `/api/providers`.

## POST /api/register-provider

Registra una empresa como pendiente.

Request sugerido:

```json
{
  "name": "Casa Arboleda Eventos",
  "email": "contacto@empresa.com",
  "phone": "8888-8888",
  "category": "Salon y jardin",
  "location": "Santa Ana, San Jose",
  "description": "Salon para bodas y eventos."
}
```

Response sugerido:

```json
{
  "providerId": "casa-arboleda",
  "status": "pending"
}
```

Reglas:

- Validar campos obligatorios.
- Generar `providerId` seguro para URL.
- Guardar `status: pending`.
- No publicar el proveedor automaticamente.

## POST /api/create-upload-url

Genera una SAS temporal para que el navegador suba una imagen directo a Blob Storage.

Request sugerido:

```json
{
  "providerId": "casa-arboleda",
  "fileName": "salon-principal.jpg",
  "contentType": "image/jpeg",
  "imageType": "cover"
}
```

Response sugerido:

```json
{
  "imageId": "image-001",
  "uploadUrl": "https://<storage>.blob.core.windows.net/uploads-pending/providers/casa-arboleda/image-001.jpg?<sas>",
  "pendingBlobUrl": "https://<storage>.blob.core.windows.net/uploads-pending/providers/casa-arboleda/image-001.jpg"
}
```

Reglas:

- El SAS debe expirar rapido, idealmente entre 5 y 15 minutos.
- La reserva de imagen debe expirar poco despues del SAS; hoy el SAS vence en 10 minutos y la reserva en 15 minutos para dar margen a `register-upload`.
- El limite de 6 imagenes se protege con filas `slot-1` a `slot-6` por proveedor para evitar sobrecupo por concurrencia. Las imagenes legacy sin `slotNumber` se cuentan como cupos ocupados antes de reservar slots nuevos.
- El cleanup no debe liberar un slot vencido si ya hay una imagen activa asociada. Los endpoints admin futuros de rechazar/eliminar imagenes deben liberar el slot explicitamente.
- La limpieza oportunista ya borra metadata y blobs pendientes vencidos; para produccion debe agregarse Timer Function o lifecycle rule sobre `uploads-pending`.
- El SAS debe permitir solo escritura sobre el blob especifico.
- No permitir acceso de listado al container.
- No exponer la key del Storage Account en el frontend.
- Validar tipo de archivo antes de generar SAS.
- Limitar cantidad de imagenes por proveedor.
- Limitar peso maximo esperado por archivo.

Extensiones permitidas:

```text
.jpg
.jpeg
.png
.webp
```

Tipos MIME permitidos:

```text
image/jpeg
image/png
image/webp
```

## POST /api/register-upload

Registra que una imagen fue subida y queda pendiente de revision.

Request sugerido:

```json
{
  "providerId": "casa-arboleda",
  "imageId": "image-001",
  "imageType": "cover",
  "pendingBlobUrl": "https://<storage>.blob.core.windows.net/uploads-pending/providers/casa-arboleda/image-001.jpg"
}
```

Response sugerido:

```json
{
  "imageId": "image-001",
  "status": "pending"
}
```

Reglas:

- Verificar que el proveedor exista.
- Verificar que el proveedor este en estado `pending` o editable.
- Verificar que exista una reserva previa generada por `/api/create-upload-url`.
- Verificar que la reserva no este vencida.
- Verificar que `pendingBlobUrl`, `imageType` y blob pertenezcan a esa reserva.
- Verificar `contentType` y `contentLength` reales del blob contra la reserva y limites permitidos.
- Verificar que el blob exista en `uploads-pending`.
- Guardar imagen con `status: pending`.

## GET /api/providers

Devuelve solo proveedores publicados.

Response sugerido:

```json
[
  {
    "id": "casa-arboleda",
    "name": "Casa Arboleda Eventos",
    "category": "Salon y jardin",
    "location": "Santa Ana, San Jose",
    "description": "Salon para bodas y eventos.",
    "status": "published",
    "coverImage": "https://<storage>.blob.core.windows.net/public/providers/casa-arboleda/cover.webp",
    "gallery": [
      "https://<storage>.blob.core.windows.net/public/providers/casa-arboleda/gallery-01.webp"
    ]
  }
]
```

Reglas:

- Nunca devolver proveedores `pending` o `rejected`.
- Nunca devolver imagenes desde `uploads-pending`.
- Solo devolver URLs del container `public`.

## APIs admin para fase siguiente

Estas pueden implementarse despues si el MVP necesita panel admin.

```text
GET /api/admin/pending-providers
POST /api/admin/approve-provider
POST /api/admin/reject-provider
POST /api/admin/approve-image
POST /api/admin/reject-image
```

## POST /api/admin/approve-provider

Al aprobar:

- Validar proveedor.
- Revisar imagenes pendientes.
- Copiar o mover imagenes desde `uploads-pending` hacia `public`.
- Asignar nombres finales, por ejemplo:
  - `cover.webp`
  - `gallery-01.webp`
  - `gallery-02.webp`
- Actualizar `publicBlobUrl`.
- Cambiar imagenes a `published`.
- Cambiar proveedor a `published`.

## Comportamiento del frontend

El formulario de empresa debe:

- Registrar primero la empresa.
- Recibir `providerId`.
- Subir imagenes asociadas a ese `providerId`.
- Mostrar progreso de subida.
- Mostrar mensaje de pendiente de revision.
- No prometer publicacion inmediata.

Mensaje sugerido al terminar:

```text
Solicitud recibida. Revisaremos la informacion y las imagenes antes de publicar el perfil.
```

## Seguridad

Reglas obligatorias:

- No guardar secrets en el frontend.
- No exponer connection strings ni storage keys.
- Usar SAS temporal para subida.
- SAS de corta duracion.
- Subir primero a `uploads-pending`.
- Publicar solo despues de revision.
- Validar tipo de archivo.
- Validar tamano maximo.
- Evitar nombres originales como nombre final de blob.
- Generar IDs internos para archivos.
- No devolver detalles internos de excepciones al cliente.
- Escapar datos dinamicos de proveedores/paquetes antes de renderizarlos en HTML.

## Validaciones sugeridas

Proveedor:

- Nombre requerido.
- Email requerido y valido.
- Telefono requerido.
- Categoria requerida.
- Ubicacion requerida.
- Descripcion con longitud maxima.

Imagen:

- Maximo 6 imagenes por proveedor en MVP.
- Maximo 5 MB por imagen.
- Solo JPG, PNG o WEBP.
- Al menos una imagen tipo `cover`.

## Variables de entorno esperadas

La API debe usar variables de entorno para conectarse a Azure.

Sugeridas:

```text
AZURE_STORAGE_CONNECTION_STRING
AZURE_STORAGE_ACCOUNT_NAME
AZURE_STORAGE_PENDING_CONTAINER=uploads-pending
AZURE_STORAGE_PUBLIC_CONTAINER=public
AZURE_TABLE_CONNECTION_STRING
AZURE_TABLE_PROVIDERS=Providers
AZURE_TABLE_PROVIDER_IMAGES=ProviderImages
ALLOWED_ORIGINS=https://<tu-static-web-app>.azurestaticapps.net,https://puntoevento.cr
```

Estas variables se configuran en Azure, no en el frontend.

`ALLOWED_ORIGINS` es requerido cuando la API corre en produccion y se normaliza al leerlo para tolerar slash final. Para abrir el registro al publico tambien conviene agregar CAPTCHA o rate limiting dedicado.

## Workflow de despliegue

Estado: implementado en `.github/workflows/azure-static-web-apps-zealous-field-08fdd720f.yml`.

El workflow de Azure Static Web Apps indica:

```yaml
app_location: "/"
api_location: "api"
output_location: "/"
skip_app_build: true
```

La carpeta `api` ya tiene su propio `package.json` con dependencias de Azure Storage y Azure Tables.

## Lectura publica de proveedores

Para optimizar costos, se puede elegir una de estas opciones.

## Opcion A: GET /api/providers

La pagina llama a la API y recibe proveedores publicados.

Ventaja:

- Datos siempre actualizados.

Desventaja:

- Cada visita puede generar llamadas a Functions/Table Storage.

## Opcion B: data/providers-public.json

Al aprobar proveedores, generar o actualizar un JSON publico.

Ventaja:

- Mas barato para trafico publico.
- La pagina sigue siendo casi totalmente estatica.

Desventaja:

- Requiere generar el archivo al publicar cambios.

Recomendacion MVP:

```text
Usar GET /api/providers al inicio si el trafico es bajo.
Pasar a providers-public.json si se busca reducir lecturas y costos.
```

## Resultado esperado

Estado actual:

- El formulario de empresas ya intenta registrar desde la web.
- El backend serverless para guardar datos en Azure Table Storage ya existe.
- La generacion de SAS temporal para subir imagenes ya existe.
- El registro de imagenes pendientes en `ProviderImages` ya existe.
- `GET /api/providers` ya filtra proveedores `published`.
- La pagina publica todavia usa `data/providers.json` por defecto como fallback barato.

Pendiente para completar la fase:

- Configurar variables de entorno en Azure Static Web Apps.
- Probar el flujo real publicado.
- Crear flujo/admin de aprobacion.
- Mover/copiar imagenes aprobadas de `uploads-pending` a `public`.
- Decidir si el frontend publico cambia de `data/providers.json` a `/api/providers`.
