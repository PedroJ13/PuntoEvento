# TASK-270: Web Dev - agregar resumen de pendientes en admin

## Equipo asignado

Web Dev.

## Contexto

La revision UX del 2026-06-08 detecto que el admin concentra muchas decisiones: empresa, servicios e imagenes. La recomendacion es que cada expediente empiece con una linea de prioridad que ayude a operar sin errores.

El admin ya carga empresas, servicios y uploads pendientes del modelo nuevo. Para MVP, esta tarea debe intentar resolverlo en frontend con los datos existentes.

Documentos base:

- `tasks/DISENO_UX_WEB_PAGE_FLOWS_REVIEW_2026-06-08.md`
- `docs/API_CONTRACTS_MVP.md`

## Tarea

Agregar una linea resumen por expediente en admin con pendientes reales.

## Alcance

1. En expediente/admin, mostrar una linea tipo:
   - `Empresa pendiente + 2 servicios por revisar + 5 fotos pendientes`
2. Calcular conteos usando datos ya cargados por admin si estan disponibles.
3. Despues de aprobar/rechazar, mantener o mejorar feedback visible:
   - que se publico;
   - que quedo pendiente;
   - si se envio invitacion/email.
4. Si los datos existentes no permiten calcular conteos confiables, documentar la limitacion en el handoff y proponer tarea Backend/API separada.

## No tocar

- No cambiar endpoints internos salvo que sea imposible completar la tarea sin API; en ese caso no implementar backend, solo documentar el bloqueo.
- No cambiar permisos admin.
- No cambiar credenciales.
- No cambiar flujos de aprobacion/rechazo.
- No publicar tokens, hashes, cookies ni secretos.

## Verificacion

- Admin carga sin prompt nativo de auth.
- Expediente muestra resumen entendible.
- Conteos coinciden con lo visible en expediente.
- Approve/reject siguen funcionando.
- `git diff --check` sobre archivos tocados.

## Handoff esperado

Crear `tasks/TASK-270-HANDOFF.md` con:

- Archivos modificados.
- Como se calculan los conteos.
- Evidencia local/estructural.
- Confirmacion de si fue necesario o no proponer API adicional.
