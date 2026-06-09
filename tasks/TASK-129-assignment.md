# TASK-129: QA panel empresa Round 2

## Equipo asignado

QA.

## Superficie

```text
panel.html
```

## Prerrequisito

Ejecutar despues de `TASK-125` y ajustes API de imagenes de `TASK-127`.

## Objetivo

Validar imagenes de servicio:

- hasta 10 imagenes;
- una cover;
- galeria;
- validaciones de formato/tamano/limite;
- flujo `Guardar borrador -> Enviar a revision`.

## Archivos que debes leer

- `AGENTS.md`
- `chat-start/QA.md`
- `tasks/TASK-125-HANDOFF.md`
- `tasks/TASK-127-HANDOFF.md`
- `docs/PRODUCT_OWNER_TEST_FINDINGS_2026-05-29_ROUND_2.md`

## Casos minimos

1. Agregar varias imagenes a un servicio.
2. Marcar una como cover.
3. Confirmar que las demas quedan como galeria.
4. Intentar agregar imagen 11 y confirmar bloqueo.
5. Intentar segundo cover y confirmar bloqueo o reemplazo claro.
6. Validar formatos invalidos y >5 MB.
7. Guardar borrador y enviar a revision.
8. Confirmar que imagenes quedan pendientes hasta admin.
9. Validar desktop/mobile.

## Entregable

Crear:

```text
tasks/TASK-129-HANDOFF.md
```

## Aviso al terminar

```text
Termine TASK-129. Product/Architect debe leer tasks/TASK-129-HANDOFF.md.
```
