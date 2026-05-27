# TASK-007: QA de pestana demo Servicios en admin

## Equipo

QA

## Estado

Completada

## Resultado general

Aprobado con observaciones.

La demo de `Servicios` en `admin.html` cumple el objetivo principal de TASK-006: representa multiples servicios de una empresa, renderiza los servicios demo esperados, permite crear y editar servicios en la logica local, y persiste cambios usando `localStorage`.

## Casos probados

- Se leyeron los documentos obligatorios de la asignacion:
  - `AGENTS.md`
  - `chat-start/QA.md`
  - `docs/README.md`
  - `docs/BACKLOG.md`
  - `docs/DATA_MODEL.md`
  - `docs/MVP_CRITERIA.md`
  - `docs/QA_TEST_PLAN.md`
  - `tasks/TASK-006-HANDOFF.md`
- Se abrio `http://127.0.0.1:4173/admin.html`.
- Se valido que `admin.html` carga con:
  - `admin.css?v=3`
  - `admin.js?v=6`
- Se valido que el login aparece al abrir admin sin sesion.
- Se valido que el panel admin no queda visible sin login.
- Se valido que existen las secciones:
  - `Revision`
  - `Empresa demo`
  - `Servicios`
- Se valido que existe el panel `Revision`.
- Se valido que existe la empresa demo `Aurisbel Eventos`.
- Se valido que la seccion `Servicios` renderiza en DOM los servicios demo:
  - `Queques personalizados`
  - `Wedding planner`
  - `Mesa dulce`
- Se valido que los estados visuales existen en el render:
  - `Publicado`
  - `Pendiente`
  - `Borrador`
- Se ejecuto la logica real de `admin.js` en un entorno controlado con mocks de DOM/localStorage para validar:
  - carga de servicios default,
  - creacion de un servicio demo,
  - guardado en `localStorage` con llave `puntoEventoDemoServices`,
  - persistencia al reiniciar la ejecucion,
  - edicion de `service-mesa-dulce`,
  - persistencia de la edicion.
- Se hizo regresion basica de pagina publica:
  - `#inicio`
  - `#bodas`
  - `#proveedor/casa-arboleda`
  - `#empresas`

## Bugs encontrados con severidad

### P2 - QA local no puede completar login real sin API/credenciales disponibles

El panel de servicios queda dentro de `data-admin-panel`, que se muestra luego de `loadProviders()`. En ambiente local simple, la validacion real de login depende de los endpoints admin actuales y credenciales/API. Por eso no se pudo completar el flujo de login end-to-end en navegador local.

Impacto:

- No bloquea la demo de servicios como logica local.
- Si se quiere demo manual completa sin Azure/API, Product/Architect deberia decidir si se agrega un modo demo explicito o una ruta separada para panel empresa.

### P3 - Cache local puede mostrar versiones anteriores de admin

En una primera carga de `admin.html` el navegador mostro versiones anteriores (`admin.css?v=2`, `admin.js?v=5`). Al abrir con cache bust del HTML se cargo correctamente `admin.css?v=3` y `admin.js?v=6`.

Impacto:

- No es bug funcional del codigo actual.
- QA debe usar hard refresh o query param durante validacion local si ve una version vieja.

## Evidencia o notas de consola

Admin:

```text
URL validada: http://127.0.0.1:4173/admin.html?task007=<timestamp>
CSS: styles.css?v=14, admin.css?v=3
JS: admin.js?v=6
Login visible: true
Panel admin visible sin login: false
Tabs detectadas: Revision, Empresa demo, Servicios
Servicios detectados: Queques personalizados, Wedding planner, Mesa dulce
Estados detectados: Publicado, Pendiente, Borrador
Consola: sin errores/warnings
```

Logica localStorage:

```text
Servicios default detectados: OK
Crear servicio demo: OK
Servicios guardados: 4
Servicio nuevo persistente tras reinicio: OK
Editar service-mesa-dulce: OK
Edicion persistente tras reinicio: OK
Mensaje estado al guardar: Servicio demo guardado localmente.
```

Regresion publica:

```text
#inicio: OK, sin errores, sin imagenes rotas
#bodas: OK, sin errores, sin imagenes rotas
#proveedor/casa-arboleda: OK, sin errores, sin imagenes rotas
#empresas: OK, sin errores, sin imagenes rotas
```

Git:

```text
git status --short
```

El repo ya tenia cambios previos en `admin.*`, `docs/` y `tasks/`. QA no modifico codigo; solo agrego este handoff.

## Riesgos

- La demo de servicios esta dentro de `admin.html`, aunque la arquitectura objetivo separa Admin interno y Panel empresa.
- La persistencia en `localStorage` es solo demo; no hay API real de servicios todavia.
- El login real y el flujo `Revision` dependen de API/credenciales Azure, no de la demo local de servicios.
- Sin un modo demo explicito, QA manual local no puede navegar visualmente el panel completo si no hay API admin disponible.
- Los servicios creados localmente no tienen aislamiento por usuario/empresa; esto es aceptable para demo, pero no para MVP real.

## Pendientes

- Validar login real y `Revision` contra ambiente Azure con credenciales configuradas.
- Definir si `Servicios` se queda temporalmente en `admin.html` o se mueve a `/panel/*`.
- Implementar fixtures o API real para `Company -> Services`.
- Agregar pruebas automatizadas para crear/editar servicio y persistencia.
- Validar responsive visual de la pestana `Servicios` con el panel visible en navegador.

## Recomendacion para Product/Architect

Mantener TASK-006 como demo aprobada con observaciones, pero no promoverla como flujo MVP real hasta separar responsabilidades:

- `/admin/*` para revision interna.
- `/panel/*` para empresas proveedoras.

Product/Architect deberia decidir si se habilita un modo demo local para QA/Product sin depender de API Azure, o si toda validacion del panel debe hacerse contra ambiente Azure con credenciales reales.

La siguiente tarea recomendada para Web Dev es corregir cualquier detalle de acceso/demo decidido por Product/Architect y preparar la separacion futura de `Servicios` hacia el panel empresa.
