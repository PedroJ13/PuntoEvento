# Triage prueba cliente 2026-06-03

## Decision contacto/cotizacion MVP

Decision: usar ambos canales en el MVP, con WhatsApp como contacto primario cuando la empresa tenga WhatsApp configurado y email como respaldo/trazabilidad del lead.

Regla de producto:

- En UI publica, el CTA principal debe ser `Contactar`.
- Si el servicio/empresa tiene WhatsApp, `Contactar` debe abrir WhatsApp con mensaje prellenado.
- El flujo de email se mantiene para registrar/enviar solicitud de cotizacion y no perder trazabilidad.
- No prometer `Pedir presupuesto` si la accion visible no deja claro quien recibe el contacto.

Motivo:

- WhatsApp reduce friccion para primeras empresas reales en Costa Rica.
- Email ya existe con ACS y sirve como respaldo operativo.
- Ambos reducen riesgo de perdida de leads durante pre-lanzamiento controlado.

## Clasificacion de hallazgos

### P1 pre-lanzamiento

- Contacto/cotizacion publico debe ser claro y operativo.
- Admin debe separar aprobacion de empresa vs aprobacion de servicios.
- Panel empresa debe usar lenguaje simple para cargar servicios.

### P2 recomendable

- Admin debe ocultar navegacion legacy/demo que no aporte al flujo real.
- Pagina publica debe alinear categorias/atajos con categorias de servicios.
- Al filtrar, la pagina debe mantener foco en resultados.
- Emails transaccionales deben tener copy mas claro y profesional.

## Tareas creadas

- `TASK-193`: Web Dev - CTA publico `Contactar` con WhatsApp primario y email como respaldo.
- `TASK-194`: Backend/API - contrato de contacto/cotizacion para ambos canales.
- `TASK-195`: Web Dev - lenguaje simple en panel empresa.
- `TASK-196`: Web Dev - admin por estado real de empresa/servicios.
- `TASK-197`: Web Dev - categorias publicas y foco en resultados.
- `TASK-198`: Backend/API - copy y comportamiento de emails transaccionales.
- `TASK-199`: Infra Azure - verificar configuracion ACS/base URLs para contacto y emails.
- `TASK-200`: QA - validacion Azure integrada de los hallazgos de cliente.

## Lotes sugeridos

### Lote 1: arranque recomendado

- `TASK-193`
- `TASK-195`
- `TASK-196`

### Lote 2: puede avanzar en paralelo si hay capacidad

- `TASK-194`
- `TASK-197`
- `TASK-198`
- `TASK-199`

### Cierre

- `TASK-200`
