# TASK-198: Backend/API - copy y comportamiento de emails transaccionales MVP

## Equipo asignado

Backend/API.

## Contexto

ACS Email ya funciona para MVP, pero la prueba cliente detecto que el texto y la expectativa de emails/contacto deben mejorar. Product decidio mantener email como respaldo/trazabilidad junto con WhatsApp primario.

## Tarea

Revisar y ajustar los emails transaccionales MVP para que tengan copy claro y comportamiento consistente.

## Alcance

1. Revisar emails actuales:
   - empresa registrada;
   - empresa aprobada / activacion;
   - servicio cargado/enviado;
   - cotizacion/contacto recibido.
2. Mejorar copy para que sea profesional, breve y claro.
3. Agregar bienvenida cuando la empresa fue aprobada si no existe.
4. Asegurar que el email de contacto/cotizacion indique origen Punto Evento y datos utiles del lead.
5. Mantener fallback/errores segun reglas actuales:
   - fallo de email interno no rompe registro;
   - fallo de cotizacion publica no debe ser silencioso.
6. Actualizar docs si cambia comportamiento.

## No tocar

- No cambiar proveedor ACS ni secretos.
- No redisenar plantillas HTML complejas.
- No cambiar UI.
- No imprimir datos sensibles en logs.

## Verificacion

- Emails renderizan en texto/HTML aceptable.
- Asuntos son claros.
- Enlaces de activacion usan base URL correcta.
- Fallos de email se manejan segun contrato.

## Handoff esperado

Crear `tasks/TASK-198-HANDOFF.md` con:

- Emails revisados.
- Asuntos/copy final.
- Casos probados local/estructuralmente.
- Docs actualizados.
