# TASK-285 HANDOFF

Equipo: QA Azure

Tarea validada: `TASK-285` - reintentar envio directo de servicio con portada usando empresa controlada.

## Resultado final

Resultado: **no aprobado**.

El flujo directo **sin imagen** funciona y deja el servicio en revision (`pending`). El flujo directo **con portada** no llega a revision porque el `PUT` al blob firmado falla por CORS/preflight contra Azure Blob Storage. El servicio queda creado como `draft`, sin foto confirmada, y la UI muestra un error generico.

Recomendacion release: **no release para el flujo de crear servicio con portada** hasta corregir CORS de Blob Storage y revalidar.

## Ambiente

- URL: `https://puntoeventocr.com/panel.html`
- Navegador: Chromium / Playwright headless
- Viewport: `1366x768`
- Fecha QA: `2026-06-10`
- Run QA: `20260610003337`
- Empresa controlada: `Aurisbel Pasteleria`
- Company ID: `company_3ef11610-54e6-44e8-84df-e4144ca563e8`

Nota de seguridad: este handoff no documenta password, cookies, tokens, SAS completos, URLs firmadas completas ni credenciales sensibles.

## Checks ejecutados

1. Login en panel empresa con cuenta controlada.
2. Crear servicio con portada PNG menor a 5 MB.
3. Presionar `Enviar servicio` directamente desde el formulario de creacion.
4. Revisar requests de creacion, upload, confirmacion y submit-review.
5. Crear servicio sin imagen y presionar `Enviar servicio` directamente.
6. Enviar manualmente desde borrador el servicio que habia quedado en `draft`.
7. Revisar estado visual final en panel.

## Datos de prueba

| Caso | Valor |
|---|---|
| Archivo portada | PNG minimo generado para QA |
| MIME | `image/png` |
| Tamano | aprox. `68` bytes |
| Servicio con portada | `QA TASK-285 portada 20260610003337` |
| Servicio sin imagen | `QA TASK-285 sin imagen 20260610003337` |

## Resultado por caso

### Caso A - Con portada, envio directo

Resultado: **falla / no aprobado**.

El formulario crea el servicio como borrador y obtiene firma de upload, pero el browser bloquea el `PUT` al blob firmado por CORS. Despues de esa falla no ocurre `uploads/confirm` ni `submit-review` en el flujo directo.

Estado observado:

- Servicio creado: `service_e5172fb3-cdcd-402b-ace1-60d5ff69782e`
- Slug: `qa-task-285-portada-20260610003337`
- Estado inicial tras create: `draft`
- Fotos: `0 archivo(s)`
- UI: muestra `No se pudo guardar el servicio...`
- Estado final despues de envio manual: `pending`

### Caso B - Sin imagen, envio directo

Resultado: **aprobado**.

El servicio se crea como borrador y el frontend llama inmediatamente a `submit-review`. El backend responde OK y el panel muestra el servicio como recibido.

Estado observado:

- Servicio creado: `service_1d53f215-1839-41f0-92ad-7990308e9f67`
- Estado tras submit directo: `pending`
- UI: `Recibido QA TASK-285 sin imagen 20260610003337`

### Caso C - Envio manual desde borrador del servicio con portada

Resultado: **aprobado con observacion**.

El servicio que quedo en draft por la falla de upload pudo enviarse manualmente a revision. Esto confirma que `submit-review` funciona para el servicio, pero la portada no quedo adjunta.

Estado observado:

- Servicio: `service_e5172fb3-cdcd-402b-ace1-60d5ff69782e`
- Request manual `submit-review`: `200`
- Estado final: `pending`
- UI: `Recibido QA TASK-285 portada 20260610003337`

## Secuencia de requests

### Login y carga inicial

| Metodo | Ruta | Status | Resultado |
|---|---|---:|---|
| POST | `/api/company-auth/login` | 200 | Login OK |
| GET | `/api/companies/me` | 200 | Empresa autenticada |
| GET | `/api/companies/me/services` | 200 | Servicios cargados |

Nota: la visibilidad del header `cookie` en la captura automatizada no fue confiable; sin embargo, las llamadas autenticadas posteriores devolvieron `200`, confirmando sesion establecida.

### Con portada, envio directo

| Metodo | Ruta | Status | Resultado |
|---|---|---:|---|
| POST | `/api/companies/me/services` | 201 | Servicio creado en `draft` |
| POST | `/api/uploads/sign` | 200 | Upload firmado generado |
| PUT | `https://storagepuntoevento.blob.core.windows.net/uploads-pending/.../<redacted>.png?<SAS_REDACTED>` | CORS blocked / `net::ERR_FAILED` | Preflight falla; sin `Access-Control-Allow-Origin` |
| POST | `/api/uploads/confirm` | no llamado | Bloqueado por falla del PUT |
| POST | `/api/companies/me/services/{serviceId}/submit-review` | no llamado | Bloqueado por falla del upload |

Upload ID observado: `upload_f1edd5cb-08ed-4944-9d25-01a5d2e6a7ad`.

Error de consola redactado:

```text
Access to fetch at '<signed blob URL redacted>' from origin 'https://puntoeventocr.com'
has been blocked by CORS policy: Response to preflight request doesn't pass access
control check: No 'Access-Control-Allow-Origin' header is present on the requested resource.
Failed to load resource: net::ERR_FAILED
```

### Sin imagen, envio directo

| Metodo | Ruta | Status | Resultado |
|---|---|---:|---|
| POST | `/api/companies/me/services` | 201 | Servicio creado en `draft` |
| POST | `/api/companies/me/services/service_1d53f215-1839-41f0-92ad-7990308e9f67/submit-review` | 200 | Servicio pasa a `pending` |
| GET | `/api/companies/me/services` | 200 | Panel refleja `pending` |

### Envio manual desde borrador

| Metodo | Ruta | Status | Resultado |
|---|---|---:|---|
| POST | `/api/companies/me/services/service_e5172fb3-cdcd-402b-ace1-60d5ff69782e/submit-review` | 200 | Servicio pasa a `pending` |

## Hallazgos

### P0

- Ninguno.

### P1

- **P1 - Upload de portada bloquea el envio directo a revision.**
  - Impacto: una empresa que crea un servicio con portada no completa el flujo MVP esperado `crear -> subir portada -> enviar a revision`.
  - Evidencia: `POST /api/companies/me/services` y `POST /api/uploads/sign` responden OK, pero el `PUT` al blob firmado falla por CORS/preflight. No se ejecutan `uploads/confirm` ni `submit-review`.
  - Clasificacion primaria: **Infra Azure**.
  - Motivo: el fallo ocurre en Azure Blob Storage por CORS desde `https://puntoeventocr.com`, no en un endpoint `/api`.

### P2

- **P2 - Mensaje de error generico en UI.**
  - La UI muestra `No se pudo guardar el servicio...`, pero no diferencia si fallo la portada, la firma, el upload o el envio a revision.
  - Clasificacion secundaria: **Web Dev**, solo para mejorar claridad despues de corregir el bloqueo principal.

### P3

- Ninguno nuevo.

## Clasificacion solicitada

| Criterio de la asignacion | Resultado |
|---|---|
| Si crea draft y frontend no llama `submit-review` | Ocurre solo porque falla antes el `PUT` de upload |
| Si endpoints OK pero UI error/inconsistente | No aplica como causa primaria |
| Si upload/sign, PUT, confirm o submit-review fallan | Falla el `PUT` al blob firmado |
| Si 403 en `/api` | No observado |
| Si solo falla con portada | Si, reproducido |

Responsable recomendado: **Infra Azure**.

Siguiente equipo sugerido: configurar/revisar CORS de Azure Blob Storage para permitir uploads desde `https://puntoeventocr.com` con preflight `OPTIONS` y metodo `PUT` sobre el contenedor/ruta de uploads pendientes. Revisar tambien si deben incluirse origen `https://www.puntoeventocr.com`, headers usados por el navegador y headers de blob requeridos por el SAS.

## Riesgos y pendientes

- Los dos servicios QA quedaron en estado `pending` en la empresa controlada:
  - `service_e5172fb3-cdcd-402b-ace1-60d5ff69782e` - pendiente, sin portada confirmada.
  - `service_1d53f215-1839-41f0-92ad-7990308e9f67` - pendiente, sin imagen.
- No se hizo cleanup ni rechazo desde admin porque QA no debe ejecutar acciones destructivas o de moderacion no solicitadas.
- Tras corregir CORS, QA debe repetir exactamente el caso con portada y confirmar que ocurren, en orden:
  1. `POST /api/companies/me/services`
  2. `POST /api/uploads/sign`
  3. `PUT <blob firmado>`
  4. `POST /api/uploads/confirm`
  5. `POST /api/companies/me/services/{serviceId}/submit-review`

## Recomendacion

No aprobar `TASK-285` para release todavia. Abrir tarea a **Infra Azure** para corregir CORS de Azure Blob Storage en uploads firmados desde el dominio productivo. Despues, reejecutar QA con portada y documentar si el servicio queda directamente en `pending` sin envio manual.

