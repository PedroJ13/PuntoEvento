# TASK-035 Cancelada - Supersedida por rotaciones posteriores

## Estado

Cancelada por quedar obsoleta.

## Motivo

`TASK-035` buscaba resolver un `401 Unauthorized` en `POST /api/internal/company-invites` mediante rotacion/alineacion de credenciales admin. Ese frente fue resuelto posteriormente por tareas mas recientes y verificadas:

- `TASK-080`: roto `ADMIN_PASSWORD` y valido que la credencial nueva permite crear invitacion interna con `201`, mientras la anterior responde `401`.
- `TASK-101`: alineo credencial admin para QA Azure y valido `GET /api/internal/companies/pending` con credencial valida e invalida.
- `TASK-108`: roto `ADMIN_PASSWORD` expuesto durante prueba Product Owner y valido la credencial nueva contra endpoint interno.

## Impacto

No se requiere ejecutar el assignment antiguo. Mantenerlo como pendiente confunde el tablero generado y puede enviar a Infra Azure a repetir trabajo de seguridad ya cerrado.

## Recomendacion

Usar las tareas `TASK-080`, `TASK-101` y `TASK-108` como historial operativo de credenciales admin. Cualquier nueva rotacion debe abrirse como tarea nueva, con alcance y secreto vigente controlados.
