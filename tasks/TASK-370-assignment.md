# TASK-370: QA local completo de password-flows

## Equipo encargado

QA

## Mensaje para iniciar el chat

```text
Lee este archivo de asignacion: tasks/TASK-370-assignment.md.
Valida localmente el paquete de password-flows y al terminar crea `tasks/TASK-370-HANDOFF.md`.
```

## Archivos que debe leer antes de trabajar

Obligatorios:

- `AGENTS.md`
- `codex-project-templates/QA.md`
- `codex-project-templates/CHAT_MODEL.md`
- `docs/MVP_RELEASE_STATUS.md`
- `docs/QA_TEST_PLAN.md`
- `tasks/TASK-365-HANDOFF.md`
- `tasks/TASK-366-HANDOFF.md`
- `tasks/TASK-367-HANDOFF.md`
- `tasks/TASK-368-HANDOFF.md`
- `tasks/TASK-369-HANDOFF.md`

## Objetivo

Validar localmente que el cambio de password, recuperar acceso, completar reset y admin reset cumplen funcionalidad y seguridad antes de publicar.

## Contexto

Este paquete toca autenticacion, sesiones, email y admin; requiere QA enfocada antes de Infra Azure.

## Alcance

- Login con ojo password.
- Cambio autenticado de password en panel.
- Solicitud publica de reset con respuesta generica.
- Validacion de token invalido/expirado/usado.
- Completar reset con token valido sintetico/controlado.
- Accion admin reset sin exponer link/token.
- Busqueda de secretos en UI/logs/respuestas/handoff.

## Fuera de alcance

- No desplegar Azure.
- No usar cuentas reales sin autorizacion.
- No modificar codigo salvo que se cree tarea explicita.

## Criterios de aceptacion

- Sin P0/P1 abiertos.
- Passwords/tokens/hashes/cookies no se exponen.
- Sesiones se comportan segun politica definida.
- Mensajes no revelan existencia de correo.
- Responsive basico aprobado.

## Verificacion requerida

- Tests backend/frontend disponibles.
- `node --check` en JS tocado.
- Busqueda de patrones peligrosos.
- Validacion manual local o estructural documentada.

## Handoff requerido

Crear:

```text
tasks/TASK-370-HANDOFF.md
```

Debe incluir formato QA completo.

