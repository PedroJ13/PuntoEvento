# TASK-183: Infra/API - limpieza controlada de empresas no QA

## Equipo

Infra Azure.

## Estado

Completada como inventario y propuesta. No se ejecutaron cambios de limpieza porque la asignacion exige proponer candidatos antes de modificar y no hubo aprobacion explicita de soft cleanup dentro de esta ronda.

## Objetivo

Inventariar empresas actuales en `Companies`, clasificar QA/test/demo vs no QA/no test, proponer limpieza conservadora y documentar impacto esperado sin hard delete.

## Ambiente

- Azure Storage account: `storagepuntoevento`
- Tablas revisadas: `Companies`, `Services`
- Public URL validada: `https://zealous-field-08fdd720f.7.azurestaticapps.net`
- Fecha local: `2026-06-01`

## Criterio de clasificacion

Se clasifico como `QA/test/demo` cuando `name`, `slug`, `email` o `description` contiene marcadores operativos como:

```text
qa
test
demo
task
smoke
example.test
```

Se clasifico como `No QA/no test` cuando no aparecieron esos marcadores.

Emails fueron redactados parcialmente en la salida de trabajo y no se copiaron completos en este handoff.

## Inventario

Conteo antes:

| Clasificacion | Status | Empresas |
| --- | --- | ---: |
| No QA/no test | `published` | 1 |
| QA/test/demo | `pending` | 4 |
| QA/test/demo | `published` | 7 |
| QA/test/demo | `rejected` | 20 |

Total observado: 32 empresas.

## Candidata clara de limpieza

| Company ID | Slug | Nombre | Status | Servicios | Servicios publicados |
| --- | --- | --- | --- | ---: | ---: |
| `company_c3b9f3ad-3a8b-4f81-b9c3-7c5ee6dbb60d` | `smash-costa-rica` | `SMASH Costa Rica` | `published` | 2 | 2 |

Email observado durante inventario: redactado como `sma***@hotmail.com`.

Servicios relacionados:

| Service ID | Slug | Nombre | Status | Categoria |
| --- | --- | --- | --- | --- |
| `service_988ac5bf-0175-4267-9ad1-49c4dadd957a` | `smash-servicio-1` | `Smash Servicio 1` | `published` | `Salon y jardin` |
| `service_e2730253-e8be-4895-a12b-768f0813389b` | `smash-servicio-2` | `Smash servicio 2` | `published` | `Mesa dulce` |

## Dudosas

No deje empresas en `dudosas` con el criterio usado. Algunas empresas publicadas sin `qa` en nombre, como `INTERTEC | Costa Rica`, quedaron clasificadas como QA/test/demo por marcadores internos en sus datos usados para pruebas recientes. No se proponen para limpieza en esta tarea.

## Visibilidad publica actual

Busqueda publica antes de cleanup:

| Query | Resultados | Slugs visibles |
| --- | ---: | --- |
| `SMASH` | 2 | `smash-costa-rica/smash-servicio-2`, `smash-costa-rica/smash-servicio-1` |
| `smash-costa-rica` | 2 | `smash-costa-rica/smash-servicio-2`, `smash-costa-rica/smash-servicio-1` |

## Acciones ejecutadas

No se modificaron entidades.

No se hizo:

- hard delete;
- borrado de blobs;
- cambios de app settings;
- cambios de codigo;
- cambios de status en `Companies` o `Services`.

## Propuesta de soft cleanup

Si Product aprueba, ejecutar limpieza conservadora solo sobre:

```text
company_c3b9f3ad-3a8b-4f81-b9c3-7c5ee6dbb60d
```

Cambios propuestos:

- `Companies`: cambiar `status` de `published` a `rejected`.
- `Companies`: guardar `rejectionReason` como `Prelaunch cleanup non-QA data`.
- `Companies`: actualizar `updatedAt`.
- `Services` relacionados:
  - cambiar `service_988ac5bf-0175-4267-9ad1-49c4dadd957a` de `published` a `rejected` o `inactive`;
  - cambiar `service_e2730253-e8be-4895-a12b-768f0813389b` de `published` a `rejected` o `inactive`;
  - guardar razon equivalente y `updatedAt`.

Recomendacion Infra:

- Usar `rejected` para empresa y servicios si Product quiere que quede claro que esos datos no deben usarse en pre-lanzamiento.
- Usar `inactive` para servicios si Product prefiere no marcar contenido como rechazado editorialmente. En ambos casos no deben aparecer en busqueda publica.

## Verificacion esperada post-aprobacion

Despues de aplicar soft cleanup:

- `Companies.status` de `smash-costa-rica` debe quedar `rejected`.
- Servicios `smash-servicio-1` y `smash-servicio-2` deben quedar `rejected` o `inactive`.
- `GET /api/public/services?q=SMASH&limit=20` debe devolver 0 resultados para esa empresa.
- `GET /api/public/services?q=smash-costa-rica&limit=20` debe devolver 0 resultados para esa empresa.
- No debe haber hard delete ni borrado de blobs.

## Comandos usados con secretos redactados

No se imprimieron account keys, connection strings, SAS, tokens ni emails completos.

Comandos principales:

```powershell
az storage entity query --account-name storagepuntoevento --auth-mode login --table-name Companies
az storage entity query --account-name storagepuntoevento --auth-mode login --table-name Services
az storage entity query --account-name storagepuntoevento --auth-mode key --table-name Companies
az storage entity query --account-name storagepuntoevento --auth-mode key --table-name Services
az storage entity query --account-name storagepuntoevento --auth-mode key --table-name Services --filter "PartitionKey eq 'company_c3b9f3ad-3a8b-4f81-b9c3-7c5ee6dbb60d'"
Invoke-RestMethod https://zealous-field-08fdd720f.7.azurestaticapps.net/api/public/services?q=SMASH&limit=20
Invoke-RestMethod https://zealous-field-08fdd720f.7.azurestaticapps.net/api/public/services?q=smash-costa-rica&limit=20
```

Nota: `auth-mode login` fallo por falta de rol RBAC de Table Storage. Se uso `auth-mode key`; Azure CLI consulto la account key internamente y no se imprimio.

## Riesgos

- La clasificacion depende de marcadores textuales. Si hay empresas reales con palabras como `demo` o `test` en su descripcion, podrian clasificarse como QA/test/demo.
- `SMASH Costa Rica` parece no QA/no test por nombre/slug/email, pero Product debe confirmar que no es una empresa real que quiera conservar.
- Si se limpia solo la empresa y no sus servicios, el catalogo publico deberia ocultarlos por empresa no publicada, pero es mas ordenado cambiar tambien los servicios relacionados.

## Recomendacion para Product / Architect / Release

Aprobar o rechazar explicitamente el soft cleanup de `SMASH Costa Rica`.

Si se aprueba, abrir instruccion breve a Infra/API:

```text
Aplicar soft cleanup TASK-183 sobre company_c3b9f3ad-3a8b-4f81-b9c3-7c5ee6dbb60d y sus 2 servicios relacionados. Usar status rejected.
```

Despues del cleanup, ejecutar verificacion publica para confirmar 0 resultados de `SMASH`.
