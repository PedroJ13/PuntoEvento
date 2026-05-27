# TASK-022: QA local/estructural auth por invitacion

## Equipo encargado

QA.

## Mensaje para iniciar el chat

```text
Lee este archivo de asignacion: tasks/TASK-022-assignment.md.
Sigue las instrucciones y al terminar actualiza `tasks/TASK-022-HANDOFF.md`.
```

## Archivos que debe leer antes de trabajar

Obligatorios:

- `AGENTS.md`
- `chat-start/QA.md`
- `docs/README.md`
- `docs/API_CONTRACTS_MVP.md`
- `docs/DATA_MODEL.md`
- `docs/DECISION_LOG.md`
- `docs/BACKLOG.md`
- `tasks/TASK-020-HANDOFF.md`
- `tasks/TASK-021-HANDOFF.md`

Codigo a revisar:

- `api/shared/config.js`
- `api/shared/azure.js`
- `api/shared/companyAuth.js`
- `api/company-auth-accept-invite/function.json`
- `api/company-auth-accept-invite/index.js`
- `api/company-auth-logout/function.json`
- `api/company-auth-logout/index.js`
- `api/companies-register/index.js`

## Objetivo

Validar local/estructuralmente la implementacion de autenticacion de empresa por invitacion antes de commit/push/deploy.

## Alcance

Revisar:

- Sintaxis JS de archivos modificados.
- `function.json` de nuevos endpoints.
- Contrato `POST /api/company-auth/accept-invite`.
- Contrato `POST /api/company-auth/logout`.
- Que no se modifique ni rompa `POST /api/companies/register`.
- Que no se devuelvan tokens, hashes ni secretos en responses.
- Que la cookie se configure como `HttpOnly`, `Secure`, `SameSite=Lax`, `Path=/api`.
- Que el helper permita derivar `companyId` desde sesion para `GET /api/companies/me`.

## Pruebas sugeridas

Ejecutar checks de sintaxis:

```text
node --check api/shared/companyAuth.js
node --check api/company-auth-accept-invite/index.js
node --check api/company-auth-logout/index.js
node --check api/shared/config.js
node --check api/shared/azure.js
```

Si el Node del sistema no esta disponible, usar el runtime bundled indicado en handoff TASK-021.

Validar manualmente:

- `function.json` expone `company-auth/accept-invite` solo con `post`.
- `function.json` expone `company-auth/logout` solo con `post`.
- `authLevel` sigue `anonymous`, pero la seguridad real esta en token/sesion.
- Errores de token no exponen detalles internos.
- Logout es idempotente.

## Si es posible hacer prueba local end-to-end

Solo si dependencias y variables locales estan disponibles:

- Crear invitacion controlada local.
- Probar `accept-invite`.
- Validar `Set-Cookie`.
- Probar `logout`.

Si no es posible por falta de `api/node_modules` o variables Azure, documentar bloqueo y dejarlo para QA Azure post-deploy.

## Fuera de alcance

- No crear datos reales en Azure.
- No borrar datos.
- No modificar codigo.
- No hacer commit.
- No probar `GET /api/companies/me` porque todavia no existe.

## Criterios de aceptacion

- Sin errores de sintaxis.
- Nuevos endpoints cumplen rutas/metodos.
- Contrato coincide con docs.
- No hay exposicion de secretos/token/hash en responses.
- Riesgos quedan documentados.
- Recomendacion clara: aprobar para commit/deploy o devolver a Backend.

## Handoff requerido

Crear:

```text
tasks/TASK-022-HANDOFF.md
```

Debe incluir:

- Resultado general.
- Checks ejecutados.
- Hallazgos por severidad si existen.
- Bloqueos.
- Riesgos.
- Recomendacion para Product/Architect.

## Al finalizar

Responder:

```text
Termine TASK-022. Product/Architect debe leer `tasks/TASK-022-HANDOFF.md`.
```
