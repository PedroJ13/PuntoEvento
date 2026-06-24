# Modelo de Chats Punto Evento

Este proyecto trabaja con cuatro chats principales. Los roles tecnicos historicos no desaparecen; quedan agrupados dentro de `Ejecucion Tecnica` como modos de trabajo.

Todos los chats deben leer tambien `codex-project-templates/READY_DONE.md`. Para estado vivo, usar `docs/ESTADO_OPERATIVO.md`; para release formal, usar `docs/MVP_RELEASE_STATUS.md`.

## Chats principales

| Chat | Archivo que debe leer | Responsabilidad |
| --- | --- | --- |
| Proyecto | `codex-project-templates/PROYECTO.md` | Producto, arquitectura, release, decisiones, backlog, tareas y procesamiento de handoffs. |
| Pulso | `codex-project-templates/PULSO_PROYECTO.md` | Salud del proyecto, riesgos, prioridades, foco y recomendaciones. No implementa. |
| QA | `codex-project-templates/QA.md` | Validacion, regresion, severidad, evidencia y cierre de calidad. |
| Ejecucion Tecnica | `codex-project-templates/EJECUCION_TECNICA.md` | Implementacion tecnica por modo: Web Dev, Backend/API, Infra Azure, Diseno/UX, Copy o Data. |

## Modos dentro de Ejecucion Tecnica

Una tarea de Ejecucion Tecnica debe indicar un unico modo principal:

- `Modo de ejecucion: Web Dev`
- `Modo de ejecucion: Backend/API`
- `Modo de ejecucion: Infra Azure`
- `Modo de ejecucion: Diseno/UX`
- `Modo de ejecucion: Copy`
- `Modo de ejecucion: Data`

Los archivos `WEB_DEV.md`, `BACKEND_API.md`, `INFRA.md`, `DISENO_UX.md` y `DATA_DEV.md` quedan como referencia de comportamiento por modo. El chat operativo recomendado es `EJECUCION_TECNICA.md`.

## Flujo de comunicacion

1. `Proyecto` define la prioridad y crea una tarea pequena en `tasks/TASK-###-assignment.md` o `tasks/TASK-###.md`.
2. La tarea indica el chat responsable: `Proyecto`, `Pulso`, `QA` o `Ejecucion Tecnica`.
3. Si va a `Ejecucion Tecnica`, la tarea tambien indica el modo tecnico principal.
4. El chat responsable lee su `.md`, `AGENTS.md`, el estado de release, la tarea y solo los docs necesarios.
5. El chat responsable ejecuta el alcance o valida el resultado.
6. Al terminar, crea o actualiza `tasks/TASK-###-HANDOFF.md`.
7. `Proyecto` procesa el handoff y actualiza release status, backlog o decision log si corresponde.

## Reglas de handoff

Todo handoff debe ser accionable y no debe incluir secretos, tokens, passwords, cookies, SAS URLs ni connection strings.
El formato completo recomendado esta en `codex-project-templates/READY_DONE.md`.

Formato base:

```text
Equipo:
Tarea completada:
Archivos cambiados:
Verificacion ejecutada:
Resultado:
Riesgos o pendientes:
Siguiente recomendado:
```

Formato extra para `Ejecucion Tecnica`:

```text
Modo de ejecucion:
Uso DB/storage cloud: No / Si, motivo: <motivo>, alcance: <consulta/migracion/smoke>
```

Formato extra para `QA`:

```text
Ambiente:
Resultado: aprobado / no aprobado / bloqueado / aprobado con observaciones
P0/P1:
P2/P3:
Evidencia:
```

## Reglas de alcance

- No mezclar frontend, backend, infra, data y QA en una misma tarea salvo decision explicita de `Proyecto`.
- `Pulso` recomienda, no implementa ni mueve release.
- `QA` no corrige codigo salvo tarea explicita de bug menor o test.
- `Ejecucion Tecnica` no crea tareas nuevas salvo pedido de `Proyecto`; si descubre trabajo nuevo, lo documenta como pendiente en el handoff.
- Azure Table Storage, Blob Storage y recursos reales se usan solo cuando la tarea lo justifica: smoke final corto, bug cloud-only, deploy Infra o validacion operativa. Declararlo siempre en el handoff.
