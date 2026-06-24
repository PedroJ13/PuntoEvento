# TASK-369: Admin UI accion segura para enviar reset de acceso

## Equipo encargado

Ejecucion Tecnica

Modo de ejecucion: Web Dev

## Mensaje para iniciar el chat

```text
Lee este archivo de asignacion: tasks/TASK-369-assignment.md.
Agrega accion admin para enviar reset de acceso y al terminar crea `tasks/TASK-369-HANDOFF.md`.
```

## Archivos que debe leer antes de trabajar

Obligatorios:

- `AGENTS.md`
- `codex-project-templates/EJECUCION_TECNICA.md`
- `codex-project-templates/WEB_DEV.md`
- `codex-project-templates/CHAT_MODEL.md`
- `docs/MVP_RELEASE_STATUS.md`
- `docs/API_CONTRACTS_MVP.md`
- `tasks/TASK-367-HANDOFF.md`

## Objetivo

Permitir desde admin enviar un correo de recuperacion de acceso a una empresa, sin mostrar token ni link.

## Contexto

La guia recomienda accion admin `Enviar reset de acceso`, con confirmacion y mensajes seguros.

## Alcance

- Agregar accion en expediente/admin de empresa donde corresponda.
- Reutilizar auth admin existente.
- Confirmar antes de enviar.
- Mostrar exito `Correo de recuperacion enviado.` o error seguro.
- Subir cache busting de assets tocados.

## Fuera de alcance

- No implementar backend.
- No mostrar token ni link completo.
- No cambiar moderacion de empresas/servicios.
- No enviar resets reales fuera de cuentas QA/autorizadas.

## Criterios de aceptacion

- La accion existe solo en contexto admin autenticado.
- No se expone token/link.
- Mensajes son seguros y claros.
- Responsive sin overflow.

## Verificacion requerida

- `node --check admin.js`.
- Revision de DOM/strings para confirmar que no aparece token/link completo.
- Prueba local/estructural con endpoint disponible o mock seguro.

## Handoff requerido

Crear:

```text
tasks/TASK-369-HANDOFF.md
```

Debe incluir formato extra de Ejecucion Tecnica.

