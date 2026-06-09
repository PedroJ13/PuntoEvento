# TASK-214: QA - validar fix de overflow sidebar panel empresa

## Equipo asignado

QA.

## Contexto

Web Dev debe corregir en `TASK-213` el overflow visual del sidebar izquierdo del panel empresa y, en la misma pasada, convertir los botones superiores a icon buttons e integrar mejor el fondo del logo.

## Tarea

Validar local/estructuralmente que el sidebar queda contenido, que los botones superiores funcionan como icon buttons y que el logo no se ve montado por diferencia de fondo.

## Alcance

1. Revisar `tasks/TASK-213-HANDOFF.md`.
2. Validar sidebar en desktop:
   - viewport similar a captura alta/estrecha si es posible;
   - `1440x900`;
   - sin overflow horizontal;
   - item activo `Mis servicios` no invade el contenido principal;
   - badges `Proximamente` contenidos;
   - boton `Contactanos` contenido.
3. Validar sidebar en mobile:
   - `390x844` o equivalente;
   - sin overflow horizontal;
   - menu usable;
   - badges y botones sin textos cortados.
4. Validar botones superiores:
   - `Volver a la pagina publica` se presenta como icon button;
   - `Cerrar sesion` se presenta como icon button;
   - ambos tienen nombre accesible (`aria-label`, `title` o equivalente);
   - ambos mantienen accion esperada.
5. Validar logo:
   - no se percibe como rectangulo montado por diferencia de color de fondo;
   - mantiene proporcion;
   - no se corta ni pixeliza de forma notoria.
6. Regresion minima panel:
   - `Mi empresa`;
   - `Mis servicios`;
   - items futuros deshabilitados;
   - selector multiple `Tipos de evento` sigue presente;
   - logo visible.
7. Clasificar hallazgos P0/P1/P2/P3.

## No tocar

- No modificar codigo.
- No publicar secretos, tokens ni credenciales.
- No modificar datos reales fuera de entidades QA controladas.
- No aprobar deploy si hay overflow visible en sidebar, botones superiores sin accion/nombre accesible o logo claramente montado.

## Verificacion

- Evidencia desktop/mobile.
- Versiones/assets observados.
- Resultado final: aprobado, aprobado con observaciones o no aprobado.

## Handoff esperado

Crear `tasks/TASK-214-HANDOFF.md` con:

- Resultado por viewport.
- Evidencia resumida.
- Bugs clasificados.
- Riesgos aceptables.
- Recomendacion para Infra Azure `TASK-215` si aprueba.
