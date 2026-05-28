# TASK-079: QA/Infra Azure carrusel con cover priorizado

## Equipo asignado

QA / Infra Azure.

## Contexto

`TASK-078` aprobo localmente el ajuste de frontend para que el perfil publico use `coverUrl` real como primer slide del carrusel cuando existe.

Product/Architect debe hacer commit/push antes de que ejecutes esta tarea. Espera a que el deploy de Azure Static Web Apps termine para el commit que modifica:

- `app.js`
- `index.html`

## Archivos que debes leer

- `AGENTS.md`
- `chat-start/QA.md`
- `chat-start/INFRA_AZURE.md`
- `docs/BACKLOG.md`
- `tasks/TASK-076-HANDOFF.md`
- `tasks/TASK-077-HANDOFF.md`
- `tasks/TASK-078-HANDOFF.md`
- `index.html`
- `app.js`

## Objetivo

Validar en Azure real que el perfil publico muestra el cover real `1200 x 800` como primer slide del carrusel, preservando la galeria posterior y sin duplicados.

## URL base

```text
https://zealous-field-08fdd720f.7.azurestaticapps.net
```

Ruta principal:

```text
/index.html#proveedor/qa-company-register-test/qa-moderacion-approve-20260528113350
```

## Precondicion

Confirmar que el sitio desplegado usa el `app.js` actualizado, por ejemplo revisando el cache-bust de `index.html` o el comportamiento nuevo del carrusel.

## Alcance de pruebas

Validar perfil:

- Perfil carga desde API.
- Servicio seleccionado visible.
- Primer slide del carrusel usa el cover real publicado en TASK-076:
  - `upload_9f0c80f0-b98e-4638-8be5-a3f74efc7a19.png`
  - dimensiones naturales `1200 x 800`, si el navegador lo permite.
- La galeria vieja `1 x 1` queda despues del cover, no como primer slide.
- No hay URLs duplicadas en miniaturas.
- Contador inicial refleja la cantidad real, por ejemplo `1 / 2` si cover + gallery.
- Boton siguiente cambia a la imagen posterior.
- Click en primera miniatura vuelve al cover.

Validar regresion:

- `#inicio` sigue mostrando servicios y cover real.
- `#bodas` sigue mostrando servicios y cover real.
- Filtros sin coincidencias siguen mostrando estado vacio.

Validar responsive:

- Desktop.
- Mobile 390 x 844 o similar.
- Sin overflow horizontal.
- Carrusel visible dentro del contenedor.

Validar consola/seguridad:

- Sin errores JS no controlados.
- No se exponen secretos ni campos internos en UI.

## Fuera de alcance

- No cambiar codigo.
- No subir imagenes nuevas.
- No limpiar datos QA.
- No probar login/panel empresa.
- No rotar credenciales admin.

## Entregable

Crear:

```text
tasks/TASK-079-HANDOFF.md
```

Debe incluir:

- Resultado general: aprobado / aprobado con observaciones / bloqueado.
- URL Azure usada.
- Commit/deploy validado si lo tienes visible.
- Casos probados.
- Evidencia visual resumida o screenshots si el entorno lo permite.
- Hallazgos.
- Riesgos restantes.
- Recomendacion:
  - listo para demo controlada, o
  - requiere ajuste Web Dev.

## Nota para coordinacion

Al terminar, avisar en el chat de Product/Architect:

```text
Termine TASK-079. Product/Architect debe leer tasks/TASK-079-HANDOFF.md.
```
