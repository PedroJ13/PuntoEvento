# TASK-133: QA pagina publica Round 2 post-deploy

## Estado

Aprobado.

## Ambiente probado

- Azure Static Web Apps: `https://zealous-field-08fdd720f.7.azurestaticapps.net`
- Fecha local: 2026-05-30
- Navegador: Chromium headless con viewports 1366x900 y 390x844.

## Versiones confirmadas

- `/index.html` -> `app.js?v=22`
- `/index.html` -> `styles.css?v=17`

## Resultado por caso

| Caso | Resultado |
| --- | --- |
| Confirmar versiones publicas | PASS |
| Buscar por nombre de empresa publicada | PASS |
| Buscar `Demo Owner Jardines del Sol` | PASS: API devuelve 1 item, `Servicio 1` por `Demo Owner Jardines del Sol`. |
| Confirmar resultado tipo servicio con contexto de empresa | PASS: la UI muestra `Servicio 1` y el nombre de empresa. |
| `Invitados` y `Presupuesto` no aparecen/no afectan | PASS: `#weddingFilters [name="guests"] = 0`, `[name="budget"] = 0`. |
| Checks `Servicios para boda` no aparecen/no filtran | PASS: `.checkbox-list = 0`. |
| `Todos` estable al cargar/limpiar | PASS: primera opcion `Todos`; al limpiar queda `Todos`. |
| Desktop/mobile | PASS en 1366x900 y 390x844. |

## Evidencia

API publica:

```text
GET /api/public/services?q=Demo%20Owner%20Jardines%20del%20Sol -> 200
items: 1
first.name: Servicio 1
first.company.name: Demo Owner Jardines del Sol
```

DOM desktop:

```text
qInput=1
guests=0
budget=0
checkboxList=0
firstServiceOption=Todos
afterClearService=Todos
resultHasDemoOwner=1
resultHasService=1
consoleErrors=[]
```

DOM mobile:

```text
qInput=1
guests=0
budget=0
checkboxList=0
firstServiceOption=Todos
afterClearService=Todos
resultHasDemoOwner=1
resultHasService=1
consoleErrors=[]
```

## Riesgos / pendientes

- No se detectan P0/P1 para `TASK-133`.
- El copy literal `Servicio por Empresa` no aparece; la UI muestra el servicio y la empresa como contexto. Si Product exige la frase exacta, seria ajuste P2 de texto.

## Recomendacion

`TASK-133` puede considerarse aprobado para la re-prueba Product Owner.

