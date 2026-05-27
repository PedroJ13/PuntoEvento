# TASK-035: Rotar credenciales admin y repetir invitacion real

## Equipo encargado

Infra Azure con apoyo de Product/Owner.

## Mensaje para iniciar el chat

```text
Lee este archivo de asignacion: tasks/TASK-035-assignment.md.
Sigue las instrucciones y al terminar actualiza `tasks/TASK-035-HANDOFF.md`.
```

## Objetivo

Resolver el `401 Unauthorized` al llamar autenticado:

```text
POST /api/internal/company-invites
```

TASK-034 intento leer `ADMIN_USERNAME` y `ADMIN_PASSWORD` desde Azure app settings en memoria, pero la llamada autenticada devolvio `401`. Esto sugiere credenciales incorrectas, desalineadas o no efectivas en runtime.

## Reglas de seguridad

No escribir en chat, handoff, docs ni commits:

- `ADMIN_USERNAME`
- `ADMIN_PASSWORD`
- Authorization header.
- `inviteUrl` completo.
- Token real.
- Cookie completa.
- Storage keys.
- Connection strings.

## Trabajo requerido

1. Product/Owner e Infra deben confirmar si las credenciales admin actuales son conocidas y correctas.
2. Si hay duda, rotar en Azure Static Web Apps app settings:

```text
ADMIN_USERNAME=<nuevo valor>
ADMIN_PASSWORD=<nuevo valor fuerte>
```

3. Guardar/aplicar cambios en Azure y esperar a que el environment quede listo.
4. Probar sin auth:

```text
POST /api/internal/company-invites
```

Esperado:

```text
401 Unauthorized
```

5. Probar con Basic Auth real, sin imprimir credenciales:

```text
POST /api/internal/company-invites
```

Body:

```json
{
  "companyId": "company_c0f05305-6b1d-4ba0-b4c2-cd987c324bd2",
  "email": "qa-company-register-test@example.com"
}
```

Esperado:

```text
201
```

6. Si devuelve `201`, continuar el flujo completo:

```text
accept-invite -> Set-Cookie -> reuso de token falla -> logout con cookie
```

7. Si vuelve a devolver `401`, revisar:

- Que Azure guardo app settings en el environment correcto.
- Que la Static Web App recargo runtime despues del cambio.
- Que el Basic Auth se construye como `username:password` en UTF-8 y Base64.
- Que no hay espacios invisibles o saltos de linea en username/password.

## Handoff requerido

Crear:

```text
tasks/TASK-035-HANDOFF.md
```

Debe incluir:

- Resultado general.
- Si se rotaron credenciales: si/no, sin valores.
- Status de llamada sin auth.
- Status de llamada con auth.
- Si se creo invitacion: `inviteId`, `companyId`, `email`, `role`, `expiresAt`.
- Resultado de `accept-invite`.
- Flags de cookie, sin valor completo.
- Resultado de reuso de token.
- Resultado de logout.
- Validacion Table Storage si aplica.
- Riesgos.
- Recomendacion para Product/Architect.

## Al finalizar

Responder:

```text
Termine TASK-035. Product/Architect debe leer `tasks/TASK-035-HANDOFF.md`.
```
