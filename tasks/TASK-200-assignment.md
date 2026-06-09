# TASK-200: QA - validacion Azure hallazgos cliente 2026-06-03

## Equipo asignado

QA.

## Contexto

La prueba cliente del 2026-06-03 encontro fricciones de pre-lanzamiento en contacto/cotizacion, panel empresa, admin, pagina publica y emails. Product decidio que el MVP usa WhatsApp primario y email como respaldo/trazabilidad.

## Tarea

Validar en Azure el bloque de ajustes derivados de la prueba cliente.

## Alcance

1. Validar pagina publica:
   - CTA `Contactar`;
   - WhatsApp cuando hay telefono disponible;
   - email/formulario como respaldo;
   - categorias/atajos de servicios;
   - foco en resultados al filtrar.
2. Validar panel empresa:
   - lenguaje simple;
   - `portada`;
   - carga de servicio sin confusion operativa.
3. Validar admin:
   - empresa pendiente vs empresa aprobada con servicios pendientes;
   - acciones correctas por estado;
   - feedback especifico;
   - navegacion legacy/demo no distrae.
4. Validar emails:
   - empresa registrada;
   - empresa aprobada/activacion;
   - servicio cargado/enviado;
   - cotizacion/contacto.
5. Clasificar hallazgos P0/P1/P2/P3.

## No tocar

- No modificar datos reales salvo que la prueba lo requiera y quede documentado.
- No publicar secretos ni tokens.
- No aprobar go/no-go final; entregar recomendacion.

## Verificacion

- Prueba desktop y mobile.
- Evidencia de URLs, timestamps y resultados.
- Confirmacion de emails recibidos o limitacion explicita si QA no tiene mailbox.
- Recomendacion final: aprobado, aprobado con observaciones o no aprobado.

## Handoff esperado

Crear `tasks/TASK-200-HANDOFF.md` con:

- Resultado por superficie.
- Evidencia resumida.
- Bugs clasificados.
- Riesgos aceptables.
- Recomendacion go/no-go para Product / Architect / Release.
