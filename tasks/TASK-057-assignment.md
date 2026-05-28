# TASK-057: QA local/estructural de POST uploads sign

## Equipo asignado

QA.

## Contexto

Backend completo `TASK-056` con:

```text
POST /api/uploads/sign
```

Este endpoint genera una URL SAS temporal para subir imagenes de empresa/servicio a `uploads-pending` y crea una reserva en tabla `Uploads`.

## Archivos que debes leer

- `AGENTS.md`
- `chat-start/QA.md`
- `docs/BACKLOG.md`
- `docs/API_CONTRACTS_MVP.md`
- `docs/DATA_MODEL.md`
- `tasks/TASK-056-HANDOFF.md`
- `api/uploads-sign/function.json`
- `api/uploads-sign/index.js`
- `api/create-upload-url/index.js`
- `api/register-upload/index.js`
- `api/company-services-list/index.js`
- `api/shared/azure.js`
- `api/shared/config.js`
- `api/shared/companyAuth.js`
- `api/shared/validation.js`

## Objetivo

Validar local/estructuralmente que `POST /api/uploads/sign` cumple el contrato antes de commit/push/deploy.

## Alcance de pruebas

Validar:

- `node --check` de archivos JS nuevos o modificados.
- `api/uploads-sign/function.json` es JSON valido.
- La ruta es `uploads/sign`.
- El metodo permitido es `POST`.
- Sin cookie/sesion valida responde `401`.
- Metodo distinto de `POST` responde `405`.
- Body invalido responde `400`.
- `scope` invalido responde `400`.
- `scope=service` sin `serviceId` responde `400`.
- `scope=service` con servicio inexistente o de otra empresa responde `404`.
- `imageType` invalido responde `400`.
- MIME no permitido responde `415`.
- Extension no permitida responde `415`.
- Extension que no corresponde al `contentType` responde `415`.
- Archivo mayor a 5 MB responde `413`.
- Size invalido responde `400`.
- Request valido `scope=company` responde `200`.
- Request valido `scope=service` responde `200`.
- Reserva queda persistida en `Uploads` con:
  - `PartitionKey=companyId` de la sesion.
  - `status=reserved`.
  - `scope`, `serviceId`, `imageType`, `fileName`, `contentType`, `size`.
  - `pendingBlobName`, `pendingBlobUrl`, `createdAt`, `updatedAt`, `expiresAt`.
- `companyId` inyectado por query/body/header se ignora.
- `uploadUrl` firma un blob especifico del contenedor pendiente.
- Response no expone connection strings, account keys, hashes, cookies ni metadata interna.

## Fuera de alcance

- No hacer deploy.
- No probar Azure real todavia.
- No subir bytes a Blob Storage.
- No validar MIME/tamano real del blob.
- No registrar upload completado.
- No mover a contenedor publico.
- No modificar UI.

## Entregable

Crear:

```text
tasks/TASK-057-HANDOFF.md
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
Termine TASK-057. Product/Architect debe leer tasks/TASK-057-HANDOFF.md.
```
