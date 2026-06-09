# TASK-213: Web Dev - corregir overflow del sidebar panel empresa

## Equipo

Web Dev

## Estado

Completada local/estructuralmente.

## Resumen de cambios

- Se corrigio el layout interno del sidebar del panel empresa para evitar overflow de items y badges.
- Los items de menu ahora usan grid interno con columna flexible y badge fijo.
- Se redujeron moderadamente padding, fuente y badge `Proximamente` para que quepan dentro del sidebar sin agrandar demasiado el panel.
- `Contactanos` ahora queda contenido al 100% de la tarjeta de ayuda.
- Los botones superiores `Volver a la pagina publica` y `Cerrar sesion` se convirtieron en botones de icono.
- Los botones superiores mantienen `aria-label`, `title`, hover y focus visible.
- El logo JPEG actual se integro mejor con el fondo usando recorte circular, `mix-blend-mode: multiply`, opacidad suave y mascara radial para evitar el rectangulo montado.
- No se tocaron flujos de servicios, auth, uploads, selector multiple, API, pagina publica ni admin.

## Archivos tocados

- `panel.html`
- `panel.css`
- `tasks/TASK-213-HANDOFF.md`

## Versiones / cache busting

- `panel.html` carga `panel.css?v=11`.
- `panel.html` mantiene `panel.js?v=9`.
- `styles.css?v=20` se mantiene sin cambios.

## Evidencia visual local

Servidor local usado:

- `http://127.0.0.1:60006/panel.html?demo=local`

Checks estaticos:

- `node --check panel.js`: OK.
- `git diff --check -- panel.html panel.css panel.js`: OK.

Playwright desktop `1440x900`:

- Sin overflow horizontal.
- Sidebar `280px`.
- Items `Mi empresa`, `Mis servicios`, `Mensajes`, `Configuracion`, `Metricas`, `Planes`, `Reportes` contenidos.
- Badges `Proximamente` contenidos dentro de cada item.
- `Contactanos` contenido dentro de la tarjeta de ayuda.
- Logo `164x164`, circular, con mascara radial.
- Botones superiores son icon buttons `46x46`, con SVG, `aria-label` y `title`.

Playwright desktop estrecho `1024x900`:

- Sin overflow horizontal.
- Sidebar `240px`.
- Todos los items y badges siguen contenidos.
- `Contactanos` sigue contenido.
- Botones superiores siguen siendo icon buttons `46x46`.

Playwright mobile `390x844`:

- Sin overflow horizontal.
- Todos los items y badges siguen contenidos.
- Logo `188x188`, circular, con mascara radial.
- Botones superiores siguen siendo icon buttons `46x46`.

Flujos smoke:

- `Mi empresa` navega y muestra la vista.
- `Mis servicios` navega y muestra la vista.
- `Cargar servicio` abre formulario.
- `Tipos de evento` sigue siendo selector multiple.
- Items futuros siguen deshabilitados.

## Riesgos

- El logo sigue siendo un JPEG de referencia; el tratamiento CSS disimula el fondo, pero lo ideal sigue siendo reemplazarlo por un asset final con transparencia.
- En navegadores sin soporte completo de `mask-image`, el logo conservara `mix-blend-mode: multiply` y borde circular, pero podria verse menos integrado.
- Los botones superiores ahora son icon-only; QA debe confirmar que el `title`/nombre accesible sea suficiente para Product.

## Recomendacion para QA TASK-214

Validar local/estructuralmente:

- Sidebar en desktop ancho y desktop estrecho.
- Mobile `390x844` sin overflow horizontal.
- Badges `Proximamente` dentro del sidebar.
- `Contactanos` contenido en la tarjeta.
- Logo visualmente integrado con el fondo.
- Icon buttons superiores visibles y funcionales:
  - volver a pagina publica;
  - cerrar sesion.
- `Mi empresa`, `Mis servicios`, `Cargar servicio` y selector multiple sin regresion.
