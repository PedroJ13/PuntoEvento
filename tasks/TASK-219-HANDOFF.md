# TASK-219 - QA Handoff

Equipo: QA

Tarea validada: `TASK-219: QA - validar renombre a Punto Evento CR local/estructural`

## Ambiente

- Repo root confirmado: `C:/Users/pj13e/Digital Products/Punto Evento`
- Ambiente probado: local/estructural
- URL local: `http://127.0.0.1:60224`
- Fecha QA: 2026-06-04

## Resultado

**Aprobado con observaciones.**

El renombre visible a `Punto Evento CR` esta aplicado en frontend estatico y backend/email copy dentro del alcance local/estructural. No se detectan P0/P1/P2 nuevos ni errores JS obvios relacionados al cambio. La observacion queda como P3/riesgo aceptable: el logo raster de referencia puede seguir mostrando internamente `Punto Evento` hasta que exista asset final.

## Checks ejecutados

- Lectura de contexto:
  - `chat-start/QA.md`
  - `AGENTS.md`
  - `docs/MVP_RELEASE_STATUS.md`
  - `docs/MVP_CRITERIA.md`
  - `tasks/TASK-217-HANDOFF.md`
  - `tasks/TASK-218-HANDOFF.md`
- Sintaxis:
  - `node --check app.js`: OK.
  - `node --check panel.js`: OK.
  - `node --check admin.js`: OK.
  - `node --check api/shared/email.js`: OK.
  - `node --check api/shared/config.js`: OK.
  - `node --check api/shared/adminAuth.js`: OK.
- Diff hygiene:
  - `git diff --check -- index.html app.js panel.html panel.js admin.html admin.js api/shared/email.js api/shared/config.js api/shared/adminAuth.js docs/API_CONTRACTS_MVP.md`: OK, solo warnings esperados LF/CRLF.
- Busqueda textual:
  - `rg -n -P "Punto Evento(?! CR)" index.html app.js panel.html panel.js admin.html admin.js api/shared docs/API_CONTRACTS_MVP.md`: sin resultados.
  - `rg -n -i "punto evento" ...`: solo resultados con `Punto Evento CR`.
- Servidor local:
  - `index.html`: `200`.
  - `panel.html`: `200`.
  - `admin.html`: `200`.
- Playwright local:
  - Desktop `1280x820`.
  - Mobile `390x844`.

## Resultado por superficie

### Pagina publica

Resultado: **aprobada local/estructuralmente**.

- `<title>`: `Punto Evento CR | Demo propuesta`.
- Meta description: `Demo local de una propuesta para Punto Evento CR.`
- Header visible: `Punto Evento CR`.
- Header `aria-label`: `Punto Evento CR demo`.
- Copy generado por `app.js` para WhatsApp/registro/moderacion usa `Punto Evento CR`.
- Desktop `1280x820`: sin overflow horizontal.
- Mobile `390x844`: sin overflow horizontal.
- No se detecto texto visible `Punto Evento` sin `CR`.

Observacion: en servidor estatico local aparece un `404` de recurso no critico. No se observo `pageerror` ni error JS atribuible al renombre.

### Panel empresa

Resultado: **aprobado local/estructuralmente**.

- `<title>`: `Panel empresa | Punto Evento CR`.
- Brand `aria-label`: `Punto Evento CR panel empresa`.
- Logo `alt`: `Punto Evento CR - Catalogo digital de proveedores para eventos`.
- Copy de datos generales y error `403` en `panel.js` usa `Punto Evento CR`.
- `panel.html` referencia `panel.css?v=11` y `panel.js?v=11`.
- Desktop `1280x820`: sin overflow horizontal.
- Mobile `390x844`: sin overflow horizontal.
- Sin errores JS obvios en modo demo local.
- No se detecto texto visible `Punto Evento` sin `CR`.

### Admin interno

Resultado: **aprobado local/estructuralmente**.

- `<title>`: `Admin | Punto Evento CR`.
- `admin.html` conserva `admin.css?v=13` y `admin.js?v=18`.
- Desktop `1280x820`: sin overflow horizontal.
- Mobile `390x844`: sin overflow horizontal.
- Sin errores JS obvios al cargar localmente.
- No se detecto texto visible `Punto Evento` sin `CR`.

### Backend / emails

Resultado: **aprobado local/estructuralmente**.

- Emails/copy revisados en `api/shared/email.js` usan `Punto Evento CR`:
  - Registro legacy: `Nueva empresa registrada en Punto Evento CR`.
  - Registro modelo nuevo: `Nueva empresa registrada en Punto Evento CR`.
  - Servicio enviado a revision: `Servicio enviado a revision en Punto Evento CR`.
  - Cotizacion/contacto: `Nueva solicitud desde Punto Evento CR`.
  - Activacion/invitacion: `Tu empresa fue aprobada en Punto Evento CR`.
  - Link visible: `Abrir Punto Evento CR`.
- Fallback de remitente visible en `api/shared/config.js`: `Punto Evento CR`.
- Realm Basic Admin en `api/shared/adminAuth.js`: `Punto Evento CR Admin`.
- `docs/API_CONTRACTS_MVP.md` queda alineado con asuntos de `Punto Evento CR`.
- No se cambio contrato funcional segun revision estructural: no se modifican rutas, dominios, storage keys, IDs, secrets ni modelos.

## Usos remanentes justificados

- `Reference Images/Propeusta logo e imagen de pagina.jpeg` puede contener texto raster interno `Punto Evento`.
- Se acepta como remanente justificado porque `TASK-217` documento que no se debe editar el logo raster hasta tener asset final.
- Handoffs y documentos historicos pueden mencionar `Punto Evento` para explicar el renombre o riesgos previos; no son superficie visible runtime.

## Hallazgos

### P0

Ninguno.

### P1

Ninguno.

### P2

Ninguno.

### P3

1. **Logo raster pendiente de asset final con marca `Punto Evento CR`**
   - Severidad: P3.
   - Impacto: observacion visual/post-MVP acotada; no rompe funcionalidad ni contratos.
   - Estado: aceptable para deploy si Product mantiene documentado que el asset final vendra despues.

## Evidencia resumida

```text
appJsCheck=OK
panelJsCheck=OK
adminJsCheck=OK
emailJsCheck=OK
configJsCheck=OK
adminAuthJsCheck=OK
frontendOldBrandSearch=0
apiOldBrandSearch=0
indexStatus=200
panelStatus=200
adminStatus=200
public.desktop.title=Punto Evento CR | Demo propuesta
public.desktop.oldBrandVisible=false
public.desktop.overflowX=false
public.mobile.oldBrandVisible=false
public.mobile.overflowX=false
panel.desktop.title=Panel empresa | Punto Evento CR
panel.desktop.logoAlt=Punto Evento CR - Catalogo digital de proveedores para eventos
panel.desktop.oldBrandVisible=false
panel.desktop.overflowX=false
panel.mobile.oldBrandVisible=false
panel.mobile.overflowX=false
admin.desktop.title=Admin | Punto Evento CR
admin.desktop.oldBrandVisible=false
admin.desktop.overflowX=false
admin.mobile.oldBrandVisible=false
admin.mobile.overflowX=false
```

## Riesgos o pendientes

- Esta aprobacion es local/estructural; no equivale a aprobacion Azure.
- No se enviaron emails reales con ACS en esta tarea.
- Infra debe revisar si Azure tiene `NOTIFICATION_EMAIL_FROM_NAME` configurado manualmente como `Punto Evento`; si existe, debe actualizarse a `Punto Evento CR` porque el fallback de codigo no sobreescribe app settings.
- El logo raster final con `Punto Evento CR` queda pendiente fuera del alcance.

## Recomendacion para Infra Azure TASK-220

**Proceder con `TASK-220`.**

QA aprueba el renombre local/estructural y recomienda deploy a Azure, cuidando:

- Publicar frontend con `app.js?v=28`, `panel.css?v=11`, `panel.js?v=11`, `admin.js?v=18` y `admin.css?v=13`.
- Desplegar backend/email copy actualizado.
- Confirmar o corregir app setting `NOTIFICATION_EMAIL_FROM_NAME` a `Punto Evento CR` si existe.
- Ejecutar `TASK-221` para revalidacion Azure post-deploy, incluyendo al menos smoke visual de publica/panel/admin y evidencia de emails/copy si el entorno lo permite.
