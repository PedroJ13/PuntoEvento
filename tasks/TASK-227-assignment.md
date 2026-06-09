# TASK-227: Web Dev - actualizar panel con nuevo logo Punto Evento CR

## Equipo asignado

Web Dev.

## Contexto

Product entrego un nuevo logo en `Reference Images/Logo.jpeg`. `TASK-226` debe preparar o recomendar el asset web final para evitar que se vea montado por el fondo.

## Tarea

Reemplazar el logo actual del panel empresa por el nuevo logo `Punto Evento CR`, usando el asset/recomendacion de `TASK-226`.

## Alcance

1. Leer `tasks/TASK-226-HANDOFF.md`.
2. Actualizar `panel.html` / `panel.css` para usar el nuevo logo final/recomendado.
3. Si `TASK-226` entrega asset en `assets/`, usar esa ruta.
4. Si se usa directamente `Reference Images/Logo.jpeg`, aplicar CSS para que:
   - no se vea el patron de transparencia falso;
   - no se note cambio de color de fondo;
   - no se vea como imagen montada.
5. Mantener `alt`/accesibilidad con `Punto Evento CR`.
6. Mantener layout del sidebar sin overflow.
7. Mantener icon buttons superiores y logout funcionando.
8. Actualizar cache busting de `panel.css`/`panel.html` si corresponde.

## No tocar

- No cambiar backend/API.
- No cambiar pagina publica ni admin salvo que Product lo pida en otra tarea.
- No cambiar nombre de marca; ya debe ser `Punto Evento CR`.
- No redisenar el panel completo.
- No cambiar flujos de servicios, login, upload ni contacto.

## Verificacion

- Nuevo logo aparece en panel empresa.
- No se ve fondo falso, patron de transparencia ni rectangulo montado.
- Desktop `1440x900` y `1024x900` sin overflow.
- Mobile `390x844` sin overflow.
- `Cerrar sesion` y `Volver a la pagina publica` siguen funcionando.
- `Mi empresa` y `Mis servicios` siguen navegando.
- `node --check panel.js` OK si se toca JS.
- `git diff --check -- panel.html panel.css panel.js` OK.

## Handoff esperado

Crear `tasks/TASK-227-HANDOFF.md` con:

- Resumen de cambios.
- Archivos tocados.
- Asset usado.
- Versiones/cache busting.
- Evidencia local desktop/mobile.
- Riesgos.
- Recomendacion para QA `TASK-228`.
