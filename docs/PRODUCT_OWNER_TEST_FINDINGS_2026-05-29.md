# Hallazgos Product Owner - Prueba MVP 2026-05-29

Responsable destino: `Product / Architect / Release`.

Origen: prueba manual Product Owner usando `docs/PRODUCT_OWNER_TEST_SCRIPT.md` en Azure Static Web Apps.

## Resumen

El flujo principal pudo avanzar con registro, invitacion, panel empresa y moderacion admin, pero aparecieron fricciones de producto y riesgos operativos antes de invitar empresas reales.

Los hallazgos se agrupan en:

- claridad del registro publico;
- modelo de categorias/tipos de evento;
- formulario de servicios en panel empresa;
- carga y revision de imagenes;
- moderacion admin por empresa;
- seguridad operativa de credenciales usadas en prueba.

## Hallazgos

### PO-001 - Registro recibido deja el formulario con datos visibles

Ruta: `index.html#empresas`.

Observado:

- Al enviar el registro, aparece el mensaje `Registro recibido`.
- Los datos capturados no desaparecen de forma clara.
- La pantalla puede sentirse como si hubiera quedado detenida o "guindada".
- El boton permite la duda de si se puede seguir presionando `Enviar registro gratis`.

Pregunta de producto:

- Despues de enviar una empresa, deberia ocultarse/limpiarse el formulario y dejar solo el estado de confirmacion?

Recomendacion:

- Limpiar o esconder el formulario despues de un registro exitoso.
- Deshabilitar el boton durante el envio.
- Evitar doble submit desde UI.
- Dejar una accion clara: `Registrar otra empresa`.

Prioridad sugerida: `P1`.

Tipo: UX + prevencion de duplicados.

### PO-002 - Datos de contacto de empresa insuficientes

Ruta: registro publico de empresa.

Observado:

- El registro actual no cubre todos los canales que una empresa suele querer publicar o que el equipo podria necesitar para validarla.

Campos solicitados por PO:

- WhatsApp.
- Instagram.
- Facebook.
- Otros canales sociales o sitio web, si aplica.

Pregunta de producto:

- Cuales canales son obligatorios para registro y cuales son opcionales para perfil publico?

Recomendacion:

- Definir campos de contacto en `DATA_MODEL.md`.
- Separar datos internos de contacto y datos publicos.
- Agregar validaciones simples por canal.

Prioridad sugerida: `P1` si bloquea primeras empresas reales; `P2` si puede capturarse manualmente.

Tipo: producto + modelo de datos + UI.

### PO-003 - Categoria y tipos de evento se sienten duplicados

Ruta: `panel.html`, formulario de servicio.

Observado:

- El formulario muestra `Categoria` y `Tipos de evento`.
- Algunas opciones se solapan visualmente, por ejemplo `Bodas` puede sentirse como categoria y como tipo de evento.

Pregunta de producto:

- Necesitamos ambos campos en MVP?

Decision requerida:

- Opcion A: mantener ambos.
  - `Categoria`: que vende el proveedor, por ejemplo catering, fotografia, salon, mesa dulce.
  - `Tipos de evento`: para que eventos sirve, por ejemplo bodas, cumpleanos, corporativos.
- Opcion B: simplificar MVP a un solo campo controlado y agregar el segundo despues.

Recomendacion:

- Mantener ambos solo si el catalogo deja clara la diferencia.
- Revisar opciones actuales para que `Categoria` no use nombres de eventos.

Prioridad sugerida: `P1`.

Tipo: decision de producto + taxonomia.

### PO-004 - Campo `Estado` en panel empresa confunde

Ruta: `panel.html`, formulario de servicio.

Observado:

- El formulario muestra `Estado` con valor `draft`.
- No queda claro que puede hacer la empresa con ese estado.
- Si la empresa no debe controlar el estado, el campo genera ruido.

Pregunta de producto:

- La empresa puede elegir `draft/pending` o el sistema debe manejarlo automaticamente?

Recomendacion:

- Quitar `Estado` del formulario de empresa si no tiene accion real para el usuario.
- Mostrar el estado como etiqueta informativa en el card/listado del servicio.
- Definir si guardar servicio lo deja `draft` o lo envia automaticamente a revision.
- Resolver decision abierta de endpoint explicito `submit-review`.

Prioridad sugerida: `P1`.

Tipo: UX + flujo de revision.

### PO-005 - `Cantidad de fotos` no parece editable ni util

Ruta: `panel.html`, formulario de servicio.

Observado:

- Aparece `Cantidad de fotos`.
- No queda claro si se edita manualmente, se calcula o para que sirve.

Recomendacion:

- Quitar el campo manual.
- Calcular cantidad desde imagenes asociadas.
- Mostrarlo solo como lectura en el listado o resumen del servicio.

Prioridad sugerida: `P2`.

Tipo: UX.

### PO-006 - Carga de fotos incompleta o poco visible

Ruta: `panel.html`, formulario de servicio.

Observado:

- Se ve carga de `Cover del servicio`.
- No queda claro donde cargar mas fotos de galeria.
- PO espera poder cargar fotos adicionales, no solo cover.

Pregunta de producto:

- Para MVP, cada servicio necesita solo cover o tambien galeria?

Recomendacion:

- Si MVP requiere galeria, agregar control visible `Fotos del servicio` con multiples archivos.
- Diferenciar claramente:
  - Cover del servicio.
  - Galeria del servicio.
  - Imagenes de empresa/perfil.
- Documentar limites: formatos, tamano maximo y cantidad maxima.

Prioridad sugerida: `P1` si las imagenes son necesarias para publicar servicios reales.

Tipo: producto + UI + API/upload.

### PO-007 - Boton `Como se revisa` no tiene proposito claro

Ruta: `panel.html`, formulario de servicio.

Observado:

- Aparece el boton `Como se revisa`.
- No queda claro que accion ejecuta o que informacion entrega.

Pregunta de producto:

- Ese boton debe abrir una explicacion del proceso, un modal, una pagina de ayuda o eliminarse?

Recomendacion:

- Si se conserva, hacerlo abrir una ayuda breve sobre revision interna.
- Si no hay contenido final, quitarlo para MVP.

Prioridad sugerida: `P2`.

Tipo: UX/contenido.

### PO-008 - Moderacion admin muestra empresas, servicios y uploads como listas separadas sin foco por empresa

Ruta: `admin.html`, pestana `Modelo nuevo`.

Observado:

- Se muestran todas las empresas pendientes, todos los servicios revisables y todos los uploads pendientes.
- El admin podria aprobar una empresa y, por error, aprobar servicios o uploads de otra empresa.
- Es dificil seguir una sola empresa de punta a punta.

Pregunta de producto:

- La moderacion debe ser por entidad separada o por expediente de empresa?

Recomendacion:

- Agregar modo de revision por empresa:
  - seleccionar una empresa;
  - ver servicios de esa empresa;
  - ver uploads de esa empresa;
  - aprobar/rechazar con contexto.
- Mantener contadores globales, pero orientar la accion principal a un expediente.

Prioridad sugerida: `P1`.

Tipo: admin UX + seguridad operacional.

### PO-009 - Aprobacion/rechazo deberia considerar dependencias entre empresa, servicios e imagenes

Ruta: `admin.html`, moderacion nueva.

Observado:

- Aprobar empresa, servicio e imagen ocurre por separado.
- PO sugiere que aprobar servicios podria incluir imagenes relacionadas.
- PO sugiere que rechazar podria rechazar servicios e imagenes relacionados.

Pregunta de producto:

- Cual es la regla correcta?

Opciones:

- Aprobar empresa no publica automaticamente servicios.
- Aprobar servicio puede publicar tambien su cover/imagenes pendientes asociadas.
- Rechazar empresa podria rechazar servicios/uploads pendientes asociados.
- Rechazar servicio podria rechazar uploads pendientes asociados a ese servicio.

Recomendacion:

- Product / Architect debe definir reglas de cascada antes de cambiar API.
- Evitar cascadas silenciosas sin confirmacion en admin.
- Si se implementa cascada, mostrar resumen antes de confirmar: empresa, servicios e imagenes afectadas.

Prioridad sugerida: `P1`.

Tipo: decision de producto + API + admin.

### PO-010 - Credenciales admin quedaron expuestas durante prueba

Ruta: operacion de prueba.

Observado:

- La credencial admin fue pegada en conversacion/captura durante la prueba.

Recomendacion:

- Rotar `ADMIN_PASSWORD` despues de cerrar esta ronda.
- Recordar en el guion PO que no se deben compartir passwords ni capturas de consola con credenciales.
- Evaluar una forma mas segura de generar invitaciones desde admin UI para evitar comandos manuales con Basic Auth.

Prioridad sugerida: `P0` operacional antes de invitar empresas reales.

Tipo: seguridad/infra.

## Decisiones requeridas por Product / Architect / Release

1. Confirmar si el formulario de registro debe limpiarse/ocultarse despues de exito.
2. Definir campos de contacto/sociales para empresa y cuales son publicos.
3. Decidir taxonomia MVP: `Categoria` + `Tipos de evento` o un solo campo.
4. Decidir flujo de revision de servicio: guardar como borrador, enviar a revision automatico o boton explicito.
5. Decidir alcance de imagenes MVP: solo cover o cover + galeria.
6. Decidir si admin debe moderar por expediente de empresa.
7. Definir reglas de cascada para aprobar/rechazar empresa, servicios e imagenes.
8. Rotar credencial admin expuesta y registrar cierre.

## Propuesta de particion en tareas pequenas

- Web publico: limpiar/ocultar formulario despues de registro exitoso y prevenir doble submit.
- Product/Data: definir campos de contacto y actualizar `DATA_MODEL.md`.
- Product/Data: cerrar taxonomia de categorias vs tipos de evento.
- Panel empresa: quitar o convertir `Estado` y `Cantidad de fotos` a lectura.
- Panel empresa: definir e implementar carga de galeria si entra en MVP.
- Panel empresa: resolver `Como se revisa`.
- Admin: disenar vista de moderacion por empresa.
- API/Admin: definir endpoints o parametros para listar servicios/uploads por empresa.
- API/Admin: definir acciones de cascada con confirmacion.
- Infra: rotar `ADMIN_PASSWORD` y actualizar canal seguro.

## Estado sugerido

Estado PO: `aprobacion pendiente con hallazgos`.

No recomendar invitar primeras empresas reales hasta resolver o aceptar explicitamente:

- credencial admin expuesta;
- claridad de registro;
- taxonomia categoria/tipo;
- carga de imagenes esperada;
- moderacion admin por empresa o mitigacion equivalente.
