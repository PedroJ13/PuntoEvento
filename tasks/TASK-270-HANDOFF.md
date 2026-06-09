# TASK-270 HANDOFF

## Resumen

Se agregó una línea resumen por expediente en admin con pendientes calculados en frontend usando datos ya cargados.

## Archivos modificados

- `admin.js`
- `admin.html`

## Cómo se calculan los conteos

Para el expediente seleccionado:

- Empresa pendiente:
  - `1` si `companyCanBeReviewed(company)` aplica (`pending` o `draft`).
  - `0` si la empresa no tiene acción principal pendiente.
- Servicios por revisar:
  - cuenta servicios del expediente con estado `draft` o `pending`.
- Fotos pendientes:
  - usa `serviceImages(service)` y `uploadsForCompany(companyId)`.
  - deduplica por `uploadId`, `id`, `fileName` o `previewUrl`.
  - cuenta imágenes sin estado o con `draft/pending`.

Formato:

```text
Empresa pendiente + 1 servicio por revisar + 2 fotos pendientes
```

## Feedback de acciones

- Servicio aprobado: `Servicio aprobado y publicado. Revisa el resumen del expediente para pendientes restantes.`
- Servicio rechazado: `Servicio rechazado. Revisa el resumen del expediente para pendientes restantes.`
- Empresa aprobada mantiene feedback de invitación/email existente.

## Verificación

- `node --check admin.js`
- Playwright smoke con endpoints internos simulados:
  - `adminSummary: Empresa pendiente + 1 servicio por revisar + 2 fotos pendientes`
- Admin login usó endpoint simulado, sin prompt nativo de auth.

## API adicional

No fue necesaria API adicional. Los conteos se calcularon con `companies`, `services` y `uploads` ya disponibles.

## Riesgos

- Si backend cambia la forma de representar imágenes, el dedupe puede requerir ajuste.
- Si endpoints internos ya filtran solo pendientes, el conteo coincide con visible; si en el futuro devuelven más estados, el filtro `draft/pending` seguirá evitando inflar pendientes.
