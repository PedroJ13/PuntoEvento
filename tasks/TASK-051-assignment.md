# TASK-051: QA/Infra Azure smoke de PATCH company services

## Equipo asignado

QA / Infra Azure.

## Contexto

Ya pasaron QA local/estructural:

- `GET /api/companies/me/services`
- `POST /api/companies/me/services`
- `PATCH /api/companies/me/services/{serviceId}`

Tambien ya pasaron en Azure real:

- `GET /api/companies/me/services`
- `POST /api/companies/me/services`

Despues del push/deploy del PATCH, falta validar update real con cookie real y Table Storage real.

## Archivos que debes leer

- `AGENTS.md`
- `chat-start/QA.md`
- `chat-start/INFRA_AZURE.md`
- `docs/BACKLOG.md`
- `docs/API_CONTRACTS_MVP.md`
- `tasks/TASK-048-HANDOFF.md`
- `tasks/TASK-050-HANDOFF.md`
- `tools/test-company-invite-flow.ps1`
- `api/company-services-list/index.js`
- `api/company-services-create/index.js`
- `api/company-services-update/index.js`

## Precondicion

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

## Objetivo

Validar en Azure real:

```text
PATCH /api/companies/me/services/{serviceId}
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
- Actualizar ese servicio con `PATCH /api/companies/me/services/{serviceId}`.
- El `PATCH` responde `200`.
- El servicio actualizado:
  - mantiene `companyId` de la empresa QA.
  - conserva `createdAt`.
  - actualiza `updatedAt`.
  - cambia `name` y regenera `slug`.
  - devuelve `eventTypes` y `gallery` como arreglos.
  - no expone metadata interna ni campos de ranking.
- `GET /api/companies/me/services` refleja los cambios.
- Inyectar `companyId`, `status`, `sortBoost`, `isFeatured` o `featuredUntil` no modifica esos campos.
- Crear un segundo servicio y validar que intentar cambiar el primero a un `name` con slug duplicado responde `409`.
- Logout invalida la cookie.
- Luego del logout, `PATCH` responde `401`.

## Fuera de alcance

- No modificar UI.
- No probar upload de imagenes.
- No probar DELETE/borrado logico.
- No guardar secretos en archivos.

## Entregable

Crear:

```text
tasks/TASK-051-HANDOFF.md
```

Debe incluir:

- Resultado general: aprobado / aprobado con observaciones / bloqueado.
- URL base probada.
- Status codes obtenidos.
- `serviceId` creado y actualizado.
- Confirmacion de no fuga de metadata/ranking.
- Confirmacion de duplicate `409`.
- Confirmacion de logout y posterior `401`.
- Riesgos restantes.
- Recomendacion:
  - seguir con DELETE/borrado logico, o
  - corregir antes.

## Nota para coordinacion

Al terminar, avisar en el chat de Product/Architect:

```text
Termine TASK-051. Product/Architect debe leer tasks/TASK-051-HANDOFF.md.
```
