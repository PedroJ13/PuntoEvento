# TASK-052: Backend DELETE company services logical delete

## Equipo asignado

Backend API.

## Contexto

Ya estan aprobados en Azure real:

- `GET /api/companies/me/services`
- `POST /api/companies/me/services`
- `PATCH /api/companies/me/services/{serviceId}`

`TASK-051` confirmo el flujo autenticado real de update con cookie de empresa:

- crear servicio `201`
- actualizar servicio `200`
- `GET` refleja cambios `200`
- slug duplicado `409`
- logout `200`
- `PATCH` despues de logout `401`

El siguiente paso es permitir que una empresa desactive un servicio propio sin borrarlo fisicamente.

## Archivos que debes leer

- `AGENTS.md`
- `chat-start/BACKEND_API.md`
- `docs/BACKLOG.md`
- `docs/API_CONTRACTS_MVP.md`
- `docs/DATA_MODEL.md`
- `tasks/TASK-049-HANDOFF.md`
- `tasks/TASK-050-HANDOFF.md`
- `tasks/TASK-051-HANDOFF.md`
- `api/company-services-list/index.js`
- `api/company-services-create/index.js`
- `api/company-services-update/index.js`
- `api/shared/companyAuth.js`
- `api/shared/config.js`
- `api/shared/azure.js`

## Objetivo

Implementar:

```text
DELETE /api/companies/me/services/{serviceId}
```

Debe hacer borrado logico de un servicio existente perteneciente exclusivamente a la empresa autenticada por cookie `pe_company_session`.

## Contrato esperado

Response `200`:

```json
{
  "id": "service_...",
  "companyId": "company_...",
  "status": "inactive",
  "updatedAt": "..."
}
```

Errores esperados:

```text
400 Validation error
401 Unauthorized
404 Service not found
405 Method not allowed
500 Unexpected server error
```

## Reglas de producto

- `companyId` debe salir solo de la sesion. Ignorar cualquier `companyId` enviado por query, body o headers.
- El servicio solo puede desactivarse si `PartitionKey` coincide con el `companyId` de la sesion.
- Servicio inexistente o de otra empresa debe responder `404`.
- No borrar fisicamente la entidad en Table Storage.
- Setear `status: inactive`.
- Actualizar `updatedAt`.
- No modificar `createdAt`.
- No exponer metadata interna de Azure Table Storage.
- No exponer campos de ranking/monetizacion.
- No modificar UI en esta tarea.

## Criterios de aceptacion

- `DELETE /api/companies/me/services/{serviceId}` sin cookie responde `401`.
- Metodo distinto de `DELETE` responde `405`.
- Sin `serviceId` responde `400`.
- `DELETE` sobre servicio inexistente responde `404`.
- `DELETE` sobre servicio de otra empresa responde `404`.
- `DELETE` con cookie valida desactiva solo servicio propio.
- Response `200` devuelve `status: inactive`.
- `updatedAt` cambia.
- `createdAt` se conserva en persistencia.
- Response `200` no expone `partitionKey`, `rowKey`, `etag`, `timestamp`, hashes, tokens, cookies ni campos de ranking.
- `GET /api/companies/me/services` refleja el servicio con `status: inactive` o lo excluye solo si Product/Architect decide ese comportamiento. Si hay duda, mantenerlo visible para panel empresa.
- `node --check` pasa en archivos nuevos/modificados.

## Entregable

Crear:

```text
tasks/TASK-052-HANDOFF.md
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
Termine TASK-052. Product/Architect debe leer tasks/TASK-052-HANDOFF.md.
```
