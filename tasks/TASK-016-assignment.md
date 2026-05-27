# TASK-016: QA de POST /api/companies/register

## Equipo encargado

QA.

## Mensaje para iniciar el chat

```text
Lee este archivo de asignacion: tasks/TASK-016-assignment.md.
Sigue las instrucciones y al terminar actualiza `tasks/TASK-016-HANDOFF.md`.
```

## Archivos que debe leer antes de trabajar

Obligatorios:

- `AGENTS.md`
- `chat-start/QA.md`
- `docs/README.md`
- `docs/BACKLOG.md`
- `docs/API_CONTRACTS_MVP.md`
- `docs/DATA_MODEL.md`
- `docs/DECISION_LOG.md`
- `tasks/TASK-015-HANDOFF.md`

Opcionales utiles:

- `chat-start/BACKEND_API.md`
- `CONFIGURACION_AZURE_REGISTRO_EMAIL.md`

## Objetivo

Validar el endpoint nuevo:

```text
POST /api/companies/register
```

## Contexto

Backend implemento TASK-015.

El endpoint registra una empresa gratis como:

```text
status = pending
plan = free
```

No debe romper:

```text
POST /api/register-provider
```

## Alcance

QA debe validar:

- `function.json`.
- payload valido.
- campos requeridos faltantes.
- email invalido.
- metodo no permitido si es viable.
- formato de respuesta.
- que no se exponen secretos.
- si se puede, prueba real contra Azure despues de deploy.

## Fuera de alcance

- No modificar codigo.
- No probar login empresa.
- No probar CRUD servicios.
- No probar upload fotos.
- No probar email, porque no esta implementado para este endpoint.

## Payload valido

```json
{
  "companyName": "Aurisbel Eventos QA",
  "email": "qa-empresa@example.com",
  "whatsapp": "50688888888",
  "province": "Heredia",
  "canton": "San Francisco",
  "description": "Servicios para eventos."
}
```

## Criterios de aceptacion

- Payload valido devuelve `201`.
- Response incluye:
  - `companyId`,
  - `slug`,
  - `status: pending`,
  - `plan: free`.
- Campos faltantes devuelven `400`.
- Email invalido devuelve `400`.
- Metodo no POST devuelve `405` si se puede probar.
- `/api/register-provider` sigue existiendo.
- No hay secretos en response.

## Verificacion requerida

Local/estructural:

- Revisar `api/companies-register/function.json`.
- Revisar contrato.
- Si QA puede ejecutar funciones localmente, probar endpoint local.

Azure:

- Si el endpoint ya esta desplegado, probar contra la URL publica.
- Si no esta desplegado, marcar pendiente de post-deploy.

Git:

```text
git status --short
```

QA no debe agregar cambios salvo `tasks/TASK-016-HANDOFF.md`.

## Handoff requerido

Crear:

```text
tasks/TASK-016-HANDOFF.md
```

Debe incluir:

- Resultado general.
- Casos probados.
- Bugs encontrados con severidad.
- Evidencia de responses.
- Riesgos.
- Recomendacion para Product/Architect.

## Al finalizar

Responder:

```text
Termine TASK-016. Product/Architect debe leer `tasks/TASK-016-HANDOFF.md`.
```

