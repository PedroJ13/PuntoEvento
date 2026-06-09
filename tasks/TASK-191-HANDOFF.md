# TASK-191: QA Azure - reintento final activacion/login recurrente post-deploy

Equipo: QA

Tarea validada: revalidacion final post-deploy del flujo de activacion y login recurrente con email duplicado.

Ambiente:

- Azure real: `https://zealous-field-08fdd720f.7.azurestaticapps.net`
- Fecha QA: `2026-06-01`
- Repo local confirmado: `C:/Users/pj13e/Digital Products/Punto Evento`
- Deploy base: `main/88a43ff` (`Deploy recurrent login duplicate email fix`)
- Dependencia revisada: `TASK-190-HANDOFF.md` indica deploy completado y ambiente `Ready`.

Resultado: aprobado con observacion.

Checks ejecutados:

| Caso | Resultado | Evidencia |
| --- | --- | --- |
| Confirmar contexto QA | PASS | Leidos `chat-start/QA.md`, `docs/MVP_RELEASE_STATUS.md`, `TASK-187-HANDOFF.md`, `TASK-190-HANDOFF.md` y `TASK-191-assignment.md`. |
| Confirmar deploy `TASK-190` | PASS | `git log` muestra `HEAD -> main, origin/main` en `88a43ff Deploy recurrent login duplicate email fix`. |
| Registrar empresa QA controlada | PASS | `POST /api/companies/register -> 201`, empresa `company_3c1fb935-9ed6-4843-9e31-b8283f8cb82e`, nombre `QA TASK-191 Final 20260601132914`. |
| Aprobar empresa y generar auto-invite | PASS | `POST /api/internal/companies/{companyId}/approve -> 200`, `invite.status=email_sent`, `emailSent=true`. |
| Confirmar escenario de email duplicado | PASS | Tabla `Users` tiene `5` usuarios para el mismo mailbox observable. No se imprimio el email ni hashes. |
| Activar password | PASS | `POST /api/company-auth/activate -> 200`, response `companyId=company_3c1fb935-9ed6-4843-9e31-b8283f8cb82e`, cookie de sesion presente. |
| Panel correcto despues de activar | PASS | `GET /api/companies/me -> 200`, `id=company_3c1fb935-9ed6-4843-9e31-b8283f8cb82e`, `name=QA TASK-191 Final 20260601132914`. |
| Logout | PASS | `POST /api/company-auth/logout -> 200`, `ok=true`, cookie de limpieza presente. |
| Password incorrecto | PASS | `POST /api/company-auth/login` con password incorrecto -> `401`, error generico `Invalid email or password`, sin cookie. |
| Login recurrente con mismo email/password | PASS | `POST /api/company-auth/login -> 200`, `companyId=company_3c1fb935-9ed6-4843-9e31-b8283f8cb82e`, cookie de sesion presente. |
| Panel correcto despues de login recurrente | PASS | `GET /api/companies/me -> 200`, `id=company_3c1fb935-9ed6-4843-9e31-b8283f8cb82e`, `name=QA TASK-191 Final 20260601132914`. |
| Sin filtracion de secretos | PASS | Responses revisadas sin `passwordHash`, `tokenHash`, `sessionToken`, connection strings, access keys ni secretos. |
| Soft cleanup | PASS | Empresa QA rechazada al final: `POST /api/internal/companies/{companyId}/reject -> 200`, status `rejected`, razon `QA cleanup TASK-191 final`. |

Hallazgos:

- El P1 de `TASK-187` queda corregido en Azure: el login recurrente ya no falla cuando hay usuarios duplicados con el mismo email.
- La nueva regla de `TASK-188` funciona contra datos reales de Azure: con `5` usuarios del mismo mailbox observable, el login selecciono la empresa activada mas reciente/correcta.
- El auto-invite al aprobar empresa sigue funcionando y reporta `invite.status=email_sent`.
- Observacion: este chat no tiene acceso directo al mailbox, por lo que la activacion uso un invite controlado generado por el endpoint interno de soporte para obtener el token sin imprimirlo. La ruta de email queda cubierta por `email_sent` y por evidencias Product previas de recepcion, pero no se adjunta nueva confirmacion visual de mailbox en este handoff.

P0/P1:

- Sin P0/P1 abiertos para activacion/login recurrente post-fix.

P2/P3:

- P2: Para una evidencia estrictamente end-to-end de email nuevo, Product/QA con acceso al mailbox debe confirmar recepcion del correo `Activa tu acceso a Punto Evento` de esta ronda o ejecutar el enlace recibido. La validacion tecnica de login recurrente queda aprobada.
- P2: El ambiente QA conserva multiples usuarios con el mailbox observable; esto ahora esta manejado por backend, pero conviene limpiar/rotar datos QA antes de escalar pruebas.

Evidencia:

```text
Deploy:
88a43ff Deploy recurrent login duplicate email fix

Empresa QA:
companyId=company_3c1fb935-9ed6-4843-9e31-b8283f8cb82e
name=QA TASK-191 Final 20260601132914

Usuarios con mismo email observable:
count=5

Approve:
status=200
invite.status=email_sent
emailSent=true

Activacion:
POST /api/company-auth/activate -> 200
companyId=company_3c1fb935-9ed6-4843-9e31-b8283f8cb82e
session cookie=present

Panel despues de activar:
GET /api/companies/me -> 200
id=company_3c1fb935-9ed6-4843-9e31-b8283f8cb82e
name=QA TASK-191 Final 20260601132914

Logout:
POST /api/company-auth/logout -> 200
ok=true

Password incorrecto:
POST /api/company-auth/login -> 401
error=Invalid email or password
cookie=absent

Login recurrente:
POST /api/company-auth/login -> 200
companyId=company_3c1fb935-9ed6-4843-9e31-b8283f8cb82e
session cookie=present

Panel despues de login recurrente:
GET /api/companies/me -> 200
id=company_3c1fb935-9ed6-4843-9e31-b8283f8cb82e
name=QA TASK-191 Final 20260601132914

Cleanup:
POST /api/internal/companies/{companyId}/reject -> 200
status=rejected
```

No se documentaron tokens completos, `inviteUrl`, passwords, `passwordHash`, cookies, connection strings ni secretos.

Riesgos o pendientes:

- La empresa QA fue rechazada despues del test; no debe usarse para pruebas posteriores de panel.
- Si Product requiere evidencia visual nueva del correo, debe confirmar en mailbox el asunto `Activa tu acceso a Punto Evento`; QA no tiene acceso directo al buzon en este chat.
- Mantener monitoreo del caso de emails duplicados si se siguen usando mailbox compartido para QA.

Recomendacion go/no-go para invitar primeras empresas reales:

- Go tecnico QA para activacion y login recurrente post-fix.
- Desde QA, el P1 de login recurrente queda cerrado.
- Siguiente decision corresponde a Product / Architect / Release: aceptar P2 restantes y decidir go de pre-lanzamiento controlado.
