# TASK-161: Backend/API - email de cotizacion a empresa

## Equipo asignado

Backend / API.

## Contexto

Prioridad P1: la solicitud de cotizacion debe llegar por email a la empresa correspondiente.

Leer:

- `AGENTS.md`
- `docs/MVP_RELEASE_STATUS.md`
- `docs/PRELAUNCH_PRIORITIES.md`
- `docs/API_CONTRACTS_MVP.md`
- `docs/DATA_MODEL.md`
- `docs/ROUTE_MAP_MVP.md`

## Tarea

Crear el flujo backend minimo para recibir una solicitud de cotizacion desde pagina publica y enviar email a la empresa del servicio publicado.

## Alcance

- Endpoint de cotizacion/lead.
- Validaciones minimas de datos del solicitante.
- Resolver empresa y servicio solo si ambos estan publicados.
- No exponer email privado en API publica.
- Definir si se persiste lead en Table Storage para trazabilidad MVP.
- Actualizar contratos/modelo/rutas.

## No tocar

- UI publica.
- Login empresa.
- Emails internos de moderacion.
- Ranking/pagos/CRM.

## Verificacion

- Caso exitoso envia email a empresa correcta.
- Servicio no publicado o empresa no publicada no envia email.
- Datos invalidos responden `400`.
- No se expone email privado en response.

## Handoff esperado

Crear `tasks/TASK-161-HANDOFF.md` con:

- Endpoint/contrato.
- Proveedor de email usado o supuesto.
- Archivos y docs cambiados.
- Verificacion.
- Riesgos operativos.
- Siguiente recomendado para Web Dev y QA.
