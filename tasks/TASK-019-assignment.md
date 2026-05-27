# TASK-019: Infra verificacion Table Storage Companies

## Equipo encargado

Infra Azure.

## Mensaje para iniciar el chat

```text
Lee este archivo de asignacion: tasks/TASK-019-assignment.md.
Sigue las instrucciones y al terminar actualiza `tasks/TASK-019-HANDOFF.md`.
```

## Archivos que debe leer antes de trabajar

Obligatorios:

- `AGENTS.md`
- `chat-start/INFRA_AZURE.md`
- `docs/README.md`
- `docs/BACKLOG.md`
- `docs/API_CONTRACTS_MVP.md`
- `tasks/TASK-017-HANDOFF.md`
- `tasks/TASK-018-HANDOFF.md`

Opcionales utiles:

- `tasks/TASK-015-HANDOFF.md`
- `api/shared/config.js`

## Objetivo

Confirmar que el registro exitoso de TASK-018 quedo persistido correctamente en Azure Table Storage.

## Contexto

QA valido en Azure:

```text
POST https://zealous-field-08fdd720f.7.azurestaticapps.net/api/companies/register
```

Resultado exitoso:

```text
companyId: company_c0f05305-6b1d-4ba0-b4c2-cd987c324bd2
slug: qa-company-register-test
status: pending
plan: free
```

Infra habia observado en TASK-017 que la tabla `Companies` todavia no existia antes del primer `POST` valido. El codigo debe crearla al vuelo.

## Trabajo requerido

1. Confirmar si ahora existe la tabla:

```text
Companies
```

2. Confirmar si existe la entidad QA:

```text
company_c0f05305-6b1d-4ba0-b4c2-cd987c324bd2
```

3. Confirmar campos principales:

- `companyName` o campo equivalente de nombre.
- `email`.
- `whatsapp`.
- `province`.
- `canton`.
- `description`.
- `slug`.
- `status: pending`.
- `plan: free`.
- `createdAt`.
- `updatedAt`.

4. Confirmar que no se guardaron secretos en la entidad:

- Password plano.
- Tokens.
- Connection strings.
- Storage keys.

5. Revisar si conviene configurar explicitamente:

```text
AZURE_TABLE_COMPANIES=Companies
```

No cambiar la configuracion todavia si no es necesario; reportar recomendacion.

6. No borrar la entidad QA en esta tarea, salvo que Product/Architect lo autorice en una tarea posterior.

## Fuera de alcance

- No modificar codigo.
- No crear endpoints.
- No limpiar registros QA.
- No cambiar app settings salvo que sea indispensable para investigar.

## Criterios de aceptacion

- Tabla `Companies` confirmada o bloqueo documentado.
- Entidad QA confirmada o bloqueo documentado.
- Campos principales revisados.
- Recomendacion clara sobre `AZURE_TABLE_COMPANIES`.
- Riesgos documentados.

## Handoff requerido

Crear:

```text
tasks/TASK-019-HANDOFF.md
```

Debe incluir:

- Resultado general.
- Comandos/acciones ejecutadas.
- Existencia de tabla `Companies`.
- Existencia de entidad QA.
- Campos verificados.
- Si detecta datos sensibles, reportarlo como P1.
- Recomendacion sobre app setting `AZURE_TABLE_COMPANIES`.
- Recomendacion sobre limpieza futura del registro QA.

## Al finalizar

Responder:

```text
Termine TASK-019. Product/Architect debe leer `tasks/TASK-019-HANDOFF.md`.
```
