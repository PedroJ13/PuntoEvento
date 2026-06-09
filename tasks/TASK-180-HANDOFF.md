# TASK-180: Backend/API - enviar invite al aprobar empresa

## Estado

Completada local/estructuralmente.

## Contrato final

Endpoint afectado:

```text
POST /api/internal/companies/{companyId}/approve
```

La aprobacion sigue publicando la empresa y ahora intenta gestionar acceso automaticamente:

- Si no hay invite activo vigente para `Company.email`, crea un invite nuevo.
- Si crea invite nuevo, envia email de activacion con link al panel usando el provider actual de email.
- Si ya hay invite activo vigente, no crea duplicado y no reenvia token porque el token completo no se guarda.
- Nunca devuelve `inviteUrl`, token completo, `tokenHash`, session hash, cookies ni secretos.
- Si falla el email, la empresa queda aprobada y la respuesta incluye warning claro.

Response exitoso con email enviado:

```json
{
  "ok": true,
  "status": "published",
  "invite": {
    "status": "email_sent",
    "inviteId": "invite_123",
    "expiresAt": "...",
    "emailSent": true
  }
}
```

Estados posibles de `invite.status`:

```text
email_sent
active_exists
email_failed
missing_email
invite_failed
```

## Archivos cambiados

- `api/shared/companyInvites.js`
- `api/shared/internalModeration.js`
- `api/internal-company-invites/index.js`
- `api/shared/email.js`
- `docs/API_CONTRACTS_MVP.md`
- `tasks/TASK-180-HANDOFF.md`

## Verificacion ejecutada

Sintaxis:

```text
node --check api/shared/companyInvites.js
node --check api/shared/internalModeration.js
node --check api/internal-company-invites/index.js
node --check api/shared/email.js
```

Resultado: OK.

Diff check:

```text
git diff --check -- api/shared/companyInvites.js api/shared/internalModeration.js api/internal-company-invites/index.js api/shared/email.js docs/API_CONTRACTS_MVP.md
```

Resultado: OK; solo warnings de normalizacion LF/CRLF.

Prueba local/estructural con mocks:

```json
[
  {
    "name": "new-invite-email-sent",
    "status": 200,
    "inviteStatus": "email_sent",
    "emailSent": true,
    "hasWarning": false,
    "updated": true,
    "inviteCalled": true,
    "emailCalled": true,
    "warningLeaksSecret": false
  },
  {
    "name": "active-exists-no-duplicate",
    "status": 200,
    "inviteStatus": "active_exists",
    "emailSent": false,
    "hasWarning": true,
    "updated": true,
    "inviteCalled": true,
    "emailCalled": false,
    "warningLeaksSecret": false
  },
  {
    "name": "email-fails-approved-warning",
    "status": 200,
    "inviteStatus": "email_failed",
    "emailSent": false,
    "hasWarning": true,
    "updated": true,
    "inviteCalled": true,
    "emailCalled": true,
    "warningLeaksSecret": false
  }
]
```

## Riesgos

- No se envio email real en esta ronda; requiere deploy y QA Azure.
- Si existe un invite activo anterior, no se puede reconstruir el link porque solo guardamos `tokenHash`. Esto es correcto para seguridad, pero implica que la UI/admin debe mostrar warning y usar endpoint manual si se necesita reemitir.
- El endpoint manual `POST /api/internal/company-invites` se mantiene para soporte y sigue devolviendo `inviteUrl` solo en el momento de creacion.
- El flujo no implementa rate limiting ni auditoria formal de reenvios.

## Recomendacion para Web Dev

En `TASK-181`, mostrar feedback en admin segun:

```text
invite.status=email_sent -> Empresa aprobada e invitacion enviada.
invite.status=active_exists -> Empresa aprobada; ya existia invitacion activa.
invite.status=email_failed/missing_email/invite_failed -> Empresa aprobada, pero requiere reintento/manual.
```

No mostrar ni esperar `inviteUrl` en la respuesta de approve.

## Recomendacion para QA

Validar en Azure:

```text
1. Empresa pending aprobada genera invite y envia email real de activacion.
2. Reaprobar/no duplicar si ya hay invite activo vigente.
3. Fallo controlado de email deja empresa published y devuelve warning.
4. Response y logs no exponen token completo, tokenHash, cookies ni secretos.
5. Endpoint manual de invite sigue funcionando para soporte interno.
```
