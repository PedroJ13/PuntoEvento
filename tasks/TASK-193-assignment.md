# TASK-193: Web Dev - CTA publico Contactar con WhatsApp primario

## Equipo asignado

Web Dev.

## Contexto

En la prueba con cliente del 2026-06-03 hubo confusion sobre `Pedir presupuesto`, si llegaba email y a quien. Product / Architect / Release decidio que el MVP usara ambos canales: WhatsApp como contacto primario cuando exista y email como respaldo/trazabilidad.

## Tarea

Ajustar la pagina publica para que el contacto desde servicios/perfil sea claro para usuario final.

## Alcance

1. Reemplazar o redefinir CTAs visibles que digan `Pedir presupuesto` si generan ambiguedad.
2. Usar `Contactar` como CTA principal.
3. Si el servicio/empresa tiene WhatsApp disponible, abrir WhatsApp con mensaje prellenado desde el CTA principal.
4. Mantener acceso al flujo de solicitud/cotizacion por email como opcion secundaria o fallback claro.
5. Asegurar que la UI indique claramente si el contacto va por WhatsApp o por formulario/email.
6. Validar desktop y mobile.

## No tocar

- No redisenar la pagina publica completa.
- No cambiar endpoints backend en esta tarea.
- No eliminar el flujo de email existente.
- No publicar datos privados que no esten destinados a la pagina publica.

## Verificacion

- Servicio con WhatsApp muestra `Contactar` y abre WhatsApp.
- Servicio sin WhatsApp conserva alternativa clara por email/formulario.
- No queda CTA principal prometiendo presupuesto si la accion real no es clara.
- Mobile no corta textos ni botones.

## Handoff esperado

Crear `tasks/TASK-193-HANDOFF.md` con:

- Cambios realizados.
- URLs/pantallas probadas.
- Casos con y sin WhatsApp.
- Riesgos o dependencias con Backend/API.
