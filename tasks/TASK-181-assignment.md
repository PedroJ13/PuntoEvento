# TASK-181: Web Dev - mensaje admin al aprobar e invitar empresa

## Equipo asignado

Web Dev.

## Contexto

Depende de `TASK-180`.

Cuando Admin apruebe una empresa, el backend debe generar invite y enviar email de activacion. La UI admin debe comunicar el resultado de forma clara.

## Tarea

Ajustar admin UI para mostrar el resultado de aprobacion + envio de invitacion.

## Alcance

- En `admin.html` / `admin.js` / `admin.css` si aplica.
- Mostrar exito claro: `Empresa aprobada e invitacion enviada.`
- Si backend aprueba empresa pero no logra enviar email, mostrar advertencia clara: `Empresa aprobada, pero no se pudo enviar la invitacion. Reintentar o enviar manualmente.`
- No mostrar token completo ni invite URL completa en DOM si backend no debe exponerla.
- Mantener flujo actual de moderacion por expediente.

## No tocar

- Backend.
- Pagina publica.
- Panel empresa.
- Cotizaciones.
- Redisenio completo.

## Verificacion

- `node --check admin.js`.
- Mock local de respuesta exitosa.
- Mock local de respuesta con warning de email.
- Mobile basico si cambia layout.

## Handoff esperado

Crear `tasks/TASK-181-HANDOFF.md` con archivos cambiados, estados UI cubiertos, verificacion, riesgos y recomendacion para QA.
