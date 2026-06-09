# TASK-253: Web Dev - CTA visible en drawer mobile

## Equipo asignado

Web Dev.

## Contexto

QA Visual pre-lanzamiento detecto que en mobile el drawer de contacto puede mostrar el boton `Enviar solicitud` parcialmente cortado al abrirse. El usuario puede llegar haciendo scroll, pero el CTA principal no queda evidente de entrada.

Prioridad: P2 pre-lanzamiento si se espera probar contacto desde telefono.

## Tarea

Ajustar el drawer de contacto en mobile para que el CTA principal quede visible y usable sin scroll inicial, o quede sticky al fondo del drawer.

## Alcance

- Pagina publica.
- Drawer de contacto/cotizacion.
- Responsive mobile.
- CSS/JS minimo necesario.

## No tocar

- No cambiar backend/API de leads.
- No cambiar templates de email.
- No redisenar pagina publica completa.
- No cambiar decision de WhatsApp primario + email respaldo.

## Verificacion

- Abrir ficha publica en viewport mobile.
- Abrir `Contactar`.
- Confirmar que `Enviar solicitud` o CTA equivalente queda visible/usable al abrir.
- Confirmar scroll interno correcto.
- Confirmar sin scroll horizontal.
- Revalidar desktop rapidamente.

## Handoff esperado

Crear `tasks/TASK-253-HANDOFF.md` con:

- Solucion aplicada.
- Viewports probados.
- Evidencia de CTA visible.
- Riesgos.
