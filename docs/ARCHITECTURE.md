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
