# TASK-041: Backend GET company services

## Equipo encargado

Backend API.

## Mensaje para iniciar el chat

```text
Lee este archivo de asignacion: tasks/TASK-041-assignment.md.
Sigue las instrucciones y al terminar actualiza `tasks/TASK-041-HANDOFF.md`.
```

## Objetivo

Implementar el primer endpoint privado de servicios de empresa:

```text
GET /api/companies/me/services
```

Debe listar servicios asociados a la empresa autenticada por cookie `pe_company_session`.

## Archivos que debe leer antes de trabajar

Obligatorios:

- `AGENTS.md`
- `chat-start/BACKEND_API.md`
- `docs/README.md`
- `docs/BACKLOG.md`
- `docs/API_CONTRACTS_MVP.md`
- `docs/DATA_MODEL.md`
- `tasks/TASK-036-HANDOFF.md`
- `tasks/TASK-037-HANDOFF.md`
- `tasks/TASK-038-HANDOFF.md`

Codigo relevante:

- `api/shared/companyAuth.js`
- `api/shared/azure.js`
- `api/shared/config.js`
- `api/companies-me/index.js`

## Contrato

Request:

```text
GET /api/companies/me/services
Cookie: pe_company_session=<session>
```

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
    "priceFrom": "CRC 120000",
    "description": "...",
    "coverUrl": "",
    "gallery": [],
    "createdAt": "...",
    "updatedAt": "..."
  }
]
```

Errores:

```text
401 Unauthorized
405 Method not allowed
500 Unexpected server error
```

## Persistencia

Usar tabla:

```text
Services
```

Config con default:

```text
AZURE_TABLE_SERVICES=Services
```

PartitionKey:

```text
companyId
```

RowKey:

```text
serviceId
```

## Reglas

- Derivar `companyId` solo desde `getCurrentCompanySession(req, config)`.
- No aceptar `companyId` de query/body/header como autoridad.
- Si no hay sesion valida, responder `401`.
- Listar solo servicios con `PartitionKey = companyId`.
- No devolver metadata interna: `partitionKey`, `rowKey`, `etag`, `timestamp`.
- No devolver campos de ranking/monetizacion si no deben ser editables por empresa, salvo que Product/Architect confirme.
- Ordenar por `createdAt` descendente o `updatedAt` descendente si existe.

## Function sugerida

Crear:

```text
api/company-services-list/function.json
api/company-services-list/index.js
```

Route:

```text
companies/me/services
```

Metodo:

```text
GET
```

## Fuera de alcance

- No implementar POST/crear servicio.
- No implementar PATCH/DELETE.
- No implementar uploads.
- No cambiar UI.

## Verificacion esperada

- `node --check` de archivos nuevos/modificados.
- Prueba con mocks:
  - sin cookie -> `401`
  - con sesion -> lista solo servicios de esa empresa
  - no expone metadata interna

## Handoff requerido

Crear:

```text
tasks/TASK-041-HANDOFF.md
```

Debe incluir:

- Resultado general.
- Archivos modificados.
- Contrato implementado.
- Como probar local/estructuralmente.
- Riesgos.
- Siguiente tarea recomendada.

## Al finalizar

Responder:

```text
Termine TASK-041. Product/Architect debe leer `tasks/TASK-041-HANDOFF.md`.
```
