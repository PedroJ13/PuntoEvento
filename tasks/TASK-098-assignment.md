# TASK-098: Conectar admin UI a moderacion del modelo nuevo

## Equipo asignado

Web Dev.

## Contexto

`TASK-085` dejo `admin.html` con una pestana `Modelo nuevo`, pero bloqueada visualmente porque no existian endpoints de listado.

Ese bloqueo ya se cerro:

- `TASK-093`: Backend/API implemento listados internos.
- `TASK-094`: QA local/estructural aprobo listados.
- `TASK-095`: QA Azure encontro el fallo `POST -> 404`.
- `TASK-096`: Backend/API corrigio el enrutamiento.
- `TASK-097`: QA Azure aprobo listados internos finales.

Endpoints disponibles:

```text
GET /api/internal/companies/pending
GET /api/internal/services/pending
GET /api/internal/uploads/pending
```

Acciones ya disponibles:

```text
POST /api/internal/companies/{companyId}/approve
POST /api/internal/companies/{companyId}/reject
POST /api/internal/services/{companyId}/{serviceId}/approve
POST /api/internal/services/{companyId}/{serviceId}/reject
POST /api/internal/uploads/{companyId}/{uploadId}/approve
POST /api/internal/uploads/{companyId}/{uploadId}/reject
```

## Archivos que debes leer

- `AGENTS.md`
- `chat-start/WEB_DEV.md`
- `docs/API_CONTRACTS_MVP.md`
- `docs/BACKLOG.md`
- `docs/MVP_RELEASE_STATUS.md`
- `tasks/TASK-085-HANDOFF.md`
- `tasks/TASK-097-HANDOFF.md`
- `admin.html`
- `admin.css`
- `admin.js`
- `api/shared/adminAuth.js`

## Objetivo

Conectar la pestana `Modelo nuevo` de `admin.html` a los listados reales y permitir aprobar/rechazar Companies, Services y Uploads desde UI interna.

## Alcance

1. Reemplazar el callout de bloqueo por una UI funcional.
2. Cargar en la pestana `Modelo nuevo`:
   - empresas pendientes;
   - servicios revisables;
   - uploads pendientes.
3. Mostrar estados claros:
   - cargando;
   - vacio;
   - error;
   - accion en progreso;
   - accion aprobada/rechazada.
4. Reusar el mecanismo de credencial admin actual del admin legacy.
5. Para cada item:
   - mostrar datos suficientes para que admin decida;
   - agregar botones aprobar/rechazar.
6. Llamar los endpoints approve/reject existentes.
7. Despues de aprobar/rechazar:
   - refrescar el listado afectado;
   - mostrar feedback visible.
8. Mantener funcionando el flujo legacy de proveedores.
9. No exponer secretos ni campos internos.

## UX minima esperada

La pestana `Modelo nuevo` deberia tener secciones separadas o controles claros para:

- Empresas pendientes.
- Servicios revisables.
- Uploads pendientes.

Puede ser una columna por tipo o tabs internos simples, siempre que sea claro y usable en desktop/mobile.

Para rechazo, puede usarse:

- `window.prompt` para razon MVP, o
- un input/modal simple si encaja mejor con el estilo existente.

Mantenerlo sencillo; esto es admin interno MVP.

## Campos prohibidos

No renderizar ni guardar en DOM visible:

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

## Fuera de alcance

- Crear nuevos endpoints Backend/API.
- Crear preview visual de uploads pendientes.
- Endpoint `submit-review`.
- Cambiar panel empresa.
- Cambiar pagina publica.
- Pagos/ranking.
- Hacer commit/push.

## Verificacion local esperada

- `node --check admin.js`.
- Prueba local/estructural con mocks de `fetch` o harness:
  - carga companies/services/uploads desde endpoints internos;
  - muestra vacio por tipo cuando `items=[]`;
  - maneja error de un listado sin romper los otros si es razonable;
  - approve/reject llama endpoint correcto;
  - despues de accion refresca listado o remueve item;
  - no muestra campos prohibidos.
- Smoke visual local en desktop y mobile si hay servidor disponible.

## Entregable

Crear:

```text
tasks/TASK-098-HANDOFF.md
```

Debe incluir:

- Resultado general.
- Archivos modificados.
- Como funciona la UI.
- Endpoints consumidos.
- Como se probo.
- Confirmacion de no secretos/campos prohibidos.
- Riesgos pendientes.
- Recomendacion para QA local.

## Aviso al terminar

Cuando termines, avisa en el chat Product/Architect:

```text
Termine TASK-098. Product/Architect debe leer tasks/TASK-098-HANDOFF.md.
```
