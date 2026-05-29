# TASK-113: QA local/estructural de `submit-review`

## Equipo asignado

QA.

## Contexto

`TASK-111` implemento:

```text
POST /api/companies/me/services/{serviceId}/submit-review
```

Tambien ajusto reglas de estado:

- crear servicio siempre guarda `draft`;
- la empresa no puede editar `status` directamente;
- editar contenido publico de un servicio `pending`, `published` o `rejected` lo devuelve a `draft`;
- `submit-review` solo cambia `draft` o `rejected` a `pending`.

## Archivos que debes leer

- `AGENTS.md`
- `chat-start/QA.md`
- `docs/API_CONTRACTS_MVP.md`
- `docs/DATA_MODEL.md`
- `docs/MVP_RELEASE_STATUS.md`
- `tasks/TASK-111-HANDOFF.md`
- `api/company-services-create/index.js`
- `api/company-services-update/index.js`
- `api/company-services-submit-review/index.js`
- `api/company-services-submit-review/function.json`
- helpers compartidos que uses para mocks/sesion/tablas.

## Objetivo

Validar local/estructuralmente que el endpoint `submit-review` y las reglas de status cumplen el contrato antes de deploy.

## Casos minimos

1. `POST /api/companies/me/services` con `status: "published"` debe crear `draft`.
2. `PATCH /api/companies/me/services/{serviceId}` solo con `status` debe responder `400`.
3. `PATCH` con `status` y campos editables debe ignorar `status`.
4. `PATCH` de servicio `published` con cambio de contenido publico debe devolverlo a `draft`.
5. `PATCH` de servicio `pending` o `rejected` con cambio de contenido publico debe devolverlo a `draft`.
6. `submit-review` desde `draft` con campos minimos completos debe responder `200` y dejar `pending`.
7. `submit-review` desde `rejected` con campos minimos completos debe responder `200` y dejar `pending`.
8. `submit-review` desde `published`, `pending` o `inactive` debe responder `409`.
9. `submit-review` sin campos minimos debe responder `400` e indicar faltantes.
10. Servicio de otra empresa debe responder `404`.
11. Sin sesion debe responder `401`.
12. Response exitoso de `submit-review` no debe incluir campos internos ni payload completo del servicio.

## Validaciones estructurales

- `node --check` de los archivos JS tocados.
- `function.json` valido con `ConvertFrom-Json`.
- Ruta esperada:

```text
companies/me/services/{serviceId}/submit-review
```

- Metodo esperado:

```text
POST
```

## Fuera de alcance

- Probar Azure real.
- Cambiar codigo.
- Cambiar `panel.html`.
- Probar UI de admin o panel.
- Hacer commit/push.

## Entregable

Crear:

```text
tasks/TASK-113-HANDOFF.md
```

Debe incluir:

- Resultado general: aprobado, bloqueado o requiere cambios.
- Archivos/endpoints revisados.
- Casos ejecutados y resultado.
- Evidencia de ruta/metodo.
- Riesgos pendientes.
- Recomendacion para siguiente tarea.

## Aviso al terminar

Cuando termines, avisa en el chat Product/Architect:

```text
Termine TASK-113. Product/Architect debe leer tasks/TASK-113-HANDOFF.md.
```
