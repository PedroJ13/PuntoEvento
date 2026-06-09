# TASK-228: QA - validar nuevo logo Punto Evento CR local/estructural

## Equipo asignado

QA.

## Contexto

`TASK-227` debe actualizar el panel empresa para usar el nuevo logo `Punto Evento CR`, con fondo integrado y sin patron de transparencia falso.

## Tarea

Validar local/estructuralmente que el nuevo logo se ve correcto y no rompe el panel empresa.

## Alcance

1. Revisar:
   - `tasks/TASK-226-HANDOFF.md`;
   - `tasks/TASK-227-HANDOFF.md`.
2. Validar visual:
   - logo nuevo visible;
   - texto `Punto Evento CR` legible;
   - sin patron de transparencia falso;
   - sin rectangulo/fondo montado;
   - proporcion correcta.
3. Validar responsive:
   - desktop `1440x900`;
   - desktop estrecho `1024x900`;
   - mobile `390x844`;
   - sin overflow horizontal.
4. Regresion minima panel:
   - `Mi empresa`;
   - `Mis servicios`;
   - icon buttons superiores;
   - logout;
   - `Volver a la pagina publica`.
5. Clasificar hallazgos P0/P1/P2/P3.

## No tocar

- No modificar codigo.
- No publicar secretos, tokens ni credenciales.
- No aprobar deploy si el logo se ve montado o con fondo falso evidente.

## Verificacion

- Evidencia visual local desktop/mobile.
- Versiones/assets observados.
- Resultado final: aprobado, aprobado con observaciones o no aprobado.

## Handoff esperado

Crear `tasks/TASK-228-HANDOFF.md` con:

- Resultado por viewport.
- Evidencia resumida.
- Bugs clasificados.
- Riesgos aceptables.
- Recomendacion para Infra Azure `TASK-229` si aprueba.
