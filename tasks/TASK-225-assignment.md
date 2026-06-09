# TASK-225: QA - revalidar Azure fix visual final panel empresa

## Equipo asignado

QA.

## Contexto

`TASK-216` no pudo aprobar porque `TASK-215` no desplego. Despues de `TASK-224`, Azure debe servir el fix visual final del panel empresa y el P1 de logout corregido.

## Tarea

Revalidar en Azure real el fix visual final del panel empresa.

## Alcance

1. Confirmar assets/versiones nuevas servidas por Azure segun `TASK-224-HANDOFF.md`.
2. Validar logout:
   - click real sobre icon button;
   - click sobre SVG/path interno;
   - accion esperada ejecutada.
3. Validar `Volver a la pagina publica`.
4. Validar visual desktop:
   - sidebar sin overflow;
   - item activo contenido;
   - badges `Proximamente` contenidos;
   - `Contactanos` contenido;
   - logo integrado;
   - icon buttons accesibles.
5. Validar mobile `390x844` sin overflow.
6. Regresion minima:
   - pagina publica carga;
   - panel carga;
   - admin carga;
   - `/api/public/services?limit=1` responde.
7. Clasificar hallazgos P0/P1/P2/P3.

## No tocar

- No modificar datos reales fuera de entidades QA controladas.
- No publicar secretos, tokens ni credenciales.
- No declarar go comercial nuevo; entregar recomendacion para Product / Architect / Release.

## Verificacion

- Evidencia Azure desktop/mobile.
- Versiones/assets observados.
- Resultado final: aprobado, aprobado con observaciones o no aprobado.

## Handoff esperado

Crear `tasks/TASK-225-HANDOFF.md` con:

- Resultado por superficie.
- Evidencia resumida.
- Bugs clasificados.
- Recomendacion para Product / Architect / Release.
