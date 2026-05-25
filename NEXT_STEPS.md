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

Validacion actual:

- Las rutas principales cargan correctamente.
- No hay errores de JavaScript en consola.
- La demo funciona desde un servidor estatico local, por ejemplo `http://127.0.0.1:4173/index.html`.
- El formulario de cotizacion valida campos minimos, pero no envia datos reales.
- Al enviar una cotizacion demo se muestra una confirmacion dentro del drawer.
- El boton de WhatsApp muestra una accion demo; no abre conversaciones reales todavia.

Nota de alcance:

- Esta version sigue siendo una demo estatica.
- No hay backend, base de datos, envio de correos, integracion con WhatsApp ni registro real de empresas.
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

## Recomendacion inmediata

El siguiente paso recomendado es convertir la demo en una version presentable de venta antes de invertir en backend:

1. Completar contenido demo de proveedores y paquetes.
2. Mover paquetes y categorias a JSON para que el contenido sea facil de editar.
3. Pulir responsive mobile y accesibilidad de carrusel/formulario.
4. Preparar una narrativa de presentacion con 3 flujos:
   - cliente busca proveedores,
   - cliente cotiza con varios,
   - proveedor entiende por que registrarse.
5. Publicarla temporalmente en Azure Static Web Apps.

Con eso se puede validar la propuesta antes de invertir en backend, panel de administracion o pagos.

## Sprint corto sugerido

Para el proximo bloque de trabajo, el orden mas conveniente es:

1. Probar responsive en 375px, 768px y desktop.
2. Agregar filtros reales en la landing de bodas.
3. Pulir copy final para presentacion comercial.
4. Reemplazar imagenes de Unsplash por imagenes propias o Blob Storage.
5. Publicar una version temporal en Azure Static Web Apps.

Este sprint mantiene el proyecto barato y estatico, pero lo acerca mucho mas a una demo vendible.
