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

### POST `/api/admin/company-invites`

Genera una invitacion para que una empresa acceda al panel.

Uso:

```text
Admin interno / QA controlado
```

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
  "serviceId": "service_123",
  "slug": "mesa-dulce",
  "status": "draft"
}
```

Validaciones:

- `name`, `category` y `description` requeridos.
- `eventTypes` debe ser arreglo de valores conocidos o texto limpio.
- `status` inicial `draft`; al enviar a revision puede pasar a `pending`.
- `sortBoost`, `isFeatured` y `featuredUntil` no son editables por empresa en MVP.

### PATCH `/api/companies/me/services/{serviceId}`

Actualiza un servicio propio.

Validaciones:

- `serviceId` debe pertenecer a la empresa autenticada.
- No permitir editar servicios de otra empresa.
- No permitir cambiar `companyId`, `plan`, `sortBoost`, `isFeatured`, `featuredUntil`.
- Si un servicio `published` cambia contenido publico, puede volver a `pending`.

### DELETE `/api/companies/me/services/{serviceId}`

Desactiva o elimina logicamente un servicio propio.

Response `200`:

```json
{
  "serviceId": "service_123",
  "status": "inactive"
}
```

Regla MVP:

- Preferir `status: inactive` sobre borrado fisico para no romper leads, auditoria o URLs publicas.

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

### GET `/api/public/services`

Devuelve servicios publicados para busqueda/listado publico.

Query params sugeridos:

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
- Ordenar por `sortBoost`, `isFeatured`, relevancia y fecha segun decision de producto.
- No devolver datos privados ni imagenes pendientes.

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

- Si la empresa no esta `published`, responder `404`.
- Solo incluir servicios `published`.
- Permitir query opcional `?service=mesa-dulce` para que frontend destaque el servicio seleccionado.

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
