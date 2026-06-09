# TASK-269: Web Dev - mejorar confirmacion de registro y estados del panel empresa

## Equipo asignado

Web Dev.

## Contexto

El flujo correcto separa registro, aprobacion interna, email de activacion y login recurrente. La revision UX detecto que la empresa puede confundirse si espera crear password inmediatamente al registrarse.

Tambien recomienda labels de estados mas entendibles para empresas. Hay una decision previa: hacia empresas no debemos exponer lenguaje fuerte de revision/moderacion/aprobacion manual cuando se pueda evitar.

Documentos base:

- `tasks/DISENO_UX_WEB_PAGE_FLOWS_REVIEW_2026-06-08.md`
- `docs/DECISION_LOG.md`
- `docs/DATA_MODEL.md`

## Tarea

Ajustar copy post-registro y labels/microcopy de estados visibles para empresas, sin cambiar los estados internos.

## Alcance

1. En confirmacion post-registro de empresa, usar copy claro:
   - `Recibimos tu solicitud.`
   - `Te enviaremos las instrucciones de acceso por correo cuando tu cuenta este lista.`
2. Revisar labels visibles de servicios en panel empresa.
3. Mantener estados tecnicos backend:
   - `draft`
   - `pending`
   - `published`
   - `rejected`
   - `inactive`
4. Propuesta de labels visibles:
   - `draft` -> `Borrador`
   - `pending` -> `Recibido` o `Preparando publicacion`
   - `published` -> `Publicado`
   - `rejected` -> `Necesita cambios`
   - `inactive` -> `Inactivo`
5. Ajustar microcopy de ayuda para que la empresa sepa si debe esperar, editar o reenviar.

## No tocar

- No renombrar estados en backend.
- No cambiar contratos API.
- No cambiar flujo de invitacion, activacion, login ni email.
- No usar copy visible que prometa publicacion automatica.
- No abrir nuevas vistas del panel.

## Verificacion

- Registro exitoso comunica claramente que el acceso llega luego por correo.
- Panel empresa mantiene acciones existentes.
- Estados visibles no muestran strings tecnicos.
- Servicios siguen guardando/enviando igual.
- `git diff --check` sobre archivos tocados.

## Handoff esperado

Crear `tasks/TASK-269-HANDOFF.md` con:

- Archivos modificados.
- Mapping final de estados visibles.
- Confirmacion de que los estados API no cambiaron.
- Riesgos o textos pendientes para Product si aplica.
