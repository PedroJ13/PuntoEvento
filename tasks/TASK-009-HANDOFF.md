# TASK-009: QA de modo demo local en admin

## Equipo

QA.

## Estado

Completada.

## Resultado general

Aprobado con observaciones.

El modo demo local agregado en TASK-008 cumple los criterios principales: `admin.html` carga sin sesion, el CTA `Ver modo demo local` abre el panel demo, `admin.html?demo=local` abre directamente el panel, el banner `Modo demo local` es visible, `Revision` queda bloqueado, `Empresa demo` y `Servicios` son navegables, crear/editar servicios funciona con `localStorage`, la persistencia sobrevive a recarga y no se detectaron errores de consola.

La observacion principal es de repetibilidad QA: los datos demo quedan persistidos en `localStorage` y no hay control visible para limpiar/restaurar la demo desde la UI. Esto no bloquea TASK-009 porque la persistencia era parte del alcance.

## Casos probados

- Se leyeron los documentos obligatorios de la asignacion:
  - `AGENTS.md`
  - `chat-start/QA.md`
  - `docs/README.md`
  - `docs/BACKLOG.md`
  - `docs/DECISION_LOG.md`
  - `docs/QA_TEST_PLAN.md`
  - `tasks/TASK-007-HANDOFF.md`
  - `tasks/TASK-008-HANDOFF.md`
- Se valido `http://127.0.0.1:4173/admin.html?task009=<timestamp>` sin sesion:
  - login visible,
  - panel admin oculto,
  - CTA `Ver modo demo local` visible,
  - boton `Actualizar` deshabilitado,
  - carga `admin.css?v=4`,
  - carga `admin.js?v=7`.
- Se valido el CTA `Ver modo demo local`:
  - login oculto,
  - panel admin visible,
  - `body` en clase `is-demo-mode`,
  - banner `Modo demo local` visible,
  - pestana activa `Empresa demo`,
  - lista real de proveedores oculta,
  - boton `Actualizar` deshabilitado.
- Se valido `admin.html?demo=local&task009=<timestamp>`:
  - abre directamente el panel demo,
  - muestra banner,
  - mantiene `Empresa demo` como pestana inicial,
  - no requiere credenciales.
- Se valido `Revision` en modo demo:
  - pestana navegable,
  - mensaje visible: `La revision interna requiere login admin real.`,
  - lista real de proveedores oculta,
  - `Actualizar` queda deshabilitado para evitar llamadas reales.
- Se valido `Servicios` en modo demo:
  - pestana navegable,
  - boton `Agregar servicio` visible,
  - servicios demo visibles:
    - `Queques personalizados`,
    - `Wedding planner`,
    - `Mesa dulce`,
    - un servicio QA persistido previamente en `localStorage`.
- Se ejecuto prueba controlada con el `admin.js` actual y mocks de DOM/localStorage para validar:
  - inicializacion por `?demo=local`,
  - creacion de servicio demo,
  - guardado en `localStorage` con llave `puntoEventoDemoServices`,
  - persistencia despues de recrear la sesion,
  - edicion del mismo servicio por ID,
  - bloqueo de aprobar/rechazar en modo demo.
- Se hizo responsive basico en modo demo para `Empresa demo` y `Servicios`:
  - mobile `375x812`,
  - tablet `768x900`,
  - desktop `1366x768`.

## Bugs encontrados con severidad

### P3 - No hay control visible para resetear datos demo persistidos

El flujo cumple la persistencia requerida, pero al repetir QA los servicios creados quedan en `localStorage` y contaminan escenarios posteriores si QA/Product no limpia manualmente el almacenamiento del navegador.

Impacto:

- No bloquea el demo local.
- Puede confundir validaciones repetidas o demos controlados porque aparecen servicios de pruebas anteriores.

Recomendacion:

- Product/Architect deberia decidir si se agrega en una tarea futura un boton o instruccion clara para restaurar datos demo.

## Evidencia o notas de consola

Admin sin sesion:

```text
URL: http://127.0.0.1:4173/admin.html?task009=<timestamp>
Login visible: true
Panel admin visible: false
CTA demo: Ver modo demo local
Actualizar disabled: true
CSS: styles.css?v=14, admin.css?v=4
JS: admin.js?v=7
Consola: sin errores/warnings
```

CTA demo:

```text
Panel admin visible: true
Banner visible: true
Banner: Modo demo local
Pestana activa: empresa
Count: Modo demo local
Status: Modo demo local activo.
Lista proveedores oculta: true
Actualizar disabled: true
Consola: sin errores/warnings
```

Query param:

```text
URL: http://127.0.0.1:4173/admin.html?demo=local&task009=<timestamp>
Login visible: false
Panel admin visible: true
Banner visible: true
Pestana activa: empresa
Mensaje bloqueo revision existe: La revision interna requiere login admin real.
```

Revision:

```text
Pestana activa: revision
Mensaje bloqueo visible: La revision interna requiere login admin real.
Lista proveedores oculta: true
Actualizar disabled: true
```

Servicios y localStorage:

```text
Servicios visibles: Queques personalizados, Wedding planner, Mesa dulce
Crear servicio demo: OK
Persistencia tras recarga: OK
Editar servicio demo: OK
Mensaje al guardar: Servicio demo guardado localmente.
Bloqueo aprobar/rechazar en demo: La revision interna requiere login admin real.
```

Responsive:

```text
375x812: sin overflow horizontal; botones visibles dentro del viewport.
768x900: sin overflow horizontal; botones visibles dentro del viewport.
1366x768: sin overflow horizontal; botones visibles dentro del viewport.
Consola responsive: sin errores/warnings.
```

Git:

```text
git status --short
```

El repo ya tenia cambios previos en `admin.*`, `docs/` y `tasks/`. QA no modifico codigo de la app; solo agrego `tasks/TASK-009-HANDOFF.md`.

## Riesgos

- El modo demo local vive temporalmente dentro de `admin.html`, aunque la arquitectura objetivo separa `/admin/*` y `/panel/*`.
- `localStorage` no representa permisos, aislamiento por empresa ni persistencia real.
- Product/QA pueden ver y modificar datos demo sin login por diseno; no debe usarse con datos reales.
- La revision interna real sigue dependiendo de API Azure y credenciales reales, fuera del alcance de TASK-009.
- Los datos demo persistidos pueden afectar demos repetidos si no se limpia manualmente `localStorage`.

## Pendientes

- Definir si se agrega mecanismo de reset/restauracion de demo local.
- Validar login real y revision interna contra Azure con credenciales reales.
- Separar el panel empresa hacia `/panel/*` cuando Product/Architect lo priorice.
- Implementar API real de `Company -> Services` para reemplazar la persistencia demo.
- Automatizar smoke del modo demo local para evitar regresiones futuras.

## Recomendacion para Product/Architect

Aceptar TASK-009 como aprobado con observaciones y usar el modo demo local para demos controlados de `Empresa demo` y `Servicios`.

Antes de usarlo en sesiones repetidas con Product o empresas piloto, conviene definir una forma simple de restaurar datos demo. Para el MVP real, mantener la recomendacion arquitectonica vigente: separar `/admin/*` para revision interna y `/panel/*` para gestion de empresas proveedoras.
