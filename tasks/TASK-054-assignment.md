# TASK-054: QA/Infra Azure smoke de DELETE company services

## Equipo asignado

QA / Infra Azure.

## Contexto

Ya pasaron QA local/estructural:

- `GET /api/companies/me/services`
- `POST /api/companies/me/services`
- `PATCH /api/companies/me/services/{serviceId}`
- `DELETE /api/companies/me/services/{serviceId}`

Ya pasaron en Azure real:

- `GET /api/companies/me/services`
- `POST /api/companies/me/services`
- `PATCH /api/companies/me/services/{serviceId}`

Despues del commit/push/deploy del DELETE, falta validar borrado logico real con cookie real y Table Storage real.

## Precondicion

Product/Architect/User debe haber commiteado y pusheado el bloque `DELETE` antes de ejecutar este smoke.

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
- `tasks/TASK-051-HANDOFF.md`
- `tasks/TASK-053-HANDOFF.md`
- `api/company-services-list/index.js`
- `api/company-services-create/index.js`
- `api/company-services-delete/index.js`

## Objetivo

Validar en Azure real:

```text
DELETE /api/companies/me/services/{serviceId}
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
- Crear un servicio QA con `POST /api/companies/me/services`.
- Desactivar ese servicio con `DELETE /api/companies/me/services/{serviceId}`.
- El `DELETE` responde `200`.
- La respuesta del `DELETE`:
  - mantiene `companyId` de la empresa QA.
  - devuelve `status: inactive`.
  - actualiza `updatedAt`.
  - no expone metadata interna ni campos de ranking.
- `GET /api/companies/me/services` refleja el servicio con `status: inactive`.
- `DELETE` sobre servicio inexistente responde `404`.
- Logout invalida la cookie.
- Luego del logout, `DELETE` responde `401`.

## Fuera de alcance

- No modificar UI.
- No probar upload de imagenes.
- No probar restauracion/reactivacion.
- No guardar secretos en archivos.

## Entregable

Crear:

```text
tasks/TASK-054-HANDOFF.md
```

Debe incluir:

- Resultado general: aprobado / aprobado con observaciones / bloqueado.
- URL base probada.
- Status codes obtenidos.
- `serviceId` creado y desactivado.
- Confirmacion de no fuga de metadata/ranking.
- Confirmacion de `GET` mostrando `status: inactive`.
- Confirmacion de logout y posterior `401`.
- Riesgos restantes.
- Recomendacion:
  - seguir con upload firmado de imagenes, o
  - corregir antes.

## Nota para coordinacion

Al terminar, avisar en el chat de Product/Architect:

```text
Termine TASK-054. Product/Architect debe leer tasks/TASK-054-HANDOFF.md.
```
