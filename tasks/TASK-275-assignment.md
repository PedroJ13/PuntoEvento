# TASK-275: Web Dev - corregir overflow desktop en ficha publica

## Equipo asignado

Web Dev.

## Contexto

`TASK-274` aprobo en Azure el bloque UX 2026-06-08, pero encontro un P2 visual en ficha publica desktop.

Hallazgo QA:

- Ruta mock: `#proveedor/empresa-whatsapp/catering-whatsapp`.
- Viewport: `1366x768`.
- `documentElement.scrollWidth = 1762`, `clientWidth = 1366`.
- Elementos señalados:
  - `.contact-note.full-note` con texto `También puedes enviar una solicitud registrada por Punto Evento CR.`
  - boton/enlace `Ver más servicios`.

Impacto:

La ficha sigue usable y mobile pasa, pero desktop queda con scroll horizontal visible. Conviene corregirlo antes de mostrar fichas publicas reales a usuarios externos.

## Tarea

Corregir el overflow horizontal de la ficha publica desktop manteniendo la jerarquia service-first y el copy de contacto/cotizacion aprobado.

## Alcance

1. Revisar CSS/layout de ficha publica en desktop, especialmente bloque de contacto/CTAs.
2. Evitar que `.contact-note.full-note`, `Ver más servicios` u otros CTAs excedan el viewport.
3. Mantener mobile ya aprobado sin regresion.
4. Mantener copy de `TASK-267` y jerarquia de `TASK-268`.
5. Actualizar cache busting si corresponde.

## No tocar

- No cambiar API/backend.
- No cambiar modelo de datos.
- No cambiar flujo de contacto/cotizacion.
- No eliminar CTAs aprobados; ajustar layout/tamano/wrapping.
- No redisenar ficha completa.

## Verificacion

- `node --check app.js` si se toca JS.
- `git diff --check` sobre archivos tocados.
- Validar desktop `1366x768` sin overflow horizontal.
- Validar mobile `390x844` sin regresion.
- Confirmar que CTA WhatsApp/formulario sigue funcionando con `companyId + serviceId`.

## Handoff esperado

Crear `tasks/TASK-275-HANDOFF.md` con:

- Archivos modificados.
- Causa del overflow.
- Evidencia desktop/mobile sin overflow.
- Confirmacion de no cambios API.
