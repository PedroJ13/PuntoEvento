# TASK-279: Infra Azure - permitir registro desde dominio propio

## Equipo asignado

Infra Azure.

## Contexto

Despues del cambio de dominio, la pagina publica carga correctamente en:

```text
https://puntoeventocr.com/
https://www.puntoeventocr.com/
```

La API publica de lectura tambien responde `200`:

```text
https://puntoeventocr.com/api/public/services?limit=5
https://www.puntoeventocr.com/api/public/services?limit=5
```

Pero el registro publico de empresa falla desde el dominio nuevo. QA Product ejecuto `POST /api/companies/register` con payload valido y header `Origin`:

```text
Origin: https://puntoeventocr.com -> 403
Origin: https://www.puntoeventocr.com -> 403
Origin: https://zealous-field-08fdd720f.7.azurestaticapps.net -> 201
```

Esto apunta a configuracion de origen permitido en Azure, no a un problema visual del formulario.

## Tarea

Ajustar configuracion Azure para que el registro de empresa funcione desde el dominio propio.

## Alcance

1. Revisar app settings de Azure Static Web Apps / Functions.
2. Actualizar `ALLOWED_ORIGINS` para incluir como minimo:
   - `https://puntoeventocr.com`
   - `https://www.puntoeventocr.com`
   - `https://zealous-field-08fdd720f.7.azurestaticapps.net`
3. Revisar `APP_PUBLIC_URL` y dejarlo apuntando al dominio canonico aprobado:
   - recomendado: `https://puntoeventocr.com`
4. Confirmar que no se imprimen secretos ni connection strings en la evidencia.
5. Limpiar o dejar rechazado el dato QA creado durante comparacion:
   - slug: `qa-domain-old-host-20260609`
   - companyId: `company_848b9fa5-51f8-4221-aea8-98542dc8bdf0`

## No tocar

- No cambiar codigo de frontend/backend salvo que la configuracion no sea suficiente y se documente antes.
- No borrar datos reales.
- No hard-delete de blobs.
- No publicar valores secretos de Azure.

## Verificacion minima

Ejecutar y documentar:

```text
GET https://puntoeventocr.com/ -> 200
GET https://www.puntoeventocr.com/ -> 200
GET https://puntoeventocr.com/api/public/services?limit=5 -> 200
GET https://www.puntoeventocr.com/api/public/services?limit=5 -> 200
POST https://puntoeventocr.com/api/companies/register con Origin apex -> 201
POST https://www.puntoeventocr.com/api/companies/register con Origin www -> 201
```

Si se crean empresas QA para validar, dejarlas rechazadas o documentar claramente los IDs para limpieza posterior.

## Handoff esperado

Crear `tasks/TASK-279-HANDOFF.md` con:

- Configuracion ajustada sin secretos.
- Resultado de cada smoke.
- IDs de empresas QA creadas y estado final.
- Recomendacion para QA.
