# TASK-146 - QA Azure enfocada admin contactos

Equipo: QA

## Contexto

`TASK-143` no aprobo por un P1 de Web Dev: el expediente admin no mostraba contactos ampliados aunque la API interna si los devolvia.

`TASK-144` implemento el fix frontend-only.

`TASK-145` lo desplego a Azure:

- `admin.js?v=16`
- `admin.css?v=10`

No repetir todo el flujo de imagenes por servicio salvo que encuentres una regresion evidente. Ese flujo ya fue aprobado en `TASK-143`.

## Leer antes de probar

- `tasks/TASK-143-HANDOFF.md`
- `tasks/TASK-144-HANDOFF.md`
- `tasks/TASK-145-HANDOFF.md`
- `docs/MVP_RELEASE_STATUS.md`

## Ambiente

- Admin interno: `https://zealous-field-08fdd720f.7.azurestaticapps.net/admin.html`
- Registro publico: `https://zealous-field-08fdd720f.7.azurestaticapps.net/index.html#empresas`

## Alcance

1. Confirmar versiones:
   - `/admin.html` carga `admin.js?v=16`.
   - `/admin.html` carga `admin.css?v=10`.

2. Crear o usar una empresa QA pendiente con contactos ampliados:
   - Email
   - WhatsApp
   - Telefono local (`phone`)
   - Instagram
   - Facebook
   - Sitio web (`website`)
   - TikTok
   - Provincia/canton o zona

3. Abrir el expediente en admin y confirmar que se ven, cuando existen:
   - Email
   - WhatsApp
   - Telefono local
   - Instagram
   - Facebook
   - Sitio web
   - TikTok
   - Zona/provincia/canton

4. Confirmar que no se renderiza ruido:
   - `undefined`
   - `null`
   - campos vacios innecesarios

5. Confirmar que no reaparecieron elementos viejos:
   - `.internal-grid`
   - `[data-internal-list="uploads"]`
   - `[data-case-uploads]`

6. Confirmar que no se exponen patrones sensibles en DOM:
   - `sig=`
   - `tokenHash`
   - `sessionHash`
   - `pendingBlobName`
   - `uploadUrl`

## Criterio de aprobacion

QA aprueba si:

- Azure sirve `admin.js?v=16` y `admin.css?v=10`.
- El expediente admin muestra los contactos ampliados.
- No hay regresion visible del expediente de empresa.
- No hay P0/P1 abiertos.

## Entregable

Actualizar `tasks/TASK-146-HANDOFF.md` con:

- Resultado: aprobado / aprobado con observaciones / no aprobado.
- Evidencia de versiones servidas.
- Datos QA usados, sin secretos.
- Campos de contacto visibles.
- Bugs encontrados, si aplica.
- Recomendacion para Product / Architect / Release.
