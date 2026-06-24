# TASK-365: Backend/API cambio autenticado de password de empresa

## Equipo encargado

Ejecucion Tecnica

Modo de ejecucion: Backend/API

## Mensaje para iniciar el chat

```text
Lee este archivo de asignacion: tasks/TASK-365-assignment.md.
Implementa el cambio autenticado de password de empresa y al terminar crea `tasks/TASK-365-HANDOFF.md`.
```

## Archivos que debe leer antes de trabajar

Obligatorios:

- `AGENTS.md`
- `codex-project-templates/EJECUCION_TECNICA.md`
- `codex-project-templates/BACKEND_API.md`
- `codex-project-templates/CHAT_MODEL.md`
- `docs/MVP_RELEASE_STATUS.md`
- `docs/API_CONTRACTS_MVP.md`
- `docs/DATA_MODEL.md`
- `tasks/TASK-364-HANDOFF.md`

## Objetivo

Agregar endpoint backend para que una empresa autenticada cambie su password con password actual y nueva confirmacion.

## Contexto

La guia recomienda `POST /api/company-auth/password`. El backend actual usa Azure Functions, Table Storage, `scrypt`, sesiones server-side y cookie `pe_company_session`.

## Alcance

- Implementar validador compartido de password si no existe.
- Crear endpoint `POST /api/company-auth/password`.
- Requerir sesion activa.
- Verificar password actual.
- Rechazar campos controlados por frontend: `email`, `companyId`, `userId`.
- Guardar solo hash fuerte.
- Mantener sesion actual y revocar otras sesiones activas del mismo usuario/empresa si es viable en Table Storage.
- Actualizar `docs/API_CONTRACTS_MVP.md` si cambia contrato.

## Fuera de alcance

- No implementar reset por correo.
- No implementar UI.
- No tocar admin.
- No desplegar Azure.

## Criterios de aceptacion

- Password actual incorrecto responde `401 INVALID_CURRENT_PASSWORD` o contrato seguro equivalente.
- Password debil o confirmacion distinta responde `400`.
- Campos prohibidos se rechazan.
- Respuesta exitosa no expone password, hash, token, cookie cruda ni metadata interna.
- Tests o verificacion local cubren casos principales.

## Verificacion requerida

- `node --check` en archivos JS tocados.
- Tests unitarios si existen o se agregan.
- Prueba local/estructural del endpoint sin imprimir secretos.

## Handoff requerido

Crear:

```text
tasks/TASK-365-HANDOFF.md
```

Debe incluir formato extra de Ejecucion Tecnica.

