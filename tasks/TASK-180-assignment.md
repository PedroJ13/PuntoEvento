# TASK-180: Backend/API - enviar invite al aprobar empresa

## Equipo asignado

Backend / API.

## Contexto

Para pre-lanzamiento controlado, Product definio que el acceso de empresa debe enviarse cuando Admin aprueba la empresa.

Flujo objetivo:

```text
Empresa se registra
-> queda pending
-> Admin revisa
-> Admin aprueba empresa
-> sistema genera invite
-> sistema envia email de activacion a la empresa
-> empresa define password
-> empresa entra al panel con email/password
```

## Tarea

Modificar la aprobacion interna de empresa para generar una invitacion y enviar email de activacion por ACS Email.

## Alcance

- Al aprobar empresa, generar invite si no existe uno activo reciente para esa empresa.
- Enviar email a `Company.email` con enlace de activacion.
- Usar ACS Email/provider actual.
- No exponer token completo, token hash, session hash, cookies ni secretos en logs/responses.
- Si falla el email, la empresa puede quedar aprobada, pero la response debe indicar advertencia clara para reintento/manual.
- Mantener endpoint actual de generacion manual de invite para soporte interno.
- Actualizar contrato/docs si cambia response de approve.

## No tocar

- UI admin salvo contrato necesario para `TASK-181`.
- Pagina publica.
- Panel empresa.
- Cotizaciones.
- Limpieza de datos.

## Docs a actualizar

- `docs/API_CONTRACTS_MVP.md`
- `docs/MVP_RELEASE_STATUS.md` via handoff si cambia readiness.

## Verificacion

- `node --check` de archivos modificados.
- Prueba local/estructural:
  - aprobar empresa pending genera invite;
  - envia email de activacion con link;
  - reaprobar/no duplicar invite activo reciente;
  - fallo email no imprime secretos;
  - empresa queda aprobada aunque email falle, con warning.

## Handoff esperado

Crear `tasks/TASK-180-HANDOFF.md` con archivos cambiados, contrato final, verificacion ejecutada, riesgos y recomendacion para Web Dev/QA.
