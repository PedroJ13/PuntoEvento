# TASK-120 Handoff - Limpieza controlada de datos QA Azure

## Resultado general

Aprobado como inventario y propuesta.

No se ejecuto limpieza ni hard delete porque la tarea no incluye aprobacion explicita para modificar datos. Se consulto Azure Table/Blob Storage en modo lectura y se identificaron datos QA reales relacionados con `TASK-114`, `TASK-115` y `TASK-117`.

## Inventario Azure

Consulta ejecutada:

```text
Fecha UTC: 2026-05-29T22:00:22Z
Storage: Azure Table Storage / Blob Storage
Modo: lectura
Hard delete ejecutado: no
Secretos impresos: no
```

Tablas presentes:

```text
Companies
CompanyInvites
CompanySessions
Providers
ProvidersImages
Services
Uploads
```

No se encontro tabla `CompanySlugs` en el storage actual.

## Empresas QA encontradas

Se encontraron 3 empresas QA relacionadas:

| Company ID | Nombre | Email | Estado | Slug |
| --- | --- | --- | --- | --- |
| `company_e04c0711-14ae-42b0-8607-acbea4cdb252` | `QA TASK-114 Doble Submit 20260529210616` | `qa-task-114-20260529210616@example.test` | `pending` | `qa-task-114-doble-submit-20260529210616` |
| `company_7c99f62b-ddcb-4c42-b2ac-3240d6399f82` | `QA TASK-114 Otra Empresa 20260529210924` | `qa-task-114-otra-20260529210924@example.test` | `pending` | `qa-task-114-otra-empresa-20260529210924` |
| `company_e09fd79d-078f-4ee6-83df-b04bd9a9f6b0` | `QA TASK-114 Estado Envio 1780089144348` | `qa-task-114-estado-1780089145266@example.test` | `pending` | `qa-task-114-estado-envio-1780089144348` |

Nota: la tercera empresa no estaba en la lista inicial de la asignacion, pero coincide con prefijo `QA TASK-114` / `qa-task-114-`.

## Servicios QA encontrados

Se encontraron 6 servicios QA relacionados:

| Company ID | Service ID | Nombre | Estado | Categoria |
| --- | --- | --- | --- | --- |
| `company_e04c0711-14ae-42b0-8607-acbea4cdb252` | `service_edb4e73e-dd26-4aa2-9601-5b614b26e465` | `QA TASK-115 Mesa Dulce 1780089046` | `pending` | `Mesa dulce` |
| `company_e04c0711-14ae-42b0-8607-acbea4cdb252` | `service_c0543bb2-df73-47a0-bc24-db64f1f74741` | `QA TASK-115 Incompleto 1780089046` | `draft` | `Catering` |
| `company_e04c0711-14ae-42b0-8607-acbea4cdb252` | `service_58c898fa-225f-40d2-a710-1e2addba0a92` | `QA TASK-117 1780090671429 Mesa dulce UI` | `pending` | `Mesa dulce` |
| `company_e04c0711-14ae-42b0-8607-acbea4cdb252` | `service_9691671e-4611-46df-b53c-f87c281e7637` | `QA TASK-117 1780090671429 Incompleto` | `draft` | `Mesa dulce` |
| `company_e04c0711-14ae-42b0-8607-acbea4cdb252` | `service_6e4c6e2b-9d2a-4d34-8198-46f1eb38b72d` | `QA TASK-117 1780090739740 Mesa dulce UI` | `pending` | `Mesa dulce` |
| `company_e04c0711-14ae-42b0-8607-acbea4cdb252` | `service_c51d78b1-69bd-490a-a9be-51721f508c4a` | `QA TASK-117 1780090739740 Incompleto` | `draft` | `Mesa dulce` |

## Uploads, blobs, invitaciones y sesiones

Uploads:

```text
Uploads QA encontrados: 0
```

Blobs bajo `companies/<companyId>/`:

| Company ID | Public blobs | Pending blobs |
| --- | ---: | ---: |
| `company_e04c0711-14ae-42b0-8607-acbea4cdb252` | 0 | 0 |
| `company_7c99f62b-ddcb-4c42-b2ac-3240d6399f82` | 0 | 0 |
| `company_e09fd79d-078f-4ee6-83df-b04bd9a9f6b0` | 0 | 0 |

Invitaciones/sesiones relacionadas:

| Company ID | Invites | Sessions |
| --- | ---: | ---: |
| `company_e04c0711-14ae-42b0-8607-acbea4cdb252` | 3 | 3 |
| `company_7c99f62b-ddcb-4c42-b2ac-3240d6399f82` | 1 | 1 |
| `company_e09fd79d-078f-4ee6-83df-b04bd9a9f6b0` | 0 | 0 |

No se listaron tokens, hashes, cookies ni session IDs.

## Accion ejecutada

Solo inventario de lectura.

No se ejecutaron:

```text
reject
approve
delete
blob delete
entity delete
```

## Estrategia propuesta

### Opcion recomendada: soft cleanup

Ejecutar acciones internas de rechazo para sacar estos datos de colas de moderacion sin borrar evidencia:

1. Rechazar servicios QA `draft` y `pending`:

```text
POST /api/internal/services/{companyId}/{serviceId}/reject
Body: { "reason": "Limpieza QA pre-demo TASK-120" }
```

2. Rechazar empresas QA `pending`:

```text
POST /api/internal/companies/{companyId}/reject
Body: { "reason": "Limpieza QA pre-demo TASK-120" }
```

3. No tocar blobs porque no hay uploads ni blobs QA relacionados.

4. No borrar invitaciones/sesiones en esta primera limpieza. No aparecen en UI publica/admin y conservarlas ayuda a trazabilidad. Si Product exige limpieza total, pasar a hard cleanup con respaldo.

Impacto esperado:

- Las empresas dejan de aparecer en `GET /api/internal/companies/pending`.
- Los servicios dejan de aparecer en `GET /api/internal/services/pending`.
- No deberian aparecer en pagina publica porque no estan `published`.

### Hard cleanup solo con aprobacion explicita

Si se decide borrar definitivamente, hacerlo en una tarea separada o una segunda pasada aprobada, con respaldo previo de entidades:

Tablas relacionadas:

```text
Companies
Services
CompanyInvites
CompanySessions
Uploads
```

Orden sugerido:

1. Exportar entidades relacionadas a JSON local ignorado o artefacto seguro.
2. Confirmar lista exacta de `companyId` y `serviceId`.
3. Borrar sesiones e invitaciones por `PartitionKey=companyId`.
4. Borrar servicios por `PartitionKey=companyId`.
5. Borrar uploads si existieran.
6. Borrar companies por `PartitionKey=company`, `RowKey=companyId`.
7. Verificar que no hay blobs `public` ni `uploads-pending`.

No recomiendo hard delete antes de demo si soft cleanup basta para limpiar admin/publico.

## Riesgos

- Si no se limpia, el admin puede mostrar 3 empresas QA pendientes y 6 servicios QA revisables, contaminando una demo de moderacion.
- Si se hace hard delete sin respaldo, se pierde evidencia de smokes recientes y puede quedar relacion colgante.
- Las sesiones/invitaciones existentes no son visibles en UI, pero siguen en storage; si se requiere higiene total, deben entrar en una limpieza con respaldo.
- El inventario encontro una empresa QA adicional no listada inicialmente: `company_e09fd79d-078f-4ee6-83df-b04bd9a9f6b0`.

## Recomendacion para QA TASK-121

Antes de `TASK-121`, pedir aprobacion explicita para ejecutar soft cleanup.

Si Product/Architect aprueba soft cleanup, QA `TASK-121` debe validar:

- `GET /api/internal/companies/pending` no contiene nombres `QA TASK-114`.
- `GET /api/internal/services/pending` no contiene nombres `QA TASK-115` ni `QA TASK-117`.
- `GET /api/internal/uploads/pending` sigue sin uploads QA relacionados.
- Pagina publica no muestra `QA TASK-*`.
- La empresa demo limpia definida en `TASK-119` sigue disponible para la prueba Product Owner.

Si no se aprueba limpieza, `TASK-121` debe considerar el ambiente contaminado para admin global y limitar la prueba a una empresa demo especifica.
