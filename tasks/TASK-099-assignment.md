# TASK-099: QA local de admin UI conectada al modelo nuevo

## Equipo asignado

QA.

## Contexto

`TASK-098` conecto la pestana `Modelo nuevo` de `admin.html` a los listados internos reales:

```text
GET /api/internal/companies/pending
GET /api/internal/services/pending
GET /api/internal/uploads/pending
```

Tambien agrego acciones desde UI:

```text
POST /api/internal/companies/{companyId}/approve
POST /api/internal/companies/{companyId}/reject
POST /api/internal/services/{companyId}/{serviceId}/approve
POST /api/internal/services/{companyId}/{serviceId}/reject
POST /api/internal/uploads/{companyId}/{uploadId}/approve
POST /api/internal/uploads/{companyId}/{uploadId}/reject
```

Antes de commit/push/deploy, necesitamos QA local/estructural y visual basico.

## Archivos que debes leer

- `AGENTS.md`
- `chat-start/QA.md`
- `docs/API_CONTRACTS_MVP.md`
- `docs/BACKLOG.md`
- `docs/MVP_RELEASE_STATUS.md`
- `tasks/TASK-097-HANDOFF.md`
- `tasks/TASK-098-HANDOFF.md`
- `admin.html`
- `admin.css`
- `admin.js`

## Objetivo

Validar localmente que `admin.html` permite moderar Companies, Services y Uploads del modelo nuevo desde la pestana `Modelo nuevo`, sin romper el flujo legacy.

## Alcance

Validar:

1. Sintaxis:
   - `node --check admin.js`.
2. Cache busting:
   - `admin.css?v=7`.
   - `admin.js?v=10`.
3. Login/legacy:
   - el flujo legacy de `Revision` sigue cargando;
   - `Actualizar` sigue funcionando en `Revision`.
4. Pestana `Modelo nuevo`:
   - carga companies/services/uploads usando endpoints internos;
   - muestra estado de carga;
   - muestra contador por seccion;
   - muestra tarjetas con datos permitidos;
   - maneja `items=[]` por tipo;
   - maneja error en un listado sin romper los otros, si la implementacion lo soporta.
5. Acciones:
   - aprobar company llama `POST /api/internal/companies/{companyId}/approve`;
   - rechazar company llama `POST /api/internal/companies/{companyId}/reject`;
   - aprobar service llama `POST /api/internal/services/{companyId}/{serviceId}/approve`;
   - rechazar service llama `POST /api/internal/services/{companyId}/{serviceId}/reject`;
   - aprobar upload llama `POST /api/internal/uploads/{companyId}/{uploadId}/approve`;
   - rechazar upload llama `POST /api/internal/uploads/{companyId}/{uploadId}/reject`;
   - rechazo envia razon cuando se provee;
   - despues de accion refresca/remueve item o muestra feedback claro.
6. Seguridad:
   - no renderiza campos prohibidos aunque vengan en mocks.
7. Responsive:
   - desktop basico sin overflow incoherente;
   - mobile basico sin overflow horizontal.

## Campos prohibidos

Confirmar que no aparecen en DOM visible, logs o HTML renderizado:

```text
tokenHash
sessionHash
pendingBlobName
pendingBlobUrl
uploadUrl
sig=
AccountKey
connectionString
partitionKey
rowKey
cookie
pe_company_session
```

## Datos y entorno

- Esta tarea puede usar mocks/harness local de `fetch`.
- No requiere Azure real.
- No imprimir credenciales.
- No hacer commit/push.

## Fuera de alcance

- Probar Azure real.
- Cambiar Backend/API.
- Crear preview visual de uploads pendientes.
- Crear endpoint `submit-review`.
- Cambiar pagina publica o panel empresa.

## Entregable

Crear:

```text
tasks/TASK-099-HANDOFF.md
```

Debe incluir:

- Resultado general: aprobado, requiere cambios o bloqueado.
- Casos ejecutados.
- Archivos modificados, si alguno.
- Comandos ejecutados.
- Evidencia/resumen responsive.
- Confirmacion de campos prohibidos.
- Riesgos pendientes.
- Recomendacion: listo para commit/push + QA Azure, o requiere Web Dev.

## Aviso al terminar

Cuando termines, avisa en el chat Product/Architect:

```text
Termine TASK-099. Product/Architect debe leer tasks/TASK-099-HANDOFF.md.
```
