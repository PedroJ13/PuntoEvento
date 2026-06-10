# TASK-289 HANDOFF

Equipo: QA Azure

Tarea validada: `TASK-289` - validar portada publica despues de aprobacion admin.

## Resultado final

Resultado: **aprobado**.

El servicio QA creado en `TASK-288` fue aprobado desde admin usando el mecanismo local seguro `local-secrets/qa-admin.ps1` sin documentar credenciales. Despues de la aprobacion, el servicio aparece publicamente con `coverUrl` presente, la imagen responde `200 image/png`, y la ficha publica carga la portada real en el carrusel, no el placeholder.

## Ambiente

- Admin: `https://puntoeventocr.com/admin.html`
- Publico: `https://puntoeventocr.com/`
- API publica servicios: `https://puntoeventocr.com/api/public/services?limit=100`
- API ficha publica: `https://puntoeventocr.com/api/public/companies/aurisbel-pasteleria-341388?service=qa-task-288-portada-20260610010017`
- Ficha publica UI: `https://puntoeventocr.com/#proveedor/aurisbel-pasteleria-341388/qa-task-288-portada-20260610010017`
- Fecha QA: `2026-06-10`
- Servicio objetivo: `service_4ca95c42-b4f8-408f-88a8-4a818f5e3c6f`
- Nombre servicio: `QA TASK-288 portada 20260610010017`
- Empresa: `Aurisbel Pasteleria`

Nota de seguridad: este handoff no documenta credenciales admin, cookies, tokens, SAS ni URLs firmadas.

## Checks ejecutados

1. Leer `tasks/TASK-289-assignment.md`.
2. Revisar `tasks/TASK-288-HANDOFF.md`.
3. Leer mecanismo de credencial admin local `local-secrets/qa-admin.ps1` sin copiar secretos al handoff.
4. Aprobar el servicio QA pendiente desde endpoint/admin interno.
5. Consultar API publica de servicios.
6. Consultar API publica de ficha de empresa con el servicio seleccionado.
7. Validar que la URL publica de portada responde como imagen.
8. Abrir la ficha publica y confirmar que el carrusel usa imagen publica, no placeholder.

## Aprobacion admin

```text
POST /api/internal/services/company_3ef11610-54e6-44e8-84df-e4144ca563e8/service_4ca95c42-b4f8-408f-88a8-4a818f5e3c6f/approve -> 200
```

Resultado:

```text
status: published
```

El servicio ya no aparece como pendiente despues de la aprobacion.

## Evidencia API publica

### Catalogo publico

```text
GET /api/public/services?limit=100 -> 200
```

Resultado:

```text
count: 4
target.id: service_4ca95c42-b4f8-408f-88a8-4a818f5e3c6f
target.name: QA TASK-288 portada 20260610010017
target.slug: qa-task-288-portada-20260610010017
target.companySlug: aurisbel-pasteleria-341388
target.coverUrl: present
```

### Ficha publica de empresa

```text
GET /api/public/companies/aurisbel-pasteleria-341388?service=qa-task-288-portada-20260610010017 -> 200
```

Resultado:

```text
slug: aurisbel-pasteleria-341388
selectedServiceSlug: qa-task-288-portada-20260610010017
serviceCount: 4
target.status: published
target.coverUrl: present
```

### Imagen publica

La portada publicada asociada al servicio responde:

```text
HEAD <coverUrl redacted> -> 200
content-type: image/png
content-length: 70
```

No se documenta la URL completa para evitar copiar rutas internas de blob innecesarias al handoff.

## Evidencia UI publica

Ruta validada:

```text
https://puntoeventocr.com/#proveedor/aurisbel-pasteleria-341388/qa-task-288-portada-20260610010017
```

Estado observado:

```text
hash: #proveedor/aurisbel-pasteleria-341388/qa-task-288-portada-20260610010017
title: QA TASK-288 portada 20260610010017
targetNameVisible: true
imageSrcType: public-image
imageComplete: true
naturalWidth: 1
naturalHeight: 1
```

La imagen cargada no es `assets/images/fallback-provider.svg`, por lo que no cae al placeholder.

## Hallazgos

### P0

- Ninguno.

### P1

- Ninguno.

### P2

- Ninguno abierto para esta tarea. El pendiente P2 de `TASK-288` queda cerrado.

### P3

- Observacion menor: la imagen QA usada es un PNG minimo de 1x1 px, por eso `naturalWidth/naturalHeight` son `1x1`. Esto es esperable por el archivo de prueba y no afecta la validacion funcional de publicacion de portada.

## Clasificacion solicitada

| Criterio | Resultado |
|---|---|
| Servicio aprobado desde admin | Aprobado |
| Servicio aparece en API publica | Aprobado |
| Ficha publica selecciona el servicio | Aprobado |
| Servicio expone imagen publica | Aprobado |
| Portada responde como imagen | Aprobado, `200 image/png` |
| UI publica usa imagen real | Aprobado |
| Placeholder | No observado |

## Riesgos o pendientes

- El servicio QA quedo publicado y visible en la ficha publica de Aurisbel Pasteleria. Si Product no quiere mantenerlo visible, se requiere tarea separada de moderacion/cleanup no destructivo.
- No se hizo cleanup porque la asignacion prohibe acciones destructivas sin tarea separada.

## Recomendacion

Marcar `TASK-289` como aprobado. El tramo pendiente de portada publica post-aprobacion queda cerrado: upload, confirmacion, aprobacion admin y publicacion visual de portada funcionan en Azure.

