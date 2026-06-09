# Triage Product Owner Round 2 - 2026-05-29

Origen:

```text
docs/PRODUCT_OWNER_TEST_FINDINGS_2026-05-29_ROUND_2.md
```

## Estado release

Estado sugerido:

```text
aprobacion pendiente con hallazgos P0/P1 Round 2
```

No invitar primeras empresas reales hasta resolver o aceptar explicitamente:

- reglas de moderacion API para no publicar fuera de orden;
- busqueda publica por nombre de empresa y limpieza de filtros confusos;
- decision de alcance de imagenes por servicio.

## Decisiones cerradas para implementar

### Imagenes por servicio

- Cada servicio puede tener maximo 10 imagenes en total.
- El cover cuenta dentro de esas 10 imagenes.
- Si el servicio tiene imagenes, una y solo una debe ser cover.
- Las demas imagenes aprobadas forman la galeria/carrusel.
- Todas las imagenes cargadas por empresa quedan `pending` hasta aprobacion admin.
- Cambiar cover o galeria despues de publicar no publica automaticamente la imagen nueva; la imagen nueva queda pendiente y la version publica anterior sigue visible hasta aprobacion.
- Editar texto/datos publicos del servicio publicado sigue devolviendo el servicio a `draft`.

### Moderacion y dependencias

- Un servicio no puede aprobarse si su empresa no esta `published`.
- Una imagen de servicio no puede aprobarse si su empresa no esta `published`.
- Una imagen de servicio no puede aprobarse si su servicio no esta `published`.
- Una imagen de empresa no puede aprobarse si su empresa no esta `published`.
- Aprobar empresa no publica servicios ni imagenes automaticamente.
- Aprobar servicio no publica imagenes automaticamente.
- Rechazar empresa/servicio no hace cascadas silenciosas en MVP.
- Las reglas deben existir en API, no solo en UI.

### Admin interno

- La moderacion objetivo debe ser por expediente de empresa.
- Las listas globales pueden quedar como resumen/entrada, pero el flujo operativo debe permitir seleccionar empresa y ver:
  - datos de empresa;
  - servicios asociados;
  - imagenes asociadas por servicio/empresa;
  - acciones validas segun dependencias.

### Busqueda publica

- La busqueda sigue centrada en servicios publicados.
- El texto libre `q` debe buscar por:
  - nombre de servicio;
  - categoria;
  - tipo de evento;
  - descripcion;
  - nombre de empresa;
  - slug de empresa.
- Si se busca `Demo Owner Jardines del Sol`, debe aparecer un servicio publicado de esa empresa si existe.
- No mostrar empresas sin servicios publicados en resultados generales MVP.
- Ocultar temporalmente filtros publicos sin logica real:
  - `Invitados`;
  - `Presupuesto`;
  - checks laterales `Servicios para boda`.
- El filtro de servicio/categoria debe tener estado `Todos` estable y predecible.

## Priorizacion

P0/P1:

- Bloquear aprobaciones invalidas en API.
- Ajustar busqueda publica por nombre de empresa y ocultar filtros confusos.

P1:

- Admin por expediente de empresa.
- Imagenes por servicio hasta 10 con cover y galeria.

P2:

- Reordenamiento avanzado de galeria si no bloquea demo.
- Hard cleanup de datos historicos.

## Division por superficie

### Pagina publica: `index.html`, `app.js`, `styles.css`

Hallazgos:

- `PO2-004`: busqueda publica no permite encontrar claramente una empresa especifica.
- `PO2-005`: filtro `Servicio: Todos` aparece de forma inconsistente.
- `PO2-006`: checks laterales `Servicios para boda` se marcan automaticamente y confunden.

Alcance:

- Buscar servicios publicados por nombre de empresa.
- Mantener resultados centrados en servicios con contexto de empresa.
- Ocultar temporalmente `Invitados`, `Presupuesto` y checks laterales sin logica real.
- Hacer estable la opcion `Todos` del filtro servicio/categoria.

### Panel empresa: `panel.html`, `panel.js`, `panel.css`

Hallazgos:

- `PO2-001`: servicio debe permitir hasta 10 imagenes y seleccionar cover.

Alcance:

- UI para agregar/ver/remover hasta 10 imagenes por servicio.
- Seleccionar una imagen como cover.
- Las otras imagenes quedan como galeria/carrusel.
- Validar formato/tamano por archivo y limite total.
- Comunicar que imagenes nuevas quedan pendientes de aprobacion.

### Admin interno: `admin.html`, `admin.js`, `admin.css`

Hallazgos:

- `PO2-002`: admin permite aprobar empresa, servicio e imagen de forma independiente sin validar dependencias.
- `PO2-003`: admin deberia mostrar servicios e imagenes al seleccionar empresa.

Alcance:

- Vista por expediente de empresa.
- Seleccionar empresa y ver sus servicios/uploads relacionados.
- Reducir listas globales a resumen/entrada.
- Bloquear u ocultar acciones invalidas desde UI.
- Mostrar mensajes claros cuando una accion depende de empresa/servicio aprobado.

### API / reglas de negocio: `api/**`

Hallazgos soportados:

- `PO2-001`, `PO2-002`, `PO2-003`, `PO2-004`.

Alcance:

- No aprobar servicio si empresa no esta `published`.
- No aprobar upload si empresa o servicio no estan `published`.
- Validar maximo 10 imagenes por servicio, cover incluido.
- Validar maximo un cover activo/pendiente por servicio.
- Incluir `company.name` y `company.slug` en busqueda publica `q`.

### Producto / Datos / Contratos: `docs/**`, `data/**`

Alcance:

- Mantener decisiones de imagenes, moderacion y busqueda sincronizadas.
- Definir catalogos compartidos finales para categorias/tipos de evento.
- Evitar que cada superficie implemente reglas distintas.

## Tareas creadas

- `TASK-123`: Product/Data - cerrar alcance Round 2 por superficie y contratos.
- `TASK-124`: Public Web - busqueda por empresa y limpieza de filtros.
- `TASK-125`: Panel Web - imagenes de servicio hasta 10 y seleccion de cover.
- `TASK-126`: Admin Web - moderacion por expediente de empresa.
- `TASK-127`: Backend/API - reglas de aprobacion, busqueda e imagenes.
- `TASK-128`: QA Public - validacion pagina publica Round 2.
- `TASK-129`: QA Panel - validacion panel imagenes Round 2.
- `TASK-130`: QA Admin/API - validacion moderacion Round 2.
