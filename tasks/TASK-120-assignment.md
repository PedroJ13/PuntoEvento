# TASK-120: Limpieza controlada de datos QA Azure

## Equipo asignado

Infra/API.

## Contexto

`TASK-118` decidio no hacer hard delete manual sin tarea dedicada.

Hay datos QA reales creados durante smokes Azure recientes. Antes de invitar empresas reales o hacer demo admin limpia, conviene inventariarlos y limpiarlos de forma controlada.

## Archivos que debes leer

- `AGENTS.md`
- `chat-start/INFRA_AZURE.md`
- `docs/MVP_RELEASE_STATUS.md`
- `tasks/TASK-118-HANDOFF.md`
- `tasks/TASK-114-HANDOFF.md`
- `tasks/TASK-115-HANDOFF.md`
- `tasks/TASK-117-HANDOFF.md`
- scripts existentes en `tools/` relacionados con QA/API si aplica.

## Datos QA conocidos

Company IDs:

```text
company_e04c0711-14ae-42b0-8607-acbea4cdb252
company_7c99f62b-ddcb-4c42-b2ac-3240d6399f82
```

Servicios documentados:

```text
service_edb4e73e-dd26-4aa2-9601-5b614b26e465
service_6e4c6e2b-9d2a-4d34-8198-46f1eb38b72d
service_c51d78b1-69bd-490a-a9be-51721f508c4a
```

Prefijos/busquedas:

```text
QA TASK-114
QA TASK-115
QA TASK-117
qa-task-114-
```

## Objetivo

Inventariar y proponer limpieza controlada de datos QA Azure.

## Alcance

1. Inventariar empresas, servicios, uploads, invitaciones/sesiones relacionadas si aplica.
2. Documentar tablas/colecciones tocadas.
3. Proponer estrategia:
   - soft cleanup preferido si existe forma segura;
   - hard delete solo con respaldo/inventario y aprobacion explicita.
4. Si hay herramienta segura existente, preparar comando/script pero no ejecutar hard delete sin aprobacion explicita del usuario.
5. Si se ejecuta limpieza aprobada:
   - documentar que entidades se limpiaron;
   - dejar evidencia suficiente para QA.

## Fuera de alcance

- Borrar datos sin aprobacion explicita.
- Cambiar UI/API salvo que sea necesario crear herramienta de limpieza aprobada.
- Limpiar datos no QA.
- Hacer commit/push.

## Entregable

Crear:

```text
tasks/TASK-120-HANDOFF.md
```

Debe incluir:

- Resultado general.
- Inventario encontrado.
- Accion ejecutada o propuesta.
- Riesgos.
- Recomendacion para QA `TASK-121`.

## Aviso al terminar

Cuando termines, avisa en el chat Product/Architect:

```text
Termine TASK-120. Product/Architect debe leer tasks/TASK-120-HANDOFF.md.
```
