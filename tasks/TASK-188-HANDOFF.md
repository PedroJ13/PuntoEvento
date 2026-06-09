# TASK-188: Backend/API - corregir login recurrente con emails duplicados

## Estado

Completada local/estructuralmente.

## Archivos cambiados

- `api/shared/companyAuth.js`
- `api/company-auth-login/index.js`
- `docs/API_CONTRACTS_MVP.md`
- `tasks/TASK-188-HANDOFF.md`

## Regla final para emails duplicados

`POST /api/company-auth/login` ya no usa el primer usuario global encontrado por email.

Nueva regla:

1. Lista todos los usuarios con el email normalizado.
2. Considera solo usuarios `active`.
3. Verifica el password contra cada candidato sin exponer hashes.
4. Descarta candidatos cuya empresa no exista.
5. Permite solo empresas `pending` o `published`.
6. Si hay mas de un candidato valido, elige el mas reciente por `passwordSetAt`, luego `updatedAt`, luego `createdAt`.
7. Si ningun candidato verifica password, responde `401`.
8. Si el password verifica pero ninguna empresa candidata tiene estado permitido, responde `403`.

## Checks ejecutados

Sintaxis:

```text
node --check api/shared/companyAuth.js
node --check api/company-auth-login/index.js
```

Resultado: OK.

Diff check:

```text
git diff --check -- api/shared/companyAuth.js api/company-auth-login/index.js docs/API_CONTRACTS_MVP.md
```

Resultado: OK; solo warnings LF/CRLF.

## Prueba de reproduccion

Prueba local/estructural con mocks:

- Dos usuarios `active` comparten `owner@example.com`.
- `company_wrong` tiene hash que no verifica.
- `company_right` tiene password correcto y empresa `published`.
- Login con password correcto retorna `company_right`.
- Login con password incorrecto retorna `401`.

Resultado:

```json
{
  "okStatus": 200,
  "okCompanyId": "company_right",
  "badStatus": 401,
  "badError": "Invalid email or password"
}
```

## Seguridad

- No se imprimen hashes, tokens, cookies, connection strings ni metadata interna.
- Respuesta de password incorrecto sigue siendo generica.
- No se toca UI, app settings, email provider, admin moderation ni limpieza de datos.

## Riesgos

- No se probo contra Azure real en esta ronda.
- La busqueda por email sigue escaneando `Users` por propiedad; aceptable para MVP/pre-lanzamiento, pero no escala.
- Si dos usuarios activos con el mismo email y mismo password pertenecen a empresas permitidas, se elige el mas recientemente activado/actualizado. Esta regla esta documentada para evitar comportamiento no deterministico.

## Recomendacion para QA TASK-189

Validar en Azure:

```text
1. Activar empresa desde link recibido.
2. Confirmar que activacion crea sesion y carga panel.
3. Cerrar sesion.
4. Login recurrente con mismo email/password debe responder 200 y cargar la empresa correcta.
5. Password incorrecto debe responder 401.
6. Confirmar que responses/logs no exponen passwordHash, tokens, cookies ni secretos.
```
