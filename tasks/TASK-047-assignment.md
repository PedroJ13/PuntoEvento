# TASK-047: Reintento final smoke Azure autenticado con variables cargadas

## Equipo asignado

QA / Infra Azure.

## Contexto

`TASK-046` quedo bloqueada porque al momento de la verificacion las variables admin no estaban cargadas:

```text
ADMIN_USERNAME_SET=False
ADMIN_PASSWORD_SET=False
```

Luego se corrigio la terminal cargando las variables en lineas separadas. Esta tarea existe para repetir el smoke con evidencia limpia.

## Archivos que debes leer

- `AGENTS.md`
- `chat-start/QA.md`
- `chat-start/INFRA_AZURE.md`
- `docs/BACKLOG.md`
- `docs/API_CONTRACTS_MVP.md`
- `tasks/TASK-045-HANDOFF.md`
- `tasks/TASK-046-HANDOFF.md`
- `tools/test-company-invite-flow.ps1`
- `api/company-services-list/index.js`
- `api/company-services-create/index.js`

## Precondicion obligatoria

En la misma terminal PowerShell donde se ejecutara la prueba, verificar:

```powershell
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

No escribir valores reales de usuario/password en el handoff.

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
tasks/TASK-047-HANDOFF.md
```

Debe incluir:

- Resultado general: aprobado / aprobado con observaciones / bloqueado.
- Confirmacion booleana de variables cargadas.
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
Termine TASK-047. Product/Architect debe leer tasks/TASK-047-HANDOFF.md.
```
