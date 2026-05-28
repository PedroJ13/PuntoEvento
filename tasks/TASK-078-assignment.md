# TASK-078: QA local carrusel con cover priorizado

## Equipo asignado

QA.

## Contexto

Web Dev completo `TASK-077` ajustando el perfil publico para que el carrusel use `coverUrl` real como primer slide cuando exista.

Antes del cambio, el servicio QA principal tenia:

- `coverUrl` real de `1200 x 800`, visible en home/listado.
- `gallery` antigua de `1 x 1`, visible en el carrusel del perfil.

El objetivo es que el perfil tambien use el cover real primero.

No se debe hacer commit/push/deploy de este bloque hasta pasar QA local.

## Archivos que debes leer

- `AGENTS.md`
- `chat-start/QA.md`
- `docs/BACKLOG.md`
- `tasks/TASK-076-HANDOFF.md`
- `tasks/TASK-077-HANDOFF.md`
- `index.html`
- `app.js`
- `styles.css`

## Objetivo

Validar localmente que el carrusel del perfil prioriza `coverUrl` como primer slide y conserva la galeria sin duplicados.

## Alcance de pruebas

Validar estructura:

- `node --check app.js`.
- Carga de pagina sin errores JS no controlados.

Validar con datos API reales si el entorno local lo permite; si no, usar mocks/validacion estructural y documentarlo:

- `#inicio` sigue mostrando servicios.
- `#bodas` sigue mostrando servicios.
- `#proveedor/qa-company-register-test/qa-moderacion-approve-20260528113350`:
  - perfil carga;
  - primer slide del carrusel es el `coverUrl`;
  - si existe `gallery`, aparece despues del cover;
  - no hay URLs duplicadas en thumbs;
  - contador del carrusel coincide con la cantidad de imagenes;
  - thumbs/click de carrusel siguen funcionando.

Validar fallback:

- Servicio sin `coverUrl` pero con `gallery` conserva la galeria como primer visual.
- Servicio sin cover ni galeria usa fallback sin romper.

Validar responsive:

- Desktop.
- Mobile estrecho.
- Sin overflow horizontal.
- Imagen/carrusel no se deforma de manera obvia.

## Criterios de aceptacion

- `coverUrl` real aparece como primer slide cuando existe.
- `gallery` queda despues del cover.
- No hay duplicados por misma URL.
- Home/listado no regresa.
- Carrusel, thumbs y contador funcionan.
- No hay errores JS no controlados.

## Fuera de alcance

- No hacer deploy.
- No modificar codigo salvo que encuentres bug bloqueante y lo documentes.
- No subir nuevas imagenes.
- No cambiar backend/API.
- No limpiar datos QA.

## Entregable

Crear:

```text
tasks/TASK-078-HANDOFF.md
```

Debe incluir:

- Resultado general: aprobado / aprobado con observaciones / bloqueado.
- URL local/navegador usado.
- Datos usados: API real, fallback o mocks.
- Casos probados.
- Evidencia visual resumida o screenshots si el entorno lo permite.
- Hallazgos con archivo/seccion si aplica.
- Riesgos restantes.
- Recomendacion:
  - listo para commit/push, o
  - requiere ajuste Web Dev antes de commit.

## Nota para coordinacion

Al terminar, avisar en el chat de Product/Architect:

```text
Termine TASK-078. Product/Architect debe leer tasks/TASK-078-HANDOFF.md.
```
