# TASK-191: QA Azure - reintento final activacion/login recurrente post-deploy

## Equipo asignado

QA.

## Contexto

`TASK-189` no aprobo porque el fix de `TASK-188` no estaba desplegado.

`TASK-191` debe ejecutarse despues de `TASK-190`.

## Tarea

Revalidar en Azure real el flujo completo:

```text
email recibido -> activar password -> logout -> login recurrente -> panel correcto
```

## Alcance

- Confirmar que `TASK-190` esta desplegada.
- Usar una empresa QA controlada y correo accesible por Product/QA.
- Aprobar empresa para generar email de activacion.
- Confirmar email recibido.
- Activar password desde enlace.
- Confirmar que activacion crea sesion y carga panel correcto.
- Cerrar sesion.
- Iniciar sesion con email/password.
- Confirmar que el panel carga la empresa correcta.
- Validar password incorrecto -> `401`.
- Validar que no se exponen `passwordHash`, tokens, cookies, connection strings ni secretos.
- Ejecutar soft cleanup/reject de datos QA creados al final.

## No tocar

- Codigo.
- App settings.
- Datos reales.
- Hard delete.
- Tokens completos, passwords, hashes, cookies o secretos en handoff.

## Verificacion

- Azure real: `https://zealous-field-08fdd720f.7.azurestaticapps.net`.
- Evidencia redactada.
- Clasificacion P0/P1/P2.
- Recomendacion go/no-go para invitar primeras empresas reales.

## Handoff esperado

Crear `tasks/TASK-191-HANDOFF.md` con ambiente probado, empresa QA usada, confirmacion de email, activacion, login recurrente, panel correcto, cleanup y go/no-go.
