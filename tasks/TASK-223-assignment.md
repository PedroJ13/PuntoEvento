# TASK-223: QA - revalidar localmente P1 logout icon button

## Equipo asignado

QA.

## Contexto

`TASK-222` debe corregir el P1 detectado en `TASK-214`: click real sobre el icono de `Cerrar sesion` no ejecutaba logout.

## Tarea

Revalidar local/estructuralmente que el P1 queda cerrado y que el fix visual final del panel sigue correcto.

## Alcance

1. Revisar:
   - `tasks/TASK-214-HANDOFF.md`;
   - `tasks/TASK-222-HANDOFF.md`.
2. Validar logout:
   - click real sobre centro del boton;
   - click sobre SVG/path interno;
   - accion esperada ejecutada.
3. Validar `Volver a la pagina publica`.
4. Revalidar visual minimo de `TASK-213`:
   - sidebar sin overflow;
   - badges `Proximamente` contenidos;
   - `Contactanos` contenido;
   - logo integrado;
   - icon buttons accesibles.
5. Validar mobile `390x844` sin overflow.
6. Clasificar hallazgos P0/P1/P2/P3.

## No tocar

- No modificar codigo.
- No publicar secretos, tokens ni credenciales.
- No aprobar deploy si logout sigue fallando.

## Verificacion

- Evidencia local desktop/mobile.
- Resultado final: aprobado, aprobado con observaciones o no aprobado.

## Handoff esperado

Crear `tasks/TASK-223-HANDOFF.md` con:

- Resultado por punto.
- Evidencia resumida.
- Bugs clasificados.
- Recomendacion para Infra Azure `TASK-224` si aprueba.
