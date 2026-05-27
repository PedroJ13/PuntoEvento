# TASK-023: Infra deploy y settings auth por invitacion

## Equipo encargado

Infra Azure.

## Mensaje para iniciar el chat

```text
Lee este archivo de asignacion: tasks/TASK-023-assignment.md.
Sigue las instrucciones y al terminar actualiza `tasks/TASK-023-HANDOFF.md`.
```

## Archivos que debe leer antes de trabajar

Obligatorios:

- `AGENTS.md`
- `chat-start/INFRA_AZURE.md`
- `docs/README.md`
- `docs/BACKLOG.md`
- `docs/API_CONTRACTS_MVP.md`
- `docs/DECISION_LOG.md`
- `tasks/TASK-021-HANDOFF.md`
- `tasks/TASK-022-HANDOFF.md`

Codigo/config relevante:

- `api/shared/config.js`
- `api/shared/azure.js`
- `api/shared/companyAuth.js`
- `api/company-auth-accept-invite/function.json`
- `api/company-auth-logout/function.json`
- `staticwebapp.config.json`

## Objetivo

Confirmar deploy en Azure del bloque de autenticacion de empresas por invitacion y preparar app settings explicitos.

## Commit a verificar

```text
3283f67 Add company invite auth endpoints
```

Debe estar en:

```text
origin/main
```

## Endpoints nuevos esperados

```text
POST /api/company-auth/accept-invite
POST /api/company-auth/logout
```

URL base actual:

```text
https://zealous-field-08fdd720f.7.azurestaticapps.net
```

## Trabajo requerido

1. Confirmar que Azure Static Web Apps desplego el commit `3283f67`.
2. Confirmar que los endpoints nuevos existen.
3. No ejecutar tokens reales todavia salvo que Product/Architect lo autorice.
4. Configurar o recomendar configurar app settings explicitos:

```text
AZURE_TABLE_COMPANIES=Companies
AZURE_TABLE_COMPANY_INVITES=CompanyInvites
AZURE_TABLE_COMPANY_SESSIONS=CompanySessions
COMPANY_SESSION_COOKIE_NAME=pe_company_session
COMPANY_INVITE_TOKEN_TTL_MINUTES=1440
COMPANY_SESSION_TTL_DAYS=14
```

5. Confirmar si las tablas existen o si se crearan al primer uso:

```text
CompanyInvites
CompanySessions
```

6. Confirmar si Static Web Apps/Functions permite `Set-Cookie` desde los endpoints API integrados. Si no se puede confirmar sin token real, documentar como pendiente para QA Azure.

## Smoke no destructivo sugerido

Probar:

```text
POST /api/company-auth/accept-invite
```

con body vacio o sin token.

Resultado esperado:

```text
400 token is required
```

Probar:

```text
POST /api/company-auth/logout
```

sin cookie.

Resultado esperado:

```text
200 { "ok": true }
```

Debe incluir header `Set-Cookie` limpiando `pe_company_session`.

## Fuera de alcance

- No crear invitaciones reales.
- No generar tokens reales.
- No borrar registros QA.
- No modificar codigo.
- No hacer pruebas masivas.

## Criterios de aceptacion

- Commit desplegado o bloqueo documentado.
- Endpoints responden en Azure o bloqueo documentado.
- App settings revisados/configurados o recomendacion clara.
- Riesgos documentados.
- Siguiente paso para QA Azure claro.

## Handoff requerido

Crear:

```text
tasks/TASK-023-HANDOFF.md
```

Debe incluir:

- Resultado general.
- Commit desplegado confirmado o no.
- App settings actuales/recomendados, sin mostrar valores secretos.
- Status de smoke tests.
- Si `Set-Cookie` se observa en logout.
- Riesgos.
- Recomendacion para Product/Architect.

## Al finalizar

Responder:

```text
Termine TASK-023. Product/Architect debe leer `tasks/TASK-023-HANDOFF.md`.
```
