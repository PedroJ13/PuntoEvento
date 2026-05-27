# TASK-006: Implementar pestana demo Servicios en admin

## Equipo encargado

Web Dev.

## Mensaje para iniciar el chat

```text
Lee este archivo de asignacion: tasks/TASK-006-assignment.md.
Sigue las instrucciones y al terminar actualiza `tasks/TASK-006-HANDOFF.md`.
```

## Archivos que debe leer antes de trabajar

Obligatorios:

- `AGENTS.md`
- `chat-start/WEB_DEV.md`
- `docs/README.md`
- `docs/BACKLOG.md`
- `docs/DATA_MODEL.md`
- `docs/ARCHITECTURE.md`
- `docs/DECISION_LOG.md`
- `docs/ADMIN_REGISTRATION_FLOW.md`
- `tasks/TASK-004-HANDOFF.md`

Opcionales utiles:

- `EQUIPO_WEB_DEV_NUEVO_ENFOQUE.md`
- `REGISTRO_EMPRESAS.md`
- `docs/MVP_CRITERIA.md`

## Objetivo

Implementar una primera pantalla demo de `Servicios` dentro del admin actual para representar una empresa con multiples servicios.

## Contexto

`TASK-004` definio que el admin actual esta orientado a revision interna y que hace falta una experiencia separada para que una empresa gestione sus servicios.

Decision Product/Architect:

- Admin interno y Panel empresa son responsabilidades separadas.
- Para demo rapida, se permite agregar una pestana `Servicios` dentro de `admin.html`, claramente marcada como demo.
- No se debe tocar la pagina publica.
- No se debe integrar API nueva todavia.

## Alcance

Solo se permite tocar:

- `admin.html`
- `admin.js`
- `admin.css`
- `tasks/TASK-006-HANDOFF.md`

## Fuera de alcance

- No tocar `index.html`.
- No tocar `app.js`.
- No tocar `styles.css`.
- No tocar `/api`.
- No cambiar endpoints.
- No implementar auth nueva.
- No implementar pagos.
- No mover archivos.

## Requerimientos funcionales

- Agregar navegacion simple por tabs o secciones:
  - `Revision`
  - `Empresa demo`
  - `Servicios`
- Mantener funcionando el flujo actual de revision de proveedores.
- Crear panel `Servicios` con 2 o 3 servicios demo ligados a una empresa.
- Mostrar por servicio:
  - nombre,
  - categoria,
  - tipos de evento,
  - precio desde,
  - estado,
  - cantidad de fotos,
  - ultima actualizacion.
- Agregar boton `Agregar servicio`.
- Permitir crear o editar servicio demo localmente.
- Guardar cambios en `localStorage`.
- Al refrescar, conservar servicios demo.
- Estados permitidos:
  - draft,
  - pending,
  - published,
  - rejected,
  - inactive.

## Criterios de aceptacion

- `/admin.html` carga sin errores de consola.
- La pestana/seccion `Revision` sigue mostrando el flujo actual.
- La pestana/seccion `Servicios` muestra servicios demo.
- Se puede crear un servicio demo.
- Se puede editar un servicio demo.
- Los datos persisten en `localStorage` despues de refrescar.
- La pagina publica no cambia.
- No hay llamadas API nuevas.

## Verificacion requerida

Manual:

- Abrir `/admin.html`.
- Iniciar sesion si el admin actual lo requiere.
- Confirmar que revision actual sigue disponible.
- Ir a `Servicios`.
- Crear un servicio.
- Refrescar.
- Confirmar que el servicio sigue ahi.
- Revisar consola sin errores.

Git:

```text
git status --short
```

Debe mostrar solo archivos permitidos y el handoff.

## Handoff requerido

Crear:

```text
tasks/TASK-006-HANDOFF.md
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

Responder en el chat de la tarea:

```text
Termine TASK-006. Product/Architect debe leer `tasks/TASK-006-HANDOFF.md`.
```

