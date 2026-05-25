# Recomendaciones UX/UI y cambios requeridos

## Objetivo

Mejorar la experiencia de usuario de la demo de Punto Evento CR para que sea mas clara, confiable y orientada a conversion. La meta inmediata es que una persona pueda:

- Entender rapido que puede buscar proveedores para eventos.
- Comparar opciones sin friccion.
- Pedir una cotizacion con confianza.
- Entender el valor si es proveedor y quiere publicar su empresa.

## Diagnostico rapido

La demo ya tiene una base fuerte: home con buscador, categorias, listado de bodas, ficha de proveedor, paquetes, formulario lateral de cotizacion y pagina para empresas. Visualmente se percibe ordenada y comercial.

Desde la ultima revision ya se corrigieron varios puntos importantes: los datos principales viven en JSON, las fichas tienen rutas por proveedor, el drawer de cotizacion valida campos minimos, el cierre ya no registra solicitudes falsas, hay confirmacion demo dentro del drawer y no se detectan caracteres rotos en los archivos actuales.

Los principales puntos por mejorar ahora estan en la experiencia: los filtros siguen siendo demostrativos, falta reforzar confianza antes de pedir datos, el formulario podria capturar mejor presupuesto/servicios requeridos, y la revision responsive/accesibilidad todavia debe cerrarse antes de presentar o publicar.

## Estado de recomendaciones

| Tema | Estado | Nota |
| --- | --- | --- |
| Caracteres visibles | Hecho | No se encontraron patrones de mojibake en HTML, JS, CSS ni JSON. |
| Datos separados | Hecho | Proveedores, paquetes y categorias estan en `data/*.json`. |
| Fichas por proveedor | Hecho | Las rutas tipo `#proveedor/casa-arboleda` ya cargan proveedor, galeria y paquetes asociados. |
| Cierre/envio de cotizacion | Hecho | Cerrar no registra solicitud; enviar valido muestra confirmacion demo. |
| Filtros reales | Pendiente | El buscador y filtros todavia muestran mensajes demo y no actualizan resultados. |
| Confianza antes de cotizar | Parcial | Hay confirmacion demo, pero falta microcopy antes del envio y explicacion de datos/tiempos. |
| Formulario de cotizacion | Parcial | Valida campos minimos, pero falta presupuesto, servicios requeridos y resumen de solicitud. |
| Mobile y accesibilidad | Parcial | El drawer maneja foco/Escape/Tab, pero falta foco visible global y carrusel por teclado. |
| Imagenes propias/Blob | Pendiente | Unsplash sigue siendo fuente demo. |

## Cambios requeridos de prioridad alta

### 1. Corregir textos y caracteres visibles

Estado: hecho.

Problema:

En la interfaz aparecen caracteres mal codificados en separadores, estrellas, checks, flechas del carrusel y simbolos de moneda. Esto afecta la percepcion profesional de la demo.

Cambios requeridos:

- Reemplazar simbolos rotos por texto, entidades HTML o caracteres correctos.
- Revisar todo el contenido visible en `app.js`, `index.html` y los JSON.
- Decidir si el proyecto usara texto sin tildes o UTF-8 completo con tildes, y mantenerlo consistente.

Criterio de aceptacion:

- No debe verse ningun caracter roto en home, bodas, proveedor, empresas, drawer de cotizacion ni toasts.

### 2. Hacer que los filtros funcionen de verdad

Estado: pendiente.

Problema:

El buscador de home y los filtros de bodas muestran mensajes demo, pero no filtran resultados reales. Esto puede frustrar al usuario porque la interfaz promete busqueda.

Cambios requeridos:

- Filtrar proveedores por categoria/servicio.
- Filtrar por provincia o ubicacion.
- Filtrar paquetes por tipo de evento.
- Mostrar conteo de resultados.
- Agregar estado vacio cuando no haya coincidencias.

Criterio de aceptacion:

- Al cambiar filtros, el listado debe actualizarse sin recargar la pagina.
- Si no hay resultados, se debe mostrar un mensaje claro y una accion para limpiar filtros.

### 3. Reforzar confianza antes de cotizar

Estado: parcial.

Problema:

El usuario ve proveedores y precios, pero faltan senales de seguridad mas explicitas antes de entregar nombre y WhatsApp.

Cambios requeridos:

- Mostrar por que un proveedor esta verificado.
- Explicar que ocurre despues de enviar una solicitud.
- Agregar microcopy cerca del formulario: "No compartimos tus datos sin confirmar" o equivalente, si aplica al modelo real.
- Incluir tiempo estimado de respuesta.
- Diferenciar proveedores verificados, destacados y demo.

Criterio de aceptacion:

- Antes del boton de enviar cotizacion, el usuario debe entender quien recibe la solicitud y que pasara despues.

### 4. Mejorar el flujo de cotizacion

Estado: parcial.

Problema:

El drawer de cotizacion funciona, pero todavia no captura toda la informacion necesaria para calificar un lead de eventos.

Cambios requeridos:

- Agregar campo de presupuesto estimado.
- Permitir seleccionar servicios requeridos: salon, catering, musica, decoracion, fotografia, planificacion.
- Mostrar proveedores seleccionados cuando la cotizacion venga desde una ficha o listado.
- Cambiar "Enviar solicitud demo" por una etiqueta mas clara segun el entorno:
  - Demo: "Simular solicitud".
  - MVP real: "Enviar solicitud".
- Expandir la confirmacion actual para mostrar resumen de la solicitud.

Criterio de aceptacion:

- El formulario debe producir una solicitud entendible para un proveedor, aunque aun no se envie a un backend.

## Cambios requeridos de prioridad media

### 5. Mejorar navegacion mobile

Estado: pendiente de prueba visual.

Problema:

La navegacion superior en mobile queda como barra horizontal. Funciona, pero puede sentirse apretada y competir con el contenido principal.

Cambios requeridos:

- Evaluar un menu compacto para mobile.
- Mantener visibles las acciones principales: buscar, bodas, publicar empresa.
- Evitar que la barra ocupe demasiado alto en pantallas pequenas.
- Verificar que los botones mantengan al menos 44 px de alto.

Criterio de aceptacion:

- En 375 px de ancho, la navegacion debe ser clara, sin textos cortados ni elementos superpuestos.

### 6. Mejorar jerarquia del home

Estado: parcial.

Problema:

El home comunica bien la propuesta, pero puede orientar mejor al usuario hacia acciones concretas.

Cambios requeridos:

- Hacer mas directo el texto principal: buscar proveedores, comparar precios y cotizar.
- Agregar una seccion breve de beneficios para clientes.
- Agregar una seccion breve de beneficios para proveedores, sin mezclar demasiado ambos publicos al inicio.
- Destacar una accion primaria por bloque.

Criterio de aceptacion:

- En los primeros segundos, el usuario debe poder responder: que es, para quien es y que puedo hacer ahora.

### 7. Pulir tarjetas de proveedores

Estado: parcial.

Problema:

Las tarjetas muestran buena informacion, pero la comparacion puede ser mas facil.

Cambios requeridos:

- Estandarizar datos visibles: categoria, ubicacion, precio, rating, numero de opiniones y tiempo de respuesta.
- Agregar una etiqueta clara para "Precio desde".
- Evitar que etiquetas largas rompan la tarjeta.
- Mantener botones consistentes: "Ver ficha" y "Cotizar".

Criterio de aceptacion:

- El usuario debe poder comparar 3 proveedores sin abrir cada ficha.

### 8. Mejorar ficha de proveedor

Estado: parcial.

Problema:

La ficha tiene galeria y resumen, pero puede vender mejor el servicio y reducir dudas.

Cambios requeridos:

- Agregar seccion "Incluye" y "No incluye" en paquetes.
- Mostrar cobertura geografica.
- Mostrar metodos de contacto disponibles.
- Agregar preguntas frecuentes por proveedor.
- Hacer que el boton de WhatsApp abra una URL real cuando exista el numero.

Criterio de aceptacion:

- Una ficha debe responder las dudas basicas antes de pedir presupuesto.

## Cambios requeridos de prioridad baja

### 9. Mejorar estados del sistema

Estado: parcial.

Cambios requeridos:

- Loading visual mas atractivo al cargar datos.
- Estado de error con accion para reintentar.
- Toasts con mensajes mas especificos.
- Confirmaciones que no dependan solo de mensajes temporales. La cotizacion ya tiene confirmacion dentro del drawer, pero falta resumen.

### 10. Optimizar imagenes y consistencia visual

Estado: pendiente.

Cambios requeridos:

- Sustituir imagenes externas de Unsplash por imagenes propias o alojadas en storage controlado.
- Mantener un estilo visual consistente entre categorias.
- Agregar `width` y `height` o contenedores con dimensiones estables donde aplique.
- Revisar rendimiento en mobile.

### 11. Preparar medicion de conversion

Estado: pendiente.

Cambios requeridos:

- Medir busquedas realizadas.
- Medir clics en "Ver ficha".
- Medir aperturas de cotizacion.
- Medir envios de solicitud.
- Medir clics en WhatsApp.
- Medir clics en "Publicar empresa".

## Accesibilidad requerida

Estado: parcial.

Cambios requeridos:

- Revisar contraste de badges, botones secundarios y textos sobre imagen.
- Asegurar foco visible en todos los botones y enlaces.
- Confirmar que el drawer mantiene el foco correctamente.
- Permitir navegacion del carrusel con teclado.
- Usar etiquetas `label` asociadas correctamente a inputs y selects.
- Evitar que informacion importante dependa solo del color.

Criterio de aceptacion:

- El flujo principal debe poder completarse con teclado: buscar, abrir ficha, abrir cotizacion, llenar formulario y cerrar drawer.

## Contenido recomendado

Para clientes:

- "Compara proveedores verificados para tu evento".
- "Pide una cotizacion y recibe opciones segun fecha, presupuesto y cantidad de invitados".
- "Ahorra tiempo comparando paquetes, fotos, precios y opiniones en un solo lugar".

Para proveedores:

- "Publica tu empresa y recibe solicitudes de personas que ya estan organizando un evento".
- "Muestra paquetes, fotos, precios desde y datos clave".
- "Aumenta visibilidad en categorias como bodas, catering, salones y eventos corporativos".

## Backlog sugerido

### Sprint 1: Presentacion profesional

- Revisar responsive en 375 px, 768 px y desktop.
- Ajustar textos principales.
- Reforzar confianza en cotizacion.
- Completar confirmacion con resumen de cotizacion.
- Agregar foco visible global para enlaces, botones y controles.
- Permitir navegacion del carrusel con teclado.

### Sprint 2: Busqueda real

- Implementar filtros reales.
- Agregar conteo de resultados.
- Agregar estado vacio.
- Conectar categorias a filtros.
- Ordenar proveedores por destacado, rating o precio.

### Sprint 3: Conversion MVP

- Definir envio real de leads.
- Activar WhatsApp real.
- Registrar eventos de conversion.
- Agregar integracion temporal con formulario externo, correo o Azure Function.

## Recomendacion final

Antes de invertir en backend, conviene convertir la demo en una experiencia presentable y medible. El orden recomendado es:

1. Probar y ajustar responsive/accesibilidad.
2. Hacer filtros reales sobre los JSON actuales.
3. Mejorar el formulario de cotizacion con presupuesto, servicios y resumen.
4. Reforzar confianza antes del envio.
5. Publicar una version temporal.
6. Medir si clientes y proveedores entienden el valor.

Con esos cambios, la pagina pasaria de "demo navegable" a "prototipo comercial validable".
