# TASK-028: Infra investigar 404 endpoint admin invitaciones

## Equipo encargado

Infra Azure.

## Mensaje para iniciar el chat

```text
Lee este archivo de asignacion: tasks/TASK-028-assignment.md.
Sigue las instrucciones y al terminar actualiza `tasks/TASK-028-HANDOFF.md`.
```

## Archivos que debe leer antes de trabajar

Obligatorios:

- `AGENTS.md`
- `chat-start/INFRA_AZURE.md`
- `docs/README.md`
- `docs/BACKLOG.md`
- `docs/API_CONTRACTS_MVP.md`
- `tasks/TASK-027-HANDOFF.md`

Codigo/config relevante:

- `.github/workflows/azure-static-web-apps-zealous-field-08fdd720f.yml`
- `api/admin-company-invites/function.json`
- `api/admin-company-invites/index.js`
- `api/company-auth-logout/function.json`
- `api/company-auth-logout/index.js`
- `staticwebapp.config.json`
- `api/package.json`

## Objetivo

Resolver por que el endpoint nuevo:

```text
POST /api/admin/company-invites
```

devuelve `404` en Azure aunque `origin/main` contiene el commit:

```text
205ed30 Add admin company invite endpoint
```

## Contexto

TASK-027 confirmo:

- `origin/main` contiene `api/admin-company-invites`.
- Azure Static Web Apps environment esta `Ready`.
- Endpoint control `POST /api/company-auth/logout` responde `200`.
- Endpoint nuevo `POST /api/admin/company-invites` responde `404`.
- `POST /api/admin-company-invites` tambien responde `404`.

Esto sugiere que el artefacto/API runtime desplegado no incluye la Function nueva, o que el workflow no desplego realmente el commit esperado.

## Trabajo requerido

1. Revisar el ultimo GitHub Actions workflow de Static Web Apps para `main`.
2. Confirmar si el run corresponde al commit `205ed30`.
3. Revisar logs de build/deploy, especialmente seccion API/Oryx/Functions.
4. Confirmar si `api/admin-company-invites/function.json` fue detectado/empaquetado.
5. Si el run no corresponde o fallo silenciosamente, re-run deploy.
6. Si despues de re-run sigue `404`, documentar causa probable y recomendar siguiente accion:
   - ajuste workflow,
   - cambio de estructura de Function,
   - endpoint fallback,
   - consolidacion de endpoints,
   - o soporte Azure.

## Smoke esperado despues de resolver

```text
POST https://zealous-field-08fdd720f.7.azurestaticapps.net/api/admin/company-invites
{}
```

Esperado:

```text
401 Unauthorized
WWW-Authenticate: Basic realm="Punto Evento Admin"
```

Tambien confirmar que el control sigue vivo:

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
- No modificar codigo salvo que Product/Architect lo autorice en una tarea separada.

## Criterios de aceptacion

- Causa del `404` identificada o reducida con evidencia.
- Si se resuelve, smoke devuelve `401` sin auth.
- Si no se resuelve, recomendacion tecnica concreta para Backend/Infra.
- No se exponen credenciales ni tokens.

## Handoff requerido

Crear:

```text
tasks/TASK-028-HANDOFF.md
```

Debe incluir:

- Resultado general.
- Workflow run revisado, commit y estado.
- Hallazgos de logs.
- Acciones ejecutadas, por ejemplo re-run deploy.
- Resultado de smoke.
- Causa probable si sigue `404`.
- Recomendacion para Product/Architect.

## Al finalizar

Responder:

```text
Termine TASK-028. Product/Architect debe leer `tasks/TASK-028-HANDOFF.md`.
```
