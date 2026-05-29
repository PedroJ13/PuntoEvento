# TASK-105 Handoff

## Resultado general

Completado.

La vista legacy `Revision` de `admin.html` ya no renderiza `image.previewUrl` dentro de `<img src>`, por lo que no debe quedar `sig=` en el DOM renderizado por esos previews SAS.

## Archivos modificados

- `admin.js`
- `admin.html`
- `admin.css`

No se modifico backend, pagina publica ni panel empresa.

## Cambio en legacy `Revision`

Antes, `imageMarkup(provider)` renderizaba:

```text
<img src="{image.previewUrl}">
```

Ese `previewUrl` podia contener SAS con `sig=`.

Ahora renderiza un placeholder seguro:

```text
tipo de imagen
nombre original saneado
estado
checkbox de aprobacion
```

Se conserva:

- `data-image-id`;
- checkbox de aprobacion;
- flujo legacy approve/reject.

No se renderiza:

- `previewUrl`;
- `pendingBlobUrl`;
- URLs Blob con SAS;
- `sig=`.

## Cache busting

Actualizado en `admin.html`:

```text
admin.js?v=12
```

## Verificacion ejecutada

- `node --check admin.js`: OK.
- `git diff --check -- admin.html admin.css admin.js`: OK.
- `rg -n 'sig=|pendingBlobUrl|uploadUrl' admin.js admin.html`: sin resultados.
- `rg -n 'image\.previewUrl|admin\.js\?v=12|<img' admin.js admin.html`:
  - confirma `admin.js?v=12`;
  - el unico `<img>` restante es el preview local del formulario demo de servicios, no la vista legacy `Revision`.
- Harness local con VM/mock:
  - provider legacy con `previewUrl=https://...?...sig=test`;
  - provider legacy con `pendingBlobUrl=https://...?...sig=secret`;
  - `imageMarkup()` no renderiza `sig=`;
  - `data-image-id` se conserva;
  - `admin-image-placeholder` aparece;
  - render del modelo nuevo sigue funcionando.

## Confirmacion de `sig=`

Con el cambio frontend, `sig=` no queda en el HTML generado por la vista legacy `Revision`.

Tambien se evita renderizar `pendingBlobUrl` y `uploadUrl` en `admin.html`/`admin.js`.

## Riesgos pendientes

- El endpoint legacy `admin-pending-providers` todavia puede devolver `previewUrl` con SAS en JSON, pero la UI ya no lo pone en DOM.
- Si Product quiere preview visual seguro para legacy o modelo nuevo, debe hacerse con un endpoint interno autenticado que no exponga SAS.
- Falta deploy para que Azure sirva `admin.js?v=12`.

## Recomendacion para Product/Architect

Hacer commit/push y repetir QA Azure de `admin.html`:

- login admin real;
- `Revision` legacy sin `sig=` en DOM;
- `Modelo nuevo` sigue cargando;
- acciones approve/reject siguen funcionando;
- responsive mobile/desktop;
- escaneo de campos prohibidos en DOM/consola.
