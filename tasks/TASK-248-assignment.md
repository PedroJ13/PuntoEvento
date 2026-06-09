# TASK-248: Infra Azure - limpieza total controlada de empresas y servicios

## Equipo asignado

Infra Azure.

## Contexto

Product / Architect / Release solicita dejar el ambiente Azure limpio antes de seguir probando o invitar empresas reales.

Objetivo operativo: que no quede ninguna empresa registrada ni ningun servicio disponible en Azure para el flujo MVP/pre-lanzamiento.

Esta tarea debe ejecutarse como limpieza controlada de datos. Preferir soft cleanup para mantener trazabilidad y evitar borrados destructivos.

## Tarea

Inventariar y limpiar en Azure todas las empresas y servicios existentes, de forma que el catalogo publico, el admin y el panel no tengan empresas/servicios previos disponibles para operar.

## Alcance

1. Inventariar antes de cambiar datos:
   - `Companies`
   - `Services`
   - `Users`
   - `CompanyInvites`
   - `CompanySessions`
   - uploads relacionados, solo para conteo/diagnostico si aplica.
2. Aplicar limpieza controlada:
   - Todas las empresas deben quedar fuera de uso operativo.
   - Todos los servicios deben quedar fuera del catalogo publico y fuera de revision activa.
   - Preferencia MVP: soft cleanup con estados `rejected`, `inactive` o equivalente existente.
3. Si existe una herramienta/script interno ya usado en limpiezas anteriores, reutilizarlo.
4. Invalidar o dejar sin uso operativo accesos relacionados si corresponde:
   - sesiones de empresa;
   - invites activos;
   - usuarios asociados a empresas limpiadas.
5. Verificar que no quedan:
   - empresas pendientes o publicadas en admin;
   - servicios pendientes, publicados o activos;
   - resultados publicos en `/api/public/services`.
6. Documentar cualquier dato que no se haya tocado y por que.

## No tocar

- No borrar blobs ni imagenes fisicas salvo que Product lo apruebe explicitamente.
- No borrar tablas completas.
- No hacer hard delete si el modelo actual permite soft cleanup suficiente.
- No tocar app settings ni secretos.
- No imprimir connection strings, account keys, SAS, tokens, cookies, hashes ni passwords.
- No cambiar codigo ni contratos API.
- No mezclar esta tarea con deploy de frontend/backend.

## Verificacion

- Conteo antes/despues por tabla y status.
- `GET /api/public/services?limit=50` debe devolver 0 servicios publicados o una lista vacia equivalente.
- Admin no debe mostrar empresas o servicios pendientes/publicados.
- El registro de nuevas empresas debe seguir funcionando despues de la limpieza.
- Confirmar que no hubo hard delete ni borrado de blobs, o explicar cualquier excepcion aprobada.

## Handoff esperado

Crear `tasks/TASK-248-HANDOFF.md` con:

- Resumen ejecutivo.
- Conteo antes/despues.
- Estrategia usada: soft cleanup, invalidacion de sesiones/invites, u otra.
- IDs/slugs afectados, sin exponer datos sensibles.
- Verificaciones ejecutadas y resultados.
- Riesgos o residuos conocidos.
- Confirmacion de que el ambiente queda listo para registrar empresas desde cero.
