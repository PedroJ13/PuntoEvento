# TASK-138: Backend API - imagenes dentro de aprobacion de servicio

## Equipo asignado

Backend API.

## Contexto

Product Owner aprobo la direccion general de Round 2, pero pidio cambiar la moderacion de imagenes:

- las imagenes no deben verse ni aprobarse como entidad separada de servicios;
- deben mostrarse dentro del servicio;
- el admin aprueba empresa y servicios;
- el servicio aprobado debe incluir/publicar las imagenes asociadas;
- el admin necesita ver las imagenes pendientes.

Docs actualizados:

- `docs/DECISION_LOG.md`
- `docs/API_CONTRACTS_MVP.md`
- `docs/DATA_MODEL.md`

## Archivos que debes leer

- `AGENTS.md`
- `chat-start/BACKEND_API.md`
- `docs/API_CONTRACTS_MVP.md`
- `docs/DATA_MODEL.md`
- `docs/MVP_RELEASE_STATUS.md`
- `api/shared/internalModeration.js`
- `api/shared/internalPending.js`
- `api/uploads-sign/index.js`

## Objetivo

Ajustar API interna para que el flujo principal sea aprobar empresa y servicios, donde aprobar servicio publica tambien las imagenes pendientes asociadas a ese servicio.

## Alcance

1. Cambiar `POST /api/internal/services/{companyId}/{serviceId}/approve` para:
   - mantener validacion de empresa `published`;
   - publicar el servicio;
   - publicar uploads pendientes `scope=service` asociados a ese `serviceId`;
   - aplicar `coverUrl` y `gallery` al servicio;
   - respetar maximo 10 imagenes y cover unico;
   - no dejar estado parcialmente publicado si falla una imagen.
2. Agregar forma segura para preview interno de imagenes pendientes:
   - preferido: endpoint autenticado que sirva imagen bytes o URL interna sin SAS;
   - no exponer SAS, connection strings, `pendingBlobName`, `partitionKey`, `rowKey`, hashes ni cookies.
3. Enriquecer listados internos para que Web pueda agrupar imagenes dentro del servicio:
   - `serviceId`;
   - `imageType`;
   - `fileName`;
   - `contentType`;
   - `size`;
   - preview interno si aplica.
4. Mantener endpoints de uploads existentes si siguen siendo utiles tecnicamente, pero no tratarlos como flujo principal visual.

## Fuera de alcance

- Cambiar `admin.html/admin.js/admin.css`.
- Cambiar formulario publico de registro.
- Hard delete o limpieza de datos QA.

## Verificacion minima esperada

- `node --check` en archivos modificados.
- Prueba local/estructural:
  - aprobar servicio de empresa no publicada -> `409`;
  - aprobar servicio de empresa publicada con 1 cover + 2 gallery pending -> servicio `published`, uploads `published`, `coverUrl` y `gallery` aplicados;
  - error de regla de imagen no deja publicacion parcial;
  - preview interno no expone SAS ni campos internos.

## Entregable

Crear:

```text
tasks/TASK-138-HANDOFF.md
```

Debe incluir:

- endpoints/archivos modificados;
- comportamiento final de aprobacion de servicio;
- como debe consumir Web el preview interno;
- verificacion ejecutada;
- riesgos o pendientes;
- si requiere deploy antes de QA.

## Aviso al terminar

```text
Termine TASK-138. Product/Architect debe leer tasks/TASK-138-HANDOFF.md.
```
