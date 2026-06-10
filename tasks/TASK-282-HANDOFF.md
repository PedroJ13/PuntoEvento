# TASK-282 HANDOFF

Equipo: QA

Tarea validada: `TASK-282` - validar panel empresa autenticado con sesion controlada desde dominio propio.

## Resultado final

Resultado: **no aprobado / bloqueado por falta de sesion controlada**.

QA no pudo ejecutar el flujo minimo autenticado porque la tarea no incluyo empresa QA aprobada, login recurrente valido, invite, sesion controlada, credenciales de empresa ni HAR redactado del usuario afectado.

Con la evidencia disponible:

- No se reproduce un `403` por dominio/origen.
- No hay evidencia para abrir fix directo a `Infra Azure`.
- No hay evidencia suficiente para abrir fix directo a `Backend/API` o `Web Dev`.
- El incidente queda **sin cierre QA funcional**, aunque el usuario afectado reporto en `TASK-281` que luego si logro completar/aprobar.

## Incidente

Estado QA: **sigue abierto como no reproducido por QA / pendiente de evidencia autenticada**.

No se puede levantar el NO-GO del panel solo con esta tarea, porque el criterio de aprobacion exige validar:

- crear servicio;
- guardar;
- editar;
- subir portada;
- confirmar upload;
- enviar a revision.

Ninguno de esos pasos puede ejecutarse sin `pe_company_session` valida o credencial de empresa.

## Ambiente

- Apex: `https://puntoeventocr.com/panel.html`
- WWW: `https://www.puntoeventocr.com/panel.html`
- Fecha QA: `2026-06-09`
- Rol: QA
- Navegador: Codex in-app browser / Chromium
- Sin credenciales, tokens, cookies reales ni datos sensibles impresos.
- No se crearon empresas, servicios ni uploads en esta tarea.

## Empresa QA usada

No hubo empresa QA utilizable.

Opciones requeridas por la asignacion y estado:

| Opcion | Estado |
|---|---|
| Empresa QA nueva aprobada por Admin | no disponible para QA |
| Empresa QA existente con login recurrente valido | no disponible/documentada |
| Sesion controlada de empresa afectada | no disponible |
| HAR/redactado del usuario afectado | no disponible |

## Evidencia de sesion

Se intento revisar apex y `www` desde navegador integrado sin leer valores sensibles.

Resultado visible:

| Dominio | Estado visible | Resultado |
|---|---|---|
| `https://puntoeventocr.com/panel.html` | login de empresa visible | sin sesion controlada |
| `https://www.puntoeventocr.com/panel.html` | login de empresa visible | sin sesion controlada |

Texto visible del panel:

```text
ACCESO EMPRESA
Iniciar sesión
Ingresa con el correo y la contraseña activados para tu empresa.
Correo
Contraseña
Iniciar sesión
```

## Tabla de endpoints/status

No se pudo capturar la tabla autenticada requerida en `TASK-282` porque no hubo sesion valida.

Evidencia heredada y revisada de `TASK-281`:

| Dominio/origen | Metodo | Endpoint | Status observado sin sesion | Lectura QA |
|---|---:|---|---:|---|
| apex | GET | `/api/companies/me` | `401` | llega a autenticacion, no bloqueo CORS/origen |
| apex | GET | `/api/companies/me/services` | `401` | llega a autenticacion, no bloqueo CORS/origen |
| www | GET | `/api/companies/me` | `401` | llega a autenticacion, no bloqueo CORS/origen |
| www | GET | `/api/companies/me/services` | `401` | llega a autenticacion, no bloqueo CORS/origen |
| apex | POST | `/api/companies/me/services` | `401` | sin cookie; esperado |
| apex | PATCH | `/api/companies/me/services/{serviceId}` | `401` | sin cookie; esperado |
| apex | POST | `/api/uploads/sign` | `401` | sin cookie; esperado |
| apex | POST | `/api/uploads/confirm` | `401` | sin cookie; esperado |
| apex | POST | `/api/companies/me/services/{serviceId}/submit-review` | `401` | sin cookie; esperado |
| www | POST | `/api/companies/me/services` | `401` | sin cookie; esperado |
| www | PATCH | `/api/companies/me/services/{serviceId}` | `401` en repeticion | sin cookie; esperado |
| www | POST | `/api/uploads/sign` | `401` | sin cookie; esperado |
| www | POST | `/api/uploads/confirm` | `401` | sin cookie; esperado |
| www | POST | `/api/companies/me/services/{serviceId}/submit-review` | `401` | sin cookie; esperado |

No se capturo ningun `403` asociado a `ALLOWED_ORIGINS` en endpoints privados.

## Archivo usado

No aplica. No se pudo subir archivo porque no hubo sesion autenticada ni servicio asociado.

Pendiente para la siguiente pasada autenticada:

- Archivo: PNG o JPG valido.
- MIME: `image/png` o `image/jpeg`.
- Tamano: menor a 5 MB.

## Hallazgos por severidad

### P0

- Ninguno.

### P1

- No reproducido por QA.
- El flujo autenticado sigue sin aprobacion QA por falta de sesion controlada.

### P2

- Falta precondicion de prueba: empresa QA aprobada/login recurrente/invite/sesion o HAR redactado.

### P3

- Ninguno nuevo.

## Decision por matriz

| Condicion | Resultado |
|---|---|
| Todo funciona | no validado |
| `403` | no observado |
| `401` con cookie enviada | no validado, no hubo cookie |
| `400/409/413/415/500` autenticado | no validado |
| API con detalle util pero UI generica | no validado |

## Recomendacion de siguiente equipo

Responsable inmediato recomendado: **QA/Product**, no equipo tecnico de fix.

Accion requerida:

1. Proveer una empresa QA aprobada con login recurrente valido, o crearla mediante Admin/Product.
2. Alternativamente, abrir una sesion controlada de la empresa afectada sin exponer credenciales/cookies.
3. Si el usuario afectado vuelve a fallar, pedir HAR/redactado con:
   - endpoint;
   - metodo;
   - status;
   - response body;
   - `Origin`;
   - `Referer`;
   - presencia de cookie `pe_company_session`, sin valor.

Asignacion futura segun evidencia:

- `403`: `Infra Azure`.
- `401` con cookie enviada: `Backend/API`.
- `401` sin cookie: `QA/Product` para login/sesion.
- `400`, `409`, `413`, `415`, `500`: `Backend/API`.
- API correcta con UX confusa/generica: `Web Dev`.

## Checks ejecutados

```powershell
git rev-parse --show-toplevel
Get-Content -Path tasks/TASK-282-assignment.md -Raw
Get-Content -Path tasks/TASK-281-HANDOFF.md -Raw
Get-Content -Path docs/MVP_RELEASE_STATUS.md -Raw
Get-Content -Path chat-start/QA.md -Raw
Navegador integrado: revision de panel apex/www sin sesion controlada
```
