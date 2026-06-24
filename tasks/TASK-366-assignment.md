# TASK-366: Web Dev ojo password y cambio de password en panel empresa

## Equipo encargado

Ejecucion Tecnica

Modo de ejecucion: Web Dev

## Mensaje para iniciar el chat

```text
Lee este archivo de asignacion: tasks/TASK-366-assignment.md.
Implementa controles web para password en panel empresa y al terminar crea `tasks/TASK-366-HANDOFF.md`.
```

## Archivos que debe leer antes de trabajar

Obligatorios:

- `AGENTS.md`
- `codex-project-templates/EJECUCION_TECNICA.md`
- `codex-project-templates/WEB_DEV.md`
- `codex-project-templates/CHAT_MODEL.md`
- `docs/MVP_RELEASE_STATUS.md`
- `docs/API_CONTRACTS_MVP.md`
- `tasks/TASK-365-HANDOFF.md`

## Objetivo

Agregar ver/ocultar password y formulario de cambio de password autenticado en el panel empresa.

## Contexto

Debe apoyarse en el endpoint backend de `TASK-365` y seguir la guia de Punto Club sin guardar passwords en storage, logs, consola ni analytics.

## Alcance

- Agregar ojo Ver/Ocultar en login y activacion si aplica.
- Agregar seccion `Cambiar contrasena` en panel empresa autenticado.
- Validar localmente password actual, nuevo password y confirmacion.
- Mostrar mensajes claros para errores conocidos.
- Limpiar campos y devolver inputs a `type=password` despues de exito.
- Subir cache busting de assets tocados.

## Fuera de alcance

- No implementar backend.
- No implementar reset por correo.
- No tocar admin.
- No cambiar pagina publica principal salvo ruta/entrada estrictamente necesaria.

## Criterios de aceptacion

- El usuario puede alternar ver/ocultar password.
- El formulario no guarda passwords en storage.
- Mensajes de error son claros y no exponen detalles sensibles.
- El formulario llama al endpoint definido por `TASK-365`.
- Responsive desktop/mobile sin overflow.

## Verificacion requerida

- `node --check panel.js`.
- Revision de `localStorage`, `sessionStorage`, `console.log` y URLs para evitar passwords/tokens.
- Prueba manual local/estructural.

## Handoff requerido

Crear:

```text
tasks/TASK-366-HANDOFF.md
```

Debe incluir formato extra de Ejecucion Tecnica.

