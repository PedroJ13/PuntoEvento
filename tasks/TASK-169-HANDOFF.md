# TASK-169: QA Azure - login recurrente empresa

Equipo: QA

Ambiente probado: Azure real `https://zealous-field-08fdd720f.7.azurestaticapps.net`

Resultado: aprobado para pre-lanzamiento en el alcance de login recurrente empresa.

## Datos QA usados

- Empresa QA: `QA TASK-169 Login 20260531102109`
- Company ID: `company_682241b9-a1f0-440d-aa30-67f007ff712c`
- Slug: `qa-task-169-login-20260531102109`
- Email QA: `qa-task-169-20260531102109@example.test`
- Invite ID: `invite_68c7d830-c4c3-4785-885e-d7fe737d5e3b`
- Service ID creado para prueba posterior de revision: `service_67247ce4-bc83-4a63-8aaa-519f9b82eb5f`

No se documentaron token completo, password, cookie, credencial admin ni invite URL completa.

## Casos ejecutados

| Caso | Resultado | Evidencia |
| --- | --- | --- |
| Registro empresa QA | PASS | `POST /api/companies/register -> 201`, empresa `pending`. |
| Sesion ausente | PASS | `GET /api/companies/me -> 401 Unauthorized`. |
| Crear invitacion interna | PASS | `POST /api/internal/company-invites -> 201`, invite generado sin exponer token. |
| Activacion password corto | PASS | `POST /api/company-auth/activate -> 400`, mensaje `password must be at least 8 characters`. |
| Activacion valida | PASS | `POST /api/company-auth/activate -> 200`, body sin campos sensibles. |
| Refresh con sesion vigente | PASS | `GET /api/companies/me -> 200` con la misma sesion. |
| Credenciales invalidas | PASS | `POST /api/company-auth/login -> 401`, mensaje generico `Invalid email or password`. |
| Logout | PASS | `POST /api/company-auth/logout -> 200`. |
| Sesion despues de logout | PASS | `GET /api/companies/me -> 401`. |
| Login recurrente valido | PASS | `POST /api/company-auth/login -> 200`, body sin campos sensibles. |
| Crear servicio con sesion login | PASS | `POST /api/companies/me/services -> 201`, servicio `draft`. |
| Enviar servicio a revision | PASS | `POST /api/companies/me/services/{serviceId}/submit-review -> 200`, servicio `pending`. |
| Empresa rechazada/suspendida | PASS parcial | Se rechazo la empresa QA como cleanup; login posterior responde `403 Company status cannot access panel`. |
| Mobile/desktop basico panel | PASS | Cubierto en `TASK-172`: panel login y activacion visibles sin overflow. |

## No exposicion de datos sensibles

Las respuestas revisadas no incluyeron:

- `passwordHash`
- `tokenHash`
- `sessionHash`
- `sessionToken`
- `partitionKey`
- `rowKey`
- cookie cruda en body

## Limpieza

Se aplico soft cleanup:

```text
POST /api/internal/companies/company_682241b9-a1f0-440d-aa30-67f007ff712c/reject -> 200
status: rejected
reason: QA cleanup TASK-169
```

## Bugs / riesgos

### P0/P1

- Ninguno en el alcance de login recurrente empresa.

### P2

- No se hizo hard delete de empresa, usuario, invitacion, sesion ni servicio QA; queda trazabilidad en tablas.
- No se probo lockout/rate limiting por intentos fallidos; sigue como riesgo pre-lanzamiento aceptable si Product lo acepta.

## Recomendacion

Aprobar `TASK-169` para pre-lanzamiento. El login recurrente de empresa en Azure funciona con activacion por invitacion, login email/password, logout, sesion vigente, credenciales invalidas genericas y bloqueo de empresa rechazada.
