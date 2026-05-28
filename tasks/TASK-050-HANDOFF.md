# TASK-050 Handoff - QA local/estructural PATCH company services

## Objetivo

Validar local y estructuralmente:

```text
PATCH /api/companies/me/services/{serviceId}
```

antes de commit, push o deploy.

## Resultado general

Estado: APROBADO.

El endpoint `PATCH /api/companies/me/services/{serviceId}` cumple el contrato local/estructural solicitado. No se encontraron bloqueos P0/P1/P2.

No se modifico codigo de aplicacion. Solo se creo este handoff.

## Archivos revisados

- `AGENTS.md`
- `chat-start/QA.md`
- `docs/BACKLOG.md`
- `docs/API_CONTRACTS_MVP.md`
- `docs/DATA_MODEL.md`
- `tasks/TASK-049-HANDOFF.md`
- `api/company-services-update/function.json`
- `api/company-services-update/index.js`
- `api/company-services-list/function.json`
- `api/company-services-list/index.js`
- `api/company-services-create/function.json`
- `api/company-services-create/index.js`
- `api/shared/companyAuth.js`
- `api/shared/config.js`
- `api/shared/azure.js`
- `api/shared/validation.js`

## Archivos tocados

- `tasks/TASK-050-HANDOFF.md`

## Comandos ejecutados

Validacion de sintaxis:

```powershell
& 'C:\Users\pj13e\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' --check api/company-services-update/index.js
& 'C:\Users\pj13e\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' --check api/company-services-list/index.js
& 'C:\Users\pj13e\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' --check api/company-services-create/index.js
& 'C:\Users\pj13e\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' --check api/shared/companyAuth.js
& 'C:\Users\pj13e\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' --check api/shared/config.js
& 'C:\Users\pj13e\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' --check api/shared/azure.js
& 'C:\Users\pj13e\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' --check api/shared/validation.js
```

Resultado: PASS, sin errores de sintaxis.

Validacion estructural de `api/company-services-update/function.json`:

```powershell
Get-Content -Raw -Path api/company-services-update/function.json | ConvertFrom-Json | Select-Object -ExpandProperty bindings | Format-List
```

Resultado:

```text
authLevel: anonymous
type: httpTrigger
methods: patch
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
  "cases": 18,
  "ensureAuthCalls": 12,
  "ensureServicesCalls": 6,
  "updatedService": "service_1"
}
```

## Casos probados

- `PATCH` sin sesion valida responde `401`.
- Metodo distinto de `PATCH` responde `405`.
- `PATCH` sin `serviceId` responde `400`.
- Body sin campos editables responde `400`.
- `name` presente pero vacio responde `400`.
- `category` presente pero vacio responde `400`.
- `eventTypes` presente pero no arreglo responde `400`.
- `gallery` presente pero no arreglo responde `400`.
- Servicio inexistente responde `404`.
- Servicio de otra empresa responde `404`.
- Slug duplicado en otro servicio de la misma empresa responde `409`.
- Sesion valida actualiza solo servicio propio y responde `200`.
- Inyeccion de `companyId`, `status`, `plan`, `sortBoost`, `isFeatured` y `featuredUntil` no modifica esos campos.
- Cambio de `name` regenera `slug`.
- Slug igual en la misma entidad actualizada no bloquea.
- `updatedAt` cambia.
- `createdAt` se conserva.
- `eventTypes` y `gallery` se devuelven como arreglos.
- Response `200` no expone metadata interna, hashes, tokens, cookies ni campos de ranking/monetizacion.
- `GET /api/companies/me/services` refleja los cambios del servicio actualizado.

## Hallazgos

No se encontraron hallazgos bloqueantes.

Observaciones no bloqueantes:

- La validacion fue local con mocks; falta smoke en Azure real despues de deploy.
- La unicidad de slug se valida con lectura previa en Table Storage; suficiente para MVP, pero no es una garantia atomica ante concurrencia.
- El endpoint conserva `status` aunque se edite contenido publico. Esto coincide con TASK-049; Product/Architect debe decidir si en una tarea futura un servicio `published` vuelve a `pending`.

## Riesgos restantes

- Falta validar `PATCH` en Azure real con cookie `pe_company_session`.
- Falta validar aislamiento Empresa A vs Empresa B en ambiente real para update.
- No se validan catalogos definitivos de `category` ni `eventTypes`, por estar fuera del alcance.
- No existe todavia endpoint de borrado logico o limpieza para datos QA.

## Recomendacion

Listo para commit/push desde QA local/estructural.

Siguiente paso recomendado: Product/Architect puede revisar y avanzar con commit/push de `PATCH`, luego QA/Infra Azure debe ejecutar smoke post-deploy con sesion real antes de conectar UI o depender de este endpoint en panel de empresa.
