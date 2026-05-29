# TASK-100: QA Azure de admin UI conectada al modelo nuevo

## Equipo asignado

QA / Infra Azure.

## Dependencia

Product/Architect debe hacer commit/push del bloque de `TASK-098`/`TASK-099` antes de ejecutar esta tarea.

Esperar a que termine el deploy de Azure Static Web Apps para el commit que actualiza:

```text
admin.html
admin.css
admin.js
```

## Contexto

`TASK-098` conecto la pestana `Modelo nuevo` de `admin.html` a los listados internos reales y acciones approve/reject.

`TASK-099` aprobo QA local con mocks:

- legacy `Revision` sigue funcionando;
- `Modelo nuevo` carga Companies, Services y Uploads;
- approve/reject llama endpoints correctos;
- no renderiza campos prohibidos;
- responsive mobile/desktop sin overflow horizontal.

Ahora hay que validar contra Azure real con credencial admin real.

## Base URL

```text
https://zealous-field-08fdd720f.7.azurestaticapps.net/admin.html
```

## Objetivo

Validar en Azure real que el admin interno puede moderar Companies, Services y Uploads del modelo nuevo desde UI.

## Casos requeridos

1. Deploy visible:
   - `admin.css?v=7` presente;
   - `admin.js?v=10` presente.
2. Login admin real:
   - login con credencial admin valida;
   - credencial invalida no debe entrar.
3. Legacy:
   - pestana `Revision` sigue cargando sin romperse;
   - boton `Actualizar` sigue funcionando en `Revision`.
4. Pestana `Modelo nuevo`:
   - carga Companies pendientes desde Azure;
   - carga Services revisables desde Azure;
   - carga Uploads pendientes desde Azure;
   - muestra contadores reales;
   - muestra tarjetas con datos permitidos.
5. Acciones reales:
   - aprobar o rechazar al menos una Company QA controlada;
   - aprobar o rechazar al menos un Service QA controlado;
   - aprobar o rechazar al menos un Upload QA controlado.
6. Refresh:
   - despues de aprobar/rechazar, el item sale del listado o el listado se actualiza claramente;
   - feedback visible para admin.
7. Seguridad:
   - no aparecen campos prohibidos en DOM visible;
   - no aparecen campos prohibidos en HTML renderizado;
   - no hay `console.error` ni excepciones runtime.
8. Responsive:
   - mobile 390x844 sin overflow horizontal;
   - desktop 1366x768 sin overflow horizontal.

## Campos prohibidos

Confirmar que no aparecen:

```text
tokenHash
sessionHash
pendingBlobName
pendingBlobUrl
uploadUrl
sig=
AccountKey
connectionString
partitionKey
rowKey
cookie
pe_company_session
```

## Datos QA

Usar datos QA controlados existentes cuando sea seguro.

Si necesitas crear datos nuevos:

- registrar una empresa QA para Company pending;
- usar invitacion/panel para crear Service draft;
- subir/confirmar upload para Upload pending.

No pegar credenciales, tokens, cookies, invitaciones completas ni SAS en el handoff.

## Fuera de alcance

- Crear endpoint preview para uploads.
- Crear endpoint `submit-review`.
- Cambiar UX de rechazo de `window.prompt`.
- Cambiar pagina publica o panel empresa.
- Hacer commit/push.

## Entregable

Crear:

```text
tasks/TASK-100-HANDOFF.md
```

Debe incluir:

- Resultado general: aprobado, requiere cambios o bloqueado.
- Casos ejecutados.
- Datos QA usados o creados, saneados.
- Confirmacion de campos prohibidos.
- Evidencia/resumen responsive.
- Riesgos pendientes.
- Recomendacion: listo para prueba Product Owner completa, o requiere Web Dev/Backend.

## Aviso al terminar

Cuando termines, avisa en el chat Product/Architect:

```text
Termine TASK-100. Product/Architect debe leer tasks/TASK-100-HANDOFF.md.
```
