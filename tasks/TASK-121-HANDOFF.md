# TASK-121 Handoff

## Resultado general

Aprobado condicionado para prueba Product Owner.

El ambiente Azure esta tecnicamente listo para ejecutar el guion demo limpio de Product Owner, pero los listados globales de admin siguen contaminados con datos `QA TASK-*` porque `TASK-120` solo hizo inventario/propuesta y no ejecuto limpieza.

Recomendacion:

```text
Product Owner puede probar si usa el guion enfocado en la empresa demo limpia.
Si la demo incluye revisar listados globales de admin, ejecutar/aceptar soft cleanup antes.
```

## Condicion de prueba usada

`TASK-120` no ejecuto limpieza. Se uso la decision documentada:

- no hard delete desde tareas sin aprobacion explicita;
- usar empresa demo limpia para Product Owner;
- tratar la contaminacion QA en admin como limitacion aceptable solo si el guion se enfoca en una empresa concreta.

## Checklist ejecutado

### 1. Guion demo limpio

Resultado: aprobado.

`docs/PRODUCT_OWNER_TEST_SCRIPT.md` contiene:

```text
Demo Owner Jardines del Sol
demo-owner-jardines@example.test
Guardar borrador
Enviar a revision
```

El guion incluye advertencias para no usar entidades `QA TASK-*`.

Nota: el texto `QA TASK-*` aparece solo como instruccion de no usar esos datos, no como datos demo.

### 2. Pagina publica carga

Resultado: aprobado.

```json
{
  "Path": "/index.html",
  "Status": 200
}
```

### 3. Panel empresa carga

Resultado: aprobado.

```json
{
  "Path": "/panel.html",
  "Status": 200
}
```

### 4. Admin carga y credencial vigente

Resultado: aprobado.

```json
{
  "Path": "/admin.html",
  "Status": 200,
  "InvalidCredentialStatus": 401,
  "ValidCredentialInternalEndpoints": "OK"
}
```

Se valido acceso interno con `X-Punto-Admin-Credential` construido desde `local-secrets/qa-admin.ps1`. No se imprimieron credenciales.

### 5. Datos QA no aparecen en busqueda publica

Resultado: aprobado.

Consultas contra `/api/public/services`:

```json
[
  {
    "Query": "QA TASK-114",
    "Status": 200,
    "Count": 0
  },
  {
    "Query": "QA TASK-115",
    "Status": 200,
    "Count": 0
  },
  {
    "Query": "QA TASK-117",
    "Status": 200,
    "Count": 0
  },
  {
    "Query": "Demo Owner Jardines del Sol",
    "Status": 200,
    "Count": 0
  }
]
```

Esto es esperado antes de publicar la empresa/servicio demo.

### 6. Datos QA en admin global

Resultado: requiere aceptacion de limitacion.

Listados internos actuales:

```json
{
  "PendingCompanyCount": 6,
  "PendingServiceCount": 8,
  "PendingUploadCount": 5,
  "QaCompanyCount": 3,
  "QaServiceCount": 6,
  "QaUploadCount": 0
}
```

Empresas QA aun visibles en moderacion:

```text
QA TASK-114 Estado Envio 1780089144348
QA TASK-114 Otra Empresa 20260529210924
QA TASK-114 Doble Submit 20260529210616
```

Servicios QA aun visibles en moderacion:

```text
QA TASK-117 1780090739740 Mesa dulce UI
QA TASK-117 1780090739740 Incompleto
QA TASK-117 1780090671429 Mesa dulce UI
QA TASK-117 1780090671429 Incompleto
QA TASK-115 Incompleto 1780089046
QA TASK-115 Mesa Dulce 1780089046
```

Impacto:

- No bloquea busqueda publica.
- Si bloquea una demo admin completamente limpia.
- Para demo admin, usar guion enfocado en `Demo Owner Jardines del Sol` o ejecutar soft cleanup antes.

### 7. Smoke corto del flujo demo

Resultado: aprobado.

Para no consumir los datos exactos del guion Product Owner, se creo una entidad temporal de pre-demo:

```json
{
  "CompanyId": "company_96f18439-db71-4621-92a4-c476368a666d",
  "CompanyName": "Pre Demo Owner Smoke 1780093358",
  "CompanyMeStatus": "pending",
  "ServiceId": "service_955e814c-baa3-4a7f-83c7-66abf3a8f72d",
  "CreateStatus": "draft",
  "SubmitStatusCode": 200,
  "SubmitStatus": "pending",
  "PendingInternalMatchCount": 1,
  "PendingInternalStatus": "pending"
}
```

Validado:

- registro/empresa temporal;
- invitacion/sesion;
- crear servicio como `draft`;
- enviar a revision;
- servicio aparece como `pending` en endpoint interno.

No se aprobo/rechazo desde admin porque el guion dice `si aplica`; esta tarea era pre-demo y no debe modificar moderacion mas alla del smoke necesario.

## Bloqueadores para Product Owner

Bloqueador si la demo pretende mostrar admin global limpio:

- Hay datos `QA TASK-*` pendientes en Companies y Services.
- TASK-120 recomienda soft cleanup, pero aun no fue ejecutado.

No bloquea si la prueba se limita al guion limpio:

- Pagina publica carga.
- Panel carga.
- Admin carga con credencial vigente.
- Datos QA no aparecen en busqueda publica.
- Flujo tecnico de borrador/revision funciona.

## Riesgos aceptables

- Admin usa credencial compartida en prueba controlada.
- La demo puede convivir con datos QA si Product Owner no navega listados globales fuera del guion.
- La empresa demo real aun debe registrarse durante la prueba o prepararse antes.
- Se creo un registro temporal `Pre Demo Owner Smoke 1780093358` para validar el smoke; debe entrar en limpieza posterior junto con datos QA/pre-demo.

## Recomendacion

Product Owner puede probar con condicion:

```text
Usar estrictamente el guion de docs/PRODUCT_OWNER_TEST_SCRIPT.md y la empresa Demo Owner Jardines del Sol.
```

Para una demo admin limpia o antes de invitar empresas reales:

```text
Ejecutar soft cleanup de TASK-120 y luego repetir la verificacion de admin global.
```

Decision QA:

```text
Owner puede probar: SI, con limitacion aceptada sobre admin global.
Owner puede probar admin global limpio: NO, hasta limpiar QA TASK-*.
```
