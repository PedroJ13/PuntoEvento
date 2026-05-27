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
