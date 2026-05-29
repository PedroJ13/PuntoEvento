# TASK-121: QA pre-demo owner

## Equipo asignado

QA.

## Prerrequisito

Ejecutar despues de:

- `TASK-119` guion demo owner limpio;
- `TASK-120` limpieza o decision documentada sobre datos QA.

Si `TASK-120` no ejecuta limpieza, usar la decision documentada como condicion de prueba.

## Contexto

El flujo principal ya fue aprobado en Azure por tareas recientes:

- registro publico y doble submit;
- `submit-review`;
- panel empresa con `Guardar borrador -> Enviar a revision`.

Antes de una nueva prueba Product Owner, se debe confirmar que el ambiente y el guion estan listos.

## Archivos que debes leer

- `AGENTS.md`
- `chat-start/QA.md`
- `docs/PRODUCT_OWNER_TEST_SCRIPT.md`
- `docs/MVP_RELEASE_STATUS.md`
- `tasks/TASK-119-HANDOFF.md`
- `tasks/TASK-120-HANDOFF.md`
- `tasks/TASK-114-HANDOFF.md`
- `tasks/TASK-115-HANDOFF.md`
- `tasks/TASK-117-HANDOFF.md`

## Objetivo

Validar que el ambiente esta listo para una prueba Product Owner limpia.

## Casos minimos

1. Confirmar que el guion demo usa una empresa demo limpia y no entidades `QA TASK-*`.
2. Confirmar que pagina publica carga.
3. Confirmar que panel empresa carga.
4. Confirmar que admin carga con credencial vigente.
5. Confirmar que datos QA no aparecen en busqueda publica.
6. Si se hara demo admin, confirmar que los datos QA no contaminan de forma fuerte los listados globales o documentar limitacion.
7. Smoke corto del flujo demo:
   - guardar borrador;
   - enviar a revision;
   - ver pendiente en admin o endpoint interno;
   - aprobar/rechazar segun guion si aplica.

## Fuera de alcance

- Cambiar codigo.
- Limpiar datos.
- Hacer commit/push.

## Entregable

Crear:

```text
tasks/TASK-121-HANDOFF.md
```

Debe incluir:

- Resultado general.
- Checklist ejecutado.
- Bloqueadores para Product Owner, si existen.
- Riesgos aceptables.
- Recomendacion: owner puede probar / no puede probar.

## Aviso al terminar

Cuando termines, avisa en el chat Product/Architect:

```text
Termine TASK-121. Product/Architect debe leer tasks/TASK-121-HANDOFF.md.
```
