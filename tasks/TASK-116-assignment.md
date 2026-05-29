# TASK-116: Panel empresa con `Enviar a revision`

## Equipo asignado

Web Dev.

## Contexto

Product Owner encontro que el formulario de servicio en panel empresa era confuso:

- `Estado` aparece como campo editable, pero la empresa no debe editarlo manualmente.
- `Cantidad de fotos` no ayuda porque las fotos deben manejarse con cover/galeria.
- Hace falta una accion clara `Enviar a revision`.

Decisiones cerradas:

- `docs/PRODUCT_DECISIONS_PO_FINDINGS_2026-05-29.md`
- `docs/API_CONTRACTS_MVP.md`
- `docs/DATA_MODEL.md`

Backend/API implemento y QA local aprobo:

- `tasks/TASK-111-HANDOFF.md`
- `tasks/TASK-113-HANDOFF.md`

## Archivos que debes leer

- `AGENTS.md`
- `chat-start/WEB_DEV.md`
- `docs/PRODUCT_OWNER_TEST_FINDINGS_2026-05-29.md`
- `docs/PRODUCT_DECISIONS_PO_FINDINGS_2026-05-29.md`
- `docs/API_CONTRACTS_MVP.md`
- `docs/DATA_MODEL.md`
- `docs/MVP_RELEASE_STATUS.md`
- `tasks/TASK-111-HANDOFF.md`
- `tasks/TASK-113-HANDOFF.md`
- `panel.html`
- `panel.js`
- `panel.css`
- cualquier helper JS usado por el panel.

## Objetivo

Ajustar el panel empresa para que crear/editar servicio guarde `draft` y exista una accion explicita `Enviar a revision` que llame:

```text
POST /api/companies/me/services/{serviceId}/submit-review
```

## Alcance

1. Quitar `Estado` como control editable del formulario de servicio.
2. Mostrar estado actual como lectura, badge o texto contextual.
3. Crear/editar servicio debe guardar como borrador y no enviar `status`.
4. Agregar accion `Enviar a revision` para servicios `draft` o `rejected`.
5. Al enviar a revision:
   - llamar al endpoint `submit-review`;
   - mostrar estado de carga;
   - manejar `200`, `400`, `401`, `404` y `409`;
   - actualizar UI a `pending` si responde OK.
6. Validar/comunicar campos minimos antes de enviar:
   - nombre;
   - categoria;
   - al menos un tipo de evento;
   - descripcion;
   - precio desde.
7. Remover o reemplazar `Cantidad de fotos` si sigue visible como campo manual.
8. Dejar claro el flujo: guardar borrador primero, luego enviar a revision.

## Fuera de alcance

- Implementar administracion completa de cover/galeria si requiere endpoints nuevos.
- Cambiar backend.
- Cambiar admin interno.
- Hacer commit/push.

## Verificacion esperada

- Prueba local/demo con mock o API real si esta disponible:
  - crear servicio no envia `status`;
  - editar servicio no envia `status`;
  - servicio `draft` permite `Enviar a revision`;
  - falta de campos minimos muestra error claro;
  - respuesta `200` actualiza estado a `pending`;
  - respuesta `409` muestra mensaje entendible.
- Smoke responsive basico del panel.

## Entregable

Crear:

```text
tasks/TASK-116-HANDOFF.md
```

Debe incluir:

- Resultado general.
- Archivos modificados.
- Cambios UI.
- Contrato API usado.
- Verificacion ejecutada.
- Riesgos pendientes.
- Recomendacion para QA.

## Aviso al terminar

Cuando termines, avisa en el chat Product/Architect:

```text
Termine TASK-116. Product/Architect debe leer tasks/TASK-116-HANDOFF.md.
```
