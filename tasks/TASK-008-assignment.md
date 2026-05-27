# TASK-008: Agregar modo demo local para panel empresa

## Equipo encargado

Web Dev.

## Mensaje para iniciar el chat

```text
Lee este archivo de asignacion: tasks/TASK-008-assignment.md.
Sigue las instrucciones y al terminar actualiza `tasks/TASK-008-HANDOFF.md`.
```

## Archivos que debe leer antes de trabajar

Obligatorios:

- `AGENTS.md`
- `chat-start/WEB_DEV.md`
- `docs/README.md`
- `docs/BACKLOG.md`
- `docs/ARCHITECTURE.md`
- `docs/DECISION_LOG.md`
- `docs/ADMIN_REGISTRATION_FLOW.md`
- `tasks/TASK-006-HANDOFF.md`
- `tasks/TASK-007-HANDOFF.md`

Opcionales utiles:

- `docs/MVP_CRITERIA.md`
- `docs/QA_TEST_PLAN.md`

## Objetivo

Agregar un modo demo local para que Product/QA puedan ver y probar `Empresa demo` y `Servicios` en `admin.html` sin depender de API Azure ni credenciales reales.

## Contexto

QA aprobo TASK-006 con observaciones.

Problema detectado:

- El panel de servicios vive dentro de `data-admin-panel`.
- En local, el login real depende de API/credenciales Azure.
- QA no puede navegar visualmente todo el panel si no tiene acceso al flujo real.

Decision Product/Architect:

- Se permite un modo demo local.
- No debe desbloquear acciones de revision interna.
- Debe quedar claro visualmente que es modo demo.
- No debe tocar pagina publica ni endpoints.

## Alcance

Solo se permite tocar:

- `admin.html`
- `admin.js`
- `admin.css`
- `tasks/TASK-008-HANDOFF.md`

## Fuera de alcance

- No tocar `index.html`.
- No tocar `app.js`.
- No tocar `styles.css`.
- No tocar `/api`.
- No cambiar endpoints.
- No implementar auth real.
- No mover el panel a `/panel/*` todavia.
- No permitir aprobar/rechazar proveedores en modo demo local.

## Requerimientos funcionales

- Agregar una forma explicita de entrar a modo demo local desde la pantalla de login o usando query param documentado.
- El modo demo debe mostrar:
  - `Empresa demo`,
  - `Servicios`.
- La seccion `Revision` debe quedar bloqueada/oculta/deshabilitada en modo demo, o mostrar mensaje claro:

```text
La revision interna requiere login admin real.
```

- Debe verse un indicador claro:

```text
Modo demo local
```

- Crear/editar servicios demo debe seguir funcionando con `localStorage`.
- El flujo admin real debe seguir existiendo para credenciales/API Azure.
- No debe haber errores de consola.

## Criterios de aceptacion

- `admin.html` carga sin sesion.
- Existe CTA o query param para modo demo local.
- Modo demo local permite acceder a `Empresa demo` y `Servicios`.
- Modo demo local no permite aprobar/rechazar proveedores.
- Login real/admin no se rompe.
- Servicios demo mantienen persistencia en `localStorage`.
- No se toca pagina publica.

## Verificacion requerida

Manual:

1. Abrir `admin.html` sin login.
2. Entrar a modo demo local.
3. Confirmar indicador visual de modo demo.
4. Confirmar que `Empresa demo` y `Servicios` son accesibles.
5. Confirmar que `Revision` no permite acciones reales sin login.
6. Crear/editar servicio.
7. Refrescar y confirmar persistencia.
8. Revisar consola sin errores.

Git:

```text
git status --short
```

Debe mostrar solo archivos permitidos y handoff.

## Handoff requerido

Crear:

```text
tasks/TASK-008-HANDOFF.md
```

Debe incluir:

- Resumen.
- Archivos tocados.
- Cambios realizados.
- Verificacion.
- Riesgos.
- Pendientes.
- Recomendacion para Product/Architect.

## Al finalizar

Responder:

```text
Termine TASK-008. Product/Architect debe leer `tasks/TASK-008-HANDOFF.md`.
```

