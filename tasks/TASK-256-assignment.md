# TASK-256: Web Dev - tildes y consistencia transversal de copy visible

## Equipo asignado

Web Dev.

## Contexto

Copy / Gramatica detecto falta sistematica de tildes/signos en copy visible. Esto afecta percepcion de calidad de marca antes del pre-lanzamiento.

Decision Product / Architect / Release:

Usar trato neutro internacional por ahora para evitar mezclar voseo y tuteo:

```text
Encuentra, envia, revisa, ingresa
```

Corregir tildes donde aplique:

```text
Encuentra, música, decoración, envía, ubicación, graduación, años, categorías, descripción, más rápido, cotización, página, revisión, después, único, básico, campañas, optimización, sesión, información, imágenes, galería, automáticamente.
```

## Tarea

Corregir tildes, signos y consistencia de copy visible transversal sin tocar claves tecnicas.

## Alcance

- `index.html`
- `app.js`
- `panel.html`
- `panel.js`
- `admin.html`
- `admin.js`
- `data/categories.json`
- `data/event-types.json`

## No tocar

- No cambiar nombres de variables.
- No cambiar ids, clases, slugs, endpoints, claves JSON tecnicas o valores usados como contrato.
- No cambiar copy de emails; eso va en `TASK-257`.
- No cambiar comportamiento.

## Verificacion

- Busqueda local de palabras sin tilde frecuentes.
- QA visual basica publica/panel/admin.
- Confirmar que no se rompieron filtros/categorias por cambios a valores tecnicos.

## Handoff esperado

Crear `tasks/TASK-256-HANDOFF.md` con:

- Lista de superficies corregidas.
- Palabras/zonas que se dejaron sin tocar por ser tecnicas.
- Evidencia de validacion.
- Riesgos.
