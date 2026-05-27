# TASK-004: Propuesta UI admin para empresas con multiples servicios

## Equipo

Web Dev.

## Estado

Completada.

## Objetivo

Preparar una propuesta inicial de UI admin para que una empresa pueda gestionar multiples servicios dentro de Punto Evento, alineada con el enfoque Empresa -> Servicios definido por Product/Architect.

Esta tarea fue de revision y propuesta. No se implementaron pantallas nuevas en codigo.

## Alcance

Se revisaron las piezas actuales del admin:

- `admin.html`
- `admin.js`
- `admin.css`

Tambien se revisaron las guias de producto/arquitectura indicadas por `chat-start/WEB_DEV.md`, incluyendo:

- `AGENTS.md`
- `docs/ARCHITECTURE.md`
- `docs/DATA_MODEL.md`
- `docs/BACKLOG.md`
- `EQUIPO_WEB_DEV_NUEVO_ENFOQUE.md`
- `REGISTRO_EMPRESAS.md`

## Fuera de alcance

- No se toco la pagina publica.
- No se modificaron `index.html`, `app.js` ni `styles.css`.
- No se cambiaron endpoints de API.
- No se cambio el flujo real de aprobacion/publicacion.
- No se hizo commit ni push como parte de esta tarea.

## Diagnostico actual

El admin actual esta orientado a revision interna de proveedores pendientes:

- Login con credenciales admin.
- Consulta de proveedores pendientes.
- Revision de datos e imagenes.
- Acciones de aprobar o rechazar.

Todavia no existe una experiencia para que una empresa administre su propio catalogo de servicios. Para multiples servicios conviene separar dos responsabilidades:

- Admin interno Punto Evento: revision, aprobacion y moderacion.
- Panel empresa: gestion de perfil, servicios, fotos y planes.

La propuesta inicial puede convivir dentro del admin actual como demo, pero debe quedar nombrada y visualmente separada para no mezclar ambos modelos.

## Pantallas necesarias

1. Login admin / acceso al panel

Mantener la pantalla actual, pero orientar el copy a "Panel de administracion" y mostrar claramente si se esta entrando al modo Revision interna o al modo Empresa demo.

2. Dashboard de empresa

Vista resumen de una empresa:

- Estado del perfil: borrador, pendiente, publicado, rechazado.
- Cantidad de servicios.
- Cantidad de imagenes aprobadas/pendientes.
- Datos principales de contacto.
- Accion primaria: "Agregar servicio".

3. Perfil de empresa

Formulario para datos que pertenecen a la empresa, no a un servicio:

- Nombre comercial.
- Categoria principal.
- Zona.
- Telefono.
- Email.
- Sitio/red social.
- Descripcion general.
- Estado de revision.

4. Lista de servicios

Pantalla principal para multiples servicios. Debe permitir escanear rapido:

- Nombre del servicio.
- Categoria.
- Tipo de evento.
- Precio desde.
- Estado: borrador, pendiente, publicado, rechazado.
- Foto portada.
- Ultima actualizacion.
- Acciones: editar, duplicar, enviar a revision, desactivar.

Para demo inicial puede ser una lista de tarjetas compactas. Para produccion conviene una tabla o layout hibrido con filtros.

5. Crear / editar servicio

Formulario enfocado en el servicio, separado de la empresa:

- Nombre del servicio.
- Categoria.
- Tipos de evento.
- Descripcion.
- Precio desde.
- Capacidad o cobertura, si aplica.
- Tags.
- Fotos del servicio.
- Estado de publicacion.

6. Fotos por servicio

Modulo para administrar imagenes asociadas al servicio:

- Subir fotos.
- Marcar portada.
- Ordenar galeria.
- Ver estado de cada imagen: pendiente, aprobada, rechazada.
- Mensaje claro si el servicio no tiene imagen aprobada.

7. Revision y publicacion

Vista de control para el estado de publicacion:

- Validaciones faltantes antes de enviar a revision.
- Historial simple de decisiones.
- Motivo de rechazo.
- CTA segun estado: guardar borrador, enviar a revision, reenviar.

8. Revision interna de servicios

Si Product/Architect decide revisar cada servicio de forma separada, el admin interno deberia poder aprobar/rechazar servicios individuales, no solo proveedores completos.

## Cambios sugeridos

- Separar visualmente "Revision interna" de "Panel empresa".
- Introducir navegacion por tabs o sidebar: `Pendientes`, `Empresa`, `Servicios`, `Fotos`, `Planes`.
- Convertir el admin en una interfaz mas operativa y menos hero: encabezados mas contenidos, metricas compactas, filtros y estados visibles.
- Modelar la UI desde `Company -> Service[]`, no desde un proveedor con una sola ficha.
- Mantener el demo inicial sin tocar API: usar datos demo en `admin.js` y persistencia local con `localStorage`.
- Evitar publicar servicios sin imagen aprobada cuando el flujo llegue a produccion.
- Mantener el admin actual de aprobacion como flujo separado hasta que Arquitectura defina endpoints y roles.

## Primera tarea pequena para implementar

Implementar una primera pantalla demo de "Servicios" dentro del admin actual.

Alcance propuesto:

- Tocar solo `admin.html`, `admin.js` y `admin.css`.
- Agregar una navegacion simple por tabs:
  - `Revision`
  - `Empresa demo`
  - `Servicios`
- Crear un panel `Servicios` con 2 o 3 servicios demo ligados a una empresa.
- Mostrar tarjetas compactas con nombre, categoria, precio desde, estado y cantidad de fotos.
- Agregar boton "Agregar servicio" que abra un formulario simple o panel inline.
- Guardar cambios solo en `localStorage`.
- No llamar API nueva.
- No tocar pagina publica.

Criterios de aceptacion:

- `/admin.html` carga sin errores de consola.
- El flujo actual de revision de proveedores sigue funcionando.
- La pestana `Servicios` muestra servicios demo.
- Se puede crear o editar un servicio demo localmente.
- Al refrescar, los servicios demo se conservan por `localStorage`.
- La pagina publica no cambia.

## Cambios realizados

- Se leyo `chat-start/WEB_DEV.md`.
- Se revisaron los documentos de direccion de producto/arquitectura indicados para Web Dev.
- Se revisaron `admin.html`, `admin.js` y `admin.css`.
- Se preparo esta propuesta de pantallas y cambios sugeridos.
- Se recreo el handoff de la tarea en `tasks/TASK-004-HANDOFF.md`.

## Archivos tocados

- `tasks/TASK-004-HANDOFF.md`

## Decisiones tomadas

- No se modifica la pagina publica.
- No se implementa UI todavia; esta tarea queda como propuesta lista para validacion.
- La primera implementacion recomendada debe ser demo/local, sin contrato nuevo de API.
- La separacion Admin interno vs Panel empresa queda como decision para Product/Architect.

## Verificacion realizada

- Se confirmo que `tasks/TASK-004-HANDOFF.md` existia con contenido de otra tarea.
- Se recreo el archivo con el handoff correspondiente a Web Dev.
- Se mantuvo el alcance limitado a documentacion.
- No se corrio prueba visual porque no hubo cambios de UI/codigo.

## Riesgos

- El admin actual mezcla el concepto de revision interna con una posible experiencia de empresa. Si se implementa sin separar roles, puede confundirse el modelo de producto.
- La API actual esta centrada en proveedores, no en servicios multiples.
- El modelo de permisos actual no define usuarios empresa vs administradores internos.
- Si se implementa localStorage demasiado lejos, puede crear una demo desconectada del backend real.
- El flujo de aprobacion debe decidir si aprueba empresas completas, servicios individuales o ambos.

## Pendientes

- Product/Architect debe decidir si el panel empresa vive dentro de `/admin` o en una ruta separada.
- Definir endpoints futuros para servicios:
  - listar servicios de empresa
  - crear servicio
  - editar servicio
  - subir fotos de servicio
  - enviar servicio a revision
  - aprobar/rechazar servicio
- Definir estados oficiales de servicio y reglas de publicacion.
- Definir si las imagenes pertenecen a empresa, servicio o ambos.
- Preparar QA checklist para CRUD de servicios.

## Recomendacion para Product/Architect

Recomiendo aprobar una primera iteracion demo y acotada en el admin actual, pero nombrarla claramente como "Servicios demo" para no mezclarla con el flujo interno de revision.

La decision principal pendiente es separar responsabilidades:

- Admin interno Punto Evento: revision, aprobacion y moderacion.
- Panel empresa: gestion de perfil, servicios, fotos y planes.

Si esa separacion se confirma, Arquitectura deberia actualizar rutas y contratos antes de que Web Dev avance con integracion real.

## Siguiente tarea sugerida

Web Dev puede implementar la primera pantalla demo de servicios tocando solo:

- `admin.html`
- `admin.js`
- `admin.css`

Resultado esperado: una pestana `Servicios` funcional con datos demo/localStorage, sin tocar pagina publica ni endpoints.
