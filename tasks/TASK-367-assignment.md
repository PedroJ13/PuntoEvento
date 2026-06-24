# TASK-367: Backend/API reset de password por correo

## Equipo encargado

Ejecucion Tecnica

Modo de ejecucion: Backend/API

## Mensaje para iniciar el chat

```text
Lee este archivo de asignacion: tasks/TASK-367-assignment.md.
Implementa reset de password por correo y al terminar crea `tasks/TASK-367-HANDOFF.md`.
```

## Archivos que debe leer antes de trabajar

Obligatorios:

- `AGENTS.md`
- `codex-project-templates/EJECUCION_TECNICA.md`
- `codex-project-templates/BACKEND_API.md`
- `codex-project-templates/CHAT_MODEL.md`
- `docs/MVP_RELEASE_STATUS.md`
- `docs/API_CONTRACTS_MVP.md`
- `docs/DATA_MODEL.md`
- `tasks/TASK-364-HANDOFF.md`
- `tasks/TASK-365-HANDOFF.md`

## Objetivo

Implementar flujo backend seguro para solicitar, validar y completar reset de password de empresa.

## Contexto

La guia propone endpoints:

- `POST /api/company-password-resets`
- `GET /api/company-password-resets/validate?token=...`
- `POST /api/company-password-resets/complete`

Punto Evento usa Azure Functions, Table Storage y ACS Email.

## Alcance

- Crear persistencia de resets en Table Storage o mecanismo equivalente documentado.
- Guardar solo hash de token.
- Enviar link por correo al destinatario autorizado.
- Respuesta publica generica que no revele si el correo existe.
- Validar token sin devolver email/companyId/userId.
- Completar reset y revocar sesiones activas del usuario/empresa.
- Actualizar contrato API.

## Fuera de alcance

- No implementar UI web.
- No implementar accion admin.
- No desplegar Azure.
- No imprimir tokens, links completos, cookies, hashes ni secrets.

## Criterios de aceptacion

- Tokens raw no se guardan en DB ni se exponen en respuestas.
- Reset publico no revela existencia de correo.
- Token invalido/expirado/usado responde de forma segura.
- Completar reset actualiza hash y revoca sesiones.
- Email usa ACS existente y no incluye secretos en logs/handoff.

## Verificacion requerida

- `node --check` en archivos JS tocados.
- Tests o scripts locales no destructivos.
- Busqueda de `token`, `password`, `hash`, `console.log` para evitar exposicion accidental.

## Handoff requerido

Crear:

```text
tasks/TASK-367-HANDOFF.md
```

Debe incluir formato extra de Ejecucion Tecnica.

