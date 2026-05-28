# TASK-046 Handoff - Reintento smoke Azure autenticado company services

## Objetivo

Completar el smoke real en Azure de:

- `GET /api/companies/me/services`
- `POST /api/companies/me/services`

usando cookie real de empresa obtenida por invite flow.

## Resultado general

Estado: BLOQUEADO por precondicion obligatoria.

La asignacion exige que antes de ejecutar el smoke autenticado esten cargadas en la misma terminal PowerShell:

```powershell
$env:ADMIN_USERNAME
$env:ADMIN_PASSWORD
```

La verificacion segura de booleanos dio:

```text
ADMIN_USERNAME_SET=False
ADMIN_PASSWORD_SET=False
```

Por esa razon no se creo invitacion, no se acepto token, no se obtuvo cookie real `pe_company_session` y no se ejecuto escritura real en `Services`.

## URL base probada

```text
https://zealous-field-08fdd720f.7.azurestaticapps.net
```

En esta pasada no se hicieron requests autenticados contra la URL porque faltaban las credenciales admin requeridas para crear la sesion real.

## Commit local esperado

```text
e0133d38d31968528e1d346eeda40145d4dba1d1
e0133d3 Add company services create endpoint
```

No se confirmo el SHA desplegado en Azure desde esta pasada.

## Archivos revisados

- `AGENTS.md`
- `chat-start/QA.md`
- `chat-start/INFRA_AZURE.md`
- `docs/BACKLOG.md`
- `docs/API_CONTRACTS_MVP.md`
- `tasks/TASK-045-HANDOFF.md`
- `tools/test-company-invite-flow.ps1`
- `api/company-services-list/index.js`
- `api/company-services-create/index.js`

## Comandos ejecutados

```powershell
git rev-parse HEAD
git log -1 --oneline
$u = [bool]$env:ADMIN_USERNAME; $p = [bool]$env:ADMIN_PASSWORD; "ADMIN_USERNAME_SET=$u"; "ADMIN_PASSWORD_SET=$p"
```

Resultado:

```text
ADMIN_USERNAME_SET=False
ADMIN_PASSWORD_SET=False
```

No se ejecuto `tools/test-company-invite-flow.ps1` en esta pasada porque la precondicion ya habia fallado y el script requiere esas mismas variables.

## Status codes obtenidos

No se obtuvieron status codes nuevos en TASK-046 por falta de credenciales admin.

Se mantiene como antecedente de TASK-045:

| Caso | Resultado anterior |
| --- | --- |
| `GET /api/companies/me/services` sin cookie | `401` |
| `POST /api/companies/me/services` sin cookie | `401` |

## ServiceId creado

No aplica. No se creo servicio real.

## Confirmacion de no fuga metadata/ranking

No confirmada en Azure real en TASK-046 porque no hubo respuesta `201` autenticada.

La confirmacion local previa sigue documentada en `tasks/TASK-044-HANDOFF.md`, pero el smoke real sigue pendiente.

## Confirmacion duplicate 409

No confirmada. Requiere `POST` autenticado exitoso y segundo `POST` con el mismo `name`.

## Confirmacion logout y posterior 401

No confirmada. Requiere cookie real obtenida por invite flow.

## Hallazgos

### P1 - Reintento autenticado sigue bloqueado por falta de variables admin

La terminal usada para TASK-046 no tiene `ADMIN_USERNAME` ni `ADMIN_PASSWORD`. Esto bloquea el flujo de invitacion y, por extension, todos los casos autenticados solicitados.

Impacto:

```text
No se puede aprobar QA/Infra Azure de GET/POST company services con sesion real.
```

Recomendacion:

```text
Cargar ADMIN_USERNAME y ADMIN_PASSWORD en una terminal segura y relanzar esta tarea. No registrar los valores en archivos, logs ni handoffs.
```

## Riesgos restantes

- No se valido `GET /api/companies/me/services` con cookie real.
- No se valido `POST /api/companies/me/services` con cookie real.
- No se valido persistencia real en Table Storage `Services`.
- No se valido `companyId` real de la empresa QA en el servicio creado.
- No se valido `status: draft` en Azure real.
- No se valido que `eventTypes` y `gallery` vuelvan como arreglos en Azure real.
- No se valido que la respuesta real `201` oculte metadata interna y campos de ranking.
- No se valido duplicate `409`.
- No se valido logout y `401` posterior.

## Recomendacion

Corregir antes de avanzar con `PATCH`.

La recomendacion concreta es repetir TASK-046 solo cuando `ADMIN_USERNAME_SET=True` y `ADMIN_PASSWORD_SET=True` en la misma terminal PowerShell. Hasta completar ese smoke autenticado, Product/Architect no deberia considerar aprobado el despliegue real de `GET` y `POST /api/companies/me/services`.
