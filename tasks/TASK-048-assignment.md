# TASK-048: Smoke Azure autenticado usando local-secrets

## Equipo asignado

QA / Infra Azure.

## Contexto

`TASK-045`, `TASK-046` y `TASK-047` quedaron bloqueadas porque el proceso donde QA ejecuta los comandos no ve:

```text
ADMIN_USERNAME
ADMIN_PASSWORD
```

Para evitar seguir perdiendo tiempo con variables cargadas en otra terminal, este reintento debe usar un archivo local git-ignored.

## Precondicion obligatoria

El usuario o el chat que ejecute QA debe crear este archivo local:

```text
local-secrets/qa-admin.ps1
```

Puede copiarse desde:

```text
local-secrets/qa-admin.example.ps1
```

Contenido esperado, con valores reales:

```powershell
$env:ADMIN_USERNAME = "<valor real>"
$env:ADMIN_PASSWORD = "<valor real>"
```

`local-secrets/` esta en `.gitignore`. No subir ni pegar estos valores en ningun handoff.

## Archivos que debes leer

- `AGENTS.md`
- `chat-start/QA.md`
- `chat-start/INFRA_AZURE.md`
- `docs/BACKLOG.md`
- `docs/API_CONTRACTS_MVP.md`
- `tasks/TASK-047-HANDOFF.md`
- `tools/test-company-invite-flow.ps1`
- `api/company-services-list/index.js`
- `api/company-services-create/index.js`

## Paso 1: cargar credenciales locales

Ejecutar desde la raiz del repo:

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

## Objetivo

Completar el smoke real en Azure:

```text
GET /api/companies/me/services
POST /api/companies/me/services
```

con cookie real de empresa obtenida por invite flow.

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

- Variables admin cargadas con booleanos `True`.
- Crear invitacion real o ejecutar `tools/test-company-invite-flow.ps1` si ya cubre el flujo.
- Aceptar invitacion y conservar cookie real `pe_company_session`.
- `GET /api/companies/me/services` con cookie real responde `200`.
- `POST /api/companies/me/services` con cookie real y payload valido responde `201`.
- El servicio creado:
  - tiene `companyId` de la empresa QA.
  - tiene `status: draft`.
  - devuelve `eventTypes` y `gallery` como arreglos.
  - no expone metadata interna ni campos de ranking.
- Repetir `POST` con el mismo `name` responde `409`.
- `GET /api/companies/me/services` lista el servicio creado.
- Logout invalida la cookie.
- Luego del logout, `GET /api/companies/me/services` responde `401`.

## Entregable

Crear:

```text
tasks/TASK-048-HANDOFF.md
```

Debe incluir:

- Resultado general.
- Confirmacion booleana de variables cargadas.
- URL base probada.
- Status codes obtenidos.
- `serviceId` creado.
- Confirmacion de no fuga de metadata/ranking.
- Confirmacion de duplicate `409`.
- Confirmacion de logout y posterior `401`.
- Riesgos restantes.
- Recomendacion:
  - seguir con `PATCH`, o
  - corregir antes.

## Nota para coordinacion

Al terminar, avisar en el chat de Product/Architect:

```text
Termine TASK-048. Product/Architect debe leer tasks/TASK-048-HANDOFF.md.
```
