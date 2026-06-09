# TASK-128: QA pagina publica Round 2

## Estado

No aprobado en Azure. Aprobado solo como evidencia local del repo.

## Ambiente validado

- Azure Static Web Apps: `https://zealous-field-08fdd720f.7.azurestaticapps.net`
- Local repo servido con Chromium headless y API publica mock para validar el codigo actual sin depender del deploy.

## Resultado general

El codigo local de `index.html` / `app.js` contiene la busqueda por empresa y la limpieza de filtros esperada por `TASK-124`, pero Azure aun sirve la version anterior de la pagina publica.

En Azure:

- `index.html` referencia `app.js?v=21` y `styles.css?v=16`.
- No aparece input `q` dentro de `#weddingFilters`.
- Siguen visibles/activos `Invitados`, `Presupuesto` y la lista lateral de checks.
- `/api/public/services?q=Demo Owner Jardines del Sol` responde `items: []`, aunque `/api/public/services` contiene un servicio publicado de esa empresa.

## Casos ejecutados

| Caso | Resultado |
| --- | --- |
| Buscar por nombre de empresa publicada | FAIL Azure: `Demo Owner Jardines del Sol` no retorna resultados por API. PASS local con mock. |
| Buscar `Demo Owner Jardines del Sol` si tiene servicio publicado | FAIL Azure: existe servicio publicado en listado general, pero no aparece al buscar por empresa. |
| Confirmar resultado tipo servicio por empresa | Parcial local: la card muestra tag `Servicio` y nombre de empresa; no hay texto literal `Servicio por Empresa`. |
| Confirmar que `Invitados` y `Presupuesto` no aparecen/no filtran | FAIL Azure: aparecen en desktop y mobile. PASS local. |
| Confirmar que checks `Servicios para boda` no aparecen/no filtran | FAIL Azure: `.checkbox-list` aparece en desktop y mobile. PASS local. |
| Confirmar `Todos` estable | PASS Azure y local: primera opcion de servicio es `Todos`. |
| Desktop/mobile | FAIL Azure por filtros viejos; PASS local con Chromium 1366x900 y 390x844. |

## Evidencia

Azure DOM con Playwright:

- Desktop/mobile: `qInput=0`, `guests=1`, `budget=1`, `checkboxList=1`, `serviceFirstOption=Todos`.
- No hubo errores de consola en la prueba publica.

Local DOM con Playwright y servicio mock:

- Desktop/mobile: `qInput=1`, `guests=0`, `budget=0`, `checkboxList=0`, `serviceFirstOption=Todos`.
- Buscar `Demo Owner Jardines del Sol` muestra `Boda jardin esencial` y `Demo Owner Jardines del Sol`.

Checks sintacticos locales:

- `node --check app.js`: OK.

## Hallazgos

1. `P1` Azure no tiene desplegado el cambio de `TASK-124`/`TASK-127` para busqueda por empresa y limpieza de filtros.
2. `P2` En el codigo local el resultado se entiende como servicio por empresa, pero no muestra literalmente `Servicio por Empresa`; si Product lo requiere como copy exacto, falta ajuste menor.

## Recomendacion

Desplegar la version local actual y repetir esta prueba contra Azure. No recomendar aprobar `TASK-128` para release mientras Azure siga mostrando los filtros viejos y la API publica no encuentre servicios por nombre de empresa.

