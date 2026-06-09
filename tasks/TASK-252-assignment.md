# TASK-252: Web Dev - fallback publico sin datos demo en productivo

## Equipo asignado

Web Dev.

## Contexto

QA Flujo MVP detecto que la pagina publica puede caer a datos demo si falla la API publica.

Decision Product / Architect / Release:

Para pre-lanzamiento real, no mostrar catalogo demo en productivo cuando falla la API. El fallback demo debe quedar limitado a local o a una bandera clara de demo.

## Tarea

Ajustar el fallback de la pagina publica para que en productivo muestre un estado controlado si la API falla, en vez de datos demo.

## Alcance

- `app.js`
- Estado vacio/error de pagina publica.
- Modo demo/local si ya existe.

Mensaje sugerido:

```text
No pudimos cargar los servicios publicados. Intenta de nuevo en unos minutos.
```

## No tocar

- No cambiar endpoints publicos.
- No eliminar datos demo usados para desarrollo local.
- No redisenar resultados.
- No tocar admin/panel.

## Verificacion

- Simular falla de API publica.
- Confirmar que en productivo no se renderizan servicios demo.
- Confirmar estado/error controlado.
- Confirmar que en local/demo se puede seguir desarrollando con datos demo si aplica.

## Handoff esperado

Crear `tasks/TASK-252-HANDOFF.md` con:

- Politica implementada.
- Forma de detectar productivo/local.
- Pruebas de API OK y API fallida.
- Riesgos.
