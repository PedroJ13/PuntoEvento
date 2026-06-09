# TASK-130: QA admin/API Round 2

## Equipo asignado

QA.

## Superficie

```text
admin.html
api/**
```

## Prerrequisito

Ejecutar despues de:

- `TASK-126` Admin UI por expediente;
- `TASK-127` Backend/API reglas de moderacion.

## Objetivo

Validar que admin y API impiden aprobaciones fuera de orden y que la moderacion tiene contexto de empresa.

## Archivos que debes leer

- `AGENTS.md`
- `chat-start/QA.md`
- `tasks/TASK-126-HANDOFF.md`
- `tasks/TASK-127-HANDOFF.md`
- `docs/PRODUCT_OWNER_TEST_FINDINGS_2026-05-29_ROUND_2.md`

## Casos minimos

1. Admin permite seleccionar empresa y ver servicios/uploads relacionados.
2. Servicio de empresa no publicada no puede aprobarse desde UI.
3. Servicio de empresa no publicada responde `409` desde API.
4. Upload de empresa no publicada no puede aprobarse.
5. Upload de servicio no publicado no puede aprobarse.
6. Aprobar empresa no aprueba servicios/uploads automaticamente.
7. Aprobar servicio no aprueba uploads automaticamente.
8. Rechazos no hacen cascadas silenciosas.
9. Mensajes de UI son claros.
10. Validar desktop/mobile basico de admin.

## Entregable

Crear:

```text
tasks/TASK-130-HANDOFF.md
```

## Aviso al terminar

```text
Termine TASK-130. Product/Architect debe leer tasks/TASK-130-HANDOFF.md.
```
