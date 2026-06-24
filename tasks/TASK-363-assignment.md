# TASK-363: QA Azure del encuadre completo de imagenes en servicios

## Equipo encargado

QA

## Mensaje para iniciar el chat

```text
Lee este archivo de asignacion: tasks/TASK-363-assignment.md.
Valida en Azure el ajuste desplegado por TASK-362 y al terminar crea `tasks/TASK-363-HANDOFF.md`.
```

## Archivos que debe leer antes de trabajar

Obligatorios:

- `AGENTS.md`
- `codex-project-templates/QA.md`
- `codex-project-templates/CHAT_MODEL.md`
- `docs/MVP_RELEASE_STATUS.md`
- `docs/QA_TEST_PLAN.md`
- `tasks/TASK-362-HANDOFF.md`

## Objetivo

Confirmar en `https://puntoeventocr.com` que panel empresa y admin muestran imagenes de servicios completas dentro del espacio disponible.

## Contexto

El ajuste busca evitar que imagenes grandes, verticales u horizontales queden recortadas al agregar, editar o revisar servicios.

## Alcance

- Validar assets publicados: `panel.css?v=15` y `admin.css?v=17`.
- Validar visualmente panel empresa con cuenta QA autorizada, si existe.
- Validar admin interno con credencial QA autorizada, si existe.
- Si no hay credenciales, validar marcadores/HTML/CSS y declarar bloqueo funcional.

## Fuera de alcance

- No crear datos reales sin autorizacion.
- No aprobar/rechazar empresas o servicios salvo que el guion QA lo indique.
- No modificar codigo.
- No probar password-flows.

## Criterios de aceptacion

- Assets nuevos servidos en Azure.
- Imagenes de servicios no se recortan en espacios de gestion/revision.
- No aparece overflow visual nuevo en desktop/mobile.
- No se reabre ningun P0/P1 del panel empresa o admin.

## Verificacion requerida

- Smokes HTTP no destructivos.
- Revision visual desktop/mobile.
- Evidencia de una imagen horizontal y una vertical si hay datos QA disponibles.

## Handoff requerido

Crear:

```text
tasks/TASK-363-HANDOFF.md
```

Debe incluir:

- Ambiente.
- Resultado: aprobado / no aprobado / bloqueado / aprobado con observaciones.
- P0/P1.
- P2/P3.
- Evidencia.
- Siguiente recomendado.

