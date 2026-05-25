# Next steps para Punto Evento

## Estado actual

La demo local ya funciona como prototipo navegable:

- Home comercial con buscador.
- Landing de bodas con filtros demo.
- Ficha de proveedor con carrusel de imagenes.
- Pagina para empresas/proveedores.
- Formulario lateral de cotizacion.
- Datos de proveedores cargados desde `data/providers.json`.
- Paquetes cargados desde `data/packages.json`.
- Categorias cargadas desde `data/categories.json`.
- Fichas por proveedor con rutas tipo `#proveedor/casa-arboleda`.
- Fallback de imagen en `assets/images/fallback-provider.svg`.
- Configuracion base para Azure Static Web Apps.
- Carpeta `api/` creada con endpoints minimos de registro, subida de imagenes y lectura de proveedores publicados.

Validacion actual:

- Las rutas principales cargan correctamente.
- No hay errores de JavaScript en consola.
- La demo funciona desde un servidor estatico local, por ejemplo `http://127.0.0.1:4173/index.html`.
- El formulario de cotizacion valida campos minimos, pero no envia datos reales.
- Al enviar una cotizacion demo se muestra una confirmacion dentro del drawer.
- El boton de WhatsApp muestra una accion demo; no abre conversaciones reales todavia.
- El registro de empresas intenta usar Azure Functions; en local cae a confirmacion demo si la API no esta disponible.

Nota de alcance:

- Esta version sigue siendo una demo estatica.
- No hay envio de correos, integracion con WhatsApp ni publicacion automatica de empresas.
- La API de registro ya esta en el repo, pero requiere variables de entorno en Azure para operar.
- Los leads reales deben definirse en una fase posterior o enviarse primero a un formulario externo.

## Prioridad 1: Pulir la demo comercial

Objetivo: que la demo sea suficientemente clara para presentarla a un cliente, socio o proveedor.

Tareas:

- Ajustar textos finales de la home para vender mejor la propuesta.
- Reemplazar imagenes genericas por imagenes mas consistentes entre si.
- Crear 2 o 3 proveedores demo adicionales con perfiles completos.
- Mejorar los paquetes para que parezcan ofertas reales.
- Agregar testimonios en home y landing de bodas.
- Agregar una seccion de "Cotiza con varios proveedores a la vez".
- Revisar que todos los textos digan claramente "demo" cuando una accion no sea real.

Entregable:

- Demo presentable para validar concepto.

## Prioridad 2: Mejorar datos y estructura

Objetivo: que el contenido sea facil de mantener sin tocar tanto codigo.

Tareas:

- Agregar filtros reales sobre los datos cargados desde JSON.
- Permitir que cada categoria lleve a un listado filtrado.
- Hacer que la ficha muestre datos clave mas especificos por proveedor.
- Crear estados vacios para cuando no haya resultados.
- Crear estados de error mas amigables si falla la carga de datos.

Entregable:

- Demo mas cercana a un MVP real.

## Prioridad 3: Conversion y negocio

Objetivo: convertir visitantes en leads medibles.

Tareas:

- Definir el flujo de cotizacion multiple:
  - evento,
  - fecha,
  - invitados,
  - presupuesto,
  - servicios requeridos,
  - contacto.
- Crear una pantalla o modal de confirmacion despues de enviar solicitud.
- Definir como se enviarian los leads en MVP:
  - formulario externo,
  - email,
  - WhatsApp,
  - archivo,
  - servicio tipo Formspree,
  - Azure Function.
- Agregar eventos de medicion:
  - busqueda,
  - ver proveedor,
  - abrir WhatsApp,
  - enviar cotizacion,
  - publicar empresa.

Entregable:

- Demo preparada para medir interes real.

## Prioridad 4: Responsive y accesibilidad

Objetivo: que se vea bien en celular y sea mas usable.

Tareas:

- Revisar mobile en home, bodas, proveedor y empresas.
- Afinar tamanos de botones y tarjetas.
- Mejorar navegacion mobile.
- Agregar foco visible consistente.
- Revisar contraste de textos y badges.
- Revisar navegacion con teclado en carrusel y modal.

Entregable:

- Demo usable en desktop y mobile.

## Prioridad 5: Preparar MVP en Azure

Objetivo: publicar una version barata, rapida y mantenible.

Tareas:

- Crear repositorio GitHub.
- Publicar en Azure Static Web Apps.
- Subir imagenes definitivas a Azure Blob Storage.
- Cambiar URLs de Unsplash por URLs propias.
- Definir dominio, por ejemplo `puntoevento.cr`.
- Revisar headers de seguridad y cache.

Entregable:

- Demo publica para compartir.

## Prioridad 6: Futuro producto

Objetivo: pasar de demo estatica a plataforma.

Tareas:

- Backend para solicitudes de cotizacion.
- Panel basico para proveedores.
- Login de proveedores.
- Administracion de perfiles, fotos y paquetes.
- Moderacion/verificacion de proveedores.
- Busqueda real por categoria, ubicacion, precio y disponibilidad.
- Planes pagados para proveedores destacados.

Entregable:

- Roadmap de plataforma completa.

## Estado actualizado: ya publicada en Azure

Como la pagina ya esta en Azure, el foco deja de ser publicar y pasa a ser validar, medir y convertir.

Objetivos inmediatos:

- Validar que la version publica funcione bien.
- Medir visitas e interes real.
- Capturar solicitudes de cotizacion.
- Preparar contenido mas creible.
- Decidir que se construye como MVP y que se deja para despues.

## Recomendacion inmediata post Azure

El siguiente paso recomendado es convertir la pagina publicada en una demo comercial medible:

1. Revisar la URL publica en desktop y mobile.
2. Configurar dominio propio, por ejemplo `puntoevento.cr`.
3. Activar analitica para medir visitas, clicks y formularios.
4. Conectar el formulario de cotizacion a un destino real.
5. Reemplazar imagenes demo por imagenes propias o autorizadas.
6. Completar 8 a 12 proveedores demo con datos mas reales.
7. Preparar una presentacion corta para mostrar la propuesta.

Con eso se puede validar la propuesta antes de invertir en backend, panel de administracion o pagos.

## Checklist post despliegue Azure

## 1. Validacion tecnica

- Confirmar que la URL publica carga sin errores.
- Probar rutas:
  - inicio,
  - bodas,
  - proveedor,
  - empresas.
- Probar que `data/providers.json` carga en produccion.
- Probar que las imagenes externas cargan correctamente.
- Revisar consola del navegador en produccion.
- Revisar mobile real, no solo desktop.

## 2. Dominio y confianza

- Conectar dominio propio.
- Verificar HTTPS.
- Crear favicon.
- Agregar imagen social para compartir por WhatsApp, Facebook y LinkedIn.
- Agregar nombre, descripcion y metadata SEO basica.

## 3. Captura de leads

- Definir a donde llega una solicitud de cotizacion:
  - email,
  - WhatsApp,
  - Google Sheet,
  - Airtable,
  - Azure Function.
- Guardar campos minimos:
  - tipo de evento,
  - fecha,
  - invitados,
  - presupuesto,
  - nombre,
  - telefono,
  - mensaje.
- Crear mensaje de confirmacion claro.
- Medir cuantos usuarios abren y envian el formulario.

## 4. Medicion

- Instalar analitica.
- Medir:
  - visitas,
  - busquedas,
  - clicks en proveedor,
  - clicks en WhatsApp,
  - envios de cotizacion,
  - clicks en "Publicar empresa".
- Crear eventos separados para cliente final y proveedor.

## 5. Contenido para validacion

- Crear proveedores demo por categoria:
  - salones,
  - catering,
  - musica,
  - decoracion,
  - fotografia,
  - organizacion.
- Usar precios consistentes.
- Agregar fotos coherentes.
- Agregar paquetes mas comerciales.
- Agregar testimonios demo o reales si existen.

## 6. Decision de MVP

Despues de medir la demo publicada, decidir entre:

- Mantener MVP estatico con JSON y formulario conectado.
- Agregar Azure Function para recibir leads.
- Agregar base de datos.
- Crear panel de proveedores.
- Crear planes pagados y destacados.

## Sprint corto sugerido

Para el proximo bloque de trabajo, el orden mas conveniente es:

1. Configurar variables de entorno de la API en Azure Static Web Apps.
2. Probar registro real con `uploads-pending`, `Providers` y `ProviderImages`.
3. Revisar la URL publica en produccion.
4. Probar responsive en 375px, 768px y desktop.
5. Agregar analitica y eventos de conversion.

Este sprint mantiene el proyecto barato y estatico, pero ya lo acerca a una validacion comercial real.
