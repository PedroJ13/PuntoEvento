# TASK-048 Handoff - Smoke Azure autenticado usando local-secrets

## Objetivo

Completar el smoke real en Azure de:

- `GET /api/companies/me/services`
- `POST /api/companies/me/services`

con cookie real de empresa obtenida por invite flow, cargando credenciales desde `local-secrets/qa-admin.ps1` sin exponer secretos.

## Resultado general

Estado: APROBADO.

El smoke autenticado contra Azure real paso completo:

- Credenciales admin cargadas desde `local-secrets/qa-admin.ps1`.
- Invitacion creada correctamente.
- Invitacion aceptada y cookie real de empresa usada en la misma sesion.
- `GET /api/companies/me/services` autenticado respondio `200`.
- `POST /api/companies/me/services` autenticado respondio `201`.
- El servicio creado pertenece a la empresa QA.
- El servicio queda en `status: draft`.
- `eventTypes` y `gallery` vuelven como arreglos.
- La respuesta no expone metadata interna ni campos de ranking.
- Segundo `POST` con el mismo `name` respondio `409`.
- El servicio creado aparece en el `GET` posterior.
- Logout respondio `200`.
- Luego del logout, `GET /api/companies/me/services` respondio `401`.

## Confirmacion booleana de variables cargadas

Comando ejecutado:

```powershell
. .\local-secrets\qa-admin.ps1
$u = [bool]$env:ADMIN_USERNAME
$p = [bool]$env:ADMIN_PASSWORD
"ADMIN_USERNAME_SET=$u"
"ADMIN_PASSWORD_SET=$p"
```

Resultado:

```text
ADMIN_USERNAME_SET=True
ADMIN_PASSWORD_SET=True
```

No se registraron valores reales de usuario, password, token de invitacion ni cookie.

## URL base probada

```text
https://zealous-field-08fdd720f.7.azurestaticapps.net
```

## Empresa QA objetivo

```text
companyId: company_c0f05305-6b1d-4ba0-b4c2-cd987c324bd2
email: qa-company-register-test@example.com
slug: qa-company-register-test
```

## Status codes obtenidos

| Caso | Status |
| --- | --- |
| Crear invitacion real | `201` |
| Aceptar invitacion | `200` |
| `GET /api/companies/me/services` con cookie antes de crear | `200` |
| `POST /api/companies/me/services` con payload valido | `201` |
| Segundo `POST` con el mismo `name` | `409` |
| `GET /api/companies/me/services` despues de crear | `200` |
| Logout | `200` |
| `GET /api/companies/me/services` despues de logout | `401` |

## Servicio creado

```text
serviceId: service_1829cc42-1a77-42e1-b482-22d2f6414b31
name: QA Mesa Dulce 20260528-20260528-082753
companyId: company_c0f05305-6b1d-4ba0-b4c2-cd987c324bd2
status: draft
```

Conteo del listado:

```text
GET antes de crear: 0 servicios
GET despues de crear: 1 servicio
createdListed: true
```

## Confirmaciones de contrato

Validaciones sobre la respuesta `201`:

```text
companyMatches=True
statusDraft=True
eventTypesIsArray=True
galleryIsArray=True
createdListed=True
```

Campos internos/ranking revisados como ausentes:

```text
partitionKey
PartitionKey
rowKey
RowKey
etag
odata.etag
timestamp
Timestamp
tokenHash
sessionHash
sortBoost
isFeatured
featuredUntil
rankingScore
metadata
```

Resultado:

```text
leakedKeys=[]
noMetadataRankingLeak=True
```

## Comando principal ejecutado

Se ejecuto un smoke PowerShell desde la raiz del repo que:

1. Cargo `local-secrets/qa-admin.ps1`.
2. Creo una invitacion real con `POST /api/internal/company-invites`.
3. Acepto la invitacion con `POST /api/company-auth/accept-invite`.
4. Conservo `WebRequestSession` para usar la cookie `pe_company_session`.
5. Ejecuto `GET /api/companies/me/services`.
6. Creo un servicio con `POST /api/companies/me/services`.
7. Repitio el `POST` con el mismo `name`.
8. Verifico el listado posterior.
9. Ejecuto logout.
10. Verifico `401` despues de logout.

La salida fue redactada y no incluyo secretos, token ni cookie.

## Riesgos restantes

- El servicio QA creado queda persistido en Azure Table Storage; no hay endpoint de limpieza/desactivacion todavia.
- Aun falta implementar y validar `PATCH /api/companies/me/services/{id}`.
- Aun falta validar aislamiento Empresa A vs Empresa B para servicios en Azure real.
- La autenticacion admin sigue usando credenciales compartidas para QA; se mantiene pendiente rotar `ADMIN_PASSWORD` cuando termine la ventana de pruebas controladas.
- No se confirmo el SHA exacto desplegado por una ruta de health/version; la prueba valida comportamiento real del ambiente.

## Recomendacion

Seguir con `PATCH /api/companies/me/services/{id}`.

Desde QA/Infra Azure, `GET` y `POST /api/companies/me/services` quedan aprobados para el flujo autenticado real de MVP. Product/Architect deberia considerar completado este bloque y planear la limpieza o desactivacion de datos QA cuando exista endpoint de administracion o borrado logico.
