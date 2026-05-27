# TASK-020: Backend propuesta de autenticacion empresa

## Equipo encargado

Backend API.

## Mensaje para iniciar el chat

```text
Lee este archivo de asignacion: tasks/TASK-020-assignment.md.
Sigue las instrucciones y al terminar actualiza `tasks/TASK-020-HANDOFF.md`.
```

## Archivos que debe leer antes de trabajar

Obligatorios:

- `AGENTS.md`
- `chat-start/BACKEND_API.md`
- `docs/README.md`
- `docs/API_CONTRACTS_MVP.md`
- `docs/DATA_MODEL.md`
- `docs/DECISION_LOG.md`
- `docs/BACKLOG.md`
- `tasks/TASK-015-HANDOFF.md`
- `tasks/TASK-018-HANDOFF.md`
- `tasks/TASK-019-HANDOFF.md`

Codigo relevante:

- `api/companies-register/index.js`
- `api/shared/config.js`
- `api/shared/validation.js`
- `panel.html`
- `panel.js`

## Objetivo

Proponer la estrategia MVP de autenticacion para empresas proveedoras antes de implementar:

```text
GET /api/companies/me
PATCH /api/companies/me
GET /api/companies/me/services
POST /api/companies/me/services
PATCH /api/companies/me/services/{serviceId}
```

## Contexto

El registro de empresa ya funciona en Azure y crea una entidad `Company` en estado `pending`, plan `free`.

Ahora falta que cada empresa pueda entrar a su panel y gestionar perfil, servicios y fotos sin poder ver ni editar datos de otra empresa.

## Trabajo requerido

Analizar opciones y recomendar una para el MVP:

1. Azure Static Web Apps Auth / Easy Auth.
2. Magic link por email.
3. Email + password propio.
4. Token temporal/invitacion para MVP cerrado.
5. Otra opcion si el repo/infra actual lo sugiere claramente.

Para cada opcion incluir:

- Complejidad.
- Costo.
- Seguridad.
- Encaje con Azure Static Web Apps + Functions.
- Impacto en UX para empresas.
- Riesgo de implementacion.

## Recomendacion esperada

El handoff debe recomendar una opcion primaria y una alternativa.

La recomendacion debe responder:

- Como se identifica `companyId` en cada request privado.
- Donde se guardan usuarios/sesiones/tokens.
- Como se evita que Empresa A edite servicios de Empresa B.
- Que cambios de config Azure requeriria.
- Que endpoints deben implementarse primero.
- Que pruebas QA quedan obligatorias.

## Fuera de alcance

- No implementar codigo todavia.
- No crear tablas nuevas todavia.
- No cambiar configuracion Azure.
- No tocar pagina publica.

## Criterios de aceptacion

- Hay una recomendacion clara, accionable y compatible con el MVP.
- Quedan documentadas las tablas o settings necesarios.
- Queda claro si `/api/companies/register` debe cambiar ahora o puede quedarse igual.
- Queda claro el primer endpoint privado a implementar.

## Handoff requerido

Crear:

```text
tasks/TASK-020-HANDOFF.md
```

Debe incluir:

- Resultado general.
- Opciones evaluadas.
- Recomendacion principal.
- Alternativa aceptable.
- Cambios requeridos en API.
- Cambios requeridos en Azure.
- Riesgos.
- Proxima tarea recomendada.

## Al finalizar

Responder:

```text
Termine TASK-020. Product/Architect debe leer `tasks/TASK-020-HANDOFF.md`.
```
