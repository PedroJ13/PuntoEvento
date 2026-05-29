# TASK-118 Handoff

## Resultado general

Decision recomendada: crear una empresa demo limpia para la siguiente prueba Product Owner y no borrar datos QA directamente desde esta tarea.

Esto corresponde a la opcion 3:

```text
Se crea una empresa demo limpia para Product Owner y se ignoran los datos QA existentes.
```

Complemento recomendado: abrir una tarea Infra/API posterior para limpieza controlada de datos QA reales, preferiblemente con soft cleanup o script con respaldo previo.

## Decision recomendada

Para la siguiente demo/prueba Product Owner:

1. Usar una empresa demo nueva, con nombre claro y datos presentables.
2. Crear solo los servicios necesarios para el guion Product Owner.
3. No publicar ni mostrar datos QA recientes como parte del flujo demo.
4. No hacer hard delete manual antes de la demo sin una tarea de Infra/API con verificacion.
5. Despues de la demo, ejecutar limpieza controlada de empresas/servicios QA creados durante smokes.

Razon:

- Los datos QA no deberian aparecer en pagina publica si siguen `pending`, `draft` o `rejected`.
- Borrarlos sin herramienta/tarea dedicada puede romper evidencia reciente de QA o dejar entidades relacionadas colgando.
- Una empresa demo limpia reduce ruido para Product Owner sin introducir riesgo destructivo inmediato.

## Datos QA conocidos

Empresas QA documentadas:

```text
company_e04c0711-14ae-42b0-8607-acbea4cdb252
company_7c99f62b-ddcb-4c42-b2ac-3240d6399f82
```

Nombres/emails documentados:

```text
QA TASK-114 Doble Submit 20260529210616
qa-task-114-20260529210616@example.test

QA TASK-114 Otra Empresa 20260529210924
qa-task-114-otra-20260529210924@example.test
```

Servicios QA documentados:

```text
service_edb4e73e-dd26-4aa2-9601-5b614b26e465
service_6e4c6e2b-9d2a-4d34-8198-46f1eb38b72d
service_c51d78b1-69bd-490a-a9be-51721f508c4a
```

Nombres/prefijos de servicios QA:

```text
QA TASK-115 Mesa Dulce ...
QA TASK-115 Incompleto ...
QA TASK-117 ... Mesa dulce UI
QA TASK-117 ... Incompleto
```

Advertencia: puede haber datos QA adicionales creados durante reintentos o pruebas con demora controlada. Para limpieza real, buscar por prefijos:

```text
QA TASK-114
QA TASK-115
QA TASK-117
qa-task-114-
```

## Riesgo de mantenerlos

- Pueden ensuciar listados internos de moderacion y confundir al Product Owner si entra al admin.
- Pueden mezclarse con servicios reales en pruebas si alguien aprueba accidentalmente datos QA.
- Pueden inflar contadores o estados pendientes.
- Pueden dificultar explicar el flujo si aparecen empresas con nombres tecnicos de QA.

Mitigacion para demo:

- Usar una empresa demo limpia y nombrada para demo.
- No aprobar datos QA.
- En el guion Product Owner, indicar exactamente que empresa usar.
- Si se muestra admin, filtrar visualmente por la empresa demo o pedir limpieza previa controlada.

## Riesgo de borrarlos

- No hay en esta tarea una instruccion explicita para borrar ni un plan de rollback.
- La eliminacion directa en Table Storage podria dejar invitaciones, sesiones, servicios o uploads relacionados sin limpiar.
- Se podria perder evidencia util para investigar regresiones recientes.
- Si se borra parcialmente, el panel/admin podria mostrar inconsistencias.

Mitigacion si se decide limpiar:

- Hacerlo en una tarea Infra/API dedicada.
- Levantar inventario por companyId y prefijos QA.
- Preferir soft cleanup cuando exista endpoint: rechazar empresas/servicios pendientes, desactivar servicios o marcar estados no publicos.
- Si se requiere hard delete, respaldar entidades relacionadas antes.
- QA debe verificar despues que no aparecen en publico ni contaminan admin/demo.

## Impacto en demo owner

Con una empresa demo limpia:

- Product Owner ve un flujo coherente de registro/panel/admin sin ruido tecnico.
- Se evita explicar datos de smoke o nombres `QA TASK-*`.
- Se conserva la evidencia de QA hasta que Infra/API limpie con trazabilidad.

Riesgo aceptado:

- Si Product Owner abre listados globales del admin antes de limpiar, podria ver empresas/servicios QA pendientes. Para una demo de admin limpia, conviene ejecutar limpieza controlada antes o usar un guion que enfoque una empresa demo concreta.

## Proximas tareas recomendadas

### TASK-119: Product / Architect / Release - Crear guion demo owner limpio

Objetivo:

- Definir nombre de empresa demo.
- Definir servicios demo esperados.
- Actualizar `docs/PRODUCT_OWNER_TEST_SCRIPT.md` con datos exactos.
- Indicar que no se deben usar entidades `QA TASK-*`.

### TASK-120: Infra/API - Limpieza controlada de datos QA Azure

Objetivo:

- Inventariar entidades por:
  - `company_e04c0711-14ae-42b0-8607-acbea4cdb252`;
  - `company_7c99f62b-ddcb-4c42-b2ac-3240d6399f82`;
  - prefijos `QA TASK-114`, `QA TASK-115`, `QA TASK-117`;
  - emails `qa-task-114-*`.
- Proponer soft cleanup o hard delete con respaldo.
- Ejecutar solo con aprobacion explicita.

### TASK-121: QA - Verificacion post-limpieza/pre-demo

Objetivo:

- Confirmar que datos QA no aparecen en pagina publica.
- Confirmar que admin/demo no queda contaminado para Product Owner.
- Confirmar que la empresa demo limpia puede ejecutar:
  - login/invitacion;
  - guardar borrador;
  - enviar a revision;
  - moderacion admin.

## Decision final para release

No bloquear la siguiente prueba Product Owner por hard delete de QA, pero si bloquear una demo admin completamente limpia si los listados globales muestran muchos `QA TASK-*`.

Camino recomendado:

```text
Crear empresa demo limpia ahora.
Usarla en el guion Product Owner.
Ejecutar limpieza controlada de QA como tarea separada antes de invitar empresas reales.
```
