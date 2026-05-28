# TASK-045: QA/Infra Azure smoke de company services GET y POST

## Equipo asignado

QA / Infra Azure.

## Contexto

Ya pasaron QA local/estructural:

- `GET /api/companies/me/services`
- `POST /api/companies/me/services`

Despues del push/deploy, falta validar el flujo real en Azure Static Web Apps con cookie real, Table Storage real y la empresa QA existente.

## Archivos que debes leer

- `AGENTS.md`
- `chat-start/QA.md`
- `chat-start/INFRA_AZURE.md`
- `docs/BACKLOG.md`
- `docs/API_CONTRACTS_MVP.md`
- `docs/DATA_MODEL.md`
- `tasks/TASK-042-HANDOFF.md`
- `tasks/TASK-044-HANDOFF.md`
- `tools/test-company-invite-flow.ps1`
- `api/company-services-list/index.js`
- `api/company-services-create/index.js`

## Objetivo

Validar en Azure real:

```text
GET /api/companies/me/services
POST /api/companies/me/services
```

usando una sesion real de empresa.

## Precondiciones

- El ultimo commit debe estar desplegado en Azure Static Web Apps.
- Variables admin disponibles en la terminal solo para crear invitacion si hace falta:
  - `ADMIN_USERNAME`
  - `ADMIN_PASSWORD`
- Empresa QA existente:

```text
companyId: company_c0f05305-6b1d-4ba0-b4c2-cd987c324bd2
email: qa-company-register-test@example.com
slug: qa-company-register-test
```

## Alcance de pruebas

Validar:

- `GET /api/companies/me/services` sin cookie responde `401`.
- Crear o reutilizar una sesion real de empresa con invite flow.
- `GET /api/companies/me/services` con cookie real responde `200`.
- `POST /api/companies/me/services` con cookie real y payload valido responde `201`.
- El servicio creado:
  - queda con `companyId` de la empresa QA.
  - queda con `status: draft`.
  - devuelve `eventTypes` y `gallery` como arreglos.
  - no expone metadata interna ni campos de ranking.
- Un segundo `POST` con el mismo `name` para la misma empresa responde `409`.
- `GET /api/companies/me/services` con la misma cookie lista el servicio creado.
- Logout invalida la cookie y luego `GET /api/companies/me/services` responde `401`.

## Payload sugerido

Usar un nombre unico por timestamp para evitar choques entre pruebas:

```json
{
  "name": "QA Mesa Dulce 20260528-001",
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
- No crear datos reales de clientes.

## Entregable

Crear:

```text
tasks/TASK-045-HANDOFF.md
```

Debe incluir:

- Resultado general: aprobado / aprobado con observaciones / bloqueado.
- URL base probada.
- Commit desplegado si se puede identificar.
- Comandos o requests ejecutados.
- Status codes obtenidos.
- `serviceId` creado.
- Confirmacion de que no hubo fuga de metadata/ranking.
- Riesgos restantes.
- Recomendacion:
  - seguir con `PATCH`, o
  - corregir antes.

## Nota para coordinacion

Al terminar, avisar en el chat de Product/Architect:

```text
Termine TASK-045. Product/Architect debe leer tasks/TASK-045-HANDOFF.md.
```
