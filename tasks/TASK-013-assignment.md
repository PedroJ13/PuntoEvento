# TASK-013: Boton Restaurar demo en panel empresa

## Equipo encargado

Web Dev.

## Mensaje para iniciar el chat

```text
Lee este archivo de asignacion: tasks/TASK-013-assignment.md.
Sigue las instrucciones y al terminar actualiza `tasks/TASK-013-HANDOFF.md`.
```

## Archivos que debe leer antes de trabajar

Obligatorios:

- `AGENTS.md`
- `chat-start/WEB_DEV.md`
- `docs/README.md`
- `docs/BACKLOG.md`
- `docs/DECISION_LOG.md`
- `tasks/TASK-011-HANDOFF.md`
- `tasks/TASK-012-HANDOFF.md`

## Objetivo

Agregar un control visible para restaurar los datos demo del panel empresa y evitar que pruebas repetidas acumulen servicios en `localStorage`.

## Contexto

QA aprobo TASK-012 con observaciones.

Observacion principal:

Los datos demo persisten en `localStorage` con la llave `puntoEventoDemoServices`, pero no hay forma visible de restaurarlos desde la UI.

## Alcance

Se permite tocar:

- `panel.html`
- `panel.js`
- `panel.css`
- `tasks/TASK-013-HANDOFF.md`

## Fuera de alcance

- No tocar pagina publica.
- No tocar admin salvo que sea estrictamente necesario.
- No tocar `/api`.
- No implementar auth.
- No implementar upload real.

## Requerimientos funcionales

- Agregar boton visible:

```text
Restaurar demo
```

- Al hacer clic:
  - limpiar o reemplazar `localStorage.puntoEventoDemoServices`,
  - volver a servicios demo base,
  - limpiar formulario abierto si aplica,
  - mostrar mensaje de confirmacion.
- Evitar borrado accidental:
  - usar `confirm()` o un pequeno estado de confirmacion.
- Debe funcionar en `panel.html`.
- No debe afectar otros datos del navegador.

## Criterios de aceptacion

- El boton `Restaurar demo` es visible.
- Crear un servicio nuevo.
- Refrescar y confirmar que aparece.
- Usar `Restaurar demo`.
- Confirmar que el servicio nuevo desaparece.
- Confirmar que servicios base vuelven a mostrarse.
- No hay errores de consola.

## Verificacion requerida

Manual:

1. Abrir `panel.html`.
2. Crear servicio.
3. Refrescar.
4. Click en `Restaurar demo`.
5. Confirmar restauracion.
6. Revisar consola.

Git:

```text
git status --short
```

Debe mostrar solo archivos permitidos y handoff.

## Handoff requerido

Crear:

```text
tasks/TASK-013-HANDOFF.md
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
Termine TASK-013. Product/Architect debe leer `tasks/TASK-013-HANDOFF.md`.
```

