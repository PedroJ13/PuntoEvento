# TASK-162: Web Dev - formulario/CTA de cotizacion conectado

## Equipo asignado

Web Dev.

## Contexto

Depende de `TASK-161`.

## Tarea

Conectar el CTA/formulario de cotizacion de pagina publica al backend de cotizacion, manteniendo el diseno actual como base.

## Alcance

- Superficie publica en `index.html`, `app.js`, `styles.css` solo si aplica.
- Formulario simple con estados de envio, exito y error.
- Prevenir doble submit.
- Mensaje de confirmacion sobrio, sin prometer tiempos de respuesta no definidos.

## No tocar

- Panel empresa.
- Admin interno.
- Login empresa.
- Redisenio completo de pagina publica.

## Verificacion

- Solicitud valida envia request correcto.
- Error backend se muestra claro.
- Doble submit no duplica solicitud.
- Mobile basico.

## Handoff esperado

Crear `tasks/TASK-162-HANDOFF.md` con:

- Archivos cambiados.
- Flujo probado.
- Riesgos.
- Recomendacion para QA.
