# TASK-238: Web Dev - refresh visual pagina publica y ficha empresa

## Equipo

Web Dev

## Estado

Completada local/estructuralmente.

## Resumen de cambios

- Se integro el logo aprobado del panel empresa en el header publico.
- Se agrego `body.public-body` para aplicar tipografia premium solo a la pagina publica sin afectar admin.
- Se aplico serif `Georgia, "Times New Roman", serif` a titulos principales, metricas y precios destacados.
- Se refino el hero publico:
  - overlay mas sobrio;
  - buscador con radio `16px`, borde calido y sombra mas cuidada;
  - CTA principal oscuro conservado.
- Se elevaron visualmente stats, categorias, pasos, cards de servicios, paquetes, resultados y CTA bands con radios, sombras suaves, bordes calidos y acentos dorados.
- Se ajusto la ficha publica de empresa/proveedor:
  - galeria con radio `16px` y sombra suave;
  - flechas/contador con ink semitransparente;
  - summary card con radio `16px`, sombra sobria y titulo serif;
  - bloques de contenido/servicio destacado con superficie calida;
  - servicio seleccionado con borde dorado y fondo dorado suave.
- No se cambiaron busqueda, rutas, datos, API, contacto/WhatsApp/cotizacion, admin interno ni panel empresa.

## Archivos tocados

- `index.html`
- `styles.css`
- `tasks/TASK-238-HANDOFF.md`

## Asset de logo usado

- `assets/images/logo-punto-evento-cr-panel.png`

Alt text:

- `Punto Evento CR`

## Versiones / cache busting

- `index.html` sube `styles.css?v=22`.
- `app.js?v=28` se mantiene sin cambios.
- No se toca `admin.html`, `admin.css`, `panel.html`, `panel.css` ni backend/API.

## Evidencia local desktop/mobile

Checks estaticos:

- `git diff --check -- index.html styles.css app.js`: OK.
- `node --check app.js`: OK.

Playwright con servidor HTTP local embebido:

- Home desktop `1440x900`:
  - sin overflow horizontal;
  - logo `assets/images/logo-punto-evento-cr-panel.png`;
  - `alt`: `Punto Evento CR`;
  - logo renderizado `187x54`;
  - `h1` con `Georgia, "Times New Roman", serif`;
  - buscador con radio `16px`;
  - CTA principal `rgb(23, 25, 29)`.
- Home mobile `390x844`:
  - sin overflow horizontal;
  - logo renderizado `148x48`;
  - tipografia serif en `h1`;
  - buscador con radio `16px`.
- Resultados desktop `1440x900`:
  - ruta `#bodas`;
  - sin overflow horizontal;
  - logo renderizado `187x54`;
  - 12 cards renderizadas con datos demo/local.
- Resultados mobile `390x844`:
  - ruta `#bodas`;
  - sin overflow horizontal;
  - logo renderizado `148x48`;
  - cards/listado renderizados.
- Ficha publica desktop `1440x900`:
  - ruta `#proveedor`;
  - sin overflow horizontal;
  - titulo de ficha con serif;
  - summary card con radio `16px`;
  - CTA principal oscuro visible.
- Ficha publica mobile `390x844`:
  - ruta `#proveedor`;
  - sin overflow horizontal;
  - logo renderizado `148x48`;
  - titulo de ficha con serif;
  - summary card con radio `16px`.

Observacion:

- En servidor local embebido aparece `404` esperado de `/api/public/services` porque no corre Azure Functions. La pagina usa fallback demo como estaba previsto y no se detectaron errores JS del refresh.

## Riesgos

- El logo sigue siendo raster derivado de JPEG, no vector definitivo.
- El refresh aumenta algo el aire visual y el scroll mobile por radios/sombras/padding, aunque no se detecto overflow.
- `styles.css` es compartido por admin; por eso la serif se limito con `body.public-body`, pero QA debe hacer regresion visual rapida de admin/panel en tareas posteriores si el deploy combina cambios.
- La sensacion premium sigue dependiendo de imagenes demo/externas; no se agregaron assets nuevos.

## Pendientes

- QA local/estructural formal en `TASK-239`.
- Deploy posterior en `TASK-240` si QA aprueba.

## Recomendacion para QA TASK-239

Validar:

- Home publica desktop/mobile sin overflow.
- Header mantiene navegacion y muestra el logo aprobado del panel.
- Buscador del hero conserva campos y submit.
- `#bodas` conserva filtros, resultados, cards y CTAs.
- `#proveedor` conserva galeria, thumbs, summary, servicios publicados y CTAs.
- Drawer de contacto/cotizacion sigue abriendo desde home/resultados/ficha.
- Mobile `375-390px` sin logo cortado, botones aplastados ni textos desbordados.
- Confirmar que `index.html` sirve `styles.css?v=22`.
