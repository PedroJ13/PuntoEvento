# TASK-254: Diseno UX - definicion mobile para panel empresa y ficha publica

## Equipo asignado

Diseno UX.

## Contexto

QA Visual pre-lanzamiento detecto dos P2 mobile:

- En panel empresa mobile, el sidebar ocupa casi todo el primer viewport y desplaza login/contenido operativo.
- En ficha publica mobile, la galeria ocupa casi todo el primer viewport y la identidad del proveedor aparece tarde.

Product / Architect / Release no quiere abrir redisenio profundo, pero si una definicion minima implementable antes de mandar Web Dev.

## Tarea

Definir una guia mobile acotada para:

1. Panel empresa mobile mas directo.
2. Ficha publica mobile con identidad/CTA mas tempranos.

## Alcance

- Recomendacion visual y de layout, no implementacion.
- Mantener marca/paleta actual.
- Priorizar cambios pequenos aplicables en CSS/HTML existente.

Preguntas a responder:

- Panel mobile: sidebar compacto, colapsado, barra superior o reduccion de altura.
- Ficha mobile: reducir alto inicial de galeria, adelantar nombre/categoria/CTA o superponer informacion.
- Criterios minimos de aceptacion para Web Dev y QA.

## No tocar

- No implementar codigo.
- No redisenar desktop.
- No cambiar contenido ni contrato API.
- No proponer navegacion nueva compleja.

## Verificacion

- Documento breve con decision por superficie.
- Incluir criterios para mobile 390x844 y desktop regresion.
- Indicar si alguna recomendacion queda post-MVP.

## Handoff esperado

Crear `tasks/TASK-254-HANDOFF.md` con:

- Decision panel mobile.
- Decision ficha publica mobile.
- Reglas visuales minimas.
- Riesgos.
- Recomendacion de tareas Web Dev siguientes.
