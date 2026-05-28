# Estado Release MVP

Este documento es la mesa de trabajo diaria para decidir si Punto Evento esta listo para invitar primeras empresas reales.

Responsable: `Product / Architect / Release`.

## Estado actual

Estado: `bloqueado para prueba owner completa desde navegador`.

Resumen:

- Pagina publica preservada como base.
- Modelo `Empresa -> Servicios` definido y parcialmente implementado.
- Busqueda publica por servicios implementada y validada en local/Azure segun backlog.
- API MVP con registro, autenticacion por invitacion, servicios propios, uploads y aprobacion/rechazo mayormente implementada.
- Bloqueadores operativos recientes cerrados: `ADMIN_PASSWORD` rotado y galeria QA visual limpiada.
- QA Azure enfocado confirmo que el flujo completo funciona por API/manual.
- Falta conectar UI real de registro, panel empresa y admin para que Product Owner lo pruebe completo sin apoyo tecnico.

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

- `#empresas` fue ajustado y aprobado localmente para usar `companies/register`; falta commit/deploy y QA Azure.
- `panel.html` sigue en demo/localStorage y no usa API real ni sesion de empresa.
- `admin.html` modera proveedores legacy; no modera Companies, Services ni Uploads del modelo nuevo.
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

- Commit/deploy y QA Azure de UI de registro publico conectada al modelo nuevo.
- Conectar UI para panel empresa y admin del modelo nuevo.
- Ejecutar QA Azure post-integracion UI.

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
- [ ] Panel empresa permite ver perfil propio.
- [ ] Panel empresa permite crear/editar/desactivar servicios propios.
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

- Product / Architect / Release: commitear y pushear registro publico `#empresas` conectado al modelo nuevo.
- QA / Infra Azure: validar `#empresas` en Azure despues del deploy.
- Web Dev: conectar `panel.html` a sesion real, servicios propios y uploads.

### Siguiente

- QA / Infra Azure: validar flujo completo desde navegador cuando las tres UI esten conectadas.
- Product / Architect / Release: crear guion final para Product Owner despues de QA UI.
- Product / Architect / Release: documentar mapa de rutas publicas, admin y API.

### Bloqueado

- Product Owner no puede probar flujo completo desde navegador hasta conectar registro, panel y admin al modelo nuevo.
- Invitar primeras empresas reales hasta cerrar QA Azure completo y bloqueadores P0/P1.

### Hecho

- Busqueda publica por servicio.
- Endpoints publicos por servicio.
- CRUD de servicios propios.
- Upload firmado y confirmacion de upload.
- Aprobacion/rechazo interno.
- `ADMIN_PASSWORD` rotado despues de pruebas controladas.
- Galeria QA limpiada para demo visual.
- Matriz MVP enfocada contra Azure: flujo completo funciona por API/manual; UI completa aun pendiente.
- Registro publico `#empresas` conectado al modelo nuevo y aprobado por QA local.

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
