# TASK-005: Matriz de pruebas MVP

## Equipo

QA

## Estado

Completada

## Objetivo

Crear una matriz de pruebas MVP para Punto Evento que cubra registro de empresa, login/admin, multiples servicios, carga de fotos, busqueda por servicio y regresion de la pagina publica, siguiendo las instrucciones de `chat-start/QA.md`.

## Cambios realizados

- Se creo `docs/QA_TEST_PLAN.md`.
- Se agrego una matriz de pruebas MVP con casos funcionales, negativos, seguridad, responsive y release.
- Se cubrieron los flujos solicitados: registro empresa, login admin, servicios multiples, carga de fotos, busqueda por servicio y regresion publica.
- Se agregaron datos base de prueba, incluyendo el escenario Aurisbel con Queques, Wedding Planner y Mesa dulce.
- Se agrego checklist por release.
- Se documentaron riesgos antes de release y recomendaciones de automatizacion.
- Se creo este handoff para Product/Architect.

## Archivos tocados

- `docs/QA_TEST_PLAN.md`
- `tasks/TASK-004-HANDOFF.md`
- `tasks/TASK-005-HANDOFF.md`

## Verificacion

- Se leyo `chat-start/QA.md`.
- Se revisaron documentos de contexto: `docs/DATA_MODEL.md`, `docs/BACKLOG.md`, `docs/MVP_CRITERIA.md` y `tasks/TASK_HANDOFF_TEMPLATE.md`.
- Se verifico que `docs/QA_TEST_PLAN.md` quedo creado con matriz, checklist, regresion, seguridad y riesgos.
- Se verifico que la tarea no cambio codigo de la app.

## Riesgos

- La matriz incluye casos para funcionalidad objetivo que aun puede no estar implementada en el codigo actual.
- Las pruebas reales de Azure, email, Blob Storage, Table Storage y permisos requieren ambiente configurado.
- Sin fixtures `companies/services`, QA no puede ejecutar completamente el escenario Aurisbel multi-servicio.
- Basic Auth/admin hardening, cleanup global y auditoria siguen como riesgos de release.

## Pendientes

- Crear fixtures demo `data/companies.json` y `data/services.json`.
- Definir usuarios, roles y permisos reales para pruebas Empresa A vs Empresa B.
- Implementar o documentar endpoints definitivos `companies/services`.
- Convertir casos P1 en pruebas automatizadas.
- Ejecutar la matriz completa contra ambiente Azure.

## Recomendacion para Product/Architect

Product/Architect debe priorizar primero los fixtures y la representacion demo `Empresa -> Servicios`; despues coordinar la busqueda publica por servicio y el perfil empresa multi-servicio. Tambien debe definir criterios de aceptacion finales para permisos, estados publicables y visibilidad de servicios pendientes/rechazados.
