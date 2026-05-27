# Backlog Punto Evento

## Sprint 0: Reinicio y baseline

Objetivo: congelar lo que ya funciona y dejar reglas claras antes de seguir construyendo.

- [ ] Revisar cambios sin commit.
- [ ] Decidir que entra en el commit baseline.
- [ ] Confirmar que la pagina publica actual funciona en Azure.
- [ ] Documentar rutas actuales de pagina publica, admin y API.
- [ ] Crear commit baseline antes de cambios grandes.
- [ ] Confirmar que todos los chats/equipos usaran `AGENTS.md`, `docs/` y `chat-start/`.

Entregable:

- Baseline confiable.
- Repositorio listo para tareas pequenas por equipo.

## Sprint 1: Modelo Empresa -> Servicios en demo

Objetivo: adaptar el concepto del producto al nuevo modelo sin tocar backend real todavia.

- [ ] Crear `data/companies.json` demo.
- [ ] Crear `data/services.json` demo.
- [ ] Mantener `data/providers.json` temporalmente para compatibilidad.
- [ ] Crear empresa demo con varios servicios:
  - Queques.
  - Wedding Planner.
  - Mesa dulce.
- [ ] Ajustar admin demo para listar varios servicios por empresa.
- [ ] Agregar formulario demo para crear/editar servicio.
- [ ] Agregar estado visual: draft, pending, published, rejected.
- [ ] Crear checklist QA para multiples servicios.

Entregable:

- Admin demo capaz de representar una empresa con N servicios.

## Sprint 2: Busqueda publica por servicio

Objetivo: que la pagina publica busque y muestre servicios especificos, sin perder el perfil completo de empresa.

- [ ] Cambiar resultados demo para renderizar servicios.
- [ ] Mostrar empresa asociada dentro del card de servicio.
- [ ] Agregar link "Ver otros servicios de esta empresa".
- [ ] Crear perfil empresa con servicio seleccionado destacado.
- [ ] Mantener home actual sin reescritura.
- [ ] Validar mobile y desktop.

Entregable:

- Si el usuario busca "mesa dulce", ve "Mesa dulce por Aurisbel", no solo "Aurisbel".

## Sprint 3: API y persistencia MVP

Objetivo: convertir demo admin en flujo funcional con Azure serverless/managed.

- [ ] Definir contrato API en `docs/API_CONTRACT.md`.
- [ ] Elegir persistencia MVP: Table Storage o Cosmos DB serverless.
- [ ] Endpoint registro empresa.
- [ ] Endpoint login/auth o integracion con auth elegida.
- [ ] Endpoint obtener empresa propia.
- [ ] Endpoint CRUD servicios.
- [ ] Endpoint upload firmado para imagenes.
- [ ] Endpoint aprobar/rechazar empresa o servicio.
- [ ] Notificacion por email al registrarse o pasar a revision.

Entregable:

- API base para registro, admin y revision.

## Sprint 4: QA, seguridad y publicacion controlada

Objetivo: validar que el flujo puede usarse por empresas reales.

- [ ] Matriz de pruebas registro.
- [ ] Matriz de pruebas login.
- [ ] Matriz de pruebas admin servicios.
- [ ] Matriz de pruebas upload fotos.
- [ ] Regresion pagina publica.
- [ ] Pruebas de permisos Empresa A vs Empresa B.
- [ ] Pruebas responsive.
- [ ] Checklist de release.

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
