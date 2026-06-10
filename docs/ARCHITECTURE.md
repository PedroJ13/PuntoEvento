# Arquitectura Punto Evento

## Arquitectura actual

```text
Azure Static Web Apps
  -> index.html / app.js / styles.css
  -> admin.html / admin.js / admin.css
  -> /api Azure Functions
  -> /data JSON demo
  -> /assets imagenes locales
```

## Arquitectura objetivo MVP

```text
Usuario publico
  -> Pagina publica
  -> Busca servicios
  -> Cotiza servicio

Empresa proveedora
  -> Registro
  -> Login
  -> Admin
  -> Perfil empresa
  -> Servicios
  -> Fotos

Admin interno
  -> Revisa empresas/servicios
  -> Aprueba o rechaza
```

## Servicios Azure recomendados

- Azure Static Web Apps para frontend y hosting.
- Azure Functions para API.
- Azure Blob Storage para imagenes.
- Azure Table Storage para MVP barato.
- Cosmos DB serverless si se requiere mas flexibilidad.
- Servicio de email para notificaciones.

## Dominio publico y hosting

Dominio publico configurado el 2026-06-09:

```text
puntoeventocr.com
www.puntoeventocr.com
```

Hosting:

```text
Azure Static Web Apps: puntoevento
Resource group: resource_group_main
Default hostname: zealous-field-08fdd720f.7.azurestaticapps.net
```

DNS:

- Cloudflare administra DNS de `puntoeventocr.com`.
- `www` usa CNAME hacia el hostname default de Azure Static Web Apps.
- El apex `puntoeventocr.com` usa CNAME flattening de Cloudflare hacia el hostname default de Azure Static Web Apps.
- Los registros deben quedar en `DNS only` para la validacion/certificado base de Azure Static Web Apps.
- El TXT de validacion apex se uso solo para validar propiedad ante Azure; no es un secreto.

App settings publicos/no secretos relacionados:

```text
ALLOWED_ORIGINS=https://puntoeventocr.com,https://www.puntoeventocr.com,https://zealous-field-08fdd720f.7.azurestaticapps.net
APP_PUBLIC_URL=https://puntoeventocr.com
```

URLs operativas validadas:

```text
https://puntoeventocr.com/
https://puntoeventocr.com/panel.html
https://puntoeventocr.com/admin.html
https://puntoeventocr.com/api/public/services?limit=50
https://www.puntoeventocr.com/
https://www.puntoeventocr.com/panel.html
https://www.puntoeventocr.com/admin.html
https://www.puntoeventocr.com/api/public/services?limit=50
```

Estado al validar:

- `puntoeventocr.com`: `Ready` en Azure Static Web Apps y HTTPS `200`.
- `www.puntoeventocr.com`: `Ready` en Azure Static Web Apps y HTTPS `200`.
- No se cambiaron email, codigo frontend, endpoints ni pipeline para conectar el dominio.

## Email operativo MVP

Proveedor decidido para MVP:

```text
Azure Communication Services Email via Azure Functions
```

Proveedor anterior / fallback futuro:

```text
SendGrid
```

Recursos Azure configurados:

- Azure Communication Services: `puntoevento-communication`.
- Email Communication Service: `puntoevento-email`.
- Dominio MVP: `AzureManagedDomain`.
- Sender MVP: `donotreply@<azure-managed-domain>`.

Usos actuales:

- Notificacion interna cuando una empresa se registra.
- Email de bienvenida/activacion cuando una empresa es aprobada.
- Notificacion interna cuando un servicio se envia a revision.
- Entrega de solicitud de cotizacion al email interno de la empresa publicada.

Variables de entorno requeridas para envio real:

```text
EMAIL_PROVIDER
AZURE_COMMUNICATION_CONNECTION_STRING
AZURE_COMMUNICATION_EMAIL_FROM
NOTIFICATION_EMAIL_FROM_NAME
NOTIFICATION_EMAIL_TO
```

Compatibilidad:

```text
NOTIFICATION_EMAIL_FROM
```

`NOTIFICATION_EMAIL_FROM` puede usarse como fallback para el sender si `AZURE_COMMUNICATION_EMAIL_FROM` no esta definido.

Variables legacy/fallback SendGrid:

```text
SENDGRID_API_KEY
```

Variables opcionales de tablas nuevas:

```text
AZURE_TABLE_USERS
AZURE_TABLE_LEADS
```

Reglas:

- Los emails internos no deben romper registro ni envio a revision si el proveedor de email falla.
- La cotizacion publica responde error si no puede entregarse por email, pero deja trazabilidad en `Leads`.
- No imprimir API keys, connection strings, tokens ni secretos en logs, handoffs o chats.

## Decision actual sobre base de datos

No usar DB server tradicional por ahora.

Usar almacenamiento serverless/managed.

Blob Storage sirve para imagenes, pero no es ideal como unica fuente de datos para empresas/servicios con login y edicion concurrente.

## Blob Storage CORS

Uploads pendientes:

```text
Storage account: storagepuntoevento
Container: uploads-pending
```

El panel empresa sube imagenes con `PUT` a un blob firmado por SAS. CORS de Blob Storage debe permitir solo los origenes operativos:

```text
AllowedOrigins=https://puntoeventocr.com, https://www.puntoeventocr.com, https://zealous-field-08fdd720f.7.azurestaticapps.net
AllowedMethods=OPTIONS, PUT
AllowedHeaders=content-type, x-ms-blob-type
ExposedHeaders=etag, x-ms-request-id, x-ms-version, x-ms-request-server-encrypted
MaxAgeInSeconds=3600
```

No usar wildcard para origins/headers salvo necesidad futura documentada.

## Rutas publicas objetivo

```text
/
/servicios/:categoria
/empresa/:companySlug
/empresa/:companySlug/:serviceSlug
```

En la app estatica actual se puede simular con hash routes:

```text
#inicio
#bodas
#proveedor/:id
#empresas
```

## Rutas admin objetivo

```text
/admin/login
/admin/dashboard
/admin/revision
/admin/empresas-pendientes
/admin/servicios-pendientes
```

## Rutas panel empresa objetivo

```text
/panel/login
/panel/dashboard
/panel/empresa
/panel/servicios
/panel/servicios/nuevo
/panel/servicios/:id
/panel/fotos
/panel/planes
```

Durante la demo estatica, el panel empresa puede convivir dentro de `admin.html` como pestanas separadas, pero la arquitectura objetivo separa:

- `Admin interno`: revision, aprobacion y moderacion.
- `Panel empresa`: gestion de perfil, servicios, fotos y planes.

Decision actualizada:

`admin.html` no debe evolucionar como lugar donde la empresa crea servicios. Debe quedar orientado a revision interna.

La creacion/edicion de servicios por empresa debe moverse a una pantalla/ruta separada de panel empresa, por ejemplo:

```text
panel.html
```

o, en arquitectura final:

```text
/panel/*
```
