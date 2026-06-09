# TASK-210: QA - validar ajustes finales panel empresa local/estructural

## Equipo asignado

QA.

## Contexto

Web Dev debe completar `TASK-209` con tres ajustes finales del panel empresa: lista multiple para `Tipos de evento`, logo basado en referencia y iconos simples en menu lateral.

## Tarea

Validar local/estructuralmente que los ajustes del panel empresa funcionan y no rompen flujos MVP.

## Alcance

1. Revisar el handoff de `TASK-209`.
2. Validar formulario de servicio:
   - `Categoria` sigue siendo seleccion unica;
   - `Tipos de evento` se muestra como lista/select de seleccion multiple;
   - permite seleccionar varios tipos;
   - crear servicio conserva multiples tipos;
   - editar servicio preselecciona multiples tipos existentes;
   - enviar a revision conserva multiples tipos;
   - validacion bloquea si no hay ningun tipo seleccionado.
3. Validar visual:
   - logo/marca visible y limpio;
   - imagen de referencia no se ve deformada o pixelada de forma notoria;
   - iconos del menu son simples, de linea blanca y alineados;
   - items `Proximamente` siguen deshabilitados.
4. Validar regresion minima:
   - login/activacion si el entorno lo permite;
   - `Mi empresa`;
   - `Mis servicios`;
   - upload/portada si el entorno lo permite;
   - `Volver a la pagina publica`;
   - `Cerrar sesion`;
   - pagina publica y admin cargan sin rotura visual obvia.
5. Clasificar hallazgos P0/P1/P2/P3.

## No tocar

- No modificar codigo.
- No modificar datos reales fuera de entidades QA controladas.
- No publicar secretos, tokens ni credenciales.
- No aprobar deploy; solo recomendar si procede.

## Verificacion

- Evidencia desktop y mobile.
- Versiones/assets observados.
- Resultado final: aprobado, aprobado con observaciones o no aprobado.

## Handoff esperado

Crear `tasks/TASK-210-HANDOFF.md` con:

- Resultado por punto validado.
- Evidencia resumida.
- Bugs clasificados.
- Riesgos aceptables.
- Recomendacion para Infra Azure `TASK-211` si aprueba.
