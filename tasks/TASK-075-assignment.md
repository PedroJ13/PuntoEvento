# TASK-075: QA/Infra Azure estado vacio filtros de servicios

## Equipo asignado

QA / Infra Azure.

## Contexto

`TASK-074` aprobo localmente el ajuste de filtros sin coincidencias. Product/Architect debe hacer commit/push antes de que ejecutes esta tarea.

El cambio esperado:

- Sin filtros activos: mostrar servicios disponibles.
- Filtros con coincidencias: mostrar solo coincidencias.
- Filtros activos sin coincidencias: mostrar estado vacio y no volver a listar todos los servicios.

## Archivos que debes leer

- `AGENTS.md`
- `chat-start/QA.md`
- `chat-start/INFRA_AZURE.md`
- `docs/BACKLOG.md`
- `tasks/TASK-072-HANDOFF.md`
- `tasks/TASK-073-HANDOFF.md`
- `tasks/TASK-074-HANDOFF.md`
- `index.html`
- `app.js`
- `styles.css`

## Objetivo

Validar en Azure real que la pagina publica muestra el estado vacio correcto cuando los filtros no tienen coincidencias.

## URL base

```text
https://zealous-field-08fdd720f.7.azurestaticapps.net
```

## Precondicion

Confirmar que el workflow/deploy termino para el commit que incluye el ajuste de filtros.

## Alcance de pruebas

Validar `#bodas`:

- Carga inicial sin filtros muestra servicios publicados reales.
- Filtro con coincidencias muestra solo coincidencias.
- Filtro sin coincidencias muestra:
  - estado vacio;
  - cero cards;
  - boton `Limpiar filtros`;
  - selects mantienen las opciones elegidas;
  - no vuelve a mostrar todos los servicios.
- Click en `Limpiar filtros` restaura resultados.
- Toast/mensaje no promete resultados cuando no hay coincidencias.

Validar responsive:

- Desktop.
- Mobile 390 x 844 o similar.
- Sin overflow horizontal.
- Empty state dentro del contenedor.

Validar consola/seguridad:

- Sin errores JS no controlados.
- No se exponen secretos ni campos internos en UI.

## Datos sugeridos

Con los datos actuales de Azure, un filtro que deberia coincidir:

```text
province=Heredia
```

Un filtro que probablemente no deberia coincidir:

```text
province=Cartago
```

Si cambian los datos, usa una provincia/categoria sin resultados y documentalo.

## Fuera de alcance

- No cambiar codigo.
- No limpiar datos QA.
- No subir imagenes reales.
- No probar login/panel empresa.

## Entregable

Crear:

```text
tasks/TASK-075-HANDOFF.md
```

Debe incluir:

- Resultado general: aprobado / aprobado con observaciones / bloqueado.
- URL Azure usada.
- Commit/deploy validado si lo tienes visible.
- Casos probados.
- Evidencia visual resumida o screenshots si el entorno lo permite.
- Hallazgos.
- Riesgos restantes.
- Recomendacion:
  - listo para siguiente bloque/demo controlada, o
  - requiere ajuste Web Dev.

## Nota para coordinacion

Al terminar, avisar en el chat de Product/Architect:

```text
Termine TASK-075. Product/Architect debe leer tasks/TASK-075-HANDOFF.md.
```
