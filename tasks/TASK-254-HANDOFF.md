# TASK-254-HANDOFF: Definicion mobile panel empresa y ficha publica

## Resumen UX

Los dos P2 mobile reportados por QA tienen la misma raiz: el primer viewport queda ocupado por elementos de contexto y retrasa la accion principal. Para MVP conviene hacer un ajuste acotado de jerarquia mobile, sin redisenar desktop ni cambiar contratos: en panel, convertir el sidebar mobile en una cabecera compacta; en ficha publica, adelantar identidad/CTA y limitar el alto inicial de la galeria.

## Pantallas/rutas revisadas

- `panel.html` / `panel.css`: panel empresa, sidebar, navegacion y primer viewport de login/contenido operativo.
- `app.js` / `styles.css`: ficha publica de proveedor, bloque `provider-hero`, galeria, resumen del proveedor y CTA de cotizacion.

## Decision panel mobile

En mobile, el sidebar no debe comportarse como una columna completa apilada. Debe funcionar como una cabecera compacta de panel:

- Mantener el logo, pero reducir su peso visual: maximo recomendado `132px-150px` de ancho o `48px-56px` de alto visible.
- Mostrar solo navegacion operativa MVP en el primer nivel: `Mi empresa` y `Mis servicios`.
- Ocultar en mobile los items deshabilitados `Proximamente` (`Mensajes`, `Configuracion`, `Metricas`, `Planes`, `Reportes`) para no consumir viewport con acciones no disponibles.
- Presentar `Mi empresa` / `Mis servicios` como dos tabs o botones compactos en una fila de dos columnas. Si el ancho es menor, permitir scroll horizontal, pero evitar lista vertical larga.
- Mantener accesibles las acciones superiores actuales con iconos y `title`/`aria-label`: volver a pagina publica y cerrar sesion.
- Ocultar el bloque de ayuda del sidebar en mobile, como ya apunta el CSS actual.

Criterio visual: en 390x844, la cabecera del panel no deberia superar aproximadamente `140px-170px` antes de que aparezca el login o el contenido operativo.

## Decision ficha publica mobile

En mobile, la identidad del proveedor y el CTA deben aparecer antes de que la galeria domine la pantalla. La ficha no necesita un redisenio profundo; basta con ajustar orden y alto:

- Mostrar identidad primero en mobile: nombre del proveedor, categoria/servicio destacado, ubicacion o rango de precio si ya existe en datos, y CTA principal `Solicitar cotizacion`.
- Reordenar solo en mobile para que `provider-summary` aparezca antes de la galeria, o agregar una version compacta mobile del resumen antes del carrusel si Web Dev lo considera mas simple.
- Reducir el alto inicial de `.carousel-image` en mobile de `340px` a un rango aproximado `240px-280px`, idealmente con limite responsive tipo `min(42vh, 280px)`.
- Mantener thumbs y controles, pero compactarlos: thumbs de `56px-64px` o scroll horizontal si hay muchas imagenes.
- No recomendar overlay como primera opcion MVP: puede afectar legibilidad, accesibilidad y QA en imagenes con fondos variados.

Criterio visual: en 390x844, nombre del proveedor y CTA principal deben verse sin scroll, o con un scroll minimo menor a media pantalla. La galeria no debe ocupar mas de aproximadamente la mitad del primer viewport.

## Reglas visuales minimas

- Mantener paleta actual: fondo calido, tinta oscura y acento dorado.
- No cambiar desktop salvo regresion necesaria por CSS responsive.
- No introducir nueva navegacion compleja, drawer o menu hamburguesa para MVP.
- No duplicar CTAs con textos distintos; si hay CTA repetido, debe tener el mismo label y abrir el mismo flujo.
- Preservar tamanos tactiles: botones/tabs de minimo `44px` de alto.
- Evitar texto cortado en tabs, botones y CTA; si no cabe, usar dos columnas o scroll horizontal.
- Mantener `aria-label`/`title` en botones iconograficos del panel.

## Criterios de aceptacion para Web Dev / QA

- Mobile `390x844`: panel empresa muestra logo compacto, dos accesos operativos y login/contenido en el primer viewport.
- Mobile `390x844`: panel empresa no muestra items `Proximamente` apilados en el primer viewport.
- Mobile `390x844`: ficha publica muestra identidad del proveedor y CTA antes de una galeria extensa.
- Mobile `390x844`: galeria de ficha publica queda entre `240px` y `280px` aprox. o no supera `42vh-45vh`.
- Desktop: sidebar del panel y ficha publica mantienen su layout actual.
- No hay overflow horizontal en panel ni ficha publica.
- CTA de cotizacion sigue abriendo el flujo actual y no cambia contrato de datos/API.

## Riesgos si no se corrige

- Empresas nuevas pueden creer que el panel mobile esta bloqueado o que deben navegar demasiado antes de iniciar sesion/cargar servicios.
- Usuarios publicos pueden ver fotos sin entender rapidamente quien ofrece el servicio ni como cotizar.
- La percepcion premium baja en mobile por exceso de friccion inicial, aunque el estilo visual general sea correcto.

## Recomendacion de tareas Web Dev siguientes

1. Crear una tarea CSS/HTML para compactar `panel-sidebar` en mobile: logo menor, tabs operativos en fila y ocultar items disabled en `max-width: 820px`.
2. Crear una tarea CSS/HTML para ficha publica mobile: reordenar `provider-summary` antes de `provider-carousel` y reducir alto de `.carousel-image` en `max-width: 680px`.
3. Pedir QA Visual posterior en `390x844` y desktop para confirmar que no hubo regresion de layout.

## Decisiones Product / Architect / Release

- Confirmar que ocultar items `Proximamente` en mobile es aceptable para MVP.
- Confirmar si el CTA temprano en ficha debe ser solo `Solicitar cotizacion` o si tambien debe aparecer telefono/WhatsApp cuando exista en datos futuros.

## Post-MVP

- Evaluar una navegacion mobile colapsable mas completa para el panel cuando existan mensajes, metricas, planes y reportes reales.
- Evaluar CTA sticky inferior en ficha publica si los datos de conversion muestran abandono antes de cotizar.
- Revisar variantes de ficha para proveedores con muchas fotos, video o paquetes destacados.
