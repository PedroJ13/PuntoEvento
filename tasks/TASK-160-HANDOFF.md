# TASK-160: QA - validacion login recurrente empresa

Equipo: QA

Tarea validada: activacion por invitacion y login recurrente empresa con email/password.

Ambiente: local/estructural con mocks, segun `TASK-158` y `TASK-159`. No hubo deploy Azure validado ni credenciales reales asignadas para esta tarea.

Resultado: aprobado local/estructuralmente con observaciones; no aprobado como validacion Azure real.

## Casos ejecutados

| Caso | Resultado | Evidencia |
| --- | --- | --- |
| `node --check panel.js` | PASS | Sintaxis OK. |
| `node --check api/company-auth-activate/index.js` | PASS | Sintaxis OK. |
| `node --check api/company-auth-login/index.js` | PASS | Sintaxis OK. |
| Activacion sin token | PASS | Mock API responde `400 { error: "token is required" }`. |
| Activacion password corto | PASS | Mock API responde `400 { error: "password must be at least 8 characters" }`. |
| Activacion valida | PASS estructural | Responde `200`, set-cookie `HttpOnly`, body sin `passwordHash`, token crudo, `partitionKey` ni `rowKey`. |
| Activacion empresa rechazada | PASS | Responde `403 { error: "Company status cannot access panel" }`. |
| Login sin campos | PASS | Responde `400 { error: "email and password are required" }`. |
| Login password invalido | PASS | Responde `401 { error: "Invalid email or password" }`, mensaje generico. |
| Login valido | PASS estructural | Responde `200`, set-cookie `HttpOnly`, body sin `passwordHash`, token crudo, `partitionKey` ni `rowKey`. |
| Login empresa rechazada | PASS | Responde `403 { error: "Company status cannot access panel" }`. |
| Login empresa inexistente | PASS | Responde `401` generico. |
| UI sin sesion desktop/mobile | PASS mock | Muestra `Iniciar sesion`, formulario email/password, sin overflow horizontal, `Cerrar sesion` oculto. |
| UI con `?invite=token_qa` desktop/mobile | PASS mock | Muestra `Activa tu acceso`, password/confirmacion, sin overflow horizontal, `Cerrar sesion` oculto. |
| Logout real | NOT RUN | Requiere sesion real Azure o fixture local persistente. |
| Permisos Empresa A vs Empresa B | NOT RUN | Requiere datos/sesiones reales o fixture de Table Storage. |

## Evidencia de no exposicion de datos sensibles

- Login/activacion estructural no devolvieron `passwordHash`, token crudo, `partitionKey` ni `rowKey`.
- Error de credenciales invalidas es generico: `Invalid email or password`.
- UI sin sesion oculta `Cerrar sesion` cuando se prueba contra mocks actuales.

## Bugs P0/P1/P2

### P0/P1

- Ninguno encontrado en validacion local/estructural.
- P1 de release: falta ejecutar este flujo contra Azure real antes de aprobar pre-lanzamiento.

### P2

- No hay rate limiting/lockout visible; ya venia como riesgo de `TASK-158`.
- `findUserByEmail` escanea tabla por email; aceptado solo para pre-lanzamiento segun `TASK-158`.

## Recomendacion para Product / Architect / Release

No marcar `TASK-160` como aprobado Azure. Pedir deploy/ambiente con endpoints `company-auth/activate` y `company-auth/login`, invitacion QA y empresa controlada para validar activacion real, login recurrente, logout, sesion expirada y aislamiento Empresa A/B.
