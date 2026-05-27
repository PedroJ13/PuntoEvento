# TASK-027: Infra deploy/smoke endpoint admin invitaciones

## Equipo encargado

Infra Azure.

## Mensaje para iniciar el chat

```text
Lee este archivo de asignacion: tasks/TASK-027-assignment.md.
Sigue las instrucciones y al terminar actualiza `tasks/TASK-027-HANDOFF.md`.
```

## Archivos que debe leer antes de trabajar

Obligatorios:

- `AGENTS.md`
- `chat-start/INFRA_AZURE.md`
- `docs/README.md`
- `docs/BACKLOG.md`
- `docs/API_CONTRACTS_MVP.md`
- `tasks/TASK-025-HANDOFF.md`
- `tasks/TASK-026-HANDOFF.md`

Codigo/config relevante:

- `api/admin-company-invites/function.json`
- `api/admin-company-invites/index.js`
- `api/shared/adminAuth.js`
- `api/shared/companyAuth.js`
- `api/shared/config.js`
- `staticwebapp.config.json`

## Objetivo

Confirmar deploy en Azure del endpoint admin para generar invitaciones de empresa y hacer smoke sin exponer credenciales ni tokens reales.

## Commit a verificar

Product/Architect debe haber hecho push de un commit posterior a TASK-026 que incluya:

```text
api/admin-company-invites/
```

## Endpoint esperado

```text
POST /api/admin/company-invites
```

URL base:

```text
https://zealous-field-08fdd720f.7.azurestaticapps.net
```

## Trabajo requerido

1. Confirmar que `origin/main` contiene el commit con `api/admin-company-invites`.
2. Confirmar que Azure Static Web Apps desplego ese commit o que el environment esta `Ready` despues del push.
3. Ejecutar smoke sin credenciales:

```text
POST /api/admin/company-invites
{}
```

Resultado esperado:

```text
401 Unauthorized
WWW-Authenticate: Basic realm="Punto Evento Admin"
```

4. Opcional, si el entorno de Infra tiene credenciales admin y Product/Architect lo permite:

Ejecutar una prueba con Basic Auth y `companyId` inexistente para confirmar routing/auth sin crear invitacion:

```json
{
  "companyId": "company_missing_for_smoke"
}
```

Resultado esperado:

```text
404 Company not found
```

No crear invitacion real en esta tarea salvo autorizacion explicita.

## Fuera de alcance

- No crear invitaciones reales.
- No imprimir credenciales admin.
- No imprimir `inviteUrl` ni tokens.
- No borrar entidades.
- No modificar codigo.

## Criterios de aceptacion

- Endpoint responde en Azure.
- Sin auth devuelve `401`.
- Header `WWW-Authenticate` presente.
- Si se hace prueba autenticada no mutante, devuelve `404` para company inexistente.
- Riesgos documentados.
- Recomendacion clara para QA Azure.

## Handoff requerido

Crear:

```text
tasks/TASK-027-HANDOFF.md
```

Debe incluir:

- Resultado general.
- Commit desplegado confirmado o no.
- Smoke tests ejecutados.
- Status codes.
- Headers relevantes sin credenciales.
- Riesgos.
- Recomendacion para Product/Architect.

## Al finalizar

Responder:

```text
Termine TASK-027. Product/Architect debe leer `tasks/TASK-027-HANDOFF.md`.
```
