# TASK-282: QA/Product - validar panel autenticado con sesion controlada

## Equipo asignado

QA.

## Contexto

`TASK-281` intento revalidar el incidente productivo de guardar/enviar servicio desde panel empresa en dominio propio.

Resultado de `TASK-281`:

- No se pudo ejecutar flujo autenticado completo porque QA no tenia empresa QA, sesion activa, invite ni credenciales de empresa.
- Sin sesion, los endpoints privados respondieron `401 Unauthorized`, no `403`.
- No hay evidencia actual de bloqueo por `ALLOWED_ORIGINS` en endpoints privados.
- El usuario afectado reporto despues que si logro completar/aprobar el flujo.

Conclusion Product / Architect / Release:

No abrir fix directo para Infra Azure, Backend/API o Web Dev sin evidencia autenticada.

## Tarea

Conseguir una sesion controlada de empresa y revalidar formalmente el panel empresa autenticado desde dominio propio.

## Alcance

QA/Product debe usar una de estas opciones:

1. Empresa QA nueva aprobada por Admin.
2. Empresa QA existente con login recurrente valido.
3. Sesion controlada de la empresa afectada, sin exponer credenciales ni cookies.
4. HAR/redactado del usuario afectado si vuelve a fallar.

Validar desde:

```text
https://puntoeventocr.com/panel.html
https://www.puntoeventocr.com/panel.html
```

Flujo minimo:

1. Login empresa.
2. Carga de `Mi empresa`.
3. Crear servicio minimo sin imagen.
4. Guardar servicio.
5. Editar servicio.
6. Subir portada PNG/JPG valida menor a 5 MB.
7. Confirmar upload.
8. Enviar servicio a revision.
9. Confirmar que admin ve el servicio pendiente si hay credencial admin disponible.

## Captura obligatoria

Para cada accion API relevante:

- endpoint;
- metodo;
- status HTTP;
- response body redactado;
- `Origin`;
- `Referer`;
- si `pe_company_session` se envia a `/api` sin imprimir su valor;
- archivo usado: extension, MIME y tamano aproximado.

Endpoints:

```text
GET /api/companies/me
GET /api/companies/me/services
POST /api/companies/me/services
PATCH /api/companies/me/services/{serviceId}
POST /api/uploads/sign
POST /api/uploads/confirm
POST /api/companies/me/services/{serviceId}/submit-review
```

## Matriz de decision

- Todo funciona: cerrar incidente como no reproducido/resuelto operativamente y levantar NO-GO del panel.
- `403`: abrir tarea `Infra Azure`.
- `401`: abrir tarea `Backend/API` si hay cookie/sesion enviada y aun asi falla; si no hay cookie, revisar login/sesion con QA/Product.
- `400`, `409`, `413`, `415` o `500`: abrir tarea `Backend/API`.
- API responde con detalle util pero UI muestra mensaje generico: abrir tarea `Web Dev`.

## No tocar

- No implementar codigo.
- No cambiar configuracion Azure.
- No publicar servicios QA.
- No imprimir secretos, cookies completas, tokens, passwords, correos privados ni datos reales sensibles.

## Handoff esperado

Crear `tasks/TASK-282-HANDOFF.md` con:

- resultado final;
- si el incidente queda cerrado o sigue abierto;
- tabla de endpoints/status;
- empresa QA usada sin datos sensibles;
- recomendacion de siguiente equipo si aplica.
