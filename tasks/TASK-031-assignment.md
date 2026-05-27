# TASK-031: Infra deploy/smoke endpoint internal invitaciones

## Equipo encargado

Infra Azure.

## Mensaje para iniciar el chat

```text
Lee este archivo de asignacion: tasks/TASK-031-assignment.md.
Sigue las instrucciones y al terminar actualiza `tasks/TASK-031-HANDOFF.md`.
```

## Archivos que debe leer antes de trabajar

Obligatorios:

- `AGENTS.md`
- `chat-start/INFRA_AZURE.md`
- `docs/README.md`
- `docs/BACKLOG.md`
- `docs/API_CONTRACTS_MVP.md`
- `docs/DECISION_LOG.md`
- `tasks/TASK-028-HANDOFF.md`
- `tasks/TASK-029-HANDOFF.md`
- `tasks/TASK-030-HANDOFF.md`

Codigo/config relevante:

- `api/internal-company-invites/function.json`
- `api/internal-company-invites/index.js`
- `api/shared/adminAuth.js`
- `.github/workflows/azure-static-web-apps-zealous-field-08fdd720f.yml`
- `staticwebapp.config.json`

## Objetivo

Confirmar deploy en Azure del endpoint interno para generar invitaciones de empresa, ya sin usar el prefijo reservado `admin`.

## Commit a verificar

Product/Architect debe haber hecho push de un commit posterior a TASK-030 que incluya:

```text
api/internal-company-invites/
```

y elimine del build activo:

```text
api/admin-company-invites/function.json
api/admin-company-invites/index.js
```

## Endpoint esperado

```text
POST /api/internal/company-invites
```

URL base:

```text
https://zealous-field-08fdd720f.7.azurestaticapps.net
```

## Trabajo requerido

1. Confirmar que `origin/main` contiene el commit con `api/internal-company-invites`.
2. Confirmar que Azure Static Web Apps desplego ese commit o que el environment esta `Ready` despues del push.
3. Ejecutar smoke sin credenciales:

```text
POST /api/internal/company-invites
{}
```

Resultado esperado:

```text
401 Unauthorized
WWW-Authenticate: Basic realm="Punto Evento Admin"
```

4. Confirmar que el endpoint viejo no se use para QA:

```text
POST /api/admin/company-invites
```

Puede devolver `404`; eso es aceptable.

5. Confirmar control:

```text
POST /api/company-auth/logout
```

Esperado:

```text
200 { "ok": true }
```

## Fuera de alcance

- No crear invitaciones reales.
- No usar credenciales admin para crear datos.
- No imprimir secrets.
- No modificar codigo.

## Criterios de aceptacion

- Endpoint nuevo responde en Azure.
- Sin auth devuelve `401`.
- Header `WWW-Authenticate` presente.
- Control `/api/company-auth/logout` sigue vivo.
- Riesgos documentados.
- Recomendacion clara para QA Azure.

## Handoff requerido

Crear:

```text
tasks/TASK-031-HANDOFF.md
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
Termine TASK-031. Product/Architect debe leer `tasks/TASK-031-HANDOFF.md`.
```
