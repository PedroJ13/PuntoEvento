# Tasks

Esta carpeta guarda handoffs entre chats/equipos.

Cada chat que termine una tarea debe crear o actualizar un archivo `.md` aqui con:

- objetivo,
- archivos tocados,
- decisiones,
- verificacion,
- pendientes,
- riesgos,
- siguiente recomendacion.

## Convencion de nombres

```text
TASK-###-equipo-descripcion.md
```

Ejemplos:

```text
TASK-002-infra-inventario-azure.md
TASK-003-backend-inventario-api.md
TASK-004-webdev-admin-servicios-demo.md
TASK-005-qa-matriz-mvp.md
```

## Flujo recomendado

1. Product/Architect asigna una tarea pequena.
2. El equipo trabaja en su chat.
3. El equipo crea un archivo en `tasks/`.
4. Product/Architect lee ese archivo.
5. Product/Architect actualiza `docs/BACKLOG.md`, `docs/DECISION_LOG.md` o los docs que correspondan.

