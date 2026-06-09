# TASK-243: Backend API - evitar prompt nativo del navegador en credenciales admin invalidas

## Equipo asignado

Backend API.

## Contexto

Product reporta que cuando fallan las credenciales de `admin.html`, el navegador muestra un dialogo nativo de `Sign in`. Esto no debe pasar. El usuario debe ver un mensaje controlado dentro de la UI, por ejemplo `Credenciales invalidas`.

La causa probable es que alguna respuesta `401` de endpoints internos/admin incluya `WWW-Authenticate` o use un mecanismo compatible con Basic Auth que el navegador interpreta.

## Tarea

Revisar y ajustar las respuestas de autenticacion interna/admin para que credenciales invalidas no disparen prompt nativo del navegador.

## Alcance

1. Revisar endpoints internos usados por `admin.html`.
2. Confirmar si alguna respuesta `401` incluye `WWW-Authenticate`.
3. Para credenciales invalidas:
   - responder JSON o texto controlado;
   - no incluir `WWW-Authenticate`;
   - mantener status semantico apropiado (`401` o `403`) sin prompt nativo.
4. Mantener uso de `X-Punto-Admin-Credential` o mecanismo actual recomendado.
5. No exponer secretos ni detalles de autenticacion.
6. Documentar si Web Dev tambien debe ajustar `admin.js`.

## No tocar

- No cambiar `ADMIN_PASSWORD`.
- No rotar secretos.
- No cambiar permisos reales.
- No cambiar rutas publicas.
- No cambiar panel empresa.
- No cambiar UI excepto si existe helper compartido minimo imprescindible.

## Verificacion

- Respuesta con credencial invalida no incluye `WWW-Authenticate`.
- Respuesta no imprime secretos.
- Credencial valida sigue funcionando.
- Endpoints internos mantienen proteccion.
- `git diff --check -- api` OK.
- Checks de sintaxis/pruebas disponibles para archivos tocados OK.

## Handoff esperado

Crear `tasks/TASK-243-HANDOFF.md` con:

- Endpoints revisados.
- Cambios aplicados.
- Confirmacion de ausencia de `WWW-Authenticate`.
- Contrato esperado para error de credenciales.
- Pruebas/checks ejecutados.
- Riesgos.
- Recomendacion para Web Dev `TASK-244` y QA `TASK-245`.
