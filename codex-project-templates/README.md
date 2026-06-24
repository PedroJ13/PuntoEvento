# Plantillas Chat-Start Codex - Punto Evento

Estas plantillas explican como deben comportarse los chats de Punto Evento CR.

## Modelo actual de chats

El proyecto trabaja con cuatro chats principales:

- `Proyecto`: producto, arquitectura, release, decisiones, backlog y procesamiento de handoffs.
- `Pulso`: salud del proyecto, riesgos, foco y recomendaciones. No implementa.
- `QA`: validacion, regresion, severidad, evidencia y cierre de calidad.
- `Ejecucion Tecnica`: implementacion tecnica por modo.

`Ejecucion Tecnica` agrupa los modos tecnicos: Web Dev, Backend/API, Infra Azure, Diseno/UX, Copy y Data si aplica. Leer `CHAT_MODEL.md` para la regla completa.

## Uso

1. Abrir el chat correspondiente.
2. Pasarle el link del archivo `.md` que debe leer.
3. Pedirle que lea tambien `AGENTS.md`, `docs/README.md` y el documento de estado que aplique.
   - Estado vivo: `docs/ESTADO_OPERATIVO.md`.
   - Ready/Done compartido: `codex-project-templates/READY_DONE.md`.
4. Si es una tarea, pasarle el archivo `tasks/TASK-###-assignment.md` o `tasks/TASK-###.md`.
5. Si es `Ejecucion Tecnica`, indicar un unico modo principal.

## Archivos principales que debe leer cada chat

- Proyecto: `codex-project-templates/PROYECTO.md`
- Pulso: `codex-project-templates/PULSO_PROYECTO.md`
- QA: `codex-project-templates/QA.md`
- Ejecucion Tecnica: `codex-project-templates/EJECUCION_TECNICA.md`
- Ready/Done compartido: `codex-project-templates/READY_DONE.md`
- Estado vivo: `docs/ESTADO_OPERATIVO.md`
- Herramientas/PATH: `codex-project-templates/PROJECT_TOOLING_ONBOARDING.md`

## Referencias tecnicas por modo

Estos archivos quedan como apoyo para `Ejecucion Tecnica`, no como chats principales separados:

- `WEB_DEV.md`
- `BACKEND_API.md`
- `INFRA.md`
- `DISENO_UX.md`
- `DATA_DEV.md`

## Regla base

Mantener los chat-start cortos. El objetivo es orientar al agente, no duplicar toda la documentacion del proyecto.

Si un chat no ve `git`, `gh`, `az`, `node`, `npm`, `func`, `rg` u otra herramienta instalada, debe leer `PROJECT_TOOLING_ONBOARDING.md` antes de asumir que falta instalar algo.

## Flujo de tareas recomendado

1. Proyecto crea o asigna una tarea pequena.
2. La tarea se asigna a Proyecto, Pulso, QA o Ejecucion Tecnica.
3. Si va a Ejecucion Tecnica, la tarea indica un unico modo principal.
4. El chat responsable lee su plantilla, `AGENTS.md`, el task asignado y solo los documentos necesarios.
5. El chat responsable ejecuta o valida el alcance de la tarea.
6. El chat responsable crea o actualiza `tasks/TASK-###-HANDOFF.md`.
7. Proyecto procesa el handoff y actualiza estado, backlog o decisiones.
