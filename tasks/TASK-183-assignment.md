# TASK-183: Infra/API - limpieza controlada de empresas no QA

## Equipo asignado

Infra Azure con apoyo Backend/API si hace falta.

## Contexto

Product quiere comenzar limpio, sin ruido de empresas creadas que no sean de QA.

Esta tarea debe ser conservadora y trazable. No hacer hard delete salvo autorizacion explicita posterior.

## Tarea

Inventariar y limpiar de forma controlada empresas no QA del ambiente Azure.

## Alcance

1. Inventariar empresas actuales en `Companies`.
2. Clasificar:
   - QA/test/demo;
   - no QA/no test;
   - dudosas.
3. Proponer lista de empresas candidatas a limpieza antes de modificar.
4. Si Product aprueba dentro del mismo handoff o instruccion, aplicar soft cleanup:
   - marcar empresas no QA como `rejected` o estado equivalente;
   - marcar servicios relacionados como `rejected`/`inactive` si corresponde;
   - no borrar fisicamente tablas ni blobs.
5. Confirmar que no aparecen en busqueda publica.

## No tocar

- No hard delete.
- No borrar blobs.
- No borrar empresas QA necesarias para evidencia reciente sin documentarlo.
- No tocar app settings ni secretos.

## Verificacion

- Conteo antes/despues.
- Lista de IDs/slugs afectados.
- Busqueda publica no muestra empresas limpiadas.
- Handoff sin emails privados completos si no son necesarios; redactar parcialmente si aplica.

## Handoff esperado

Crear `tasks/TASK-183-HANDOFF.md` con inventario, criterio usado, acciones ejecutadas o propuesta si requiere aprobacion, conteo antes/despues, riesgos y recomendacion para Product / Architect / Release.
