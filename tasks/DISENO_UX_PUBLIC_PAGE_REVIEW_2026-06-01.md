# Revision Diseno / UX pagina publica - 2026-06-01

Rol: Diseno / UX  
Destino: Product / Architect / Release  
Superficie revisada: pagina publica (`index.html`, `app.js`, `styles.css`, `data/providers.json`, `data/categories.json`, `assets/images/README.md`)  
Tipo de revision: rapida, sin cambios de codigo

## Resumen UX

La pagina publica conserva una buena base: estructura clara, hero con buscador, categorias visuales, listados por servicio, ficha de empresa/proveedor, cotizacion y registro para empresas. Para un MVP funcional esta bien encaminada.

El principal riesgo de diseno no es de usabilidad basica, sino de posicionamiento: la pagina aun comunica parcialmente "demo" o "marketplace generico", mientras el objetivo declarado es una plataforma de eventos de perfil medio a alto donde empresas publican paquetes para distintos tipos de eventos.

La mejora recomendada es un pulido visual/editorial acotado, no un rediseño completo.

## Pantallas / rutas revisadas

- `#inicio`: hero, buscador, indicadores, categorias, destacados, paquetes y CTA para proveedores.
- `#bodas`: subhero, filtros, resultados y cotizacion multiple.
- `#proveedor`: ficha de empresa/proveedor, galeria, servicio destacado, servicios relacionados y cotizacion.
- `#empresas`: registro de empresa, propuesta para proveedores y planes.
- Drawer de cotizacion.

## Hallazgos por severidad

### P1 - La marca todavia se percibe como demo, no como producto listo para empresas reales

Friccion:

- El `<title>` dice `Punto Evento CR | Demo propuesta`.
- La metadata dice `Demo local de una propuesta`.
- Hay textos visibles o rutas de fallback que aun mencionan `demo`.
- Para empresas reales, esto baja confianza y puede chocar con la meta de pre-lanzamiento controlado.

Recomendacion:

- Cambiar lenguaje de demo a lenguaje de producto MVP.
- Mantener mensajes internos/fallback tecnicos fuera de la experiencia publica.
- Usar copy mas seguro: `Punto Evento | Proveedores y paquetes para eventos en Costa Rica`.

Copy sugerido:

- Title: `Punto Evento | Proveedores y paquetes para eventos en Costa Rica`
- Description: `Busca salones, catering, musica, decoracion, fotografia y paquetes para eventos. Compara opciones y solicita cotizaciones.`

Bloqueador MVP:

- No bloquea funcionamiento, pero si afecta confianza para invitar primeras empresas reales.

### P1 - Las metricas actuales pueden sentirse no verificables para un producto nuevo

Friccion:

- `13k+ proveedores registrados`, `15+ anos conectando eventos` y `50+ categorias` comunican escala alta.
- Si el catalogo real esta vacio o en primer lote, esas cifras pueden parecer infladas.
- Para perfil medio-alto, la confianza depende mas de curaduria, revision y calidad que de numeros grandes no demostrables.

Recomendacion:

- Reemplazar metricas de volumen por promesas verificables del MVP.
- Enfatizar revision, servicios publicados, cotizacion dirigida y empresas con perfil completo.

Copy sugerido:

- `Empresas revisadas` / `Publicacion moderada antes de aparecer`
- `Servicios por categoria` / `Busca por servicio, evento o zona`
- `Cotizacion dirigida` / `Tu solicitud llega al proveedor correcto`
- `Registro gratis` / `Empresas pueden empezar sin costo`

Bloqueador MVP:

- Recomendable antes de invitar empresas reales.

### P2 - El estilo visual es correcto, pero podria elevarse con una direccion mas premium

Friccion:

- La paleta actual es limpia, pero se apoya mucho en teal + blanco + tarjetas simples.
- La tipografia usa sistema/Inter fallback sin una decision editorial visible.
- La pagina se siente funcional y ordenada, pero no necesariamente "medio-alto perfil".

Recomendacion:

- Definir una direccion visual de marca ligera:
  - tipografia editorial para titulos o una sans mas distintiva;
  - paleta menos generica, con acentos elegantes y neutros calidos controlados;
  - uso mas intencional de espacios, jerarquia y fotografias.
- No cambiar layout completo; trabajar tokens de color, tipografia, botones, badges y cards.

Que debe hacer Web Dev:

- Proponer un ajuste de tokens CSS en `styles.css`.
- Validar contraste y responsive despues del cambio.

Que debe decidir Product / Architect / Release:

- Confirmar tono visual: premium sobrio, moderno tropical, editorial bodas/eventos, o marketplace profesional.

### P2 - Imagenes externas de Unsplash reducen identidad y control de calidad

Friccion:

- Hero, categorias, cards demo y secciones usan URLs de Unsplash.
- Las imagenes son bonitas, pero pueden sentirse stock/genericas y no necesariamente Costa Rica.
- En perfil medio-alto, la curaduria visual es parte de la promesa.

Recomendacion:

- Crear una tarea de asset direction:
  - reemplazar hero y categorias principales con imagenes propias/licenciadas o Azure Blob/CDN;
  - usar imagenes por tipo de evento con estilo consistente;
  - definir fallback visual para empresas sin fotos aprobadas.

Que debe hacer Web Dev:

- No mover todavia todo a assets si no hay imagenes finales.
- Preparar una lista de slots visuales a reemplazar: hero, categorias, paquetes, proveedor fallback.

Riesgo si no se corrige:

- La pagina puede verse como plantilla o demo, aunque el flujo funcione.

### P2 - La propuesta "empresas publican paquetes por evento" no esta suficientemente protagonista

Friccion:

- El home habla de proveedores, servicios y paquetes, pero la idea de "paquetes para distintos tipos de eventos" podria estar mas clara desde el primer viewport.
- La pagina publica busca servicios, pero el posicionamiento comercial podria decir mejor que cada empresa puede publicar paquetes/servicios por evento.

Recomendacion:

- Ajustar hero y secciones de paquetes para conectar:
  - tipo de evento;
  - servicio o paquete;
  - empresa proveedora;
  - cotizacion.

Copy sugerido:

- H1: `Encuentra paquetes y proveedores para tu evento`
- Bajada: `Compara salones, catering, musica, decoracion, fotografia y servicios publicados por empresas revisadas en Costa Rica.`
- CTA: `Buscar servicios`

Que debe decidir Product / Architect / Release:

- Si el concepto publico principal sera `servicios`, `paquetes` o ambos.
- Recomendacion UX: usar `servicios y paquetes` en marketing, pero mantener resultados por servicio como modelo MVP.

### P2 - El drawer de cotizacion necesita mas confianza visual antes de pedir datos

Friccion:

- El formulario funciona y tiene contexto del servicio, pero visualmente pide datos personales rapido.
- Para eventos de valor medio/alto, el usuario necesita saber quien recibe la solicitud y que pasa despues.

Recomendacion:

- Agregar microcopy fijo antes del submit.
- Mostrar resumen compacto del servicio/empresa destino cuando exista.
- Evitar lenguaje generico como `proveedores seleccionados` cuando la solicitud va a una empresa concreta.

Copy sugerido:

- `Tu solicitud se enviara a la empresa de este servicio. Punto Evento conserva el registro para seguimiento.`
- `No publicamos tu email en la pagina. La empresa recibira los datos necesarios para responder tu cotizacion.`

### P2 - Acciones repetidas con texto compiten visualmente y pueden bajar el acabado premium

Friccion:

- Muchas tarjetas repiten pares de botones con texto: `Ver empresa`, `Cotizar servicio`, `Ver ficha`, `Pedir presupuesto`.
- En cards estrechas, dos botones de igual peso ocupan mucho espacio y hacen que la tarjeta se sienta mas operativa que curada.
- Algunas acciones secundarias podrian ser icono + tooltip, pero las acciones principales de conversion deben conservar texto.

Recomendacion:

- Mantener texto en CTAs principales:
  - `Buscar servicios`
  - `Cotizar servicio`
  - `Enviar solicitud`
  - `Crear perfil gratis`
- Usar icono + tooltip para acciones secundarias/repetidas:
  - ver ficha/perfil;
  - limpiar filtros;
  - cerrar drawer;
  - navegar galeria;
  - volver o editar en estados secundarios.
- En cards, evaluar patron:
  - CTA principal textual: `Cotizar`
  - accion secundaria compacta: icono de perfil/empresa con tooltip `Ver empresa`
- No usar icon-only para acciones ambiguas o de alto valor sin tooltip y `aria-label`.

Copy / tooltip sugerido:

- Icono edificio/tienda: `Ver perfil de empresa`
- Icono calendario/moneda: `Cotizar este servicio`
- Icono filtro-x: `Limpiar filtros`
- Icono cerrar: `Cerrar cotizacion`
- Icono imagen anterior/siguiente: `Foto anterior` / `Foto siguiente`

Que debe hacer Web Dev:

- Introducir una clase de boton iconico reutilizable, por ejemplo `icon-action`, con `aria-label` obligatorio.
- Agregar tooltips nativos o componente ligero solo para iconos no evidentes.
- Evitar iconos decorativos sin texto alternativo en acciones.

Bloqueador MVP:

- No bloquea MVP, pero es recomendable para una experiencia de perfil medio-alto.

### P2 - Jerarquia y tamano de botones necesita un sistema mas claro

Friccion:

- `.primary-button`, `.secondary-button` y `.ghost-button` comparten estructura y peso visual similar.
- En varias tarjetas, la accion secundaria puede competir con la primaria.
- `card-actions > * { flex: 1; }` fuerza botones al mismo ancho; esto es util en mobile, pero en desktop puede hacer que acciones pequenas se vean sobredimensionadas.

Recomendacion:

- Definir sistema de tamanos:
  - `button-lg`: hero, formularios principales, CTA de conversion.
  - `button-md`: cards amplias y filtros.
  - `button-sm` o `icon-action`: acciones secundarias en cards/listados.
- Mantener minimo tactil de 44px en mobile.
- En desktop, permitir que accion secundaria tenga ancho natural o icono compacto.
- Reservar `primary` para una sola accion principal por bloque.

Que debe hacer Web Dev:

- Revisar `.card-actions` para no forzar siempre dos botones al mismo peso en desktop.
- Mantener comportamiento apilado en mobile si mejora legibilidad.
- Validar textos largos como `Pedir cotizacion a varios`, `Cotizar seleccionados`, `Enviar registro gratis` en 375px.

### P2 - Tipografia y escala de texto pueden mejorar la sensacion editorial

Friccion:

- La fuente actual usa `Inter`/sistema, correcta pero muy de herramienta SaaS.
- Los titulos grandes comunican impacto, pero algunos bloques internos usan pesos altos en muchos elementos a la vez: botones, labels, tags, eyebrow, metricas.
- Para eventos de perfil medio-alto, conviene mas contraste editorial: titulos elegantes, body legible, labels discretos.

Recomendacion:

- Evaluar una combinacion tipografica:
  - titulos: serif editorial o sans display sobria;
  - cuerpo/UI: sans clara y eficiente.
- Reducir exceso de `font-weight: 800/850/900` en etiquetas y elementos secundarios.
- Mantener `letter-spacing: 0` como regla actual, salvo micro etiquetas si Product lo aprueba.
- Definir escala tipografica para:
  - hero;
  - secciones;
  - cards;
  - formularios;
  - badges.

Que debe decidir Product / Architect / Release:

- Si se permite cargar fuentes web externas o se prefiere sistema por rendimiento/privacidad.
- Si el tono deseado es editorial/premium o marketplace moderno sobrio.

### P3 - Algunos detalles de UI pueden pulirse para consistencia

Friccion:

- El boton de cerrar drawer muestra `x` en texto; puede verse menos refinado.
- `--terracotta` se usa para error, pero no esta definido en `:root`.
- Los badges y etiquetas usan varios estilos similares, pero sin jerarquia clara entre verificado, destacado, precio y plan.
- Algunas palabras sin tilde son consistentes con el repo, pero para una pagina publica premium conviene decidir si se usara espanol completo con tildes.
- `WhatsApp demo`, `Cotizacion multiple` y `Cotizar seleccionados` pueden sentirse ambiguos si no hay seleccion real o accion final clara.

Recomendacion:

- Definir `--danger` o corregir variable de error.
- Reemplazar `x` textual por icono accesible o caracter visual mas pulido.
- Crear jerarquia de badges: verificado, destacado, precio publicado, plan.
- Decidir politica editorial: ASCII sin tildes por compatibilidad o UTF-8 con tildes para acabado publico.
- Revisar botones que prometen seleccion multiple y confirmar si el flujo existe o si deben decir algo mas honesto.

## Recomendaciones concretas para tareas pequenas

### Tarea propuesta A - Pulido de marca publica pre-lanzamiento

Alcance:

- Quitar lenguaje `demo` de title, meta description y textos visibles publicos.
- Ajustar H1/bajada para comunicar eventos, paquetes, servicios y empresas revisadas.
- No tocar contratos API.
- No cambiar estructura de rutas.

Severidad: P1  
Responsable sugerido: Web Dev con validacion Diseno / UX

### Tarea propuesta B - Reemplazar metricas de volumen por confianza MVP

Alcance:

- Cambiar `trust-strip` a senales verificables del MVP.
- Evitar cifras grandes no respaldadas.
- Mantener layout actual.

Severidad: P1  
Responsable sugerido: Product / Architect / Release define copy; Web Dev implementa.

### Tarea propuesta C - Direccion visual medio-alto perfil

Alcance:

- Proponer ajuste de tokens CSS: tipografia, colores, botones, badges, cards y sombras.
- Mantener pagina publica actual como base.
- Verificar desktop/mobile.

Severidad: P2  
Responsable sugerido: Diseno / UX define guia breve; Web Dev implementa.

### Tarea propuesta D - Inventario y reemplazo progresivo de imagenes

Alcance:

- Crear inventario de imagenes actuales por slot.
- Definir cuales deben ser propias/licenciadas/Azure Blob.
- Reemplazar primero hero, categorias principales y fallback.

Severidad: P2  
Responsable sugerido: Product / Content + Web Dev.

### Tarea propuesta E - Mejorar confianza en cotizacion

Alcance:

- Ajustar copy/contexto del drawer de cotizacion.
- Mostrar claramente empresa y servicio destino cuando aplica.
- Mejorar microcopy antes del envio.

Severidad: P2  
Responsable sugerido: Web Dev.

### Tarea propuesta F - Sistema de botones, iconos y tooltips

Alcance:

- Auditar botones publicos en home, resultados, ficha, drawer y registro.
- Mantener texto en CTAs principales.
- Convertir acciones secundarias/repetidas a icono + tooltip + `aria-label` donde mejore claridad visual.
- Definir tamanos `lg/md/sm/icon` y reglas de uso.
- Revisar `.card-actions` para que acciones secundarias no compitan con conversion.

Severidad: P2  
Responsable sugerido: Diseno / UX define reglas; Web Dev implementa.

### Tarea propuesta G - Escala tipografica y pesos visuales

Alcance:

- Definir escala de titulos, body, labels, badges y botones.
- Evaluar fuente display/editorial para titulos o confirmar sistema actual.
- Reducir pesos excesivos en elementos secundarios.
- Validar lectura en mobile y desktop.

Severidad: P2  
Responsable sugerido: Diseno / UX + Web Dev.

## Que debe hacer Web Dev

- Esperar tareas pequenas del coordinador antes de implementar.
- Evitar redisenar layout completo.
- Mantener busqueda por servicio y rutas existentes.
- Validar desktop/mobile si se cambian estilos o hero.
- No convertir todos los botones a icon-only: preservar texto en acciones de conversion.
- Si se usan iconos, agregar `aria-label` y tooltip visible/descubrible para acciones no obvias.

## Que debe decidir Product / Architect / Release

- Tono visual de marca para pre-lanzamiento.
- Si el lenguaje comercial principal sera `servicios`, `paquetes` o `servicios y paquetes`.
- Si se aceptan temporalmente imagenes stock o se priorizan assets propios antes de invitar empresas reales.
- Copy final de confianza y metricas verificables.
- Si se aprueba una guia visual corta de botones/iconos/tipografia antes del siguiente ajuste Web Dev.

## Riesgos si no se corrige

- Empresas reales pueden percibir la pagina como demo o plantilla.
- Usuarios pueden dudar antes de dejar datos de cotizacion.
- La promesa de perfil medio-alto puede no sentirse respaldada por imagenes, tipografia y copy.
- Metricas no verificables pueden afectar confianza si el catalogo inicial esta vacio o en carga.

## Siguiente tarea sugerida

Product / Architect / Release deberia crear una tarea pequena:

`Pulido de marca publica pre-lanzamiento: quitar lenguaje demo, ajustar hero, reemplazar metricas por senales de confianza MVP, definir tono visual medio-alto perfil y ordenar sistema de botones/iconos/tipografia.`
