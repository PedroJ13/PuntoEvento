# TASK-110: Mejorar registro exitoso y prevenir doble submit

## Equipo asignado

Web Dev.

## Contexto

Product Owner reporto `PO-001` en:

```text
docs/PRODUCT_OWNER_TEST_FINDINGS_2026-05-29.md
```

Despues de enviar el registro publico en `index.html#empresas`, el formulario queda con datos visibles y puede sentirse detenido o permitir duda de doble envio.

## Archivos que debes leer

- `AGENTS.md`
- `chat-start/WEB_DEV.md`
- `docs/PRODUCT_OWNER_TEST_FINDINGS_2026-05-29.md`
- `docs/MVP_RELEASE_STATUS.md`
- `index.html`
- `app.js`
- `styles.css`

## Objetivo

Hacer que el registro exitoso de empresa tenga un cierre claro y evite doble submit.

## Alcance

1. Durante envio:
   - deshabilitar boton de submit;
   - mostrar estado de envio claro.
2. En exito:
   - limpiar o esconder campos capturados;
   - mostrar confirmacion clara;
   - mostrar accion `Registrar otra empresa`.
3. Evitar doble submit desde UI:
   - bloquear clicks repetidos mientras hay request activa;
   - no crear envios duplicados por doble click.
4. En error:
   - reactivar formulario;
   - mantener datos para correccion;
   - mostrar error claro.
5. Mantener la pagina publica actual sin reescritura.

## Fuera de alcance

- Agregar nuevos campos de contacto/sociales; eso depende de `TASK-109`.
- Cambiar backend.
- Cambiar panel empresa o admin.
- Hacer commit/push.

## Verificacion esperada

- Prueba local o con mocks de submit exitoso:
  - boton se deshabilita durante envio;
  - despues del exito no queda duda de doble envio;
  - aparece `Registrar otra empresa`;
  - al usar esa accion el formulario queda listo para nuevo registro.
- Prueba de error:
  - boton se reactiva;
  - datos no se pierden.
- Validar mobile y desktop basico en `#empresas`.

## Entregable

Crear:

```text
tasks/TASK-110-HANDOFF.md
```

Debe incluir:

- Resultado general.
- Archivos modificados.
- Comportamiento en envio, exito y error.
- Verificacion ejecutada.
- Riesgos pendientes.
- Recomendacion para QA.

## Aviso al terminar

Cuando termines, avisa en el chat Product/Architect:

```text
Termine TASK-110. Product/Architect debe leer tasks/TASK-110-HANDOFF.md.
```
