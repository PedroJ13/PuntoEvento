# Registro de empresas en Punto Evento

## Objetivo

Permitir que una empresa cree su perfil gratis, cargue fotos y publique sus servicios en Punto Evento.

Modelo comercial inicial:

- Registro gratis.
- Perfil publicado despues de revision.
- Planes pagados despues para aparecer destacado, arriba en listados o en portada.

## Flujo propuesto

1. La empresa entra a la pagina "Empresas".
2. Hace clic en "Crear perfil gratis".
3. Llena datos basicos:
   - nombre comercial,
   - categoria,
   - ubicacion,
   - WhatsApp,
   - precio desde,
   - sitio web o Instagram,
   - descripcion.
4. Carga fotos:
   - logo,
   - portada,
   - galeria.
5. Acepta que tiene permiso para publicar la informacion e imagenes.
6. Envia el registro.
7. El perfil queda en estado "pendiente de revision".
8. El administrador revisa y publica.

## Estado actual en la demo

La pagina ya tiene un formulario visual en `#empresas`:

- Datos de empresa.
- Carga de fotos con vista previa local.
- Plan gratis por defecto.
- Envio real preparado contra `/api/register-provider`, `/api/create-upload-url` y `/api/register-upload`.
- Fallback demo si la API no esta disponible en local.

Importante:

En local sin Azure Functions, las fotos solo se previsualizan en el navegador. En Azure, si las variables de entorno estan configuradas, la API registra el proveedor como `pending`, genera SAS temporal y sube las fotos a `uploads-pending`.

## Implementacion real recomendada en Azure

Para hacerlo funcional con bajo costo:

```text
Formulario web
  ->
Azure Function
  ->
Azure Blob Storage para imagenes
  ->
Archivo JSON, Table Storage o base de datos para datos de empresa
  ->
Revision manual
  ->
Perfil publicado
```

## Datos de empresa

Campos minimos:

- `id`
- `status`: pending, published, rejected
- `plan`: free, featured, premium
- `name`
- `category`
- `location`
- `description`
- `price`
- `whatsapp`
- `website`
- `coverImage`
- `gallery`
- `createdAt`
- `updatedAt`

## Imagenes

Guardar en Azure Blob Storage:

```text
providers/
  proveedor-id/
    logo.webp
    cover.webp
    gallery-01.webp
    gallery-02.webp
    gallery-03.webp
```

Recomendaciones:

- Limitar peso por imagen.
- Convertir a `webp`.
- Crear nombres seguros.
- Validar tipo de archivo.
- No publicar imagenes hasta que el perfil sea revisado.

## Planes comerciales

## Gratis

- Perfil publicado.
- Categoria principal.
- Fotos.
- Contacto por WhatsApp.

## Destacado

- Mejor posicion en listados.
- Insignia destacada.
- Aparicion en primeras posiciones de categoria.
- Puede ser pago unico mensual o pago por periodo.

## Premium

- Portada de categoria.
- Campanas por temporada.
- Reportes de clicks y solicitudes.
- Mas fotos o paquetes destacados.

## Siguiente paso tecnico

Configurar en Azure Static Web Apps las variables de entorno que usa la API:

```text
AZURE_STORAGE_CONNECTION_STRING
AZURE_STORAGE_ACCOUNT_NAME
AZURE_STORAGE_PENDING_CONTAINER=uploads-pending
AZURE_STORAGE_PUBLIC_CONTAINER=public
AZURE_TABLE_CONNECTION_STRING
AZURE_TABLE_PROVIDERS=Providers
AZURE_TABLE_PROVIDER_IMAGES=ProviderImages
```

Despues de eso, probar que la API:

1. Reciba los campos del formulario.
2. Suba fotos a Blob Storage.
3. Guarde metadata del proveedor.
4. Responda al usuario con confirmacion.
5. Deje proveedor e imagenes como `pending`.
