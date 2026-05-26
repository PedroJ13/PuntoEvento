# Configuracion Azure para registro y correo

## Variables necesarias

Configurar en Azure Static Web Apps, seccion Configuration / Application settings:

```text
AZURE_STORAGE_CONNECTION_STRING=<connection-string-del-storage>
AZURE_STORAGE_ACCOUNT_NAME=<nombre-del-storage-account>
AZURE_STORAGE_PENDING_CONTAINER=uploads-pending
AZURE_STORAGE_PUBLIC_CONTAINER=public
AZURE_TABLE_CONNECTION_STRING=<connection-string-del-storage-o-tablas>
AZURE_TABLE_PROVIDERS=Providers
AZURE_TABLE_PROVIDER_IMAGES=ProviderImages
ALLOWED_ORIGINS=https://<tu-static-web-app>.azurestaticapps.net
```

Para el correo:

```text
SENDGRID_API_KEY=<api-key-de-sendgrid>
NOTIFICATION_EMAIL_TO=pj13eros_business@outlook.com
NOTIFICATION_EMAIL_FROM=<correo-remitente-verificado-en-sendgrid>
NOTIFICATION_EMAIL_FROM_NAME=Punto Evento
APP_PUBLIC_URL=https://<tu-static-web-app>.azurestaticapps.net
ADMIN_USERNAME=<usuario-admin>
ADMIN_PASSWORD=<password-admin-largo>
```

## Importante sobre SendGrid

- `NOTIFICATION_EMAIL_FROM` debe ser un sender verificado en SendGrid.
- El correo destino puede ser Outlook.
- Si `SENDGRID_API_KEY` o `NOTIFICATION_EMAIL_FROM` no existen, la API guarda el registro pero omite el correo.
- Si SendGrid responde error, el registro no falla; revisar logs de Azure Functions.

## Prueba recomendada

1. Configurar variables en Azure.
2. Esperar a que Static Web Apps aplique la configuracion.
3. Abrir la pagina deployada.
4. Registrar una empresa con una imagen pequena.
5. Confirmar:
   - Registro `pending` en tabla `Providers`.
   - Imagen `pending` en tabla `ProviderImages`.
   - Blob en `uploads-pending`.
   - Correo recibido en `pj13eros_business@outlook.com`.

## Diagnostico rapido

- Si el formulario muestra error: revisar Network y logs de Azure.
- Si `register-provider` falla: revisar variables de tablas, storage y `ALLOWED_ORIGINS`.
- Si sube datos pero no imagenes: revisar CORS, SAS y container `uploads-pending`.
- Si registra pero no llega correo: revisar `SENDGRID_API_KEY`, sender verificado y logs.
- Si `/admin` no permite entrar: revisar `ADMIN_USERNAME` y `ADMIN_PASSWORD`.
- Si al aprobar no se ven imagenes publicas: revisar que el container `public` permita lectura publica de blobs o definir una estrategia de URLs firmadas.
