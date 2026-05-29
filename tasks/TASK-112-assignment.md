# TASK-112: QA Azure de registro exitoso y doble submit

## Equipo asignado

QA.

## Prerrequisito

Ejecutar esta tarea solo despues de que los cambios de `TASK-110` esten publicados en Azure.

Si el deploy aun no termino o no incluye `index.html` con `app.js?v=21` y `styles.css?v=16`, marcar la tarea como bloqueada por deploy pendiente.

## Contexto

`TASK-110` corrigio el flujo publico de registro de empresa en `index.html#empresas`:

- bloqueo de doble submit desde UI;
- estado visible durante envio;
- confirmacion clara despues del exito;
- accion `Registrar otra empresa`;
- preservacion de datos en error.

## Archivos que debes leer

- `AGENTS.md`
- `chat-start/QA.md`
- `docs/PRODUCT_OWNER_TEST_FINDINGS_2026-05-29.md`
- `docs/MVP_RELEASE_STATUS.md`
- `tasks/TASK-110-HANDOFF.md`
- `index.html`
- `app.js`
- `styles.css`

## Ambiente

Azure Static Web Apps:

```text
https://zealous-field-08fdd720f.7.azurestaticapps.net/
```

Ruta a probar:

```text
https://zealous-field-08fdd720f.7.azurestaticapps.net/index.html#empresas
```

## Objetivo

Validar que el hallazgo `PO-001` queda resuelto en Azure desplegado.

## Casos minimos

1. Cargar `index.html#empresas` y confirmar que los assets publicados son los nuevos:
   - `app.js?v=21`;
   - `styles.css?v=16`.
2. Completar el formulario de registro con datos QA claramente identificables.
3. Hacer doble click o clicks repetidos sobre `Enviar registro gratis`.
4. Confirmar durante envio:
   - boton deshabilitado;
   - texto `Enviando registro...` o estado equivalente visible;
   - no queda sensacion de formulario detenido.
5. Confirmar en exito:
   - formulario se limpia y/o se oculta;
   - aparece confirmacion clara;
   - aparece `Registrar otra empresa`;
   - al usar `Registrar otra empresa`, el formulario vuelve limpio.
6. Probar mobile viewport basico en `#empresas`.

## Verificacion de duplicados

Si tienes forma segura de revisar la entidad creada por API/admin, confirmar que el doble click no genero duplicados visibles.

Si no puedes revisar duplicados por API/admin, documentar la limitacion y validar al menos el bloqueo UI.

## Fuera de alcance

- Cambiar codigo.
- Probar todo el panel empresa.
- Probar `submit-review`; eso corresponde al bloque de `TASK-111` y tareas posteriores.
- Hacer commit/push.

## Entregable

Crear:

```text
tasks/TASK-112-HANDOFF.md
```

Debe incluir:

- Resultado general: aprobado, bloqueado o requiere cambios.
- URL probada.
- Evidencia de assets/versiones.
- Casos ejecutados.
- Resultado de doble submit.
- Resultado mobile basico.
- Bugs encontrados, si aplica.
- Riesgos o limitaciones.

## Aviso al terminar

Cuando termines, avisa en el chat Product/Architect:

```text
Termine TASK-112. Product/Architect debe leer tasks/TASK-112-HANDOFF.md.
```
