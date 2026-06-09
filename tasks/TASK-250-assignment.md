# TASK-250: Web Dev - CTAs publicos sin servicio seleccionado

## Equipo asignado

Web Dev.

## Contexto

QA Flujo MVP detecto CTAs publicos que pueden abrir contacto/cotizacion sin `companyId` ni `serviceId`, por ejemplo acciones globales o botones fuera de una ficha de servicio publicada.

Decision Product / Architect / Release:

Para MVP, todo lead real debe estar asociado a:

```text
companyId + serviceId
```

No se implementara cotizacion multiple real antes del pre-lanzamiento controlado.

## Tarea

Ajustar CTAs publicos sin contexto para que no abran un formulario de lead real sin servicio seleccionado.

## Alcance

- Pagina publica.
- CTAs globales de contacto/solicitud.
- Drawer/formulario de contacto.
- Estado cuando no hay servicio seleccionado.

Comportamiento esperado:

- Si el CTA tiene `companyId` + `serviceId`, puede abrir contacto normal.
- Si el CTA no tiene contexto de servicio, debe llevar a resultados/listado o mostrar una orientacion clara para elegir un servicio publicado primero.
- No debe permitir intentar enviar lead real sin servicio.

## No tocar

- No implementar multi-proveedor.
- No cambiar contrato de `/api/public/leads`.
- No tocar emails.
- No redisenar pagina publica.

## Verificacion

- Probar CTA desde card de servicio publicado.
- Probar CTA desde ficha publica.
- Probar CTA global sin servicio.
- Confirmar que no se envia lead sin `companyId` + `serviceId`.
- Confirmar que el usuario recibe una ruta clara para elegir servicio.

## Handoff esperado

Crear `tasks/TASK-250-HANDOFF.md` con:

- CTAs revisados.
- Comportamiento antes/despues.
- Evidencia de que no hay lead sin servicio.
- Riesgos o CTAs pendientes.
