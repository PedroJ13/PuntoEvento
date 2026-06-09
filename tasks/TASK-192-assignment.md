# TASK-192: Infra Azure - limpieza pre-lote real de companias Azure

## Equipo asignado

Infra Azure.

## Contexto

El pre-lanzamiento ya no tiene P0/P1 tecnicos abiertos. Antes de invitar primeras empresas reales conviene limpiar el ambiente Azure para reducir ruido operativo en admin, busqueda publica y pruebas de Product.

Ya se ejecuto una limpieza puntual de `SMASH Costa Rica` en `TASK-186`. Esta tarea es una limpieza conservadora adicional enfocada en companias QA/test/demo acumuladas durante `TASK-184` a `TASK-191` y rondas previas.

Puede pedir apoyo tecnico puntual si hace falta, pero la responsabilidad operativa es de Infra Azure.

## Tarea

Inventariar y aplicar soft cleanup conservador de companias no reales o de QA en Azure, dejando el ambiente listo para primer lote real.

## Alcance

1. Inventariar tablas relevantes:
   - `Companies`
   - `Services`
   - opcionalmente `Users`, `CompanyInvites`, `CompanySessions` solo para conteo/diagnostico sin imprimir secretos.
2. Clasificar companias:
   - `real/conservar`
   - `QA/test/demo/limpiar`
   - `dudosa/requiere decision Product`
3. Usar criterios conservadores:
   - nombres/slugs/emails/descripciones con `QA`, `TASK`, `test`, `demo`, `smoke`, `example`, `PO Test`;
   - companias creadas para tareas `TASK-*`;
   - companias sin servicios reales y con evidencia de prueba.
4. Aplicar soft cleanup solo a candidatas claras:
   - `Companies.status = rejected`
   - `rejectionReason = Prelaunch cleanup QA/test data`
   - actualizar `updatedAt`
   - servicios relacionados a `rejected` o `inactive` segun estado actual, preferiblemente `rejected` si son datos QA.
5. No tocar candidatas dudosas; dejarlas listadas para decision Product.
6. Verificar que busqueda publica no muestra companias/servicios limpiados.

## No tocar

- No hard delete.
- No borrar blobs.
- No tocar app settings.
- No tocar companias reales o dudosas.
- No imprimir emails completos si no es necesario; redactar parcialmente.
- No imprimir account keys, connection strings, SAS, tokens, cookies, password hashes ni secretos.
- No limpiar datos que QA necesite como evidencia reciente sin documentarlo.

## Verificacion

- Conteo antes/despues por status.
- Lista de IDs/slugs afectados.
- Lista de dudosas no tocadas.
- Busquedas publicas relevantes devuelven 0 resultados para entidades limpiadas.
- Confirmacion de que no hubo hard delete ni borrado de blobs.

## Handoff esperado

Crear `tasks/TASK-192-HANDOFF.md` con:

- Inventario antes/despues.
- Criterio de clasificacion.
- Entidades afectadas.
- Entidades dudosas/no tocadas.
- Verificacion publica.
- Riesgos.
- Recomendacion para Product / Architect / Release antes de invitar empresas reales.
