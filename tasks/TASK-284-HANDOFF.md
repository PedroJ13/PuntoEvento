# TASK-284 HANDOFF

Equipo: Infra Azure / Product.

Tarea: preparar empresa QA autenticable para reproducir incidente panel.

## Resultado

Resultado: **precondicion operativa satisfecha por Product**.

Product indico una empresa existente para la prueba controlada:

```text
Empresa: Aurisbel Pasteleria
Email: eventos.aurisbel@gmail.com
```

La credencial fue compartida por fuera de este archivo y no debe copiarse a documentos del repo.

## Alcance cubierto

- Empresa objetivo identificada para que QA use una sesion real/controlada.
- Email de login identificado.
- Password temporal disponible para Product/QA, no registrado en repo.

## Pendiente para QA

QA debe validar al iniciar `TASK-285`:

- Que el login recurrente funciona en `https://puntoeventocr.com/panel.html`.
- Que la empresa puede entrar a `Mis servicios`.
- Que la empresa esta aprobada y puede crear servicios.

Si el login falla, QA debe reportar el status/mensaje exacto y devolver el bloqueo a Product/Infra Azure antes de probar el flujo de servicio.

## Seguridad

No se registraron passwords, cookies, tokens, invites completos ni URLs firmadas.

## Siguiente paso

Ejecutar `TASK-285`.

