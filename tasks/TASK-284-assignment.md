# TASK-284: Infra Azure - preparar empresa QA autenticable para reproducir incidente panel

## Equipo asignado

Infra Azure.

## Contexto

`TASK-283` no pudo aprobar ni descartar el P1 candidato porque QA no tenia empresa aprobada, login recurrente valido, invite activo, sesion controlada ni HAR redactado.

El incidente sigue abierto:

```text
crear servicio con portada -> presionar Enviar servicio -> deberia quedar en revision
```

Evidencia de producto:

- El servicio se crea como borrador.
- Desde el borrador, el envio manual a revision funciona.
- Falta capturar la request fallida del envio directo.

## Tarea

Preparar una empresa QA controlada en Azure, aprobada y con acceso recurrente al panel empresa, para que QA pueda ejecutar `TASK-285`.

## Alcance

1. Crear o reutilizar una empresa QA claramente identificable.
2. Asegurar que la empresa este aprobada/publicada para acceso al panel.
3. Asegurar que exista un usuario/login recurrente valido para la empresa.
4. Validar que el login carga `https://puntoeventocr.com/panel.html` y permite entrar a `Mis servicios`.
5. Entregar a Product/QA el acceso por canal seguro fuera del repo.
6. En el handoff, no incluir password, cookies, tokens, invites completos ni datos sensibles.

## No tocar

- No cambiar codigo.
- No publicar servicios reales.
- No hacer hard delete.
- No dejar contrasenas, tokens, cookies ni enlaces de activacion completos en archivos del repo.

## Verificacion

Confirmar en el handoff:

- ID/nombre QA no sensible de la empresa.
- Estado de empresa.
- Que login recurrente fue validado sin exponer credenciales.
- Que el panel abre `Mis servicios`.
- Que no se publicaron servicios reales.
- Que las credenciales fueron compartidas fuera del repo.

## Handoff esperado

Actualizar:

```text
tasks/TASK-284-HANDOFF.md
```

