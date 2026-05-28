# TASK-057 HANDOFF - QA local POST /api/uploads/sign

## Objetivo

Validar local y estructuralmente el endpoint `POST /api/uploads/sign` implementado en TASK-056 antes de commit, push o deploy.

La revision cubrio contrato, validaciones, aislamiento por sesion de empresa, persistencia de reserva en `Uploads`, generacion de SAS para blob pendiente y ausencia de fugas obvias de secretos/metadatos internos en la respuesta.

## Resultado

APROBADO.

Recomendacion: listo para commit/push.

## Archivos revisados

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

## Archivos tocados

- `tasks/TASK-057-HANDOFF.md`

No se cambio codigo de aplicacion.

## Verificacion ejecutada

### Sintaxis JS

Comandos ejecutados:

```powershell
& 'C:\Users\pj13e\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' --check 'api/uploads-sign/index.js'
& 'C:\Users\pj13e\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' --check 'api/shared/azure.js'
& 'C:\Users\pj13e\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' --check 'api/shared/config.js'
& 'C:\Users\pj13e\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' --check 'api/shared/companyAuth.js'
& 'C:\Users\pj13e\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' --check 'api/shared/validation.js'
```

Resultado: OK, sin errores de sintaxis.

### function.json

Comando ejecutado:

```powershell
Get-Content -Raw 'api/uploads-sign/function.json' | ConvertFrom-Json | Out-Null
```

Resultado: OK.

Validacion estructural:

- Ruta: `uploads/sign`
- Metodo permitido: `post`
- Trigger HTTP anonimo, con validacion de sesion dentro del handler.

### Casos locales con mocks

Se ejecuto una bateria local con mocks para Azure Table Storage, SAS y sesion de empresa. Resultado:

```text
PASS uploads/sign local QA cases: 16/16
```

Casos cubiertos:

- Sin sesion -> 401.
- Metodo incorrecto -> 405.
- Body invalido -> 400.
- Scope invalido -> 400.
- `scope=service` sin `serviceId` -> 400.
- Servicio inexistente -> 404.
- Servicio de otra empresa -> 404.
- `imageType` invalido -> 400.
- MIME no permitido -> 415.
- Extension no permitida -> 415.
- Extension incompatible con `contentType` -> 415.
- Archivo mayor a 5 MB -> 413.
- Size invalido -> 400.
- `scope=company` valido -> 200.
- `scope=service` valido -> 200.
- `companyId` inyectado por body/query/header se ignora y se usa `session.partitionKey`.

Tambien se valido en respuestas exitosas:

- Se crea una reserva en `Uploads`.
- `partitionKey` y `companyId` salen de la sesion.
- `status` queda en `reserved`.
- Se persisten `scope`, `serviceId`, `imageType`, `fileName`, `contentType`, `size`, `pendingBlobName`, `pendingBlobUrl`, `createdAt`, `updatedAt`, `expiresAt`.
- `uploadUrl` apunta al blob especifico reservado en el contenedor pendiente.
- La respuesta no expone `AccountKey`, connection strings, `sessionHash`, `tokenHash`, cookie de sesion, `partitionKey`, `rowKey` ni `pendingBlobName`.

## Hallazgos

No se encontraron bloqueantes.

Observaciones no bloqueantes:

- La validacion fue local con mocks; no confirma permisos reales de Azure Storage ni la forma final del SAS producido por Azure.
- El endpoint firma y reserva, pero no valida bytes reales del blob; eso queda fuera de alcance hasta el endpoint de confirmacion/publicacion.
- `imageType=logo` esta permitido por el set compartido para cualquier scope. No bloquea esta tarea porque coincide con el alcance heredado de TASK-056, pero Product/Architect puede decidir si debe restringirse por scope mas adelante.

## Riesgos

- Sin prueba contra Azure real todavia no se valida que el contenedor `uploads-pending`, la cuenta y las politicas de CORS/permisos funcionen en entorno desplegado.
- No hay limpieza automatica de reservas expiradas para `Uploads` nueva en esta validacion.
- La respuesta incluye un SAS de escritura como parte del contrato; debe tratarse como secreto temporal en cliente/logs.

## Pendientes

- QA de integracion contra Azure real o entorno staging.
- Prueba end-to-end de subida binaria al blob con el SAS generado.
- Endpoint posterior para confirmar upload, validar blob real y publicar/mover imagen.
- Limpieza de reservas expiradas en `Uploads`.
- Decision de producto sobre restricciones de `imageType` por `scope`.

## Recomendacion para Product/Architect

Aceptar TASK-057 como QA local aprobado y avanzar con commit/push de TASK-056 si no hay otros cambios pendientes. Priorizar despues la confirmacion de upload real y la politica de expiracion/limpieza de reservas.
