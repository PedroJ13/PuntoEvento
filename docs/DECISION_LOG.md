# Decision Log

## 2026-05-27: Reinicio controlado

Decision:

Reiniciar la forma de trabajo del proyecto con docs, AGENTS.md, backlog y tareas pequenas, sin borrar el codigo actual.

Motivo:

La pagina publica actual es una buena base. El cambio grande esta en admin, registro de empresas y modelo Empresa -> Servicios.

## 2026-05-27: Modelo Empresa -> Servicios

Decision:

Una empresa puede tener N servicios.

Ejemplo:

```text
Aurisbel -> Queques, Wedding Planner, Mesa dulce
```

Motivo:

Permite que una empresa aparezca por servicios especificos y que el perfil completo muestre todas sus opciones.

## 2026-05-27: Busqueda por servicio

Decision:

Los resultados de busqueda/listados deben mostrar servicios, con contexto de empresa.

Motivo:

Si el usuario busca "mesa dulce", el resultado debe coincidir con "mesa dulce", no mostrar solo una pagina generica de empresa.

## 2026-05-27: No DB server tradicional por ahora

Decision:

No usar DB server administrado por nosotros en MVP.

Motivo:

Azure serverless/managed reduce costo y complejidad.

Alternativas:

- Table Storage para MVP barato.
- Cosmos DB serverless si se necesita mas flexibilidad.
- Blob Storage para imagenes.

## 2026-05-27: Publicacion con revision manual en MVP

Decision:

El registro de empresas es gratis, pero empresas y servicios deben pasar por revision manual antes de aparecer publicamente.

Motivo:

Evita spam, contenido de baja calidad, imagenes no autorizadas y perfiles incompletos durante la etapa inicial del marketplace.

## 2026-05-27: Pagos fuera del MVP inicial

Decision:

El MVP no incluye pagos reales.

Motivo:

Primero se valida registro, contenido, busqueda por servicio y recepcion de leads. Los pagos entran despues como planes de posicionamiento destacado.

## 2026-05-27: Persistencia MVP en Azure Table Storage

Decision:

Mantener Azure Table Storage como persistencia MVP.

Motivo:

La infraestructura ya tiene Storage Account, tablas y Azure Functions funcionando. Table Storage cubre el MVP con menor costo y menor complejidad que Cosmos DB serverless.

Condicion futura:

Evaluar Cosmos DB serverless si la busqueda por categoria, provincia, plan, estado y servicios requiere consultas mas flexibles o ranking mas avanzado.

## 2026-05-27: Imagenes publicadas en container publico para MVP cerrado

Decision:

Para MVP cerrado, usar `uploads-pending` privado y permitir lectura publica solo para imagenes aprobadas en el container `public`.

Motivo:

Es la opcion mas simple y barata para que las imagenes aprobadas rendericen en la pagina publica sin proxy ni SAS por imagen.

Riesgo:

Debe mantenerse `uploads-pending` privado y solo publicar imagenes revisadas/aprobadas.

## 2026-05-27: Separar Admin interno y Panel empresa

Decision:

Separar conceptualmente el admin interno de Punto Evento del panel de empresa.

Definicion:

- Admin interno: revision, aprobacion, rechazo, moderacion y control de calidad.
- Panel empresa: gestion de perfil, servicios, fotos y planes.

Implementacion temporal:

La implementacion temporal en `admin.html` sirvio para validar el modelo visual, pero no debe seguir creciendo como flujo de empresa.

Arquitectura objetivo:

Usar rutas separadas:

- `/admin/*` para administradores internos.
- `/panel/*` para empresas proveedoras.

Actualizacion:

La opcion `Agregar servicio` pertenece al panel empresa, no al admin interno. El admin interno debe revisar/aprobar/rechazar datos enviados por empresas.

## 2026-05-27: Modo demo local para panel empresa

Decision:

Agregar un modo demo local para que Product/QA puedan revisar `Empresa demo` y `Servicios` sin depender de API Azure ni credenciales reales.

Condicion:

Este modo demo no debe desbloquear acciones de revision interna ni simular permisos productivos.

Motivo:

TASK-007 aprobo la demo de servicios con observaciones, pero QA no pudo completar login real en local porque el flujo actual depende de API/credenciales Azure.

## 2026-05-27: Categorias y tipos de evento como catalogos

Decision:

Categorias y tipos de evento deben ser listas controladas compartidas por pagina publica, panel empresa, API y QA.

Motivo:

Evita texto libre inconsistente y permite busqueda, filtros, validacion, ranking y planes destacados por categoria.

Implementacion MVP:

Usar JSON estatico versionado para catalogos al inicio. Evaluar tabla `Catalogs` en Azure cuando se necesite editar categorias desde un panel admin.

## 2026-05-27: Fotos pertenecen a empresa y servicio

Decision:

Habra fotos a nivel empresa y fotos a nivel servicio.

Definicion:

- Empresa: logo, portada general.
- Servicio: portada del servicio y galeria del servicio.

Motivo:

Un proveedor puede ofrecer servicios distintos que necesitan imagenes especificas. Ejemplo: queques, wedding planner y mesa dulce no deberian compartir necesariamente la misma galeria.

Actualizacion 2026-05-30:

En la moderacion interna, las imagenes de servicio no deben tratarse como una entidad visual separada del servicio. Deben verse dentro del expediente del servicio, con preview visible, y el admin debe aprobar empresa y servicios. Para servicios, aprobar el servicio incluye publicar las imagenes pendientes asociadas al servicio segun reglas de cover/galeria. Los uploads pueden seguir existiendo como entidad tecnica, pero no como flujo principal separado de aprobacion en UI.

Motivo:

El admin necesita revisar el servicio completo como lo vera el usuario publico: datos, cover y galeria juntos. Separar imagenes como otra cola crea doble trabajo y confunde el flujo de aprobacion.

## 2026-05-27: Catalogos JSON como fuente MVP inicial

Decision:

Usar `data/categories.json` y `data/event-types.json` como fuente versionada inicial de catalogos para la demo y el MVP temprano.

Motivo:

Son simples, baratos, faciles de revisar en Git y suficientes mientras las categorias no sean editables desde UI.

Condicion futura:

Mover a una tabla `Catalogs` cuando se requiera que administradores gestionen categorias/tipos de evento desde el panel.

## 2026-05-27: Registro nuevo crea solo Company

Decision:

El endpoint nuevo `POST /api/companies/register` crea solo una entidad `Company` en estado `pending` y plan `free`.

Motivo:

Separar registro de empresa de creacion de servicios mantiene el modelo claro y evita mezclar datos de empresa con ofertas especificas.

Pendiente:

Definir autenticacion de empresa para endpoints `companies/me` y CRUD de servicios.

## 2026-05-27: Registro de empresa verificado en Azure

Decision:

Marcar `POST /api/companies/register` como funcional en Azure.

Motivo:

QA confirmo que el endpoint responde `400` para validaciones y `201` para un registro valido. Infra confirmo que la tabla `Companies` fue creada y que la entidad QA quedo persistida sin secretos.

Notas:

- El `GET` a la misma ruta puede devolver `404` porque la Function esta configurada solo para `POST`.
- `AZURE_TABLE_COMPANIES=Companies` no es obligatorio porque el codigo tiene default, pero conviene configurarlo para claridad operativa.
- Queda pendiente decidir autenticacion de empresa antes de exponer endpoints privados como `/api/companies/me`.

## 2026-05-27: Autenticacion MVP de empresas por invitacion

Decision:

Para el MVP cerrado, usar invitacion/token con sesion propia server-side para empresas.

Flujo:

1. Empresa se registra con `POST /api/companies/register`.
2. Empresa queda `pending`.
3. Punto Evento revisa o decide invitar.
4. Backend genera una invitacion asociada a `companyId`.
5. Empresa abre el link de invitacion.
6. Backend valida token hasheado y crea sesion.
7. Endpoints privados derivan `companyId` desde cookie de sesion, no desde el cliente.

Motivo:

Desbloquea rapido el panel empresa sin implementar passwords ni obligar a proveedores a usar una cuenta externa. Es adecuado para primeras empresas controladas.

Alternativa futura:

Azure Static Web Apps Auth, usando `x-ms-client-principal` y tabla `Users` para mapear identidad externa a `companyId`.

Regla de seguridad:

El frontend nunca decide `companyId` para operaciones privadas. El backend siempre lo obtiene desde la sesion.

## 2026-05-27: Evitar prefijo admin en Azure Functions

Decision:

No usar `admin` como primer segmento en nombres de carpetas Function ni rutas HTTP de Azure Functions.

Motivo:

Infra confirmo que Azure despliega y lista las Functions con prefijo `admin`, pero las invocaciones HTTP devuelven `404`. La causa probable es conflicto con rutas administrativas reservadas del runtime de Azure Functions.

Regla:

Usar prefijos internos alternativos para endpoints operativos:

```text
/api/internal/...
/api/backoffice/...
/api/ops/...
```

Para MVP se usara:

```text
/api/internal/company-invites
```

Pendiente:

Renombrar gradualmente endpoints admin legacy que hoy tambien devuelven `404` en Azure.

## 2026-05-30: Paso a pre-lanzamiento controlado

Decision:

La prueba Product Owner fue positiva y sin issues. Punto Evento pasa a pre-lanzamiento controlado antes de invitar primeras empresas reales.

Prioridades:

1. P1: Login empresa con email/password. La invitacion queda como activacion inicial, pero la empresa necesita acceso recurrente al panel.
2. P1: Email de cotizacion a empresa.
3. P1/P2: Email interno cuando una empresa se registra o envia servicios a revision.
4. P2: Mejora UX/diseno enfocada, sin redisenio completo.

Motivo:

El MVP base ya fue validado, pero el uso real por primeras empresas necesita acceso recurrente, entrega operativa de leads y notificaciones internas minimas.

Regla:

No abrir redisenio completo ni features post-MVP hasta cerrar o aceptar explicitamente los P1 de pre-lanzamiento.

## 2026-05-31: Proveedor email MVP en Azure Communication Services

Decision:

Usar Azure Communication Services Email como proveedor principal de email para el MVP/pre-lanzamiento.

Mantener SendGrid como alternativa futura, no como proveedor MVP.

Motivo:

Punto Evento ya esta sobre Azure Static Web Apps, Azure Functions, Blob Storage y Table Storage. ACS Email reduce proveedores externos y permite un modelo de costo por uso para bajo volumen inicial.

Alcance:

- Email de cotizacion a empresa.
- Email interno por registro de empresa.
- Email interno por servicio enviado a revision.

Reglas:

- La capa backend de email debe quedar configurable, sin acoplar el dominio del producto a un proveedor especifico.
- No se deben commitear secretos ni connection strings.
- Si el envio interno falla, no debe romper registro ni envio a revision.
- La cotizacion publica debe responder con error claro si no logra enviar el email a la empresa.

## 2026-06-01: Invitacion automatica al aprobar empresa

Decision:

Para pre-lanzamiento controlado, cuando Admin aprueba una empresa, el sistema debe generar una invitacion y enviar un email de activacion a la empresa.

Motivo:

El registro por si solo no debe entregar acceso antes de revision manual, pero despues de aprobar la empresa no conviene depender de copiar/pegar manualmente el invite.

Flujo:

```text
Empresa se registra
-> queda pending
-> Admin aprueba empresa
-> sistema genera invite
-> sistema envia email de activacion
-> empresa define password
-> empresa entra al panel con email/password
```

Reglas:

- No duplicar invites activos recientes si Admin reintenta.
- No exponer token completo ni hashes en logs/responses.
- Si falla el email, la empresa puede quedar aprobada, pero Admin debe ver advertencia para reintento/manual.
- El endpoint manual de invitaciones se mantiene como soporte interno.

## 2026-06-03: Contacto/cotizacion MVP por WhatsApp y email

Decision:

Para pre-lanzamiento controlado, Punto Evento usara ambos canales en el flujo publico de contacto:

- WhatsApp como contacto primario cuando la empresa tenga WhatsApp configurado.
- Email/cotizacion como respaldo operativo y trazabilidad del lead.

Motivo:

La prueba con cliente del 2026-06-03 confirmo que el flujo base funciona, pero detecto ambiguedad en `Pedir presupuesto`: no quedaba claro si el contacto llegaba por email, a la empresa, a Punto Evento o a ambos. WhatsApp reduce friccion para primeras empresas reales y email mantiene trazabilidad.

Reglas:

- El CTA publico principal debe ser `Contactar`.
- Si hay WhatsApp publico disponible, el CTA debe abrir WhatsApp con mensaje prellenado.
- El flujo de email no se elimina; se mantiene como respaldo o solicitud registrable.
- No prometer cotizacion si la accion visible no explica quien recibe el contacto.
- No exponer datos privados de empresa; solo usar campos de contacto definidos como publicos.

## 2026-06-03: Go para pre-lanzamiento controlado con P2/P3 aceptados

Decision:

Aceptar los riesgos P2/P3 observados en `TASK-202` y avanzar con pre-lanzamiento controlado para primeras empresas reales.

Motivo:

QA revalido en Azure el bloque de ajustes cliente 2026-06-03 despues del deploy `main/f3b8951` y no encontro bloqueantes P0/P1. Los flujos principales de pagina publica, contacto/WhatsApp, fallback email, panel empresa, admin interno y envio de lead quedaron funcionales.

Riesgos aceptados:

- Validacion visual puntual de `Portada` con upload real queda como observacion P2.
- `Recibido` se acepta como confirmacion suficiente aunque no se capturo el copy exacto `Tu informacion fue recibida.` como texto persistente.
- `404` no bloqueante en consola admin queda como limpieza futura.
- Emails reportan `email_sent`/`emailStatus=sent`, pero QA no valido render final en mailbox.

Condicion:

El pre-lanzamiento debe seguir siendo controlado, con primeras empresas monitoreadas y sin abrir pagos, ranking avanzado ni redisenio completo.

## 2026-06-04: Refresh visual empieza por guia Diseno/UX

Decision:

El refresh visual de marca/panel empresa no se envia directo a Web Dev. Primero Diseno/UX debe producir una guia minima implementable y luego Product / Architect / Release debe aprobar el alcance.

Motivo:

La marca afecta globalmente, pero la implementacion de pantalla por ahora debe limitarse al panel privado de empresas. Sin guia previa, existe riesgo de una implementacion visual inconsistente o de abrir un rediseño profundo de pagina publica, admin y perfil publico antes de tiempo.

Alcance:

- Definir logo, paleta, tagline, componentes base y layout del panel empresa.
- Implementacion futura limitada a branding base aprobado y panel privado de empresas.
- Pagina publica, admin interno y perfil publico quedan fuera de rediseño profundo por ahora.

Regla:

No crear tareas Web Dev de implementacion hasta procesar `TASK-203-HANDOFF.md` y aprobar alcance en `TASK-204`.

## 2026-06-04: Alcance aprobado refresh visual panel empresa

Decision:

Aprobar implementacion acotada del refresh visual premium en el panel privado de empresas.

Alcance aprobado:

- Branding base dentro del panel empresa con paleta negro/dorado/fondo claro calido.
- Tagline `Catalogo digital de proveedores para eventos`.
- Sidebar desktop con `Mi empresa` y `Mis servicios` como vistas MVP.
- Items futuros visibles deshabilitados con `Proximamente`.
- Bloque visual de ayuda/contacto sin modulo nuevo.
- Adaptacion visual de login/activacion si comparte superficie de panel.

Excluido:

- No crear vista nueva `Inicio`.
- No rediseñar pagina publica, admin interno ni perfil publico.
- No crear mensajes, metricas, planes, reportes, pagos ni dashboard.
- No cambiar API/backend/modelos.

Motivo:

Elevar confianza comercial para primeras empresas reales sin abrir un rediseño profundo ni comprometer el go tecnico del MVP.

## 2026-06-04: Marca visible Punto Evento CR

Decision:

Cambiar la marca visible de `Punto Evento` a `Punto Evento CR`.

Motivo:

`CR` especifica Costa Rica y ayuda a diferenciar la marca despues de encontrar paginas similares con nombres cercanos a `Punto Evento`.

Alcance:

- UI publica.
- Panel empresa.
- Admin interno.
- Metadata visible/accesible.
- Emails y copy transaccional.

Reglas:

- No cambiar rutas, slugs, dominios, nombres de tablas, nombres de funciones ni contratos API solo por este renombre.
- No editar el logo raster de referencia si requiere trabajo grafico; documentarlo como pendiente de asset final.
- Mantener este cambio como naming/branding, sin rediseño adicional.

## 2026-06-04: Nuevo logo Punto Evento CR para panel empresa

Decision:

Usar el nuevo logo entregado en `Reference Images/Logo.jpeg` como referencia de marca para reemplazar el logo anterior del panel empresa.

Motivo:

El nuevo logo ya incorpora `Punto Evento CR`, alinea el renombre de marca y evita mantener arte visible con `Punto Evento` sin `CR`.

Condicion:

Como el archivo es `.jpeg`, puede contener un patron de transparencia falso dentro de la imagen. Antes de desplegarlo, se debe preparar o aplicar un tratamiento para que el fondo se integre con el panel y no se vea como imagen montada.

Alcance:

- Panel empresa primero.
- No rediseñar pagina publica/admin.
- No cambiar backend/API.

## 2026-06-04: Paleta global Punto Evento CR solo colores

Decision:

Extender la paleta visual aprobada en el panel empresa al resto de superficies MVP, pero solo como ajuste de colores.

Motivo:

El panel empresa ya tiene una direccion visual mas premium y coherente con `Punto Evento CR`. Aplicar la misma paleta a pagina publica, admin y emails ayuda a que el producto se perciba mas consistente antes de primeras empresas reales, sin abrir un redisenio profundo.

Alcance:

- Pagina publica: botones, links, acentos, bordes, fondos suaves y estados.
- Admin interno: botones, estados, encabezados, alertas, bordes y fondos, manteniendo lectura operativa.
- Emails: colores HTML minimos y marca visible cuando aplique.

Excluido:

- No cambiar layout.
- No cambiar navegacion.
- No cambiar componentes o flujos.
- No redisenar pagina publica, admin ni perfil publico.
- No cambiar backend/API salvo templates de email si corresponde.

Regla:

Primero Diseno/UX define guia minima implementable. Luego Web Dev y Backend/API pueden trabajar en paralelo por superficie. QA valida local/estructural antes de deploy y vuelve a validar en Azure.

## 2026-06-04: Refresh visual publico alineado al panel empresa

Decision:

Aplicar un refresh visual acotado a la pagina publica y a la ficha publica de empresa/proveedor para acercarlas al estilo premium del panel empresa.

Motivo:

La paleta global ya unifico colores, pero la revision visual de usuarios muestra que la pagina publica y la ficha publica necesitan mayor coherencia de marca: logo, tipografia, hero/imagen principal y tratamiento visual de cards/CTAs.

Alcance:

- Pagina publica principal.
- Continuacion/secciones de pagina publica.
- Ficha publica de empresa/proveedor hacia clientes.
- Uso del mismo logo aprobado para el panel empresa: `assets/images/logo-punto-evento-cr-panel.png`.
- Tipografia/headings alineados al panel empresa.
- Tratamiento visual de hero, cards, galeria, datos clave y CTAs.

Excluido:

- No cambiar el cintillo/menu superior como funcionalidad.
- No cambiar busqueda, contacto, WhatsApp, cotizacion ni registro.
- No cambiar admin interno.
- No cambiar panel empresa.
- No cambiar backend/API ni modelo de datos.

Regla:

Diseno/UX debe definir la guia implementable primero. Web Dev implementa solo despues de esa guia. QA valida local y Azure antes de cerrar.

## 2026-06-05: Navegacion publica simplificada y error admin controlado

Decision:

Simplificar la navegacion visible publica removiendo opciones no deseadas por Product en esta etapa, especialmente `Servicios` y `Proveedor`, sin eliminar rutas internas necesarias. Ademas, el login admin debe mostrar errores de credenciales dentro de la UI y no disparar prompts nativos del navegador.

Motivo:

La revision visual detecto que la pagina publica todavia tiene opciones de navegacion que distraen del flujo principal y que el error de credenciales admin genera una experiencia poco controlada y confusa.

Alcance:

- Ajustes visuales de pagina publica/ficha publica.
- Navegacion visible publica.
- Manejo de credenciales invalidas en admin.

Excluido:

- No cambiar permisos reales.
- No rotar secretos.
- No eliminar rutas funcionales.
- No cambiar panel empresa.
- No cambiar backend/API salvo respuestas de autenticacion interna necesarias para evitar `WWW-Authenticate`.

## 2026-06-06: Reglas pre-lanzamiento para copy, leads y datos demo

Decision:

Antes del siguiente test/pre-lote real, Punto Evento CR debe eliminar lenguaje visible de demo/prototipo y alinear los CTAs al alcance real del MVP.

Reglas:

- Todo lead real del MVP debe estar asociado a `companyId + serviceId`.
- No se implementa ni se promete `Cotizacion multiple` hasta que exista flujo multi-proveedor real.
- Los CTAs publicos sin servicio seleccionado deben llevar a resultados/listado o pedir elegir un servicio publicado primero.
- En productivo, la pagina publica no debe caer a datos demo si falla la API; debe mostrar estado controlado de error/vacio.
- El admin productivo no debe mostrar superficies normales de `Legacy`, `Demo` o controles demo/local.
- Hacia empresas, el copy no debe comunicar revision, moderacion o aprobacion manual; debe usar lenguaje de acceso listo, preparacion para publicacion y publicacion pronta.
- La voz visible queda en trato neutro por ahora para evitar mezcla de voseo/tuteo.

Motivo:

Las revisiones QA Flujo, QA Visual y Copy/Gramatica del 2026-06-06 confirman que el MVP funciona, pero hay fricciones de confianza y claridad antes de exponerlo a empresas reales: promesas de demo/multicotizacion, datos demo como fallback, admin con superficies legacy y copy tecnico o demasiado interno.

Alcance:

- Copy publico P1.
- CTAs publicos.
- Fallback publico ante falla API.
- Admin productivo.
- Emails transaccionales.
- Panel empresa.
- Ajustes mobile acotados.

Excluido:

- No abrir cotizacion multiple real.
- No redisenar profundo pagina publica, admin o panel.
- No cambiar backend/API salvo templates de email.
- No cambiar modelo de datos.

## 2026-06-08: Ajustes UX de flujos web sin cambio de API

Decision:

Procesar la revision UX de flujos web del 2026-06-08 como un bloque acotado de presentacion, copy, jerarquia visual y microinteracciones.

Motivo:

La revision confirma que los flujos base estan bien definidos y alineados al modelo `Empresa -> Servicios`. Los riesgos detectados son de claridad: contacto/cotizacion, servicio vs empresa, registro/activacion, estados visibles, admin y catalogo vacio.

Alcance:

- Aclarar WhatsApp vs formulario/email en contacto y cotizacion.
- Reforzar jerarquia service-first en resultados y ficha publica.
- Mejorar confirmacion post-registro de empresa.
- Usar labels de estado entendibles para empresas sin renombrar estados internos.
- Agregar resumen de pendientes en admin usando datos existentes si es posible.
- Pulir catalogo vacio con CTA controlado hacia empresas.

Excluido:

- No cambiar contratos API.
- No cambiar modelo de datos.
- No implementar tenants separados, multirol avanzado ni selector de empresa.
- No implementar cotizacion multiple.
- No abrir redisenio profundo.

Regla:

Si Web Dev descubre que el resumen admin no puede calcularse con datos ya disponibles, debe documentarlo y Product / Architect / Release abrira una tarea Backend/API separada. No mezclar backend en el bloque visual.

## 2026-06-09: Dominio propio bloquea registro hasta actualizar origins

Decision:

No invitar primera empresa real desde el dominio propio hasta que Infra Azure ajuste la configuracion de origen permitido para `puntoeventocr.com` y `www.puntoeventocr.com`.

Motivo:

La pagina publica y la API publica de lectura responden `200` en el dominio nuevo, pero `POST /api/companies/register` con payload valido y `Origin` del dominio propio responde `403`. El mismo payload responde `201` desde el hostname anterior de Azure Static Web Apps. Esto indica una brecha de configuracion (`ALLOWED_ORIGINS` / `APP_PUBLIC_URL`) y no un cambio de producto ni un bug visual del formulario.

Alcance:

- Infra Azure ajusta app settings de origen/base URL.
- QA revalida registro desde apex y `www`.
- Product / Architect / Release mantiene `NO-GO` temporal para primera empresa real hasta cerrar la revalidacion.

Excluido:

- No cambiar codigo por defecto.
- No abrir redisenio ni cambios funcionales.
- No borrar datos reales; solo limpiar datos QA creados durante la prueba.

Actualizacion:

`TASK-279` corrigio la configuracion y `TASK-280` aprobo registro desde apex y `www`. Product / Architect / Release levanta el NO-GO tecnico y deja estado `GO condicionado`: antes de aprobar una empresa real, Product/QA/Admin debe limpiar o rechazar las dos empresas QA de `TASK-280` y confirmar que el enlace de activacion generado por admin usa `https://puntoeventocr.com`.

## 2026-06-22: Password-flows de empresa como ampliacion MVP segura

Decision:

Implementar password-flows de empresa para Punto Evento CR como ampliacion acotada del MVP, reutilizando la arquitectura actual de Azure Functions, Azure Table Storage, ACS Email, `Users`, `CompanySessions`, hash `scrypt` y cookies server-side.

Alcance aprobado:

- Ver/ocultar password en login, activacion, cambio de password y reset.
- Cambio autenticado de password desde panel empresa.
- Recuperar/resetear password por correo.
- Accion admin para enviar reset de acceso sin mostrar token ni link completo.
- Pantalla publica segura de reset por token.

Reglas:

- El frontend nunca es autoridad de `companyId`, `userId` ni `email` para cambiar o resetear password.
- No imprimir passwords, tokens raw, hashes, cookies ni links completos en logs, consola, UI admin, Markdown ni handoffs.
- Guardar tokens de reset solo como hash en Table Storage.
- La respuesta publica de solicitud de reset no debe revelar si el correo existe.
- Mantener la sesion actual al cambiar password y revocar otras sesiones activas si es viable.
- Al completar reset, revocar sesiones activas del usuario/empresa.
- Publicar backend/API antes de web para evitar UI apuntando a endpoints inexistentes.

Motivo:

El login recurrente ya existe, pero las primeras empresas necesitan recuperar acceso y cambiar su password sin depender de soporte manual ni exponer secretos. La guia reusable de Punto Club aplica conceptualmente, pero se adapta a Table Storage en vez de SQL.
