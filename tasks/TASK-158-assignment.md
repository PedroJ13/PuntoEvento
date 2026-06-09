# TASK-158: Backend/API - login empresa email/password

## Equipo asignado

Backend / API.

## Contexto

La prueba Product Owner fue positiva y sin issues. El proyecto pasa a pre-lanzamiento.

Prioridad P1: el invite debe servir para activacion inicial, pero la empresa necesita acceso recurrente al panel con email/password.

Leer:

- `AGENTS.md`
- `docs/MVP_RELEASE_STATUS.md`
- `docs/PRELAUNCH_PRIORITIES.md`
- `docs/API_CONTRACTS_MVP.md`
- `docs/DATA_MODEL.md`
- `docs/ROUTE_MAP_MVP.md`

## Tarea

Implementar o preparar el contrato backend minimo para login recurrente de empresa con email/password, preservando el flujo de invitacion actual como activacion inicial.

## Alcance

- Definir endpoints necesarios para activacion con password y login recurrente.
- Usar hash fuerte para password; nunca guardar password plano.
- Mantener cookie de sesion server-side.
- Definir reglas para empresas `pending`, `published`, `rejected` y `suspended`.
- No romper `POST /api/company-auth/accept-invite` existente.
- Actualizar docs de contrato/modelo/rutas si se cambia contrato.

## No tocar

- Pagina publica visual.
- Admin interno.
- Email/cotizacion.
- UX P2.

## Verificacion

- Sintaxis backend.
- Pruebas locales/estructurales de login valido, password invalido, empresa inexistente, empresa rechazada/suspendida y logout.
- Confirmar que respuestas no exponen password hash, tokens, cookies ni metadata sensible.

## Handoff esperado

Crear `tasks/TASK-158-HANDOFF.md` con:

- Endpoints creados o contrato propuesto.
- Archivos cambiados.
- Docs actualizados.
- Verificacion ejecutada.
- Riesgos o decisiones pendientes.
- Siguiente recomendado para Web Dev y QA.
