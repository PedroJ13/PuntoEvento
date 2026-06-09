# TASK-137: QA admin UI Round 2 post-fix

## Equipo asignado

QA.

## Superficie

```text
admin.html
admin.js
```

## Contexto

`TASK-132` cerro el P0 backend, pero dejo P1 admin UI porque el tab `Modelo nuevo` no mostraba pendientes reales en el expediente.

`TASK-135` corrigio la causa en frontend.

`TASK-136` desplego el fix y confirmo que Azure ya sirve:

```text
admin.js?v=14
admin.css?v=8
```

## Archivos que debes leer

- `AGENTS.md`
- `chat-start/QA.md`
- `tasks/TASK-132-HANDOFF.md`
- `tasks/TASK-135-HANDOFF.md`
- `tasks/TASK-136-HANDOFF.md`
- `docs/MVP_RELEASE_STATUS.md`

## Objetivo

Reintentar solo la parte UI admin que fallo en `TASK-132`: confirmar que el tab `Modelo nuevo` carga pendientes reales y muestra expediente por empresa con servicios/uploads relacionados.

## Casos minimos

1. Confirmar que `/admin.html` sirve `admin.js?v=14` y `admin.css?v=8`.
2. Login admin con credencial real QA.
3. Crear o usar datos QA pendientes controlados:
   - empresa pendiente;
   - servicio pendiente asociado;
   - upload pendiente asociado si aplica.
4. Abrir tab `Modelo nuevo`.
5. Confirmar contadores no quedan en cero cuando existen pendientes:
   - Companies;
   - Services;
   - Uploads si se crearon.
6. Confirmar que `Empresas con actividad` muestra la empresa QA.
7. Seleccionar empresa y confirmar que el expediente muestra:
   - detalle de empresa;
   - servicios asociados;
   - uploads asociados.
8. Confirmar mensajes/bloqueos visuales:
   - servicio no aprobable si empresa no esta `published`;
   - upload no aprobable si empresa no esta `published`;
   - upload de servicio no aprobable si servicio no esta `published`.
9. Validar desktop/mobile basico.
10. Aplicar limpieza soft de datos QA creados.

## Fuera de alcance

- Repetir toda la matriz API ya aprobada en `TASK-132`.
- Revalidar pagina publica o panel empresa, ya aprobados en `TASK-133` y `TASK-134`.
- Cambiar credenciales o variables Azure.

## Entregable

Crear:

```text
tasks/TASK-137-HANDOFF.md
```

Debe incluir:

- ambiente probado;
- datos QA creados y limpieza soft;
- resultado por caso;
- si el P1 de admin UI queda cerrado;
- riesgos o pendientes.

## Aviso al terminar

```text
Termine TASK-137. Product/Architect debe leer tasks/TASK-137-HANDOFF.md.
```
