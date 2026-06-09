# TASK-134: QA panel empresa Round 2 post-deploy

## Equipo asignado

QA.

## Superficie

```text
panel.html
panel.js
panel.css
```

## Contexto

`TASK-129` no aprobo Azure porque el deploy anterior aun servia el panel viejo sin input multiple de imagenes.

`TASK-131` desplego Round 2 a Azure y confirmo:

- `/panel.html` sirve `panel.js?v=5`;
- `/panel.html` sirve `panel.css?v=5`.

## Archivos que debes leer

- `AGENTS.md`
- `chat-start/QA.md`
- `tasks/TASK-125-HANDOFF.md`
- `tasks/TASK-127-HANDOFF.md`
- `tasks/TASK-129-HANDOFF.md`
- `tasks/TASK-131-HANDOFF.md`
- `docs/MVP_RELEASE_STATUS.md`

## Objetivo

Validar en Azure desplegado que el panel empresa Round 2 permite manejar hasta 10 imagenes por servicio, una cover y galeria, manteniendo el flujo `Guardar borrador -> Enviar a revision`.

## Casos minimos

1. Confirmar que `/panel.html` sirve `panel.js?v=5` y `panel.css?v=5`.
2. Entrar con sesion real de empresa QA.
3. Agregar varias imagenes a un servicio.
4. Marcar una imagen como cover.
5. Confirmar que las demas quedan como galeria.
6. Intentar agregar imagen 11 y confirmar bloqueo.
7. Intentar segundo cover y confirmar bloqueo o reemplazo claro.
8. Validar formatos invalidos y archivo mayor a 5 MB.
9. Guardar borrador y enviar a revision.
10. Confirmar que imagenes quedan pendientes hasta admin.
11. Validar desktop/mobile.

## Entregable

Crear:

```text
tasks/TASK-134-HANDOFF.md
```

Debe indicar:

- ambiente probado;
- empresa/servicio QA usado sin exponer secretos;
- resultado por caso;
- datos QA creados y limpieza soft si aplica;
- riesgos o pendientes.

## Aviso al terminar

```text
Termine TASK-134. Product/Architect debe leer tasks/TASK-134-HANDOFF.md.
```
