# TASK-226: Diseno UX - preparar logo final web Punto Evento CR

## Equipo asignado

Diseno UX.

## Contexto

Product agrego un nuevo logo en:

```text
Reference Images/Logo.jpeg
```

El logo ya incluye la marca `Punto Evento CR` y tagline. Visualmente es una mejora clara frente al JPEG anterior, pero al ser `.jpeg` el patron tipo transparencia queda dentro de la imagen. Para usarlo en el panel sin que se vea montado, se necesita preparar un asset web limpio.

## Tarea

Preparar recomendacion/asset final usable para web a partir de `Reference Images/Logo.jpeg`.

## Alcance

1. Revisar `Reference Images/Logo.jpeg`.
2. Definir la mejor salida para el MVP:
   - PNG/WebP con transparencia real, si es viable;
   - o version con fondo solido igual al fondo del panel;
   - o version recortada con tratamiento visual que evite mostrar el patron de transparencia falso.
3. Crear o recomendar el asset final dentro de una ubicacion clara del repo, por ejemplo:
   - `assets/logo-punto-evento-cr.png`;
   - o `assets/logo-punto-evento-cr.webp`.
4. Mantener proporcion, nitidez y legibilidad del texto `Punto Evento CR`.
5. Documentar si el asset queda listo o si Web Dev debe aplicar tratamiento CSS adicional.

## No tocar

- No modificar codigo del panel.
- No cambiar pagina publica, admin ni backend.
- No redisenar la marca completa.
- No cambiar colores globales salvo recomendacion puntual para integrar el logo.

## Verificacion

- El asset recomendado no muestra patron de transparencia falso.
- El logo se ve nitido en tamanos pequenos/medianos de panel.
- El fondo queda integrado con el fondo claro/calido del panel.
- El archivo final queda en ruta documentada.

## Handoff esperado

Crear `tasks/TASK-226-HANDOFF.md` con:

- Ruta del asset recomendado/final.
- Decision: transparencia real vs fondo solido vs tratamiento CSS.
- Recomendaciones de uso en panel.
- Riesgos.
- Recomendacion para Web Dev `TASK-227`.
