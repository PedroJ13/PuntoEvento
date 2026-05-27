# TASK-022: QA local/estructural auth por invitacion

## Equipo

QA.

## Estado

Completada.

## Resultado general

Aprobado con observaciones.

La implementacion local/estructural de autenticacion de empresa por invitacion cumple el objetivo de TASK-022:

- Los archivos JS modificados pasan `node --check`.
- Los nuevos `function.json` exponen solo `POST`.
- `POST /api/company-auth/accept-invite` coincide con el contrato base.
- `POST /api/company-auth/logout` coincide con el contrato base y es idempotente.
- La cookie de sesion se configura como `HttpOnly`, `Secure`, `SameSite=Lax`, `Path=/api`.
- Las responses no devuelven token, tokenHash, sessionHash ni secretos.
- `api/shared/companyAuth.js` permite derivar `companyId` desde la sesion porque la sesion usa `partitionKey` como `companyId`.
- `POST /api/companies/register` no fue modificado por este bloque y sigue separado del flujo de auth.

Observacion: no se hizo prueba end-to-end local con Azure Functions reales porque no existe `api/node_modules` ni variables locales de Azure Storage/Table en el workspace. Se ejecuto prueba controlada con mocks de Table Storage.

## Checks ejecutados

### Lectura obligatoria

- `AGENTS.md`
- `chat-start/QA.md`
- `docs/README.md`
- `docs/API_CONTRACTS_MVP.md`
- `docs/DATA_MODEL.md`
- `docs/DECISION_LOG.md`
- `docs/BACKLOG.md`
- `tasks/TASK-020-HANDOFF.md`
- `tasks/TASK-021-HANDOFF.md`

### Codigo revisado

- `api/shared/config.js`
- `api/shared/azure.js`
- `api/shared/companyAuth.js`
- `api/company-auth-accept-invite/function.json`
- `api/company-auth-accept-invite/index.js`
- `api/company-auth-logout/function.json`
- `api/company-auth-logout/index.js`
- `api/companies-register/index.js`

### Sintaxis JS

Comandos ejecutados con runtime bundled:

```text
node --check api/shared/companyAuth.js
node --check api/company-auth-accept-invite/index.js
node --check api/company-auth-logout/index.js
node --check api/shared/config.js
node --check api/shared/azure.js
```

Resultado:

```text
OK, sin errores de sintaxis.
```

### function.json

`api/company-auth-accept-invite/function.json`:

```text
route: company-auth/accept-invite
methods: ["post"]
authLevel: anonymous
```

`api/company-auth-logout/function.json`:

```text
route: company-auth/logout
methods: ["post"]
authLevel: anonymous
```

Interpretacion:

```text
authLevel anonymous es consistente con el contrato; la seguridad real depende de token/sesion.
```

### Prueba controlada con mocks

Se ejecuto `api/company-auth-accept-invite/index.js` y `api/company-auth-logout/index.js` con mocks de Table Storage.

Resultados relevantes:

```json
{
  "missingToken": {
    "status": 400,
    "body": { "error": "token is required" }
  },
  "methodNotAllowed": {
    "status": 405,
    "body": { "error": "Method not allowed" }
  },
  "acceptInviteValid": {
    "status": 200,
    "body": {
      "companyId": "company_qa_auth",
      "email": "qa-company@example.com",
      "role": "company_owner"
    },
    "setCookie": "pe_company_session=<session>; HttpOnly; Secure; SameSite=Lax; Path=/api; Max-Age=1209600"
  },
  "logoutWithCookie": {
    "status": 200,
    "body": { "ok": true },
    "setCookie": "pe_company_session=; HttpOnly; Secure; SameSite=Lax; Path=/api; Max-Age=0"
  },
  "logoutNoCookie": {
    "status": 200,
    "body": { "ok": true },
    "setCookie": "pe_company_session=; HttpOnly; Secure; SameSite=Lax; Path=/api; Max-Age=0"
  }
}
```

Estado simulado despues de aceptar/logout:

```text
Invitacion marcada used: true
Sesion creada: true
Sesion guarda sessionHash, no sessionToken: true
Logout marca sesion revoked: true
Responses sin token/hash/secret/password: true
```

## Hallazgos por severidad

No se encontraron P0, P1 ni P2.

### P3 - Mensaje de invitacion reutilizada puede no coincidir con el contrato documentado

`validateActiveInvite()` revisa primero:

```text
invite.status !== "active"
```

y despues:

```text
invite.usedAt
```

Como `markInviteUsed()` guarda `status: "used"` y `usedAt`, una reutilizacion normal de token probablemente respondera:

```text
Invitation is not active
```

en vez de:

```text
Invitation was already used
```

Impacto:

- No expone secretos.
- No rompe seguridad.
- Es una diferencia menor entre contrato/documentacion y copy real de error.

Recomendacion:

- Backend puede ajustar el orden de validacion si Product/QA necesita distinguir token usado de token inactivo/revocado.

## Bloqueos

- No se pudo ejecutar Azure Functions local end-to-end real porque el workspace no tiene `api/node_modules`.
- No hay variables locales de Azure Storage/Table configuradas para crear invitaciones/sesiones reales.
- `GET /api/companies/me` todavia no existe, por lo que solo se valido que el helper permite derivar `companyId` desde la sesion.

## Riesgos

- `accept-invite` crea sesion y luego marca invitacion como usada; en concurrencia extrema podria existir carrera si dos requests usan el mismo token simultaneamente.
- La busqueda por `tokenHash` y `sessionHash` sin `PartitionKey` puede ser aceptable para MVP cerrado, pero no escala bien en Table Storage.
- Falta rate limiting/anti brute force para `accept-invite`.
- La cookie usa `Secure`; en local HTTP puede no persistir en navegador, por lo que debe validarse en Azure/HTTPS.
- No hay endpoint admin para generar invitaciones; la prueba real dependera de invitacion manual o herramienta controlada.
- No hay cleanup automatico de invitaciones/sesiones vencidas.

## Recomendacion para Product/Architect

Aprobar TASK-022 para commit/deploy con observaciones.

Antes de abrir el flujo a empresas reales, recomiendo:

- QA Azure con invitacion controlada real.
- Confirmar `Set-Cookie` en navegador HTTPS.
- Validar reutilizacion de token usado/vencido/revocado.
- Agregar rate limiting o mitigacion anti-fuerza bruta.
- Decidir si se ajusta el mensaje de token usado para coincidir exactamente con el contrato.
