# TASK-186: Infra/API - aplicar soft cleanup de SMASH Costa Rica

## Equipo

Infra Azure.

## Estado

Completada.

## Objetivo

Aplicar soft cleanup conservador de `SMASH Costa Rica` y sus dos servicios relacionados solo con aprobacion explicita de Product / Architect / Release.

## Aprobacion Product usada

El usuario/Product dio aprobacion explicita en chat:

```text
te doy ap[robacion exlicita
```

Lectura operativa: aprobacion explicita para ejecutar el soft cleanup de `SMASH Costa Rica` solicitado por `TASK-186`.

## Resultado

Soft cleanup aplicado correctamente sobre `SMASH Costa Rica` y sus dos servicios relacionados.

No se hizo hard delete. No se borraron blobs. No se tocaron empresas QA/test/demo ni app settings.

## Entidades afectadas

Empresa:

| Company ID | Slug | Nombre | Status antes | Status despues |
| --- | --- | --- | --- | --- |
| `company_c3b9f3ad-3a8b-4f81-b9c3-7c5ee6dbb60d` | `smash-costa-rica` | `SMASH Costa Rica` | `published` | `rejected` |

Servicios:

| Service ID | Slug | Nombre | Status antes | Status despues |
| --- | --- | --- | --- | --- |
| `service_988ac5bf-0175-4267-9ad1-49c4dadd957a` | `smash-servicio-1` | `Smash Servicio 1` | `published` | `rejected` |
| `service_e2730253-e8be-4895-a12b-768f0813389b` | `smash-servicio-2` | `Smash servicio 2` | `published` | `rejected` |

## Valores aplicados

Timestamp:

```text
2026-06-01T17:56:20.6501425Z
```

Razon:

```text
Prelaunch cleanup non-QA data
```

## Conteo antes/despues

Conteo antes segun `TASK-183`:

| Clasificacion | Status | Empresas |
| --- | --- | ---: |
| No QA/no test | `published` | 1 |
| QA/test/demo | `pending` | 4 |
| QA/test/demo | `published` | 7 |
| QA/test/demo | `rejected` | 20 |

Despues del cambio especifico:

```text
SMASH Costa Rica paso de published a rejected.
Sus 2 servicios pasaron de published a rejected.
Busqueda publica por SMASH paso de 2 resultados a 0.
```

## Verificacion Table Storage

Empresa despues:

```text
companyId: company_c3b9f3ad-3a8b-4f81-b9c3-7c5ee6dbb60d
slug: smash-costa-rica
status: rejected
rejectionReason: Prelaunch cleanup non-QA data
updatedAt: 2026-06-01T17:56:20.6501425Z
```

Servicios despues:

```text
service_988ac5bf-0175-4267-9ad1-49c4dadd957a / smash-servicio-1 -> rejected
service_e2730253-e8be-4895-a12b-768f0813389b / smash-servicio-2 -> rejected
```

## Verificaciones publicas

Despues del cleanup:

| Query | Total resultados | Resultados `smash-costa-rica` |
| --- | ---: | ---: |
| `SMASH` | 0 | 0 |
| `smash-costa-rica` | 0 | 0 |

## Limites respetados

- No hard delete.
- No borrado de blobs.
- No cambios a empresas QA/test/demo.
- No cambios a empresas dudosas.
- No app settings.
- No emails completos ni secretos impresos.

## Comandos usados con secretos redactados

No se imprimieron account keys, connection strings, SAS, tokens, emails completos ni secretos. `az storage --auth-mode key` consulto la account key internamente sin mostrarla.

Comandos principales:

```powershell
az storage entity show --account-name storagepuntoevento --auth-mode key --table-name Companies --partition-key company --row-key company_c3b9f3ad-3a8b-4f81-b9c3-7c5ee6dbb60d
az storage entity query --account-name storagepuntoevento --auth-mode key --table-name Services --filter "PartitionKey eq 'company_c3b9f3ad-3a8b-4f81-b9c3-7c5ee6dbb60d'"
az storage entity merge --account-name storagepuntoevento --auth-mode key --table-name Companies --entity PartitionKey=company RowKey=company_c3b9f3ad-3a8b-4f81-b9c3-7c5ee6dbb60d status=rejected rejectionReason="Prelaunch cleanup non-QA data" updatedAt=<timestamp>
az storage entity merge --account-name storagepuntoevento --auth-mode key --table-name Services --entity PartitionKey=company_c3b9f3ad-3a8b-4f81-b9c3-7c5ee6dbb60d RowKey=service_988ac5bf-0175-4267-9ad1-49c4dadd957a status=rejected rejectionReason="Prelaunch cleanup non-QA data" updatedAt=<timestamp>
az storage entity merge --account-name storagepuntoevento --auth-mode key --table-name Services --entity PartitionKey=company_c3b9f3ad-3a8b-4f81-b9c3-7c5ee6dbb60d RowKey=service_e2730253-e8be-4895-a12b-768f0813389b status=rejected rejectionReason="Prelaunch cleanup non-QA data" updatedAt=<timestamp>
Invoke-RestMethod https://zealous-field-08fdd720f.7.azurestaticapps.net/api/public/services?q=SMASH&limit=20
Invoke-RestMethod https://zealous-field-08fdd720f.7.azurestaticapps.net/api/public/services?q=smash-costa-rica&limit=20
```

## Riesgos

- La limpieza es soft cleanup: los registros siguen existiendo en Table Storage para trazabilidad.
- Blobs asociados, si existen, no fueron borrados.
- Si Product quiere eliminar fisicamente datos o blobs, se requiere tarea separada de hard cleanup con respaldo y aprobacion explicita.

## Recomendacion para Product / Architect / Release

Marcar `TASK-186` como completada y actualizar el tablero: la limpieza controlada de `SMASH Costa Rica` ya no bloquea el pre-lanzamiento.
