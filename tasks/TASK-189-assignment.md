# TASK-189: QA Azure - revalidar activacion y login recurrente

## Equipo asignado

QA.

## Contexto

Depende de `TASK-188` y su deploy a Azure si aplica.

`TASK-187` confirmo email recibido y activacion, pero no aprobo login recurrente porque `POST /api/company-auth/login` devolvio `401` cuando habia usuarios duplicados con el mismo email.

## Tarea

Revalidar en Azure el flujo completo de empresa:

```text
email recibido -> activar password -> logout -> login recurrente -> panel correcto
```

## Alcance

- Usar una empresa QA nueva o una empresa QA controlada.
- Usar correo accesible por Product/QA.
- Aprobar empresa para generar email de activacion.
- Confirmar email recibido.
- Activar password desde enlace.
- Cerrar sesion.
- Iniciar sesion con email/password.
- Confirmar que el panel carga la empresa correcta.
- Validar que el caso de email duplicado ya no falla o queda manejado segun la regla de `TASK-188`.
- Ejecutar soft cleanup/reject de datos QA creados al final.

## No tocar

- Codigo.
- App settings.
- Datos reales.
- Hard delete.
- Tokens completos, passwords, hashes, cookies o secretos en handoff.

## Verificacion

- Azure real.
- Evidencia redactada.
- Clasificar P0/P1/P2.
- Recomendacion go/no-go para invitar primeras empresas reales.

## Handoff esperado

Crear `tasks/TASK-189-HANDOFF.md` con ambiente probado, empresa QA usada, confirmacion de email, activacion, login recurrente, panel correcto, cleanup y go/no-go.
