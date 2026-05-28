# TASK-051 Handoff - QA/Infra Azure smoke PATCH company services

## Objetivo

Validar en Azure real:

```text
PATCH /api/companies/me/services/{serviceId}
```

usando una sesion real de empresa, cookie real y Table Storage real.

## Resultado general

Estado: APROBADO.

El smoke autenticado contra Azure real paso completo:

- Credenciales admin cargadas desde `local-secrets/qa-admin.ps1`.
- Invitacion creada y aceptada correctamente.
- Servicio QA creado con `POST`.
- Servicio actualizado con `PATCH`.
- `GET /api/companies/me/services` refleja los cambios.
- Inyeccion de campos no editables no afecta la respuesta publica ni el `status`.
- Slug duplicado en otro servicio responde `409`.
- Logout invalida la cookie.
- Luego del logout, `PATCH` responde `401`.

No se registraron secretos, token de invitacion ni cookie.

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

## Confirmacion booleana de credenciales

```text
ADMIN_USERNAME_SET=True
ADMIN_PASSWORD_SET=True
```

## Status codes obtenidos

| Caso | Status |
| --- | --- |
| Crear invitacion real | `201` |
| Aceptar invitacion | `200` |
| Crear servicio QA con `POST` | `201` |
| Actualizar servicio QA con `PATCH` | `200` |
| `GET /api/companies/me/services` despues de PATCH | `200` |
| Crear segundo servicio para duplicado | `201` |
| Intentar cambiar primer servicio al slug del segundo | `409` |
| Logout | `200` |
| `PATCH` despues de logout | `401` |

## Servicios creados

Servicio creado y actualizado:

```text
serviceId: service_286f0394-9896-4a77-80e5-6961ee11de8a
initialName: QA Patch Base 20260528-20260528-090858
updatedName: QA Patch Premium 20260528-20260528-090858
slug: qa-patch-premium-20260528-20260528-090858
companyId: company_c0f05305-6b1d-4ba0-b4c2-cd987c324bd2
status: draft
```

Segundo servicio usado para validar duplicado:

```text
secondServiceId: service_1f8d9895-5006-480a-9ef2-c480db2caedc
duplicateName: QA Patch Duplicate 20260528-20260528-090858
```

## Confirmaciones PATCH

Validaciones sobre respuesta `200`:

```text
companyMatches=True
statusStayedDraft=True
createdAtPreserved=True
updatedAtChanged=True
nameChanged=True
slugChanged=True
eventTypesIsArray=True
galleryIsArray=True
getReflectsPatch=True
```

Timestamps observados:

```text
createdAt: 2026-05-28T15:09:03.821Z
updatedAt: 2026-05-28T15:09:05.502Z
```

## Confirmacion de no fuga metadata/ranking

Campos revisados como ausentes en respuesta `200`:

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
token
cookie
pe_company_session
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

## Confirmacion duplicate 409

Se creo un segundo servicio QA y luego se intento cambiar el primer servicio al mismo `name` del segundo.

Resultado:

```text
duplicatePatchStatus=409
```

## Confirmacion logout y posterior 401

Resultado:

```text
logoutStatus=200
patchAfterLogoutStatus=401
```

## Riesgos restantes

- Los dos servicios QA creados quedan persistidos en Azure Table Storage; falta endpoint de limpieza o borrado logico.
- Falta validar aislamiento Empresa A vs Empresa B en Azure real con dos sesiones reales.
- La prueba confirma que campos no editables no aparecen ni alteran la respuesta publica; no inspecciona directamente columnas internas de Table Storage.
- La autenticacion admin sigue usando credenciales compartidas para QA; se mantiene pendiente rotar `ADMIN_PASSWORD` cuando cierre la ventana de pruebas.

## Recomendacion

Seguir con DELETE/borrado logico.

Desde QA/Infra Azure, `PATCH /api/companies/me/services/{serviceId}` queda aprobado para el flujo autenticado real de MVP. Product/Architect puede avanzar al siguiente bloque: endpoint de desactivacion/borrado logico de servicios propios.
