# TASK-264: Web Dev - ocultar banda de referencia cuando catalogo real esta vacio

## Equipo asignado

Web Dev.

## Contexto

QA Azure `TASK-263` aprobo el bloque `TASK-249` a `TASK-260` y cerro el P1 de API fallida.

Queda un P2:

Con API publica OK pero catalogo real vacio (`/api/public/services?limit=50` devuelve `0` items), la pagina `#bodas` muestra correctamente el estado vacio, pero debajo siguen visibles la banda `Paquetes de boda` y proveedores de referencia como `Casa Arboleda Eventos`, `Bocados y Copas`, `Luz Viva Producciones`, `Flor de Abril`, `Captura Dorada` y `Nexo Corporativo`.

Decision Product / Architect / Release:

No bloquea el test tecnico con primera empresa real, pero antes de mostrar el sitio como catalogo limpio/publico, no deben verse proveedores de referencia cuando el catalogo real de Azure esta vacio.

## Tarea

Ocultar la banda estatica de paquetes/proveedores de referencia en productivo cuando la API publica responde OK pero no hay servicios reales publicados.

## Alcance

- `app.js`
- `index.html` solo si requiere cache busting.

Comportamiento esperado:

- API OK + `items.length > 0`: se mantiene contenido normal con resultados reales.
- API OK + `items.length === 0` en productivo: mostrar estado vacio sin proveedores/paquetes de referencia.
- API fallida en productivo: mantener comportamiento corregido de `TASK-260`.
- Local o `?demo=local`: puede conservar referencias para desarrollo.

## No tocar

- No cambiar backend/API.
- No eliminar datos demo usados localmente.
- No redisenar pagina publica.
- No cambiar CTAs ni lead flow.

## Verificacion

- Simular API OK con `items: []` en host productivo/no-local.
- Confirmar estado vacio.
- Confirmar ausencia de `Paquetes de boda`, `Comparacion rapida de precios` y proveedores de referencia.
- Confirmar API OK con servicios reales/mock sigue mostrando resultados.
- Confirmar API fallida productiva sigue sin mostrar referencias.
- `node --check app.js`.

## Handoff esperado

Crear `tasks/TASK-264-HANDOFF.md` con:

- Cambio aplicado.
- Evidencia de catalogo vacio productivo sin referencias.
- Evidencia de API OK con servicios.
- Evidencia de API fallida productiva.
- Riesgos.
