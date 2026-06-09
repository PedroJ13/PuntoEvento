# TASK-261: QA - revalidacion local P1 fallback publico

## Equipo asignado

QA.

## Contexto

Depende de `TASK-260`.

`TASK-259` quedo no aprobado por P1: pagina publica mostraba datos de referencia cuando fallaba la API publica en modo productivo/no-local.

## Tarea

Revalidar local/estructuralmente que el P1 de fallback publico quedo corregido y que el bloque `TASK-249` a `TASK-258` sigue sin regresiones criticas.

## Alcance

- Pagina publica con API OK.
- Pagina publica con API fallida en host productivo simulado.
- CTA global sin servicio.
- Drawer mobile.
- Panel/admin smoke si el cambio toca assets compartidos.

## No tocar

- No mutar datos reales.
- No usar credenciales reales.
- No hacer deploy.

## Verificacion

- Host no-local simulado + `/api/public/services` forzado a `500`.
- Confirmar mensaje controlado.
- Confirmar ausencia de paquetes/proveedores de referencia.
- Confirmar que local/demo mantiene comportamiento aceptado.
- Clasificar P0/P1/P2/P3.

## Handoff esperado

Crear `tasks/TASK-261-HANDOFF.md` con:

- Resultado aprobado/no aprobado.
- Evidencia del caso P1 corregido.
- Regresiones detectadas.
- Recomendacion para deploy.
