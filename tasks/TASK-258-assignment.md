# TASK-258: Web Dev - microcopy panel empresa sin lenguaje tecnico/manual

## Equipo asignado

Web Dev.

## Contexto

Copy / Gramatica detecto que el panel empresa mezcla ingles/tecnico y lenguaje que sugiere revision manual. Product indico que las empresas no deben percibir revision, moderacion o aprobacion manual del equipo en su experiencia visible.

Decision Product / Architect / Release:

Usar lenguaje de publicacion pronta y preparacion para publicar.

## Tarea

Pulir microcopy del panel empresa para reemplazar ingles tecnico, mejorar tildes y evitar lenguaje de revision manual hacia empresas.

## Alcance

- `panel.html`
- `panel.js`

Cambios sugeridos:

- `email y password` -> `correo y contraseña`.
- `Define un password` -> `Define una contraseña`.
- `Los passwords no coinciden` -> `Las contraseñas no coinciden`.
- `Completar envio` -> `Enviar servicio` o `Preparar para publicación`.
- `Tu informacion ya fue recibida` -> `Tu información fue recibida. Se publicará lo antes posible.`
- Revisar ayuda lateral: `¿Necesitas ayuda?`, `Estamos aquí...`, `Contáctanos`.
- Evitar `revisión`, `moderación`, `aprobación`, `pendiente de revisión` en experiencia empresa cuando no sea estrictamente necesario.

## No tocar

- No cambiar auth.
- No cambiar API ni estados internos.
- No redisenar panel.
- No tocar admin.

## Verificacion

- Login recurrente.
- Activacion por invitacion.
- Crear/editar/enviar servicio.
- Logout.
- Buscar strings prohibidos en panel visible.

## Handoff esperado

Crear `tasks/TASK-258-HANDOFF.md` con:

- Textos reemplazados.
- Strings que se conservaron por dependencia tecnica, si aplica.
- Pruebas realizadas.
- Riesgos.
