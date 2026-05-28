# TASK-046: Reintento smoke Azure autenticado de company services

## Equipo asignado

QA / Infra Azure.

## Contexto

`TASK-045` quedo bloqueada por falta de variables admin en la terminal:

```text
ADMIN_USERNAME
ADMIN_PASSWORD
```

La validacion parcial confirmo que las rutas existen en Azure y estan protegidas:

```text
GET /api/companies/me/services sin cookie -> 401
POST /api/companies/me/services sin cookie -> 401
```

Falta validar con sesion real de empresa.

## Archivos que debes leer

- `AGENTS.md`
- `chat-start/QA.md`
- `chat-start/INFRA_AZURE.md`
- `docs/BACKLOG.md`
- `docs/API_CONTRACTS_MVP.md`
- `tasks/TASK-045-HANDOFF.md`
- `tools/test-company-invite-flow.ps1`
- `api/company-services-list/index.js`
- `api/company-services-create/index.js`

## Objetivo

Completar el smoke real en Azure:

```text
GET /api/companies/me/services
POST /api/companies/me/services
```

usando cookie real de empresa obtenida por invite flow.

## Precondicion obligatoria

Antes de ejecutar, cargar en la misma terminal PowerShell:

```powershell
$env:ADMIN_USERNAME = "<valor seguro>"
$env:ADMIN_PASSWORD = "<valor seguro>"
```

No escribir estos valores en ningun `.md`, log, captura ni handoff.

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

- Las variables admin estan cargadas, reportando solo booleanos:
  - `ADMIN_USERNAME_SET=True`
  - `ADMIN_PASSWORD_SET=True`
- Crear invitacion real con `tools/test-company-invite-flow.ps1` o requests equivalentes.
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

## Payload sugerido

Usar nombre unico por timestamp:

```json
{
  "name": "QA Mesa Dulce 20260528-<timestamp>",
  "category": "Mesas de dulces",
  "eventTypes": ["Bodas", "Cumpleanos"],
  "priceFrom": "CRC 120000",
  "description": "Servicio creado por QA smoke Azure.",
  "coverUrl": "",
  "gallery": []
}
```

## Fuera de alcance

- No modificar UI.
- No probar upload de imagenes.
- No probar PATCH/DELETE.
- No guardar secretos en archivos.

## Entregable

Crear:

```text
tasks/TASK-046-HANDOFF.md
```

Debe incluir:

- Resultado general: aprobado / aprobado con observaciones / bloqueado.
- URL base probada.
- Commit local esperado.
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
Termine TASK-046. Product/Architect debe leer tasks/TASK-046-HANDOFF.md.
```
