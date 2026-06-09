# TASK-187: QA/Product - cierre final de activacion por email

## Equipo asignado

QA.

## Contexto

`TASK-184` desplego correctamente el auto-invite al aprobar empresa en Azure.

`TASK-185` aprobo backend/UI del flujo:

- Azure sirve `admin.js?v=17` y `admin.css?v=12`.
- Approve devuelve `invite.status=email_sent`.
- Reintento devuelve `active_exists` sin duplicar invite.
- Admin muestra `Empresa aprobada e invitacion enviada.`
- No hay filtracion visible de tokens/secretos.

Pero `TASK-185` no pudo cerrar el flujo completo porque QA no tenia acceso al mailbox para abrir el enlace de activacion. Falta validar:

```text
email recibido -> abrir enlace -> definir password -> login recurrente
```

Product/Infra debe apoyar solo dando acceso al mailbox observable o confirmando el correo recibido.

## Tarea

Ejecutar una prueba final coordinada del email de activacion recibido por la empresa y confirmar login recurrente.

## Alcance

- Registrar una empresa QA nueva con un correo accesible por Product/Infra/QA.
- Aprobar la empresa desde admin/API.
- Confirmar recepcion del email con asunto `Activa tu acceso a Punto Evento`.
- Abrir el enlace de activacion sin pegar el token completo en el handoff.
- Definir password.
- Iniciar sesion recurrente con email/password.
- Confirmar que el panel carga la empresa correcta.
- No limpiar/rechazar la empresa hasta terminar activacion y login.
- Despues de validar, hacer soft cleanup/reject de la empresa QA creada y documentarlo.

## No tocar

- Codigo.
- App settings.
- Secretos.
- Datos reales.
- Hard delete.
- Publicar tokens completos o enlaces completos en el handoff.

## Verificacion

- Azure real: `https://zealous-field-08fdd720f.7.azurestaticapps.net`.
- Email recibido confirmado por humano con acceso al mailbox.
- Activacion y login recurrente aprobados.
- Evidencia redactada sin token completo.
- Limpieza QA documentada al final.

## Handoff esperado

Crear `tasks/TASK-187-HANDOFF.md` con:

- Empresa QA usada.
- Confirmacion de email recibido.
- Resultado de activacion.
- Resultado de login recurrente.
- Confirmacion de que el panel carga la empresa correcta.
- Limpieza QA ejecutada.
- Recomendacion go/no-go para invitar primeras empresas reales.
