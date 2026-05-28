# TASK-058: QA/Infra Azure smoke de POST uploads sign

## Equipo asignado

QA / Infra Azure.

## Contexto

Ya paso QA local/estructural:

```text
POST /api/uploads/sign
```

Despues del commit/push/deploy, falta validar el endpoint contra Azure real con cookie real y Storage real.

## Precondicion

Product/Architect/User debe haber commiteado y pusheado el bloque `POST /api/uploads/sign` antes de ejecutar este smoke.

Cargar credenciales admin desde archivo local git-ignored:

```powershell
. .\local-secrets\qa-admin.ps1
$u = [bool]$env:ADMIN_USERNAME
$p = [bool]$env:ADMIN_PASSWORD
"ADMIN_USERNAME_SET=$u"
"ADMIN_PASSWORD_SET=$p"
```

Debe dar:

```text
ADMIN_USERNAME_SET=True
ADMIN_PASSWORD_SET=True
```

No escribir valores reales en el handoff.

## Archivos que debes leer

- `AGENTS.md`
- `chat-start/QA.md`
- `chat-start/INFRA_AZURE.md`
- `docs/BACKLOG.md`
- `docs/API_CONTRACTS_MVP.md`
- `tasks/TASK-057-HANDOFF.md`
- `api/uploads-sign/index.js`
- `api/company-services-create/index.js`
- `api/company-services-list/index.js`

## Objetivo

Validar en Azure real:

```text
POST /api/uploads/sign
```

usando una sesion real de empresa.

## URL base

```text
https://zealous-field-08fdd720f.7.azurestaticapps.net
```

## Empresa QA objetivo

```text
companyId: company_c0f05305-6b1d-4ba0-b4c2-cd987c324bd2
email: qa-company-register-test@example.com
slug: qa-company-register-test
```

## Alcance de pruebas

Validar:

- Crear invitacion real y aceptar invitacion para obtener cookie.
- `POST /api/uploads/sign` sin cookie responde `401`.
- `POST /api/uploads/sign` con cookie y `scope=company` valido responde `200`.
- `POST /api/uploads/sign` con cookie y `scope=service` valido responde `200`.
- Para `scope=service`, crear un servicio QA si hace falta y usar su `serviceId`.
- Response exitosa contiene:
  - `uploadId`
  - `uploadUrl`
  - `pendingBlobUrl`
  - `expiresInMinutes`
- `uploadUrl` permite subir un blob pequeno con el `contentType` reservado.
- No se exponen connection strings, account keys, cookies, hashes ni metadata interna.
- `scope=service` con servicio inexistente responde `404`.
- MIME no permitido responde `415`.
- Archivo mayor a 5 MB responde `413`.
- Logout invalida la cookie.
- Luego del logout, `POST /api/uploads/sign` responde `401`.

## Fuera de alcance

- No registrar upload completado.
- No validar endpoint de publicacion o revision.
- No mover a contenedor publico.
- No modificar UI.
- No guardar secretos ni SAS completos en handoff; redactar query string sensible si se muestra evidencia.

## Entregable

Crear:

```text
tasks/TASK-058-HANDOFF.md
```

Debe incluir:

- Resultado general: aprobado / aprobado con observaciones / bloqueado.
- URL base probada.
- Status codes obtenidos.
- `uploadId` creado.
- Confirmacion de upload real pequeno si se ejecuto.
- Confirmacion de no fuga de secretos/metadata.
- Riesgos restantes.
- Recomendacion:
  - seguir con confirmacion/registro de upload completado, o
  - corregir antes.

## Nota para coordinacion

Al terminar, avisar en el chat de Product/Architect:

```text
Termine TASK-058. Product/Architect debe leer tasks/TASK-058-HANDOFF.md.
```
