# TASK-267: Web Dev - aclarar contacto y cotizacion publica

## Equipo asignado

Web Dev.

## Contexto

La revision UX del 2026-06-08 detecto riesgo de confusion entre WhatsApp, solicitud por formulario/email y cotizacion. El flujo MVP mantiene ambos canales:

- WhatsApp como contacto primario cuando la empresa lo tenga disponible.
- Formulario/email como respaldo operativo y trazabilidad.

Documento base:

- `tasks/DISENO_UX_WEB_PAGE_FLOWS_REVIEW_2026-06-08.md`
- `docs/WEB_PAGE_FLOWS.md`
- `docs/API_CONTRACTS_MVP.md`

## Tarea

Ajustar copy, microcopy y confirmaciones del flujo publico de contacto/cotizacion para que el usuario entienda que accion esta tomando.

## Alcance

1. Revisar CTAs publicos de ficha/tarjeta relacionados con contacto.
2. Mantener una accion principal clara para cotizar/contactar desde un servicio publicado.
3. Cuando el CTA abra WhatsApp, agregar microcopy cercano indicando que se abrira WhatsApp con el servicio seleccionado.
4. Cuando se use formulario/email, indicar que la solicitud se envia a la empresa y queda registrada por Punto Evento CR.
5. Ajustar confirmaciones para diferenciar:
   - WhatsApp abierto o listo para enviar.
   - Solicitud enviada por formulario/email.
6. Mantener la asociacion obligatoria `companyId + serviceId` para leads reales.

## No tocar

- No cambiar API ni contrato de `/api/public/leads`.
- No eliminar WhatsApp ni formulario/email.
- No exponer email privado de empresa.
- No implementar cotizacion multiple.
- No cambiar modelo de datos.

## Verificacion

- Contacto con WhatsApp muestra microcopy claro y conserva mensaje prellenado.
- Formulario/email muestra copy claro y envia payload con `companyId + serviceId`.
- CTA sin servicio seleccionado no envia lead real.
- No aparecen promesas de cotizacion multiple.
- `git diff --check` sobre archivos tocados.

## Handoff esperado

Crear `tasks/TASK-267-HANDOFF.md` con:

- Archivos modificados.
- Capturas o descripcion de estados WhatsApp/formulario.
- Confirmacion de que no se toco backend/API.
- Riesgos o copy pendiente si aplica.
