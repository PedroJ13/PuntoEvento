# TASK-038: QA Azure GET companies me

## Equipo encargado

QA.

## Mensaje para iniciar el chat

```text
Lee este archivo de asignacion: tasks/TASK-038-assignment.md.
Sigue las instrucciones y al terminar actualiza `tasks/TASK-038-HANDOFF.md`.
```

## Archivos que debe leer antes de trabajar

Obligatorios:

- `AGENTS.md`
- `chat-start/QA.md`
- `docs/README.md`
- `docs/BACKLOG.md`
- `docs/API_CONTRACTS_MVP.md`
- `tasks/TASK-037-HANDOFF.md`

Codigo relevante:

- `api/companies-me/index.js`
- `api/company-auth-accept-invite/index.js`
- `api/company-auth-logout/index.js`
- `api/internal-company-invites/index.js`

## Objetivo

Validar en Azure:

```text
GET /api/companies/me
```

con y sin cookie real `pe_company_session`.

## Ambiente

URL base:

```text
https://zealous-field-08fdd720f.7.azurestaticapps.net
```

Empresa QA:

```text
companyId: company_c0f05305-6b1d-4ba0-b4c2-cd987c324bd2
email: qa-company-register-test@example.com
```

## Pruebas requeridas

### 1. Sin cookie

Request:

```text
GET /api/companies/me
```

Esperado:

```text
401 Unauthorized
```

### 2. Con cookie real

Crear una sesion real:

1. Generar invitacion con `POST /api/internal/company-invites`.
2. Aceptar invitacion con `POST /api/company-auth/accept-invite`.
3. Conservar cookie `pe_company_session`.
4. Ejecutar:

```text
GET /api/companies/me
Cookie: pe_company_session=<redacted>
```

Esperado:

```text
200
```

Body debe incluir:

- `id`
- `slug`
- `name`
- `status`
- `plan`
- `email`
- `whatsapp`
- `province`
- `canton`
- `description`

Body no debe incluir:

- `partitionKey`
- `rowKey`
- `etag`
- `timestamp`
- `tokenHash`
- `sessionHash`
- `pe_company_session`
- storage keys
- connection strings

### 3. Logout

Despues de validar `companies/me`, ejecutar:

```text
POST /api/company-auth/logout
```

con cookie real.

Esperado:

```text
200 { "ok": true }
```

### 4. Despues de logout

Volver a llamar:

```text
GET /api/companies/me
```

con la misma sesion/cookie jar.

Esperado:

```text
401 Unauthorized
```

## Seguridad

No documentar:

- credenciales admin
- inviteUrl completo
- token real
- cookie completa
- hashes
- storage secrets

## Fuera de alcance

- No probar PATCH.
- No probar servicios.
- No probar UI.
- No borrar empresa QA.

## Handoff requerido

Crear:

```text
tasks/TASK-038-HANDOFF.md
```

Debe incluir:

- Resultado general.
- Status codes.
- `inviteId` usado.
- Campos presentes en response `200`.
- Confirmacion de ausencia de metadatos internos.
- Resultado despues de logout.
- Riesgos.
- Recomendacion para Product/Architect.

## Al finalizar

Responder:

```text
Termine TASK-038. Product/Architect debe leer `tasks/TASK-038-HANDOFF.md`.
```
