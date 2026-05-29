# TASK-118: Decision de limpieza de datos QA antes de demo owner

## Equipo asignado

Product / Architect / Release.

## Contexto

Las pruebas Azure recientes aprobaron:

- `TASK-114`: registro publico y doble submit.
- `TASK-115`: API `submit-review`.
- `TASK-117`: panel empresa con `Guardar borrador -> Enviar a revision`.

Durante esos smokes se crearon empresas y servicios QA reales en Azure.

Ejemplos documentados:

- Empresa QA: `company_e04c0711-14ae-42b0-8607-acbea4cdb252`.
- Empresa QA secundaria: `company_7c99f62b-ddcb-4c42-b2ac-3240d6399f82`.
- Servicios QA de `TASK-115` y `TASK-117`, incluyendo `service_6e4c6e2b-9d2a-4d34-8198-46f1eb38b72d`.

## Archivos que debes leer

- `AGENTS.md`
- `docs/MVP_RELEASE_STATUS.md`
- `docs/BACKLOG.md`
- `tasks/TASK-114-HANDOFF.md`
- `tasks/TASK-115-HANDOFF.md`
- `tasks/TASK-117-HANDOFF.md`

## Objetivo

Decidir si antes de la siguiente demo/prueba Product Owner:

1. Se limpian datos QA reales de Azure.
2. Se mantienen datos QA pero se etiquetan/ocultan.
3. Se crea una empresa demo limpia para Product Owner y se ignoran los datos QA existentes.

## Alcance

- Revisar datos QA mencionados en handoffs.
- Proponer una decision concreta.
- Documentar impacto en demo owner.
- Crear tareas siguientes si hace falta:
  - Infra/API para limpieza;
  - QA para verificar limpieza;
  - Product Owner test script actualizado.

## Fuera de alcance

- Borrar datos directamente sin decision explicita.
- Crear endpoints nuevos.
- Cambiar UI.
- Hacer commit/push.

## Entregable

Crear:

```text
tasks/TASK-118-HANDOFF.md
```

Debe incluir:

- Decision recomendada.
- Datos QA conocidos.
- Riesgo de mantenerlos.
- Riesgo de borrarlos.
- Proxima tarea recomendada, si aplica.

## Aviso al terminar

Cuando termines, avisa en el chat Product/Architect:

```text
Termine TASK-118. Product/Architect debe leer tasks/TASK-118-HANDOFF.md.
```
