# TASK-049: Backend PATCH company services

## Equipo asignado

Backend API.

## Contexto

Ya estan aprobados en Azure real:

- `GET /api/companies/me/services`
- `POST /api/companies/me/services`

`TASK-048` confirmo el flujo autenticado real con cookie de empresa:

- invite `201`
- accept invite `200`
- `GET` autenticado `200`
- `POST` autenticado `201`
- duplicado `409`
- logout `200`
- `GET` despues de logout `401`

El siguiente paso es permitir que una empresa edite un servicio propio.

## Archivos que debes leer

- `AGENTS.md`
- `chat-start/BACKEND_API.md`
- `docs/BACKLOG.md`
- `docs/API_CONTRACTS_MVP.md`
- `docs/DATA_MODEL.md`
- `tasks/TASK-043-HANDOFF.md`
- `tasks/TASK-044-HANDOFF.md`
- `tasks/TASK-048-HANDOFF.md`
- `api/company-services-list/index.js`
- `api/company-services-create/index.js`
- `api/shared/companyAuth.js`
- `api/shared/config.js`
- `api/shared/azure.js`
- `api/shared/validation.js`

## Objetivo

Implementar:

```text
PATCH /api/companies/me/services/{serviceId}
```

Debe actualizar un servicio existente perteneciente exclusivamente a la empresa autenticada por cookie `pe_company_session`.

## Contrato esperado

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
  "id": "service_...",
  "companyId": "company_...",
  "slug": "mesa-dulce-premium",
  "name": "Mesa dulce premium",
  "category": "Mesas de dulces",
  "status": "draft",
  "eventTypes": ["Bodas"],
  "priceFrom": "CRC 150000",
  "description": "Mesa dulce premium para bodas.",
  "coverUrl": "",
  "gallery": [],
  "createdAt": "...",
  "updatedAt": "..."
}
```

Errores esperados:

```text
400 Validation error
401 Unauthorized
404 Service not found
405 Method not allowed
409 Slug already exists for this company
500 Unexpected server error
```

## Reglas de producto

- `companyId` debe salir solo de la sesion. Ignorar cualquier `companyId` enviado por query, body o headers.
- El servicio solo puede actualizarse si `PartitionKey` coincide con el `companyId` de la sesion.
- No permitir editar servicios de otra empresa.
- No permitir editar desde empresa estos campos:
  - `companyId`
  - `status`
  - `plan`
  - `sortBoost`
  - `isFeatured`
  - `featuredUntil`
  - cualquier campo de ranking/monetizacion/admin
- Para MVP, si cambia `name`, regenerar `slug`.
- Si el nuevo `slug` ya existe en otro servicio de la misma empresa, responder `409`.
- `eventTypes` y `gallery` deben recibirse como arreglos si vienen presentes.
- Persistir `eventTypes` y `gallery` de forma consistente con `POST`.
- Response API siempre devuelve `eventTypes` y `gallery` como arreglos.
- `updatedAt` debe cambiar en cada update exitoso.
- No modificar `createdAt`.
- No implementar upload de imagenes en esta tarea.
- No modificar UI en esta tarea.

## Criterios de aceptacion

- `PATCH /api/companies/me/services/{serviceId}` sin cookie responde `401`.
- `PATCH` con cookie valida actualiza solo servicio propio.
- `PATCH` sobre servicio inexistente o de otra empresa responde `404`.
- Inyectar `companyId`, `status`, `sortBoost`, `isFeatured` o `featuredUntil` en body no modifica esos campos.
- Cambio de `name` actualiza `slug`.
- Slug duplicado dentro de la misma empresa responde `409`.
- Response `200` no expone metadata interna ni campos de ranking.
- `GET /api/companies/me/services` refleja los cambios.
- `node --check` pasa en archivos nuevos/modificados.

## Entregable

Crear:

```text
tasks/TASK-049-HANDOFF.md
```

Debe incluir:

- Resultado general.
- Archivos modificados.
- Contrato implementado.
- Validaciones realizadas.
- Riesgos restantes.
- Siguiente tarea recomendada.

## Nota para coordinacion

Al terminar, avisar en el chat de Product/Architect:

```text
Termine TASK-049. Product/Architect debe leer tasks/TASK-049-HANDOFF.md.
```
