# TASK-192 HANDOFF: limpieza pre-lote real Azure

## Resumen

Infra Azure completo la limpieza conservadora pre-lote real en Azure Table Storage.

- Ambiente: `https://zealous-field-08fdd720f.7.azurestaticapps.net`
- Storage account: `storagepuntoevento`
- Fecha/hora de cleanup: `2026-06-01T21:35:57.4092249Z`
- Tipo de cleanup: soft cleanup solamente.
- Hard delete: no ejecutado.
- Borrado de blobs: no ejecutado.
- App settings: no modificados.
- Secretos/tokens/SAS/connection strings: no impresos ni documentados.

Aunque el usuario dio aprobacion general en caso de soft o hard delete, la asignacion indicaba explicitamente `No hard delete`; por eso se aplicaron solo cambios `merge` de estado.

## Inventario antes

Consulta inicial de `Companies` y `Services`:

| Tabla | Total |
|---|---:|
| Companies | 39 |
| Services | 43 |

Companies por status antes:

| Status | Count |
|---|---:|
| pending | 4 |
| published | 8 |
| rejected | 27 |

Clasificacion antes:

| Clasificacion | Count |
|---|---:|
| QA/test/demo/limpiar | 38 |
| rechazada previa/no tocar | 1 |

Tablas opcionales consultadas solo para conteo/diagnostico:

| Tabla | Count |
|---|---:|
| Users | 8 |
| CompanyInvites | 52 |
| CompanySessions | 52 |

No se imprimieron emails completos, tokens, hashes, cookies ni secretos.

## Criterio de clasificacion

Se clasifico como `QA/test/demo/limpiar` cuando habia evidencia clara en `name`, `slug`, `email`, `description` o identificadores operativos:

- `QA`
- `TASK`
- `test`
- `demo`
- `smoke`
- `example`
- `PO Test`
- entidades creadas por tareas `TASK-*`

Se clasifico como `rechazada previa/no tocar` la entidad `SMASH Costa Rica`, ya limpiada en `TASK-186`, sin volver a modificarla.

No aparecieron candidatas dudosas no rechazadas en este inventario: las 12 entidades no rechazadas tenian marcadores claros de QA/test/demo.

## Entidades afectadas

Se actualizaron 12 companias de `pending` o `published` a `rejected`, con:

- `rejectionReason = Prelaunch cleanup QA/test data`
- `updatedAt = 2026-06-01T21:35:57.4092249Z`

| Company ID | Slug | Antes | Despues |
|---|---|---|---|
| `company_b9e0dc37-60ae-4e2e-8aae-0097a85f0dbb` | `po-test-eventos-202606011421` | pending | rejected |
| `company_fe95eee2-4295-4a2b-8fea-404dea98aabc` | `qa-azure-registro-20260528234811` | pending | rejected |
| `company_12025b0c-5fcb-48c2-83ea-9218175fa4e8` | `qa-manual-registro-20260528235910` | pending | rejected |
| `company_474b834f-f379-4e37-8771-0759cd14ac65` | `qa-public-hidden-20260528192830` | pending | rejected |
| `company_e348a608-d899-4ab2-8393-6d1e2a68671d` | `demo-1` | published | rejected |
| `company_df560324-93eb-48df-ac55-e05efcb99250` | `demo-owner-jardines-del-sol` | published | rejected |
| `company_010e60dd-132c-4eb0-baa5-070c8f5d9867` | `intertec-costa-rica` | published | rejected |
| `company_c0f05305-6b1d-4ba0-b4c2-cd987c324bd2` | `qa-company-register-test` | published | rejected |
| `company_68f23798-cf29-4320-ab4a-a60870c4be59` | `qa-task-082-empresa-20260528222326` | published | rejected |
| `company_72bca9dd-08d9-4824-974d-ac0d4ee8a05d` | `qa-task-092-empresa-20260529132722` | published | rejected |
| `company_a2bca3bb-b947-40f4-928c-9a2f5671de0d` | `qa-task-100-empresa-20260529164030` | published | rejected |
| `company_186f6f73-244e-4a10-808a-29407b96021c` | `qa-task-184-invite-20260601112925` | published | rejected |

Tambien se actualizaron 21 servicios relacionados a companias QA/test/demo que aun no estaban `rejected`.

| Company ID | Service ID | Antes | Despues |
|---|---|---|---|
| `company_010e60dd-132c-4eb0-baa5-070c8f5d9867` | `service_565e326a-dda6-48f7-9c8d-bff73c53186d` | published | rejected |
| `company_010e60dd-132c-4eb0-baa5-070c8f5d9867` | `service_c2d84149-2773-4320-9ebf-5c8190ac4af2` | published | rejected |
| `company_35a2b2f7-87e4-47d3-a835-26bdd01bd350` | `service_1412cc0b-b84f-46d7-8c1d-3963fd0a74da` | published | rejected |
| `company_628bf41b-612a-4541-b2d0-920544b87af4` | `service_05ccf819-df36-47d7-ba63-11631ad0ec0c` | pending | rejected |
| `company_682241b9-a1f0-440d-aa30-67f007ff712c` | `service_67247ce4-bc83-4a63-8aaa-519f9b82eb5f` | pending | rejected |
| `company_68f23798-cf29-4320-ab4a-a60870c4be59` | `service_bd6082b4-9998-4f76-9bec-aa330aad9fac` | published | rejected |
| `company_68f23798-cf29-4320-ab4a-a60870c4be59` | `service_c4d223eb-d761-42b9-b229-2bc1bb3a04bf` | inactive | rejected |
| `company_72bca9dd-08d9-4824-974d-ac0d4ee8a05d` | `service_a14948f8-e889-46b5-865c-4ffbbb786999` | inactive | rejected |
| `company_a2bca3bb-b947-40f4-928c-9a2f5671de0d` | `service_d58de3ea-9f9c-46f9-937b-3f4cecc61ebf` | published | rejected |
| `company_b9e0dc37-60ae-4e2e-8aae-0097a85f0dbb` | `service_e6810f33-5ac2-40b6-ae53-52ce6e6479c5` | pending | rejected |
| `company_c0f05305-6b1d-4ba0-b4c2-cd987c324bd2` | `service_1829cc42-1a77-42e1-b482-22d2f6414b31` | draft | rejected |
| `company_c0f05305-6b1d-4ba0-b4c2-cd987c324bd2` | `service_1f8d9895-5006-480a-9ef2-c480db2caedc` | published | rejected |
| `company_c0f05305-6b1d-4ba0-b4c2-cd987c324bd2` | `service_2300d6c8-c3b5-43e9-b0ff-9c5acdb4c878` | published | rejected |
| `company_c0f05305-6b1d-4ba0-b4c2-cd987c324bd2` | `service_286f0394-9896-4a77-80e5-6961ee11de8a` | draft | rejected |
| `company_c0f05305-6b1d-4ba0-b4c2-cd987c324bd2` | `service_477d8dd6-351e-468c-a316-7690a99c6b14` | published | rejected |
| `company_c0f05305-6b1d-4ba0-b4c2-cd987c324bd2` | `service_57b80edc-9bb4-43f8-b957-7ffa8959b934` | published | rejected |
| `company_c0f05305-6b1d-4ba0-b4c2-cd987c324bd2` | `service_8f1c8975-a02b-4b94-9adb-b88585c2f461` | published | rejected |
| `company_c0f05305-6b1d-4ba0-b4c2-cd987c324bd2` | `service_e10ac0b1-7751-4063-af66-cf3da2eacca1` | inactive | rejected |
| `company_df560324-93eb-48df-ac55-e05efcb99250` | `service_31684a63-d1b9-4eb6-b5e1-75d7ce8663f7` | pending | rejected |
| `company_df560324-93eb-48df-ac55-e05efcb99250` | `service_c6296cdb-c2ae-473a-8dab-a30c40c561e4` | published | rejected |
| `company_e348a608-d899-4ab2-8393-6d1e2a68671d` | `service_3fbea2bb-74f3-4b88-bb4a-b79e31f59bf8` | published | rejected |

## Entidades no tocadas

- `company_c3b9f3ad-3a8b-4f81-b9c3-7c5ee6dbb60d` / `smash-costa-rica`: ya estaba `rejected` por `TASK-186`; no se modifico en esta tarea.
- Companias ya `rejected` con todos sus servicios ya `rejected`: no se reescribieron salvo los servicios QA que aun estaban en otro status.
- No hubo candidatas dudosas no rechazadas. Si Product considera que algun dato QA debe conservarse como fixture visible, tendria que recrearse de forma explicita y documentada.

## Inventario despues

Consulta posterior:

| Tabla | Total | Estado |
|---|---:|---|
| Companies | 39 | 39 `rejected` |
| Services | 43 | 43 `rejected` |

Validacion QA residual:

| Check | Resultado |
|---|---:|
| Companias QA/test/demo no rechazadas | 0 |
| Servicios QA/test/demo no rechazados | 0 |

Revalidacion no destructiva posterior:

- Fecha/hora: `2026-06-01T21:48:48.4828669Z`
- Companies: 39 total, 39 `rejected`.
- Services: 43 total, 43 `rejected`.
- No se ejecutaron merges, deletes ni cambios de configuracion en esta revalidacion.

## Verificacion publica

Se consulto `GET /api/public/services` en Azure con busquedas representativas. Todas devolvieron 0 resultados:

| Query | Resultados |
|---|---:|
| `qa` | 0 |
| `task` | 0 |
| `demo` | 0 |
| `smoke` | 0 |
| `po test` | 0 |
| `intertec` | 0 |
| `jardines` | 0 |
| `SMASH` | 0 |
| `smash-costa-rica` | 0 |

## Riesgos

- El ambiente queda sin companias ni servicios publicados. Esto es lo esperado para preparar el primer lote real, pero cualquier prueba publica que requiera resultados necesitara crear/aprobar un nuevo fixture controlado o una empresa real.
- Se preservaron entidades de `Users`, `CompanyInvites` y `CompanySessions`; solo se contaron. No se limpiaron sesiones/invitaciones para no tocar datos potencialmente utiles para auditoria de QA y porque el alcance pedia Companies/Services.
- Azure CLI mostro warnings de que consulto la account key por no usar `--connection-string`, `--account-key` ni `--sas-token`. No se imprimio ningun secreto.

## Recomendacion para Product / Architect / Release

- Aceptar que el catalogo publico queda limpio y vacio hasta aprobar la primera empresa real.
- Antes de invitar empresas reales, decidir si conviene crear un fixture demo documentado para QA futura o mantener Azure sin datos publicados.
- Si se quiere completar higiene operativa, abrir una tarea separada para revisar invitaciones/sesiones antiguas con criterio de retencion, sin mezclarla con la limpieza pre-lote real.

## Comandos usados

Comandos representativos, con secretos/redacciones donde aplica:

```powershell
git rev-parse --show-toplevel
Get-Content -Raw AGENTS.md
Get-Content -Raw chat-start/INFRA_AZURE.md
Get-Content -Raw tasks/TASK-192-assignment.md
Get-Content -Raw docs/MVP_RELEASE_STATUS.md
az storage entity query --account-name storagepuntoevento --auth-mode key --table-name Companies --output json
az storage entity query --account-name storagepuntoevento --auth-mode key --table-name Services --output json
az storage entity query --account-name storagepuntoevento --auth-mode key --table-name Users --output json
az storage entity query --account-name storagepuntoevento --auth-mode key --table-name CompanyInvites --output json
az storage entity query --account-name storagepuntoevento --auth-mode key --table-name CompanySessions --output json
az storage entity merge --account-name storagepuntoevento --auth-mode key --table-name Companies --entity PartitionKey=company RowKey=<company_id> status=rejected rejectionReason="Prelaunch cleanup QA/test data" updatedAt=<timestamp>
az storage entity merge --account-name storagepuntoevento --auth-mode key --table-name Services --entity PartitionKey=<company_id> RowKey=<service_id> status=rejected rejectionReason="Prelaunch cleanup QA/test data" updatedAt=<timestamp>
Invoke-RestMethod "https://zealous-field-08fdd720f.7.azurestaticapps.net/api/public/services?q=<query>&limit=20"
```

No se usaron comandos de hard delete ni comandos de borrado de blobs.

Revalidacion posterior no destructiva:

```powershell
az storage entity query --account-name storagepuntoevento --auth-mode key --table-name Companies --output json
az storage entity query --account-name storagepuntoevento --auth-mode key --table-name Services --output json
Invoke-RestMethod "https://zealous-field-08fdd720f.7.azurestaticapps.net/api/public/services?q=<query>&limit=20"
```
