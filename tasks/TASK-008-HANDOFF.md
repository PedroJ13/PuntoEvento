# TASK-008: Agregar modo demo local para panel empresa

## Equipo

Web Dev.

## Estado

Completada.

## Resumen

Se agrego un modo demo local en `admin.html` para que Product/QA puedan navegar `Empresa demo` y `Servicios` sin depender de credenciales reales ni API Azure.

El modo demo se puede abrir de dos formas:

- Boton `Ver modo demo local` en la pantalla de login.
- Query param `admin.html?demo=local`.

En este modo la revision interna queda bloqueada con el mensaje:

```text
La revision interna requiere login admin real.
```

## Objetivo

Permitir validar visual y funcionalmente el panel demo de empresa/servicios en local, manteniendo separado el flujo real de revision interna y sin tocar la pagina publica ni endpoints.

## Archivos tocados

- `admin.html`
- `admin.js`
- `admin.css`
- `tasks/TASK-008-HANDOFF.md`

## Cambios realizados

- Se agrego CTA `Ver modo demo local` en el login.
- Se agrego soporte para `?demo=local`.
- Se agrego indicador visual `Modo demo local`.
- Se oculto/bloqueo la lista de proveedores pendientes en modo demo.
- Se mantiene accesible `Empresa demo`.
- Se mantiene accesible `Servicios`.
- Crear/editar servicios demo sigue funcionando con `localStorage`.
- El boton `Actualizar` queda deshabilitado en modo demo para evitar llamadas de revision.
- Las acciones de aprobar/rechazar retornan mensaje de bloqueo si se intenta usarlas en modo demo.
- Se actualizaron versiones cache-bust de `admin.css` y `admin.js` en `admin.html`.

## Verificacion

- Se leyeron los documentos obligatorios de `tasks/TASK-008-assignment.md`.
- Se confirmo que el alcance permitido era solo:
  - `admin.html`
  - `admin.js`
  - `admin.css`
  - `tasks/TASK-008-HANDOFF.md`
- Se verifico `http://127.0.0.1:4173/admin.html?demo=local` con respuesta HTTP `200`.
- Se valido en navegador que:
  - el login no queda visible en modo demo,
  - el panel admin queda visible,
  - el banner `Modo demo local` aparece,
  - `Empresa demo` abre como seccion activa,
  - la revision interna muestra bloqueo,
  - la lista real de proveedores queda oculta,
  - los servicios demo aparecen en DOM.
- Se creo un servicio demo desde la UI y se refresco la pagina.
- Se confirmo que el servicio creado siguio apareciendo despues del refresh, validando persistencia con `localStorage`.
- Se reviso consola del navegador: sin errores/warnings capturados.
- Se valido parseo de `admin.js`.
- Se reviso `git status --short` enfocado en archivos permitidos.

## Riesgos

- El modo demo local vive temporalmente dentro de `admin.html`, aunque la arquitectura objetivo separa `/admin/*` y `/panel/*`.
- `localStorage` no representa seguridad, permisos ni persistencia real; es solo demo.
- La revision interna real sigue dependiendo de API Azure y credenciales reales.
- Product/QA pueden ver servicios demo sin login, por diseno; no debe usarse para datos reales.
- Hay cambios previos/untracked en `docs/` y `tasks/` fuera de esta tarea; no se tocaron aqui.

## Pendientes

- QA debe validar manualmente el flujo completo:
  - abrir `admin.html` sin sesion,
  - entrar por CTA demo,
  - entrar por `?demo=local`,
  - confirmar bloqueo de `Revision`,
  - crear servicio,
  - editar servicio,
  - refrescar y confirmar persistencia,
  - revisar responsive.
- Product/Architect debe decidir cuando separar el panel empresa a `/panel/*`.
- Backend/API debe definir endpoints reales para empresas y servicios.
- Definir limpieza/reset de datos demo si QA necesita escenarios repetibles.

## Recomendacion para Product/Architect

Usar este modo demo local para validacion temprana de UX y QA, pero mantenerlo marcado como herramienta temporal.

La recomendacion sigue siendo separar responsabilidades antes del MVP real:

- `/admin/*`: revision interna, aprobacion y moderacion.
- `/panel/*`: empresa proveedora, perfil, servicios, fotos y planes.

Cuando esa separacion este aprobada, Web Dev deberia mover esta experiencia demo al panel empresa y Backend/API deberia preparar el contrato real de CRUD de servicios.
