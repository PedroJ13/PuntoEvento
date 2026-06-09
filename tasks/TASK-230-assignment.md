# TASK-230: QA - revalidar nuevo logo Punto Evento CR en Azure

## Equipo asignado

QA.

## Contexto

Despues de `TASK-229`, Azure debe servir el nuevo logo `Punto Evento CR` en el panel empresa.

## Tarea

Revalidar en Azure real que el nuevo logo aparece correctamente y que no hay regresiones visuales del panel.

## Alcance

1. Confirmar assets/versiones nuevas servidas por Azure segun `TASK-229-HANDOFF.md`.
2. Validar logo en Azure:
   - logo nuevo visible;
   - texto `Punto Evento CR` legible;
   - sin patron de transparencia falso;
   - sin rectangulo/fondo montado evidente;
   - proporcion correcta.
3. Validar responsive:
   - desktop `1440x900`;
   - desktop estrecho `1024x900`;
   - mobile `390x844`;
   - sin overflow horizontal.
4. Regresion minima:
   - panel carga;
   - `Mi empresa`;
   - `Mis servicios`;
   - icon buttons superiores;
   - logout;
   - pagina publica carga;
   - admin carga.
5. Clasificar hallazgos P0/P1/P2/P3.

## No tocar

- No modificar datos reales fuera de entidades QA controladas.
- No publicar secretos, tokens ni credenciales.
- No declarar go comercial nuevo; entregar recomendacion para Product / Architect / Release.

## Verificacion

- Evidencia Azure desktop/mobile.
- Versiones/assets observados.
- Resultado final: aprobado, aprobado con observaciones o no aprobado.

## Handoff esperado

Crear `tasks/TASK-230-HANDOFF.md` con:

- Resultado por viewport.
- Evidencia resumida.
- Bugs clasificados.
- Recomendacion para Product / Architect / Release.
