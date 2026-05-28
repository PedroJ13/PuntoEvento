# TASK-078 Handoff - QA local carrusel con cover priorizado

## Objetivo

Validar localmente que el perfil publico de empresa prioriza `coverUrl` como primera imagen del carrusel cuando existe, conserva las imagenes de galeria despues del cover y evita duplicados.

## Resultado

PASS local. No encontre bloqueadores para continuar con revision de Product/Architect.

No cambie codigo de la app. Solo se creo este handoff.

## URL y navegador

- Navegador: Codex in-app browser.
- Servidor local QA: `http://127.0.0.1:4178/index.html`.
- Ruta principal validada: `#proveedor/qa-company-register-test/qa-moderacion-approve-20260528113350`.

## Fuente de datos

Use un mock API local controlado, servido desde memoria, para responder:

- `/api/public/services`
- `/api/public/companies/qa-company-register-test?service=...`

El mock incluyo el cover real de TASK-076:

`https://storagepuntoevento.blob.core.windows.net/public/companies/company_c0f05305-6b1d-4ba0-b4c2-cd987c324bd2/services/service_57b80edc-9bb4-43f8-b957-7ffa8959b934/cover/upload_9f0c80f0-b98e-4638-8be5-a3f74efc7a19.png`

Tambien incluyo una galeria con el mismo cover duplicado y la imagen vieja 1x1 para validar dedupe:

`https://storagepuntoevento.blob.core.windows.net/public/companies/company_c0f05305-6b1d-4ba0-b4c2-cd987c324bd2/services/service_57b80edc-9bb4-43f8-b957-7ffa8959b934/gallery/upload_470f509b-5929-41d1-a1d2-c37efff9ee9b.png`

## Verificacion

- `node --check app.js`: PASS.
- Carga de pagina sin errores JS no controlados: PASS, logs del navegador vacios.
- `#inicio`: PASS, renderizo 3 tarjetas `.provider-card`, sin overflow horizontal.
- `#bodas`: PASS, renderizo 3 resultados `.wide-card` y 6 `.package-card`, sin overflow horizontal.
- Perfil con cover real: PASS.
  - Primera imagen del carrusel: cover real 1200x800.
  - Contador inicial: `1 / 2`.
  - Miniaturas: 2.
  - URLs unicas en miniaturas: 2.
  - La galeria vieja queda despues del cover.
- Click en siguiente: PASS.
  - Cambia a imagen vieja 1x1.
  - Contador cambia a `2 / 2`.
  - Miniatura activa cambia a indice 1.
- Click en primera miniatura: PASS.
  - Vuelve al cover real 1200x800.
  - Contador vuelve a `1 / 2`.
  - Miniatura activa vuelve a indice 0.
- Servicio sin cover pero con galeria: PASS.
  - Primera imagen: galeria disponible.
  - Contador: `1 / 1`.
  - Sin duplicados.
- Servicio sin cover ni galeria: PASS.
  - Usa `assets/images/fallback-provider.svg`.
  - Contador: `1 / 1`.
  - Sin duplicados.
- Responsive mobile 390x844: PASS.
  - Cover real primero.
  - Contador `1 / 2`.
  - Sin overflow horizontal (`clientWidth=375`, `scrollWidth=375`).
  - Imagen visible dentro del viewport.

## Evidencia

Lecturas DOM principales:

- Desktop perfil principal: `stageSrc` fue el cover real, `naturalWidth=1200`, `naturalHeight=800`, `thumbCount=2`, `uniqueThumbCount=2`, `count=1 / 2`.
- Despues de siguiente: `stageSrc` fue la imagen vieja de galeria, `naturalWidth=1`, `naturalHeight=1`, `count=2 / 2`.
- Despues de miniatura 0: `stageSrc` volvio al cover real, `naturalWidth=1200`, `naturalHeight=800`, `count=1 / 2`.
- Mobile: `stageSrc` fue el cover real, `thumbCount=2`, `uniqueThumbCount=2`, `horizontalOverflow=false`.

## Archivos tocados

- `tasks/TASK-078-HANDOFF.md`

## Riesgos

- No valide contra Azure live porque la QA local necesitaba controlar respuestas de `/api/public/...` sin modificar codigo ni depender de red/API remota.
- El resultado confirma el comportamiento de frontend con contratos API equivalentes; falta una pasada smoke contra ambiente publicado/staging despues de deploy.
- Si Azure devuelve `gallery` con formatos distintos al mock probado, podria requerir otra validacion de normalizacion.

## Pendientes

- Product/Architect puede marcar TASK-078 como completada en backlog si acepta QA local.
- Antes de release publico, hacer smoke real contra Static Web Apps/Azure Functions con la empresa QA publicada.

## Recomendacion para Product/Architect

Aprobar el cambio de TASK-077 para avanzar a commit/deploy controlado. La correccion cumple el objetivo: cover real primero, galeria preservada, sin duplicados, fallback estable y sin regresion visible en `#inicio` ni `#bodas`.
