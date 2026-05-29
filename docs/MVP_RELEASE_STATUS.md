# Estado Release MVP

Este documento es la mesa de trabajo diaria para decidir si Punto Evento esta listo para invitar primeras empresas reales.

Responsable: `Product / Architect / Release`.

## Estado actual

Estado: `aprobacion pendiente con hallazgos Product Owner`.

Resumen:

- Pagina publica preservada como base.
- Modelo `Empresa -> Servicios` definido y parcialmente implementado.
- Busqueda publica por servicios implementada y validada en local/Azure segun backlog.
- API MVP con registro, autenticacion por invitacion, servicios propios, uploads y aprobacion/rechazo mayormente implementada.
- Bloqueadores operativos recientes cerrados: `ADMIN_PASSWORD` rotado y galeria QA visual limpiada.
- QA Azure enfocado confirmo que el flujo completo funciona por API/manual.
- `admin.html` desplegado con `admin.js?v=12` fue aprobado por QA Azure: login, moderacion real, responsive y sin campos prohibidos en DOM.
- Guion Product Owner creado en `docs/PRODUCT_OWNER_TEST_SCRIPT.md`.
- Product Owner ejecuto prueba controlada y documento hallazgos en `docs/PRODUCT_OWNER_TEST_FINDINGS_2026-05-29.md`.

## Alcance congelado MVP

Para invitar primeras empresas, el MVP debe cubrir:

- Empresa se registra gratis.
- Empresa acepta invitacion o inicia sesion mediante flujo MVP definido.
- Empresa ve su perfil.
- Empresa crea, edita, desactiva o elimina sus servicios.
- Empresa sube fotos de empresa o servicio.
- Admin interno aprueba o rechaza empresas, servicios e imagenes pendientes.
- Pagina publica muestra solo servicios publicados.
- Usuario publico busca por servicio y puede abrir perfil completo de empresa.
- Cotizacion/contacto funciona o queda claramente definido como flujo demo/controlado.

Fuera del MVP inicial:

- Pagos reales.
- Ranking avanzado.
- Dashboard complejo de reportes.
- CRM completo.
- App movil.
- Automatizacion avanzada de moderacion.

## Bloqueadores actuales

- P0 operacional cerrado: `ADMIN_PASSWORD` expuesto durante la prueba Product Owner fue rotado en `TASK-108`.
- P1 producto/datos: decisiones cerradas en `docs/PRODUCT_DECISIONS_PO_FINDINGS_2026-05-29.md`; falta implementarlas en Panel/Admin/API.
- P1 admin/producto: definir si moderacion sigue por listas globales o pasa a expediente de empresa.
- Documentar rutas actuales de pagina publica, admin y API en un solo mapa.

## Ambiente Azure

Estado: pendiente de verificacion final por release.

Validado segun backlog:

- `POST /api/companies/register`.
- Auth por invitacion.
- `GET /api/companies/me`.
- CRUD de servicios propios.
- Upload firmado y confirmacion de upload.
- Aprobacion/rechazo interno.
- Imagen publica por `publicBlobUrl`.
- Endpoints publicos por servicio.

Pendiente:

- Implementar decisiones P1 de `docs/PRODUCT_DECISIONS_PO_FINDINGS_2026-05-29.md`.
- Ejecutar re-prueba Product Owner despues de correcciones P0/P1.

## Ultimo deploy validado

Ultimo deploy validado: pendiente de registrar por `Product / Architect / Release`.

Registrar aqui:

```text
Fecha:
Branch/commit:
Ambiente:
Validado por:
Checks ejecutados:
Resultado:
Riesgos aceptados:
```

## Checklist para invitar primeras empresas

- [x] `ADMIN_PASSWORD` rotado y credenciales temporales cerradas.
- [x] Pagina publica carga en Azure sin errores criticos.
- [x] Registro de empresa validado en Azure por API.
- [x] Invitacion/login empresa validado en Azure por API.
- [x] Panel empresa permite ver perfil propio desde UI desplegada.
- [x] Panel empresa permite crear/editar/desactivar servicios propios desde UI desplegada.
- [x] Upload de imagenes validado con archivo real por API.
- [x] Admin interno aprueba/rechaza empresa, servicio e imagenes por API.
- [x] Servicio aprobado aparece en busqueda publica.
- [x] Servicio pendiente/rechazado/inactivo no aparece publico.
- [x] Perfil empresa muestra servicio seleccionado y otros servicios.
- [ ] Cotizacion/contacto revisado y aceptado para MVP.
- [ ] QA responsive minimo en mobile, tablet y desktop.
- [ ] Sin bugs P0/P1 abiertos.
- [ ] Riesgos P2 aceptados por Product / Architect / Release.
- [ ] `docs/BACKLOG.md` y `docs/DECISION_LOG.md` alineados.

## Tablero operativo

Este tablero decide que se trabaja hoy. Mantenerlo corto.

### Ahora

- Product Owner: ejecutar prueba con guion enfocado en `docs/PRODUCT_OWNER_TEST_SCRIPT.md`.
- QA/Product: registrar hallazgos nuevos de la prueba owner, si aparecen.
- Product/Data: definir catalogo compartido final de categorias/tipos de evento.

### Siguiente

- Web Dev / Panel empresa: ajustar estado, cantidad de fotos, revision y galeria segun decisiones.
- Admin / API: disenar moderacion por expediente de empresa y reglas de cascada segun decisiones.
- Product / Architect / Release: documentar mapa de rutas publicas, admin y API.

### Bloqueado

- Invitar primeras empresas reales hasta resolver/aceptar hallazgos P1 y definir limpieza de datos QA.

### Hecho

- Busqueda publica por servicio.
- Endpoints publicos por servicio.
- CRUD de servicios propios.
- Upload firmado y confirmacion de upload.
- Aprobacion/rechazo interno.
- `ADMIN_PASSWORD` rotado despues de pruebas controladas.
- Galeria QA limpiada para demo visual.
- Matriz MVP enfocada contra Azure: flujo completo funciona por API/manual; UI completa aun pendiente.
- Registro publico `#empresas` conectado al modelo nuevo, aprobado por QA local y desplegado en Azure con validacion parcial.
- Submit visible de `#empresas` aprobado en Chrome normal contra Azure.
- `panel.html` conectado localmente a API real y aprobado por QA local.
- `panel.html` conectado a API real, desplegado y aprobado por QA Azure con sesion real, CRUD de servicios, upload cover y logout.
- `admin.html` muestra pestana `Modelo nuevo` con bloqueo claro y sin datos falsos cuando faltan listados internos.
- Backend/API implemento listados internos de Companies, Services y Uploads pendientes para moderacion nueva.
- QA local/estructural aprobo endpoints internos de listado para moderacion nueva.
- Backend/API corrigio enrutamiento de `POST` para que Azure pueda devolver `405` en listados internos.
- QA Azure aprobo endpoints internos de listado para moderacion nueva, incluyendo `POST -> 405`.
- Web Dev conecto `admin.html` a listados y acciones reales de Companies, Services y Uploads del modelo nuevo.
- QA local aprobo admin UI conectada al modelo nuevo con mocks, acciones y responsive basico.
- Deploy de `admin.html` conectado al modelo nuevo esta visible en Azure; QA Azure confirmo assets nuevos pero quedo bloqueado por credencial admin.
- Infra Azure / Product completo rotacion y validacion de credencial admin para QA Azure de `admin.html`.
- QA Azure confirmo que la credencial corregida funciona por API con `X-Punto-Admin-Credential`; la UI queda bloqueada por usar `Authorization`.
- Web Dev corrigio `admin.js` para enviar `X-Punto-Admin-Credential` y subio cache busting a `admin.js?v=11`.
- QA Azure con `admin.js?v=11` aprobo login, legacy, modelo nuevo, approve real de Company/Service/Upload y responsive; queda pendiente remover `sig=` legacy.
- Web Dev removio render de `image.previewUrl` legacy y subio cache busting a `admin.js?v=12`.
- QA Azure aprobo `admin.html` con `admin.js?v=12`: sin `sig=`, sin campos prohibidos, acciones reales y responsive.
- Product / Architect creo guion de prueba Product Owner.
- Product Owner ejecuto prueba controlada y documento hallazgos P0/P1/P2.
- Product / Architect cerro decisiones P1 de contacto, taxonomia, revision, imagenes, moderacion y cascadas.
- Infra Azure / Product roto `ADMIN_PASSWORD` expuesto y valido credencial nueva contra Azure.
- Web Dev completo `TASK-110`: registro publico evita doble submit, muestra estado de envio y confirma exito con `Registrar otra empresa`; queda pendiente QA Azure post-deploy.
- Backend/API completo `TASK-111`: endpoint `submit-review` y reglas de status de servicio implementadas.
- QA bloqueo `TASK-112` porque Azure aun sirve `index.html` con `app.js?v=20` y `styles.css?v=15`.
- QA aprobo `TASK-113` local/estructural de `submit-review`; queda pendiente deploy y smoke Azure.
- QA Azure aprobo `TASK-114`: registro publico con `app.js?v=21` y `styles.css?v=16` resuelve `PO-001`, evita doble submit y no crea duplicados visibles.
- QA Azure aprobo `TASK-115`: `submit-review` funciona en Azure real con sesion de empresa, Azure Table Storage y negativos `409/400/401/404`.
- Web Dev completo `TASK-116`: panel empresa separa `Guardar borrador -> Enviar a revision`, remueve estado editable y cantidad manual de fotos.
- QA Azure aprobo `TASK-117`: panel empresa desplegado usa `Guardar borrador -> Enviar a revision` con sesion real, requests reales y responsive basico OK.
- Product / Architect decidio en `TASK-118` crear una empresa demo limpia para Product Owner y no borrar datos QA sin tarea Infra/API dedicada.
- Product / Architect completo `TASK-119`: guion demo owner limpio actualizado con empresa `Demo Owner Jardines del Sol` y flujo `Guardar borrador -> Enviar a revision`.
- Infra/API completo `TASK-120` como inventario/propuesta: encontro 3 empresas QA y 6 servicios QA, recomendo soft cleanup sin ejecutar cambios.
- QA completo `TASK-121`: ambiente listo para Product Owner con guion enfocado; admin global limpio queda condicionado a soft cleanup.
- Infra/API completo `TASK-122`: soft cleanup aprobado y ejecutado; 4 empresas y 7 servicios QA/pre-demo fueron rechazados sin hard delete, y ya no quedan objetivos `QA TASK-*` en colas.

## Como actualizar este documento

Actualizar cuando:

- Termina una tarea con handoff relevante.
- Cambia un bloqueador.
- Se valida o falla un deploy.
- Se acepta un riesgo de release.
- Cambia el alcance MVP.
- Un item del tablero operativo pasa de `Ahora` a `Hecho`, `Bloqueado` o `Siguiente`.

No usar este documento como backlog largo. Para tareas detalladas usar `docs/BACKLOG.md` o `tasks/`.

Regla operativa:

- `Ahora`: maximo 3 tareas activas.
- `Siguiente`: maximo 5 tareas candidatas.
- `Bloqueado`: solo tareas que no pueden avanzar sin decision, credencial, deploy o resultado externo.
- `Hecho`: resumen corto de logros recientes, no historial completo.
