# TASK-044: QA local/estructural de POST company services

## Equipo asignado

QA.

## Contexto

Backend completo `TASK-043` con:

```text
POST /api/companies/me/services
```

Este endpoint permite que una empresa autenticada cree servicios propios en estado `draft`.

## Archivos que debes leer

- `AGENTS.md`
- `chat-start/QA.md`
- `docs/BACKLOG.md`
- `docs/API_CONTRACTS_MVP.md`
- `docs/DATA_MODEL.md`
- `tasks/TASK-043-HANDOFF.md`
- `api/company-services-create/function.json`
- `api/company-services-create/index.js`
- `api/company-services-list/function.json`
- `api/company-services-list/index.js`
- `api/shared/companyAuth.js`
- `api/shared/config.js`
- `api/shared/azure.js`

## Objetivo

Validar local/estructuralmente que `POST /api/companies/me/services` cumple el contrato antes de commit/push/deploy.

## Alcance de pruebas

Validar:

- `node --check` de archivos JS nuevos o modificados.
- `api/company-services-create/function.json` es JSON valido.
- La ruta es `companies/me/services`.
- El metodo permitido es `POST`.
- Sin cookie/sesion valida responde `401`.
- Metodo distinto de `POST` responde `405`.
- Body sin `name` responde `400`.
- Body sin `category` responde `400`.
- `eventTypes` no arreglo responde `400`.
- `gallery` no arreglo responde `400`.
- Con sesion valida y body valido crea entidad en `Services` con `PartitionKey` igual al `companyId` de la sesion.
- Ignora cualquier `companyId` enviado por query, body o headers.
- Servicio nuevo inicia con `status: draft`.
- Genera `slug` desde `name`.
- Slug duplicado dentro de la misma empresa responde `409`.
- Response `201` no expone metadata interna:
  - `partitionKey`
  - `rowKey`
  - `etag`
  - `timestamp`
  - hashes
  - tokens
  - cookies
- Response `201` no expone campos de ranking o monetizacion:
  - `sortBoost`
  - `isFeatured`
  - `featuredUntil`
- `eventTypes` y `gallery` se devuelven como arreglos.
- El servicio creado aparece luego en `GET /api/companies/me/services` usando la misma sesion.

## Fuera de alcance

- No hacer deploy.
- No probar Azure real todavia.
- No modificar UI.
- No implementar upload de imagenes.
- No validar catalogos definitivos de `category` o `eventTypes`; eso sigue pendiente de producto.

## Entregable

Crear:

```text
tasks/TASK-044-HANDOFF.md
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
Termine TASK-044. Product/Architect debe leer tasks/TASK-044-HANDOFF.md.
```
