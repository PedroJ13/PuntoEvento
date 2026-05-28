# TASK-043: Backend POST company services

## Equipo asignado

Backend API.

## Contexto

Ya existen:

- `POST /api/companies/register`
- `POST /api/internal/company-invites`
- `POST /api/company-auth/accept-invite`
- `POST /api/company-auth/logout`
- `GET /api/companies/me`
- `GET /api/companies/me/services`

El siguiente paso es permitir que una empresa autenticada cree sus propios servicios desde el panel empresa.

## Archivos que debes leer

- `AGENTS.md`
- `chat-start/BACKEND_API.md`
- `docs/BACKLOG.md`
- `docs/API_CONTRACTS_MVP.md`
- `docs/DATA_MODEL.md`
- `tasks/TASK-041-HANDOFF.md`
- `tasks/TASK-042-HANDOFF.md`
- `api/company-services-list/function.json`
- `api/company-services-list/index.js`
- `api/shared/companyAuth.js`
- `api/shared/config.js`
- `api/shared/azure.js`

## Objetivo

Implementar:

```text
POST /api/companies/me/services
```

Debe crear un servicio nuevo asociado exclusivamente a la empresa autenticada por cookie `pe_company_session`.

## Contrato esperado

Request:

```json
{
  "name": "Mesa dulce",
  "category": "Mesas de dulces",
  "eventTypes": ["Bodas", "Cumpleanos"],
  "priceFrom": "CRC 120000",
  "description": "Servicio de mesa dulce para eventos.",
  "coverUrl": "",
  "gallery": []
}
```

Response `201`:

```json
{
  "id": "service_...",
  "companyId": "company_...",
  "slug": "mesa-dulce",
  "name": "Mesa dulce",
  "category": "Mesas de dulces",
  "status": "draft",
  "eventTypes": ["Bodas", "Cumpleanos"],
  "priceFrom": "CRC 120000",
  "description": "Servicio de mesa dulce para eventos.",
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
405 Method not allowed
409 Slug already exists for this company, if applicable
500 Unexpected server error
```

## Reglas de producto

- `companyId` debe salir solo de la sesion. Ignorar cualquier `companyId` enviado por query, body o headers.
- Todo servicio nuevo debe iniciar en `draft`.
- Para MVP, persistir `eventTypes` y `gallery` en formato JSON string o arreglo si el SDK lo permite, pero la respuesta API siempre debe devolver arreglos.
- `name` es requerido.
- `category` es requerido.
- `eventTypes` debe ser arreglo, puede estar vacio si aun no se decide catalogo final.
- `description` puede ser vacio por ahora.
- `priceFrom`, `coverUrl` y `gallery` pueden venir vacios.
- Generar `slug` desde `name`.
- Evitar exponer metadata interna de Azure Table Storage.
- No implementar upload de imagenes en esta tarea.
- No modificar UI en esta tarea.

## Criterios de aceptacion

- `POST /api/companies/me/services` sin cookie responde `401`.
- `POST /api/companies/me/services` con cookie valida crea entidad en tabla `Services` con `PartitionKey=companyId` de la sesion.
- No se puede crear servicio para otra empresa inyectando `companyId`.
- Response `201` no expone `partitionKey`, `rowKey`, `etag`, `timestamp`, hashes, tokens, cookies ni campos de ranking.
- El servicio creado aparece luego en `GET /api/companies/me/services`.
- `node --check` pasa en archivos nuevos/modificados.

## Entregable

Crear:

```text
tasks/TASK-043-HANDOFF.md
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
Termine TASK-043. Product/Architect debe leer tasks/TASK-043-HANDOFF.md.
```
