# TASK-114: Reintento QA Azure de registro exitoso y doble submit

## Equipo asignado

QA.

## Prerrequisito

Ejecutar solo despues de que Product / Architect / Release confirme commit/push y que Azure Static Web Apps haya terminado el deploy.

Esta tarea reemplaza el reintento de `TASK-112`, que quedo bloqueada porque Azure todavia servia `index.html` con assets anteriores.

## Contexto

`TASK-110` corrigio el registro publico de empresa:

- bloqueo de doble submit desde UI;
- estado visible durante envio;
- confirmacion clara despues del exito;
- accion `Registrar otra empresa`;
- preservacion de datos en error.

`TASK-112` verifico Azure y encontro:

```text
app.js?v=20
styles.css?v=15
```

El reintento debe validar que el HTML publicado ya referencia:

```text
app.js?v=21
styles.css?v=16
```

## Archivos que debes leer

- `AGENTS.md`
- `chat-start/QA.md`
- `tasks/TASK-110-HANDOFF.md`
- `tasks/TASK-112-HANDOFF.md`
- `docs/MVP_RELEASE_STATUS.md`
- `index.html`
- `app.js`
- `styles.css`

## Ambiente

```text
https://zealous-field-08fdd720f.7.azurestaticapps.net/index.html#empresas
```

## Objetivo

Confirmar en Azure que `PO-001` queda resuelto.

## Casos minimos

1. Confirmar que `index.html` publicado referencia `app.js?v=21` y `styles.css?v=16`.
2. Completar el formulario publico de registro con datos QA identificables.
3. Hacer doble click o clicks repetidos en `Enviar registro gratis`.
4. Confirmar durante envio:
   - boton deshabilitado;
   - estado de envio visible;
   - no hay posibilidad evidente de doble submit.
5. Confirmar exito:
   - formulario queda limpio y/o oculto;
   - confirmacion clara visible;
   - aparece `Registrar otra empresa`;
   - al usar esa accion, el formulario vuelve limpio.
6. Validar mobile viewport basico.

## Duplicados

Si puedes revisar via API/admin que no se genero duplicado, documentalo.

Si no puedes revisar duplicados, documenta esa limitacion y valida el bloqueo UI.

## Fuera de alcance

- Cambiar codigo.
- Probar panel empresa.
- Probar `submit-review`.
- Hacer commit/push.

## Entregable

Crear:

```text
tasks/TASK-114-HANDOFF.md
```

Debe incluir:

- Resultado general.
- URL probada.
- Assets/versiones observadas.
- Casos ejecutados.
- Resultado de doble submit.
- Resultado mobile basico.
- Bugs o limitaciones.

## Aviso al terminar

Cuando termines, avisa en el chat Product/Architect:

```text
Termine TASK-114. Product/Architect debe leer tasks/TASK-114-HANDOFF.md.
```
