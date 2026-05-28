# TASK-045 Handoff - QA/Infra Azure smoke company services GET y POST

## Objetivo

Validar en Azure real los endpoints:

- `GET /api/companies/me/services`
- `POST /api/companies/me/services`

usando una sesion real de empresa, cookie real y Table Storage real.

## Resultado general

Estado: BLOQUEADO por precondicion.

Se pudo validar parcialmente Azure sin cookie:

- `GET /api/companies/me/services` sin cookie responde `401`.
- `POST /api/companies/me/services` sin cookie responde `401`.
- Las rutas existen en Azure y no devuelven `404`.

No se pudo completar el smoke con sesion real porque la terminal no tiene cargadas las variables requeridas:

- `ADMIN_USERNAME`
- `ADMIN_PASSWORD`

El script oficial `tools/test-company-invite-flow.ps1` se detiene por esa precondicion antes de crear invitacion.

## URL base probada

```text
https://zealous-field-08fdd720f.7.azurestaticapps.net
```

## Commit desplegado

Commit local identificado:

```text
e0133d38d31968528e1d346eeda40145d4dba1d1
e0133d3 Add company services create endpoint
```

No se pudo confirmar desde Azure que ese commit exacto sea el actualmente desplegado. La respuesta `401` de ambos endpoints indica que las rutas `GET` y `POST` de `companies/me/services` estan disponibles en el ambiente probado, pero no prueba por si sola el SHA de deploy.

## Empresa QA objetivo

```text
companyId: company_c0f05305-6b1d-4ba0-b4c2-cd987c324bd2
email: qa-company-register-test@example.com
slug: qa-company-register-test
```

No se creo sesion real para esta empresa por falta de credenciales admin en el entorno.

## Comandos y requests ejecutados

Lectura de estado local:

```powershell
git rev-parse HEAD
git log -1 --oneline
$u = [bool]$env:ADMIN_USERNAME; $p = [bool]$env:ADMIN_PASSWORD; "ADMIN_USERNAME_SET=$u"; "ADMIN_PASSWORD_SET=$p"
```

Resultado de variables:

```text
ADMIN_USERNAME_SET=False
ADMIN_PASSWORD_SET=False
```

Smoke sin cookie:

```powershell
Invoke-WebRequest -Method GET -Uri "https://zealous-field-08fdd720f.7.azurestaticapps.net/api/companies/me/services"
```

Resultado:

```text
Status=401
```

Smoke `POST` sin cookie:

```powershell
Invoke-WebRequest -Method POST -Uri "https://zealous-field-08fdd720f.7.azurestaticapps.net/api/companies/me/services" -ContentType "application/json" -Body <payload QA>
```

Resultado:

```text
Status=401
```

Intento de flujo de invitacion:

```powershell
powershell -ExecutionPolicy Bypass -File tools/test-company-invite-flow.ps1
```

Resultado:

```text
ADMIN_USERNAME and ADMIN_PASSWORD must be set as environment variables in this PowerShell session.
```

## Status codes obtenidos

| Caso | Resultado |
| --- | --- |
| `GET /api/companies/me/services` sin cookie | `401` |
| `POST /api/companies/me/services` sin cookie | `401` |
| Crear invitacion real | No ejecutado, bloqueado por variables admin ausentes |
| Aceptar invitacion real | No ejecutado |
| `GET /api/companies/me/services` con cookie real | No ejecutado |
| `POST /api/companies/me/services` con cookie real | No ejecutado |
| Segundo `POST` duplicado | No ejecutado |
| `GET` lista servicio creado | No ejecutado |
| Logout y `GET` posterior | No ejecutado |

## ServiceId creado

No aplica. No se creo servicio real porque no hubo sesion de empresa.

## Confirmacion metadata/ranking

No se pudo confirmar en Azure real para respuesta `201` porque el `POST` autenticado no se ejecuto.

La confirmacion local previa quedo documentada en `tasks/TASK-044-HANDOFF.md`, pero TASK-045 sigue pendiente de validar contra Azure real.

## Hallazgos

### P1 - Smoke autenticado bloqueado por falta de credenciales admin en terminal

El flujo requiere crear o reutilizar sesion real de empresa mediante invite flow. Sin `ADMIN_USERNAME` y `ADMIN_PASSWORD`, no se puede crear invitacion ni obtener cookie real.

Impacto:

```text
Bloquea la validacion principal de TASK-045: GET/POST autenticados contra Azure real y persistencia en Services.
```

Recomendacion:

```text
Cargar ADMIN_USERNAME y ADMIN_PASSWORD en la terminal de QA o ejecutar el smoke desde una sesion segura que ya las tenga disponibles.
```

### P3 - Commit desplegado no verificable desde esta pasada

Se identifico el commit local `e0133d3`, pero no se obtuvo metadato remoto de deploy que confirme que ese SHA exacto esta publicado.

Impacto:

```text
Bajo para deteccion de ruta, porque ambos endpoints responden 401 en Azure; medio para trazabilidad de release.
```

Recomendacion:

```text
Registrar SHA de deploy en el pipeline o exponer una ruta segura de health/version para ambientes internos.
```

## Riesgos restantes

- No se valido escritura real en Table Storage `Services`.
- No se valido que el servicio creado quede con `companyId` de la empresa QA.
- No se valido `status: draft` en Azure real.
- No se valido que `eventTypes` y `gallery` vuelvan como arreglos en respuesta real `201`.
- No se valido ausencia de metadata interna ni campos de ranking en respuesta real `201`.
- No se valido `409` por duplicado en Azure real.
- No se valido que logout invalide cookie para este flujo.

## Pendientes

Cuando existan credenciales admin en la terminal segura:

1. Crear invitacion para `company_c0f05305-6b1d-4ba0-b4c2-cd987c324bd2`.
2. Aceptar invitacion y conservar `WebRequestSession`.
3. Ejecutar `GET /api/companies/me/services` con cookie.
4. Ejecutar `POST /api/companies/me/services` con payload unico por timestamp.
5. Validar payload `201`, `serviceId`, `companyId`, `status`, arrays y ausencia de metadata/ranking.
6. Repetir `POST` con mismo `name` y validar `409`.
7. Ejecutar `GET` con la misma cookie y confirmar que lista el servicio creado.
8. Ejecutar logout y confirmar que `GET` posterior devuelve `401`.

## Recomendacion para Product/Architect

Corregir la precondicion antes de avanzar con `PATCH`: cargar credenciales admin de QA de forma segura y repetir TASK-045 hasta completar el smoke autenticado. La evidencia parcial indica que las rutas estan desplegadas y protegidas sin cookie, pero todavia no hay confirmacion real de creacion/listado en `Services`.
