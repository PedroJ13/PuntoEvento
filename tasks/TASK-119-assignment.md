# TASK-119: Guion demo owner limpio

## Equipo asignado

Product / Architect / Release.

## Contexto

`TASK-118` decidio no borrar datos QA directamente antes de la siguiente prueba Product Owner.

Decision:

```text
Crear una empresa demo limpia para Product Owner y usarla en el guion.
```

Los datos QA `QA TASK-*` se mantienen fuera del guion y se limpian en una tarea separada.

## Archivos que debes leer

- `AGENTS.md`
- `docs/PRODUCT_OWNER_TEST_SCRIPT.md`
- `docs/MVP_RELEASE_STATUS.md`
- `docs/BACKLOG.md`
- `tasks/TASK-118-HANDOFF.md`
- `tasks/TASK-114-HANDOFF.md`
- `tasks/TASK-115-HANDOFF.md`
- `tasks/TASK-117-HANDOFF.md`

## Objetivo

Actualizar el guion Product Owner para una demo limpia del flujo corregido:

```text
Registro publico -> invitacion/login empresa -> guardar borrador -> enviar a revision -> moderacion admin -> busqueda publica
```

## Alcance

1. Definir nombre de empresa demo.
2. Definir email de prueba recomendado.
3. Definir 1 o 2 servicios demo presentables.
4. Definir datos exactos para completar formularios.
5. Incluir advertencia de no usar entidades `QA TASK-*`.
6. Indicar prerequisitos:
   - Azure deploy actual;
   - credencial admin vigente en `local-secrets/qa-admin.ps1`;
   - si se requiere invitacion, quien la crea.
7. Ajustar `docs/PRODUCT_OWNER_TEST_SCRIPT.md` para reflejar:
   - `Guardar borrador`;
   - `Enviar a revision`;
   - campos requeridos;
   - validacion esperada en panel;
   - pasos admin.

## Fuera de alcance

- Crear datos reales en Azure.
- Limpiar datos QA.
- Cambiar UI/API.
- Hacer commit/push.

## Entregable

Crear:

```text
tasks/TASK-119-HANDOFF.md
```

Debe incluir:

- Guion actualizado.
- Datos demo recomendados.
- Archivos modificados.
- Riesgos pendientes.
- Proxima tarea recomendada.

## Aviso al terminar

Cuando termines, avisa en el chat Product/Architect:

```text
Termine TASK-119. Product/Architect debe leer tasks/TASK-119-HANDOFF.md.
```
