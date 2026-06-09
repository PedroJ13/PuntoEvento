# TASK-260 HANDOFF

## Resumen

Se corrigió el P1 reportado por QA: en host productivo/no-local, cuando falla `/api/public/services`, ya no se renderizan paquetes ni proveedores estáticos de referencia debajo del estado controlado.

## Causa del P1

`TASK-252` dejó `services = []` y `serviceDataSource = "error"` en falla productiva, pero algunas secciones seguían renderizando datos estáticos desde `packages`/`providers`:

- Banda de paquetes en home.
- Banda `Paquetes de boda` en resultados.
- Fallback de perfil hacia `providerDemoPage()` cuando no había API.

Eso hacía que nombres como `Casa Arboleda Eventos`, `Bocados y Copas`, `Luz Viva Producciones`, `Flor de Abril`, `Captura Dorada` y `Nexo Corporativo` siguieran visibles.

## Cambio aplicado

- Se agregó `shouldShowReferenceCatalog()`:
  - permite referencia si el estado no es `error`;
  - permite referencia en local o `?demo=local`;
  - bloquea referencia en productivo con `serviceDataSource === "error"`.
- Se movieron las bandas estáticas a helpers condicionados:
  - `packageBandMarkup()`
  - `weddingPackagesMarkup()`
- `providerPage()` ahora muestra estado controlado en productivo/error y no cae a `providerDemoPage()`.
- Cache busting actualizado a `app.js?v=31`.

## Archivos tocados

- `app.js`
- `index.html`

## Verificación

- `node --check app.js`
- `git diff --check -- app.js index.html`
- Playwright smoke con host productivo simulado `punto-evento.test` y `/api/public/services` forzado a `500`:
  - `prodControlledMessage: true`
  - `prodReferenceNames: []`
  - `prodNoPackageHeading: true`
  - `prodProfileControlled: true`
  - `prodProfileReferenceNames: []`
- No regresión:
  - local con API fallida conserva referencia: `localKeepsReference: true`
  - API OK en host productivo muestra servicio real: `apiOkShowsReal: true`

## Riesgos

- En producción con API caída, el usuario verá menos contenido comercial por diseño. Es preferible a mostrar catálogo de referencia como si fuera operativo.
- Si Product quiere mostrar contenido editorial no-catalogable en error, conviene crear una tarea separada con copy/UX específico.

## Pendientes

- QA debe repetir el caso en Azure o ambiente equivalente con `/api/public/services` fallando.
- Verificar que Azure sirve `app.js?v=31` después del deploy.

## Siguiente recomendación

Después del deploy, probar `#bodas`, `#inicio` y una ruta `#proveedor/...` con API pública fallida para confirmar que solo aparece el estado controlado y no referencias.
