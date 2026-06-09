# TASK-213: Web Dev - corregir overflow del sidebar panel empresa

## Equipo asignado

Web Dev.

## Contexto

Product detecto un bug visual en Azure despues de `TASK-212`: en el sidebar izquierdo del panel empresa, algunos textos y badges se salen del panel visible.

Casos observados en captura:

- Item activo `Mis servicios` sobresale hacia el area principal.
- Badges `Proximamente` de items futuros se salen o quedan demasiado pegados al borde derecho.
- Boton `Contactanos` dentro del bloque de ayuda se corta/sobresale.
- El problema parece de ancho, padding, tipografia y/o `min-width` de elementos del sidebar.

Product tambien pidio incluir en esta misma pasada:

- convertir los botones superiores `Volver a la pagina publica` y `Cerrar sesion` en botones de icono, usando el mismo estilo de iconos simples del panel;
- integrar mejor la imagen del logo con el color de fondo del panel, porque se nota como una imagen montada por diferencia de color de fondo.

Este ajuste es acotado al panel empresa y debe mantener el estilo premium ya aprobado.

## Tarea

Corregir el layout del sidebar y pulir los controles visuales superiores del panel empresa sin cambiar flujos funcionales.

## Alcance

1. Ajustar CSS/markup solo donde sea necesario para el sidebar del panel empresa.
2. Asegurar que:
   - los items del menu respeten el ancho del sidebar;
   - `Mis servicios` no sobresalga hacia el contenido principal;
   - `Proximamente` quepa dentro del item o se reacomode sin overflow;
   - `Configuracion` y otros textos largos no empujen el badge fuera;
   - el boton `Contactanos` quede contenido en la tarjeta de ayuda;
   - el logo y la tarjeta de ayuda sigan alineados.
3. Puede reducirse moderadamente tamano de fuente, padding, gap o ancho de badges si hace falta.
4. Si el ancho actual del sidebar no alcanza, preferir ajustar layout interno antes de agrandar mucho el panel.
5. Convertir los botones superiores:
   - `Volver a la pagina publica`;
   - `Cerrar sesion`;
   en botones de icono del mismo estilo visual que los iconos del menu.
6. Mantener accesibilidad de esos botones:
   - `aria-label` o texto accesible equivalente;
   - tooltip o title si aplica;
   - estados hover/focus claros.
7. Integrar la imagen del logo con el fondo:
   - evitar que se vea como un rectangulo montado;
   - igualar el fondo del contenedor al fondo de la pagina/sidebar, o usar tratamiento CSS/asset que disimule la diferencia;
   - mantener proporcion y nitidez.
8. Mantener mobile responsive sin overflow horizontal.
9. Actualizar cache busting de `panel.css` / `panel.js` si corresponde.

## No tocar

- No cambiar backend/API.
- No cambiar auth, uploads, emails, moderacion ni modelo de datos.
- No redisenar pagina publica.
- No redisenar admin interno.
- No cambiar el flujo de servicios ni el selector multiple de `Tipos de evento`.
- No cambiar el significado de `Volver a la pagina publica` ni `Cerrar sesion`; solo su presentacion visual.
- No reemplazar el logo por una marca nueva; solo ajustar fondo/integracion visual del asset actual.

## Verificacion

- Desktop alto y estrecho similar a la captura: sidebar sin overflow.
- Desktop `1440x900`: sin overflow horizontal.
- Mobile `390x844`: sin overflow horizontal.
- Items `Mi empresa`, `Mis servicios`, `Mensajes`, `Configuracion`, `Metricas`, `Planes`, `Reportes` visibles y contenidos.
- Badges `Proximamente` contenidos.
- Boton `Contactanos` contenido.
- Botones superiores aparecen como icon buttons y siguen funcionando.
- Botones superiores tienen nombre accesible.
- Logo se integra con el fondo y no parece un bloque montado.
- `Mi empresa` y `Mis servicios` siguen navegando.
- Items futuros siguen deshabilitados.

## Handoff esperado

Crear `tasks/TASK-213-HANDOFF.md` con:

- Resumen de cambios.
- Archivos tocados.
- Versiones/cache busting.
- Evidencia visual local desktop/mobile.
- Riesgos.
- Recomendacion para QA `TASK-214`.
