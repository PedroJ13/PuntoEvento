# Backlog Punto Evento

## Pre-lanzamiento: dominio propio

- [x] TASK-279 Infra Azure: permitir registro de empresa desde `puntoeventocr.com` y `www`, ajustando `ALLOWED_ORIGINS` / `APP_PUBLIC_URL` y limpiando el dato QA de comparacion.
- [x] TASK-280 QA Azure: revalidar registro publico desde dominio propio y confirmar que no aparece `REGISTRO NO ENVIADO`.
- [x] TASK-281 QA Azure: revalidar panel empresa completo desde dominio propio y capturar status HTTP del fallo al guardar/enviar servicio.
- [x] TASK-282 QA/Product: cancelada/reemplazada por `TASK-283` porque la evidencia nueva acoto el incidente a envio directo con portada.
- [x] TASK-283 QA Azure: no aprobada/bloqueada por falta de empresa QA autenticable; no se pudo reproducir el envio directo.
- [x] TASK-284 Infra Azure/Product: precondicion satisfecha con empresa existente `Aurisbel Pasteleria`; credencial no documentada en repo.
- [x] TASK-285 QA Azure: no aprobada; evidencia P1 capturada. Upload de portada falla por CORS/preflight en Azure Blob Storage; sin imagen el envio directo funciona.
- [x] TASK-286 QA Azure: cancelada/reemplazada por fix Infra porque `TASK-285` ya clasifico la causa.
- [x] TASK-287 Infra Azure: corregir CORS de Azure Blob Storage para permitir `PUT` de uploads firmados desde dominio propio.
- [x] TASK-288 QA Azure: aprobada con pendiente P2; upload de portada, confirmacion y envio directo a revision funcionan post-CORS.
- [x] TASK-289 QA Azure: aprobada; portada publica visible despues de aprobacion admin, sin placeholder.
- [ ] TASK-290 Infra Azure: cleanup no destructivo de servicios QA de Aurisbel creados en `TASK-285`/`TASK-288`.

## P2 post-P1: panel empresa - listado y carga de servicios

Bloque visual activado despues de cerrar el P1 de upload y validar portada publica.

- [ ] TASK-291 Diseno/UX: definir especificacion implementable del nuevo listado de servicios tipo card horizontal y drawer lateral para crear/editar servicios.
- [ ] PLAN-TASK-292 Web Dev: implementar listado de servicios con portada, estado, metadata resumida, acciones con iconos y drawer lateral reutilizable para `Cargar servicio` / `Editar`.
- [ ] PLAN-TASK-293 QA local/estructural: validar listado, drawer, crear/editar, responsive desktop/mobile y regresion del flujo `Enviar servicio`.
- [ ] PLAN-TASK-294 Infra Azure: desplegar el ajuste visual del panel empresa cuando QA local apruebe.
- [ ] PLAN-TASK-295 QA Azure: validar listado/drawer en dominio propio y confirmar que no se reabre el P1 del envio directo.

## Sprint 0: Reinicio y baseline

Objetivo: congelar lo que ya funciona y dejar reglas claras antes de seguir construyendo.

- [x] Revisar cambios sin commit.
- [x] Decidir que entra en el commit baseline.
- [x] Crear commit baseline antes de cambios grandes.
- [x] Confirmar que todos los chats/equipos usaran `AGENTS.md`, `docs/` y `chat-start/`.
- [x] Inventariar infraestructura Azure actual.
- [x] Inventariar API actual y compararla contra `Company -> Services`.
- [x] Crear matriz QA MVP.
- [x] Confirmar que la pagina publica actual funciona en Azure despues del ultimo deploy.
- [x] Documentar rutas actuales de pagina publica, admin y API en un solo mapa.

Entregable:

- Baseline confiable.
- Repositorio listo para tareas pequenas por equipo.

## Sprint 1: Modelo Empresa -> Servicios en demo

Objetivo: adaptar el concepto del producto al nuevo modelo sin tocar backend real todavia.

- [x] Revisar admin actual y proponer UI para multiples servicios por empresa.
- [x] Definir que Admin interno y Panel empresa son responsabilidades separadas.
- [ ] Crear `data/companies.json` demo.
- [ ] Crear `data/services.json` demo.
- [ ] Mantener `data/providers.json` temporalmente para compatibilidad.
- [ ] Crear empresa demo con varios servicios:
  - Queques.
  - Wedding Planner.
  - Mesa dulce.
- [x] Ajustar admin demo para listar varios servicios por empresa.
- [x] Agregar formulario demo para crear/editar servicio.
- [x] Agregar estado visual: draft, pending, published, rejected.
- [x] Crear checklist QA para multiples servicios.
- [x] QA valido demo de servicios en admin con observaciones.
- [x] Agregar modo demo local para ver panel empresa/servicios sin depender de API Azure.
- [x] QA valido modo demo local en admin.
- [ ] Agregar control para restaurar datos demo de servicios.
- [ ] Convertir categoria y tipos de evento del formulario de servicio demo a listas controladas.
- [ ] Agregar carga/preview de fotos en formulario de servicio demo.
- [x] Separar creacion/edicion de servicios hacia panel empresa demo fuera de `admin.html`.
- [x] Ajustar `admin.html` para enfocarse en revision/aprobacion de datos creados por empresas.
- [x] Crear `panel.html`, `panel.js`, `panel.css` para panel empresa demo.
- [x] Crear catalogo `data/event-types.json`.
- [x] QA manual del panel empresa demo.
- [x] Agregar boton visible para restaurar datos demo en `panel.html`.
- [x] QA del boton `Restaurar demo`.

Entregable:

- Admin demo capaz de representar una empresa con N servicios.

## Sprint 2: Busqueda publica por servicio

Objetivo: que la pagina publica busque y muestre servicios especificos, sin perder el perfil completo de empresa.

- [x] Cambiar resultados demo/API para renderizar servicios.
- [x] Mostrar empresa asociada dentro del card de servicio.
- [x] Agregar link para ver perfil de empresa desde un servicio.
- [x] Crear perfil empresa con servicio seleccionado destacado.
- [x] Mantener home actual sin reescritura.
- [x] Validar mobile y desktop.
- [x] QA local de pagina publica conectada a servicios publicados.
- [x] Deploy y QA Azure de pagina publica conectada a servicios publicados.
- [x] Ajustar estado vacio cuando filtros de servicios no tienen resultados.
- [x] QA local de estado vacio en filtros de servicios.
- [x] Deploy y QA Azure de estado vacio en filtros de servicios.
- [x] Publicar imagen real de cover para servicio QA principal.
- [x] Ajustar carrusel de perfil para priorizar cover real antes de galeria.
- [x] QA local de carrusel de perfil con cover priorizado.
- [x] Deploy y QA Azure de carrusel de perfil con cover priorizado.

Entregable:

- Si el usuario busca "mesa dulce", ve "Mesa dulce por Aurisbel", no solo "Aurisbel".

## Sprint 3: API y persistencia MVP

Objetivo: convertir demo admin en flujo funcional con Azure serverless/managed.

- [x] Definir contrato API en `docs/API_CONTRACTS_MVP.md`.
- [x] Elegir persistencia MVP: Table Storage.
- [x] Endpoint registro empresa.
- [x] QA local/estructural de `POST /api/companies/register`.
- [x] QA post-deploy de `POST /api/companies/register` contra Azure.
- [x] Resolver verificacion Azure de `/api/companies/register`, porque `GET` smoke devolvio `404`.
- [x] Confirmar entidad QA creada en tabla `Companies`.
- [x] Definir estrategia de autenticacion de empresa.
- [x] Implementar endpoint aceptar invitacion de empresa.
- [x] Implementar endpoint logout empresa.
- [x] QA local/estructural de auth por invitacion.
- [x] Infra deploy/settings Azure de auth por invitacion.
- [x] Implementar mecanismo admin para generar invitaciones controladas.
- [x] QA local/estructural de mecanismo admin para invitaciones.
- [x] Identificar causa probable de deploy 404 en endpoints `admin`.
- [x] Renombrar endpoint admin de invitaciones para evitar prefijo reservado `admin`.
- [x] QA local/estructural de endpoint interno de invitaciones.
- [x] Infra deploy/smoke de mecanismo admin para invitaciones.
- [x] Provisionar ejecucion segura de QA Azure con credenciales admin.
- [x] Corregir/rotar credenciales admin para endpoint interno de invitaciones.
- [x] QA Azure de auth por invitacion con token real controlado.
- [x] Remover endpoint temporal `internal/auth-diagnostics`.
- [x] QA Azure confirmo remocion de `internal/auth-diagnostics`.
- [x] Rotar `ADMIN_PASSWORD` despues de prueba controlada.
- [x] QA post-rotacion de credenciales admin internas.
- [x] Implementar endpoint obtener empresa propia.
- [x] QA local/estructural de `GET /api/companies/me`.
- [x] Deploy y QA Azure de `GET /api/companies/me`.
- [x] Implementar endpoint listar servicios propios `GET /api/companies/me/services`.
- [x] QA local/estructural de `GET /api/companies/me/services`.
- [x] Deploy y QA Azure de `GET /api/companies/me/services` con sesion real.
- [x] Endpoint crear servicios propios `POST /api/companies/me/services`.
- [x] QA local/estructural de `POST /api/companies/me/services`.
- [x] Deploy y QA Azure de `POST /api/companies/me/services` con sesion real.
- [x] Endpoint actualizar servicios propios `PATCH /api/companies/me/services/{id}`.
- [x] QA local/estructural de `PATCH /api/companies/me/services/{id}`.
- [x] Deploy y QA Azure de `PATCH /api/companies/me/services/{id}` con sesion real.
- [x] Endpoint eliminar/desactivar servicios propios.
- [x] QA local/estructural de `DELETE /api/companies/me/services/{id}`.
- [x] Deploy y QA Azure de `DELETE /api/companies/me/services/{id}` con sesion real.
- [x] Endpoint upload firmado para imagenes.
- [x] QA local/estructural de `POST /api/uploads/sign`.
- [x] Deploy y QA Azure de `POST /api/uploads/sign` con sesion real.
- [x] Endpoint registro/confirmacion de upload completado.
- [x] QA local/estructural de `POST /api/uploads/confirm`.
- [x] Deploy y QA Azure de `POST /api/uploads/confirm` con sesion real y blob real.
- [x] Endpoint aprobar/rechazar empresa, servicio e imagenes pendientes.
- [x] QA local/estructural de aprobacion/rechazo interno.
- [x] Deploy y QA Azure de aprobacion/rechazo interno.
- [x] Resolver acceso publico a imagenes publicadas en Blob Storage.
- [x] QA Azure HTTP de imagen publica por `publicBlobUrl`.
- [ ] QA visual complementaria de imagen publica en navegador normal.
- [x] Endpoint publico listar servicios publicados `GET /api/public/services`.
- [x] Endpoint publico perfil empresa `GET /api/public/companies/{slug}`.
- [x] QA local/estructural de endpoints publicos por servicio.
- [x] Deploy y QA Azure de endpoints publicos por servicio.
- [x] Limpiar o reemplazar imagen vieja `1 x 1` de galeria QA antes de demo externa.
- [x] Ejecutar matriz MVP enfocada contra Azure y clasificar flujo UI vs API.
- [x] Alinear CTAs y navegacion de pagina principal con flujo nuevo Company -> Panel -> Admin.
- [x] Conectar registro publico `#empresas` al modelo nuevo `Company`.
- [x] Ajustar confirmacion y error local del registro publico `#empresas`.
- [x] Reintento QA local de registro publico `#empresas` conectado a `companies/register`.
- [x] Deploy y QA Azure de registro publico `#empresas` conectado a `companies/register`.
- [x] Validacion manual en navegador normal del submit visible de `#empresas`.
- [x] Conectar `panel.html` a auth/API real de empresa.
- [x] QA local de `panel.html` conectado a auth/API real de empresa.
- [x] Deploy y QA Azure de `panel.html` conectado a auth/API real de empresa.
- [x] Crear endpoints internos de listado para moderacion nueva:
  - `GET /api/internal/companies/pending`.
  - `GET /api/internal/services/pending`.
  - `GET /api/internal/uploads/pending`.
- [x] QA local/estructural de endpoints internos de listado para moderacion nueva.
- [x] Deploy y QA Azure de endpoints internos de listado para moderacion nueva.
- [x] Corregir metodo no permitido en listados internos de moderacion para que Azure devuelva `405` en vez de `404`.
- [x] Definir si MVP necesita endpoint explicito para enviar servicio a revision.
- [x] Implementar endpoint explicito para enviar servicio a revision.
- [x] QA local/estructural de `POST /api/companies/me/services/{serviceId}/submit-review`.
- [x] Deploy y QA Azure de `POST /api/companies/me/services/{serviceId}/submit-review`.
- [x] Ajustar panel empresa para usar `Enviar a revision` explicito.
- [x] Deploy y QA Azure de panel empresa con `Enviar a revision`.
- [x] Conectar UI admin para moderar Companies, Services y Uploads del modelo nuevo.
- [x] QA local de UI admin conectada a Companies, Services y Uploads del modelo nuevo.
- [x] Deploy y QA Azure de UI admin conectada a Companies, Services y Uploads del modelo nuevo.
- [x] Corregir/rotar credencial admin usada por QA Azure para `admin.html`.
- [x] Alinear `admin.js` para enviar credencial admin con `X-Punto-Admin-Credential` en Azure.
- [x] Remover render de SAS `sig=` en imagenes legacy de `admin.html`.
- [x] Reintentar QA Azure de UI admin conectada a Companies, Services y Uploads del modelo nuevo sin `sig=` en DOM.
- [ ] Notificacion por email al registrarse o pasar a revision.

Entregable:

- API base para registro, admin y revision.

## Sprint 4: QA, seguridad y publicacion controlada

Objetivo: validar que el flujo puede usarse por empresas reales.

- [x] Matriz de pruebas registro.
- [x] Matriz de pruebas login.
- [x] Matriz de pruebas admin servicios.
- [x] Matriz de pruebas upload fotos.
- [x] Regresion pagina publica documentada.
- [x] Pruebas de permisos Empresa A vs Empresa B documentadas.
- [x] Pruebas responsive documentadas.
- [x] Checklist de release documentado.
- [ ] Ejecutar matriz QA contra ambiente Azure.
- [x] Crear guion de prueba para Product Owner del flujo completo MVP.
- [x] Ejecutar prueba Product Owner controlada y documentar findings.
- [x] Rotar `ADMIN_PASSWORD` expuesto durante prueba Product Owner.
- [x] Triar hallazgos Product Owner y cerrar decisiones P1 de producto/datos.
- [x] Ajustar registro publico despues de exito: limpiar/ocultar formulario y prevenir doble submit.
- [x] QA Azure de registro publico despues de exito y prevencion de doble submit.
- [x] Definir campos de contacto/sociales de empresa y separar publicos vs internos.
- [x] Cerrar taxonomia MVP: `Categoria` como servicio y `Tipos de evento` como ocasiones.
- [x] Ajustar formulario de servicio: quitar estado editable, quitar cantidad manual de fotos y resolver `Como se revisa`.
- [x] Implementar alcance de imagenes por servicio: cover + galeria.
- [x] Disenar moderacion admin por expediente de empresa.
- [x] Definir reglas de cascada para aprobar/rechazar empresa, servicios e imagenes.
- [x] Definir estrategia de datos QA antes de demo owner.
- [x] Crear guion demo owner limpio con empresa demo dedicada.
- [x] Limpieza controlada de datos QA Azure.
- [x] Inventariar datos QA Azure y proponer soft cleanup.
- [x] Ejecutar soft cleanup de datos QA Azure si Product/Release lo aprueba.
- [x] Verificacion pre-demo owner con limitacion aceptada.
- [x] Triar hallazgos Product Owner Round 2 por superficie.
- [x] Pagina publica Round 2: busqueda por empresa y limpieza de filtros.
- [x] Panel empresa Round 2: hasta 10 imagenes por servicio y cover.
- [x] Admin Round 2: moderacion por expediente de empresa.
- [x] API Round 2: bloquear aprobaciones invalidas y validar imagenes/busqueda.
- [x] Deploy Round 2 a Azure y confirmacion de versiones servidas.
- [x] QA pagina publica Round 2 post-deploy.
- [x] QA panel empresa Round 2 post-deploy.
- [x] Corregir P1 admin UI: expediente no muestra pendientes reales.
- [x] Deploy fix admin UI `admin.js?v=14`.
- [x] QA admin UI Round 2 post-fix.
- [x] Admin/API: imagenes de servicio dentro del servicio, con preview visible y aprobacion junto al servicio.
- [x] Admin UI: quitar bloque viejo final de empresas/servicios/uploads globales.
- [x] Registro empresa: provincia como select alineado con filtro publico.
- [x] Registro empresa: contactos ampliados, persistidos y visibles donde corresponde.
- [x] Deploy ajustes Product Owner `TASK-138` a `TASK-141`.
- [x] QA Azure ajustes Product Owner post-deploy: no aprobado por P1 admin contactos.
- [x] Admin UI: mostrar contactos ampliados en expediente de empresa.
- [x] Deploy fix admin contactos `admin.js?v=16` / `admin.css?v=10`.
- [x] QA Azure enfocada admin contactos post-fix.
- [x] QA admin/API Round 2 post-deploy: P0 backend cerrado.

Entregable:

- MVP listo para invitar primeras empresas.

## Pre-lanzamiento controlado

Objetivo: habilitar uso recurrente por primeras empresas reales y cerrar el flujo operativo de leads/notificaciones sin redisenio completo.

- [x] P1 local/estructural: Login empresa con email/password, manteniendo invite como activacion inicial.
- [x] P1 local/estructural: UI de activacion/login recurrente en panel empresa.
- [x] P1 local/estructural: QA de login recurrente empresa.
- [x] P1 local/estructural: Email de cotizacion a empresa.
- [x] P1 local/estructural: UI/formulario de cotizacion conectado.
- [x] P1 local/estructural: QA de email de cotizacion.
- [x] P1/P2 local/estructural: Email interno cuando una empresa se registra o envia servicios a revision.
- [x] P1/P2 local/estructural: QA de emails internos.
- [x] P2 local/estructural: Mejora UX/diseno enfocada, sin redisenio completo.
- [x] P2 local/estructural: QA visual/responsive pre-lanzamiento.
- [x] Infra Azure: deploy pre-lanzamiento y preparacion parcial SendGrid/mailbox observable.
- [x] QA Azure: login recurrente empresa.
- [x] QA Azure: email de cotizacion a empresa.
- [x] QA/Product: evidencia/status de emails internos ACS aceptada para pre-lanzamiento.
- [x] QA Azure: visual/responsive pre-lanzamiento final.
- [x] Product / Architect: decidir proveedor email MVP.
- [x] Infra Azure: configurar Azure Communication Services Email.
- [x] Backend/API: cambiar provider email MVP a Azure Communication Services Email.
- [x] Infra Azure: deploy backend ACS Email.
- [x] QA Azure: validar email real de cotizacion con ACS Email.
- [x] Product/QA: confirmar o aceptar evidencia de emails internos ACS.
- [x] P1 local/estructural: al aprobar empresa, generar invite y enviar email de activacion.
- [x] P1 local/estructural: admin muestra feedback de invite al aprobar empresa.
- [x] Infra Azure: deploy auto-invite al aprobar empresa.
- [x] QA Azure: aprobar empresa genera invite automatico y feedback admin.
- [x] QA/Product: confirmar email recibido y activar password desde enlace.
- [x] Backend/API local/estructural: corregir login recurrente cuando existen emails duplicados en `Users`.
- [x] Infra Azure: desplegar fix de login recurrente con emails duplicados.
- [x] QA Azure: revalidar activacion y login recurrente post-deploy.
- [x] Infra/API: inventario de empresas no QA.
- [x] Infra/API: aplicar soft cleanup aprobado de `SMASH Costa Rica`.
- [x] Infra Azure: limpieza pre-lote real de companias QA/test/demo acumuladas en Azure.
- [x] Product/Release: procesar hallazgos prueba cliente 2026-06-03 y cerrar tareas pequenas por superficie.
- [x] Web Dev local/estructural: CTA publico `Contactar`, WhatsApp primario y email como respaldo.
- [x] Backend/API local/estructural: contrato contacto/cotizacion para WhatsApp + email.
- [x] Web Dev local/estructural: lenguaje simple del panel empresa.
- [x] Web Dev local/estructural: admin separa aprobacion de empresa vs servicios pendientes.
- [x] Web Dev local/estructural: categorias publicas alineadas a servicios y foco en resultados.
- [x] Backend/API local/estructural: copy y comportamiento de emails transaccionales MVP.
- [x] Infra Azure: verificar ACS Email/base URLs para bloque cliente.
- [x] Infra Azure: deploy ajustes cliente 2026-06-03.
- [x] QA Azure: revalidar hallazgos cliente 2026-06-03 post-deploy.
- [x] Product/Release: aceptar P2/P3 de `TASK-202` y declarar go de pre-lanzamiento controlado.
- [x] Diseno/UX: guia visual minima implementable para marca y panel empresa.
- [x] Product/Release: aprobar alcance refresh visual antes de Web Dev.
- [x] Web Dev local/estructural: implementar branding base aprobado y refresh panel empresa.
- [x] Infra Azure: deploy refresh visual panel empresa.
- [x] QA Azure: revalidar refresh visual panel empresa post-deploy.
- [x] Product/Release: aceptar P2/P3 de `TASK-208` y cerrar refresh visual panel empresa.
- [x] Web Dev local/estructural: ajustes finales panel empresa, incluyendo `Tipos de evento` como seleccion multiple, logo de referencia e iconos de menu.
- [x] QA local/estructural: validar ajustes finales panel empresa.
- [x] Infra Azure: deploy ajustes finales panel empresa.
- [x] QA Azure: revalidar ajustes finales panel empresa post-deploy.
- [x] Web Dev local/estructural: corregir overflow del sidebar, convertir botones superiores a icon buttons e integrar fondo del logo.
- [x] Web Dev local/estructural: corregir P1 de logout en icon button detectado por QA.
- [x] QA local/estructural: revalidar fix visual final panel empresa.
- [x] Infra Azure: deploy fix visual final panel empresa cuando QA apruebe.
- [x] QA Azure: revalidar fix visual final panel empresa post-deploy.
- [x] Web Dev local/estructural: renombrar marca visible frontend a `Punto Evento CR`.
- [x] Backend/API local/estructural: renombrar marca en emails/copy transaccional a `Punto Evento CR`.
- [x] QA local/estructural: validar renombre `Punto Evento CR`.
- [x] Infra Azure: deploy renombre `Punto Evento CR`.
- [x] QA Azure: revalidar renombre `Punto Evento CR`.
- [x] Diseno/UX: preparar asset web limpio del nuevo logo `Punto Evento CR`.
- [x] Web Dev local/estructural: actualizar panel empresa con nuevo logo `Punto Evento CR`.
- [x] QA local/estructural: validar nuevo logo en panel empresa.
- [x] Infra Azure: deploy nuevo logo `Punto Evento CR`.
- [x] QA Azure: revalidar nuevo logo `Punto Evento CR`.
- [x] Diseno/UX: definir guia de paleta global basada en panel empresa.
- [x] Web Dev local/estructural: aplicar paleta global a pagina publica y admin sin redisenio.
- [x] Backend/API local/estructural: alinear colores minimos de emails.
- [x] QA local/estructural: validar paleta global.
- [x] Infra Azure: deploy paleta global.
- [x] QA Azure: revalidar paleta global post-deploy.
- [x] Diseno/UX: definir guia visual publica premium alineada al panel empresa.
- [x] Web Dev local/estructural: aplicar refresh visual a pagina publica y ficha publica.
- [x] QA local/estructural: validar refresh visual publico.
- [x] Infra Azure: deploy refresh visual publico.
- [x] QA Azure: revalidar refresh visual publico post-deploy.
- [ ] Web Dev local/estructural: ajustar nombres largos, escala home, logo, nav publica y tipografia.
- [x] Backend/API local/estructural: evitar prompt nativo en credenciales admin invalidas.
- [x] Web Dev local/estructural: mostrar mensaje inline de credenciales admin invalidas.
- [x] QA local/estructural: validar ajustes visuales publicos y login admin.
- [x] Infra Azure: deploy ajustes visuales publicos y login admin.
- [x] QA Azure: revalidar ajustes visuales publicos y login admin.
- [x] Infra Azure: limpieza total controlada de empresas y servicios en Azure antes de nuevo test/pre-lote.
- [x] Web Dev: copy publico P1 pre-lanzamiento sin demo, metricas dudosas ni cotizacion multiple.
- [x] Web Dev: CTAs publicos sin servicio seleccionado no deben abrir lead real.
- [x] Web Dev: ocultar legacy/demo del admin productivo y limpiar microcopy tecnico.
- [x] Web Dev: fallback publico sin datos demo en productivo cuando falla API.
- [x] Web Dev: CTA visible en drawer mobile.
- [x] Diseno/UX: definicion mobile acotada para panel empresa y ficha publica.
- [x] Web Dev: implementar mejoras mobile aprobadas por Diseno/UX.
- [x] Web Dev: tildes y consistencia transversal de copy visible.
- [x] Backend/API: pulido copy de emails transaccionales.
- [x] Web Dev: microcopy panel empresa sin lenguaje tecnico/manual.
- [x] QA: revalidacion pre-lanzamiento copy, flujo y responsive.
- [ ] Web Dev: corregir P1 de paquetes/proveedores de referencia visibles cuando falla API publica en productivo.
- [ ] QA: revalidar localmente P1 fallback publico corregido.
- [x] Infra Azure: deploy bloque copy/flujo/mobile post-QA local.
- [x] QA Azure: revalidar bloque copy/flujo/mobile post-deploy.
- [x] Web Dev: ocultar banda de referencia cuando catalogo real esta vacio.
- [x] Infra Azure: deploy fix catalogo vacio publico.
- [x] QA Azure: revalidar catalogo real vacio sin referencias.
- [x] Web Dev: aclarar contacto/cotizacion publica segun revision UX 2026-06-08.
- [x] Web Dev: reforzar jerarquia servicio primero en pagina publica.
- [x] Web Dev: mejorar confirmacion de registro y estados visibles del panel empresa.
- [x] Web Dev: agregar resumen de pendientes en admin con datos existentes.
- [x] Web Dev: pulir catalogo vacio publico con CTA controlado.
- [x] QA: validar localmente bloque UX flujos web 2026-06-08.
- [x] Infra Azure: desplegar bloque UX flujos web 2026-06-08.
- [x] QA Azure: revalidar bloque UX flujos web 2026-06-08 post-deploy.
- [x] Web Dev: corregir overflow desktop en ficha publica.
- [x] QA: validar localmente fix overflow ficha publica.
- [x] Infra Azure: desplegar fix overflow ficha publica.
- [x] QA Azure: revalidar fix overflow ficha publica post-deploy.

Tareas creadas:

- `TASK-158` a `TASK-167` para implementacion/QA local-estructural.
- `TASK-168` a `TASK-172` para deploy/configuracion y QA Azure real.
- `TASK-173` y `TASK-174` canceladas por reemplazo de SendGrid.
- `TASK-175` a `TASK-177` para configurar ACS Email, adaptar backend y validar emails reales.
- `TASK-178` a `TASK-179` para desplegar backend ACS y reintentar QA real.
- `TASK-180` a `TASK-182` para automatizar invite por email al aprobar empresa.
- `TASK-183` para inventario de limpieza controlada de empresas no QA.
- `TASK-184` a `TASK-186` para deploy/re-qa de invite automatico y soft cleanup aprobado.
- `TASK-187` para cierre final coordinado de email recibido, activacion y login recurrente.
- `TASK-188` y `TASK-189` para corregir y revalidar login recurrente con emails duplicados.
- `TASK-190` y `TASK-191` para deploy y reintento final QA del fix de login recurrente.
- `TASK-192` para limpieza pre-lote real de companias QA/test/demo acumuladas en Azure.
- `TASK-193` a `TASK-200` para hallazgos de prueba cliente 2026-06-03.
- `TASK-201` completo para deploy del bloque `TASK-193` a `TASK-198`.
- `TASK-202` completo para revalidacion QA Azure post-deploy.
- `TASK-203` para guia visual minima de Diseno/UX.
- `TASK-204` completo para aprobacion Product/Release antes de crear tareas Web Dev/QA.
- `TASK-205` para implementacion Web Dev del refresh visual aprobado.
- `TASK-206` no aprobado en Azure por deploy pendiente.
- `TASK-207` completo para deploy del refresh visual panel empresa.
- `TASK-208` completo para revalidacion QA Azure post-deploy.
- `TASK-209` completo para ajustes finales acotados del panel empresa.
- `TASK-210` completo para QA local/estructural de ajustes finales.
- `TASK-211` completo para deploy de ajustes finales panel empresa.
- `TASK-212` completo para revalidacion QA Azure post-deploy.
- `TASK-213` completo para corregir overflow visual del sidebar, botones superiores y fondo del logo en panel empresa.
- `TASK-214` no aprobado por P1 en logout icon button.
- `TASK-215` bloqueado/no desplegado por precondicion QA no aprobada.
- `TASK-216` pendiente para revalidacion Azure cuando exista deploy aprobado.
- `TASK-217` a `TASK-221` para renombrar marca visible a `Punto Evento CR`.
- `TASK-222` a `TASK-225` para corregir P1 de logout del icon button y revalidar/deployar el fix visual final.
- `TASK-221` completo para revalidacion QA Azure del renombre `Punto Evento CR`.
- `TASK-225` completo para revalidacion QA Azure del fix visual final.
- `TASK-226` a `TASK-230` completos para preparar, integrar, validar localmente, desplegar y revalidar en Azure el nuevo logo `Punto Evento CR`.
- `TASK-231` a `TASK-236` completos para extender paleta global `Punto Evento CR` solo con colores, sin redisenio profundo.
- `TASK-237` a `TASK-241` completos para refresh visual publico alineado al panel empresa, sin tocar funcionalidad ni cintillo/menu superior.
- `TASK-242` a `TASK-247` completos para ajustes finales de visual publico, navegacion visible y login admin sin prompt nativo.
- `TASK-248` completo para limpieza total controlada de empresas, servicios, accesos y uploads operativos en Azure.
- `TASK-249` a `TASK-259` creados para procesar recomendaciones QA Flujo MVP, QA Visual y Copy/Gramatica del 2026-06-06.
- `TASK-249` a `TASK-258` completadas local/estructuralmente.
- `TASK-259` no aprobado por P1 de paquetes/proveedores estaticos visibles cuando falla la API publica en productivo simulado.
- `TASK-260` a `TASK-263` creados para corregir P1, revalidar local, desplegar y revalidar Azure.
- `TASK-262` completo para deploy Azure del bloque copy/flujo/mobile en `main/70c242c`.
- `TASK-263` completo: QA Azure aprobo con P2 de banda estatica visible cuando catalogo real esta vacio.
- `TASK-264` creado para ocultar banda de referencia cuando catalogo real esta vacio en productivo.
- `TASK-264` completo local/estructuralmente; `TASK-265` y `TASK-266` creados para deploy y QA Azure.
- `TASK-265` completo para deploy Azure del fix catalogo vacio publico en `main/7252b49`.
- `TASK-266` completo: QA Azure aprobo catalogo real vacio sin referencias, sin P0/P1/P2/P3.
- `TASK-267` a `TASK-274` creadas para procesar la revision UX de flujos web 2026-06-08 sin cambios de API/modelo.
- `TASK-267` a `TASK-272` completadas local/estructuralmente.
- `TASK-273` completo para deploy Azure del lote UX 2026-06-08 en `main/7286682`.
- `TASK-274` completo: QA Azure aprobo el lote UX 2026-06-08 con observacion P2 de overflow horizontal en ficha publica desktop.
- `TASK-275` a `TASK-278` creadas para corregir, validar, desplegar y revalidar el P2 de overflow.
- `TASK-275` y `TASK-276` completaron fix y QA local/estructural del overflow.
- `TASK-277` completo para deploy Azure del fix overflow ficha publica en `main/7ee2ab5`.
- `TASK-278` completo: QA Azure aprobo el fix y cerro el P2 de overflow en ficha publica.

Entregable:

- Pre-lanzamiento listo para invitar primeras empresas con acceso recurrente, cotizaciones por email y riesgos P2 documentados.

## Backlog futuro

- Plan destacado.
- Pagos.
- Reportes para proveedores.
- Estadisticas de leads.
- Moderacion avanzada.
- Busqueda avanzada con ranking.
- Dashboard interno para administradores.

## Siguiente bloque recomendado

Prioridad inmediata para los equipos:

1. QA/Product: registrar primera empresa real desde cero y confirmar flujo manual con ambiente limpio.
2. Repetir smoke de `#bodas` cuando exista el primer servicio real publicado.
