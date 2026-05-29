# TASK-122: Ejecutar soft cleanup de datos QA Azure

## Equipo asignado

Infra/API.

## Prerrequisito

Ejecutar esta tarea solo si Product / Architect / Release aprueba explicitamente el soft cleanup.

No hacer hard delete en esta tarea.

## Contexto

`TASK-120` inventario datos QA reales en Azure y recomendo soft cleanup.

`TASK-121` concluyo:

```text
Product Owner puede probar con guion enfocado.
Admin global limpio requiere soft cleanup.
```

## Archivos que debes leer

- `AGENTS.md`
- `chat-start/INFRA_AZURE.md`
- `tasks/TASK-120-HANDOFF.md`
- `tasks/TASK-121-HANDOFF.md`
- `docs/MVP_RELEASE_STATUS.md`

## Datos QA objetivo

Empresas:

```text
company_e04c0711-14ae-42b0-8607-acbea4cdb252
company_7c99f62b-ddcb-4c42-b2ac-3240d6399f82
company_e09fd79d-078f-4ee6-83df-b04bd9a9f6b0
```

Servicios:

```text
service_edb4e73e-dd26-4aa2-9601-5b614b26e465
service_c0543bb2-df73-47a0-bc24-db64f1f74741
service_58c898fa-225f-40d2-a710-1e2addba0a92
service_9691671e-4611-46df-b53c-f87c281e7637
service_6e4c6e2b-9d2a-4d34-8198-46f1eb38b72d
service_c51d78b1-69bd-490a-a9be-51721f508c4a
```

Prefijos de seguridad:

```text
QA TASK-114
QA TASK-115
QA TASK-117
qa-task-114-
Pre Demo Owner Smoke
```

## Objetivo

Sacar datos QA/pre-demo de colas globales de moderacion sin borrar evidencia.

## Accion recomendada

1. Reconfirmar inventario en lectura antes de tocar datos.
2. Rechazar servicios QA pendientes/draft mediante endpoint interno o mecanismo equivalente seguro:

```text
POST /api/internal/services/{companyId}/{serviceId}/reject
Body: { "reason": "Limpieza QA pre-demo TASK-122" }
```

3. Rechazar empresas QA pendientes mediante endpoint interno o mecanismo equivalente seguro:

```text
POST /api/internal/companies/{companyId}/reject
Body: { "reason": "Limpieza QA pre-demo TASK-122" }
```

4. No borrar invitaciones/sesiones.
5. No borrar blobs salvo que se encuentren blobs QA y Product/Release apruebe explicitamente.

## Validacion esperada

Despues del soft cleanup:

- `GET /api/internal/companies/pending` no contiene `QA TASK-114` ni `Pre Demo Owner Smoke`.
- `GET /api/internal/services/pending` no contiene `QA TASK-115`, `QA TASK-117` ni `Pre Demo Owner Smoke`.
- `GET /api/internal/uploads/pending` no contiene uploads QA relacionados.
- Pagina publica no muestra `QA TASK-*`.

## Fuera de alcance

- Hard delete.
- Borrar sesiones/invitaciones.
- Cambiar codigo.
- Hacer commit/push.

## Entregable

Crear:

```text
tasks/TASK-122-HANDOFF.md
```

Debe incluir:

- Confirmacion de aprobacion recibida.
- Inventario antes.
- Acciones ejecutadas.
- Inventario despues.
- Riesgos o datos no limpiados.
- Recomendacion para QA/pre-demo.

## Aviso al terminar

Cuando termines, avisa en el chat Product/Architect:

```text
Termine TASK-122. Product/Architect debe leer tasks/TASK-122-HANDOFF.md.
```
