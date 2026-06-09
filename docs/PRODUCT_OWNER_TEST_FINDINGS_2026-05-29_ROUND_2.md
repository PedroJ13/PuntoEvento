# Hallazgos Product Owner - Prueba MVP 2026-05-29 Round 2

Responsable destino: `Product / Architect / Release`.

Origen: segunda prueba manual Product Owner usando `docs/PRODUCT_OWNER_TEST_SCRIPT.md` en Azure Static Web Apps.

Este documento complementa `docs/PRODUCT_OWNER_TEST_FINDINGS_2026-05-29.md`. Varios puntos ya habian sido mencionados, pero esta ronda agrega reglas esperadas mas concretas para resolverlos en tareas pequenas.

## Resumen ejecutivo

El flujo parece avanzar correctamente, pero quedan tres areas que no deberian aceptarse sin decision explicita antes de invitar empresas reales:

- carga de imagenes por servicio limitada a cover, cuando el producto espera hasta 10 imagenes por servicio y una seleccionada como cover;
- moderacion admin separada por listas independientes, lo que permite aprobar entidades fuera de contexto o en orden incorrecto;
- busqueda publica con filtros inconsistentes o insuficientes para encontrar empresas/servicios especificos, incluyendo `Demo Owner Jardines del Sol`.

## Hallazgos

### PO2-001 - Servicio debe permitir hasta 10 imagenes y seleccionar cover

Ruta: `panel.html`, carga de servicio.

Observado:

- El panel solo muestra carga de una imagen tipo `cover`.
- No hay flujo visible para cargar varias imagenes por servicio.
- No hay forma de indicar cual imagen sera cover y cuales iran al carrusel.

Comportamiento esperado por Product Owner:

- Cada servicio debe permitir cargar maximo 10 imagenes.
- Una imagen debe poder marcarse como `cover`.
- Las demas imagenes deben ir al carrusel/galeria del servicio.
- Debe haber una experiencia clara para agregar, ver, cambiar cover y remover imagenes antes de guardar/enviar.

Decisiones requeridas:

- Maximo de imagenes por servicio: confirmar `10`.
- Si el cover cuenta dentro de las 10 imagenes o es adicional. Recomendacion: cuenta dentro de las 10.
- Si en MVP se permite cambiar cover despues de publicar o requiere nueva revision.
- Si todas las imagenes cargadas quedan pendientes hasta aprobacion admin.

Recomendacion tecnica:

- Modelar imagenes como uploads asociados a `serviceId`.
- Guardar metadata suficiente para `imageType: cover | gallery`.
- Permitir reordenar o al menos marcar cover.
- Validar tamano/formato por archivo y limite total por servicio.
- En pagina publica, usar cover en cards/listados y galeria en perfil/carrusel.

Prioridad sugerida: `P1`.

Tipo: producto + panel empresa + uploads + pagina publica.

### PO2-002 - Admin permite aprobar empresa, servicio e imagen de forma independiente sin validar dependencias

Ruta: `admin.html`, pestana `Modelo nuevo`.

Observado:

- Se puede aprobar una imagen de una empresa no aprobada.
- Se puede aprobar una imagen de un servicio no aprobado.
- Se puede aprobar un servicio de una empresa no aprobada.
- Empresas, servicios y uploads aparecen en tres listas globales separadas.

Riesgo:

- El admin puede publicar contenido fuera de orden.
- Puede aprobar servicios/uploads de otra empresa por error.
- Se pierde el contexto de revision de una empresa completa.

Reglas esperadas por Product Owner:

- No se pueden aprobar servicios de empresas no aprobadas.
- No se pueden aprobar imagenes de servicios no aprobados.
- La moderacion debe partir desde empresas pendientes.
- Al seleccionar una empresa, el admin debe ver los servicios de esa empresa y sus imagenes relacionadas.
- La aprobacion/rechazo debe ocurrir con contexto de empresa.

Decision requerida:

- Confirmar si el flujo admin debe ser tipo expediente:
  1. seleccionar empresa;
  2. revisar datos de empresa;
  3. revisar servicios de esa empresa;
  4. revisar imagenes de cada servicio;
  5. aprobar/rechazar con reglas claras.

Recomendacion tecnica:

- Cambiar UI admin de tres columnas independientes a una vista por empresa seleccionada.
- Mantener contadores globales solo como resumen.
- Agregar filtros por `companyId` para servicios/uploads internos.
- Bloquear o esconder acciones invalidas:
  - servicio no aprobable si empresa no esta aprobada;
  - imagen no aprobable si servicio no esta aprobado o si empresa no esta aprobada;
  - rechazo debe mostrar impacto en servicios/uploads asociados.
- Implementar validacion tambien en API, no solo en UI.

Prioridad sugerida: `P0/P1`.

Tipo: admin UX + reglas de negocio + API.

### PO2-003 - Admin deberia mostrar servicios e imagenes al seleccionar empresa

Ruta: `admin.html`, pestana `Modelo nuevo`.

Observado:

- La revision muestra listas globales de empresas, servicios y uploads.
- No hay seleccion de empresa que enfoque servicios/uploads relacionados.

Comportamiento esperado por Product Owner:

- El admin ve empresas por aprobar.
- Al seleccionar una empresa, aparecen sus servicios por aprobar.
- Dentro de cada servicio deben verse sus imagenes por aprobar.
- El admin no deberia tener que comparar manualmente `companyId` y `serviceId`.

Recomendacion:

- Crear layout de moderacion por empresa:
  - panel/lista de empresas pendientes;
  - detalle de empresa seleccionada;
  - servicios asociados;
  - imagenes asociadas por servicio;
  - acciones contextualizadas.

Prioridad sugerida: `P1`.

Tipo: admin UX.

### PO2-004 - Busqueda publica no permite encontrar claramente una empresa especifica

Ruta: `index.html`, busqueda/listado publico.

Observado:

- No se encontro una forma clara de filtrar o buscar por la empresa `Demo Owner Jardines del Sol`.
- Buscar por empresa no parece traer resultados de forma confiable, o no hay control evidente para hacerlo.

Comportamiento esperado:

- La busqueda debe permitir encontrar servicios por:
  - nombre de servicio;
  - categoria;
  - tipo de evento;
  - nombre de empresa.
- La busqueda debe respetar los filtros indicados que si aportan valor al usuario:
  - servicio/categoria;
  - provincia/zona;
  - texto libre, incluyendo nombre de empresa.
- Si el usuario busca `Demo Owner Jardines del Sol`, deberia aparecer al menos un servicio publicado de esa empresa o una ruta clara al perfil.
- Los filtros `Invitados` y `Presupuesto` deben eliminarse u ocultarse por ahora y no deben afectar resultados mientras no exista logica real asociada.

Preguntas de producto:

- La pagina publica debe buscar empresas directamente o solo servicios con contexto de empresa?
- Si una empresa no tiene servicios publicados, debe aparecer en busqueda?
- `Invitados` y `Presupuesto` vuelven despues como filtros reales o solo como datos de solicitud/cotizacion?

Recomendacion:

- Mantener busqueda centrada en servicios, pero incluir `companyName` y posiblemente `companySlug` en el indice/filtro.
- Mostrar texto de resultado que deje claro: `Servicio X por Empresa Y`.
- Agregar caso QA especifico para busqueda por nombre de empresa.
- Remover/ocultar `Invitados` y `Presupuesto` de la barra de filtros publica hasta que tengan reglas de negocio implementadas.

Prioridad sugerida: `P1`.

Tipo: busqueda publica + API/indexacion.

### PO2-005 - Filtro `Servicio: Todos` aparece de forma inconsistente

Ruta: `index.html`, filtros publicos.

Observado:

- A veces aparece la opcion `Todos` en el filtro de servicio y a veces no.
- No queda claro si depende de la ruta, estado de carga, datos publicados o seleccion previa.

Comportamiento esperado:

- El filtro debe tener un estado inicial estable y predecible.
- `Todos` debe estar disponible siempre que el filtro permita limpiar seleccion.
- Si hay estado de carga, no debe ocultar o cambiar el filtro de forma confusa.

Recomendacion:

- Revisar inicializacion de filtros y datos async.
- Asegurar que `Todos` se renderiza antes/despues de cargar opciones de forma consistente.
- Agregar prueba manual desktop/mobile para estado inicial y despues de aplicar filtros.

Prioridad sugerida: `P2`, subir a `P1` si impide encontrar servicios publicados.

Tipo: UI publica + estado de filtros.

### PO2-006 - Checks de servicios para bodas se marcan automaticamente y no queda claro para que sirven

Ruta: `index.html`, sidebar `Servicios para boda`.

Observado:

- Los checks de servicios se marcan automaticamente.
- No queda claro por que existen ni que relacion tienen con los filtros superiores.
- Puede confundirse con seleccion para cotizacion, filtro de busqueda o preferencias.

Preguntas de producto:

- Esos checks son filtros?
- Son seleccion de servicios para cotizar?
- Deben estar visibles en esta etapa del flujo?

Recomendacion:

- Ocultar o eliminar los checks de `Servicios para boda` por ahora.
- No deben aplicar ningun filtro mientras esten ocultos o sin logica final.
- Si vuelven despues, definir una sola intencion:
  - filtros sincronizados con resultados; o
  - seleccion de servicios para cotizacion.

Prioridad sugerida: `P2`, subir a `P1` si afecta conversion o comprension del flujo publico.

Tipo: UX publica + producto.

## Reglas de negocio propuestas para decision

Estas reglas deben confirmarse antes de implementar:

1. Un servicio no puede publicarse si la empresa no esta aprobada/publicada.
2. Una imagen de servicio no puede publicarse si la empresa o el servicio no estan aprobados/publicados.
3. Cada servicio puede tener hasta 10 imagenes en total.
4. Una y solo una imagen por servicio debe ser cover.
5. Imagenes no cover aprobadas aparecen en carrusel/galeria.
6. Rechazar empresa debe definir que pasa con servicios/uploads pendientes asociados.
7. Rechazar servicio debe definir que pasa con imagenes pendientes asociadas.
8. Busqueda publica debe encontrar servicios por nombre de empresa publicada.
9. Los filtros publicos sin logica real (`Invitados`, `Presupuesto`) deben ocultarse o eliminarse temporalmente.
10. Los checks laterales de `Servicios para boda` deben ocultarse o eliminarse temporalmente.

## Propuesta de tareas pequenas

### Tarea A - Producto/Data: cerrar reglas de imagenes por servicio

Alcance:

- Definir maximo de imagenes.
- Definir cover vs galeria.
- Definir edicion posterior a publicacion.
- Actualizar `docs/DATA_MODEL.md` y contratos API.

### Tarea B - Panel empresa: carga multiple de imagenes por servicio

Alcance:

- UI para subir hasta 10 imagenes.
- Seleccionar cover.
- Preview de imagenes.
- Enviar uploads como `cover` y `gallery`.

### Tarea C - API: validar limite y tipos de imagen por servicio

Alcance:

- Validar maximo de uploads asociados al servicio.
- Validar una sola imagen cover activa/pendiente por servicio.
- Mantener seguridad de SAS y sin exponer URLs internas.

### Tarea D - Admin: moderacion por empresa seleccionada

Alcance:

- Seleccionar empresa.
- Mostrar servicios/uploads asociados.
- Reducir dependencia de comparar IDs manualmente.

### Tarea E - API/Admin: bloquear aprobaciones invalidas

Alcance:

- No aprobar servicio si empresa no esta aprobada.
- No aprobar upload si empresa/servicio no esta aprobado.
- Respuestas claras para estados invalidos.

### Tarea F - Busqueda publica: incluir nombre de empresa

Alcance:

- Buscar por nombre de empresa.
- QA con `Demo Owner Jardines del Sol`.
- Respetar filtros utiles: texto, servicio/categoria y provincia/zona.
- Ocultar o eliminar filtros `Invitados` y `Presupuesto` mientras no tengan logica real.
- Ocultar o eliminar checks de sidebar `Servicios para boda`.
- Revisar estado `Todos`.

## Estado sugerido

Estado PO: `aprobacion pendiente con hallazgos P1/P0`.

No recomendar invitar primeras empresas reales hasta que Product / Architect / Release decida explicitamente:

- si se acepta temporalmente solo cover o se implementan hasta 10 imagenes;
- si se bloquean aprobaciones invalidas en API antes del piloto;
- si admin debe pasar a vista por empresa antes del piloto;
- si la busqueda por empresa es criterio minimo del MVP.
