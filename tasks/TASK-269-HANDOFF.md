# TASK-269 HANDOFF

## Resumen

Se ajustó la confirmación post-registro y los labels/microcopy visibles de estados en panel empresa, sin cambiar estados internos.

## Archivos modificados

- `app.js`
- `panel.js`
- `panel.html`

## Confirmación post-registro

Copy final para Azure:

- `Recibimos tu solicitud.`
- `Te enviaremos las instrucciones de acceso por correo cuando tu cuenta esté lista.`
- `No necesitas crear contraseña ahora. El acceso al panel llega en un paso posterior.`

Toast:

- `Solicitud recibida. Te enviaremos instrucciones por correo.`

## Mapping final de estados visibles

- `draft` -> `Borrador`
- `pending` -> `Recibido`
- `published` -> `Publicado`
- `rejected` -> `Necesita cambios`
- `inactive` -> `Inactivo`

## Microcopy de ayuda

- `draft`: `Solo tu empresa puede verlo. Envíalo cuando esté listo.`
- `pending`: `Tu información fue recibida. Te avisaremos cuando esté lista para publicarse.`
- `published`: `Este servicio ya está publicado. Edítalo si necesitas actualizarlo.`
- `rejected`: `Edita la información y vuelve a enviarlo.`
- `inactive`: `Este servicio está inactivo. Actívalo o crea uno nuevo para enviarlo.`

## Verificación

- `node --check panel.js`
- Playwright smoke panel demo:
  - `panelStatusLabels: true`
- Acciones existentes `Enviar servicio`, editar, desactivar y logout no cambiaron.

## Confirmación API

No se renombraron estados API ni se cambió flujo de invitación, activación, login o email.

## Riesgos

- El copy no promete publicación automática; dice que se avisará cuando esté lista para publicarse.
