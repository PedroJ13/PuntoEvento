# TASK-248 HANDOFF: limpieza total controlada de datos Azure

## Resumen ejecutivo

Infra Azure completo la limpieza total controlada de empresas, servicios y accesos operativos en Azure.

- Ambiente: `https://zealous-field-08fdd720f.7.azurestaticapps.net`
- Storage account: `storagepuntoevento`
- Fecha/hora de limpieza principal: `2026-06-06T13:50:21Z` a `2026-06-06T14:06:07Z`
- Estrategia: soft cleanup solamente.
- Hard delete: no ejecutado.
- Borrado de blobs: no ejecutado.
- App settings, secretos, dominio, DNS, pipeline y codigo: no modificados.
- Secretos/tokens/SAS/cookies/connection strings/hashes/passwords/emails reales: no impresos ni documentados.

Resultado final: Azure queda sin empresas, servicios, usuarios, invites, sesiones ni uploads en estado operativo. `GET /api/public/services?limit=50` devuelve 0 items.

## Inventario antes

Inventario inicial sanitizado antes de aplicar cambios:

| Tabla | Total | Status antes |
|---|---:|---|
| `Companies` | 48 | 45 `rejected`, 3 `published` |
| `Services` | 49 | 43 `rejected`, 2 `inactive`, 4 `published` |
| `Users` | 16 | 16 `active` |
| `CompanyInvites` | 65 | 54 `used`, 11 `active` |
| `CompanySessions` | 64 | 41 `active`, 23 `revoked` |
| `Uploads` | 52 | 21 `published`, 15 `pending`, 10 `rejected`, 6 `reserved` |

Empresas operativas encontradas:

| Company ID | Slug | Status antes |
|---|---|---|
| `company_462f0810-ae9c-4512-8461-6acc92af2bc7` | `fatima-wedding-54311d` | `published` |
| `company_e1042fa6-907d-4188-a058-4850975a4c1f` | `candycakes` | `published` |
| `company_f574b7d5-4969-4da5-995f-d83c346d368b` | `aurisbel-pasteleria` | `published` |

Servicios operativos publicados encontrados:

| Company ID | Service ID | Slug | Status antes |
|---|---|---|---|
| `company_462f0810-ae9c-4512-8461-6acc92af2bc7` | `service_70603b3a-53c4-4dbb-b4e8-bb06b5ac5851` | `organizacion-completa` | `published` |
| `company_e1042fa6-907d-4188-a058-4850975a4c1f` | `service_c63a8e86-7e0f-4b55-8b58-68f32a062073` | `pastel-xv-anos` | `published` |
| `company_f574b7d5-4969-4da5-995f-d83c346d368b` | `service_b964bd9a-2340-462e-bca0-b94eb26aa63a` | `pastel-boda` | `published` |
| `company_fd78e09b-5853-40c6-8d9f-9cdfb24e42c3` | `service_caa7eb18-5a7a-43e6-8edf-ae3491b353c2` | `catering-qa-task-202-20260603191027` | `published` |

## Estrategia aplicada

Se reutilizo el patron de limpiezas previas (`TASK-186` / `TASK-192`) con `az storage entity merge` y sin borrado fisico.

Cambios aplicados:

- `Companies`: toda entidad no `rejected` paso a `rejected`.
- `Services`: toda entidad no `rejected` paso a `rejected`, incluyendo servicios `inactive`, para dejar una condicion unica no operativa.
- `Users`: todo usuario `active` paso a `inactive`.
- `CompanyInvites`: todo invite `active` paso a `revoked`.
- `CompanySessions`: toda sesion `active` paso a `revoked`.
- `Uploads`: todo upload no `rejected` paso a `rejected`; no se tocaron blobs fisicos.

Campos de auditoria agregados cuando aplicaba:

- `cleanupTask=TASK-248`
- `updatedAt=<timestamp>`
- `rejectionReason` o `cleanupReason`
- `revokedAt` para invites/sesiones
- `disabledAt` para usuarios

## Entidades afectadas

Empresas afectadas por la limpieza principal:

| Company ID | Slug | Status despues |
|---|---|---|
| `company_462f0810-ae9c-4512-8461-6acc92af2bc7` | `fatima-wedding-54311d` | `rejected` |
| `company_e1042fa6-907d-4188-a058-4850975a4c1f` | `candycakes` | `rejected` |
| `company_f574b7d5-4969-4da5-995f-d83c346d368b` | `aurisbel-pasteleria` | `rejected` |

Servicios afectados por la limpieza:

| Company ID | Service ID | Slug | Status despues |
|---|---|---|---|
| `company_238c0b44-195e-4ef3-b4d6-192b574ffcef` | `service_4ea51318-ca75-44ae-bc93-9e3c0f42f2f1` | `catering-qa-task-212-20260604164154-editado` | `rejected` |
| `company_2577b235-99f6-4f7d-bbd6-25fde8e865d3` | `service_e4a7bdbb-9bbe-4774-bdd6-1b13644be868` | `catering-qa-task-208-20260604151750-editado` | `rejected` |
| `company_462f0810-ae9c-4512-8461-6acc92af2bc7` | `service_70603b3a-53c4-4dbb-b4e8-bb06b5ac5851` | `organizacion-completa` | `rejected` |
| `company_e1042fa6-907d-4188-a058-4850975a4c1f` | `service_c63a8e86-7e0f-4b55-8b58-68f32a062073` | `pastel-xv-anos` | `rejected` |
| `company_f574b7d5-4969-4da5-995f-d83c346d368b` | `service_b964bd9a-2340-462e-bca0-b94eb26aa63a` | `pastel-boda` | `rejected` |
| `company_fd78e09b-5853-40c6-8d9f-9cdfb24e42c3` | `service_caa7eb18-5a7a-43e6-8edf-ae3491b353c2` | `catering-qa-task-202-20260603191027` | `rejected` |

Accesos y uploads afectados:

| Tipo | Cambio |
|---|---:|
| Usuarios `active -> inactive` | 16 |
| Invites `active -> revoked` | 11 |
| Sesiones `active -> revoked` | 41 |
| Uploads no rechazados -> `rejected` | 42 |

Uploads por status anterior:

| Status anterior | Count |
|---|---:|
| `published` | 21 |
| `pending` | 15 |
| `reserved` | 6 |

## Conteo despues

Conteo despues de la limpieza principal, antes del smoke de registro:

| Tabla | Total | Status despues |
|---|---:|---|
| `Companies` | 48 | 48 `rejected` |
| `Services` | 49 | 49 `rejected` |
| `Users` | 16 | 16 `inactive` |
| `CompanyInvites` | 65 | 54 `used`, 11 `revoked` |
| `CompanySessions` | 64 | 64 `revoked` |
| `Uploads` | 52 | 52 `rejected` |

## Verificaciones

| Check | Resultado |
|---|---|
| No empresas `pending`/`published` por Table Storage | OK, 0 |
| No servicios `draft`/`pending`/`published`/`active` por Table Storage | OK, 0 |
| No usuarios `active` | OK, 0 |
| No invites `active` | OK, 0 |
| No sesiones `active` | OK, 0 |
| No uploads `pending`/`reserved`/`published` | OK, 0 |
| `GET /api/public/services?limit=50` antes del smoke | OK, 0 items |
| Registro nuevo post-cleanup | OK, `POST /api/companies/register` devolvio `201` |
| Limpieza del registro smoke | OK, empresa smoke paso a `rejected` |
| `GET /api/public/services?limit=50` despues del smoke | OK, 0 items |

Smoke de registro controlado:

| Company ID | Slug | Resultado |
|---|---|---|
| `company_8caced9f-f984-45ac-819d-61a10ba2332f` | `task-248-registro-smoke-20260606140453` | creado con `201`, luego `rejected` |

Conteo final despues del smoke y su limpieza:

| Tabla | Total | Status final |
|---|---:|---|
| `Companies` | 49 | 49 `rejected` |
| `Services` | 49 | 49 `rejected` |
| `Users` | 16 | 16 `inactive` |
| `CompanyInvites` | 65 | 54 `used`, 11 `revoked` |
| `CompanySessions` | 64 | 64 `revoked` |
| `Uploads` | 52 | 52 `rejected` |

## Datos no tocados

- No se borraron blobs fisicos. Los blobs que existan quedan como residuo no operativo; las entidades `Uploads` quedaron `rejected`.
- No se borraron tablas ni entidades completas.
- No se tocaron `CompanySlugs`, `Leads`, `AuditLog` ni tablas fuera del alcance solicitado.
- El smoke de registro pudo crear una reserva de slug para `task-248-registro-smoke-20260606140453`; queda documentada como residuo no operativo.

## Riesgos o residuos conocidos

- La limpieza es logica: las entidades siguen existiendo para trazabilidad, todas fuera de uso operativo.
- Blobs fisicos previos pueden seguir existiendo en Storage, pero no quedan enlazados a servicios/empresas operativas.
- El smoke de registro real pudo generar la notificacion interna normal de nueva empresa registrada. No se documento ningun destinatario real ni contenido sensible.
- Cualquier prueba publica que espere resultados debe registrar/aprobar una nueva empresa/servicio desde cero.

## Confirmacion de readiness

El ambiente Azure queda listo para registrar empresas desde cero:

- Registro nuevo validado con `201`.
- La empresa de smoke fue limpiada inmediatamente.
- Catalogo publico final en 0.
- Admin no deberia mostrar empresas/servicios/uploads pendientes porque los conteos de Table Storage quedan en 0 para estados revisables.
- Panel empresa no tiene usuarios/sesiones/invites activos asociados a datos previos.

## Comandos usados con secretos redactados

Comandos representativos ejecutados. No se imprimieron connection strings, account keys, SAS, tokens, cookies, hashes, passwords ni emails reales.

```powershell
git rev-parse --show-toplevel
Get-Content -Raw AGENTS.md
Get-Content -Raw chat-start/INFRA_AZURE.md
Get-Content -Raw docs/README.md
Get-Content -Raw docs/WORKFLOW_CODEX.md
Get-Content -Raw docs/MVP_RELEASE_STATUS.md
Get-Content -Raw docs/ARCHITECTURE.md
Get-Content -Raw docs/API_CONTRACTS_MVP.md
Get-Content -Raw tasks/TASK-248-assignment.md
Get-Content -Raw tasks/TASK-192-HANDOFF.md
Get-Content -Raw tasks/TASK-186-HANDOFF.md
az storage entity query --account-name storagepuntoevento --auth-mode key --table-name Companies --output json
az storage entity query --account-name storagepuntoevento --auth-mode key --table-name Services --output json
az storage entity query --account-name storagepuntoevento --auth-mode key --table-name Users --output json
az storage entity query --account-name storagepuntoevento --auth-mode key --table-name CompanyInvites --output json
az storage entity query --account-name storagepuntoevento --auth-mode key --table-name CompanySessions --output json
az storage entity query --account-name storagepuntoevento --auth-mode key --table-name Uploads --output json
az storage entity merge --account-name storagepuntoevento --auth-mode key --table-name Companies --entity PartitionKey=<pk> RowKey=<company_id> status=rejected rejectionReason=<redacted-cleanup-reason> cleanupTask=TASK-248 updatedAt=<timestamp>
az storage entity merge --account-name storagepuntoevento --auth-mode key --table-name Services --entity PartitionKey=<company_id> RowKey=<service_id> status=rejected rejectionReason=<redacted-cleanup-reason> cleanupTask=TASK-248 updatedAt=<timestamp>
az storage entity merge --account-name storagepuntoevento --auth-mode key --table-name Users --entity PartitionKey=<company_id> RowKey=<user_id> status=inactive disabledAt=<timestamp> cleanupReason=<redacted-cleanup-reason> cleanupTask=TASK-248 updatedAt=<timestamp>
az storage entity merge --account-name storagepuntoevento --auth-mode key --table-name CompanyInvites --entity PartitionKey=<company_id> RowKey=<invite_id> status=revoked revokedAt=<timestamp> cleanupReason=<redacted-cleanup-reason> cleanupTask=TASK-248 updatedAt=<timestamp>
az storage entity merge --account-name storagepuntoevento --auth-mode key --table-name CompanySessions --entity PartitionKey=<company_id> RowKey=<session_id> status=revoked revokedAt=<timestamp> cleanupReason=<redacted-cleanup-reason> cleanupTask=TASK-248 updatedAt=<timestamp>
az storage entity merge --account-name storagepuntoevento --auth-mode key --table-name Uploads --entity PartitionKey=<company_id> RowKey=<upload_id> status=rejected rejectionReason=<redacted-cleanup-reason> cleanupTask=TASK-248 updatedAt=<timestamp>
Invoke-RestMethod "https://zealous-field-08fdd720f.7.azurestaticapps.net/api/public/services?limit=50"
Invoke-WebRequest -Method Post "https://zealous-field-08fdd720f.7.azurestaticapps.net/api/companies/register" -ContentType "application/json" -Body <redacted-task-248-smoke-payload>
```

No se usaron comandos de hard delete, borrado de blobs, cambios de app settings, deploy ni pipeline.
