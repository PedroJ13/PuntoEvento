# TASK-135 Handoff

## Estado

Completado.

## Causa raiz

El tab `Modelo nuevo` no llegaba a cargar los endpoints internos porque `admin.js` recorria `Object.values(state.internal)` en varios puntos. `state.internal` contiene las secciones `companies`, `services`, `uploads`, pero tambien contiene `selectedCompanyId`, que es un string.

Al entrar al tab, `renderInternalModeration()` intentaba calcular `section.items.length` sobre ese string y lanzaba:

```text
TypeError: Cannot read properties of undefined (reading 'length')
```

Ese error cortaba el flujo antes de ejecutar la carga de:

- `GET /api/internal/companies/pending`
- `GET /api/internal/services/pending`
- `GET /api/internal/uploads/pending`

Por eso la UI podia mostrar el markup del caso, pero los contadores quedaban en `0`.

## Cambios realizados

- `admin.js`
  - Agregado helper `internalSections()` para iterar solo `companies`, `services` y `uploads`.
  - Reemplazados los usos de `Object.values(state.internal)` en:
    - total del tab `Modelo nuevo`;
    - deteccion de errores despues de cargar modelo nuevo;
    - deteccion de `needsLoad` al activar el tab;
    - limpieza de estado al cerrar sesion.
  - Agregado `internalItemsFromResponse()` para normalizar respuestas internas sin quedarse silenciosamente en cero.
    - Mantiene soporte para el contrato actual `{ items: [...] }`.
    - Acepta tambien arrays directos y respuestas con llaves por tipo (`companies`, `services`, `uploads`) o `data/result`.
    - Si llega un objeto no vacio con forma no soportada, muestra error en vez de convertirlo en lista vacia.
- `admin.html`
  - Cache busting de `admin.js` actualizado de `v=13` a `v=14`.

No se modifico `admin.css`.

## Validacion

- PASS: `node --check admin.js`
  - Nota: `node --check admin.js` con el alias del entorno fallo por `Access is denied` hacia el runtime empaquetado de Codex.
  - Se valido exitosamente usando el runtime de workspace:
    `C:\Users\pj13e\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe --check admin.js`
- PASS: `git diff --check -- admin.html admin.js`
  - Solo mostro warnings esperados de conversion LF/CRLF.
- PASS: prueba local con mock HTTP del admin y endpoints internos.
  - Mock de `GET /api/admin/pending-providers`: `[]`.
  - Mock de `GET /api/internal/companies/pending`: 1 empresa pendiente.
  - Mock de `GET /api/internal/services/pending`: 2 servicios revisables.
  - Mock de `GET /api/internal/uploads/pending`: 1 upload pendiente.
  - El mock uso respuesta por llave (`companies/services/uploads`) para cubrir la normalizacion nueva.
  - Resultado en tab `Modelo nuevo`:
    - `companyCount=1`
    - `serviceCount=2`
    - `uploadCount=1`
    - `total=4 item(s) modelo nuevo`
    - `caseCards=1`
    - status: `Modelo nuevo actualizado.`
    - expediente visible con empresa, servicios e imagen relacionada.

## Notas para Product / Architect

- El bug estaba en frontend runtime, no en las reglas backend aprobadas por TASK-132.
- Requiere deploy de `admin.html` y `admin.js`; el cache busting quedo listo en `admin.js?v=14`.
- Recomendacion de QA post-deploy: repetir la prueba autenticada en Azure y confirmar que `Modelo nuevo` ya no queda en cero con pendientes reales.
