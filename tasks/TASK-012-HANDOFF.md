# TASK-012: QA de panel empresa demo separado

## Equipo

QA.

## Estado

Completada.

## Resultado general

Aprobado con observaciones.

`panel.html` cumple el objetivo principal de TASK-012: carga como superficie separada del panel empresa demo, muestra `Aurisbel Eventos`, lista servicios existentes, usa categoria controlada, usa tipos de evento multiples, permite guardar/editar servicios en `localStorage`, maneja metadata y preview local de fotos, persiste tras recarga y permite enviar un servicio a revision cambiando estado a `pending`.

`admin.html?demo=local` tambien cumple la separacion esperada: ya no se presenta como lugar para agregar o editar servicios, comunica revision interna, enlaza hacia `panel.html` y mantiene bloqueada la revision real en modo demo.

Observacion: la seleccion real de archivos mediante picker del sistema no se pudo automatizar en este entorno. Se valido la estructura en navegador y se valido la logica de fotos/preview/cantidad con una prueba controlada sobre `panel.js` usando archivos simulados.

## Casos probados

- Se leyeron los documentos obligatorios:
  - `AGENTS.md`
  - `chat-start/QA.md`
  - `docs/README.md`
  - `docs/BACKLOG.md`
  - `docs/DATA_MODEL.md`
  - `docs/ARCHITECTURE.md`
  - `docs/DECISION_LOG.md`
  - `docs/QA_TEST_PLAN.md`
  - `tasks/TASK-011-HANDOFF.md`
- Se leyeron documentos opcionales utiles:
  - `docs/ADMIN_REGISTRATION_FLOW.md`
  - `tasks/TASK-009-HANDOFF.md`
- Se verifico HTTP `200` para:
  - `http://127.0.0.1:4173/panel.html`
  - `http://127.0.0.1:4173/data/event-types.json`
- Se valido en navegador `panel.html?task012=<timestamp>`:
  - titulo `Panel empresa demo | Punto Evento`,
  - mensaje `Esta demo no guarda en Azure todavia`,
  - empresa demo `Aurisbel Eventos`,
  - boton `Agregar servicio`,
  - servicios existentes visibles,
  - enlace `Ver revision interna`,
  - consola sin errores/warnings.
- Se valido el formulario del panel:
  - formulario abre desde `Agregar servicio`,
  - modo `Nuevo servicio`,
  - categoria usa `select`,
  - categorias cargadas desde catalogo/fallback,
  - tipos de evento son checkboxes multiples,
  - input de fotos existe con `multiple`,
  - contador de fotos es readonly,
  - preview inicial muestra `Sin fotos seleccionadas`,
  - boton `Enviar a revision` visible.
- Se ejecuto prueba controlada sobre el `panel.js` actual:
  - render de 6 categorias,
  - render de 6 tipos de evento,
  - render de servicios default,
  - apertura de formulario,
  - seleccion de 2 fotos simuladas,
  - preview local con URLs `blob://`,
  - actualizacion de cantidad de fotos a `2`,
  - creacion de servicio,
  - guardado en `localStorage` con llave `puntoEventoDemoServices`,
  - persistencia tras recrear la sesion,
  - edicion de servicio por ID,
  - `Enviar a revision` fuerza `status = pending`.
- Se valido `admin.html?demo=local&task012=<timestamp>`:
  - panel demo visible,
  - banner comunica revision interna,
  - no aparece `Agregar servicio`,
  - no aparecen botones `Editar` para servicios,
  - existe link `Abrir panel empresa demo`,
  - la pestana `Servicios` dice `Servicios enviados por empresas`,
  - la nota indica que empresas crean/editan desde `panel.html`,
  - pestana `Revision` mantiene bloqueo `La revision interna requiere login admin real.`,
  - boton `Actualizar` deshabilitado en demo.
- Se hizo responsive basico en `panel.html` y `admin.html?demo=local`:
  - mobile `375x812`,
  - tablet `768x900`,
  - desktop `1366x768`.

## Bugs encontrados con severidad

No se encontraron bugs P0, P1 ni P2.

### P3 - Falta control visible para restaurar datos demo

El panel comparte `localStorage` con la llave `puntoEventoDemoServices`. Esto permite validar persistencia, pero en demos repetidas los datos de pruebas anteriores quedan mezclados con los servicios base.

Impacto:

- No bloquea TASK-012.
- Puede confundir a Product/QA durante demos controlados o pruebas repetidas.

Recomendacion:

- Agregar en una tarea futura un boton de `Restaurar demo` o una instruccion visible para limpiar datos locales.

## Evidencia o notas de consola

Panel:

```text
URL: http://127.0.0.1:4173/panel.html?task012=<timestamp>
Title: Panel empresa demo | Punto Evento
Empresa: Aurisbel Eventos
Servicios visibles: 4 en el navegador usado para QA, incluyendo datos persistidos previos
Categorias: Bodas, Salones, Catering, Corporativos, Fiestas infantiles, Decoracion
Tipos de evento: Bodas, Cumpleanos, Eventos corporativos, Baby Shower, Graduaciones, Fiestas infantiles
Input fotos: multiple=true
Consola: sin errores/warnings
```

Prueba controlada de `panel.js`:

```text
Categorias renderizadas: 6
Tipos de evento renderizados: 6
Servicios default renderizados: OK
Preview inicial: Sin fotos seleccionadas
Seleccion fotos simuladas: 2
Preview local: OK
Cantidad de fotos: 2
Crear servicio: OK
Persistencia tras recarga: OK
Editar servicio: OK
Enviar a revision: status=pending
```

Admin separado:

```text
URL: http://127.0.0.1:4173/admin.html?demo=local&task012=<timestamp>
Banner: Modo demo local / Admin muestra revision interna
Agregar servicio visible: false
Botones Editar visibles: false
Link panel: Abrir panel empresa demo
Servicios heading: Servicios enviados por empresas
Revision lock: La revision interna requiere login admin real.
Actualizar disabled: true
Consola: sin errores/warnings
```

Responsive:

```text
panel.html 375x812: sin overflow horizontal.
panel.html 768x900: sin overflow horizontal.
panel.html 1366x768: sin overflow horizontal.
admin.html?demo=local 375x812: sin overflow horizontal.
admin.html?demo=local 768x900: sin overflow horizontal.
admin.html?demo=local 1366x768: sin overflow horizontal.
```

Git:

```text
git status --short
```

El repo ya tenia cambios previos en `admin.*`, `docs/`, `panel.*`, `data/event-types.json` y `tasks/`. QA no modifico codigo de la app; solo agrego `tasks/TASK-012-HANDOFF.md`.

## Riesgos

- `panel.html` sigue siendo demo estatica sin auth real.
- `localStorage` no representa permisos, aislamiento por empresa ni persistencia productiva.
- Las fotos solo guardan metadata; no se suben a Azure ni se conservan como imagen real tras recarga.
- La validacion de archivo real, MIME real, tamano maximo y limites de cantidad queda pendiente para API/upload real.
- Los catalogos JSON funcionan para demo, pero Product/Architect debe confirmar si seran fuente oficial del MVP.
- Los servicios previos del navegador pueden afectar demos si no se limpia `localStorage`.

## Pendientes

- Validar manualmente con picker real de archivos en un navegador de usuario si se requiere evidencia visual humana del preview.
- Definir mecanismo de reset/restauracion de datos demo.
- Definir si `panel.html` se mantiene como demo o migra pronto a `/panel/*`.
- Implementar auth real de empresa y permisos Empresa A vs Empresa B.
- Implementar CRUD real de servicios y upload real a Blob Storage.
- Alinear backend con los catalogos `data/categories.json` y `data/event-types.json`.

## Recomendacion para Product/Architect

Aceptar TASK-012 como aprobado con observaciones y usar `panel.html` como demo controlada del panel empresa.

La recomendacion inmediata es priorizar un reset de demo para Product/QA y formalizar si los catalogos JSON seran la fuente versionada oficial del MVP. Para producto real, mantener la separacion definida:

- `/admin/*`: revision interna, aprobacion y moderacion.
- `/panel/*`: empresa proveedora, perfil, servicios, fotos y planes.
