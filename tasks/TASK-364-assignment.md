# TASK-364: Definir alcance MVP de password-flows para empresas

## Equipo encargado

Proyecto

## Mensaje para iniciar el chat

```text
Lee este archivo de asignacion: tasks/TASK-364-assignment.md.
Define el alcance MVP de password-flows para Punto Evento y al terminar crea `tasks/TASK-364-HANDOFF.md`.
```

## Archivos que debe leer antes de trabajar

Obligatorios:

- `AGENTS.md`
- `codex-project-templates/PROYECTO.md`
- `codex-project-templates/CHAT_MODEL.md`
- `docs/MVP_RELEASE_STATUS.md`
- `docs/API_CONTRACTS_MVP.md`
- `docs/DATA_MODEL.md`
- `docs/DECISION_LOG.md`
- `C:\Work\PuntoClub-password-flows-implementation-guide.md`

## Objetivo

Convertir la guia reusable de Punto Club en alcance MVP especifico para Punto Evento, sin implementar codigo.

## Contexto

Punto Evento ya tiene invitacion, activacion, login recurrente, password hash con `scrypt` y sesiones server-side. Falta decidir el alcance exacto para:

- ver/ocultar password;
- cambio autenticado de password desde panel empresa;
- recuperar/resetear password por correo;
- reset administrado desde admin;
- QA y publicacion segura.

## Alcance

- Confirmar que partes de la guia aplican a Table Storage/Azure Functions.
- Definir endpoints, rutas UI y politica de sesiones para Punto Evento.
- Registrar decision si cambia contrato o seguridad.
- Ajustar o crear tareas siguientes si el alcance cambia.

## Fuera de alcance

- No implementar backend.
- No implementar frontend.
- No tocar Azure.
- No crear migraciones o tablas.

## Criterios de aceptacion

- Alcance MVP documentado.
- Riesgos de seguridad identificados.
- Orden recomendado de implementacion confirmado.
- Decision log actualizado si corresponde.

## Verificacion requerida

- Revision documental.
- Comparar guia contra estado actual de `api/shared/companyAuth.js` y contratos.

## Handoff requerido

Crear:

```text
tasks/TASK-364-HANDOFF.md
```

