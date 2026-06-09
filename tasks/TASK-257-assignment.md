# TASK-257: Backend API - pulido copy de emails transaccionales

## Equipo asignado

Backend API.

## Contexto

Copy / Gramatica detecto que emails transaccionales necesitan tildes, tono mas pulido y evitar lenguaje de aprobacion/revision manual hacia empresas.

Decision Product / Architect / Release:

- En emails a empresas no usar `aprobada`, `revision`, `moderacion` ni `pendiente`.
- En emails internos se puede mantener lenguaje operativo si ayuda al admin, pero debe estar escrito con tildes y tono claro.

## Tarea

Actualizar copy de emails transaccionales MVP sin cambiar proveedor, destinatarios ni contrato.

## Alcance

- `api/shared/email.js`

Cambios esperados:

- `Nueva solicitud de cotizacion` -> `Nueva solicitud de cotización`.
- Email interno de registro: `Nueva empresa registrada`.
- Email interno de servicio: `Servicio enviado`.
- Email empresa activacion subject/titulo: `Tu acceso a Punto Evento CR está listo`.
- Cuerpo empresa activacion: `Ya puedes activar tu acceso al panel.`
- Incluir tildes en `podrás`, `información`, `automáticamente`, etc.
- Evitar hacia empresa: `aprobada`, `revisión`, `moderación`, `pendiente`.

## No tocar

- No cambiar ACS Email.
- No cambiar variables, destinatarios, rutas ni estructura de envio.
- No cambiar flujo de invitacion.
- No tocar frontend.

## Verificacion

- Smoke local/estructural de generacion de templates si existe forma segura.
- Revision de strings para confirmar tildes y ausencia de palabras prohibidas en emails a empresa.
- Si se hace smoke real, no exponer destinatarios ni secretos.

## Handoff esperado

Crear `tasks/TASK-257-HANDOFF.md` con:

- Emails actualizados.
- Strings reemplazados.
- Validacion ejecutada.
- Riesgos y si requiere QA real de inbox.
