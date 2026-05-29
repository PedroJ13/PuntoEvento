# TASK-108: Rotar credencial admin expuesta en prueba PO

## Equipo asignado

Infra Azure / Product.

## Contexto

Product Owner documento en `docs/PRODUCT_OWNER_TEST_FINDINGS_2026-05-29.md` que la credencial admin fue expuesta durante la prueba.

Esto es P0 operacional antes de invitar empresas reales.

## Archivos que debes leer

- `AGENTS.md`
- `chat-start/INFRA_AZURE.md`
- `docs/PRODUCT_OWNER_TEST_FINDINGS_2026-05-29.md`
- `docs/MVP_RELEASE_STATUS.md`
- `tasks/TASK-101-HANDOFF.md`
- `local-secrets/qa-admin.ps1` si existe localmente.

## Objetivo

Rotar `ADMIN_PASSWORD` en Azure Static Web Apps y actualizar el canal local seguro sin exponer secretos.

## Alcance

1. Rotar `ADMIN_PASSWORD` en Azure Static Web Apps.
2. Mantener `ADMIN_USERNAME` si no hay razon para cambiarlo.
3. Actualizar `local-secrets/qa-admin.ps1` con formato PowerShell valido.
4. Confirmar que `local-secrets/qa-admin.ps1` sigue ignorado por git.
5. Validar endpoint interno con header:

```text
X-Punto-Admin-Credential
```

6. Validar que credencial invalida sigue devolviendo `401`.
7. No pegar password, header completo, token, cookie ni secretos en handoff.

## Verificacion minima

Endpoint sugerido:

```text
GET https://zealous-field-08fdd720f.7.azurestaticapps.net/api/internal/companies/pending
```

Esperado:

- Credencial valida: `200`.
- Credencial invalida: `401`.

## Fuera de alcance

- Cambiar codigo.
- Cambiar UI.
- Ejecutar prueba Product Owner.
- Hacer commit/push.

## Entregable

Crear:

```text
tasks/TASK-108-HANDOFF.md
```

Debe incluir:

- Resultado general.
- Si `ADMIN_PASSWORD` fue rotado, sin valor.
- Verificacion con credencial valida e invalida.
- Estado de `local-secrets/qa-admin.ps1`.
- Riesgos pendientes.
- Recomendacion para re-prueba.

## Aviso al terminar

Cuando termines, avisa en el chat Product/Architect:

```text
Termine TASK-108. Product/Architect debe leer tasks/TASK-108-HANDOFF.md.
```
