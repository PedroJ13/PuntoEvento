# TASK-126: Admin interno - moderacion por expediente de empresa

## Equipo asignado

Web Dev - Admin interno.

## Superficie

```text
admin.html
admin.js
admin.css
```

## Contexto

Hallazgos Round 2:

- `PO2-002`: admin permite aprobar empresa, servicio e imagen de forma independiente sin validar dependencias.
- `PO2-003`: admin deberia mostrar servicios e imagenes al seleccionar empresa.

## Archivos que debes leer

- `AGENTS.md`
- `chat-start/WEB_DEV.md`
- `docs/PRODUCT_OWNER_TEST_FINDINGS_2026-05-29_ROUND_2.md`
- `docs/PRODUCT_OWNER_TEST_FINDINGS_2026-05-29_ROUND_2_TRIAGE.md`
- `docs/API_CONTRACTS_MVP.md`
- `admin.html`
- `admin.js`
- `admin.css`

## Objetivo

Cambiar la moderacion del admin de listas globales independientes hacia una vista por expediente de empresa.

## Alcance

1. Mantener contadores/listas globales como resumen o entrada.
2. Permitir seleccionar una empresa pendiente/publicable.
3. Mostrar detalle de empresa seleccionada.
4. Mostrar servicios asociados a esa empresa.
5. Mostrar uploads asociados por empresa/servicio si la data disponible lo permite.
6. Acciones contextualizadas:
   - aprobar/rechazar empresa;
   - aprobar/rechazar servicios de esa empresa;
   - aprobar/rechazar imagenes relacionadas.
7. Bloquear u ocultar acciones invalidas desde UI:
   - servicio no aprobable si empresa no esta `published`;
   - upload de servicio no aprobable si empresa/servicio no estan `published`.
8. Mensajes claros cuando una accion no se puede ejecutar por dependencia.

## Fuera de alcance

- Crear endpoints nuevos si no existen.
- Cambiar reglas API; eso va en `TASK-127`.
- Hacer commit/push.

## Dependencia

La UI debe asumir que `TASK-127` agregara validacion API. Si alguna data falta en listados internos, documentar endpoint necesario.

## Entregable

Crear:

```text
tasks/TASK-126-HANDOFF.md
```

Debe incluir:

- Resultado general.
- Archivos modificados.
- Flujo de expediente.
- Acciones bloqueadas/permitidas.
- Dependencias API.
- Verificacion desktop/mobile.

## Aviso al terminar

```text
Termine TASK-126. Product/Architect debe leer tasks/TASK-126-HANDOFF.md.
```
