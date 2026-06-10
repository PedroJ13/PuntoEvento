# TASK-282 CANCELLED: reemplazada por TASK-283

## Motivo

`TASK-282` queda cancelada/reemplazada porque la evidencia nueva acoto el incidente:

- El servicio si se crea.
- El servicio queda como `draft`.
- Desde el borrador, el envio manual a revision si funciona.

Por lo tanto ya no conviene una validacion amplia del panel autenticado. La prueba necesaria ahora es una reproduccion enfocada del flujo:

```text
crear servicio con portada -> presionar Enviar servicio -> quedar directo en revision
```

La tarea activa para esto es `TASK-283`.

## Decision operativa

- No abrir fix tecnico hasta que QA capture la request fallida y el status HTTP.
- Derivar a `Web Dev` si falla la orquestacion del panel o si todos los endpoints responden OK pero la UI queda en error.
- Derivar a `Backend/API` si falla `upload/sign`, `upload/confirm` o `submit-review` con error de API.
- Derivar a `Infra Azure` solo si aparece `403`.

