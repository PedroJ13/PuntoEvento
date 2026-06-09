# TASK-221 - QA Handoff

Equipo: QA

Tarea validada: `TASK-221: QA - revalidar renombre Punto Evento CR en Azure`

## Ambiente

- Repo root confirmado: `C:/Users/pj13e/Digital Products/Punto Evento`
- Ambiente probado: Azure real
- URL: `https://zealous-field-08fdd720f.7.azurestaticapps.net`
- Fecha QA: 2026-06-04

## Resultado

**Aprobado con observaciones.**

Azure sirve el renombre visible a `Punto Evento CR` en pagina publica, panel empresa, admin y assets frontend esperados. No se detectan P0/P1/P2 nuevos. No se ejecutaron emails reales porque QA no tenia un flujo/mailbox controlado para esta tarea; queda como riesgo operativo a confirmar en una prueba controlada posterior si Product lo requiere.

## Assets / versiones observadas

- `/`: `200`, contiene `app.js?v=28` y `Punto Evento CR`.
- `/app.js?v=28`: `200`, contiene `Punto Evento CR`.
- `/panel.html`: `200`, contiene `panel.css?v=11`, `panel.js?v=11` y `Punto Evento CR`.
- `/panel.js?v=11`: `200`, contiene `Punto Evento CR`.
- `/admin.html`: `200`, contiene `Admin | Punto Evento CR`.
- `/api/public/services?limit=1`: `200`.
- Busqueda en assets servidos:
  - `/`: 0 usos visibles de `Punto Evento` sin `CR`.
  - `/app.js?v=28`: 0 usos visibles de `Punto Evento` sin `CR`.
  - `/panel.html`: 0 usos visibles de `Punto Evento` sin `CR`.
  - `/panel.js?v=11`: 0 usos visibles de `Punto Evento` sin `CR`.
  - `/admin.html`: 0 usos visibles de `Punto Evento` sin `CR`.

## Checks ejecutados

- HTTP Azure:
  - `/`
  - `/app.js?v=28`
  - `/panel.html`
  - `/panel.css?v=11`
  - `/panel.js?v=11`
  - `/admin.html`
  - `/api/public/services?limit=1`
- Playwright contra Azure:
  - Publica desktop `1280x820`.
  - Panel desktop `1280x820`.
  - Admin desktop `1280x820`.
  - Publica mobile `390x844`.
  - Panel mobile `390x844`.
  - Admin mobile `390x844`.

## Resultado por superficie

### Pagina publica

Resultado: **aprobada**.

- `<title>` observado: `Punto Evento CR | Demo propuesta`.
- Header visible: `Punto Evento CR`.
- `aria-label` de marca: `Punto Evento CR demo`.
- Meta/copy servido desde `/` y `/app.js?v=28` contiene `Punto Evento CR`.
- Desktop `1280x820`: sin overflow horizontal.
- Mobile `390x844`: sin overflow horizontal.
- No se detecto texto visible `Punto Evento` sin `CR`.
- Sin errores JS en la carga observada.

### Panel empresa

Resultado: **aprobado**.

- `<title>` observado: `Panel empresa | Punto Evento CR`.
- Brand `aria-label`: `Punto Evento CR panel empresa`.
- Logo `alt`: `Punto Evento CR - Catalogo digital de proveedores para eventos`.
- `panel.html` sirve `panel.css?v=11` y `panel.js?v=11`.
- `panel.js?v=11` contiene copy `Punto Evento CR`.
- Desktop `1280x820`: sin overflow horizontal.
- Mobile `390x844`: sin overflow horizontal.
- No se detecto texto visible `Punto Evento` sin `CR`.
- Sin errores JS en la carga observada.

### Admin interno

Resultado: **aprobado**.

- `<title>` observado: `Admin | Punto Evento CR`.
- `admin.html` sirve `admin.css?v=13` y `admin.js?v=18`.
- Desktop `1280x820`: sin overflow horizontal.
- Mobile `390x844`: sin overflow horizontal.
- No se detecto texto visible `Punto Evento` sin `CR`.
- Sin errores JS en la carga observada.

### Backend / emails

Resultado: **aprobado estructuralmente por deploy, no validado con envio real**.

- `TASK-220-HANDOFF.md` confirma deploy de backend/email copy y app setting `NOTIFICATION_EMAIL_FROM_NAME=Punto Evento CR`.
- QA no ejecuto envio real de cotizacion, activacion/invitacion ni notificaciones internas porque no habia mailbox/entidad QA controlada indicada para evitar modificar datos reales o generar correos no solicitados.
- No se observaron cambios de contrato en smokes publicos: `/api/public/services?limit=1` responde `200`.

## Usos remanentes justificados

- El logo raster de referencia puede contener texto interno `Punto Evento`; queda aceptado como P3 porque la tarea no exige editar raster sin asset final.
- Handoffs/docs historicos pueden mencionar `Punto Evento` para explicar el renombre; no son superficie runtime.

## Hallazgos

### P0

Ninguno.

### P1

Ninguno.

### P2

Ninguno nuevo.

### P3

1. **Emails no revalidados con envio real en esta tarea**
   - Severidad: P3.
   - Motivo: no habia flujo/mailbox QA controlado disponible en la asignacion.
   - Mitigacion: `TASK-220` confirma codigo desplegado y app setting de remitente visible actualizado; ejecutar prueba controlada si Product necesita evidencia de inbox.

2. **Logo raster pendiente de asset final**
   - Severidad: P3.
   - Remanente visual documentado; no bloquea el renombre textual/metadata.

## Evidencia resumida

```text
azureCommitEsperado=main/3a56d898b2f35bf04d271bbdb2c62dde632d666b
public.status=200
public.hasAppV28=true
public.title=Punto Evento CR | Demo propuesta
public.hasBrandCR=true
public.visibleOldBrand=false
public.desktop.overflowX=false
public.mobile.overflowX=false
appJsV28.status=200
appJsV28.hasBrandCR=true
appJsV28.visibleOldBrand=false
panel.status=200
panel.hasCssV11=true
panel.hasJsV11=true
panel.title=Panel empresa | Punto Evento CR
panel.brandLabel=Punto Evento CR panel empresa
panel.logoAlt=Punto Evento CR - Catalogo digital de proveedores para eventos
panel.visibleOldBrand=false
panel.desktop.overflowX=false
panel.mobile.overflowX=false
panelJsV11.hasBrandCR=true
admin.status=200
admin.title=Admin | Punto Evento CR
admin.visibleOldBrand=false
admin.desktop.overflowX=false
admin.mobile.overflowX=false
apiPublicServices.status=200
emailsRealSend=not_executed_no_controlled_mailbox
```

## Riesgos o pendientes

- Esta aprobacion no declara go comercial nuevo; queda para Product / Architect / Release.
- Si Product requiere evidencia de inbox, programar una prueba controlada de cotizacion y/o invitacion con correo QA.
- Mantener pendiente el reemplazo del logo raster por asset final `Punto Evento CR`.

## Recomendacion para Product / Architect / Release

**Aceptar `TASK-221` como aprobado con observaciones.**

El renombre visible en Azure queda validado sin P0/P1/P2 nuevos. Las observaciones P3 no bloquean pre-lanzamiento controlado.
