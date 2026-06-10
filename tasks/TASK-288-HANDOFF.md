# TASK-288 HANDOFF

Equipo: QA Azure

Tarea validada: `TASK-288` - revalidar upload de portada y envio directo post-CORS.

## Resultado final

Resultado: **aprobado con pendiente de validacion posterior en catalogo publico**.

El flujo principal solicitado queda aprobado: desde `https://puntoeventocr.com/panel.html`, crear un servicio con portada y presionar `Enviar servicio` ejecuta upload firmado, confirmacion y envio a revision sin workaround manual. El servicio queda en `pending` y no reaparece el error generico `No se pudo guardar el servicio`.

No se valido publicacion en catalogo publico porque QA no tenia credencial admin en esta tarea para aprobar el servicio.

## Ambiente

- URL: `https://puntoeventocr.com/panel.html`
- Navegador: Chromium / Playwright headless
- Viewport: `1366x768`
- Fecha QA: `2026-06-10`
- Run QA: `20260610010017`
- Empresa controlada: `Aurisbel Pasteleria`
- Company ID: `company_3ef11610-54e6-44e8-84df-e4144ca563e8`

Nota de seguridad: este handoff no documenta password, cookies, tokens, SAS completos, URLs firmadas completas ni credenciales sensibles.

## Precondicion

`tasks/TASK-287-HANDOFF.md` existe y documenta CORS aplicado en Azure Blob Storage para:

- `https://puntoeventocr.com`
- `https://www.puntoeventocr.com`
- `https://zealous-field-08fdd720f.7.azurestaticapps.net`

La verificacion funcional de esta tarea confirma que el bloqueo CORS reportado en `TASK-285` ya no se reproduce.

## Datos de prueba

| Campo | Valor |
|---|---|
| Servicio | `QA TASK-288 portada 20260610010017` |
| Service ID | `service_4ca95c42-b4f8-408f-88a8-4a818f5e3c6f` |
| Upload ID | `upload_ea1e0426-9267-4560-824c-9eeb75060438` |
| Archivo portada | PNG minimo generado para QA |
| MIME | `image/png` |
| Tamano | menor a 5 MB |
| Categoria | `Queques` |
| Tipo evento | `Cumpleanos` |

## Checks ejecutados

1. Login en panel empresa con cuenta controlada.
2. Abrir `Mis servicios`.
3. Crear servicio QA nuevo con portada PNG.
4. Presionar `Enviar servicio` directamente desde el formulario.
5. Capturar secuencia de red esperada.
6. Confirmar estado final `pending`.
7. Confirmar que no aparece `No se pudo guardar el servicio`.

## Secuencia de requests

| Orden | Metodo | Ruta | Status | Resultado |
|---:|---|---|---:|---|
| 1 | POST | `/api/companies/me/services` | 201 | Servicio creado en `draft` |
| 2 | POST | `/api/uploads/sign` | 200 | Upload firmado generado |
| 3 | PUT | `https://storagepuntoevento.blob.core.windows.net/uploads-pending/.../<redacted>.png?<SAS_REDACTED>` | 201 | Blob subido OK |
| 4 | POST | `/api/uploads/confirm` | 201 | Upload confirmado para el servicio |
| 5 | POST | `/api/companies/me/services/service_4ca95c42-b4f8-408f-88a8-4a818f5e3c6f/submit-review` | 200 | Servicio pasa a revision |
| 6 | GET | `/api/companies/me/services` | 200 | Servicio confirmado en `pending` |

Requests iniciales sin sesion devolvieron `401` antes del login; se consideran ruido esperado de carga inicial. Despues del login, `/api/companies/me` y `/api/companies/me/services` respondieron `200`.

## Estado final observado

Consulta autenticada posterior:

```text
id: service_4ca95c42-b4f8-408f-88a8-4a818f5e3c6f
name: QA TASK-288 portada 20260610010017
status: pending
updatedAt: 2026-06-10T01:00:27.995Z
```

Estado visual en panel:

```text
Recibido
QA TASK-288 portada 20260610010017
Tu informacion fue recibida. Te avisaremos cuando este lista para publicarse.
```

El mensaje generico `No se pudo guardar el servicio` no aparecio.

## Hallazgos

### P0

- Ninguno.

### P1

- Ninguno. El P1 de `TASK-285` queda cerrado funcionalmente para el flujo de envio directo con portada.

### P2

- **P2 - Validacion publica de portada queda pendiente por falta de credencial admin en esta tarea.**
  - El upload fue confirmado por API (`uploads/confirm` 201) y el servicio quedo `pending`.
  - No se aprobo el servicio desde admin, por lo que no se confirmo todavia que la portada aparezca en catalogo publico despues de moderacion.

### P3

- Observacion menor: en el panel, el servicio pendiente muestra `Fotos 0 archivo(s)` porque ese contador parece reflejar fotos publicadas, no uploads pendientes. No bloqueo el criterio de esta tarea porque `uploads/confirm` respondio `201` y el flujo llego a `pending`.

## Clasificacion

| Criterio | Resultado |
|---|---|
| Upload firmado post-CORS | Aprobado |
| `PUT` a Blob Storage | Aprobado, `201` |
| `uploads/confirm` | Aprobado, `201` |
| `submit-review` | Aprobado, `200` |
| Estado final | Aprobado, `pending` |
| Error generico visible | No observado |
| Publicacion/catalogo con portada | Pendiente por falta de aprobacion admin |

## Riesgos o pendientes

- El servicio QA `service_4ca95c42-b4f8-408f-88a8-4a818f5e3c6f` quedo en revision (`pending`) y requiere moderacion posterior.
- Queda pendiente una prueba admin/publica si Product/QA entrega credencial admin o autoriza a aprobar este servicio QA:
  1. Aprobar servicio desde `admin.html`.
  2. Confirmar que la portada pasa de pendiente a publicada.
  3. Confirmar que el servicio aparece en catalogo publico con imagen visible.

## Recomendacion

Marcar `TASK-288` como aprobado para el objetivo principal post-CORS. El release puede avanzar respecto al bloqueo de upload de portada, con el pendiente P2 de validar portada en catalogo publico tras aprobacion admin.

