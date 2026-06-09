# TASK-234: QA - validar paleta global local/estructural

## Equipo asignado

QA.

## Contexto

`TASK-232` debe aplicar la paleta global a pagina publica y admin. `TASK-233` debe alinear emails HTML. El objetivo es coherencia visual de color, no rediseno.

## Tarea

Validar local/estructuralmente que la paleta global no rompe lectura, responsive ni flujos principales.

## Alcance

1. Leer:
   - `tasks/TASK-231-HANDOFF.md`;
   - `tasks/TASK-232-HANDOFF.md`;
   - `tasks/TASK-233-HANDOFF.md`.
2. Validar pagina publica:
   - home;
   - busqueda/listado;
   - perfil/servicio si aplica;
   - contacto/CTA visible.
3. Validar admin:
   - login visual;
   - listados/expediente;
   - estados pending/approved/rejected;
   - botones primarios/secundarios.
4. Validar panel empresa como regresion minima: no debe degradarse.
5. Revisar mobile y desktop.
6. Revisar estructura de emails si hay forma local/estructural.

## No tocar

- No implementar fixes.
- No desplegar.
- No limpiar datos.
- No cambiar credenciales.

## Verificacion

- Sin P0/P1 visuales.
- Contraste legible en botones, links y estados.
- No hay textos cortados u overflow nuevo.
- Flujos principales siguen accesibles.
- Si hay observaciones P2/P3, clasificarlas claramente.

## Handoff esperado

Crear `tasks/TASK-234-HANDOFF.md` con:

- Resultado: aprobado / no aprobado.
- Superficies validadas.
- Evidencia desktop/mobile.
- Hallazgos por severidad.
- Recomendacion para Infra Azure `TASK-235` si aprueba.
