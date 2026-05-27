# TASK-003: Inventario Backend API y contrato MVP

## Equipo

Backend API.

## Estado

Completada.

## Objetivo

Inventariar las Azure Functions actuales en `/api`, compararlas contra el modelo objetivo:

```text
Company -> Services -> Leads
```

Entregar:

- Endpoints actuales.
- Cuales sirven.
- Cuales deben cambiar.
- Endpoints faltantes para MVP.
- Propuesta de contrato API.

No se debia implementar codigo todavia.

## Alcance

Incluido:

- Lectura de `chat-start/BACKEND_API.md`.
- Revision de `api/*/function.json`.
- Revision de funciones principales en `api/*/index.js`.
- Revision de helpers compartidos en `api/shared`.
- Comparacion contra `docs/DATA_MODEL.md` y el modelo recomendado.

Fuera de alcance:

- No se modificaron Azure Functions.
- No se tocaron endpoints existentes.
- No se cambio UI publica.
- No se cambio modelo de datos en runtime.
- No se probaron llamadas reales contra Azure.

## Endpoints actuales

| Endpoint | Metodo | Function | Sirve hoy para | Comparacion contra Company -> Services |
| --- | --- | --- | --- | --- |
| `/api/register-provider` | POST | `register-provider` | Registro inicial de proveedor/empresa como `pending` en tabla `Providers`. | Sirve como base temporal para `Company`, pero mezcla datos de empresa con datos de servicio (`category`, `price`). Debe migrar o convivir con `POST /api/companies/register`. |
| `/api/create-upload-url` | POST | `create-upload-url` | Crear SAS temporal para subir imagen a `uploads-pending`; reserva slot en `ProviderImages`. | Sirve como base para uploads. Debe generalizarse a `POST /api/uploads/sign` con scope `company` o `service`. |
| `/api/register-upload` | POST | `register-upload` | Verificar blob subido y marcar imagen como `pending`. | Sirve como base de seguridad de uploads. Debe asociarse a `companyId/serviceId/uploadId`, no solo `providerId/imageId`. |
| `/api/providers` | GET | `providers` | Listar proveedores `published` con imagenes publicas. | Sirve para compatibilidad publica actual. Debe cambiar la lectura publica futura a servicios, no empresas: `GET /api/public/services`. |
| `/api/providers?admin=pending-providers` | GET | `providers` delega a `admin-pending-providers` | Alias por query para listar pendientes admin. | Conveniente solo como compatibilidad/demo. Debe evitarse crecer APIs admin por query params. |
| `/api/providers?admin=approve-provider` | POST | `providers` delega a `admin-approve-provider` | Alias por query para aprobar proveedor. | Debe retirarse cuando el admin use rutas dedicadas. |
| `/api/providers?admin=reject-provider` | POST | `providers` delega a `admin-reject-provider` | Alias por query para rechazar proveedor. | Debe retirarse cuando el admin use rutas dedicadas. |
| `/api/admin/pending-providers` | GET | `admin-pending-providers` | Listar proveedores pendientes con imagenes y previews SAS. | Sirve para revision manual MVP. Debe evolucionar a revision de companies/services. |
| `/api/admin/approve-provider` | POST | `admin-approve-provider` | Aprobar proveedor, copiar imagenes a `public` y publicar. | Sirve para flujo de aprobacion actual. Debe separar aprobacion de empresa y aprobacion de servicios. |
| `/api/admin/reject-provider` | POST | `admin-reject-provider` | Rechazar proveedor e imagenes pendientes/reservadas. | Sirve para flujo actual. Debe separar rechazo de empresa/servicios y registrar auditoria. |
| `/api/admin-pending-providers` | GET | `admin-pending-providers-flat` | Alias plano de compatibilidad. | Mantener temporalmente; no usar para nuevos contratos. |
| `/api/admin-approve-provider` | POST | `admin-approve-provider-flat` | Alias plano de compatibilidad. | Mantener temporalmente; no usar para nuevos contratos. |
| `/api/admin-reject-provider` | POST | `admin-reject-provider-flat` | Alias plano de compatibilidad. | Mantener temporalmente; no usar para nuevos contratos. |

Nota tecnica:

Todos los `function.json` tienen `authLevel: anonymous`. La seguridad real admin se hace dentro de la funcion con `requireAdminAuth` usando Basic Auth y variables `ADMIN_USERNAME` / `ADMIN_PASSWORD`.

## Que sirve

- El flujo de registro pendiente actual funciona como primera base para registrar empresas gratis.
- La generacion de SAS temporal esta bien encaminada:
  - SAS corto.
  - Blob especifico.
  - Container pendiente.
  - Sin exponer storage keys al frontend.
- `register-upload` ya verifica:
  - Reserva previa.
  - Expiracion.
  - URL esperada.
  - Existencia del blob.
  - MIME real.
  - Tamano real.
- El admin ya puede listar, aprobar y rechazar proveedores pendientes.
- El endpoint publico `/api/providers` filtra por `published` y no devuelve imagenes pendientes.
- La persistencia actual con Azure Table Storage y Blob Storage coincide con la decision MVP serverless.

## Que debe cambiar

- Cambiar el lenguaje de dominio de `Provider` a `Company` sin romper compatibilidad.
- Separar datos de empresa y datos de servicio:
  - `Company`: marca, ubicacion, contacto, plan, estado.
  - `Service`: categoria, tipo de evento, precio, descripcion, fotos y estado.
- Mover `category`, `price` y fotos de oferta hacia `Service` cuando aplique.
- Agregar identidad/autenticacion de empresa para endpoints `/companies/me`.
- Crear tabla o entidad `Services`; hoy no existe CRUD de servicios.
- Crear endpoints publicos orientados a servicios publicados.
- Separar aprobacion admin:
  - empresa,
  - servicio,
  - imagenes.
- Reemplazar aliases admin planos y en query por rutas dedicadas cuando el admin frontend este alineado.
- Agregar auditoria para aprobaciones/rechazos y cambios sensibles.
- Agregar limpieza automatica de reservas/uploads vencidos con Timer Function o lifecycle rule.

## Endpoints faltantes para MVP

Endpoints empresa:

```text
POST  /api/companies/register
GET   /api/companies/me
PATCH /api/companies/me
```

Endpoints servicios:

```text
GET    /api/companies/me/services
POST   /api/companies/me/services
PATCH  /api/companies/me/services/{serviceId}
DELETE /api/companies/me/services/{serviceId}
```

Endpoints uploads:

```text
POST /api/uploads/sign
POST /api/uploads/complete
```

Endpoints publicos:

```text
GET /api/public/services
GET /api/public/companies/{slug}
```

Endpoints leads/cotizacion:

```text
POST /api/public/leads
GET  /api/companies/me/leads
```

Endpoints admin MVP:

```text
GET  /api/admin/companies/pending
POST /api/admin/companies/{companyId}/approve
POST /api/admin/companies/{companyId}/reject
GET  /api/admin/services/pending
POST /api/admin/services/{serviceId}/approve
POST /api/admin/services/{serviceId}/reject
```

## Propuesta de contrato API

### POST `/api/companies/register`

Registra empresa gratis y crea el primer usuario/owner, o deja el usuario pendiente si la autenticacion se define con Static Web Apps Auth / Entra.

Request:

```json
{
  "companyName": "Aurisbel",
  "email": "empresa@email.com",
  "password": "solo-si-se-usa-auth-propia",
  "whatsapp": "50688888888",
  "province": "Heredia",
  "canton": "San Francisco",
  "description": "Reposteria y servicios para eventos."
}
```

Response:

```json
{
  "companyId": "company_123",
  "slug": "aurisbel",
  "status": "pending",
  "plan": "free"
}
```

Reglas:

- Validar campos requeridos.
- Email valido.
- Slug unico.
- `plan` inicial `free`.
- No publicar automaticamente.
- No devolver secretos ni hashes.

### GET `/api/companies/me`

Devuelve la empresa asociada al usuario autenticado.

Response:

```json
{
  "id": "company_123",
  "slug": "aurisbel",
  "name": "Aurisbel",
  "status": "pending",
  "plan": "free",
  "email": "empresa@email.com",
  "whatsapp": "50688888888",
  "province": "Heredia",
  "canton": "San Francisco",
  "description": "..."
}
```

Reglas:

- Requiere auth de empresa.
- Solo devuelve la empresa propia.

### PATCH `/api/companies/me`

Actualiza campos editables de empresa.

Request parcial:

```json
{
  "name": "Aurisbel Eventos",
  "whatsapp": "50688888888",
  "phone": "50622222222",
  "website": "https://...",
  "instagram": "https://...",
  "province": "Heredia",
  "canton": "San Francisco",
  "district": "Heredia",
  "address": "...",
  "description": "...",
  "logoUrl": "...",
  "coverUrl": "..."
}
```

Reglas:

- No permitir cambiar `plan`, `status`, `id`, `createdAt`.
- Cambios publicos pueden dejar el perfil en `pending` si Product define revision manual.

### GET `/api/companies/me/services`

Lista servicios de la empresa autenticada.

Response:

```json
[
  {
    "id": "service_123",
    "companyId": "company_123",
    "slug": "mesa-dulce",
    "name": "Mesa dulce",
    "category": "Mesas de dulces",
    "status": "draft",
    "eventTypes": ["Bodas", "Cumpleanos"],
    "priceFrom": "CRC 120000"
  }
]
```

### POST `/api/companies/me/services`

Crea un servicio propio.

Request:

```json
{
  "name": "Mesa dulce",
  "category": "Mesas de dulces",
  "eventTypes": ["Bodas", "Cumpleanos"],
  "description": "Mesa dulce personalizada.",
  "priceFrom": "CRC 120000",
  "coverUrl": "",
  "gallery": []
}
```

Response:

```json
{
  "serviceId": "service_123",
  "slug": "mesa-dulce",
  "status": "draft"
}
```

Reglas:

- `name`, `category`, `description` requeridos.
- `status` inicial `draft`.
- Envio a revision debe pasar a `pending`.
- Campos comerciales de posicionamiento no editables por empresa:
  - `sortBoost`,
  - `isFeatured`,
  - `featuredUntil`.

### PATCH `/api/companies/me/services/{serviceId}`

Actualiza un servicio propio.

Reglas:

- El servicio debe pertenecer a la empresa autenticada.
- No permitir cambiar `companyId`.
- Si cambia contenido publico de un servicio publicado, puede volver a `pending`.

### DELETE `/api/companies/me/services/{serviceId}`

Desactiva un servicio propio.

Response:

```json
{
  "serviceId": "service_123",
  "status": "inactive"
}
```

Regla:

- Preferir baja logica `inactive` sobre borrado fisico.

### POST `/api/uploads/sign`

Genera SAS temporal para imagenes de empresa o servicio.

Request:

```json
{
  "scope": "service",
  "serviceId": "service_123",
  "imageType": "cover",
  "fileName": "mesa.jpg",
  "contentType": "image/jpeg",
  "size": 320000
}
```

Response:

```json
{
  "uploadId": "upload_123",
  "uploadUrl": "https://...",
  "pendingBlobUrl": "https://...",
  "expiresInMinutes": 10
}
```

Reglas:

- Requiere auth.
- `scope`: `company` o `service`.
- Si `scope=service`, validar pertenencia del servicio.
- Maximo 5 MB.
- Tipos permitidos: JPG, PNG, WEBP.
- SAS solo para escritura del blob especifico.
- Publicacion solo despues de revision.

### POST `/api/uploads/complete`

Marca upload como completado despues de verificar blob real.

Request:

```json
{
  "uploadId": "upload_123",
  "pendingBlobUrl": "https://..."
}
```

Response:

```json
{
  "uploadId": "upload_123",
  "status": "pending"
}
```

Reglas:

- Verificar reserva vigente.
- Verificar blob existe.
- Verificar MIME y tamano reales.
- Asociar imagen a company/service segun scope.

### GET `/api/public/services`

Lista servicios publicados para busqueda publica.

Query params:

```text
q
category
eventType
province
limit
cursor
```

Response:

```json
{
  "items": [
    {
      "id": "service_123",
      "slug": "mesa-dulce",
      "name": "Mesa dulce",
      "category": "Mesas de dulces",
      "eventTypes": ["Bodas"],
      "description": "...",
      "priceFrom": "CRC 120000",
      "coverUrl": "https://...",
      "company": {
        "id": "company_123",
        "slug": "aurisbel",
        "name": "Aurisbel",
        "province": "Heredia",
        "plan": "free"
      }
    }
  ],
  "nextCursor": ""
}
```

Reglas:

- Solo servicios `published`.
- Solo empresas `published`.
- No devolver imagenes pendientes.

### GET `/api/public/companies/{slug}`

Devuelve perfil publico de empresa con sus servicios publicados.

Response:

```json
{
  "id": "company_123",
  "slug": "aurisbel",
  "name": "Aurisbel",
  "description": "...",
  "logoUrl": "https://...",
  "coverUrl": "https://...",
  "whatsapp": "50688888888",
  "services": [
    {
      "id": "service_123",
      "slug": "mesa-dulce",
      "name": "Mesa dulce",
      "status": "published",
      "coverUrl": "https://..."
    }
  ]
}
```

Reglas:

- Si la empresa no esta publicada, responder `404`.
- Solo incluir servicios publicados.
- Permitir `?service=mesa-dulce` para destacar un servicio en frontend.

### POST `/api/public/leads`

Crea solicitud/cotizacion publica asociada a empresa y servicio.

Request:

```json
{
  "companyId": "company_123",
  "serviceId": "service_123",
  "eventType": "Boda",
  "date": "2026-08-15",
  "guests": 80,
  "name": "Cliente",
  "phone": "8888-8888",
  "message": "Quiero cotizar."
}
```

Response:

```json
{
  "leadId": "lead_123",
  "status": "received"
}
```

Reglas:

- Validar que company y service existan y esten publicados.
- Agregar anti-spam/CAPTCHA o rate limiting antes de abrirlo.

## Persistencia sugerida

Para Azure Table Storage MVP:

| Tabla | PartitionKey | RowKey | Uso |
| --- | --- | --- | --- |
| `Companies` | `company` | `companyId` | Perfil de empresa. |
| `CompanySlugs` | `slug` | `slug` | Lookup y unicidad de slug. |
| `Users` | `companyId` | `userId` | Usuarios de empresa si no se delega totalmente en Static Web Apps Auth. |
| `Services` | `companyId` | `serviceId` | Servicios por empresa. |
| `ServiceIndex` | `published` o categoria | `serviceId` | Vista publica para listados/busqueda simple. |
| `Uploads` | `companyId` | `uploadId` | Reservas y estado de imagenes. |
| `Leads` | `companyId` | `leadId` | Solicitudes/cotizaciones. |
| `AuditLog` | `companyId` | `timestamp-id` | Aprobaciones, rechazos y cambios sensibles. |

## Cambios realizados

- Se leyo `chat-start/BACKEND_API.md`.
- Se inventariaron las Azure Functions actuales leyendo `api/*/function.json`.
- Se revisaron funciones de registro, upload, listado publico y admin.
- Se comparo la API actual contra `Company -> Services -> Leads`.
- Se documento el contrato API propuesto para MVP en este handoff.
- No se implemento codigo.
- No se modificaron endpoints.

## Archivos tocados

- `tasks/TASK-003-HANDOFF.md`

## Verificacion realizada

Comandos/revisiones:

```text
Get-Content -Raw -LiteralPath 'chat-start/BACKEND_API.md'
Get-ChildItem -Recurse -File -LiteralPath 'api'
Get-ChildItem -Recurse -Filter function.json -LiteralPath 'api' | ... ConvertFrom-Json
Get-Content -Raw -LiteralPath 'api/shared/config.js'
Get-Content -Raw -LiteralPath 'api/shared/validation.js'
Get-Content -Raw -LiteralPath 'api/shared/azure.js'
```

Resultado:

- Se confirmaron rutas, metodos y `authLevel`.
- Se confirmo que no existen endpoints `companies`, `services`, `leads` ni `uploads/sign`.
- Se confirmo que el modelo actual persiste en `Providers` y `ProviderImages`.
- Se confirmo que los endpoints admin usan Basic Auth interno, aunque el `authLevel` de Azure Function sea `anonymous`.
- No se ejecuto prueba end-to-end contra Azure porque la tarea era inventario y contrato.

## Riesgos

- El dominio actual `Provider` puede crecer como deuda si se implementan mas features encima sin migracion.
- La API publica actual devuelve proveedores, pero el producto quiere resultados por servicio.
- No existe autenticacion de empresa; bloquearia `/companies/me` y CRUD de servicios.
- Basic Auth admin es aceptable para MVP privado, pero no para produccion abierta.
- Rutas admin duplicadas y query params en `/api/providers` pueden confundir integraciones futuras.
- Falta auditoria de aprobaciones/rechazos.
- Falta rate limiting/CAPTCHA para registro, uploads y leads.
- Falta limpieza automatica de uploads/reservas vencidas.
- Si `public` no es legible publicamente en Storage, las URLs publicas aprobadas pueden no renderizar sin SAS/proxy/CDN.

## Pendientes

- Product/Architect debe decidir estrategia de autenticacion:
  - Static Web Apps Auth,
  - Entra External ID/B2C,
  - o auth propia temporal.
- Definir plan de migracion:
  - mantener `Provider` como compatibilidad,
  - crear `Companies/Services` nuevo,
  - o mapear `Provider` a `Company` en una capa adaptadora.
- Definir si la primera version de registro crea:
  - solo `Company`,
  - o `Company + primer Service`.
- Definir revision:
  - empresa y servicios se aprueban juntos,
  - o cada servicio tiene revision independiente.
- Crear tarea separada para implementar `POST /api/companies/register`.
- Crear tarea separada para implementar CRUD de servicios.
- Crear tarea separada para endpoints publicos de servicios.
- Crear tarea QA para pruebas de permisos y estados.

## Recomendacion para Product/Architect

Recomendacion principal:

```text
No seguir ampliando `Provider` como modelo final.
```

Usar `Provider` solo como capa de compatibilidad mientras se crea el modelo nuevo:

```text
Company -> Services -> Leads
```

Decision recomendada para el siguiente paso:

```text
Implementar primero POST /api/companies/register como endpoint nuevo, sin romper /api/register-provider.
```

Motivo:

- Permite avanzar hacia el modelo correcto.
- Mantiene funcionando el formulario actual.
- Reduce riesgo de romper la pagina publica.
- Deja listo el camino para `companies/me/services`.

Product/Architect debe decidir antes de implementacion:

- Autenticacion de empresa.
- Si registro crea primer servicio o solo empresa.
- Politica de revision para empresas y servicios.
- Nombres definitivos de tablas: `Companies`, `Services`, `Uploads`, `Leads`.

## Siguiente tarea sugerida

Backend API:

```text
Implementar POST /api/companies/register con Table Storage, validaciones basicas y compatibilidad sin tocar endpoints provider existentes.
```

Infra Azure:

```text
Confirmar si hay que crear nuevas tablas Companies, Services, Uploads, Leads o si Azure Functions las creara al vuelo.
```

QA:

```text
Preparar matriz de pruebas para registro de empresa, estados y permisos.
```

