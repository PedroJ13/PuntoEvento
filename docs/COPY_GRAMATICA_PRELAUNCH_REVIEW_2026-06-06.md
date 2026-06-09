# Revision Copy / Gramatica pre-lanzamiento

Fecha: 2026-06-06
Responsable: Copy / Gramatica
Destino: Product / Architect / Release

## Contexto

Se revisaron textos visibles de Punto Evento CR antes de lanzamiento publico controlado.

Superficies revisadas:

- Pagina publica: `index.html`, `app.js`.
- Registro de empresas: `app.js`.
- Ficha publica de empresa/proveedor: `app.js`.
- Panel empresa: `panel.html`, `panel.js`.
- Admin interno: `admin.html`, `admin.js`.
- Emails transaccionales/internos: `api/shared/email.js`.
- Mensajes API que pueden aparecer en UI: `/api/**/*.js`.

No se editaron archivos de aplicacion. Este documento propone tareas para Product / Architect / Release.

## Resumen ejecutivo

La plataforma esta cerca de lanzamiento, pero el copy visible todavia conserva tres riesgos editoriales:

- Textos publicos que dicen `demo`, `Demo propuesta` o comunican fase interna.
- Falta sistematica de tildes y signos en copy visible.
- Microcopy tecnico o interno visible para usuarios, empresas o admin: `Legacy`, `uploads`, `Company -> Services`, `password`, `API`, `Azure`, `cover`.
- Copy de empresa que comunica revision/moderacion manual. Product indica que no debe verse como revision del equipo; debe sentirse automatico o como publicacion pronta.

Recomendacion: abrir un bloque pequeno de tareas de copy pre-lanzamiento antes de mostrar la pagina al publico o a primeras empresas reales.

## Decision editorial nueva de Product

Product indica que en la experiencia visible para empresas no debe comunicarse que Punto Evento CR revisa, modera, aprueba o publica manualmente.

Direccion de copy:

- Evitar frases como `revisaremos la empresa`, `modera y publica`, `registro revisado`, `enviar a revision`, `pendiente de revision`, `tu empresa fue aprobada`.
- Usar lenguaje de proceso automatico o de publicacion pronta: `se publicara lo antes posible`, `se cargan para publicacion`, `tu acceso esta listo`, `preparar para publicacion`.
- Mantener lenguaje de revision solo en superficies claramente internas de admin si Product / Architect / Release lo considera necesario para operacion.

Ejemplo de tono deseado:

- En vez de `Punto Evento CR revisara la empresa y enviara acceso al panel`, usar `Enviaremos acceso al panel para completar tu perfil`.
- En vez de `Creas servicios, subes fotos y envias a revision`, usar `Creas servicios, subes fotos y los preparas para publicacion`.
- En vez de `Las imagenes se cargan para revision`, usar `Las imagenes se cargan y seran publicadas lo antes posible`.

## Hallazgos P1

### P1-01 - Pagina publica se presenta como demo

Pantalla/flujo: Pagina publica, metadata y marca accesible.

Texto actual:

- `Punto Evento CR | Demo propuesta`
- `Demo local de una propuesta para Punto Evento CR.`
- `Punto Evento CR demo`

Ubicacion:

- `index.html`

Problema:

Para lanzamiento publico, la palabra `demo` reduce confianza y comunica que el producto no esta listo.

Texto sugerido:

- Title: `Punto Evento CR | Proveedores para eventos en Costa Rica`
- Meta description: `Encuentra y contacta proveedores para eventos en Costa Rica.`
- Aria label marca: `Punto Evento CR`

Motivo:

Mejora confianza y elimina lenguaje de ambiente interno.

Prioridad: P1

Tipo de cambio: Solo copy/metadata.

### P1-02 - Metricas publicas pueden prometer escala no validada

Pantalla/flujo: Home publica, indicadores.

Texto actual:

- `13k+ proveedores registrados`
- `15+ anos conectando eventos`
- `50+ categorias de servicio`

Ubicacion:

- `app.js`

Problema:

Si estas metricas no son datos reales y verificables de Punto Evento CR, pueden inducir a error antes del lanzamiento.

Texto sugerido:

Opcion conservadora:

- `Proveedores por categoria`
- `Contacto directo`
- `Registro gratis para empresas`

Opcion si Product quiere mantener metricas:

- Reemplazar por metricas reales verificadas o remover el bloque temporalmente.

Motivo:

Evita promesas comerciales no sustentadas.

Prioridad: P1

Tipo de cambio: Decision de producto + copy.

### P1-03 - `Cotizacion multiple` promete un flujo que no existe plenamente

Pantalla/flujo: Home publica / drawer de solicitud.

Texto actual:

- `Cotizacion multiple`

Ubicacion:

- `app.js`

Problema:

El drawer requiere un servicio publicado especifico. El texto sugiere cotizar varios proveedores a la vez.

Texto sugerido:

- `Enviar solicitud`
- `Contactar proveedor`
- `Solicitar cotizacion`

Motivo:

Alinea expectativa del usuario con el comportamiento real del MVP.

Prioridad: P1

Tipo de cambio: Solo copy, salvo que Product quiera implementar cotizacion multiple real.

### P1-04 - Secciones publicas aun dicen `Planes demo`

Pantalla/flujo: Registro empresas / planes.

Texto actual:

- `Planes demo`

Ubicacion:

- `app.js`

Problema:

Visible en una superficie publica. Comunica ambiente de prueba.

Texto sugerido:

- `Planes para empresas`
- `Opciones de visibilidad`

Motivo:

Elimina lenguaje interno sin cambiar alcance MVP.

Prioridad: P1

Tipo de cambio: Solo copy.

## Hallazgos P2

### P2-01 - Faltan tildes y signos en copy visible

Pantalla/flujo: Publica, panel empresa, admin, emails.

Texto actual, ejemplos:

- `Encontra`
- `musica`
- `decoracion`
- `envia`
- `Ubicacion`
- `Graduacion`
- `anos`
- `categorias`
- `descripcion`
- `mas rapido`
- `Cotizacion`
- `pagina`
- `revision`
- `despues`
- `unico`
- `basico`
- `campanas`
- `optimizacion`
- `sesion`
- `informacion`
- `imagenes`
- `galeria`
- `automaticamente`

Ubicacion:

- `index.html`
- `app.js`
- `panel.html`
- `panel.js`
- `admin.html`
- `admin.js`
- `api/shared/email.js`
- `data/event-types.json`
- `data/categories.json`

Problema:

La falta sistematica de tildes hace que la marca se perciba menos cuidada justo antes del lanzamiento.

Texto sugerido:

Corregir copy visible con espanol completo:

- `Encontrá` o `Encuentra`, segun tono definido.
- `música`
- `decoración`
- `enviá` o `envía`, segun tono definido.
- `Ubicación`
- `Graduación`
- `años`
- `categorías`
- `descripción`
- `más rápido`
- `Cotización`
- `página`
- `revisión`
- `después`
- `único`
- `básico`
- `campañas`
- `optimización`
- `sesión`
- `información`
- `imágenes`
- `galería`
- `automáticamente`

Motivo:

Pulido editorial transversal.

Prioridad: P2

Tipo de cambio: Solo copy.

Decision pendiente:

Definir si la voz publica usa voseo costarricense suave (`Encontrá`, `Enviá`) o trato neutro (`Encuentra`, `Envía`). No mezclar ambos.

### P2-02 - Registro empresas usa frases internas o poco naturales

Pantalla/flujo: Pagina de empresas / registro.

Texto actual:

- `Una pagina que vende antes del formulario`
- `Punto Evento CR modera y publica lo aprobado.`
- `Luego de recibir tus datos, Punto Evento CR revisara la empresa...`
- `Creas servicios, subes fotos y envias a revision.`
- `Registro revisado por Punto Evento CR antes de activar el panel.`

Ubicacion:

- `app.js`

Problema:

Suena a nota de producto o proceso interno. Ademas, Product indico que la empresa no debe percibir revision manual del equipo.

Texto sugerido:

- `Un perfil pensado para generar confianza antes del contacto.`
- `Enviaremos acceso al panel para completar tu perfil.`
- `Creas servicios, subes fotos y los preparas para publicacion.`
- `Los servicios e imagenes se publicaran lo antes posible.`
- `Registro gratis con acceso al panel inicial.`

Version con tildes:

- `Un perfil pensado para generar confianza antes del contacto.`
- `Enviaremos acceso al panel para completar tu perfil.`
- `Creas servicios, subes fotos y los preparas para publicación.`
- `Los servicios e imágenes se publicarán lo antes posible.`
- `Registro gratis con acceso al panel inicial.`

Motivo:

Reduce friccion, oculta revision manual y mantiene una expectativa de publicacion pronta.

Prioridad: P2

Tipo de cambio: Solo copy.

### P2-03 - Panel empresa mezcla lenguaje tecnico e ingles

Pantalla/flujo: Login, activacion y servicios del panel empresa.

Texto actual:

- `Entra con el email y password activados para tu empresa.`
- `Define un password...`
- `Los passwords no coinciden.`
- `Ver publico`
- `Completar envio`
- `Aparecera cuando este publicado.`
- `Tu informacion ya fue recibida.`

Ubicacion:

- `panel.html`
- `panel.js`

Problema:

Mezcla ingles y espanol; baja claridad para empresas no tecnicas.

Texto sugerido:

- `Entrá con el correo y la contraseña activados para tu empresa.`
- `Definí una contraseña para entrar al panel ahora y volver después con tu correo.`
- `Las contraseñas no coinciden.`
- `Ver público`
- `Enviar servicio`
- `Aparecera cuando este disponible.`
- `Tu informacion fue recibida. Se publicara lo antes posible.`

Alternativa neutra:

- `Ingresa con el correo y la contraseña activados para tu empresa.`
- `Define una contraseña para entrar al panel ahora y volver después con tu correo.`
- `Enviar servicio`
- `Tu información fue recibida. Se publicará lo antes posible.`

Motivo:

Consistencia y confianza para empresas proveedoras. Evita presentar el flujo como revision manual.

Prioridad: P2

Tipo de cambio: Solo copy.

### P2-04 - Admin muestra terminos tecnicos innecesarios

Pantalla/flujo: Admin interno.

Texto actual:

- `Legacy`
- `Company -> Services`
- `uploads pendientes`
- `Cover`
- `Sin preview`
- `Preview no disponible`

Ubicacion:

- `admin.html`
- `admin.js`

Problema:

Aunque sea interno, el admin debe ser claro para operacion. Estos terminos mezclan ingles tecnico con accion operativa.

Texto sugerido:

- `Flujo anterior`
- `Empresas y servicios`
- `imagenes pendientes`
- `Portada`
- `Sin vista previa`
- `Vista previa no disponible`

Version con tildes:

- `imágenes pendientes`

Motivo:

Claridad para moderacion interna.

Prioridad: P2

Tipo de cambio: Solo copy.

### P2-05 - Emails necesitan tildes y tono mas pulido

Pantalla/flujo: Emails internos y emails a empresas.

Texto actual:

- `Nueva solicitud de cotizacion`
- `Una empresa envio sus datos...`
- `queda pendiente de revision interna`
- `Revisar la informacion...`
- `Desde el panel podras revisar...`
- `Tu empresa fue aprobada en Punto Evento CR`
- `vence automaticamente`

Ubicacion:

- `api/shared/email.js`

Problema:

Emails son comunicacion directa de marca. Deben sentirse cuidados y no demasiado internos. Para emails a empresas, Product indico que no debe aparecer aprobacion/revision manual.

Texto sugerido:

- `Nueva solicitud de cotización`
- Email interno de registro: `Nueva empresa registrada`
- Email interno de servicio: `Servicio enviado`
- Email empresa activacion subject: `Tu acceso a Punto Evento CR esta listo`
- Email empresa activacion titulo: `Tu acceso a Punto Evento CR esta listo`
- Email empresa activacion cuerpo: `Ya puedes activar tu acceso al panel.`
- `Desde el panel podrás ver tu perfil, cargar servicios y mantener tu información actualizada.`
- `Por seguridad, este enlace vence automáticamente.`

Alternativa neutra:

- Para correos internos, si se mantiene el lenguaje operativo de admin: `Gestionar la información desde el admin interno.`
- Para correos a empresa, no usar `aprobada`, `revisión`, `moderación` ni `pendiente`.

Motivo:

Mejora profesionalismo en comunicaciones transaccionales.

Prioridad: P2

Tipo de cambio: Solo copy/email template.

## Hallazgos P3

### P3-01 - Microcopy de ayuda del panel empresa

Texto actual:

- `Necesitas ayuda?`
- `Estamos aqui para ayudarte...`
- `Contactanos`

Ubicacion:

- `panel.html`

Texto sugerido:

- `¿Necesitás ayuda?`
- `Estamos aquí para ayudarte a destacar tu negocio.`
- `Contactanos`

Nota:

Si se prefiere trato neutro:

- `¿Necesitas ayuda?`
- `Contáctanos`

Prioridad: P3

### P3-02 - Estados con plurales tecnicos

Texto actual:

- `0 archivo(s)`
- `servicio(s)`
- `item(s)`
- `paquete(s)`

Ubicacion:

- `app.js`
- `panel.html`
- `panel.js`
- `admin.js`

Texto sugerido:

- `0 archivos`
- `1 servicio` / `2 servicios`
- `1 elemento` / `2 elementos`
- `1 paquete` / `2 paquetes`

Motivo:

Pulido de producto. Puede requerir helper de pluralizacion si se quiere perfecto.

Prioridad: P3

Tipo de cambio: Copy + pequeno ajuste JS si se implementa pluralizacion real.

### P3-03 - Boton cerrar del drawer usa `x`

Texto actual:

- `x`

Ubicacion:

- `index.html`

Texto sugerido:

- `×`

Motivo:

Pulido visual. El `aria-label` ya esta correcto.

Prioridad: P3

Tipo de cambio: Solo copy visual.

## Tareas sugeridas para Product / Architect / Release

### TASK sugerida A - Copy publico P1 pre-lanzamiento

Equipo sugerido: Web Dev

Alcance:

- Quitar `demo` / `Demo propuesta` de `index.html`.
- Cambiar `Cotizacion multiple`.
- Revisar/remover metricas no verificadas.
- Cambiar `Planes demo`.

Archivos probables:

- `index.html`
- `app.js`

Validacion:

- Cargar home publica.
- Navegar a `#empresas`.
- Abrir drawer de solicitud desde un servicio real.
- Confirmar que no aparece `demo` en superficies publicas normales.

### TASK sugerida B - Correccion transversal de tildes en copy visible

Equipo sugerido: Web Dev + Copy / Gramatica

Alcance:

- Corregir acentos y signos en HTML/JS/data visible.
- Mantener intactos nombres de variables, endpoints, ids, slugs y claves tecnicas.
- Definir antes si se usa voseo costarricense o trato neutro.

Archivos probables:

- `index.html`
- `app.js`
- `panel.html`
- `panel.js`
- `admin.html`
- `admin.js`
- `data/categories.json`
- `data/event-types.json`

Validacion:

- QA visual desktop/mobile publico.
- QA panel empresa basico.
- QA admin basico.

### TASK sugerida C - Pulido copy de emails

Equipo sugerido: Backend/API + Copy / Gramatica

Alcance:

- Corregir tildes en subjects y cuerpos HTML.
- Reemplazar frases internas cuando corresponda.
- En emails a empresas, quitar `aprobada`, `revision`, `moderacion` y cualquier copy que sugiera revision manual.
- En emails internos, Product / Architect / Release debe decidir si conserva lenguaje operativo de admin o lo suaviza a `gestionar`.
- Mantener links, variables y estructura de envio.

Archivo probable:

- `api/shared/email.js`

Validacion:

- Smoke local/estructural de templates.
- Smoke Azure/email si Product lo considera necesario antes de primeras empresas.

### TASK sugerida D - Limpieza de microcopy tecnico del admin

Equipo sugerido: Web Dev

Alcance:

- Reemplazar `Legacy`, `Company -> Services`, `uploads`, `Cover`, `preview`.
- Mantener admin funcional sin cambiar flujo.

Archivos probables:

- `admin.html`
- `admin.js`

Validacion:

- Login admin.
- Vista de expedientes.
- Estados vacios.
- Acciones aprobar/rechazar.

### TASK sugerida E - Microcopy panel empresa

Equipo sugerido: Web Dev

Alcance:

- Reemplazar `password` por `contraseña`.
- Corregir tildes y mensajes de sesion/activacion.
- Cambiar `Completar envio` por `Enviar servicio` o `Preparar para publicacion`.
- Cambiar estados/mensajes de servicio para que digan `se publicara lo antes posible`, no `revision`.
- Revisar ayuda lateral.

Archivos probables:

- `panel.html`
- `panel.js`

Validacion:

- Login recurrente.
- Activacion por invitacion.
- Crear/editar/enviar servicio.
- Logout.

## Decisiones pendientes

- Voz de marca:
  - Opcion A: voseo costarricense cercano: `Encontrá`, `Enviá`, `Revisá`.
  - Opcion B: trato neutro internacional: `Encuentra`, `Envía`, `Revisa`.

- Metricas publicas:
  - Confirmar si `13k+`, `15+ anos` y `50+ categorias` son reales y defendibles.
  - Si no, reemplazar por beneficios sin numeros.

- Planes/precios:
  - Confirmar si `CRC 29k` y `CRC 59k` deben mostrarse publicamente antes del lanzamiento o si deben quedar como `Próximamente` / `A definir`.

- Revision visible para empresas:
  - Decision recibida: no mostrar revision/moderacion/aprobacion manual en flujos de empresa.
  - Pendiente para Product / Architect / Release: decidir si el admin interno conserva palabras como `revision` y `aprobar` por claridad operativa o si tambien se suavizan.

## Riesgos si no se corrige

- La pagina puede percibirse como demo o prototipo.
- Usuarios y empresas pueden desconfiar por errores ortograficos visibles.
- Empresas pueden confundirse por palabras tecnicas o ingles innecesario.
- Empresas pueden percibir un proceso manual si se mantiene `revision`, `moderacion` o `aprobacion` en su flujo.
- Metricas no verificadas pueden generar expectativa incorrecta.
- Emails transaccionales pueden sentirse menos profesionales.

## Siguiente recomendado

Product / Architect / Release deberia crear un bloque pre-lanzamiento acotado con 3 a 5 tareas pequeñas:

1. Copy publico P1.
2. Tildes y consistencia transversal.
3. Emails.
4. Admin interno.
5. Panel empresa.

Copy / Gramatica puede revisar el diff antes de QA si se solicita.
