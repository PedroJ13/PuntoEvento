# TASK-164: Backend/API + Infra Azure - emails internos de registro y revision

## Equipo asignado

Backend / API con apoyo de Infra Azure.

## Contexto

Prioridad P1/P2: Punto Evento debe recibir email interno cuando una empresa se registra o envia servicios a revision.

## Tarea

Implementar notificaciones internas para:

- empresa registrada;
- servicio enviado a revision.

## Alcance

- Enviar email interno sin bloquear el flujo principal si el proveedor falla.
- Definir variables de entorno necesarias.
- Evitar duplicados evidentes por reintentos.
- Registrar errores sin secretos.
- Actualizar arquitectura/contratos si se agrega proveedor o configuracion.

## No tocar

- Email de cotizacion a empresa.
- UI publica.
- Login empresa.
- Redisenio.

## Verificacion

- Registro dispara notificacion interna.
- `submit-review` dispara notificacion interna.
- Falla de email no rompe registro ni envio a revision.
- No se imprimen secretos.

## Handoff esperado

Crear `tasks/TASK-164-HANDOFF.md` con:

- Proveedor/configuracion requerida.
- Variables de entorno, sin valores.
- Archivos y docs cambiados.
- Verificacion.
- Riesgos para Infra/QA.
