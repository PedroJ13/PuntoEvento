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
/admin/empresa
/admin/servicios
/admin/servicios/nuevo
/admin/servicios/:id
/admin/fotos
/admin/planes
```

