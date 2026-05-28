# TASK-042: QA local/estructural de GET company services

## Equipo asignado

QA.

## Contexto

Backend completo `TASK-041` con el primer endpoint privado de servicios de empresa:

```text
GET /api/companies/me/services
```

Este endpoint debe listar solo los servicios de la empresa autenticada por cookie `pe_company_session`. La autoridad de `companyId` debe venir de la sesion, no de query/body/header.

## Archivos que debes leer

- `AGENTS.md`
- `chat-start/QA.md`
- `docs/BACKLOG.md`
- `docs/API_CONTRACTS_MVP.md`
- `docs/DATA_MODEL.md`
- `tasks/TASK-041-HANDOFF.md`
- `api/company-services-list/function.json`
- `api/company-services-list/index.js`
- `api/shared/companyAuth.js`
- `api/shared/config.js`
- `api/shared/azure.js`

## Objetivo

Validar local/estructuralmente que `GET /api/companies/me/services` cumple el contrato esperado antes de commit/push/deploy.

## Alcance de pruebas

Validar:

- `node --check` de archivos JS modificados o nuevos.
- `api/company-services-list/function.json` es JSON valido.
- La ruta es `companies/me/services`.
- El metodo permitido es `GET`.
- Sin cookie/sesion valida responde `401`.
- Con sesion valida consulta `Services` filtrando por `PartitionKey` igual al `companyId` de la sesion.
- El endpoint no acepta ni usa `companyId` desde query, body ni headers.
- La respuesta no expone metadata interna:
  - `partitionKey`
  - `rowKey`
  - `etag`
  - `timestamp`
  - hashes
  - tokens
  - cookies
- La respuesta no expone campos de ranking o monetizacion:
  - `sortBoost`
  - `isFeatured`
  - `featuredUntil`
- `eventTypes` y `gallery` se normalizan como arreglos.
- El orden es descendente por `updatedAt`; si falta, por `createdAt`.

## Fuera de alcance

- No hacer cambios de producto.
- No modificar UI.
- No hacer deploy.
- No probar Azure todavia, salvo que Product/Architect lo pida despues.
- No validar `POST/PATCH/DELETE`; todavia no existen.

## Entregable

Crear:

```text
tasks/TASK-042-HANDOFF.md
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
Termine TASK-042. Product/Architect debe leer tasks/TASK-042-HANDOFF.md.
```
