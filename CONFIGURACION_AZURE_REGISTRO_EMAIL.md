# Configuracion Azure requerida

Este documento resume lo que debe estar configurado en Azure para que funcionen:

- Registro de empresas.
- Subida de imagenes.
- Aviso por correo.
- Panel admin `/admin`.
- Aprobacion y publicacion de proveedores.

## 1. Azure Static Web Apps

Ruta:

```text
Azure Portal
-> Static Web App
-> Configuration
-> Application settings
```

Configurar estas variables:

```text
AZURE_STORAGE_CONNECTION_STRING=<connection-string-del-storage>
AZURE_STORAGE_ACCOUNT_NAME=<nombre-del-storage-account>
AZURE_STORAGE_PENDING_CONTAINER=uploads-pending
AZURE_STORAGE_PUBLIC_CONTAINER=public
AZURE_TABLE_CONNECTION_STRING=<connection-string-del-storage-o-tablas>
AZURE_TABLE_PROVIDERS=Providers
AZURE_TABLE_PROVIDER_IMAGES=ProviderImages
ALLOWED_ORIGINS=https://<tu-static-web-app>.azurestaticapps.net
SENDGRID_API_KEY=<api-key-de-sendgrid>
NOTIFICATION_EMAIL_TO=pj13eros_business@outlook.com
NOTIFICATION_EMAIL_FROM=<correo-remitente-verificado-en-sendgrid>
NOTIFICATION_EMAIL_FROM_NAME=Punto Evento
APP_PUBLIC_URL=https://<tu-static-web-app>.azurestaticapps.net
ADMIN_USERNAME=<usuario-admin>
ADMIN_PASSWORD=<password-admin-largo>
```

Si hay dominio propio, incluirlo tambien:

```text
ALLOWED_ORIGINS=https://<tu-static-web-app>.azurestaticapps.net,https://puntoevento.cr
APP_PUBLIC_URL=https://puntoevento.cr
```

Notas:

- `ALLOWED_ORIGINS` es obligatorio en produccion.
- `ADMIN_PASSWORD` debe ser largo y no reutilizado.
- Si se configura `SENDGRID_API_KEY`, tambien se debe configurar `NOTIFICATION_EMAIL_TO` y `NOTIFICATION_EMAIL_FROM`.
- Cambiar variables puede requerir esperar unos minutos o redeploy.

## 2. Storage Account

Ruta:

```text
Azure Portal
-> Storage Account
```

Debe existir un Storage Account con:

- Blob Storage.
- Table Storage.
- Connection string disponible para la Static Web App.

## 3. Containers

Ruta:

```text
Storage Account
-> Data storage
-> Containers
```

Crear:

```text
uploads-pending
public
```

Uso:

- `uploads-pending`: recibe imagenes enviadas por proveedores antes de revision.
- `public`: guarda imagenes aprobadas que la web publica puede mostrar.

Configuracion recomendada:

- `uploads-pending`: acceso privado.
- `public`: permitir lectura publica de blobs si se van a usar URLs directas en la web.

Si la cuenta de Storage no permite public access por politica, entonces hay que cambiar la estrategia para servir imagenes con SAS, CDN o endpoint proxy.

## 4. Tables

Ruta:

```text
Storage Account
-> Data storage
-> Tables
```

Crear:

```text
Providers
ProviderImages
```

Uso:

- `Providers`: datos de empresas.
- `ProviderImages`: reservas, slots, metadata de imagenes y URLs publicas.

Estados relevantes:

```text
Providers.status: pending, published, rejected, archived
ProviderImages.status: reserved, pending, published, rejected, deleted
```

## 5. CORS de Storage

Ruta:

```text
Storage Account
-> Settings
-> Resource sharing (CORS)
-> Blob service
```

Configurar para permitir subida directa desde la Static Web App:

```text
Allowed origins:
https://<tu-static-web-app>.azurestaticapps.net
https://puntoevento.cr   (solo si aplica)

Allowed methods:
PUT, OPTIONS

Allowed headers:
*

Exposed headers:
*

Max age:
3600
```

Sin esto, la subida al SAS puede fallar en navegador aunque la API funcione.

## 6. SendGrid

Ruta general:

```text
SendGrid
-> API Keys
-> Sender Authentication
```

Configurar:

- API Key con permiso para enviar correo.
- Sender verificado para `NOTIFICATION_EMAIL_FROM`.

Variables relacionadas:

```text
SENDGRID_API_KEY
NOTIFICATION_EMAIL_TO=pj13eros_business@outlook.com
NOTIFICATION_EMAIL_FROM=<correo-verificado>
NOTIFICATION_EMAIL_FROM_NAME=Punto Evento
```

Notas:

- El correo destino puede ser Outlook.
- Si falta `SENDGRID_API_KEY` o `NOTIFICATION_EMAIL_FROM`, el registro se guarda pero no se envia correo.
- Si SendGrid responde error, el registro no falla; revisar logs de Azure Functions.

## 7. Panel admin

URL:

```text
https://<tu-static-web-app>.azurestaticapps.net/admin
```

Variables requeridas:

```text
ADMIN_USERNAME
ADMIN_PASSWORD
```

El panel llama:

```text
GET  /api/admin/pending-providers
POST /api/admin/approve-provider
POST /api/admin/reject-provider
```

Al aprobar:

1. Copia imagenes aprobadas desde `uploads-pending` hacia `public`.
2. Marca imagenes aprobadas como `published`.
3. Borra de `uploads-pending` los blobs que ya fueron copiados a `public`.
4. Rechaza imagenes no seleccionadas.
5. Marca proveedor como `published`.

No se permite publicar un proveedor sin al menos una imagen aprobada.

Al rechazar:

1. Marca proveedor como `rejected`.
2. Marca imagenes como `rejected`.
3. Borra blobs pendientes.
4. Libera slots de imagen.

## 8. GitHub Actions

Ruta:

```text
GitHub
-> Repo PuntoEvento
-> Actions
```

Confirmar que el workflow tenga:

```text
app_location: "/"
api_location: "api"
output_location: "/"
skip_app_build: true
```

Despues de cada push a `main`, esperar a que termine el workflow antes de probar Azure.

## 9. Prueba recomendada

1. Abrir la pagina publica.
2. Registrar una empresa con una imagen pequena JPG, PNG o WEBP.
3. Confirmar correo en `pj13eros_business@outlook.com`.
4. Abrir `/admin`.
5. Entrar con `ADMIN_USERNAME` y `ADMIN_PASSWORD`.
6. Ver proveedor pendiente.
7. Aprobar una imagen y publicar.
8. Confirmar en Azure:
   - `Providers.status = published`.
   - Imagen aprobada en `ProviderImages.status = published`.
   - `publicBlobUrl` lleno.
   - Blob existe en `public/providers/<providerId>/`.
9. Revisar que el proveedor aparezca en la web publica si `/api/providers` ya esta respondiendo datos publicados.

## 10. Diagnostico rapido

- `/admin` muestra home: el deploy aun no tiene `admin.html` o el workflow no termino.
- `/admin` falla en servidor local simple: usar `/admin.html` o un emulador/servidor que respete `staticwebapp.config.json`.
- `/admin` muestra login pero no entra: revisar el mensaje dentro del formulario, `ADMIN_USERNAME`, `ADMIN_PASSWORD`, `ALLOWED_ORIGINS` y logs de Azure Functions.
- Formulario muestra error: revisar Network y logs de Azure Functions.
- `register-provider` falla: revisar variables de Storage/Table y `ALLOWED_ORIGINS`.
- Suben datos pero no imagenes: revisar CORS de Blob Storage y container `uploads-pending`.
- Registro funciona pero no llega correo: revisar SendGrid, sender verificado y logs.
- Aprobacion falla: revisar permisos del connection string, container `public` y logs.
- Imagen publicada no se ve: revisar acceso publico del container `public` o estrategia de entrega de imagenes.

## 11. Pendientes antes de produccion

- Cambiar los endpoints admin a Azure Static Web Apps Auth/roles o agregar un gateway con rate limit.
- Agregar lockout/throttling para intentos fallidos de admin.
- Agregar Timer Function o lifecycle rule para limpieza global de `uploads-pending`.
- Agregar auditoria de acciones admin: usuario, fecha, decision y motivo.
- Considerar mover correo a cola/background job si el volumen crece.
