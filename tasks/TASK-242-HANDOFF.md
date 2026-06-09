# TASK-242: Web Dev - ajustes finales visuales pagina publica y ficha proveedor

## Equipo

Web Dev

## Estado

Completada local/estructuralmente.

## Resumen de cambios

- Se removieron del nav publico visible las opciones `Servicios` y `Proveedor`.
- Se mantuvieron visibles `Inicio`, `Buscar`, `Empresas` y el CTA `Publicar empresa`.
- Se aumento ligeramente el logo publico usando el mismo asset aprobado del panel empresa.
- Se compacto la escala visual de la home para que al 100% se perciba mas cercana al estado que Product veia al 80%-90%:
  - hero menos alto en desktop;
  - menor padding superior/inferior del hero;
  - H1/H2 publicos con `clamp()` mas contenido;
  - secciones con menos padding vertical;
  - trust strip menos desplazado.
- Se ajusto la ficha publica para nombres largos:
  - panel summary mas ancho en desktop (`minmax(360px, 420px)`);
  - `provider-title` con font-size mas contenido;
  - `line-height` aumentado;
  - `overflow-wrap: anywhere`;
  - `word-break: normal`;
  - `text-wrap: balance`.
- Se mantiene tipografia alineada con el panel empresa usando `Georgia, "Times New Roman", serif` para titulos publicos y ficha.
- No se tocaron `app.js`, backend/API, admin, panel empresa, rutas funcionales, datos, busqueda, contacto, WhatsApp, solicitud ni registro.

## Archivos tocados

- `index.html`
- `styles.css`
- `tasks/TASK-242-HANDOFF.md`

## Versiones / cache busting

- `index.html` sube `styles.css?v=23`.
- `app.js?v=28` se mantiene sin cambios.

## Opciones de nav removidas

Se removieron del header publico visible:

- `Servicios`
- `Proveedor`

No se eliminaron las rutas/hash internas `#bodas` ni `#proveedor`, porque siguen siendo necesarias para resultados, links internos y ficha publica.

## Como se resolvio el nombre largo

El problema se resolvio por CSS en `.provider-title` y `.provider-summary`:

- el panel derecho de ficha ahora permite hasta `420px` en desktop;
- el titulo baja de escala con `clamp(2.1rem, 3vw, 3.35rem)`;
- el line-height sube a `1.02`;
- `overflow-wrap: anywhere` permite cortes de emergencia sin desbordar;
- `word-break: normal` evita cortes agresivos innecesarios;
- `text-wrap: balance` mejora distribucion de lineas donde el navegador lo soporta.

En mobile se agrega regla especifica:

- `.public-body .provider-title { font-size: clamp(2.05rem, 10vw, 2.75rem); line-height: 1.04; }`

## Evidencia local desktop/mobile

Checks estaticos:

- `git diff --check -- index.html styles.css app.js`: OK.
- `node --check app.js`: OK.

Playwright con servidor HTTP local embebido:

- Home desktop `1440x900`:
  - sin overflow horizontal;
  - nav visible `Inicio|Buscar|Empresas`;
  - `Servicios` no aparece en nav;
  - `Proveedor` no aparece en nav;
  - logo renderizado `216x62`;
  - hero renderizado `647px`;
  - drawer de contacto abre.
- Home desktop `1920x1080`:
  - sin overflow horizontal;
  - logo renderizado `220x62`;
  - hero renderizado `681px`.
- Home mobile `390x844`:
  - sin overflow horizontal;
  - logo renderizado `168x54`;
  - nav visible `Inicio|Buscar|Empresas`;
  - drawer de contacto abre.
- Resultados `#bodas` desktop `1440x900`:
  - ruta carga;
  - sin overflow horizontal;
  - nav sin `Servicios` ni `Proveedor`;
  - drawer de contacto abre.
- Ficha `#proveedor` desktop `1440x900`:
  - ruta carga;
  - sin overflow horizontal;
  - prueba con nombre largo `Fatima Wedding Celebraciones y Producciones Premium Costa Rica`;
  - titulo queda dentro del summary;
  - summary width `420px`;
  - font `Georgia, "Times New Roman", serif`.
- Ficha `#proveedor` desktop `1920x1080`:
  - sin overflow horizontal;
  - nombre largo queda dentro del summary;
  - summary width `420px`.
- Ficha `#proveedor` mobile `390x844`:
  - sin overflow horizontal;
  - nombre largo queda dentro del summary;
  - summary width `362px`;
  - logo `168x54`.

Observacion:

- En servidor local embebido aparece `404` esperado de `/api/public/services` porque no corre Azure Functions. La pagina cae a datos demo como antes; no se detectaron errores JS de estos cambios.

## Riesgos

- El logo sigue siendo raster derivado de JPEG, no vector definitivo.
- Al remover `Servicios` y `Proveedor` del nav, el acceso visible queda por `Buscar`, categorias/cards y links internos; las rutas se preservan.
- `overflow-wrap: anywhere` puede cortar palabras muy largas sin espacios solo si es necesario para evitar overflow.
- El hero mobile sigue midiendo mas que el `min-height` porque el contenido/buscador determina altura; no genero overflow.

## Pendientes

- QA local/estructural formal en `TASK-245`.
- Deploy posterior en `TASK-246` si QA aprueba.

## Recomendacion para QA TASK-245

Validar:

- Header publico en `/`, `/#bodas` y `/#proveedor...` solo muestra `Inicio`, `Buscar`, `Empresas` y CTA.
- `Servicios` y `Proveedor` no aparecen como opciones del nav publico.
- Logo publico carga desde `assets/images/logo-punto-evento-cr-panel.png`, se ve mas grande y no corta en desktop/mobile.
- Home `1440x900`, `1920x1080` y mobile `390x844` sin overflow horizontal.
- `#bodas` sigue cargando filtros/resultados.
- Ficha publica con empresa de nombre largo, especialmente `Fatima Wedding`, no desborda ni invade CTAs/datos.
- Drawer de contacto/cotizacion abre desde home, resultados y ficha.
- Confirmar que `index.html` sirve `styles.css?v=23`.
