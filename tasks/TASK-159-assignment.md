# TASK-159: Web Dev - UI de activacion/login recurrente en panel

## Equipo asignado

Web Dev.

## Contexto

Depende de `TASK-158` o de su contrato final.

Prioridad P1: empresas deben poder volver a entrar al panel con email/password despues de la activacion inicial por invite.

Leer:

- `AGENTS.md`
- `docs/MVP_RELEASE_STATUS.md`
- `docs/PRELAUNCH_PRIORITIES.md`
- `docs/API_CONTRACTS_MVP.md`
- `docs/ROUTE_MAP_MVP.md`
- `tasks/TASK-158-HANDOFF.md` cuando exista.

## Tarea

Actualizar el panel empresa para soportar activacion inicial y login recurrente con email/password.

## Alcance

- `panel.html`, `panel.js`, `panel.css` si aplica.
- Estados claros: activar acceso, iniciar sesion, cerrar sesion, error generico, sesion expirada.
- No revelar si un email existe en mensajes publicos.
- Mantener acceso por invite durante activacion.

## No tocar

- Backend.
- Admin interno.
- Pagina publica excepto links estrictamente necesarios hacia panel.
- Redisenio completo.

## Verificacion

- Probar login recurrente con credenciales validas/invalidas.
- Probar logout.
- Probar refresh del panel con sesion vigente.
- Probar mobile basico.

## Handoff esperado

Crear `tasks/TASK-159-HANDOFF.md` con:

- Flujo UI implementado.
- Archivos cambiados.
- Verificacion.
- Riesgos.
- Recomendacion para QA.
