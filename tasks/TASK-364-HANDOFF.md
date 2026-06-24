# TASK-364 HANDOFF - Proyecto

## Equipo

Proyecto

## Tarea completada

Definicion de alcance MVP para password-flows de empresas en Punto Evento CR.

## Archivos revisados

- `tasks/TASK-364-assignment.md`
- `C:\Work\PuntoClub-password-flows-implementation-guide.md`
- `docs/API_CONTRACTS_MVP.md`
- `docs/DATA_MODEL.md`
- `docs/DECISION_LOG.md`
- `api/shared/companyAuth.js`
- `api/shared/config.js`

## Archivos cambiados

- `docs/DECISION_LOG.md`
- `tasks/TASK-364-HANDOFF.md`

## Resultado

Aprobado como alcance MVP acotado, con adaptacion a la arquitectura actual de Punto Evento:

- Azure Functions.
- Azure Table Storage.
- ACS Email.
- `Users` con `passwordHash` `scrypt`.
- `CompanySessions` server-side con cookie `HttpOnly`, `Secure`, `SameSite=Lax`.
- `CompanyInvites` con token hasheado.

No se implemento codigo.

## Estado actual confirmado

Punto Evento ya tiene:

- Activacion por invitacion con password inicial.
- Login recurrente con email/password.
- Hash fuerte `scrypt` con salt aleatorio.
- Sesiones server-side en `CompanySessions`.
- Cookie de sesion `pe_company_session`.
- Email transaccional por ACS.
- Admin interno con credencial real para acciones internas.

Falta implementar:

- Ver/ocultar password en UI.
- Cambio autenticado de password desde panel empresa.
- Solicitud publica de reset por correo.
- Validacion y completado de reset por token.
- Accion admin para enviar reset de acceso.
- QA local, deploy y QA Azure del paquete.

## Alcance MVP aprobado

### 1. Cambio autenticado de password

Endpoint recomendado:

```text
POST /api/company-auth/password
```

Requiere:

- Sesion valida de empresa.
- Usuario empresa activo.
- Empresa en estado permitido para panel.

Payload:

```json
{
  "currentPassword": "...",
  "newPassword": "...",
  "passwordConfirmation": "..."
}
```

Reglas:

- `currentPassword` requerido.
- `newPassword` entre 10 y 128 caracteres.
- `newPassword` debe incluir letras y numeros.
- `newPassword` debe ser distinto de `currentPassword`.
- `passwordConfirmation` debe coincidir.
- Rechazar campos `email`, `companyId`, `userId`.
- Si password actual no coincide, responder `401` con codigo seguro tipo `INVALID_CURRENT_PASSWORD`.
- Respuesta exitosa no debe exponer password, hash, token, cookie cruda, `partitionKey`, `rowKey` ni metadata interna.

Politica de sesiones:

- Mantener la sesion actual para no sacar al usuario inmediatamente.
- Revocar otras sesiones activas del mismo usuario/empresa si es viable con Table Storage.

### 2. Reset de password por correo

Endpoints recomendados:

```text
POST /api/company-password-resets
GET /api/company-password-resets/validate?token=...
POST /api/company-password-resets/complete
```

Modelo de persistencia MVP:

Usar Azure Table Storage, no SQL. Tabla recomendada:

```text
CompanyPasswordResets
```

Entidad sugerida:

```json
{
  "partitionKey": "<companyId>",
  "rowKey": "reset_<uuid>",
  "id": "reset_<uuid>",
  "companyId": "<companyId>",
  "userId": "<userId>",
  "email": "empresa@dominio.com",
  "tokenHash": "<sha256>",
  "status": "pending",
  "expiresAt": "ISO",
  "sentAt": "ISO",
  "usedAt": "",
  "createdByLabel": "public|admin",
  "createdAt": "ISO",
  "updatedAt": "ISO"
}
```

Estados:

```text
pending
used
expired
revoked
```

Reglas:

- Token raw solo se genera para construir el link enviado por correo al destinatario.
- Guardar solo `tokenHash`.
- Revocar resets pendientes previos del mismo usuario/email antes de crear uno nuevo.
- La solicitud publica siempre responde generico:

```json
{
  "ok": true,
  "message": "Si el correo esta registrado, enviaremos instrucciones."
}
```

- No revelar si el email existe.
- Validar token sin devolver email, companyId, userId ni metadata sensible.
- Completar reset busca por hash, valida estado/expiracion, actualiza password hash, marca reset como `used` y revoca sesiones activas.

### 3. UI empresa

Alcance:

- Ojo Ver/Ocultar en login.
- Ojo Ver/Ocultar en activacion inicial si comparte superficie.
- Formulario `Cambiar contrasena` dentro del panel empresa autenticado.
- Enlace `Recuperar acceso` desde login.
- Formulario publico para pedir instrucciones.
- Pantalla publica `company-password-reset?token=...` o ruta equivalente definida por Web Dev sin romper SPA.

Reglas:

- No guardar passwords ni tokens en `localStorage` o `sessionStorage`.
- No imprimir passwords/tokens en consola.
- Limpiar campos despues de exito.
- Volver inputs a `type=password` despues de exito.
- Mensajes seguros y claros.

### 4. Admin interno

Alcance:

- Accion `Enviar reset de acceso` en contexto de empresa.
- Confirmacion antes de enviar.
- Usar auth admin existente.
- Mostrar exito seguro: `Correo de recuperacion enviado.`

Reglas:

- Admin nunca ve token ni link completo.
- Handoff/evidencia nunca incluye token, link completo, cookie ni password.

## Settings / configuracion recomendada

Agregar defaults en backend cuando se implemente:

```text
COMPANY_PASSWORD_RESET_ENABLED=true
COMPANY_PASSWORD_RESET_EXPIRES_MINUTES=60
AZURE_TABLE_COMPANY_PASSWORD_RESETS=CompanyPasswordResets
```

Usar `APP_PUBLIC_URL=https://puntoeventocr.com` como base canonica para construir links.

No guardar secrets en repo.

## Orden recomendado

1. `TASK-365` Backend/API: cambio autenticado de password.
2. `TASK-366` Web Dev: ojo password y cambio desde panel.
3. `TASK-367` Backend/API: reset por correo con token hasheado.
4. `TASK-368` Web Dev: recuperar acceso y pantalla publica de reset.
5. `TASK-369` Web Dev: accion admin reset.
6. `TASK-370` QA local completo.
7. `TASK-371` Infra Azure deploy.
8. `TASK-372` QA Azure con cuenta/destinatario autorizado.

Nota de dependencia:

- `TASK-366` depende funcionalmente de `TASK-365`.
- `TASK-368` y `TASK-369` dependen funcionalmente de `TASK-367`.
- `TASK-371` no debe desplegar antes de `TASK-370` aprobado.
- `TASK-372` depende de `TASK-371`.

## Riesgos

- Publicar UI antes de API dejaria controles visibles que responden `404`.
- Reset real requiere destinatario autorizado; QA no debe improvisar con cuentas reales.
- Table Storage no tiene indices relacionales; busquedas por `tokenHash` pueden requerir `listEntities` con filtro. Backend debe mantener bajo volumen y revisar costo/latencia.
- Si se activa feature flag sin tabla/configuracion lista, endpoints pueden fallar en runtime.
- CORS/cookies deben validarse en dominio propio si QA ve error generico de login/reset.

## Decisiones documentadas

Se agrego decision en `docs/DECISION_LOG.md`:

```text
2026-06-22: Password-flows de empresa como ampliacion MVP segura
```

## Verificacion ejecutada

Revision documental y comparacion contra:

- Contratos actuales de auth.
- Modelo `User`, `CompanyInvite`, `CompanySession`.
- Implementacion actual `api/shared/companyAuth.js`.
- Configuracion actual `api/shared/config.js`.

No se ejecutaron pruebas de codigo porque la tarea es de alcance/Proyecto.

## Siguiente recomendado

Entregar a Ejecucion Tecnica:

```text
Nombre del Equipo: Ejecucion Tecnica
Modo: Backend/API
Nombre de la tarea: TASK-365 - Backend/API cambio autenticado de password de empresa
Al finalizar, debe crear o actualizar tasks/TASK-365-HANDOFF.md usando el formato de handoff indicado

Nombre del Equipo: Ejecucion Tecnica
Modo: Web Dev
Nombre de la tarea: TASK-366 - Web Dev ojo password y cambio de password en panel empresa
Al finalizar, debe crear o actualizar tasks/TASK-366-HANDOFF.md usando el formato de handoff indicado
```

No iniciar `TASK-367` hasta que `TASK-365` tenga handoff o hasta que Proyecto decida avanzar backend en paralelo.

