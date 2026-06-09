# TASK-176: Backend/API - cambiar provider email MVP a Azure Communication Services Email

## Equipo asignado

Backend / API.

## Contexto

Depende de `TASK-175`.

El codigo actual de email fue implementado pensando en SendGrid. La decision MVP es usar Azure Communication Services Email y mantener proveedor configurable para no amarrar arquitectura.

## Tarea

Adaptar la capa de email backend para usar Azure Communication Services Email como provider MVP.

## Alcance

- Crear/ajustar helper de email configurable.
- Usar ACS Email como proveedor default MVP.
- Mantener manejo best effort para emails internos: no bloquear registro ni envio a revision si email falla.
- Mantener cotizacion publica con error claro si no se puede enviar email a empresa.
- No exponer secretos ni detalles tecnicos al frontend.
- Actualizar contratos/docs segun variables y comportamiento final.

## No tocar

- UI publica salvo que el contrato de error cambie y sea inevitable.
- Login empresa.
- Admin interno.
- Pagos/ranking/CRM.

## Docs a actualizar

- `docs/API_CONTRACTS_MVP.md`
- `docs/ARCHITECTURE.md`
- `docs/ROUTE_MAP_MVP.md` solo si cambia ruta.
- `docs/MVP_RELEASE_STATUS.md` via handoff.

## Verificacion

- `node --check` de archivos API modificados.
- Prueba local/estructural de:
  - cotizacion envia por provider configurado;
  - registro intenta email interno sin romper flujo;
  - submit-review intenta email interno sin romper flujo;
  - errores no incluyen secretos.

## Handoff esperado

Crear `tasks/TASK-176-HANDOFF.md` con:

- Provider final usado.
- Variables requeridas.
- Archivos y docs cambiados.
- Verificacion ejecutada.
- Riesgos.
- Recomendacion para QA.
