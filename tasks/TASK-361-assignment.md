# TASK-361: QA local del encuadre completo de imagenes en servicios

## Equipo encargado

QA

## Mensaje para iniciar el chat

```text
Lee este archivo de asignacion: tasks/TASK-361-assignment.md.
Valida el ajuste local de imagenes completas en servicios y al terminar crea `tasks/TASK-361-HANDOFF.md`.
```

## Archivos que debe leer antes de trabajar

Obligatorios:

- `AGENTS.md`
- `codex-project-templates/QA.md`
- `codex-project-templates/CHAT_MODEL.md`
- `docs/MVP_RELEASE_STATUS.md`
- `docs/QA_TEST_PLAN.md`

## Objetivo

Validar localmente que las imagenes grandes o con proporciones no cuadradas se vean completas en el panel empresa y admin, sin recorte visual.

## Contexto

Se detecto que al subir o revisar imagenes de servicios, cuando la imagen es muy grande o tiene otra proporcion, solo se ve una parte dentro del espacio disponible. Hay un ajuste local pendiente de validar en:

- `panel.css`
- `panel.html`
- `admin.css`
- `admin.html`

## Alcance

- Validar panel empresa en crear servicio, editar servicio y listado de servicios.
- Validar admin interno en imagenes de moderacion/revision de servicios.
- Revisar desktop y mobile de forma local/estructural.

## Fuera de alcance

- No modificar codigo.
- No desplegar Azure.
- No probar flujos que creen datos reales en produccion.
- No tocar password-flows.

## Criterios de aceptacion

- Las imagenes se ven completas dentro del marco disponible.
- No hay recorte por `object-fit: cover` en los espacios de gestion/revision de servicios.
- El cambio no rompe layout, botones, textos ni responsive basico.
- `panel.html` referencia `panel.css?v=15`.
- `admin.html` referencia `admin.css?v=17`.

## Verificacion requerida

- Revisar diff local de `panel.css`, `admin.css`, `panel.html`, `admin.html`.
- Ejecutar validaciones estaticas razonables.
- Si se usa navegador local, probar al menos una imagen horizontal y una vertical.

## Handoff requerido

Crear:

```text
tasks/TASK-361-HANDOFF.md
```

Debe incluir:

- Ambiente.
- Resultado: aprobado / no aprobado / bloqueado / aprobado con observaciones.
- P0/P1.
- P2/P3.
- Evidencia.
- Siguiente recomendado.

