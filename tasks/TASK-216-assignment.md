# TASK-216: QA - revalidar fix overflow sidebar panel empresa en Azure

## Equipo asignado

QA.

## Contexto

Despues de `TASK-215`, Azure debe servir el fix visual del panel empresa: sidebar contenido, botones superiores como icon buttons y logo integrado con el fondo.

## Tarea

Revalidar en Azure real que el sidebar ya no tiene textos, badges ni botones saliendose del panel izquierdo, y que los pulidos visuales adicionales siguen funcionando.

## Alcance

1. Confirmar assets/versiones nuevas servidas por Azure segun `TASK-215-HANDOFF.md`.
2. Validar desktop:
   - viewport similar a captura alta/estrecha;
   - `1440x900`;
   - sin overflow horizontal;
   - item activo `Mis servicios` contenido;
   - badges `Proximamente` contenidos;
   - boton `Contactanos` contenido.
3. Validar mobile:
   - `390x844`;
   - sin overflow horizontal;
   - menu legible y contenido.
4. Validar botones superiores:
   - `Volver a la pagina publica` como icon button;
   - `Cerrar sesion` como icon button;
   - ambos con nombre accesible;
   - ambos mantienen accion esperada.
5. Validar logo:
   - fondo integrado con el panel;
   - sin rectangulo montado evidente;
   - proporcion correcta en desktop/mobile.
6. Regresion minima:
   - login recurrente o modo disponible;
   - `Mi empresa`;
   - `Mis servicios`;
   - selector multiple `Tipos de evento`;
   - pagina publica carga;
   - admin interno carga.
7. Clasificar hallazgos P0/P1/P2/P3.

## No tocar

- No modificar datos reales fuera de entidades QA controladas.
- No publicar secretos, tokens ni credenciales.
- No declarar go comercial nuevo; entregar recomendacion para Product / Architect / Release.

## Verificacion

- Evidencia desktop/mobile.
- Versiones/assets observados.
- Resultado final: aprobado, aprobado con observaciones o no aprobado.

## Handoff esperado

Crear `tasks/TASK-216-HANDOFF.md` con:

- Resultado por viewport.
- Evidencia resumida.
- Bugs clasificados.
- Riesgos aceptables.
- Recomendacion para Product / Architect / Release.
