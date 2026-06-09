# Automatizacion de coordinacion Codex

## Objetivo

Reducir el trabajo manual entre Product / Architect / Release y los chats especializados.

El flujo sigue usando archivos Markdown como fuente de verdad:

- Product / Architect / Release crea assignments en `tasks/`.
- Los chats especializados ejecutan su assignment.
- Cada chat escribe su handoff en `tasks/`.
- El script genera un tablero y prompts listos para cada chat.

## Comando

Desde la raiz del repo:

```powershell
.\tools\codex-coordination.ps1
```

Salida generada:

```text
tasks/generated/
  manager-board.md
  status.json
  prompts/
    product-architect-next-prompt.md
    web-dev-next-prompt.md
    backend-api-next-prompt.md
    infra-azure-next-prompt.md
    qa-next-prompt.md
```

## Flujo recomendado

### Product / Architect / Release

1. Leer `tasks/generated/manager-board.md`.
2. Leer los handoffs recientes indicados por el board.
3. Actualizar `docs/MVP_RELEASE_STATUS.md`.
4. Actualizar backlog, decision log o contratos si corresponde.
5. Crear el siguiente `tasks/TASK-###-assignment.md`.
6. Correr:

```powershell
.\tools\codex-coordination.ps1
```

7. Copiar el prompt generado del rol correspondiente.

### Chats especializados

1. Recibir el prompt generado en `tasks/generated/prompts/<rol>-next-prompt.md`.
2. Leer el assignment indicado.
3. Trabajar solo el alcance de esa tarea.
4. Crear o actualizar `tasks/TASK-###-HANDOFF.md`.
5. Avisar:

```text
Termine TASK-###. Product / Architect / Release debe leer `tasks/TASK-###-HANDOFF.md`.
```

## Estados detectados

El script no necesita que se marque estado manualmente.

Detecta:

- `pending`: existe `tasks/TASK-###-assignment.md` y no existe handoff ni cancelacion.
- `done`: existe `tasks/TASK-###-HANDOFF.md`.
- `cancelled`: existe `tasks/TASK-###-CANCELLED.md`.

## Convenciones importantes

- Mantener nombres:

```text
tasks/TASK-###-assignment.md
tasks/TASK-###-HANDOFF.md
tasks/TASK-###-CANCELLED.md
```

- Incluir en cada assignment:

```text
## Equipo encargado
```

con uno de estos valores:

- Product Architect
- Product Architect Release
- Web Dev
- Backend API
- Infra Azure
- QA

## Que no automatiza todavia

- No crea assignments nuevos automaticamente.
- No decide prioridades por si solo.
- No modifica backlog ni decision log.
- No hace commit.

Eso sigue siendo responsabilidad de Product / Architect / Release.
