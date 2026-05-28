# TASK-077: Web Dev priorizar cover real en carrusel de perfil

## Equipo asignado

Frontend / Web Dev.

## Contexto

`TASK-076` publico correctamente una imagen real de cover para el servicio QA principal:

```text
companySlug: qa-company-register-test
serviceSlug: qa-moderacion-approve-20260528113350
cover: 1200 x 800
```

La imagen real ya se ve en home y listado. El pendiente es el perfil:

```text
#proveedor/qa-company-register-test/qa-moderacion-approve-20260528113350
```

El carrusel sigue usando la galeria previa de `1 x 1`, porque el frontend prioriza `gallery` cuando existe.

## Archivos que debes leer

- `AGENTS.md`
- `chat-start/WEB_DEV.md`
- `docs/BACKLOG.md`
- `tasks/TASK-072-HANDOFF.md`
- `tasks/TASK-076-HANDOFF.md`
- `index.html`
- `app.js`
- `styles.css`

## Objetivo

Ajustar el perfil publico para que el `coverUrl` del servicio seleccionado aparezca como primer slide del carrusel cuando exista, aunque tambien exista `gallery`.

## Alcance

1. En el perfil API real, construir la galeria visual del servicio seleccionado con:
   - `coverUrl` como primer item si existe;
   - luego los items de `gallery`;
   - evitar duplicar la misma URL si `coverUrl` tambien esta en `gallery`.
2. Mantener fallback demo sin romperse.
3. Mantener carrusel, thumbs y contador funcionando.
4. No cambiar contratos API.
5. No ocultar la galeria existente; solo priorizar cover real como primer visual.

## Criterios de aceptacion

- En perfil API real con `coverUrl`, el primer slide usa el cover.
- Si `gallery` existe, queda despues del cover.
- Si `coverUrl` no existe, el comportamiento actual con `gallery` sigue funcionando.
- No hay imagenes duplicadas en miniaturas cuando cover y gallery comparten URL.
- Home y listado siguen mostrando cover.
- `node --check app.js` pasa.
- No hay errores JS no controlados.

## Fuera de alcance

- No subir nuevas imagenes.
- No cambiar backend/API.
- No hacer deploy.
- No tocar admin/panel empresa.
- No limpiar datos QA.

## Verificacion minima

Validar localmente con fallback y, si es posible, con API real/Azure:

- `#inicio`
- `#bodas`
- `#proveedor/qa-company-register-test/qa-moderacion-approve-20260528113350`
- Carrusel primer slide.
- Thumbs/counter.
- Mobile basico.

## Entregable

Crear:

```text
tasks/TASK-077-HANDOFF.md
```

Debe incluir:

- Resultado general.
- Archivos modificados.
- Logica aplicada para deduplicar cover/gallery.
- Casos probados.
- Riesgos restantes.
- Recomendacion:
  - listo para QA local, o
  - requiere ajuste adicional.

## Nota para coordinacion

Al terminar, avisar en el chat de Product/Architect:

```text
Termine TASK-077. Product/Architect debe leer tasks/TASK-077-HANDOFF.md.
```
