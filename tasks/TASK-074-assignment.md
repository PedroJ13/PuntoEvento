# TASK-074: QA local estado vacio filtros de servicios

## Equipo asignado

QA.

## Contexto

Web Dev completo `TASK-073` corrigiendo el comportamiento de filtros sin coincidencias en la pagina publica.

Antes del cambio, `#bodas` mostraba todos los servicios cuando los filtros activos no tenian resultados. Ahora debe mostrar un estado vacio discreto.

No se debe hacer commit/push/deploy de este bloque hasta pasar QA local.

## Archivos que debes leer

- `AGENTS.md`
- `chat-start/QA.md`
- `docs/BACKLOG.md`
- `tasks/TASK-072-HANDOFF.md`
- `tasks/TASK-073-HANDOFF.md`
- `index.html`
- `app.js`
- `styles.css`

## Objetivo

Validar localmente que los filtros de servicios distinguen correctamente:

- sin filtros activos: mostrar todos los servicios disponibles;
- filtros con coincidencias: mostrar solo coincidencias;
- filtros activos sin coincidencias: mostrar estado vacio, no todos los servicios.

## Alcance de pruebas

Validar estructura:

- `node --check app.js`.
- Carga de pagina sin errores JS no controlados.

Validar `#bodas`:

- Sin filtros activos muestra servicios.
- Filtro con coincidencia muestra solo coincidencias.
- Filtro sin coincidencias muestra:
  - titulo/copy de estado vacio;
  - boton `Limpiar filtros`;
  - cero cards de resultado;
  - no vuelve a listar todos los servicios.
- Los selects mantienen la opcion elegida despues de aplicar filtros.
- El boton `Limpiar filtros` restaura resultados.
- El toast no promete resultados cuando no hay coincidencias.

Validar fallback/API:

- Si el entorno local no tiene API, validar con fallback demo.
- Si puedes probar contra Azure o mock API, confirmar el comportamiento tambien con datos reales.

Validar responsive:

- Desktop.
- Mobile estrecho.
- Sin overflow horizontal.
- Empty state no se sale del contenedor.

## Criterios de aceptacion

- `#bodas` sin filtros no queda vacio.
- Filtros con resultados funcionan.
- Filtros sin resultados muestran estado vacio.
- `Limpiar filtros` restaura resultados.
- No hay errores JS no controlados.
- No hay overflow horizontal obvio.

## Fuera de alcance

- No hacer deploy.
- No modificar codigo salvo que encuentres un bug bloqueante y lo documentes.
- No cambiar contratos API.
- No probar login/panel empresa.
- No subir imagenes reales.

## Entregable

Crear:

```text
tasks/TASK-074-HANDOFF.md
```

Debe incluir:

- Resultado general: aprobado / aprobado con observaciones / bloqueado.
- URL local/navegador usado.
- Casos probados.
- Evidencia visual resumida o screenshots si el entorno lo permite.
- Hallazgos con archivo/seccion si aplica.
- Riesgos restantes.
- Recomendacion:
  - listo para commit/push, o
  - requiere ajuste Web Dev antes de commit.

## Nota para coordinacion

Al terminar, avisar en el chat de Product/Architect:

```text
Termine TASK-074. Product/Architect debe leer tasks/TASK-074-HANDOFF.md.
```
