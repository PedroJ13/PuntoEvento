# Backlog Punto Evento

## Sprint 0: Reinicio y baseline

Objetivo: congelar lo que ya funciona y dejar reglas claras antes de seguir construyendo.

- [x] Revisar cambios sin commit.
- [x] Decidir que entra en el commit baseline.
- [x] Crear commit baseline antes de cambios grandes.
- [x] Confirmar que todos los chats/equipos usaran `AGENTS.md`, `docs/` y `chat-start/`.
- [x] Inventariar infraestructura Azure actual.
- [x] Inventariar API actual y compararla contra `Company -> Services`.
- [x] Crear matriz QA MVP.
- [ ] Confirmar que la pagina publica actual funciona en Azure despues del ultimo deploy.
- [ ] Documentar rutas actuales de pagina publica, admin y API en un solo mapa.

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
- [ ] Deploy y QA Azure de estado vacio en filtros de servicios.
- [ ] Publicar imagen real de demo para servicio QA principal.

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
- [ ] Rotar `ADMIN_PASSWORD` despues de prueba controlada.
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

Entregable:

- MVP listo para invitar primeras empresas.

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

1. Product/Owner: rotar `ADMIN_PASSWORD` porque el temporal fue expuesto durante la prueba.
2. Product/Architect: commitear y pushear ajuste de filtros.
3. QA/Infra Azure: validar estado vacio post-deploy en la pagina publica.
4. Product/Owner o QA: publicar una imagen real de demo para el servicio QA principal.
