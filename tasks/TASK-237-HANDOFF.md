# TASK-237-HANDOFF: Guia visual publica premium Punto Evento CR

Equipo: Diseno UX  
Fecha: 2026-06-04  
Estado: completado como guia, sin cambios de codigo

## Resumen UX

La pagina publica ya esta alineada en paleta con `Punto Evento CR`, pero todavia se siente mas funcional/marketplace que premium/editorial. La recomendacion es hacer un refresh visual acotado de home, resultados y ficha publica de empresa/proveedor, tomando como referencia el panel empresa: logo premium, tipografia serif para titulos, superficies calidas, acento dorado, CTAs oscuros y tarjetas mas cuidadas.

Este ajuste debe preservar:

- navegacion superior existente;
- busqueda publica;
- filtros;
- contacto/WhatsApp/cotizacion;
- rutas y hash navigation;
- estructura de datos y API;
- admin interno y panel empresa.

No es un redisenio funcional. Es una mejora visual para subir percepcion de marca antes de primeras empresas reales.

## Referencias revisadas

Referencias disponibles en repo:

- `Reference Images/Logo.jpeg`
- `Reference Images/Propeusta logo e imagen de pagina.jpeg`
- `Reference Images/Propuesta Panel de Empresas.jpeg`

Referencia de marca ya aprobada:

- `assets/images/logo-punto-evento-cr-panel.png`

Referencia de implementacion actual:

- `styles.css`
- `app.js`
- `index.html`

## Asset de logo a usar

Usar el mismo asset aprobado del panel empresa:

```text
assets/images/logo-punto-evento-cr-panel.png
```

Reglas:

- Reemplazar el lockup visual actual `PE + Punto Evento CR` solo si cabe dentro del header actual sin cambiar navegacion.
- No modificar el menu superior ni sus links.
- No redisenar el cintillo/header basado en las referencias; solo integrar el logo dentro del espacio de marca existente.
- Usar `object-fit: contain`.
- Mantener alt text:

```text
Punto Evento CR
```

Tamano recomendado:

- Header desktop: ancho visual `150px-190px`.
- Header mobile: ancho visual `118px-150px`.
- No usar altura mayor a `54px` en topbar para evitar que el header crezca demasiado.
- Si el logo completo vuelve ilegible el tagline en mobile, aceptar que el tagline funcione como detalle visual y reforzar accesibilidad con `alt`.

Fondo:

- Header/topbar debe mantenerse en fondo calido compatible:

```text
#fffdf8 o rgba(255, 253, 248, 0.94)
```

## Reglas tipograficas

Objetivo:

- Titulos mas editoriales/premium.
- Cuerpo y UI legibles, sin perder eficiencia de catalogo.
- No introducir fuentes externas si no son necesarias.

Recomendacion MVP:

```css
font-family headings: Georgia, "Times New Roman", serif;
font-family body/UI: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
```

Aplicar serif a:

- `h1` hero;
- `h2` de secciones;
- titulos principales de ficha publica (`.provider-title`);
- nombres destacados de empresa/servicio si el tamaño lo permite.

Mantener sans en:

- nav;
- labels;
- botones;
- inputs/selects;
- badges;
- cards pequeñas;
- metadata.

Escala sugerida:

- Hero H1 desktop: `clamp(3rem, 6vw, 6rem)`, line-height `0.94-1`.
- Hero H1 mobile: `2.65rem-3.2rem`, line-height `1.02`.
- Section H2: `clamp(2rem, 3.5vw, 3.3rem)`.
- Provider title: `clamp(2.3rem, 4vw, 4.5rem)`.
- Card H3: mantener `1.08rem-1.25rem`, sans o serif suave segun legibilidad.

Notas:

- No usar letter spacing negativo.
- Eyebrows pueden conservar uppercase con dorado oscuro.
- Reducir exceso de peso `850/900` en textos secundarios si se ve pesado.

## Tratamiento de hero publico

Mantener el flujo actual:

- hero full width;
- buscador dentro del hero;
- campos `Servicio o empresa`, `Tipo de evento`, `Ubicacion`;
- CTA `Encontrar proveedores`.

Mejoras visuales permitidas:

- Usar una imagen principal mas premium/aspiracional si Product/Web Dev tiene una mejor disponible.
- Mantener imagen full-bleed con overlay oscuro elegante.
- Aumentar sensacion editorial con serif en H1.
- Hacer search panel mas refinado:
  - fondo `rgba(255, 253, 248, 0.96)`;
  - borde `rgba(228, 218, 203, 0.9)`;
  - radio `12px-16px`;
  - sombra suave;
  - inputs con borde `--brand-line`.

Overlay recomendado:

```css
linear-gradient(90deg, rgba(23, 25, 29, 0.78), rgba(23, 25, 29, 0.24))
```

Evitar:

- overlay dorado fuerte;
- imagen demasiado oscura o borrosa;
- cambiar flujo de busqueda;
- mover el buscador fuera del hero;
- agregar nueva seccion funcional.

Copy actual puede mantenerse. Si Web Dev toca copy solo por ajuste visual, sugerencia:

```text
Encuentra proveedores y paquetes para tu evento
Compara salones, catering, musica, decoracion y servicios publicados por empresas revisadas en Costa Rica.
```

No es obligatorio cambiar copy en esta tarea.

## Home / pagina publica principal

### Stats / trust strip

Mantener `trust-strip` como estructura.

Mejora visual:

- Cards con radio `12px-16px`.
- Fondo `--brand-surface`.
- Borde `--brand-line`.
- Numeros en serif y `--brand-gold-dark`.
- Texto secundario en `--brand-muted`.
- Sombra mas ligera que la actual, premium sobrio.

Riesgo:

- Si los numeros no son verificables, Product deberia ajustar copy en tarea separada. Este refresh no debe cambiar contenido funcional.

### Categorias / atajos

Mantener grid actual.

Mejora visual:

- Cards con imagen mas limpia, radio `14px-16px`.
- Overlay mas suave pero legible.
- Texto categoria en blanco con sombra sutil.
- Hover sobrio: escala menor `1.02`, no movimiento excesivo.

No cambiar hrefs ni categorias.

### Flujo de conversion

Mantener tres pasos.

Mejora visual:

- Convertir borde izquierdo duro a detalle mas premium:
  - borde dorado/ink fino;
  - numero en serif o gold-dark;
  - card con fondo `--brand-surface`.
- No agregar pasos nuevos.

### Cards de servicios / resultados destacados

Mantener estructura y acciones.

Mejora visual:

- Radio `12px-16px`.
- Imagen con aspect ratio estable.
- Borde `--brand-line`.
- Sombra muy suave.
- Badges con estados claros:
  - `Servicio publicado`: success suave.
  - plan/destacado/precio: gold suave.
- Precio o `priceFrom`: `--brand-gold-dark` o `--brand-ink`, no dorado claro.
- CTA principal oscuro, CTA secundaria gold-soft/ghost.

No convertir esta tarea en rediseño de cards ni cambios de orden de datos.

### Seccion paquetes/precios

Mantener si existe.

Mejora visual:

- Titulos serif.
- Imagen stack con radio `16px`.
- Cards de paquetes con mas aire.
- Precio en serif/gold-dark.

No cambiar logica de paquetes ni datos demo/API.

## Ficha publica de empresa/proveedor

Objetivo:

La ficha debe sentirse como perfil curado de una empresa, no solo detalle tecnico de resultado.

### Galeria

Mantener carrusel actual.

Mejora visual:

- Radio `14px-18px`.
- Fondo placeholder `--brand-surface-muted`.
- Contador con fondo `rgba(23, 25, 29, 0.72)`.
- Flechas con fondo ink semitransparente.
- Thumb activo con borde `--brand-gold`.
- No cambiar interaccion del carrusel.

### Card de empresa / summary

Mantener sticky summary.

Mejora visual:

- Fondo `--brand-surface`.
- Radio `16px`.
- Borde `--brand-line`.
- Sombra sobria.
- Nombre de empresa en serif.
- Precio destacado en gold-dark.
- Badges con jerarquia clara.
- CTAs:
  - principal `Contactar` / `Cotizar servicio`: fondo `--brand-ink`.
  - secundario `Ver mas servicios`: gold-soft o ghost.

No ocultar datos importantes por estetica.

### Servicio destacado

Mantener servicio seleccionado destacado.

Mejora visual:

- `service-option.is-selected` con borde dorado y fondo gold-soft muy suave.
- Titulo de servicio con mas jerarquia.
- Lista de beneficios/checks con icono success discreto.
- Mantener otros servicios visibles.

### Datos clave

Mantener:

- categoria;
- precio;
- ubicacion;
- cantidad de servicios;
- revision/publicacion.

Tratamiento:

- Mostrar en mini-cards o lista limpia solo si no cambia estructura funcional.
- Iconos opcionales, pero no obligatorios.
- No agregar datos no disponibles.

### Lista de servicios publicados

Mantener lista actual.

Mejora visual:

- Cards con fondo `--brand-surface`.
- Servicio seleccionado claramente marcado.
- Boton `Ver servicio` no debe competir con CTA principal.
- Evitar que texto largo rompa layout mobile.

## Continuacion de pagina publica

Aplica a secciones debajo del hero:

- alternar bandas `--brand-bg`, `--brand-surface-muted` y `--brand-surface`;
- mantener ancho maximo actual;
- usar mas aire vertical, pero sin cambiar contenido;
- evitar orbes, blobs, gradientes decorativos pesados;
- decoracion permitida: lineas finas doradas, separadores sutiles, sombras suaves.

## Cambios permitidos

Permitido para `TASK-238`:

- Actualizar `styles.css`.
- Ajustar markup minimo en `index.html` solo para integrar logo asset en `.brand`, sin cambiar nav.
- Ajustar clases/markup generado en `app.js` solo si hace falta para:
  - logo;
  - wrappers visuales;
  - clases de cards;
  - no para cambiar flujo/datos.
- Usar `assets/images/logo-punto-evento-cr-panel.png`.
- Cambiar tipografia CSS de headings.
- Ajustar radios, sombras, bordes, overlays, fondos, spacing visual.
- Mantener cache busting en archivos tocados.

## Cambios excluidos

No tocar:

- navegacion superior/cintillo como estructura;
- admin interno;
- panel empresa;
- backend/API;
- emails;
- rutas;
- busqueda/filtros;
- comportamiento de contacto/WhatsApp/email;
- registro de empresas;
- estados/moderacion;
- nuevas secciones funcionales;
- pagos, planes reales, metricas o reportes.

No hacer:

- redisenio completo de pagina publica;
- cambiar jerarquia de producto `Empresa -> Servicios`;
- ocultar resultados por servicio;
- convertir la ficha publica en landing page independiente sin servicios visibles.

## Riesgos

- Logo completo en header puede ocupar mucho espacio en mobile; usar ancho controlado y no crecer topbar.
- Tipografia serif puede romper line-height si se aplica a labels/botones; limitar a titulos.
- Hero con overlay insuficiente puede bajar legibilidad del buscador.
- Cards mas grandes pueden aumentar scroll mobile; mantener densidad razonable.
- Si se cambian clases/markup de `app.js`, QA debe revisar rutas `#inicio`, `#bodas`, `#proveedor` y drawer de contacto.
- Imagenes externas/demo pueden seguir limitando sensacion premium aunque mejore CSS.

## Recomendacion para Web Dev TASK-238

Implementar refresh visual acotado:

1. Integrar `assets/images/logo-punto-evento-cr-panel.png` en la marca del header publico sin cambiar nav.
2. Aplicar serif `Georgia, "Times New Roman", serif` a titulos principales.
3. Refinar hero:
   - overlay;
   - search panel;
   - espaciado;
   - legibilidad.
4. Elevar cards de stats, categorias, pasos, servicios y paquetes con radio/sombra/borde premium.
5. Elevar ficha publica:
   - galeria;
   - summary card;
   - servicio destacado;
   - CTAs;
   - lista de servicios.
6. Mantener flujos y datos intactos.
7. Validar responsive 375px, tablet y desktop.
8. Revisar que no haya overflow de logo/topbar.

## Criterios UX de aceptacion

- La pagina publica se siente visualmente alineada al panel empresa.
- El logo `Punto Evento CR` se ve integrado y no rompe el header.
- El hero es legible y mas premium sin cambiar el buscador.
- Cards y ficha publica tienen acabado mas curado.
- Servicios siguen siendo el centro de busqueda y perfil.
- Mobile no tiene textos cortados, botones aplastados ni overflow horizontal.

## Siguiente tarea sugerida

Continuar con:

```text
TASK-238 Web Dev: aplicar refresh visual publico acotado segun esta guia.
```
