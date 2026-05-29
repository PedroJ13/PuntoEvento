# TASK-109: Decisiones P1 de producto/datos por findings PO

## Equipo asignado

Product / Architect / Release.

## Contexto

Product Owner documento hallazgos P1/P2 en:

```text
docs/PRODUCT_OWNER_TEST_FINDINGS_2026-05-29.md
```

Antes de mandar mas cambios a Web Dev/API, hay que cerrar decisiones para evitar implementar reglas contradictorias.

## Archivos que debes leer

- `AGENTS.md`
- `docs/PRODUCT_OWNER_TEST_FINDINGS_2026-05-29.md`
- `docs/DATA_MODEL.md`
- `docs/API_CONTRACTS_MVP.md`
- `docs/MVP_RELEASE_STATUS.md`
- `docs/BACKLOG.md`
- `data/event-types.json`
- `panel.html`
- `admin.html`

## Objetivo

Crear una decision de producto/datos que cierre los P1 principales:

1. Campos de contacto/sociales de empresa:
   - obligatorios;
   - opcionales;
   - publicos;
   - internos.
2. Taxonomia:
   - confirmar `Categoria` como tipo de servicio;
   - confirmar `Tipos de evento` como ocasiones;
   - definir ejemplos permitidos y evitar duplicidad.
3. Flujo de revision de servicio:
   - guardar como borrador;
   - enviar automaticamente a revision;
   - boton explicito `Enviar a revision`.
4. Imagenes de servicio:
   - solo cover;
   - cover + galeria;
   - limites MVP.
5. Moderacion admin:
   - listas globales vs expediente de empresa;
   - recomendacion MVP.
6. Reglas de cascada:
   - aprobar/rechazar empresa, servicios e imagenes;
   - evitar cascadas silenciosas.

## Entregable de decision

Crear:

```text
docs/PRODUCT_DECISIONS_PO_FINDINGS_2026-05-29.md
```

Actualizar si aplica:

- `docs/DATA_MODEL.md`
- `docs/API_CONTRACTS_MVP.md`
- `docs/MVP_RELEASE_STATUS.md`
- `docs/BACKLOG.md`

## Criterio de salida

El handoff debe permitir crear tareas concretas para:

- Panel empresa.
- Web publico.
- Admin UI.
- Backend/API.
- QA.

## Fuera de alcance

- Cambiar codigo.
- Rotar credenciales.
- Ejecutar prueba Product Owner.
- Hacer commit/push.

## Entregable

Crear:

```text
tasks/TASK-109-HANDOFF.md
```

Debe incluir:

- Decisiones tomadas.
- Docs modificados.
- Tareas recomendadas siguientes por equipo.
- Riesgos aceptados o no aceptados.

## Aviso al terminar

Cuando termines, avisa en el chat Product/Architect:

```text
Termine TASK-109. Product/Architect debe leer tasks/TASK-109-HANDOFF.md.
```
