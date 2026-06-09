# TASK-218: Backend/API - renombrar marca en emails y copy transaccional

## Equipo asignado

Backend/API.

## Contexto

Product decidio cambiar el nombre visible de la marca de `Punto Evento` a `Punto Evento CR` para especificar Costa Rica y diferenciarse de paginas similares.

Esta tarea debe iniciar despues de cerrar el P1 visual actual del panel empresa (`TASK-213`/`TASK-214`). Puede avanzar en paralelo con `TASK-217` cuando el bloque visual este desbloqueado.

## Tarea

Actualizar el nombre visible en emails, asuntos, copy transaccional y respuestas backend donde aplique, sin cambiar infraestructura ni dominios.

## Alcance

1. Buscar usos de `Punto Evento` en `/api` y cualquier template/copy backend.
2. Actualizar a `Punto Evento CR` en:
   - asunto y cuerpo de email de cotizacion/contacto;
   - email interno de empresa registrada;
   - email interno de servicio enviado a revision;
   - email de activacion/invitacion;
   - nombres visibles de remitente si el codigo los define;
   - mensajes/copy transaccional backend visibles para usuarios.
3. Mantener direcciones tecnicas/senders de ACS sin cambio si dependen de configuracion Azure.
4. No cambiar rutas API, nombres de tablas, variables de entorno ni contratos funcionales.
5. Actualizar tests o fixtures si existen.

## No tocar

- No cambiar proveedor email ACS.
- No cambiar secrets/app settings.
- No cambiar from address real si vive en Azure config.
- No cambiar slugs ni IDs existentes.
- No cambiar frontend en esta tarea.

## Verificacion

- Busqueda textual local confirma que templates/copy backend visibles usan `Punto Evento CR`.
- Pruebas estructurales o smoke local de templates pasan si existen.
- No se imprimen secretos.
- Contrato de emails y endpoints se mantiene.

## Handoff esperado

Crear `tasks/TASK-218-HANDOFF.md` con:

- Resumen de cambios.
- Archivos tocados.
- Emails/casos actualizados.
- Verificacion local/estructural.
- Riesgos.
- Recomendacion para QA `TASK-219`.
