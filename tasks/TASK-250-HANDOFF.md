# TASK-250 HANDOFF

## Resumen

Se corrigieron CTAs publicos sin servicio seleccionado para que no puedan iniciar una solicitud real sin `companyId + serviceId`.

- CTAs globales de home/listados/fallback ahora llevan al listado de servicios con `data-results-link`.
- Paquetes y fichas de referencia sin contexto ahora orientan a `Elegir servicio`.
- El drawer de solicitud mantiene una defensa: si un disparador sin `companyId` y `serviceId` intenta abrirlo, oculta el formulario y muestra orientacion para elegir un servicio publicado.
- CTAs con contexto de servicio API mantienen el flujo normal y abren el formulario.

## Archivos tocados

- `app.js`

## CTAs revisados

- Home: CTA de servicios destacados.
- Pagina `#bodas`: hero y header de resultados.
- Cards legacy/de referencia: `providerCard`, `wideProviderCard`, `packageCard`.
- Perfil de referencia/fallback.
- Drawer de solicitud.
- Cards de servicio API: se conserva `data-open-quote` con atributos `data-company-id` y `data-service-id`.

## Verificacion

- `node --check app.js`
- `git diff --check -- index.html app.js admin.html admin.js`
- Playwright smoke local con API simulada:
  - CTA global `data-results-link` navega a `#bodas`.
  - `drawerOpenAfterGlobal: 0`.
  - CTA de servicio con `companyId + serviceId` abre formulario: `formVisibleWithContext: 1`.
  - Mobile `#bodas` mantiene resultados: `mobileHasResults: 1`.

## Riesgos

- Si la API publica devuelve un servicio sin `company.id` o sin `service.id`, el CTA de formulario mostrara orientacion en vez de permitir solicitud. Esto es intencional para proteger leads reales.
- El endpoint `/api/public/leads` no se cambio; solo se ajusto la entrada frontend.

## Pendientes

- QA debe validar en Azure con un servicio publicado real que el payload de lead contiene `companyId` y `serviceId`.

## Siguiente recomendacion

Probar manualmente tres caminos en Azure: CTA global desde home, CTA en card de servicio publicado y CTA desde perfil de empresa con servicio seleccionado.
