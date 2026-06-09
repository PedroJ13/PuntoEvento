# TASK-262: Infra Azure - deploy bloque copy/flujo/mobile pre-lanzamiento

## Equipo asignado

Infra Azure.

## Contexto

Depende de QA local aprobada en `TASK-261`.

Azure aun sirve assets anteriores al bloque:

- `app.js?v=28`
- `styles.css?v=23`
- `panel.js?v=11`
- `panel.css?v=12`
- `admin.js?v=19`

Local del bloque observado por QA:

- `app.js?v=30`
- `styles.css?v=25`
- `panel.js?v=13`
- `panel.css?v=13`
- `admin.js?v=20`

## Tarea

Desplegar a Azure el bloque `TASK-249` a `TASK-258` mas el fix `TASK-260`, solamente despues de que `TASK-261` apruebe.

## Alcance

- Frontend publico/admin/panel.
- Backend/API solo si incluye cambios de email de `TASK-257`.
- Verificar cache busting servido por Azure.

## No tocar

- No modificar datos Azure.
- No limpiar tablas.
- No rotar secretos.
- No cambiar app settings salvo que el deploy normal lo requiera y este documentado.

## Verificacion

- Confirmar URLs `200`:
  - `/`
  - `/panel.html`
  - `/admin.html`
  - `/api/public/services?limit=50`
- Confirmar versiones de assets nuevas.
- Confirmar que `/api/public/services?limit=50` sigue devolviendo 0 items despues de limpieza `TASK-248`.
- Confirmar que no se imprimen secretos.

## Handoff esperado

Crear `tasks/TASK-262-HANDOFF.md` con:

- Commit/branch desplegado.
- Assets/versiones servidas por Azure.
- Smokes ejecutados.
- Riesgos.
