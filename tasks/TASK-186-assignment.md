# TASK-186: Infra/API - aplicar soft cleanup de SMASH Costa Rica

## Equipo asignado

Infra Azure con apoyo Backend/API si hace falta.

## Contexto

`TASK-183` inventario 32 empresas y encontro una candidata clara no QA/no test visible publicamente:

```text
Company ID: company_c3b9f3ad-3a8b-4f81-b9c3-7c5ee6dbb60d
Slug: smash-costa-rica
Nombre: SMASH Costa Rica
Status: published
Servicios publicados: 2
```

Servicios relacionados:

```text
service_988ac5bf-0175-4267-9ad1-49c4dadd957a / smash-servicio-1
service_e2730253-e8be-4895-a12b-768f0813389b / smash-servicio-2
```

## Tarea

Aplicar soft cleanup conservador de `SMASH Costa Rica` y sus dos servicios, solo si Product / Architect / Release aprueba explicitamente esta limpieza.

## Alcance

- Confirmar antes de tocar datos que la aprobacion Product existe en el chat o documento de tarea.
- Cambiar `Companies.status` de `smash-costa-rica` a `rejected`.
- Guardar `rejectionReason=Prelaunch cleanup non-QA data` o razon equivalente.
- Actualizar `updatedAt`.
- Cambiar los dos servicios relacionados a `rejected`.
- Guardar razon equivalente y `updatedAt`.
- Verificar que busquedas publicas por `SMASH` y `smash-costa-rica` no devuelven resultados de esa empresa.

## No tocar

- No hard delete.
- No borrar blobs.
- No tocar empresas QA/test/demo.
- No tocar empresas dudosas.
- No imprimir emails completos ni secretos.
- No tocar app settings.

## Verificacion

- Conteo antes/despues.
- IDs/slugs afectados.
- `GET /api/public/services?q=SMASH&limit=20` no muestra `smash-costa-rica`.
- `GET /api/public/services?q=smash-costa-rica&limit=20` no muestra `smash-costa-rica`.
- Handoff con evidencia redactada.

## Handoff esperado

Crear `tasks/TASK-186-HANDOFF.md` con aprobacion Product usada, entidades afectadas, conteo antes/despues, verificaciones publicas, riesgos y confirmacion de que no hubo hard delete.
