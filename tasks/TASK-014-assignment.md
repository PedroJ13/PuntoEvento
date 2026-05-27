# TASK-014: QA del boton Restaurar demo

## Equipo encargado

QA.

## Mensaje para iniciar el chat

```text
Lee este archivo de asignacion: tasks/TASK-014-assignment.md.
Sigue las instrucciones y al terminar actualiza `tasks/TASK-014-HANDOFF.md`.
```

## Archivos que debe leer antes de trabajar

Obligatorios:

- `AGENTS.md`
- `chat-start/QA.md`
- `docs/README.md`
- `docs/BACKLOG.md`
- `tasks/TASK-012-HANDOFF.md`
- `tasks/TASK-013-HANDOFF.md`

## Objetivo

Validar manualmente que el boton `Restaurar demo` en `panel.html` limpia los servicios creados durante pruebas y restaura los servicios base.

## Alcance

QA debe validar:

- `panel.html`
- boton `Restaurar demo`
- confirmacion `confirm()`
- `localStorage.puntoEventoDemoServices`
- servicios base despues de restaurar
- consola sin errores

## Fuera de alcance

- No modificar codigo.
- No validar API.
- No validar Azure.
- No validar auth.
- No validar upload real.

## Criterios de aceptacion

- `panel.html` carga.
- Boton `Restaurar demo` es visible.
- Se puede crear un servicio demo.
- Al refrescar, el servicio creado sigue visible.
- Al usar `Restaurar demo` y aceptar confirmacion, desaparece el servicio creado.
- Vuelven los servicios base.
- No se afectan otros datos fuera de `puntoEventoDemoServices`.
- No hay errores de consola.

## Verificacion requerida

Manual:

1. Abrir `panel.html`.
2. Crear servicio con nombre reconocible, por ejemplo `Servicio QA Reset`.
3. Guardar.
4. Refrescar.
5. Confirmar que `Servicio QA Reset` aparece.
6. Click `Restaurar demo`.
7. Aceptar confirmacion.
8. Confirmar que `Servicio QA Reset` desaparece.
9. Confirmar que los servicios base siguen visibles.
10. Revisar consola.

Git:

```text
git status --short
```

QA no debe agregar cambios salvo `tasks/TASK-014-HANDOFF.md`.

## Handoff requerido

Crear:

```text
tasks/TASK-014-HANDOFF.md
```

Debe incluir:

- Resultado general.
- Casos probados.
- Bugs encontrados con severidad.
- Evidencia o notas de consola.
- Riesgos.
- Recomendacion para Product/Architect.

## Al finalizar

Responder:

```text
Termine TASK-014. Product/Architect debe leer `tasks/TASK-014-HANDOFF.md`.
```

