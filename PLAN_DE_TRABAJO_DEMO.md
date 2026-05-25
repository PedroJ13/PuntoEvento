# Plan de trabajo: demo local para Punto Evento

## Carpeta de trabajo

Trabajaria en la carpeta actual del proyecto:

`C:\Users\pj13e\OneDrive\Documents\Pagina de eventos`

Por ahora esta carpeta esta limpia, solo contiene el repositorio Git. Eso la hace adecuada para crear la demo local desde cero sin mezclarla con otros archivos.

## Objetivo

Crear una demo local navegable que sirva como propuesta comercial y visual para el desarrollo de Punto Evento Costa Rica.

La demo debe mostrar como la plataforma puede dejar de sentirse como un directorio de anuncios y convertirse en una herramienta clara para:

- Atraer clientes que estan organizando eventos.
- Ayudarlos a comparar proveedores.
- Generar solicitudes de presupuesto.
- Convencer a proveedores de registrarse o pagar por mayor visibilidad.

## Enfoque de negocio

La nueva propuesta debe posicionar a Punto Evento como una plataforma de decision, no solo como un listado.

Propuesta sugerida:

> Encontra proveedores confiables para tu evento en Costa Rica. Compara opciones, pedi cotizaciones y reserva con mas seguridad.

Publicos principales:

- Clientes finales: personas, parejas, familias o empresas que necesitan organizar un evento.
- Proveedores: salones, caterings, fotografos, decoradores, animadores, wedding planners y empresas de servicios para eventos.

Acciones principales que debe impulsar la demo:

- Buscar proveedores.
- Pedir cotizacion.
- Comparar paquetes.
- Contactar por WhatsApp.
- Publicar una empresa.

## Alcance de la demo

La demo local debe incluir 4 pantallas principales.

## 1. Home principal

La home debe estar enfocada en conversion.

Elementos:

- Hero con mensaje claro:
  - "Encontra proveedores confiables para tu evento en Costa Rica"
- Buscador principal:
  - Tipo de evento.
  - Ubicacion.
  - Cantidad de personas.
- Accesos rapidos:
  - Bodas.
  - Fiestas infantiles.
  - Eventos corporativos.
  - Graduaciones.
  - Catering.
  - Salones.
- Seccion "Como funciona":
  - Busca.
  - Compara.
  - Pedi presupuesto.
- Proveedores destacados.
- Paquetes populares.
- CTA para empresas:
  - "Publica tu empresa gratis".

Objetivo de esta pantalla:

Hacer que el visitante entienda rapidamente que puede encontrar y comparar proveedores para su evento.

## 2. Landing de evento

Pantalla ejemplo: "Bodas en Costa Rica".

Elementos:

- Titulo especifico:
  - "Organiza tu boda en Costa Rica con proveedores confiables"
- Buscador filtrado para bodas.
- Categorias necesarias:
  - Salones.
  - Catering.
  - Fotografia.
  - Musica.
  - Decoracion.
  - Wedding planner.
- Paquetes destacados con precios.
- Beneficios:
  - Comparar opciones.
  - Pedir presupuesto.
  - Contactar por WhatsApp.
- CTA principal:
  - "Pedir cotizacion a varios proveedores".

Objetivo de esta pantalla:

Mostrar una experiencia mas guiada para usuarios que ya saben que tipo de evento estan organizando.

## 3. Ficha de proveedor

Pantalla demo de un proveedor destacado.

Elementos:

- Galeria de fotos.
- Nombre del proveedor.
- Categoria.
- Ubicacion.
- Precio desde.
- Servicios incluidos.
- Insignias de confianza:
  - Verificado.
  - Responde rapido.
  - Precio publicado.
- Calificacion y opiniones.
- Boton de WhatsApp.
- Boton "Pedir presupuesto".
- Paquetes disponibles.
- Preguntas frecuentes.

Objetivo de esta pantalla:

Convertir interes en contacto. La ficha debe reducir dudas y aumentar confianza.

## 4. Pagina para empresas

Landing para proveedores que quieran registrarse.

Elementos:

- Titulo fuerte:
  - "Recibi clientes interesados en tus servicios de eventos"
- Beneficios:
  - Perfil profesional.
  - Solicitudes de presupuesto.
  - Galeria de fotos.
  - Paquetes y promociones.
  - Estadisticas.
  - Mayor visibilidad.
- Comparacion simple de planes:
  - Gratis.
  - Destacado.
  - Premium.
- CTA principal:
  - "Crear perfil gratis".

Objetivo de esta pantalla:

Vender el valor de registrarse antes de mostrar un formulario largo.

## Stack recomendado

Para una demo local rapida y moderna:

- React o Next.js.
- Tailwind CSS.
- lucide-react para iconos.
- Datos locales en JSON.
- Sin backend en esta primera etapa.

La idea es que la demo sea visual, navegable y facil de modificar.

## Plan por fases

## Fase 1: Definir propuesta y flujo

Duracion estimada: 1 dia.

Tareas:

- Definir mensaje principal.
- Separar clientes finales y proveedores.
- Elegir eventos prioritarios para la demo.
- Definir acciones principales.
- Crear contenido base para cada pantalla.

Entregable:

- Documento corto con propuesta de valor, publico objetivo y flujo de conversion.

## Fase 2: Wireframe

Duracion estimada: 1 dia.

Tareas:

- Definir estructura de la home.
- Definir estructura de la landing de bodas.
- Definir ficha de proveedor.
- Definir landing para empresas.
- Ordenar secciones por prioridad comercial.

Entregable:

- Wireframe simple de las 4 pantallas.

## Fase 3: Diseno visual

Duracion estimada: 1 a 2 dias.

Tareas:

- Definir paleta de colores.
- Definir tipografia.
- Crear estilo de botones, filtros y tarjetas.
- Disenar componentes reutilizables:
  - Buscador.
  - Card de proveedor.
  - Card de paquete.
  - Filtros.
  - Testimonios.
  - CTA.

Entregable:

- Maqueta visual base de la demo.

## Fase 4: Desarrollo local

Duracion estimada: 2 a 4 dias.

Tareas:

- Crear proyecto local.
- Construir las 4 pantallas.
- Agregar navegacion.
- Crear datos demo de proveedores.
- Simular busqueda y filtros.
- Agregar botones de WhatsApp y presupuesto como demo.
- Revisar responsive en desktop y mobile.

Entregable:

- Demo funcional corriendo en local.

## Fase 5: Contenido comercial

Duracion estimada: 1 dia.

Tareas:

- Mejorar textos de venta.
- Crear paquetes ejemplo.
- Crear proveedores ficticios o representativos.
- Escribir beneficios para clientes.
- Escribir beneficios para proveedores.
- Preparar narrativa para presentar la propuesta.

Entregable:

- Demo con copy comercial listo para presentacion.

## Fase 6: Revision y ajustes

Duracion estimada: 1 dia.

Tareas:

- Revisar claridad del mensaje.
- Revisar conversion de CTAs.
- Revisar mobile.
- Ajustar jerarquia visual.
- Pulir textos.
- Preparar resumen final de propuesta.

Entregable:

- Demo pulida para presentar como propuesta de desarrollo.

## Orden recomendado de implementacion

1. Home principal.
2. Landing de bodas.
3. Ficha de proveedor.
4. Pagina para empresas.

Este orden permite contar una historia completa:

El cliente entra, busca un evento, revisa opciones, abre un proveedor y pide presupuesto.

## Resultado esperado

Al finalizar, tendremos una demo local que demuestra:

- Una propuesta de valor mas clara.
- Mejor experiencia para clientes.
- Mejor argumento comercial para proveedores.
- Flujo de cotizacion mas directo.
- Mayor confianza visual.
- Base para vender el desarrollo completo de la pagina.
