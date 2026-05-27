# TASK-006: Implementar pestana demo Servicios en admin

## Equipo

Web Dev.

## Estado

Completada.

## Objetivo

Implementar una primera pantalla demo de `Servicios` dentro del admin actual para representar una empresa con multiples servicios, usando datos locales y `localStorage`, sin tocar la pagina publica ni crear endpoints nuevos.

## Cambios realizados

- Se agrego navegacion por secciones dentro del admin:
  - `Revision`
  - `Empresa demo`
  - `Servicios`
- Se mantuvo la seccion `Revision` como contenedor del flujo actual de proveedores pendientes.
- Se agrego una seccion `Empresa demo` con datos resumidos de empresa y mensaje claro de que no modifica Azure.
- Se agrego una seccion `Servicios` con servicios demo iniciales:
  - Queques personalizados.
  - Wedding planner.
  - Mesa dulce.
- Se implemento render de tarjetas de servicio con:
  - nombre,
  - categoria,
  - tipos de evento,
  - precio desde,
  - estado,
  - cantidad de fotos,
  - ultima actualizacion.
- Se agrego boton `Agregar servicio`.
- Se implemento formulario para crear y editar servicios demo.
- Se guardan servicios demo en `localStorage` usando la llave `puntoEventoDemoServices`.
- Se actualizaron versiones de cache de `admin.css` y `admin.js` en `admin.html`.

## Archivos tocados

- `admin.html`
- `admin.js`
- `admin.css`
- `tasks/TASK-006-HANDOFF.md`

## Verificacion

- Se leyeron los documentos obligatorios indicados en `tasks/TASK-006-assignment.md`.
- Se confirmo que el alcance permitido era solo admin y handoff.
- Se levanto/verifico `http://127.0.0.1:4173/admin.html` con respuesta HTTP `200`.
- Se valido parseo de `admin.js` con `new Function(code)` desde el runtime Node REPL.
- Se intento `node --check admin.js`, pero Windows devolvio `Access is denied` para `node.exe`.
- Se reviso el diff de `admin.html`, `admin.js` y `admin.css`.
- Se confirmo que no se tocaron `index.html`, `app.js` ni `styles.css`.
- Se corrio `git status --short` para revisar el estado de archivos.

## Riesgos

- La demo de servicios vive dentro de `admin.html`, aunque la arquitectura objetivo separa Admin interno y Panel empresa.
- La persistencia en `localStorage` es solo demo y no debe interpretarse como backend real.
- El flujo de revision interna sigue dependiendo de credenciales/API actuales.
- La prueba visual completa en navegador no se pudo automatizar con Playwright porque el paquete no esta disponible en el runtime.
- El repo ya tenia cambios/untracked previos en `docs/` y `tasks/`; no se modificaron como parte de esta tarea.

## Pendientes

- QA debe validar manualmente:
  - login admin,
  - seccion `Revision`,
  - seccion `Servicios`,
  - crear servicio,
  - editar servicio,
  - refrescar y confirmar persistencia en `localStorage`,
  - consola sin errores.
- Product/Architect debe confirmar si el panel empresa se mantendra temporalmente dentro de `admin.html` o si se separara en `/panel/*`.
- Backend/API debe definir contrato real para CRUD de servicios.
- Infra/Backend deben definir si las imagenes pertenecen a empresa, servicio o ambos.

## Recomendacion para Product/Architect

Mantener esta implementacion como demo acotada y usarla para validar el modelo Empresa -> Servicios con el equipo.

La siguiente decision importante es separar rutas y permisos:

- `/admin/*` para revision interna.
- `/panel/*` para empresas proveedoras.

Cuando esa decision quede cerrada, Web Dev puede mover esta experiencia demo hacia el panel empresa real y Backend/API puede preparar los endpoints de servicios.
