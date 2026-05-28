# TASK-053 Handoff - QA local/estructural DELETE company services

## Objetivo

Validar local y estructuralmente:

```text
DELETE /api/companies/me/services/{serviceId}
```

antes de commit, push o deploy.

## Resultado general

Estado: APROBADO.

El endpoint `DELETE /api/companies/me/services/{serviceId}` cumple el contrato local/estructural solicitado para borrado logico. No se encontraron bloqueos P0/P1/P2.

No se modifico codigo de aplicacion. Solo se creo este handoff.

## Archivos revisados

- `AGENTS.md`
- `chat-start/QA.md`
- `docs/BACKLOG.md`
- `docs/API_CONTRACTS_MVP.md`
- `docs/DATA_MODEL.md`
- `tasks/TASK-052-HANDOFF.md`
- `api/company-services-delete/function.json`
- `api/company-services-delete/index.js`
- `api/company-services-list/function.json`
- `api/company-services-list/index.js`
- `api/shared/companyAuth.js`
- `api/shared/config.js`
- `api/shared/azure.js`

## Archivos tocados

- `tasks/TASK-053-HANDOFF.md`

## Comandos ejecutados

Validacion de sintaxis:

```powershell
& 'C:\Users\pj13e\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' --check api/company-services-delete/index.js
& 'C:\Users\pj13e\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' --check api/company-services-list/index.js
& 'C:\Users\pj13e\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' --check api/shared/companyAuth.js
& 'C:\Users\pj13e\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' --check api/shared/config.js
& 'C:\Users\pj13e\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' --check api/shared/azure.js
```

Resultado: PASS, sin errores de sintaxis.

Validacion estructural de `api/company-services-delete/function.json`:

```powershell
Get-Content -Raw -Path api/company-services-delete/function.json | ConvertFrom-Json | Select-Object -ExpandProperty bindings | Format-List
```

Resultado:

```text
authLevel: anonymous
type: httpTrigger
methods: delete
route: companies/me/services/{serviceId}
```

Prueba local con mocks en memoria:

```powershell
<script Node inline con mocks de Azure Table Storage, sesion de empresa y odata>
```

Resultado:

```json
{
  "ok": true,
  "cases": 11,
  "ensureAuthCalls": 5,
  "ensureServicesCalls": 4,
  "updateCalls": 1,
  "stillPersisted": true
}
```

## Casos probados

- `DELETE` sin sesion valida responde `401`.
- Metodo distinto de `DELETE` responde `405`.
- `DELETE` sin `serviceId` responde `400`.
- Servicio inexistente responde `404`.
- Servicio de otra empresa responde `404`.
- Sesion valida desactiva solo servicio propio y responde `200`.
- Inyeccion de `companyId`, `status`, `sortBoost`, `isFeatured` y `featuredUntil` no cambia el objetivo ni expone esos campos.
- No borra fisicamente la entidad.
- Persistencia queda con `status: inactive`.
- `updatedAt` cambia.
- `createdAt` se conserva.
- Response `200` no expone metadata interna, hashes, tokens, cookies ni campos de ranking/monetizacion.
- `GET /api/companies/me/services` refleja el servicio con `status: inactive`.

## Hallazgos

No se encontraron hallazgos bloqueantes.

Observaciones no bloqueantes:

- La validacion fue local con mocks; falta smoke en Azure real despues de deploy.
- El endpoint es logicamente idempotente respecto al estado final (`inactive`), pero una segunda llamada volveria a actualizar `updatedAt`.
- El servicio inactivo sigue apareciendo en el listado privado porque el contrato actual lo espera para el panel empresa.

## Riesgos restantes

- Falta validar `DELETE` en Azure real con cookie `pe_company_session`.
- Falta validar aislamiento Empresa A vs Empresa B en ambiente real para desactivacion.
- No existe endpoint de restauracion/reactivacion.
- La limpieza de datos QA dependera de este endpoint una vez desplegado, o de una herramienta admin futura.

## Recomendacion

Listo para commit/push desde QA local/estructural.

Siguiente paso recomendado: Product/Architect puede revisar y avanzar con commit/push de `DELETE`, luego QA/Infra Azure debe ejecutar smoke post-deploy con sesion real. Despues de eso, el siguiente bloque tecnico puede ser upload firmado para imagenes de empresa/servicio.
