# TASK-244: Web Dev - mensaje inline para credenciales admin invalidas

## Equipo asignado

Web Dev.

## Contexto

Product reporta que al fallar credenciales de `admin.html` aparece un prompt nativo del navegador. El comportamiento deseado es mostrar un mensaje controlado dentro de la pagina, por ejemplo `Credenciales invalidas`, sin dialogo nativo.

`TASK-243` revisa la parte Backend/API. Esta tarea cubre la experiencia en `admin.html` / `admin.js`.

## Tarea

Ajustar el login admin para manejar credenciales invalidas con mensaje inline y sin disparar prompt nativo del navegador.

## Alcance

1. Leer `tasks/TASK-243-HANDOFF.md` si existe; si aun no existe, revisar el flujo actual y documentar dependencia.
2. Revisar `admin.html`, `admin.js` y `admin.css`.
3. Asegurar que el frontend:
   - no use `Authorization: Basic` si eso dispara prompt;
   - use el header/custom mechanism esperado por backend;
   - capture `401/403` y muestre mensaje inline claro;
   - no deje la UI en estado `Validando credenciales` indefinidamente.
4. Mensaje sugerido:
   - `Credenciales invalidas. Verifica usuario y password.`
5. Mantener modo demo local.
6. Actualizar cache busting de `admin.js` / `admin.css` / `admin.html` si corresponde.

## No tocar

- No cambiar credenciales reales.
- No rotar secretos.
- No cambiar backend/API en esta tarea.
- No cambiar pagina publica.
- No cambiar panel empresa.
- No cambiar permisos ni moderacion.

## Verificacion

- Credenciales invalidas muestran mensaje inline.
- No aparece prompt nativo del navegador.
- Credenciales validas siguen entrando al admin.
- Modo demo local sigue funcionando.
- Mobile/desktop sin overflow.
- `node --check admin.js` OK si se toca JS.
- `git diff --check -- admin.html admin.css admin.js` OK.

## Handoff esperado

Crear `tasks/TASK-244-HANDOFF.md` con:

- Resumen de cambios.
- Archivos tocados.
- Versiones/cache busting.
- Evidencia de error inline.
- Confirmacion de que no aparece prompt nativo localmente.
- Riesgos.
- Recomendacion para QA `TASK-245`.
