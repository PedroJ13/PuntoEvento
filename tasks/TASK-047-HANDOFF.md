# TASK-047 Handoff - Reintento final smoke Azure autenticado

## Objetivo

Completar el smoke real en Azure de:

- `GET /api/companies/me/services`
- `POST /api/companies/me/services`

con cookie real de empresa obtenida por invite flow.

## Resultado general

Estado: BLOQUEADO por precondicion obligatoria.

La asignacion exige verificar, en la misma terminal PowerShell donde se ejecutara la prueba, que las variables admin esten cargadas. La verificacion booleana dio:

```text
ADMIN_USERNAME_SET=False
ADMIN_PASSWORD_SET=False
```

Resultado esperado por la tarea:

```text
ADMIN_USERNAME_SET=True
ADMIN_PASSWORD_SET=True
```

Por esta razon no se ejecuto el invite flow, no se acepto invitacion, no se obtuvo cookie real `pe_company_session` y no se realizaron requests autenticados contra `GET` o `POST /api/companies/me/services`.

## Confirmacion booleana de variables

Comando ejecutado:

```powershell
$u = [bool]$env:ADMIN_USERNAME
$p = [bool]$env:ADMIN_PASSWORD
"ADMIN_USERNAME_SET=$u"
"ADMIN_PASSWORD_SET=$p"
```

Resultado:

```text
ADMIN_USERNAME_SET=False
ADMIN_PASSWORD_SET=False
```

No se escribieron valores reales de usuario/password en este handoff.

## URL base probada

```text
https://zealous-field-08fdd720f.7.azurestaticapps.net
```

No se hicieron requests nuevos a la URL en TASK-047 porque fallo la precondicion antes del smoke autenticado.

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
- `tasks/TASK-046-HANDOFF.md`
- `tools/test-company-invite-flow.ps1`
- `api/company-services-list/index.js`
- `api/company-services-create/index.js`

## Status codes obtenidos

No se obtuvieron status codes nuevos en TASK-047 porque la precondicion fallo antes de ejecutar requests autenticados.

Antecedente de TASK-045:

| Caso | Resultado anterior |
| --- | --- |
| `GET /api/companies/me/services` sin cookie | `401` |
| `POST /api/companies/me/services` sin cookie | `401` |

## ServiceId creado

No aplica. No se creo servicio real.

## Confirmacion de no fuga metadata/ranking

No confirmada en Azure real en TASK-047 porque no hubo respuesta autenticada `201`.

La confirmacion local previa sigue documentada en `tasks/TASK-044-HANDOFF.md`, pero el smoke real permanece pendiente.

## Confirmacion duplicate 409

No confirmada. Requiere crear primero un servicio con `POST` autenticado y repetir el mismo `name`.

## Confirmacion logout y posterior 401

No confirmada. Requiere cookie real obtenida por invite flow.

## Hallazgos

### P1 - Reintento final sigue sin variables admin visibles para la ejecucion

Aunque el contexto de la tarea indica que la terminal fue corregida, el proceso donde se ejecutaron los comandos de TASK-047 sigue viendo:

```text
ADMIN_USERNAME_SET=False
ADMIN_PASSWORD_SET=False
```

Impacto:

```text
Bloquea por completo el smoke autenticado de company services en Azure real.
```

Recomendacion:

```text
Cargar ADMIN_USERNAME y ADMIN_PASSWORD en el mismo entorno/proceso usado para ejecutar comandos de QA, o ejecutar el smoke desde una terminal segura donde la verificacion booleana ya de True/True.
```

## Riesgos restantes

- No se valido `GET /api/companies/me/services` con cookie real.
- No se valido `POST /api/companies/me/services` con cookie real.
- No se valido escritura real en Table Storage `Services`.
- No se valido `companyId`, `status: draft`, arrays ni ocultamiento de metadata/ranking en respuesta real.
- No se valido duplicate `409`.
- No se valido logout ni `401` posterior.
- El avance a `PATCH` quedaria sin smoke real aprobado de creacion/listado de servicios.

## Recomendacion

Corregir antes de avanzar con `PATCH`.

Product/Architect deberia considerar TASK-047 bloqueada hasta que la verificacion booleana muestre `ADMIN_USERNAME_SET=True` y `ADMIN_PASSWORD_SET=True` en el mismo entorno que ejecuta el smoke. Luego se debe repetir el flujo completo contra Azure real y actualizar un nuevo handoff con `serviceId`, status codes y validaciones de seguridad.
