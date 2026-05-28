# TASK-054 Handoff - QA/Infra Azure smoke DELETE company services

## Objetivo

Validar en Azure real:

```text
DELETE /api/companies/me/services/{serviceId}
```

usando una sesion real de empresa, cookie real y Table Storage real.

## Resultado general

Estado: BLOQUEADO por precondicion.

No se ejecuto el smoke Azure real porque la precondicion de la asignacion no esta cumplida en este workspace:

```text
Product/Architect/User debe haber commiteado y pusheado el bloque DELETE antes de ejecutar este smoke.
```

Evidencia local:

```text
HEAD: 8885e6e Add company services update endpoint
SHA: 8885e6ed0f475a8a4e93d909e59b1f4cf056a3b0
git ls-files api/company-services-delete -> sin salida
git status api/company-services-delete -> ?? api/company-services-delete/
```

Esto indica que los archivos del endpoint DELETE aun no estan trackeados en el commit local actual, por lo que no hay base confiable para asumir que el DELETE ya fue pusheado/desplegado en Azure.

## URL base prevista

```text
https://zealous-field-08fdd720f.7.azurestaticapps.net
```

No se hicieron requests contra Azure en esta pasada para evitar validar un ambiente que probablemente no contiene el endpoint DELETE desplegado.

## Empresa QA objetivo

```text
companyId: company_c0f05305-6b1d-4ba0-b4c2-cd987c324bd2
email: qa-company-register-test@example.com
slug: qa-company-register-test
```

## Confirmacion booleana de credenciales

Las credenciales admin si cargan desde `local-secrets/qa-admin.ps1`:

```text
ADMIN_USERNAME_SET=True
ADMIN_PASSWORD_SET=True
```

No se registraron valores reales de usuario/password.

## Status codes obtenidos

No se obtuvieron status codes de Azure en TASK-054 porque el smoke fue bloqueado antes de ejecutar requests.

| Caso | Resultado |
| --- | --- |
| Crear invitacion real | No ejecutado |
| Aceptar invitacion | No ejecutado |
| Crear servicio QA con `POST` | No ejecutado |
| Desactivar servicio con `DELETE` | No ejecutado |
| `GET` mostrando `status: inactive` | No ejecutado |
| `DELETE` inexistente | No ejecutado |
| Logout | No ejecutado |
| `DELETE` despues de logout | No ejecutado |

## ServiceId creado y desactivado

No aplica. No se creo ni desactivo servicio real en esta pasada.

## Confirmacion de no fuga metadata/ranking

No confirmada en Azure real para `DELETE` porque no hubo respuesta `200`.

La confirmacion local/estructural previa esta documentada en `tasks/TASK-053-HANDOFF.md`.

## Confirmacion de GET con status inactive

No confirmada en Azure real.

## Confirmacion logout y posterior 401

No confirmada en Azure real.

## Riesgos restantes

- `DELETE /api/companies/me/services/{serviceId}` todavia no esta validado post-deploy con cookie real.
- El endpoint DELETE aparece como archivos no trackeados localmente; Product/Architect debe commitear y pushear antes del smoke.
- Si se ejecutara smoke ahora, podria dar falso negativo por endpoint ausente en Azure o falso positivo contra un despliegue no trazable.
- Siguen pendientes limpieza/desactivacion real de datos QA existentes una vez desplegado DELETE.

## Recomendacion

Corregir antes: Product/Architect/User debe commitear y pushear el bloque `DELETE /api/companies/me/services/{serviceId}` y esperar el deploy exitoso.

Despues de eso, QA/Infra Azure debe repetir TASK-054 para validar:

- `DELETE` responde `200`.
- El servicio queda `status: inactive`.
- `GET /api/companies/me/services` refleja `inactive`.
- `DELETE` inexistente responde `404`.
- Logout invalida cookie y `DELETE` posterior responde `401`.

No avanzar a upload firmado de imagenes hasta completar este smoke Azure.
