# TASK-219: QA - validar renombre a Punto Evento CR local/estructural

## Equipo asignado

QA.

## Contexto

`TASK-217` y `TASK-218` deben cambiar el nombre visible de marca a `Punto Evento CR` en frontend y backend/email copy.

## Tarea

Validar local/estructuralmente que el renombre esta aplicado sin romper flujos MVP.

## Alcance

1. Revisar:
   - `tasks/TASK-217-HANDOFF.md`;
   - `tasks/TASK-218-HANDOFF.md`.
2. Validar busqueda textual:
   - usos visibles esperados de marca deben decir `Punto Evento CR`;
   - usos remanentes de `Punto Evento` deben estar justificados, por ejemplo imagen raster pendiente o referencias historicas/docs.
3. Validar frontend local:
   - pagina publica;
   - panel empresa;
   - admin interno;
   - metadata/title/alt/aria relevantes.
4. Validar backend/email estructural:
   - asuntos/cuerpos/copy de emails usan `Punto Evento CR`;
   - no cambia el contrato funcional.
5. Regresion minima:
   - pagina publica carga;
   - panel empresa carga;
   - admin carga;
   - no hay errores JS obvios por el cambio.
6. Clasificar hallazgos P0/P1/P2/P3.

## No tocar

- No modificar codigo.
- No publicar secretos, tokens ni credenciales.
- No exigir cambio de logo raster si Web Dev lo documento como pendiente de asset final.

## Verificacion

- Evidencia de busqueda textual.
- Evidencia visual minima.
- Resultado final: aprobado, aprobado con observaciones o no aprobado.

## Handoff esperado

Crear `tasks/TASK-219-HANDOFF.md` con:

- Resultado por superficie.
- Usos remanentes justificados.
- Bugs clasificados.
- Riesgos aceptables.
- Recomendacion para Infra Azure `TASK-220` si aprueba.
