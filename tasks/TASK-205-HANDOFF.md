# TASK-205: Web Dev - branding base aprobado y refresh panel empresa

## Equipo

Web Dev

## Estado

Completada local/estructuralmente.

## Resumen de implementacion

- Se implemento refresh visual acotado solo en el panel privado de empresas.
- Se agrego layout de panel con sidebar izquierdo en desktop y navegacion superior vertical en mobile.
- Se mantuvieron las vistas MVP:
  - `Mi empresa`
  - `Mis servicios`
- Se agregaron items futuros deshabilitados con `Proximamente`:
  - `Mensajes`
  - `Configuracion`
  - `Metricas`
  - `Planes`
  - `Reportes`
- Se mantuvieron los flujos existentes:
  - login sin sesion;
  - activacion por invite;
  - ver empresa publica;
  - crear/editar/desactivar servicios;
  - fotos del servicio;
  - elegir portada;
  - guardar y enviar.

## Archivos tocados

- `panel.html`
- `panel.css`
- `panel.js`
- `tasks/TASK-205-HANDOFF.md`

## Decisiones visuales tomadas

- Se uso una paleta local al panel: negro profundo, dorado y fondo claro calido.
- Se recreo un lockup temporal `PE / Punto Evento` en HTML/CSS para no depender del JPEG de referencia como asset productivo.
- Se uso el tagline aprobado: `Catalogo digital de proveedores para eventos`.
- Se uso `Georgia` para titulos/lockup y la fuente del sistema para UI/cuerpo, sin cargar fuentes externas.
- El bloque `Necesitas ayuda?` queda como bloque visual; no implementa mensajeria ni soporte nuevo.
- `Mi empresa` muestra datos existentes y una nota de que cambios generales se coordinan con Punto Evento en esta etapa.
- `Mis servicios` queda como vista operativa principal y conserva el formulario actual.
- En mobile la navegacion queda en una columna para evitar overflow y mantener visibles los items `Proximamente`.

## Versiones / cache busting

- `panel.html` carga `panel.css?v=9`.
- `panel.html` carga `panel.js?v=8`.
- `styles.css?v=20` se mantiene sin cambios desde el panel.

## Verificacion local

- `node --check panel.js`: OK.
- `git diff --check -- panel.html panel.css panel.js`: OK.
- Servidor local: `http://127.0.0.1:60004/panel.html?demo=local`.
- Playwright desktop `1440x900`:
  - `Mis servicios` carga como vista activa.
  - Sidebar visible de `280px`.
  - 5 items futuros estan deshabilitados y muestran `Proximamente`.
  - Bloque de ayuda es visual (`SPAN`, no enlace funcional).
  - Sin overflow horizontal.
- Playwright navegacion:
  - `Mi empresa` cambia titulo y muestra la vista.
  - `Mis servicios` vuelve a la vista operativa.
  - `Cargar servicio` abre formulario y enfoca `name`.
  - Guardar servicio demo muestra `Tu informacion fue recibida.`.
  - `Desactivar` en demo deja estado `Inactivo` y mensaje `Servicio demo desactivado.`.
- Playwright auth:
  - Sin sesion: login visible, logout oculto.
  - Con `?invite=abc`: activacion visible y token cargado.
- Playwright mobile `390x844`:
  - 5 items `Proximamente` visibles/deshabilitados.
  - Sin overflow horizontal.

## Riesgos

- El logo es temporal en HTML/CSS; debe reemplazarse cuando exista asset final limpio.
- El bloque de ayuda es visual y no resuelve soporte real; si Product quiere contacto operativo, debe abrirse tarea separada.
- El refresh no cambia contratos ni datos; QA debe validar con sesion real en Azure que uploads y guardar/enviar sigan funcionando contra API real.
- El panel usa tokens locales en `panel.css`; regresion publica/admin deberia ser baja, pero QA debe hacer smoke minimo porque `styles.css` sigue siendo compartido.

## Recomendacion para QA TASK-206

Validar en Azure con una empresa real o controlada:

- login recurrente;
- activacion por invite si hay token disponible;
- navegacion `Mi empresa` / `Mis servicios`;
- crear/editar/desactivar servicio;
- subir fotos, elegir `Portada` y `Guardar y enviar`;
- `Volver a la pagina publica` y `Cerrar sesion`;
- desktop y mobile sin overflow ni textos cortados;
- confirmar que publica y admin no cambiaron visualmente por este refresh.
