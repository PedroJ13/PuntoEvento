# TASK-226-HANDOFF: Logo final web Punto Evento CR

Equipo: Diseno UX  
Fecha: 2026-06-04  
Estado: completado

## Ruta del asset recomendado

Asset preparado:

```text
assets/images/logo-punto-evento-cr-panel.png
```

Origen revisado:

```text
Reference Images/Logo.jpeg
```

Dimensiones del asset final:

```text
1218 x 940 px
```

## Decision

Decision MVP: usar version PNG con fondo solido integrado al fondo calido del panel.

No recomiendo intentar transparencia real para esta ronda, porque el archivo fuente es `.jpeg` y trae el patron de transparencia falso quemado dentro de la imagen. Una eliminacion agresiva de fondo podria dañar sombras, detalles finos del monograma, estrellas, texto y acentos dorados.

El PNG preparado reemplaza el patron falso por un fondo solido calido:

```text
#f8f5ef
```

Ese color coincide con la direccion visual del panel premium y evita que el logo se vea montado sobre un tablero de transparencia.

## Recomendaciones de uso en panel

Para `TASK-227`, Web Dev deberia usar:

```text
assets/images/logo-punto-evento-cr-panel.png
```

Uso recomendado:

- Ubicarlo en el sidebar del panel empresa.
- Mostrarlo sobre fondo igual o muy cercano a `#f8f5ef`.
- Evitar ponerlo dentro de una tarjeta blanca pura, porque el fondo del asset podria volver a notarse.
- Usar `object-fit: contain`.
- No recortar el logo desde CSS.
- No aplicar filtros, drop-shadows adicionales ni blend modes.
- Mantener alt text:

```text
Punto Evento CR
```

Tamanos sugeridos:

- Sidebar desktop: ancho visual entre `180px` y `220px`.
- Header/mobile compacto: ancho visual entre `132px` y `168px`.
- Si el tagline queda ilegible en mobile, mantener el asset como marca visual y reforzar el texto accesible con `alt="Punto Evento CR"`.

CSS sugerido:

```css
.panel-logo img {
  width: min(220px, 100%);
  height: auto;
  object-fit: contain;
  display: block;
}
```

Fondo recomendado para el contenedor del logo:

```css
.panel-sidebar,
.panel-logo {
  background: #f8f5ef;
}
```

## Verificacion UX

Revisado visualmente:

- El asset ya no muestra el patron falso de transparencia.
- La marca `Punto Evento CR` se mantiene legible en tamano mediano.
- El tagline se conserva, aunque puede ser pequeno en mobile.
- El fondo queda integrado con el fondo claro/calido recomendado para el panel.
- El asset queda en una ruta clara dentro del repo.

## Riesgos

- Sigue siendo un asset raster derivado de JPEG, no un logo vectorial final.
- Conserva pequenas sombras/artefactos propios del archivo fuente; aceptable para MVP, no ideal para marca definitiva.
- El fondo solido funciona bien solo si el contenedor usa fondo calido similar. Sobre blanco puro u otro color podria notarse el rectangulo.
- Si se necesita usar el logo sobre fondos variados, Product deberia pedir una version PNG con transparencia real desde diseño/fuente original o un SVG/vector.

## Recomendacion para Web Dev TASK-227

Implementar cambio acotado:

1. Reemplazar el logo actual del panel por:

```text
assets/images/logo-punto-evento-cr-panel.png
```

2. Asegurar que el contenedor del logo use fondo `#f8f5ef` o el mismo token calido del panel.
3. Mantener la marca visible `Punto Evento CR`.
4. No tocar pagina publica, admin, backend, auth, emails ni flujos de panel.
5. Validar desktop y mobile:
   - sin overflow en sidebar;
   - sin patron falso visible;
   - texto principal legible;
   - logout y botones superiores sin regresion.

## Siguiente tarea sugerida

Continuar con `TASK-227` Web Dev para integrar este asset en el panel empresa.
