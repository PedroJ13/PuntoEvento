# TASK-009: QA de modo demo local en admin

## Equipo encargado

QA.

## Mensaje para iniciar el chat

```text
Lee este archivo de asignacion: tasks/TASK-009-assignment.md.
Sigue las instrucciones y al terminar actualiza `tasks/TASK-009-HANDOFF.md`.
```

## Archivos que debe leer antes de trabajar

Obligatorios:

- `AGENTS.md`
- `chat-start/QA.md`
- `docs/README.md`
- `docs/BACKLOG.md`
- `docs/DECISION_LOG.md`
- `docs/QA_TEST_PLAN.md`
- `tasks/TASK-007-HANDOFF.md`
- `tasks/TASK-008-HANDOFF.md`

Opcionales utiles:

- `tasks/TASK-008-assignment.md`
- `docs/ARCHITECTURE.md`
- `docs/ADMIN_REGISTRATION_FLOW.md`

## Objetivo

Validar el modo demo local agregado en TASK-008 para que Product/QA puedan revisar `Empresa demo` y `Servicios` sin API Azure ni credenciales reales.

## Contexto

TASK-007 encontro que QA no podia completar login real en local porque el admin dependia de API/credenciales Azure.

TASK-008 agrego:

- CTA `Ver modo demo local`.
- Query param `admin.html?demo=local`.
- Banner `Modo demo local`.
- Bloqueo de revision interna en modo demo.
- Acceso a `Empresa demo` y `Servicios`.

## Alcance

QA debe validar:

- `admin.html` sin sesion.
- CTA `Ver modo demo local`.
- Query param `?demo=local`.
- Banner de modo demo.
- Bloqueo de `Revision`.
- Acceso a `Empresa demo`.
- Acceso a `Servicios`.
- Crear servicio.
- Editar servicio.
- Persistencia en `localStorage` tras refrescar.
- Consola sin errores.
- Responsive basico.

## Fuera de alcance

- No modificar codigo.
- No validar endpoints nuevos.
- No validar login real Azure salvo observacion secundaria.
- No validar pagos.
- No mover panel a `/panel/*`.

## Criterios de aceptacion

- `admin.html` carga sin sesion.
- El CTA demo abre el panel en modo demo.
- `admin.html?demo=local` abre el panel en modo demo.
- El banner `Modo demo local` es visible.
- `Revision` muestra mensaje de bloqueo o no permite acciones reales.
- `Actualizar`, aprobar y rechazar no ejecutan acciones reales en modo demo.
- `Empresa demo` y `Servicios` son navegables.
- Se puede crear y editar servicio demo.
- El servicio persiste tras refrescar.
- No hay errores de consola.

## Verificacion requerida

Manual:

1. Abrir `admin.html` sin sesion.
2. Entrar por CTA demo.
3. Refrescar.
4. Entrar por `admin.html?demo=local`.
5. Validar banner.
6. Validar bloqueo de revision.
7. Crear servicio.
8. Editar servicio.
9. Refrescar y confirmar persistencia.
10. Probar responsive basico.
11. Revisar consola.

Git:

```text
git status --short
```

QA no debe agregar cambios salvo `tasks/TASK-009-HANDOFF.md`.

## Handoff requerido

Crear:

```text
tasks/TASK-009-HANDOFF.md
```

Debe incluir:

- Resultado general: aprobado / aprobado con observaciones / bloqueado.
- Casos probados.
- Bugs encontrados con severidad.
- Evidencia o notas de consola.
- Riesgos.
- Recomendacion para Product/Architect.

## Al finalizar

Responder:

```text
Termine TASK-009. Product/Architect debe leer `tasks/TASK-009-HANDOFF.md`.
```

