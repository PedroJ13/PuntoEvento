# TASK-212: QA - revalidar ajustes finales panel empresa en Azure

## Equipo asignado

QA.

## Contexto

Despues de `TASK-211`, Azure debe servir los ajustes finales del panel empresa: seleccion multiple para `Tipos de evento`, logo/marca refinado e iconos simples en el menu lateral.

## Tarea

Revalidar en Azure real que los ajustes finales estan desplegados y que los flujos MVP del panel siguen funcionando.

## Alcance

1. Confirmar assets/versiones nuevas servidas por Azure segun `TASK-211-HANDOFF.md`.
2. Validar formulario de servicio en Azure:
   - `Categoria` seleccion unica;
   - `Tipos de evento` seleccion multiple;
   - crear servicio con multiples tipos;
   - editar servicio y confirmar preseleccion;
   - guardar/enviar conserva multiples tipos;
   - validacion bloquea si no hay tipo seleccionado.
3. Validar visual Azure:
   - logo/marca se ve limpio;
   - iconos del menu lateral son simples y alineados;
   - desktop y mobile sin overflow;
   - items `Proximamente` siguen deshabilitados.
4. Validar regresion minima:
   - login recurrente o activacion si hay token disponible;
   - `Mi empresa`;
   - `Mis servicios`;
   - upload/portada si el entorno lo permite;
   - `Volver a la pagina publica`;
   - `Cerrar sesion`;
   - pagina publica carga;
   - admin interno carga.
5. Clasificar hallazgos P0/P1/P2/P3.

## No tocar

- No modificar datos reales fuera de entidades QA controladas.
- No publicar secretos, tokens ni credenciales.
- No declarar go comercial nuevo; entregar recomendacion para Product / Architect / Release.

## Verificacion

- Evidencia desktop y mobile.
- Versiones/assets observados.
- Resultado final: aprobado, aprobado con observaciones o no aprobado.

## Handoff esperado

Crear `tasks/TASK-212-HANDOFF.md` con:

- Resultado por superficie.
- Evidencia resumida.
- Bugs clasificados.
- Riesgos aceptables.
- Recomendacion para Product / Architect / Release.
