# TASK-030: QA local/estructural endpoint internal invitaciones

## Estado

Completada.

## Resultado general

Aprobado para commit/deploy con observaciones.

La revision local/estructural confirma que el endpoint de invitaciones fue renombrado correctamente para evitar el prefijo reservado `admin`.

Endpoint final validado:

```text
POST /api/internal/company-invites
```

Function final validada:

```text
api/internal-company-invites
```

Se confirmo:

- La ruta final es `internal/company-invites`.
- `function.json` expone solo `POST`.
- `authLevel: anonymous` se mantiene, con Basic Auth admin aplicado dentro del handler.
- Ya no existen archivos activos `api/admin-company-invites/function.json` ni `api/admin-company-invites/index.js`.
- El handler mantiene `requireAdminAuth`.
- El handler mantiene `enforceAllowedOrigin`.
- El contrato de request/response se mantiene.
- Response `201` incluye `inviteUrl`.
- Response `201` no incluye `tokenHash`, token plano, connection strings ni secrets.
- Entidad persistida guarda `tokenHash`.
- Entidad persistida no guarda token plano.
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
- `docs/DECISION_LOG.md`
- `tasks/TASK-028-HANDOFF.md`
- `tasks/TASK-029-HANDOFF.md`

### Codigo revisado

Se revisaron:

- `api/internal-company-invites/function.json`
- `api/internal-company-invites/index.js`
- `api/shared/adminAuth.js`
- `api/shared/companyAuth.js`
- `api/shared/azure.js`
- `api/shared/config.js`

### Sintaxis JS

Comandos ejecutados:

```text
node --check api/internal-company-invites/index.js
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
  "route": "internal/company-invites",
  "methods": ["post"],
  "authLevel": "anonymous",
  "onlyPost": true,
  "oldAdminFunctionFilesExist": false
}
```

Interpretacion:

```text
Correcto. La Function final evita el prefijo reservado admin y no quedan archivos function.json/index.js activos en api/admin-company-invites.
```

Nota:

```text
La carpeta api/admin-company-invites aun aparece como directorio residual vacio en el workspace, pero no contiene function.json ni index.js y no deberia activar una Function en el build.
```

### Pruebas con mocks

Se ejecuto el handler `api/internal-company-invites/index.js` con mocks de Table Storage y config, sin credenciales reales.

Resultado resumido:

```json
{
  "statuses": {
    "wrongMethod": 405,
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
    "hasTokenField": false,
    "hasSecretLikeKey": false
  },
  "persisted": {
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
  },
  "callsIncludeEnsureAuthTables": true,
  "invitePersistCount": 2
}
```

Casos cubiertos:

- Metodo no permitido: `405`.
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

### Revision de cambios activos

`git diff --name-status` muestra el renombre/eliminacion esperado y docs relacionados:

```text
D api/admin-company-invites/function.json
D api/admin-company-invites/index.js
M docs/API_CONTRACTS_MVP.md
M docs/BACKLOG.md
M docs/DECISION_LOG.md
```

Ademas, `api/internal-company-invites/` aparece como carpeta nueva sin commit.

No aparecen cambios en:

```text
api/company-auth-accept-invite
api/company-auth-logout
index.html
app.js
styles.css
panel.html
```

## Hallazgos por severidad

No se encontraron P0, P1 ni P2.

### P3 - Carpeta vieja residual vacia

`api/admin-company-invites` aun existe como carpeta en el workspace, pero sin `function.json` ni `index.js`.

Impacto:

```text
No deberia activar una Function en Azure, porque no contiene archivos activos. Es ruido menor en el workspace.
```

Recomendacion:

```text
No bloquea commit/deploy. Si el equipo quiere limpieza visual, puede eliminarse la carpeta vacia en una tarea de housekeeping, siempre cuidando no usar comandos destructivos amplios.
```

### P3 - Endpoints admin legacy siguen con prefijo admin

El renombre solo cubre invitaciones. TASK-028 ya observo que endpoints legacy con prefijo `admin` pueden seguir devolviendo `404` en Azure.

Impacto:

```text
No bloquea TASK-030, pero el admin legacy puede seguir no operativo en Azure hasta renombrarlo.
```

Recomendacion:

```text
Planificar renombre gradual de endpoints admin legacy a internal/backoffice/ops.
```

## Bloqueos

No hubo bloqueos para QA local/estructural.

No se ejecuto prueba real contra Azure porque esta tarea lo deja fuera de alcance.

## Riesgos

- Hasta deploy, Azure seguira con el estado anterior.
- Si algun cliente o prueba usa `/api/admin/company-invites`, fallara; debe actualizarse a `/api/internal/company-invites`.
- `inviteUrl` contiene token real en produccion; no debe registrarse en handoffs, logs ni chats.
- Basic Auth admin sigue siendo mecanismo temporal MVP.
- No hay rate limiting para generar invitaciones ni para aceptar invitaciones.
- Si `APP_PUBLIC_URL` falta, `inviteUrl` sera relativa; funcional, pero QA Azure deberia confirmar configuracion.
- La busqueda de invitaciones por `tokenHash` en `accept-invite` sigue sin indice auxiliar; aceptable para MVP cerrado, pero no escala bien.

## Recomendacion para Product/Architect

Aprobar TASK-030 para commit/deploy.

Siguiente paso recomendado:

```text
Product/Architect debe commitear/pushear el renombre y luego Infra debe desplegar y hacer smoke de POST /api/internal/company-invites sin auth.
```

Smoke esperado post-deploy:

```text
POST /api/internal/company-invites
401 Unauthorized
WWW-Authenticate: Basic realm="Punto Evento Admin"
```

Despues:

```text
QA Azure debe repetir TASK-024 usando este endpoint para generar una invitacion controlada y validar accept-invite, cookie, reutilizacion de token y logout.
```
