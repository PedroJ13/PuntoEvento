# TASK-196: Web Dev - admin por estado real de empresa y servicios

## Equipo asignado

Web Dev.

## Contexto

En la prueba con cliente, una empresa ya aprobada seguia mostrando accion de aprobar empresa aunque el pendiente real era de servicios. Esto puede hacer que el admin crea que esta aprobando la entidad equivocada.

## Tarea

Ajustar el admin para que las acciones principales dependan del estado real de la empresa y de sus servicios pendientes.

## Alcance

1. Si `company.status` esta pendiente, mostrar acciones de aprobar/rechazar empresa.
2. Si la empresa ya esta aprobada/publicada y tiene servicios pendientes, enfocar acciones en aprobar/rechazar servicios.
3. No mostrar `Aprobar empresa` como accion principal para una empresa ya aprobada.
4. Mostrar feedback especifico:
   - `Empresa aprobada`
   - `Servicio aprobado`
   - `Servicio rechazado`
5. Revisar tabs/navegacion legacy/demo del admin y ocultar lo que no aporte al flujo operativo MVP.
6. Mantener el flujo de `Modelo nuevo` como superficie principal.

## No tocar

- No cambiar endpoints backend salvo que se detecte contrato insuficiente; en ese caso documentar dependencia.
- No eliminar funcionalidades legacy sin dejarlo documentado en el handoff.
- No exponer secretos ni datos sensibles.

## Verificacion

- Empresa pendiente muestra acciones de empresa.
- Empresa aprobada con servicio pendiente muestra acciones de servicio.
- Feedback posterior a accion coincide con entidad afectada.
- Tabs no funcionales no distraen del flujo MVP.

## Handoff esperado

Crear `tasks/TASK-196-HANDOFF.md` con:

- Estados probados.
- Cambios de navegacion admin.
- Capturas o descripcion de feedback.
- Dependencias Backend/API si aparecen.
