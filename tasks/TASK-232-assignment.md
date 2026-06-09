# TASK-232: Web Dev - aplicar paleta global a pagina publica y admin

## Equipo asignado

Web Dev.

## Contexto

`TASK-231` debe definir una guia minima de paleta global basada en el panel empresa. Product pidio aplicar esos colores a las demas paginas, solo colores, sin redisenar.

## Tarea

Aplicar la paleta aprobada a pagina publica y admin interno, manteniendo layout, estructura y flujos actuales.

## Alcance

1. Leer `tasks/TASK-231-HANDOFF.md`.
2. Actualizar `styles.css` para alinear colores de pagina publica:
   - botones;
   - links;
   - acentos;
   - bordes;
   - fondos suaves;
   - estados vacios o mensajes.
3. Actualizar `admin.css` para alinear colores del admin:
   - botones;
   - estados;
   - encabezados;
   - bordes;
   - fondos;
   - alertas.
4. Mantener el admin con lectura operativa clara.
5. No cambiar el panel empresa salvo que se detecte una variable compartida necesaria y no altere su estado aprobado.
6. Actualizar cache busting en `index.html` y `admin.html` si corresponde.

## No tocar

- No cambiar layout ni estructura HTML salvo cache busting minimo.
- No cambiar textos/copy.
- No cambiar JS funcional salvo que sea estrictamente necesario para cache/versionado.
- No cambiar backend/API.
- No tocar flujo de contacto, registro, login, servicios ni moderacion.
- No introducir redisenio profundo.

## Verificacion

- Pagina publica conserva el layout actual en desktop/mobile.
- Admin conserva tablas/listados/expedientes legibles.
- Contraste de botones y textos es suficiente.
- No hay overflow nuevo en mobile.
- `git diff --check -- index.html styles.css admin.html admin.css` OK.
- Si se toca JS, `node --check` OK para el archivo tocado.

## Handoff esperado

Crear `tasks/TASK-232-HANDOFF.md` con:

- Resumen de cambios.
- Archivos tocados.
- Versiones/cache busting.
- Evidencia local desktop/mobile de pagina publica y admin.
- Riesgos.
- Recomendacion para QA `TASK-234`.
