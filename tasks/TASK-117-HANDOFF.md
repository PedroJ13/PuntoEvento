# TASK-117 Handoff

## Resultado general

Aprobado.

El panel empresa desplegado en Azure usa correctamente el flujo:

```text
Guardar borrador -> Enviar a revision
```

Se valido con sesion real de empresa QA, UI desplegada, requests reales contra Azure Functions y Azure Table Storage.

## URL probada

```text
https://zealous-field-08fdd720f.7.azurestaticapps.net/panel.html
```

## Assets/versiones observadas

Consulta contra `panel.html` publicado:

```json
{
  "Scripts": "panel.js?v=4",
  "Stylesheets": [
    "styles.css?v=14",
    "panel.css?v=4"
  ],
  "HasPanelJsV4": true,
  "HasPanelCssV4": true
}
```

## Casos ejecutados y resultado

1. Confirmar assets publicados: aprobado.
2. Entrar con sesion real de empresa QA: aprobado.
   - Empresa usada: `company_e04c0711-14ae-42b0-8607-acbea4cdb252`.
   - Sesion creada mediante invitacion interna QA; no se documentaron token ni cookie.
3. Confirmar que el formulario no muestra campos/acciones removidas: aprobado.
4. Confirmar submit principal `Guardar borrador`: aprobado.
5. Crear servicio nuevo con campos minimos: aprobado.
6. Confirmar request de guardado sin `status`: aprobado.
7. Confirmar estado `draft` / `Borrador`: aprobado.
8. Confirmar accion `Enviar a revision` en servicio `draft`: aprobado.
9. Ejecutar `Enviar a revision`: aprobado.
10. Confirmar request `POST /submit-review` con body `{}`: aprobado.
11. Confirmar respuesta `200`, UI `Pendiente` y accion removida: aprobado.
12. Reintento sobre `pending`: equivalente aprobado.
    - La UI ya no permite reintento porque quita `Enviar a revision`.
    - La card muestra mensaje claro: `Este servicio ya esta en revision.`
    - Reintento directo con la misma sesion contra API devolvio `409`.
13. Validacion de campos minimos antes de enviar a revision: aprobado.
14. Responsive desktop/mobile basico: aprobado.

## Evidencia estructural del formulario

HTML publicado:

```json
{
  "HasEstadoActual": true,
  "HasFotosAprobadas": true,
  "HasGuardarBorrador": true,
  "HasEnviarRevision": true,
  "HasCantidadFotos": false,
  "HasComoSeRevisa": false,
  "HasNameStatus": false,
  "HasNamePhotoCount": false
}
```

UI real durante smoke:

```json
{
  "hasEditableStatus": false,
  "hasPhotoCountInput": false,
  "bodyHasCantidadFotos": false,
  "bodyHasComoSeRevisa": false,
  "submitText": "Guardar borrador"
}
```

Nota: `Estado actual` y `Fotos aprobadas` son resumen de lectura, no inputs editables.

## Evidencia de `Guardar borrador -> Enviar a revision`

Servicio QA creado:

```text
QA TASK-117 1780090739740 Mesa dulce UI
```

Guardado de borrador:

```json
{
  "requestCaptured": true,
  "method": "POST",
  "path": "/api/companies/me/services",
  "sentStatus": false,
  "responseDraftVisible": true,
  "sendButtonCount": 1
}
```

Envio a revision:

```json
{
  "requestCaptured": true,
  "method": "POST",
  "path": "/api/companies/me/services/service_6e4c6e2b-9d2a-4d34-8198-46f1eb38b72d/submit-review",
  "postData": "{}",
  "responseStatus": 200,
  "pendingVisible": true,
  "actionGone": true,
  "pendingClearMessage": true,
  "directRetryStatus": 409
}
```

## Validacion de campos minimos

Se creo un borrador incompleto via API para probar la validacion del panel antes de llamar `submit-review`.

Resultado UI:

```json
{
  "validationMessage": "Selecciona al menos un tipo de evento."
}
```

Esto confirma que la UI bloquea el envio a revision antes de llamar al endpoint cuando faltan campos minimos.

## Resultado responsive basico

Desktop:

```json
{
  "width": 1366,
  "height": 900,
  "hasHorizontalOverflow": false,
  "headerVisible": true
}
```

Mobile:

```json
{
  "width": 390,
  "height": 844,
  "hasHorizontalOverflow": false,
  "headerVisible": true,
  "addServiceVisible": true,
  "serviceCardVisible": true
}
```

## Bugs, riesgos o limitaciones

- No se encontraron bugs P0/P1 en el alcance de la tarea.
- Se crearon servicios QA reales en Azure para completar el smoke. Quedan pendientes de limpieza si Product / Release decide limpiar datos QA antes de demo owner.
- El reintento UI sobre servicio `pending` no se puede ejecutar como click porque la accion desaparece correctamente. Se valido el equivalente esperado: mensaje contextual en card y `409` por API con la misma sesion.
- No se aprobaron servicios desde admin, por estar fuera de alcance.
- No se probo carga de cover en esta tarea; la tarea estaba enfocada en flujo de borrador/revision.

## Recomendacion para Product/Architect

Marcar `TASK-116` como validado en Azure y mantener como siguiente foco:

- limpieza de datos QA antes de demo owner;
- definicion final del catalogo compartido de categorias/tipos de evento;
- siguiente prueba Product Owner del panel con el flujo `Guardar borrador -> Enviar a revision`.
