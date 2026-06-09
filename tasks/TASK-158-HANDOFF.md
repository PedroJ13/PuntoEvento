# TASK-158: Backend/API - login empresa email/password

## Estado

Completada local/estructuralmente.

## Endpoints creados

```text
POST /api/company-auth/activate
POST /api/company-auth/login
```

`POST /api/company-auth/activate` activa una invitacion existente y define password inicial. Mantiene intacto `POST /api/company-auth/accept-invite`.

`POST /api/company-auth/login` permite acceso recurrente con email/password y crea la misma cookie server-side `pe_company_session`.

## Reglas implementadas

- Password nunca se guarda plano.
- Password se guarda como `passwordHash` con `scrypt` y salt aleatorio en tabla `Users`.
- Sesiones siguen en `CompanySessions` con hash de sesion server-side.
- Empresas `pending` y `published` pueden activar/login.
- Empresas `rejected`, `suspended` u otros estados no permitidos reciben `403`.
- Email/password invalido, usuario inactivo o empresa inexistente responde `401` generico en login.
- Respuestas no devuelven `passwordHash`, token, cookie cruda, `partitionKey`, `rowKey` ni metadata interna.

## Archivos cambiados

- `api/company-auth-activate/function.json`
- `api/company-auth-activate/index.js`
- `api/company-auth-login/function.json`
- `api/company-auth-login/index.js`
- `api/shared/companyAuth.js`
- `api/shared/azure.js`
- `api/shared/config.js`
- `docs/API_CONTRACTS_MVP.md`
- `docs/DATA_MODEL.md`
- `docs/ROUTE_MAP_MVP.md`
- `docs/ARCHITECTURE.md`

## Docs actualizados

- `docs/API_CONTRACTS_MVP.md`: contratos de `activate` y `login`.
- `docs/DATA_MODEL.md`: `User.passwordHash`, `passwordSetAt` y reglas de acceso.
- `docs/ROUTE_MAP_MVP.md`: nuevas rutas de panel empresa.
- `docs/ARCHITECTURE.md`: variables opcionales `AZURE_TABLE_USERS`.

## Verificacion ejecutada

```text
node --check api/shared/config.js
node --check api/shared/azure.js
node --check api/shared/companyAuth.js
node --check api/company-auth-activate/index.js
node --check api/company-auth-login/index.js
```

Resultado: OK.

Validacion estructural de rutas:

```json
[
  {
    "route": "company-auth/activate",
    "methods": "post",
    "authLevel": "anonymous"
  },
  {
    "route": "company-auth/login",
    "methods": "post",
    "authLevel": "anonymous"
  }
]
```

## Riesgos y decisiones pendientes

- No se ejecuto prueba contra Azure real ni Table Storage real.
- No hay rate limiting ni lockout por intentos fallidos.
- `findUserByEmail` escanea `Users` por email; aceptable para pre-lanzamiento, no para escala.
- Falta definir si email de empresa debe ser unico globalmente antes de invitar muchas empresas.

## Siguiente recomendado

Web Dev:

```text
Implementar UI de activacion con password usando /api/company-auth/activate y login recurrente usando /api/company-auth/login.
```

QA:

```text
Validar activacion por invitacion, login valido, password invalido, empresa inexistente, empresa rejected/suspended, logout y no exposicion de hashes/tokens.
```
