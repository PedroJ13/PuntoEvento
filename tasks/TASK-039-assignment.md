# TASK-039: Backend remover endpoint temporal auth diagnostics

## Equipo encargado

Backend API.

## Mensaje para iniciar el chat

```text
Lee este archivo de asignacion: tasks/TASK-039-assignment.md.
Sigue las instrucciones y al terminar actualiza `tasks/TASK-039-HANDOFF.md`.
```

## Objetivo

Remover el endpoint temporal de diagnostico creado para depurar Basic Auth:

```text
POST /api/internal/auth-diagnostics
```

## Archivos a remover

```text
api/internal-auth-diagnostics/function.json
api/internal-auth-diagnostics/index.js
```

## Contexto

El diagnostico ya cumplio su proposito. El flujo real quedo validado:

```text
internal/company-invites -> accept-invite -> companies/me -> logout
```

## Reglas

- No tocar `api/shared/adminAuth.js`.
- No tocar `api/internal-company-invites`.
- No tocar `api/companies-me`.
- No modificar UI.

## Verificacion esperada

- Confirmar que `api/internal-auth-diagnostics` ya no contiene `function.json`.
- Confirmar que no hay referencias necesarias al endpoint en codigo productivo.

## Handoff requerido

Crear:

```text
tasks/TASK-039-HANDOFF.md
```

Debe incluir:

- Resultado general.
- Archivos eliminados.
- Verificacion realizada.
- Riesgos.
- Siguiente tarea recomendada.

## Al finalizar

Responder:

```text
Termine TASK-039. Product/Architect debe leer `tasks/TASK-039-HANDOFF.md`.
```
