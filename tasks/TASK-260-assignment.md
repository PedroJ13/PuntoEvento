# TASK-260: Web Dev - ocultar paquetes de referencia cuando falla API publica

## Equipo asignado

Web Dev.

## Contexto

QA `TASK-259` no aprobo el bloque pre-lanzamiento por un P1:

Cuando falla `/api/public/services` en un host productivo/no-local, la pagina muestra correctamente el mensaje:

```text
No pudimos cargar los servicios publicados. Intenta de nuevo en unos minutos.
```

Pero debajo siguen visibles paquetes/proveedores estaticos de referencia como `Casa Arboleda Eventos`, `Bocados y Copas`, `Luz Viva Producciones`, `Flor de Abril`, `Captura Dorada` y `Nexo Corporativo`.

Decision Product / Architect / Release:

En productivo, si la API publica falla o no hay catalogo real, no se deben mostrar datos de referencia/demo que parezcan catalogo operativo.

## Tarea

Corregir la pagina publica para que los paquetes/proveedores estaticos de referencia no se muestren en modo productivo cuando la API publica falla o el estado de datos sea `error`.

## Alcance

- `app.js`
- Si hace falta, `index.html` solo para cache busting.

Comportamiento esperado:

- API publica OK con servicios reales: se mantiene flujo normal.
- API publica falla en host productivo/no-local: se muestra estado controlado y no se renderizan paquetes/proveedores de referencia.
- Local o `?demo=local`: puede conservarse referencia para desarrollo.

## No tocar

- No cambiar backend/API.
- No eliminar datos demo usados para desarrollo local.
- No redisenar pagina publica.
- No cambiar CTAs ya ajustados en `TASK-250`.

## Verificacion

- Reproducir el caso de QA: host no-local simulado y `/api/public/services` forzado a `500`.
- Confirmar que no aparecen paquetes/proveedores de referencia.
- Confirmar que el mensaje controlado sigue visible.
- Confirmar que local/demo conserva referencia si aplica.
- `node --check app.js`.

## Handoff esperado

Crear `tasks/TASK-260-HANDOFF.md` con:

- Causa del P1.
- Cambio aplicado.
- Evidencia de host productivo simulado con API fallida.
- Evidencia de no regresion en API OK/local.
- Riesgos.
