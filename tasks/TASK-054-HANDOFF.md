# TASK-054 Handoff - QA/Infra Azure smoke DELETE company services

## Objetivo

Validar en Azure real:

```text
DELETE /api/companies/me/services/{serviceId}
```

usando una sesion real de empresa, cookie real y Table Storage real.

## Resultado general

Estado: APROBADO.

El smoke autenticado contra Azure real paso completo:

- Credenciales admin cargadas desde `local-secrets/qa-admin.ps1`.
- Invitacion creada y aceptada correctamente.
- Servicio QA creado con `POST`.
- Servicio desactivado con `DELETE`.
- `GET /api/companies/me/services` refleja el servicio con `status: inactive`.
- `DELETE` sobre servicio inexistente responde `404`.
- Logout invalida la cookie.
- Luego del logout, `DELETE` responde `401`.

No se registraron secretos, token de invitacion ni cookie.

## Commit local verificado

```text
8a9d16d5bf0e2fcbfaa63a7ce08641ffe457dec4
8a9d16d Add company services delete endpoint
```

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
| Desactivar servicio QA con `DELETE` | `200` |
| `GET /api/companies/me/services` despues de DELETE | `200` |
| `DELETE` sobre servicio inexistente | `404` |
| Logout | `200` |
| `DELETE` despues de logout | `401` |

## Servicio creado y desactivado

```text
serviceId: service_e10ac0b1-7751-4063-af66-cf3da2eacca1
serviceName: QA Delete Service 20260528-20260528-094614
companyId: company_c0f05305-6b1d-4ba0-b4c2-cd987c324bd2
status: inactive
updatedAt: 2026-05-28T15:46:21.012Z
```

## Confirmaciones DELETE

Validaciones sobre respuesta `200`:

```text
companyMatches=True
statusInactive=True
updatedAtChanged=True
getShowsInactive=True
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

## Confirmacion de GET con inactive

Despues del `DELETE`, se ejecuto:

```text
GET /api/companies/me/services
```

Resultado:

```text
getAfterDeleteStatus=200
getShowsInactive=True
```

## Confirmacion logout y posterior 401

Resultado:

```text
logoutStatus=200
deleteAfterLogoutStatus=401
```

## Riesgos restantes

- El servicio QA creado queda persistido como `inactive` en Azure Table Storage.
- Falta validar aislamiento Empresa A vs Empresa B en Azure real para DELETE con dos sesiones reales.
- No existe endpoint de restauracion/reactivacion.
- La autenticacion admin sigue usando credenciales compartidas para QA; se mantiene pendiente rotar `ADMIN_PASSWORD` cuando cierre la ventana de pruebas.

## Recomendacion

Seguir con upload firmado de imagenes.

Desde QA/Infra Azure, `DELETE /api/companies/me/services/{serviceId}` queda aprobado para el flujo autenticado real de MVP. Product/Architect puede avanzar al siguiente bloque: upload firmado para imagenes de empresa/servicio.
