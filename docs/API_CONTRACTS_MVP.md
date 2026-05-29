# Contratos API MVP

## Objetivo

Este documento alinea la API actual con el modelo objetivo:

```text
Company -> Services -> Leads
```

La API existente usa nombres `provider` porque nacio del primer registro de proveedores. Para evitar romper la pagina publica y el admin demo, esos endpoints se mantienen como compatibilidad mientras se agregan contratos nuevos `companies/services`.

## Inventario API actual

| Endpoint | Metodo | Estado | Uso actual | Notas |
| --- | --- | --- | --- | --- |
| `/api/register-provider` | POST | Implementado | Registra proveedor/empresa en `Providers` con `status: pending` y `plan: free`. | Modelo plano. No crea `User` ni `Service`. |
| `/api/create-upload-url` | POST | Implementado | Genera SAS temporal para subir imagen a `uploads-pending`. | Requiere proveedor editable. Reserva slot en `ProviderImages`. |
| `/api/register-upload` | POST | Implementado | Verifica blob subido y marca imagen como `pending`. | Valida reserva, MIME real y tamano real. |
| `/api/providers` | GET | Implementado | Devuelve solo proveedores `published` con imagenes publicas. | Publico actual; devuelve empresas, no servicios. |
| `/api/admin/pending-providers` | GET | Implementado | Lista proveedores `pending` para revision. | Protegido con Basic Auth admin. |
| `/api/admin/approve-provider` | POST | Implementado | Publica proveedor e imagenes aprobadas. | Copia imagenes de `uploads-pending` a `public`. |
| `/api/admin/reject-provider` | POST | Implementado | Rechaza proveedor e imagenes pendientes/reservadas. | Guarda razon de rechazo si se envia. |
| `/api/admin-pending-providers` | GET | Compatibilidad | Alias plano del endpoint admin. | Mantener hasta retirar dependencias del admin demo. |
| `/api/admin-approve-provider` | POST | Compatibilidad | Alias plano del endpoint admin. | Mantener hasta retirar dependencias del admin demo. |
| `/api/admin-reject-provider` | POST | Compatibilidad | Alias plano del endpoint admin. | Mantener hasta retirar dependencias del admin demo. |

## Brecha contra Company -> Services

La API actual sirve para registro inicial y revision manual de una empresa con fotos, pero todavia no cubre el modelo recomendado completo.

Debe cambiar o agregarse:

- Separar `Company` de `Service`. Hoy `category`, `price` y fotos viven a nivel proveedor.
- Crear identidad de usuario de empresa. Hoy no hay `User` ni sesion de empresa.
- Crear CRUD de servicios por empresa. Hoy no hay tabla `Services` ni endpoints de servicio.
- Cambiar busqueda publica para devolver servicios publicados con contexto de empresa.
- Agregar leads/cotizaciones asociadas a `companyId` y `serviceId`.
- Definir auditoria basica para aprobaciones, rechazos y cambios sensibles.

## Contrato objetivo MVP

### POST `/api/companies/register`

Registra una empresa gratis y crea el primer usuario propietario.

Request:

```json
{
  "companyName": "Aurisbel",
  "email": "empresa@email.com",
  "password": "password-temporal-o-flujo-auth",
  "whatsapp": "50688888888",
  "website": "https://...",
  "instagram": "https://...",
  "facebook": "https://...",
  "tiktok": "https://...",
  "province": "Heredia",
  "canton": "San Francisco",
  "description": "Reposteria y servicios para eventos."
}
```

Response `201`:

```json
{
  "companyId": "company_123",
  "slug": "aurisbel",
  "status": "pending",
  "plan": "free"
}
```

Validaciones:

- `companyName`, `email`, `whatsapp`, `province` y `description` requeridos.
- `website`, `instagram`, `facebook` y `tiktok` son opcionales.
- `email` es dato interno por defecto; no publicarlo en endpoints publicos.
- Email valido y normalizado.
- Slug unico.
- `status` inicial `pending` o `draft` segun flujo de producto.
- `plan` inicial `free`.
- No devolver secretos ni hashes.

### GET `/api/companies/me`

Devuelve la empresa autenticada.

Response `200`:

```json
{
  "id": "company_123",
  "slug": "aurisbel",
  "name": "Aurisbel",
  "status": "pending",
  "plan": "free",
  "email": "empresa@email.com",
  "whatsapp": "50688888888",
  "website": "https://...",
  "instagram": "https://...",
  "facebook": "https://...",
  "tiktok": "https://...",
  "province": "Heredia",
  "canton": "San Francisco",
  "description": "..."
}
```

Validaciones:

- Requiere usuario autenticado con rol `company_owner` o permiso equivalente.
- Solo devuelve la empresa asociada al usuario.

### POST `/api/company-auth/accept-invite`

Acepta una invitacion de empresa y crea sesion server-side.

Request:

```json
{
  "token": "token-largo-de-invitacion"
}
```

Response `200`:

```json
{
  "companyId": "company_123",
  "email": "empresa@email.com",
  "role": "company_owner"
}
```

Headers:

```text
Set-Cookie: pe_company_session=<session>; HttpOnly; Secure; SameSite=Lax; Path=/api
```

Validaciones:

- Token requerido.
- Token debe existir como hash en `CompanyInvites`.
- Token no debe estar vencido, usado ni revocado.
- Al aceptar, marcar invitacion como usada y crear `CompanySessions`.
- No devolver token, hash ni datos internos.

### POST `/api/company-auth/logout`

Cierra la sesion de empresa.

Response `200`:

```json
{
  "ok": true
}
```

Reglas:

- Si hay cookie de sesion valida, marcar sesion como `revoked`.
- Limpiar cookie con expiracion inmediata.
- Si no hay sesion, puede responder `200` idempotente.

### POST `/api/internal/company-invites`

Genera una invitacion para que una empresa acceda al panel.

Uso:

```text
Admin interno / QA controlado
```

Nota:

Se evita el prefijo `/api/admin/...` porque `admin` puede conflictuar con rutas reservadas del runtime de Azure Functions.

Request:

```json
{
  "companyId": "company_123",
  "email": "empresa@email.com"
}
```

Response `201`:

```json
{
  "inviteId": "invite_123",
  "companyId": "company_123",
  "email": "empresa@email.com",
  "role": "company_owner",
  "expiresAt": "2026-05-28T00:00:00Z",
  "inviteUrl": "https://.../panel.html?invite=..."
}
```

Validaciones:

- Requiere Basic Auth admin mientras no exista admin auth formal.
- `companyId` requerido.
- La empresa debe existir.
- Email requerido; si no se envia, puede usar email de la empresa.
- Guardar solo `tokenHash` en `CompanyInvites`.
- Devolver el token solo una vez dentro de `inviteUrl`.
- No devolver `tokenHash`, storage keys, connection strings ni secretos.
- Registrar `status: active`, `expiresAt`, `createdAt`, `updatedAt`.

### POST `/api/internal/companies/{companyId}/approve`

Publica una empresa.

Response `200`:

```json
{
  "ok": true,
  "status": "published"
}
```

Reglas:

- Requiere credencial interna admin.
- Actualiza `Companies.status` a `published`.
- Actualiza `updatedAt`.
- Limpia `rejectionReason`.
- No publica automaticamente servicios ni uploads relacionados.

### GET `/api/internal/companies/pending`

Lista empresas pendientes para moderacion interna.

Response `200`:

```json
{
  "items": [
    {
      "companyId": "company_123",
      "slug": "aurisbel",
      "name": "Aurisbel",
      "email": "empresa@email.com",
      "whatsapp": "50688888888",
      "province": "Heredia",
      "canton": "San Francisco",
      "description": "...",
      "status": "pending",
      "plan": "free",
      "createdAt": "2026-05-27T00:00:00Z",
      "updatedAt": "2026-05-27T00:00:00Z"
    }
  ]
}
```

Reglas:

- Requiere credencial interna admin.
- Lista solo `Companies` con `PartitionKey=company` y `status=pending`.
- No devuelve `partitionKey`, `rowKey`, hashes, cookies, SAS, connection strings ni metadata interna.

### POST `/api/internal/companies/{companyId}/reject`

Rechaza una empresa.

Request opcional:

```json
{
  "reason": "Informacion incompleta"
}
```

Response `200`:

```json
{
  "ok": true,
  "status": "rejected"
}
```

Reglas:

- Requiere credencial interna admin.
- Actualiza `Companies.status` a `rejected`.
- Guarda `rejectionReason` si se envia.
- Actualiza `updatedAt`.
- No rechaza automaticamente servicios ni uploads relacionados salvo accion futura explicita con confirmacion.

### GET `/api/internal/services/pending`

Lista servicios revisables para moderacion interna.

Response `200`:

```json
{
  "items": [
    {
      "companyId": "company_123",
      "companyName": "Aurisbel",
      "companySlug": "aurisbel",
      "serviceId": "service_123",
      "slug": "mesa-dulce",
      "name": "Mesa dulce",
      "category": "Mesas de dulces",
      "eventTypes": ["Bodas"],
      "priceFrom": "CRC 120000",
      "description": "...",
      "status": "draft",
      "coverUrl": "",
      "gallery": [],
      "createdAt": "2026-05-27T00:00:00Z",
      "updatedAt": "2026-05-27T00:00:00Z"
    }
  ]
}
```

Reglas:

- Requiere credencial interna admin.
- Lista servicios con `status=draft` o `status=pending`.
- Enriquece con `companyName` y `companySlug` cuando la empresa existe.
- No devuelve `partitionKey`, `rowKey`, hashes, cookies, SAS, connection strings ni metadata interna.

### POST `/api/internal/services/{companyId}/{serviceId}/approve`

Publica un servicio.

Response `200`:

```json
{
  "ok": true,
  "status": "published"
}
```

Reglas:

- Requiere credencial interna admin.
- El servicio debe existir en `Services` con `PartitionKey=companyId` y `RowKey=serviceId`.
- Actualiza `Services.status` a `published`.
- Actualiza `updatedAt`.
- Limpia `rejectionReason`.
- No aprueba uploads pendientes automaticamente; los uploads deben aprobarse por accion explicita.

### POST `/api/internal/services/{companyId}/{serviceId}/reject`

Rechaza un servicio.

Request opcional:

```json
{
  "reason": "Imagen borrosa"
}
```

Response `200`:

```json
{
  "ok": true,
  "status": "rejected"
}
```

Reglas:

- Requiere credencial interna admin.
- El servicio debe existir.
- Actualiza `Services.status` a `rejected`.
- Guarda `rejectionReason` si se envia.
- Actualiza `updatedAt`.
- No rechaza uploads pendientes automaticamente salvo accion futura explicita con confirmacion.

### POST `/api/internal/uploads/{companyId}/{uploadId}/approve`

Publica un upload pendiente.

Response `200`:

```json
{
  "ok": true,
  "status": "published",
  "publicBlobUrl": "https://..."
}
```

Reglas:

- Requiere credencial interna admin.
- El upload debe existir en `Uploads` con `PartitionKey=companyId` y `RowKey=uploadId`.
- Solo uploads `pending` pueden aprobarse.
- Copia el blob desde el contenedor pendiente hacia el contenedor publico usando el mismo path `companies/...`.
- Cambia `Uploads.status` a `published` y guarda `publicBlobName`, `publicBlobUrl` y `updatedAt`.
- Intenta borrar el blob pendiente despues de publicar; si falla el borrado, no falla la publicacion.
- Si `scope=service` e `imageType=cover`, actualiza `Services.coverUrl`.
- Si `scope=service` e `imageType=gallery`, agrega la URL a `Services.gallery`.
- Si `scope=company` e `imageType=cover`, actualiza `Companies.coverUrl`.
- Si `scope=company` e `imageType=logo`, actualiza `Companies.logoUrl`.
- Si `scope=company` e `imageType=gallery`, solo deja el upload publicado porque `Company` no tiene campo `gallery` definido para MVP.

### GET `/api/internal/uploads/pending`

Lista uploads pendientes para moderacion interna.

Response `200`:

```json
{
  "items": [
    {
      "companyId": "company_123",
      "uploadId": "upload_123",
      "scope": "service",
      "serviceId": "service_123",
      "imageType": "cover",
      "fileName": "foto.jpg",
      "contentType": "image/jpeg",
      "size": 12345,
      "status": "pending",
      "createdAt": "2026-05-27T00:00:00Z",
      "updatedAt": "2026-05-27T00:00:00Z"
    }
  ]
}
```

Reglas:

- Requiere credencial interna admin.
- Lista solo `Uploads` con `status=pending`.
- No devuelve `pendingBlobName`, `pendingBlobUrl`, SAS, `partitionKey`, `rowKey`, hashes, cookies, connection strings ni metadata interna.
- Preview visual de imagenes pendientes queda fuera de este contrato; si se necesita, debe ser un endpoint interno autenticado que no exponga SAS.

### POST `/api/internal/uploads/{companyId}/{uploadId}/reject`

Rechaza un upload.

Request opcional:

```json
{
  "reason": "Imagen borrosa"
}
```

Response `200`:

```json
{
  "ok": true,
  "status": "rejected"
}
```

Reglas:

- Requiere credencial interna admin.
- El upload debe existir.
- Cambia `Uploads.status` a `rejected`.
- Guarda `rejectionReason` si se envia.
- No copia ni publica el blob.

### PATCH `/api/companies/me`

Actualiza datos editables de la empresa autenticada.

Campos editables:

```json
{
  "name": "Aurisbel Eventos",
  "whatsapp": "50688888888",
  "phone": "50622222222",
  "website": "https://...",
  "instagram": "https://...",
  "facebook": "https://...",
  "tiktok": "https://...",
  "province": "Heredia",
  "canton": "San Francisco",
  "district": "Heredia",
  "address": "...",
  "description": "...",
  "logoUrl": "...",
  "coverUrl": "..."
}
```

Validaciones:

- No permitir cambiar `plan`, `status`, `id`, `createdAt` desde este endpoint.
- Cambios relevantes pueden volver el perfil a `pending` si producto decide revision manual.
- `email` sigue siendo dato interno por defecto; no debe aparecer en endpoints publicos.

### GET `/api/companies/me/services`

Lista servicios de la empresa autenticada.

Response `200`:

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

Crea un servicio de la empresa autenticada.

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

Response `201`:

```json
{
  "id": "service_123",
  "companyId": "company_123",
  "slug": "mesa-dulce",
  "name": "Mesa dulce",
  "category": "Mesas de dulces",
  "status": "draft",
  "eventTypes": ["Bodas", "Cumpleanos"],
  "priceFrom": "CRC 120000",
  "description": "Mesa dulce personalizada.",
  "coverUrl": "",
  "gallery": [],
  "createdAt": "2026-05-27T00:00:00Z",
  "updatedAt": "2026-05-27T00:00:00Z"
}
```

Validaciones:

- `name` y `category` requeridos.
- `eventTypes` debe ser arreglo; puede estar vacio mientras se define catalogo final.
- `status` inicial `draft`.
- La empresa no puede enviar `status` en create/update.
- Para MVP, una accion explicita `submit-review` debe cambiar `draft` a `pending`.
- `sortBoost`, `isFeatured` y `featuredUntil` no son editables por empresa en MVP.

### PATCH `/api/companies/me/services/{serviceId}`

Actualiza un servicio propio.

Request parcial:

```json
{
  "name": "Mesa dulce premium",
  "category": "Mesas de dulces",
  "eventTypes": ["Bodas"],
  "priceFrom": "CRC 150000",
  "description": "Mesa dulce premium para bodas.",
  "coverUrl": "",
  "gallery": []
}
```

Response `200`:

```json
{
  "id": "service_123",
  "companyId": "company_123",
  "slug": "mesa-dulce-premium",
  "name": "Mesa dulce premium",
  "category": "Mesas de dulces",
  "status": "draft",
  "eventTypes": ["Bodas"],
  "priceFrom": "CRC 150000",
  "description": "Mesa dulce premium para bodas.",
  "coverUrl": "",
  "gallery": [],
  "createdAt": "2026-05-27T00:00:00Z",
  "updatedAt": "2026-05-28T00:00:00Z"
}
```

Validaciones:

- `serviceId` debe pertenecer a la empresa autenticada.
- No permitir editar servicios de otra empresa.
- No permitir cambiar `companyId`, `status`, `plan`, `sortBoost`, `isFeatured`, `featuredUntil`.
- Si cambia `name`, regenerar `slug`.
- Si el nuevo `slug` ya existe en otro servicio de la misma empresa, responder `409`.
- `eventTypes` y `gallery` deben ser arreglos si vienen presentes.
- Si un servicio `published` cambia contenido publico, debe volver a `draft` y requerir `submit-review`.

### POST `/api/companies/me/services/{serviceId}/submit-review`

Envia un servicio propio a revision.

Response `200`:

```json
{
  "id": "service_123",
  "companyId": "company_123",
  "status": "pending",
  "updatedAt": "2026-05-28T00:00:00Z"
}
```

Reglas:

- Requiere autenticacion de empresa.
- `serviceId` debe pertenecer a la empresa autenticada.
- Solo servicios `draft` o `rejected` pueden enviarse a revision.
- Debe validar campos minimos antes de pasar a `pending`: `name`, `category`, `eventTypes`, `description` y `priceFrom`.
- No publica el servicio.
- No aprueba imagenes.
- No permite enviar servicios `inactive`.

### DELETE `/api/companies/me/services/{serviceId}`

Desactiva o elimina logicamente un servicio propio.

Response `200`:

```json
{
  "id": "service_123",
  "companyId": "company_123",
  "status": "inactive",
  "updatedAt": "2026-05-28T00:00:00Z"
}
```

Regla MVP:

- Preferir `status: inactive` sobre borrado fisico para no romper leads, auditoria o URLs publicas.
- No borrar fisicamente la entidad en Table Storage.
- Solo desactivar si `serviceId` pertenece a la empresa autenticada.

### POST `/api/uploads/sign`

Genera una URL SAS temporal para subir imagenes de empresa o servicio.

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

Response `200`:

```json
{
  "uploadId": "upload_123",
  "uploadUrl": "https://...",
  "pendingBlobUrl": "https://...",
  "expiresInMinutes": 10
}
```

Validaciones:

- Requiere autenticacion de empresa.
- `scope`: `company` o `service`.
- Si `scope` es `service`, el servicio debe pertenecer a la empresa autenticada.
- Maximo 5 MB por imagen.
- Tipos permitidos: `image/jpeg`, `image/png`, `image/webp`.
- Extensiones permitidas: `.jpg`, `.jpeg`, `.png`, `.webp`.
- SAS de escritura solo para un blob especifico y de corta duracion.
- Subida siempre a contenedor pendiente; publicar solo despues de revision.
- Crea reserva en tabla `Uploads` con `status: reserved`.

### POST `/api/uploads/confirm`

Confirma que una imagen reservada fue subida al contenedor pendiente y deja el upload listo para revision.

Request:

```json
{
  "uploadId": "upload_123"
}
```

Response `201`:

```json
{
  "uploadId": "upload_123",
  "status": "pending",
  "scope": "service",
  "serviceId": "service_123",
  "imageType": "cover",
  "pendingBlobUrl": "https://..."
}
```

Reglas:

- Requiere autenticacion de empresa.
- `companyId` sale solo de la sesion; el cliente no puede confirmar uploads de otra empresa.
- Busca en `Uploads` con `PartitionKey=companyId` y `RowKey=uploadId`.
- Solo confirma reservas `reserved`; uploads `published`, `rejected` u otros estados no confirmables responden `409`.
- Si el upload ya esta `pending`, responde idempotentemente `200` cuando el blob sigue coincidiendo con la reserva.
- Rechaza reservas vencidas con `409`.
- Valida que el blob pendiente exista en `pendingBlobName`.
- Valida MIME real contra `contentType` reservado y contra la lista permitida.
- Valida tamano real no vacio y maximo 5 MB.
- Al confirmar actualiza `status: pending`, `size` real y `updatedAt`; limpia `expiresAt` porque deja de ser una reserva vencible.
- No publica, no mueve blobs y no actualiza `coverUrl` ni `gallery`.

### GET `/api/public/services`

Devuelve servicios publicados para busqueda/listado publico.

Query params MVP:

```text
q
category
eventType
province
limit
cursor
```

Response `200`:

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
      "gallery": ["https://..."],
      "company": {
        "id": "company_123",
        "slug": "aurisbel",
        "name": "Aurisbel",
        "province": "Heredia",
        "canton": "San Francisco",
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
- `q` filtra de forma basica por `name`, `description`, `category` y `eventTypes`.
- `category`, `eventType` y `province` hacen match exacto normalizado.
- `limit` tiene maximo `50`.
- `cursor` queda reservado para una iteracion futura; por ahora siempre responde `nextCursor: ""`.
- Ordenar por `sortBoost`, `isFeatured`, relevancia y fecha segun decision de producto.
- No devolver datos privados ni imagenes pendientes.
- Implementacion MVP puede escanear servicios publicados y resolver empresas por `companyId`; migrar a `ServiceIndex` cuando se requiera ranking/paginacion real.

### GET `/api/public/companies/{slug}`

Devuelve perfil publico de empresa y sus servicios publicados.

Response `200`:

```json
{
  "id": "company_123",
  "slug": "aurisbel",
  "name": "Aurisbel",
  "description": "...",
  "logoUrl": "https://...",
  "coverUrl": "https://...",
  "whatsapp": "50688888888",
  "province": "Heredia",
  "canton": "San Francisco",
  "selectedServiceSlug": "mesa-dulce",
  "services": [
    {
      "id": "service_123",
      "slug": "mesa-dulce",
      "name": "Mesa dulce",
      "status": "published",
      "category": "Mesas de dulces",
      "eventTypes": ["Bodas"],
      "priceFrom": "CRC 120000",
      "description": "...",
      "coverUrl": "https://...",
      "gallery": ["https://..."]
    }
  ]
}
```

Reglas:

- Si la empresa no esta `published`, responder `404`.
- Solo incluir servicios `published`.
- Permitir query opcional `?service=mesa-dulce`; si coincide con un servicio publicado devuelto, responder `selectedServiceSlug` con ese slug. Si no coincide, responder `selectedServiceSlug: ""`.
- No devolver `email`, hashes, `partitionKey`, `rowKey`, tokens, metadata interna ni imagenes pendientes.

## Estados

Company:

- `draft`
- `pending`
- `published`
- `rejected`
- `suspended`

Service:

- `draft`
- `pending`
- `published`
- `rejected`
- `inactive`

Upload/Image:

- `reserved`
- `pending`
- `published`
- `rejected`

## Decisiones de moderacion MVP

- La moderacion operativa debe orientarse a expediente de empresa: empresa, servicios y uploads relacionados en un solo contexto.
- Las listas globales pueden mantenerse como resumen, pero no deben ser el unico flujo de decision cuando haya volumen real.
- No hay cascadas silenciosas:
  - aprobar empresa no publica servicios/uploads;
  - aprobar servicio no aprueba uploads;
  - rechazar empresa no rechaza servicios/uploads;
  - rechazar servicio no rechaza uploads.
- Las cascadas futuras deben ser acciones explicitas con resumen y confirmacion.

Errores comunes de endpoints internos:

- `400` para validacion de parametros.
- `401` si falta credencial admin.
- `404` si la entidad no existe.
- `405` si el metodo no es permitido.
- `409` si el estado no permite la accion solicitada.
- `500` para error inesperado.

## Persistencia MVP sugerida

Azure Table Storage:

| Tabla | PartitionKey | RowKey | Uso |
| --- | --- | --- | --- |
| `Companies` | `company` | `companyId` | Perfil de empresa. |
| `CompanySlugs` | `slug` | `slug` | Unicidad de slug y lookup rapido. |
| `CompanyInvites` | `companyId` | `inviteId` | Invitaciones para activar acceso al panel. |
| `CompanySessions` | `companyId` | `sessionId` | Sesiones server-side de empresas. |
| `Users` | `companyId` | `userId` | Usuarios asociados a empresa. |
| `Services` | `companyId` | `serviceId` | Servicios por empresa. |
| `ServiceIndex` | `published` o categoria | `serviceId` | Lectura publica mas barata si Table Storage no alcanza por filtros. |
| `Leads` | `companyId` | `leadId` | Cotizaciones/solicitudes. |
| `Uploads` | `companyId` | `uploadId` | Reservas e imagenes pendientes/publicadas. |
| `AuditLog` | `companyId` | `timestamp-id` | Cambios sensibles. |

## Riesgos y decisiones pendientes

- Autenticacion MVP de empresa sera por invitacion/token con sesion server-side. Azure Static Web Apps Auth queda como alternativa futura.
- Basic Auth admin sirve para demo interna, pero debe endurecerse antes de uso amplio.
- `Provider` y `Company` conviven durante la migracion. Se necesita mapa de compatibilidad para no romper el formulario actual.
- Table Storage puede limitar busqueda publica avanzada. Para MVP sirve; si crece, evaluar Cosmos DB serverless o Azure AI Search.
- Falta rate limiting/CAPTCHA para registro publico.
- Falta Timer Function o lifecycle rule para limpiar uploads pendientes vencidos.

## Checklist manual minimo

- Registrar empresa deja estado `pending` y plan `free`.
- Crear upload no expone connection strings ni storage keys.
- Upload vencido no puede registrarse.
- Imagen con MIME o tamano invalido se rechaza.
- Publico no recibe empresas, servicios ni imagenes pendientes.
- Admin no lista ni aprueba sin credenciales.
- Servicio no puede editarse desde otra empresa.
- Cambios de contrato actualizan `DATA_MODEL.md`, este documento y backlog.
