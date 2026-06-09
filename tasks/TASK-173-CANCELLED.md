# TASK-173 Cancelada - SendGrid reemplazado por Azure Communication Services Email

## Estado

Cancelada.

## Motivo

Product / Architect / Release acepta la recomendacion de `docs/RECOMMENDATION_EMAIL_PROVIDER_MVP.md`: usar Azure Communication Services Email como proveedor MVP en vez de SendGrid por costo inicial y alineacion con Azure.

## Impacto

No configurar SendGrid para el MVP. La configuracion de email pasa a nuevas tareas:

- `TASK-175`: Infra Azure configura Azure Communication Services Email.
- `TASK-176`: Backend/API adapta el provider de email a ACS Email.
- `TASK-177`: QA valida emails reales con ACS.

## Nota

No borrar codigo sin tarea Backend/API. SendGrid puede quedar como alternativa futura, pero no como proveedor MVP.
