# TASK-188: Backend/API - corregir login recurrente con emails duplicados

## Equipo asignado

Backend/API.

## Contexto

`TASK-187` no aprobo el cierre final de activacion/login.

Hallazgo:

- Product confirmo recepcion del email `Activa tu acceso a Punto Evento`.
- El enlace abre el formulario de activacion.
- `POST /api/company-auth/activate` responde `200` y crea/actualiza usuario.
- El panel carga en la sesion creada por activacion.
- Pero `POST /api/company-auth/login` con el mismo email/password responde `401`.

Investigacion QA:

- El usuario activado existe en `Users`, status `active`, con `passwordSetAt` actualizado.
- El hash del usuario activado verifica localmente contra el password usado.
- Hay mas de un usuario activo con el mismo email.
- Causa probable: `findUserByEmail(email)` retorna el primer usuario global con ese email, que puede pertenecer a otra empresa y no verificar el password recien definido.

## Tarea

Corregir el login recurrente para manejar emails duplicados de forma segura y deterministica.

## Alcance

- Revisar `api/shared/companyAuth.js` y `api/company-auth-login/index.js`.
- Cambiar el login para no depender del primer usuario encontrado por email si existen multiples candidatos.
- Opcion recomendada para MVP:
  - listar usuarios activos por email;
  - probar password contra cada candidato sin exponer hashes;
  - elegir un candidato cuyo password verifique y cuya empresa exista con status permitido (`pending` o `published`);
  - si ninguno verifica, responder `401`;
  - si mas de uno verifica, responder error seguro o elegir regla deterministica documentada.
- Mantener respuestas genericas para credenciales invalidas.
- No exponer `passwordHash`, tokens, cookies, connection strings ni metadata interna.
- Agregar/actualizar prueba local o script estructural que reproduzca dos usuarios con el mismo email y confirme que login selecciona el usuario correcto.

## No tocar

- UI.
- App settings.
- Proveedor de email.
- Admin moderation.
- Hard delete o limpieza de datos Azure.
- Secretos.

## Verificacion

- `node --check` de archivos modificados.
- Prueba local/estructural:
  - dos usuarios activos comparten email;
  - solo uno tiene password correcto;
  - login retorna el companyId correcto;
  - password incorrecto retorna `401`.
- Confirmar que no se imprimen hashes ni secretos.
- Actualizar docs de contrato si cambia la regla de login.

## Handoff esperado

Crear `tasks/TASK-188-HANDOFF.md` con:

- Archivos cambiados.
- Regla final elegida para emails duplicados.
- Checks ejecutados.
- Prueba de reproduccion.
- Riesgos.
- Recomendacion para QA `TASK-189`.
