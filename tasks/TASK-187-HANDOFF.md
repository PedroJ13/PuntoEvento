# TASK-187: QA/Product - cierre final de activacion por email

Equipo: QA

Tarea validada: cierre final de activacion por email recibido, password inicial y login recurrente.

Ambiente:

- Azure real: `https://zealous-field-08fdd720f.7.azurestaticapps.net`
- Fecha QA: `2026-06-01`
- Repo local confirmado: `C:/Users/pj13e/Digital Products/Punto Evento`
- Evidencia Product: correo `Activa tu acceso a Punto Evento` recibido.

Resultado: no aprobado.

## Checks ejecutados

| Caso | Resultado | Evidencia |
| --- | --- | --- |
| Email de activacion recibido | PASS | Product compartio captura con asunto `Activa tu acceso a Punto Evento`, remitente ACS y CTA `Activar acceso`. |
| Emails internos operativos | PASS | Product compartio capturas de `Nueva empresa registrada` y `Servicio enviado a revision`. |
| Abrir enlace de activacion | PASS parcial | El enlace abrio `panel.html?invite=<redacted>` y mostro formulario `Activa tu acceso`. |
| Definir password desde enlace original | BLOCKED por cleanup previo | El primer intento devolvio `Este acceso no esta disponible` porque la empresa QA asociada habia sido rechazada en cleanup de `TASK-185`. |
| Reaprobar empresa QA para completar prueba | PASS | `POST /api/internal/companies/{companyId}/approve -> 200`, `status=published`, `invite.status=active_exists`, sin reenvio de token. |
| Definir password despues de reaprobar | PASS | El formulario acepto password y cargo panel de `QA TASK-185 UI Invite 20260601114456`. |
| Login recurrente por UI con mismo email/password | FAIL | UI devolvio `No pudimos validar el acceso. Revisa los datos e intentalo de nuevo.` |
| Login recurrente por API con mismo email/password | FAIL | `POST /api/company-auth/login -> 401`, body `Invalid email or password`. |
| Nuevo invite interno + nueva activacion + login mismo password | FAIL login | `POST /api/company-auth/activate -> 200`, pero login inmediato con el mismo email/password -> `401`. |
| Usuario creado/actualizado | PASS | Tabla `Users` muestra usuario activo para la empresa QA, con `passwordSetAt` actualizado. Hash presente y con forma esperada; no se imprimio hash. |
| Verificacion local de hash | PASS | El password usado verifica localmente contra el hash de ese usuario. No se imprimio hash. |
| Causa probable | IDENTIFICADA | Hay mas de un usuario activo con el mismo email; `findUserByEmail` devuelve el primer match global por email, que puede pertenecer a otra empresa y no al usuario recien activado. |
| Limpieza QA | PASS | Empresa QA usada fue rechazada de nuevo con razon `QA cleanup TASK-187 after login investigation`. |

## Hallazgos

- La entrega de email de activacion esta confirmada por Product.
- El enlace de activacion llega a la pantalla correcta.
- La activacion crea/actualiza usuario y permite entrar al panel en esa misma sesion.
- El login recurrente falla cuando existen multiples usuarios activos con el mismo email en `Users`.
- La causa probable es que `findUserByEmail(email)` busca por email global y retorna el primer usuario encontrado, sin probar todos los candidatos ni resolver duplicados por password/empresa.

## P0/P1

- P1: Login recurrente no queda aprobado. Despues de activar password, `POST /api/company-auth/login` puede devolver `401` si hay usuarios duplicados con el mismo email.

## P2/P3

- P2: El ambiente QA acumulo duplicados de usuario por usar el mismo mailbox en varias empresas de prueba. Aun asi, el backend debe manejarlo de forma determinista o impedir duplicados.

## Evidencia

```text
Email activacion recibido: si, confirmado por Product
Email nueva empresa registrada: si, confirmado por Product
Email servicio enviado a revision: si, confirmado por Product

Empresa QA usada:
company_c7d602fa-e8fd-407f-8ec2-83cc96eb075f
QA TASK-185 UI Invite 20260601114456

Approve recuperacion:
status=published
invite.status=active_exists
emailSent=false

Activacion:
POST /api/company-auth/activate -> 200
Panel cargado: QA TASK-185 UI Invite 20260601114456

Login recurrente:
POST /api/company-auth/login -> 401
error=Invalid email or password

Usuarios con mismo email:
count=2
ambos status=active

Cleanup:
company_c7d602fa-e8fd-407f-8ec2-83cc96eb075f -> rejected
```

No se documentaron tokens completos, `inviteUrl`, password, `passwordHash`, cookies, connection strings ni secretos.

## Riesgos o pendientes

- Invitar empresas reales sigue en no-go hasta corregir login recurrente con emails duplicados o definir una regla de unicidad estricta.
- Si una empresa real usa un email que ya existe en `Users` por pruebas anteriores, podria no poder iniciar sesion aunque su activacion haya sido correcta.

## Siguiente recomendado

Crear tarea Backend/API para corregir login recurrente:

- buscar todos los usuarios activos por email y seleccionar el que verifique password y tenga empresa en estado permitido; o
- imponer unicidad de email activa con migracion/limpieza controlada.

Despues, QA debe repetir el flujo:

```text
email recibido -> activar password -> logout -> login recurrente -> panel correcto
```
