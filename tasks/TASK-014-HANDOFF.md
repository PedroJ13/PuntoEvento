# TASK-014: QA del boton Restaurar demo

## Equipo

QA.

## Estado

Completada.

## Resultado general

Aprobado.

El boton `Restaurar demo` en `panel.html` cumple los criterios de aceptacion: es visible, usa `confirm()`, permite volver a los servicios base, elimina servicios creados durante pruebas, actualiza `localStorage.puntoEventoDemoServices`, no toca otras llaves de almacenamiento y no genera errores de consola en la carga del panel.

## Casos probados

- Se leyeron los documentos obligatorios:
  - `AGENTS.md`
  - `chat-start/QA.md`
  - `docs/README.md`
  - `docs/BACKLOG.md`
  - `tasks/TASK-012-HANDOFF.md`
  - `tasks/TASK-013-HANDOFF.md`
- Se verifico `http://127.0.0.1:4173/panel.html` con respuesta HTTP `200`.
- Se valido en navegador `panel.html?task014=<timestamp>`:
  - carga `panel.css?v=2`,
  - carga `panel.js?v=2`,
  - boton `Restaurar demo` visible,
  - boton `Agregar servicio` visible,
  - servicios existentes visibles,
  - consola sin errores/warnings.
- Se ejecuto prueba controlada sobre el `panel.js` actual para validar:
  - creacion de servicio `Servicio QA Reset`,
  - guardado en `localStorage.puntoEventoDemoServices`,
  - persistencia tras recrear la sesion,
  - `confirm()` llamado al usar `Restaurar demo`,
  - al cancelar `confirm()`, el servicio creado sigue presente,
  - al aceptar `confirm()`, el servicio creado desaparece,
  - despues de restaurar vuelven los servicios base,
  - solo se modifica `puntoEventoDemoServices`,
  - una llave adicional de prueba permanece intacta.

## Bugs encontrados con severidad

No se encontraron bugs P0, P1, P2 ni P3 en el alcance de TASK-014.

## Evidencia o notas de consola

Smoke navegador:

```text
URL: http://127.0.0.1:4173/panel.html?task014=<timestamp>
Title: Panel empresa demo | Punto Evento
CSS: styles.css?v=14, panel.css?v=2
JS: panel.js?v=2
Restaurar demo visible: true
Agregar servicio visible: true
Consola: sin errores/warnings
```

Prueba controlada de restauracion:

```text
Servicio creado: Servicio QA Reset
Total despues de crear: 4
Visible despues de refrescar/recrear sesion: true
Confirm cancelado: servicio sigue presente
Confirm aceptado: servicio desaparece
Servicios base restaurados: Queques personalizados, Wedding planner, Mesa dulce
Total despues de restaurar: 3
Mensaje: Demo restaurada. Se volvieron a cargar los servicios base.
Otra llave localStorage preservada: true
```

Texto de confirmacion:

```text
Esto borrara los servicios demo creados en este navegador. Deseas continuar?
```

Git:

```text
git status --short
```

El repo ya tenia cambios previos en `admin.*`, `docs/`, `panel.*`, `data/event-types.json` y `tasks/`. QA no modifico codigo de la app; solo agrego `tasks/TASK-014-HANDOFF.md`.

## Riesgos

- `Restaurar demo` es correcto para demo local, pero debe mantenerse fuera de un panel productivo con datos reales o protegerse por entorno.
- La restauracion solo cubre `localStorage.puntoEventoDemoServices`; si se agregan nuevas llaves demo, habra que incluirlas explicitamente o documentar que no se limpian.
- `panel.html` sigue siendo demo estatica sin auth, permisos ni persistencia real.

## Pendientes

- Product/Architect debe decidir si el reset debe cubrir futuras llaves demo del panel.
- Web Dev debe ocultar o condicionar este control cuando exista panel productivo real.
- QA debe volver a validar si se agregan mas datos demo fuera de `puntoEventoDemoServices`.

## Recomendacion para Product/Architect

Aceptar TASK-014 como aprobada. Mantener `Restaurar demo` mientras `panel.html` siga siendo una demo local con `localStorage`, y definir una regla de entorno antes de llevar el panel a un flujo real de empresas.
