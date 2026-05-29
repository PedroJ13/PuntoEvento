# TASK-105: Remover `sig=` del DOM legacy de admin

## Equipo asignado

Web Dev.

## Contexto

`TASK-104` valido en Azure que `admin.html` ya funciona con `admin.js?v=11`:

- login admin real: PASS;
- `Revision` legacy carga: PASS;
- `Modelo nuevo` carga Companies, Services y Uploads: PASS;
- approve real desde UI de una Company QA: PASS;
- approve real desde UI de un Service QA: PASS;
- approve real desde UI de un Upload QA: PASS;
- responsive mobile/desktop: PASS.

El unico bloqueo restante es seguridad:

```text
sig=
```

aparece en el HTML/DOM renderizado del admin autenticado, dentro de `img src` de la pestana legacy `Revision`.

No aparece en las tarjetas del modelo nuevo, pero la tarea prohibe `sig=` en el DOM renderizado del admin.

## Archivos que debes leer

- `AGENTS.md`
- `chat-start/WEB_DEV.md`
- `docs/MVP_RELEASE_STATUS.md`
- `docs/API_CONTRACTS_MVP.md`
- `tasks/TASK-104-HANDOFF.md`
- `admin.html`
- `admin.js`
- `admin.css`
- `api/admin-pending-providers/index.js`

## Objetivo

Eliminar cualquier `sig=` del DOM de `admin.html`, especialmente en la vista legacy `Revision`, sin romper la moderacion del modelo nuevo.

## Alcance recomendado

Implementar la solucion mas pequena y segura:

1. En la vista legacy `Revision`, no renderizar `image.previewUrl` dentro de un `<img src="...">` si puede contener SAS.
2. Reemplazar el preview visual por un placeholder seguro con metadatos permitidos:
   - tipo de imagen;
   - nombre original saneado si existe;
   - estado;
   - checkbox de aprobacion existente.
3. Mantener `data-image-id` y el flujo de approve/reject legacy si aun se usa.
4. Asegurar que no se rendericen en DOM:
   - `pendingBlobUrl`;
   - `uploadUrl`;
   - URLs con `sig=`.
5. Mantener intacta la pestana `Modelo nuevo`.
6. Subir cache busting de `admin.js` en `admin.html`:

```text
admin.js?v=12
```

## Alternativa aceptable

Si prefieres resolverlo en Backend/API, puedes hacer que el endpoint legacy no retorne `previewUrl` con SAS. Pero para esta tarea, el fix frontend es suficiente si el DOM queda limpio y no se rompen las acciones.

## Fuera de alcance

- Rotar credenciales.
- Cambiar auth.
- Cambiar endpoints del modelo nuevo.
- Crear preview seguro de uploads del modelo nuevo.
- Cambiar pagina publica o panel empresa.
- Hacer commit/push.

## Verificacion local esperada

- `node --check admin.js`.
- `rg -n "sig=|pendingBlobUrl|uploadUrl" admin.js admin.html` y confirmar que no se renderiza en templates HTML.
- Confirmar que `admin.html` apunta a `admin.js?v=12`.
- Con mock/harness si existe:
  - proveedor legacy con `previewUrl` que contiene `?sig=test`;
  - render de `Revision`;
  - `document.body.innerHTML` no contiene `sig=`;
  - checkbox legacy conserva `data-image-id`;
  - `Modelo nuevo` sigue renderizando.

## Entregable

Crear:

```text
tasks/TASK-105-HANDOFF.md
```

Debe incluir:

- Resultado general.
- Archivos modificados.
- Que se cambio en legacy `Revision`.
- Version de cache busting aplicada.
- Verificacion ejecutada.
- Confirmacion de que `sig=` no queda en DOM/render.
- Riesgos pendientes.
- Recomendacion para Product/Architect: commit/push y reintento QA Azure.

## Aviso al terminar

Cuando termines, avisa en el chat Product/Architect:

```text
Termine TASK-105. Product/Architect debe leer tasks/TASK-105-HANDOFF.md.
```
