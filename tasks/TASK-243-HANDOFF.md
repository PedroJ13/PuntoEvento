# TASK-243 - Handoff Backend/API

## Estado

Completado local/estructuralmente.

## Endpoints revisados

Todos los endpoints admin/internal que pasan por `requireAdminAuth`:

- `GET /api/internal/companies/pending`
- `POST /api/internal/companies/{companyId}/approve`
- `POST /api/internal/companies/{companyId}/reject`
- `GET /api/internal/services/pending`
- `POST /api/internal/services/{companyId}/{serviceId}/approve`
- `POST /api/internal/services/{companyId}/{serviceId}/reject`
- `GET /api/internal/uploads/pending`
- `GET /api/internal/uploads/{companyId}/{uploadId}/preview`
- `POST /api/internal/uploads/{companyId}/{uploadId}/approve`
- `POST /api/internal/uploads/{companyId}/{uploadId}/reject`
- `POST /api/internal/company-invites`
- Rutas legacy/alias admin que usan el mismo helper:
  - `/api/admin/pending-providers`
  - `/api/admin/approve-provider`
  - `/api/admin/reject-provider`
  - `/api/admin-pending-providers`
  - `/api/admin-approve-provider`
  - `/api/admin-reject-provider`

## Cambios aplicados

- `api/shared/adminAuth.js`
  - `unauthorized()` ya no devuelve header `WWW-Authenticate`.
  - Credenciales faltantes, mal formadas o invalidas responden:

```json
{
  "error": "Credenciales invalidas"
}
```

  - Status se mantiene en `401`.
  - Credencial valida sigue retornando `null` para permitir continuar el endpoint.
  - Se mantiene `X-Punto-Admin-Credential` como mecanismo recomendado.
  - Se mantiene compatibilidad con headers legacy que el helper ya aceptaba.

## Confirmacion de ausencia de `WWW-Authenticate`

- `rg -n "WWW-Authenticate" api` no encontro coincidencias.
- Respuesta estructural con credencial faltante/invalida no incluye `WWW-Authenticate`.

## Contrato esperado para error de credenciales

- Faltan credenciales o son invalidas:
  - `401`
  - JSON `{ "error": "Credenciales invalidas" }`
  - Sin `WWW-Authenticate`
- Faltan `ADMIN_USERNAME` o `ADMIN_PASSWORD` en configuracion:
  - `503`
  - JSON `{ "error": "Admin credentials are not configured" }`
- No se devuelve usuario esperado, password esperado, hashes, tokens, cookies ni metadata interna.

## Docs actualizados

- `docs/API_CONTRACTS_MVP.md`
  - Documenta `X-Punto-Admin-Credential`.
  - Documenta que el backend no debe responder `WWW-Authenticate`.
  - Documenta `401` JSON controlado para credenciales invalidas.
- `docs/ROUTE_MAP_MVP.md`
  - Agrega nota anti-prompt para API interna admin.

## Pruebas/checks ejecutados

- `node --check api/shared/adminAuth.js` OK.
- Smoke estructural con `node -e`:
  - credencial faltante -> `401` sin `WWW-Authenticate`.
  - credencial invalida -> `401` sin `WWW-Authenticate`.
  - credencial valida -> acceso permitido por helper.
- `rg -n "WWW-Authenticate" api` sin matches.
- `git diff --check -- api docs/API_CONTRACTS_MVP.md docs/ROUTE_MAP_MVP.md` OK.

## Riesgos

- No se probo contra navegador real ni Azure en esta tarea.
- `admin.js` debe seguir mostrando mensaje inline y no depender del prompt nativo.
- El helper sigue aceptando `Authorization` por compatibilidad; Web Dev debe preferir `X-Punto-Admin-Credential` y evitar enviar `Authorization` desde la UI admin.

## Recomendacion para Web Dev TASK-244

- Asegurar que `admin.js` convierta `401` con `{ "error": "Credenciales invalidas" }` en mensaje inline visible.
- Confirmar que no usa `Authorization`; usar solo `X-Punto-Admin-Credential`.
- Evitar reintentos automaticos que oculten el mensaje de error.

## Recomendacion para QA TASK-245

- Probar login admin con credenciales invalidas en navegador real.
- Confirmar que no aparece dialogo nativo `Sign in`.
- Confirmar que aparece mensaje inline controlado.
- Confirmar que credencial valida sigue cargando modelo nuevo/listados y acciones protegidas.
