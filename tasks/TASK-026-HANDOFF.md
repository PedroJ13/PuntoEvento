# TASK-026: QA local/estructural endpoint admin invitaciones

## Estado

Completada.

## Resultado general

Aprobado para commit/deploy con observaciones.

La revision local/estructural del endpoint admin para generar invitaciones cumple los criterios de TASK-026:

- Sin errores de sintaxis JS.
- `function.json` expone solo `POST`.
- Route configurada como `admin/company-invites`.
- `authLevel: anonymous` es consistente con el patron admin actual porque el handler aplica Basic Auth.
- El handler usa Basic Auth admin via `requireAdminAuth`.
- El handler aplica `enforceAllowedOrigin`.
- `companyId` es requerido.
- Empresa inexistente devuelve `404`.
- Empresa existente crea invitacion `active`.
- La entidad persistida guarda `tokenHash`.
- La entidad persistida no guarda token plano.
- Response `201` incluye `inviteUrl`.
- Response `201` no incluye `tokenHash`, connection strings ni secretos.
- No se observaron cambios en `accept-invite`, `logout`, pagina publica ni `panel.html`.

No se llamo Azure real.
No se crearon invitaciones reales.
No se modifico codigo.

## Checks ejecutados

### Lectura obligatoria

Se leyeron:

- `AGENTS.md`
- `chat-start/QA.md`
- `docs/README.md`
- `docs/BACKLOG.md`
- `docs/API_CONTRACTS_MVP.md`
- `docs/DATA_MODEL.md`
- `docs/DECISION_LOG.md`
- `tasks/TASK-024-HANDOFF.md`
- `tasks/TASK-025-HANDOFF.md`

### Codigo revisado

Se revisaron:

- `api/admin-company-invites/function.json`
- `api/admin-company-invites/index.js`
- `api/shared/adminAuth.js`
- `api/shared/companyAuth.js`
- `api/shared/azure.js`
- `api/shared/config.js`

### Sintaxis JS

Comandos ejecutados:

```text
node --check api/admin-company-invites/index.js
node --check api/shared/companyAuth.js
node --check api/shared/azure.js
node --check api/shared/config.js
```

Resultado:

```text
OK, sin errores de sintaxis.
```

### function.json

Resultado validado:

```json
{
  "route": "admin/company-invites",
  "methods": ["post"],
  "authLevel": "anonymous",
  "onlyPost": true
}
```

Interpretacion:

```text
Correcto. La Function queda expuesta como POST /api/admin/company-invites y la proteccion real queda dentro del handler con Basic Auth admin.
```

### Pruebas con mocks

Se ejecuto el handler con mocks de Table Storage y config, sin credenciales reales.

Resultado resumido:

```json
{
  "statuses": {
    "noAuth": 401,
    "wrongAuth": 401,
    "missingCompanyId": 400,
    "missingCompany": 404,
    "missingEmail": 400,
    "forbiddenOrigin": 403,
    "okFallback": 201,
    "okProvidedEmail": 201
  },
  "authHeaders": {
    "noAuthHasWwwAuthenticate": true,
    "wrongAuthHasWwwAuthenticate": true
  },
  "okResponse": {
    "keys": [
      "companyId",
      "email",
      "expiresAt",
      "inviteId",
      "inviteUrl",
      "role"
    ],
    "hasInviteUrl": true,
    "inviteUrlIsAbsoluteWhenConfigured": true,
    "fallbackInviteUrlIsRelative": true,
    "hasTokenHash": false,
    "hasConnectionString": false
  },
  "persisted": [
    {
      "partitionKey": "company_ok",
      "rowKeyPrefixOk": true,
      "status": "active",
      "role": "company_owner",
      "email": "owner@example.com",
      "hasTokenHash": true,
      "hasPlainToken": false,
      "usedAt": "",
      "hasCreatedAt": true,
      "hasUpdatedAt": true,
      "hasExpiresAt": true
    },
    {
      "partitionKey": "company_ok",
      "rowKeyPrefixOk": true,
      "status": "active",
      "role": "company_owner",
      "email": "qa@example.com",
      "hasTokenHash": true,
      "hasPlainToken": false,
      "usedAt": "",
      "hasCreatedAt": true,
      "hasUpdatedAt": true,
      "hasExpiresAt": true
    }
  ],
  "callsIncludeEnsureAuthTables": true,
  "invitePersistCount": 2
}
```

Casos cubiertos:

- Sin auth: `401`.
- Auth incorrecto: `401`.
- Sin `companyId`: `400`.
- Company inexistente: `404`.
- Company sin email y request sin email: `400`.
- Origin no permitido: `403`.
- Company existente usando email de empresa: `201`.
- Company existente usando email del request: `201`.
- `APP_PUBLIC_URL` configurado genera `inviteUrl` absoluta.
- Sin `APP_PUBLIC_URL`, el fallback genera URL relativa.

## Hallazgos por severidad

No se encontraron P0, P1 ni P2.

### P3 - Sin auditoria de invitaciones generadas

El endpoint crea invitaciones reales, pero no registra que admin las genero ni desde que contexto.

Impacto:

```text
Aceptable para MVP cerrado, pero dificulta trazabilidad cuando haya mas personas operando el admin.
```

Recomendacion:

```text
Agregar AuditLog o campos createdBy/source cuando exista admin auth formal o identidad de operador.
```

### P3 - Basic Auth sigue siendo mecanismo temporal

El endpoint queda protegido con Basic Auth admin, igual que los endpoints admin existentes.

Impacto:

```text
Suficiente para entorno interno controlado, pero no ideal para operacion amplia.
```

Recomendacion:

```text
Mantenerlo solo como MVP interno y migrar luego a auth admin formal.
```

## Bloqueos

No hubo bloqueos para QA local/estructural.

No se ejecuto prueba real contra Azure porque esta tarea lo deja fuera de alcance.

## Riesgos

- `inviteUrl` contiene un token real en produccion; no debe registrarse en handoffs, logs ni chats.
- No hay rate limiting para `POST /api/admin/company-invites`.
- No hay rate limiting para `POST /api/company-auth/accept-invite`.
- Si `APP_PUBLIC_URL` falta en Azure, la response usara URL relativa. Es funcional, pero para QA Azure conviene confirmar el setting.
- La busqueda de invitacion por `tokenHash` en `accept-invite` sigue siendo scan por tabla; aceptable para MVP cerrado, pero no escala bien.
- El endpoint llama `getConfig()` antes de validar Basic Auth, siguiendo el patron admin existente. En ambientes mal configurados, una request sin auth podria fallar por config antes de llegar al `401`; en Azure configurado no deberia afectar.

## Recomendacion para Product/Architect

Aprobar TASK-026 para commit/deploy.

Siguiente paso recomendado:

```text
Infra debe desplegar TASK-025 y hacer smoke de POST /api/admin/company-invites sin exponer credenciales ni inviteUrl real.
```

Despues del deploy:

```text
QA debe repetir TASK-024 usando este endpoint para generar la invitacion controlada y validar accept-invite, cookie, reutilizacion de token y logout.
```
