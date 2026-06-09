# TASK-132: QA admin/API Round 2 post-deploy

## Equipo asignado

QA.

## Superficie

```text
admin.html
api/**
```

## Contexto

`TASK-130` no aprobo Azure porque el deploy anterior permitia aprobar un servicio de una empresa pendiente.

`TASK-131` desplego Round 2 a Azure y confirmo por smoke que:

```text
POST /api/internal/services/{companyId}/{serviceId}/approve -> 409
```

cuando la empresa no esta publicada.

## Archivos que debes leer

- `AGENTS.md`
- `chat-start/QA.md`
- `tasks/TASK-126-HANDOFF.md`
- `tasks/TASK-127-HANDOFF.md`
- `tasks/TASK-130-HANDOFF.md`
- `tasks/TASK-131-HANDOFF.md`
- `docs/MVP_RELEASE_STATUS.md`

## Objetivo

Validar en Azure desplegado que admin/API Round 2 ya corrige aprobaciones fuera de orden y muestra moderacion por expediente de empresa.

## Casos minimos

1. Confirmar que `/admin.html` sirve `admin.js?v=13` y `admin.css?v=8`.
2. Login admin con credencial real de QA.
3. Admin permite seleccionar empresa y ver servicios/uploads relacionados en expediente.
4. Servicio de empresa no publicada no puede aprobarse desde UI.
5. Servicio de empresa no publicada responde `409` desde API.
6. Upload de empresa no publicada no puede aprobarse.
7. Upload de servicio no publicado no puede aprobarse.
8. Aprobar empresa no aprueba servicios/uploads automaticamente.
9. Aprobar servicio no aprueba uploads automaticamente.
10. Rechazos no hacen cascadas silenciosas.
11. Mensajes de UI son claros.
12. Validar desktop/mobile basico de admin.

## Entregable

Crear:

```text
tasks/TASK-132-HANDOFF.md
```

Debe indicar:

- ambiente probado;
- datos QA creados y limpieza soft aplicada;
- resultado por caso;
- si el P0 de `TASK-130` queda cerrado;
- riesgos o pendientes.

## Aviso al terminar

```text
Termine TASK-132. Product/Architect debe leer tasks/TASK-132-HANDOFF.md.
```
