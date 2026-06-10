# TASK-290: Infra Azure - cleanup no destructivo de servicios QA de Aurisbel

## Equipo asignado

Infra Azure.

## Contexto

`TASK-289` aprobo la validacion de portada publica post-CORS, pero dejo visible un servicio QA publicado en la ficha publica de `Aurisbel Pasteleria`.

Servicio QA confirmado:

```text
Service ID: service_4ca95c42-b4f8-408f-88a8-4a818f5e3c6f
Nombre: QA TASK-288 portada 20260610010017
Empresa: Aurisbel Pasteleria
```

Tambien revisar si siguen pendientes/publicados otros servicios QA creados durante `TASK-285`:

```text
QA TASK-285 portada 20260610003337
QA TASK-285 sin imagen 20260610003337
```

## Tarea

Aplicar cleanup no destructivo para que los servicios QA no aparezcan publicamente ni queden pendientes de moderacion.

## Alcance

1. Identificar servicios QA creados por `TASK-285` y `TASK-288` en la empresa `Aurisbel Pasteleria`.
2. Rechazar/desactivar los servicios QA por via segura.
3. Rechazar/desactivar uploads QA asociados si corresponde.
4. Confirmar que no aparecen en:

```text
GET /api/public/services?limit=100
GET /api/public/companies/aurisbel-pasteleria-341388
```

## No tocar

- No hard delete.
- No borrar blobs fisicamente salvo aprobacion explicita.
- No tocar servicios reales de la empresa.
- No imprimir credenciales, cookies, tokens, SAS ni connection strings.

## Handoff esperado

Actualizar:

```text
tasks/TASK-290-HANDOFF.md
```

Incluir:

- Servicios QA encontrados.
- Accion aplicada.
- Evidencia de que ya no son publicos.
- Riesgos o pendientes.

