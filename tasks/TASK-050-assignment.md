# TASK-050: QA local/estructural de PATCH company services

## Equipo asignado

QA.

## Contexto

Backend completo `TASK-049` con:

```text
PATCH /api/companies/me/services/{serviceId}
```

Este endpoint permite que una empresa autenticada edite servicios propios. Todavia no debe commitearse/pushearse hasta pasar QA local/estructural.

## Archivos que debes leer

- `AGENTS.md`
- `chat-start/QA.md`
- `docs/BACKLOG.md`
- `docs/API_CONTRACTS_MVP.md`
- `docs/DATA_MODEL.md`
- `tasks/TASK-049-HANDOFF.md`
- `api/company-services-update/function.json`
- `api/company-services-update/index.js`
- `api/company-services-list/function.json`
- `api/company-services-list/index.js`
- `api/company-services-create/function.json`
- `api/company-services-create/index.js`
- `api/shared/companyAuth.js`
- `api/shared/config.js`
- `api/shared/azure.js`
- `api/shared/validation.js`

## Objetivo

Validar local/estructuralmente que `PATCH /api/companies/me/services/{serviceId}` cumple el contrato antes de commit/push/deploy.

## Alcance de pruebas

Validar:

- `node --check` de archivos JS nuevos o modificados.
- `api/company-services-update/function.json` es JSON valido.
- La ruta es `companies/me/services/{serviceId}`.
- El metodo permitido es `PATCH`.
- Sin cookie/sesion valida responde `401`.
- Metodo distinto de `PATCH` responde `405`.
- Sin `serviceId` responde `400`.
- Body sin campos editables responde `400`.
- `name` presente pero vacio responde `400`.
- `category` presente pero vacio responde `400`.
- `eventTypes` presente pero no arreglo responde `400`.
- `gallery` presente pero no arreglo responde `400`.
- Servicio inexistente responde `404`.
- Servicio de otra empresa responde `404`.
- Con sesion valida actualiza solo servicio propio.
- Inyectar `companyId`, `status`, `plan`, `sortBoost`, `isFeatured` o `featuredUntil` no modifica esos campos.
- Cambio de `name` regenera `slug`.
- Slug duplicado en otro servicio de la misma empresa responde `409`.
- Slug igual en la misma entidad actualizada no bloquea.
- `updatedAt` cambia.
- `createdAt` se conserva.
- `eventTypes` y `gallery` se devuelven como arreglos.
- Response `200` no expone metadata interna:
  - `partitionKey`
  - `rowKey`
  - `etag`
  - `timestamp`
  - hashes
  - tokens
  - cookies
- Response `200` no expone campos de ranking o monetizacion:
  - `sortBoost`
  - `isFeatured`
  - `featuredUntil`
- `GET /api/companies/me/services` refleja los cambios.

## Fuera de alcance

- No hacer deploy.
- No probar Azure real todavia.
- No modificar UI.
- No implementar upload de imagenes.
- No implementar DELETE/borrado logico.
- No validar catalogos definitivos de `category` o `eventTypes`.

## Entregable

Crear:

```text
tasks/TASK-050-HANDOFF.md
```

Debe incluir:

- Resultado general: aprobado / aprobado con observaciones / bloqueado.
- Comandos ejecutados.
- Casos probados.
- Hallazgos con archivo y linea si aplica.
- Riesgos restantes.
- Recomendacion clara:
  - listo para commit/push, o
  - requiere ajuste antes de commit.

## Nota para coordinacion

Al terminar, avisar en el chat de Product/Architect:

```text
Termine TASK-050. Product/Architect debe leer tasks/TASK-050-HANDOFF.md.
```
