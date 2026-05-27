# Equipo Infra Azure: nuevo enfoque Punto Evento

## Contexto

Punto Evento mantiene una pagina publica para usuarios que buscan proveedores de eventos, pero agrega una zona administrativa para empresas.

Cada empresa debe poder:

- Registrarse gratis.
- Crear usuario con email y password.
- Iniciar sesion en una pagina administrativa.
- Cargar y actualizar su perfil.
- Cargar fotos.
- Crear varios servicios/eventos dentro de la misma empresa.
- Publicar cambios despues de revision o con reglas definidas.

Ejemplo de modelo:

```text
Empresa: Aurisbel
Servicios:
  - Queques
  - Wedding Planner
  - Mesa dulce
```

## Recomendacion de arquitectura

No se recomienda montar un DB server tradicional por ahora.

Para MVP, usar servicios serverless/managed:

```text
Azure Static Web Apps
  -> Frontend publico
  -> Frontend admin
  -> Azure Functions
  -> Azure Blob Storage para imagenes
  -> Azure Table Storage o Cosmos DB serverless para datos
  -> Azure Communication Services, SendGrid o email SMTP para notificaciones
```

## Por que no solo guardar todo en un container

Guardar imagenes en Blob Storage esta bien.

Guardar toda la informacion de empresas como archivos JSON dentro de un container puede servir para una demo controlada, pero tiene problemas para MVP:

- Conflictos si dos usuarios actualizan al mismo tiempo.
- Dificil busqueda por categoria, provincia, estado o plan.
- Dificil manejar estados `pending`, `published`, `rejected`.
- Dificil auditar cambios.
- Dificil administrar usuarios y permisos.
- Riesgo de sobrescribir informacion.

Recomendacion:

- Imagenes: Azure Blob Storage.
- Datos estructurados: Azure Table Storage para MVP barato, o Cosmos DB serverless si se necesita busqueda/flexibilidad mayor.
- Autenticacion: Static Web Apps Auth si alcanza, o Azure AD B2C / Microsoft Entra External ID si se requiere flujo mas formal.

## Servicios Azure necesarios

## 1. Azure Static Web Apps

Uso:

- Hospedar pagina publica.
- Hospedar admin frontend.
- HTTPS automatico.
- Integracion con GitHub Actions.

Rutas sugeridas:

```text
/
/admin
/admin/login
/admin/empresa
/admin/servicios
```

## 2. Azure Functions

Uso:

- Registro de empresas.
- Login/session validation si no se usa auth integrada.
- CRUD de empresa.
- CRUD de servicios.
- Upload firmado de imagenes.
- Revision/publicacion.
- Envio de notificaciones.

Endpoints sugeridos:

```text
POST /api/companies/register
GET /api/companies/me
PATCH /api/companies/me
GET /api/companies/me/services
POST /api/companies/me/services
PATCH /api/companies/me/services/{serviceId}
DELETE /api/companies/me/services/{serviceId}
POST /api/uploads/sign
POST /api/admin/companies/{companyId}/publish
```

## 3. Azure Blob Storage

Uso:

- Fotos de empresa.
- Portadas por servicio.
- Galerias por servicio.

Estructura sugerida:

```text
public/
  companies/
    {companyId}/
      logo.webp
      cover.webp
      services/
        {serviceId}/
          cover.webp
          gallery-01.webp
          gallery-02.webp

private/
  pending/
    {companyId}/
      uploads-originales/
```

Reglas:

- Las imagenes publicadas viven en contenedor publico o con CDN.
- Las imagenes pendientes pueden vivir en contenedor privado.
- Validar extension, MIME type y peso.
- Idealmente convertir a WebP antes de publicar.

## 4. Azure Table Storage o Cosmos DB Serverless

Para MVP barato:

```text
Azure Table Storage
```

Tablas sugeridas:

```text
Companies
Services
Users
Leads
Plans
AuditLog
```

Si se requiere busqueda avanzada despues:

```text
Cosmos DB Serverless
Azure AI Search
```

## Modelo de datos base

## Company

```json
{
  "id": "company_123",
  "name": "Aurisbel",
  "slug": "aurisbel",
  "status": "pending",
  "plan": "free",
  "email": "empresa@email.com",
  "whatsapp": "50688888888",
  "phone": "50622222222",
  "website": "https://...",
  "instagram": "https://...",
  "province": "Heredia",
  "canton": "San Francisco",
  "address": "...",
  "description": "...",
  "logoUrl": "...",
  "coverUrl": "...",
  "createdAt": "2026-05-27T00:00:00Z",
  "updatedAt": "2026-05-27T00:00:00Z"
}
```

## Service

```json
{
  "id": "service_123",
  "companyId": "company_123",
  "name": "Mesa dulce",
  "category": "Mesas de dulces",
  "eventTypes": ["Bodas", "Cumpleanos", "Baby Shower"],
  "status": "published",
  "description": "...",
  "priceFrom": "CRC 120000",
  "coverUrl": "...",
  "gallery": ["...", "..."],
  "sortBoost": 0,
  "isFeatured": false,
  "createdAt": "2026-05-27T00:00:00Z",
  "updatedAt": "2026-05-27T00:00:00Z"
}
```

## User

```json
{
  "id": "user_123",
  "companyId": "company_123",
  "email": "empresa@email.com",
  "role": "company_owner",
  "status": "active",
  "createdAt": "2026-05-27T00:00:00Z"
}
```

## Planes y posicionamiento

Por ahora:

- Registro gratis.
- Perfil y servicios publicados despues de revision.

Futuro:

- Plan destacado para aparecer arriba en categoria.
- Plan portada para primera pagina.
- Pago unico por periodo o mensualidad.

Infra debe soportar campos desde ahora:

```text
company.plan
service.sortBoost
service.isFeatured
service.featuredUntil
```

## Seguridad

- No permitir carga anonima directa a Blob Storage.
- Usar SAS token corto generado por Azure Function.
- Escanear/validar imagenes.
- Limitar cantidad y peso de imagenes.
- Proteger rutas `/admin`.
- Separar permisos empresa/admin interno.
- Registrar cambios importantes en `AuditLog`.

## Entregables de Infra

1. Definir ambiente dev/staging/prod.
2. Confirmar servicio de autenticacion.
3. Crear Storage Account y containers.
4. Crear Azure Functions.
5. Crear Table Storage o Cosmos DB serverless.
6. Definir variables de entorno.
7. Documentar limites de upload.
8. Preparar CI/CD desde GitHub.
9. Definir estrategia de backups/export.

