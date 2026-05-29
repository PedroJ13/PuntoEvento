# TASK-117: QA Azure de panel empresa con `Enviar a revision`

## Equipo asignado

QA.

## Prerrequisito

Ejecutar solo despues de que Product / Architect / Release confirme commit/push y que Azure Static Web Apps haya terminado el deploy que incluye `panel.js?v=4` y `panel.css?v=4`.

## Contexto

`TASK-116` ajusto el panel empresa para separar el flujo:

```text
Guardar borrador -> Enviar a revision
```

Cambios principales:

- ya no hay selector editable `Estado`;
- ya no hay input manual `Cantidad de fotos`;
- el formulario guarda borrador sin enviar `status`;
- la accion `Enviar a revision` llama:

```text
POST /api/companies/me/services/{serviceId}/submit-review
```

## Archivos que debes leer

- `AGENTS.md`
- `chat-start/QA.md`
- `docs/API_CONTRACTS_MVP.md`
- `docs/DATA_MODEL.md`
- `docs/MVP_RELEASE_STATUS.md`
- `tasks/TASK-116-HANDOFF.md`
- `tasks/TASK-115-HANDOFF.md`
- `panel.html`
- `panel.js`
- `panel.css`

## Ambiente

```text
https://zealous-field-08fdd720f.7.azurestaticapps.net/panel.html
```

## Objetivo

Validar en Azure real que el panel empresa usa el flujo correcto de borrador y revision.

## Casos minimos

1. Confirmar assets publicados:
   - `panel.js?v=4`;
   - `panel.css?v=4`.
2. Entrar con sesion real de empresa QA.
3. Confirmar que el formulario de servicio no muestra:
   - selector editable `Estado`;
   - input `Cantidad de fotos`;
   - texto `Como se revisa`.
4. Confirmar que el submit principal dice `Guardar borrador`.
5. Crear servicio nuevo con campos minimos y confirmar:
   - el request no envia `status`;
   - la respuesta/estado queda `draft` o `Borrador`.
6. Confirmar que el servicio `draft` muestra accion `Enviar a revision`.
7. Ejecutar `Enviar a revision` y confirmar:
   - request `POST /api/companies/me/services/{serviceId}/submit-review`;
   - body `{}` o vacio equivalente;
   - respuesta `200`;
   - UI cambia a `Pendiente`;
   - accion desaparece o queda deshabilitada.
8. Reintentar sobre servicio `pending` o equivalente y confirmar mensaje claro para `409`.
9. Probar validacion de campos minimos antes de enviar a revision.
10. Validar desktop y mobile basico del panel.

## Fuera de alcance

- Cambiar codigo.
- Aprobar servicios desde admin.
- Limpiar datos QA.
- Hacer commit/push.

## Entregable

Crear:

```text
tasks/TASK-117-HANDOFF.md
```

Debe incluir:

- Resultado general: aprobado, bloqueado o requiere cambios.
- URL probada.
- Assets/versiones observadas.
- Casos ejecutados y resultado.
- Evidencia de `Guardar borrador -> Enviar a revision`.
- Resultado responsive basico.
- Bugs, riesgos o limitaciones.
- Recomendacion para Product/Architect.

## Aviso al terminar

Cuando termines, avisa en el chat Product/Architect:

```text
Termine TASK-117. Product/Architect debe leer tasks/TASK-117-HANDOFF.md.
```
