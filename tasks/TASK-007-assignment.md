# TASK-007: QA de pestana demo Servicios en admin

## Equipo encargado

QA.

## Mensaje para iniciar el chat

```text
Lee este archivo de asignacion: tasks/TASK-007-assignment.md.
Sigue las instrucciones y al terminar actualiza `tasks/TASK-007-HANDOFF.md`.
```

## Archivos que debe leer antes de trabajar

Obligatorios:

- `AGENTS.md`
- `chat-start/QA.md`
- `docs/README.md`
- `docs/BACKLOG.md`
- `docs/DATA_MODEL.md`
- `docs/MVP_CRITERIA.md`
- `docs/QA_TEST_PLAN.md`
- `tasks/TASK-006-HANDOFF.md`

Opcionales utiles:

- `docs/ARCHITECTURE.md`
- `docs/ADMIN_REGISTRATION_FLOW.md`
- `tasks/TASK-006-assignment.md`

## Objetivo

Validar manualmente la implementacion de TASK-006: pestana demo `Servicios` dentro de `admin.html`.

## Contexto

Web Dev implemento una demo local para que una empresa pueda representar multiples servicios dentro del admin actual, usando `localStorage` y sin tocar API ni pagina publica.

Product/Architect necesita saber si esta demo funciona y si rompe el flujo actual de revision interna.

## Alcance

QA debe revisar:

- `admin.html`
- `admin.js`
- `admin.css`
- flujo actual de revision en admin,
- pestana/seccion `Empresa demo`,
- pestana/seccion `Servicios`,
- persistencia en `localStorage`.

## Fuera de alcance

- No modificar codigo.
- No probar API nueva, porque no existe para servicios.
- No validar pagos.
- No validar `/panel/*`, porque aun no existe.
- No tocar pagina publica salvo regresion basica de no ruptura visual si QA lo considera necesario.

## Criterios de aceptacion

- `/admin.html` carga.
- Login/admin actual sigue funcionando si aplica.
- La seccion `Revision` sigue disponible.
- La seccion `Servicios` muestra servicios demo:
  - Queques personalizados,
  - Wedding planner,
  - Mesa dulce.
- Se puede crear un servicio demo.
- Se puede editar un servicio demo.
- Al refrescar, los cambios se mantienen por `localStorage`.
- Los estados visuales se muestran correctamente.
- No hay errores de consola durante el flujo.
- La pagina publica no fue alterada por TASK-006.

## Verificacion requerida

Manual:

1. Abrir servidor local.
2. Abrir `http://127.0.0.1:<puerto>/admin.html`.
3. Probar login si aplica.
4. Revisar `Revision`.
5. Revisar `Empresa demo`.
6. Revisar `Servicios`.
7. Crear servicio.
8. Editar servicio.
9. Refrescar.
10. Confirmar persistencia.
11. Revisar consola.

Git:

```text
git status --short
```

QA no debe agregar cambios salvo `tasks/TASK-007-HANDOFF.md`.

## Handoff requerido

Crear:

```text
tasks/TASK-007-HANDOFF.md
```

Debe incluir:

- Resultado general: aprobado / aprobado con observaciones / bloqueado.
- Casos probados.
- Bugs encontrados con severidad.
- Evidencia o notas de consola.
- Riesgos.
- Recomendacion para Product/Architect.

## Al finalizar

Responder en el chat de la tarea:

```text
Termine TASK-007. Product/Architect debe leer `tasks/TASK-007-HANDOFF.md`.
```

