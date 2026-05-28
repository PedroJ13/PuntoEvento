# TASK-077 Handoff

## Resultado general

Se ajusto el perfil publico para que el carrusel use el `coverUrl` real del servicio seleccionado como primer slide cuando exista, incluso si el servicio tambien trae `gallery`.

El comportamiento anterior se mantiene cuando no hay cover real: la galeria existente sigue siendo la fuente visual principal. No se cambiaron contratos API ni backend.

## Archivos modificados

- `app.js`
- `index.html`
- `tasks/TASK-077-HANDOFF.md`

## Logica aplicada para deduplicar cover/gallery

Se agrego un helper `serviceVisualGallery(service, fallbackImage, fallbackAlt)`:

- Agrega `service.coverUrl` como primer item solo cuando el servicio tiene cover real.
- Luego agrega los items de `service.gallery`.
- Deduplica por URL normalizada con `new URL(src, window.location.href).href`.
- Si no hay cover ni galeria util, cae al fallback visual existente.

Tambien se agrego la marca interna `hasServiceCoverUrl` al normalizar servicios para evitar que `assets/images/fallback-provider.svg` se trate como cover real.

## Casos probados

Validacion de sintaxis:

```powershell
C:\Users\pj13e\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe --check app.js
```

Resultado: OK.

Validacion estructural con runtime Node y mock de DOM/API:

- Servicio con `coverUrl` y `gallery`: el primer item del carrusel es el cover, el segundo es la galeria.
- Servicio con `coverUrl` duplicado tambien dentro de `gallery`: el cover aparece una sola vez.
- Servicio sin `coverUrl` y con `gallery`: el primer item sigue siendo la galeria, sin meter fallback antes.

Tambien se actualizo el cache-bust de `index.html`:

```text
app.js?v=18
```

## Riesgos restantes

- No se hizo deploy en esta tarea.
- La validacion fue estructural con mocks; QA visual en Azure debe confirmar que el servicio `qa-moderacion-approve-20260528113350` muestra la imagen 1200 x 800 como primer slide.
- Si la API publica envia URLs equivalentes con diferencias de query string, se consideran distintas. Hoy eso es preferible porque pueden representar variantes reales.

## Recomendacion

Listo para QA local/Azure enfocada en:

- `#inicio`
- `#bodas`
- `#proveedor/qa-company-register-test/qa-moderacion-approve-20260528113350`
- Primer slide, thumbs y contador del carrusel.
