# TASK-040: QA Azure confirmar remocion auth diagnostics

## Equipo encargado

QA.

## Mensaje para iniciar el chat

```text
Lee este archivo de asignacion: tasks/TASK-040-assignment.md.
Sigue las instrucciones y al terminar actualiza `tasks/TASK-040-HANDOFF.md`.
```

## Objetivo

Confirmar en Azure que el endpoint temporal de diagnostico ya no esta disponible despues del deploy:

```text
POST /api/internal/auth-diagnostics
```

## Contexto

El endpoint fue creado temporalmente para depurar Basic Auth. Ya no debe quedar expuesto.

## Prueba requerida

Base URL:

```text
https://zealous-field-08fdd720f.7.azurestaticapps.net
```

Request:

```text
POST /api/internal/auth-diagnostics
{}
```

Esperado:

```text
404 Not Found
```

Tambien confirmar que el flujo principal sigue vivo:

```text
GET /api/companies/me sin cookie -> 401
POST /api/company-auth/logout sin cookie -> 200
```

## Fuera de alcance

- No usar credenciales admin.
- No crear invitaciones.
- No probar UI.
- No modificar codigo.

## Handoff requerido

Crear:

```text
tasks/TASK-040-HANDOFF.md
```

Debe incluir:

- Resultado general.
- Status de `/api/internal/auth-diagnostics`.
- Status de controles `companies/me` y `logout`.
- Riesgos.
- Recomendacion para Product/Architect.

## Al finalizar

Responder:

```text
Termine TASK-040. Product/Architect debe leer `tasks/TASK-040-HANDOFF.md`.
```
