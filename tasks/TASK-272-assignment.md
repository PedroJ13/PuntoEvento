# TASK-272: QA - validacion local de ajustes UX flujos web 2026-06-08

## Equipo asignado

QA.

## Contexto

Web Dev debe completar las tareas:

- `TASK-267`
- `TASK-268`
- `TASK-269`
- `TASK-270`
- `TASK-271`

Todas son ajustes de UI/copy/jerarquia visual, sin cambio esperado de backend/API.

## Tarea

Validar local/estructuralmente el bloque UX de flujos web antes de deploy.

## Alcance

1. Revisar pagina publica:
   - contacto/cotizacion claro;
   - WhatsApp vs formulario/email distinguible;
   - resultados y ficha service-first;
   - catalogo vacio sin datos demo y con CTA correcto.
2. Revisar registro de empresa:
   - confirmacion post-registro explica que el acceso llega por correo.
3. Revisar panel empresa:
   - labels/microcopy de estados visibles son entendibles;
   - no se cambiaron estados backend.
4. Revisar admin:
   - resumen de pendientes visible;
   - approve/reject siguen funcionando local/estructuralmente.
5. Validar desktop/mobile cuando aplique.

## No tocar

- No editar codigo.
- No crear datos reales no controlados.
- No publicar secretos, tokens, cookies ni credenciales.

## Verificacion

- Sin P0/P1 para deploy.
- Si aparece P1, indicar tarea responsable.
- Confirmar que no se detectaron cambios de contrato API.

## Handoff esperado

Crear `tasks/TASK-272-HANDOFF.md` con:

- Resultado: aprobado/no aprobado.
- Evidencia por superficie.
- Bugs clasificados P0/P1/P2/P3.
- Recomendacion: deploy o correccion previa.
