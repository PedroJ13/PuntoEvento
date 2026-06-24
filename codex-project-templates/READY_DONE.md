# Ready / Done Compartido

Este documento aplica a `Proyecto`, `Pulso`, `QA` y `Ejecucion Tecnica`.

Objetivo: tareas pequenas, handoffs ejecutivos y cierre de ciclos antes de abrir nuevos frentes.

## Fuentes de estado

- Estado vivo: `docs/ESTADO_OPERATIVO.md`.
- Estado de release: `docs/MVP_RELEASE_STATUS.md`.
- Historial y decisiones: `docs/DECISION_LOG.md`, `docs/BACKLOG.md` y handoffs en `tasks/`.

Proyecto procesa handoffs y mantiene separado el estado actual de la historia.

## Limite de trabajo paralelo

- Maximo 1 frente tecnico activo.
- Maximo 1 frente QA activo.
- Maximo 1 frente de decision/coordinacion activo.

Si hay un ciclo abierto con deploy o QA pendiente, Proyecto debe cerrarlo o documentar por que se pausa antes de abrir otro frente.

## Definition of Ready

Una tarea esta lista cuando incluye:

```text
# TASK-### - Titulo

Equipo:
Modo de ejecucion:
Estado:
Prioridad:
Depende de:

Objetivo:
Contexto:
Alcance:
Fuera de alcance:

Criterios de aceptacion:
Verificacion requerida:
Uso de cloud / SQL / servicios externos:
Handoff esperado:
```

Reglas:

- `Equipo` debe ser `Proyecto`, `Pulso`, `QA` o `Ejecucion Tecnica`.
- Si el equipo es `Ejecucion Tecnica`, `Modo de ejecucion` debe ser uno solo: `Web Dev`, `Backend/API`, `Infra Azure`, `Diseno/UX`, `Copy` o `Data`.
- `Depende de` debe decir `Ninguna` o listar tareas/handoffs concretos.
- `Uso de cloud / SQL / servicios externos` debe declarar si se permite, con motivo y limite.

## Definition of Done

Toda tarea terminada debe crear o actualizar `tasks/TASK-###-HANDOFF.md`.

Formato base:

```text
# TASK-### - Handoff

## Resultado

Equipo:
Modo de ejecucion:
Tarea:
Resultado:

## Decision para Proyecto

## P0/P1

## Pendientes accionables

## Evidencia resumida

## Archivos / commits

## Detalle tecnico

Archivos cambiados:
Verificacion ejecutada:
Uso cloud/SQL:
Riesgos o pendientes:
Siguiente recomendado:
Movimiento de tablero sugerido:
```

## Formato QA

QA puede usar este formato especializado:

```text
# TASK-### - Handoff QA

Equipo: QA
Tarea validada:
Ambiente:
Resultado:

Checks ejecutados:
P0/P1:
P2/P3:
Evidencia:
Limitaciones:
Uso cloud/SQL:
Siguiente recomendado:
Movimiento de tablero sugerido:
```

## Procesamiento por Proyecto

Cuando Proyecto recibe handoffs:

1. Leer resultado, P0/P1, pendientes accionables y evidencia.
2. Actualizar `docs/ESTADO_OPERATIVO.md`.
3. Actualizar `docs/MVP_RELEASE_STATUS.md`, `docs/BACKLOG.md` o `docs/DECISION_LOG.md` solo si cambia estado, prioridad, alcance o decision.
4. Entregar el siguiente paquete de tareas solo si no queda bloqueado por dependencias.
