# TASK-278 HANDOFF

Equipo: QA

Tarea validada: `TASK-278` - QA Azure post-deploy del fix de overflow en ficha publica.

## Resultado final

Resultado: **aprobado**.

El P2 visual detectado en `TASK-274` queda cerrado en Azure. La ficha publica ya no presenta overflow horizontal en desktop `1366x768` ni mobile `390x844`, y los elementos criticos `.contact-note.full-note` y `Ver más servicios` quedan dentro del viewport.

Recomendacion: **go para mostrar la ficha publica real a usuarios externos dentro del alcance MVP**, con el riesgo aceptado de que esta validacion uso servicio mock/controlado porque el catalogo real de Azure sigue vacio.

## Ambiente

- Azure: `https://zealous-field-08fdd720f.7.azurestaticapps.net`
- Navegador: Playwright Chromium headless.
- Datos: API publica interceptada con servicio/empresa controlados para validar ficha, porque `/api/public/services?limit=50` devuelve `items=0`.
- No se crearon empresas reales.
- No se enviaron leads reales.
- No se usaron ni imprimieron secretos, tokens, cookies, SAS ni credenciales.

## Versiones / deploy observado

Segun `TASK-277`:

- Branch desplegada: `main`.
- Commit desplegado: `7ee2ab5bec203f4a09d4981de9c78446c766b0d8`.
- Mensaje: `Deploy public profile overflow fix`.

Validacion HTTP de Azure:

| Check | Resultado |
|---|---|
| `GET /` | `200` |
| Home contiene `styles.css?v=27` | OK |
| Home ya no contiene `styles.css?v=26` | OK |
| Home contiene `app.js?v=33` | OK |
| `GET /styles.css?v=27` | `200` |
| CSS contiene `flex-wrap: wrap` | OK |
| CSS contiene `overflow-wrap: anywhere` | OK |
| `GET /api/public/services?limit=50` | `200`, `items=0` |
| `GET /panel.html` | `200` |
| `GET /admin.html` | `200` |

## Evidencia ficha publica

Ruta validada con mock/control:

```text
/#proveedor/empresa-whatsapp/catering-whatsapp
```

Datos de control:

- Empresa: `Empresa WhatsApp QA`.
- Servicio principal: `Catering premium WhatsApp`.
- Servicio adicional: `Decoracion por formulario`.
- WhatsApp: `50688887777`.

### Desktop `1366x768`

| Metrica | Valor |
|---|---:|
| `documentElement.scrollWidth` | `1366` |
| `documentElement.clientWidth` | `1366` |
| `body.scrollWidth` | `1366` |
| Offenders fuera de viewport | `[]` |

Elementos criticos:

| Elemento | Left | Right | Width | Resultado |
|---|---:|---:|---:|---|
| `.contact-note.full-note` | `878` | `1248` | `370` | dentro de viewport |
| `Ver más servicios` | `878` | `1248` | `370` | dentro de viewport |

Contacto/cotizacion:

- Link WhatsApp generado con `wa.me/50688887777`.
- Mensaje WhatsApp conserva `Catering premium WhatsApp`.
- Microcopy visible: `Te abriremos WhatsApp con Catering premium WhatsApp de Empresa WhatsApp QA.`
- CTA formulario visible: `Enviar por formulario`.
- Nota visible: `También puedes enviar una solicitud registrada por Punto Evento CR.`
- Errores de consola: ninguno.

### Mobile `390x844`

| Metrica | Valor |
|---|---:|
| `documentElement.scrollWidth` | `390` |
| `documentElement.clientWidth` | `390` |
| `body.scrollWidth` | `390` |
| Offenders fuera de viewport | `[]` |

Elementos criticos:

| Elemento | Left | Right | Width | Resultado |
|---|---:|---:|---:|---|
| `.contact-note.full-note` | `33` | `357` | `324` | dentro de viewport |
| `Ver más servicios` | `33` | `357` | `324` | dentro de viewport |

Contacto/cotizacion:

- Link WhatsApp generado con `wa.me/50688887777`.
- Mensaje WhatsApp conserva `Catering premium WhatsApp`.
- Microcopy visible: `Te abriremos WhatsApp con Catering premium WhatsApp de Empresa WhatsApp QA.`
- CTA formulario visible: `Enviar por formulario`.
- Nota visible: `También puedes enviar una solicitud registrada por Punto Evento CR.`
- Errores de consola: ninguno.

## Smoke rapido Azure

| Ruta | Status | Resultado |
|---|---:|---|
| `/` | `200` | Home carga, H1 visible, sin overflow horizontal desktop |
| `/#bodas` | `200` | Vista de busqueda/categoria carga, sin overflow horizontal desktop |
| `/panel.html` | `200` | Panel carga; aparecen `401` esperados por ausencia de sesion |
| `/admin.html` | `200` | Login admin inline carga, sin prompt nativo observado |

## Hallazgos por severidad

### P0

- Ninguno.

### P1

- Ninguno.

### P2

- Ninguno nuevo.
- El P2 de overflow horizontal de ficha publica queda cerrado en Azure.

### P3

- Ninguno nuevo en este alcance.

## Riesgos aceptados

- La ficha se valido con mock/control de API publica porque el catalogo real de Azure sigue limpio y devuelve `items=0`.
- Conviene repetir un smoke visual rapido cuando exista la primera empresa real publicada, especialmente si trae nombres largos de empresa/servicio o textos extensos.
- En `/panel.html` se observan `401` de API esperados al abrir sin sesion; no bloquean este alcance.

## Recomendacion para Product / Architect / Release

- **Go** para cerrar `TASK-278`.
- **Go** para mostrar ficha publica real a usuarios externos desde el alcance visual/responsive validado.
- Siguiente recomendado: registrar/publicar la primera empresa real y repetir smoke minimo de ficha real desktop/mobile, contacto WhatsApp/formulario y busqueda publica.

## Comandos / pruebas ejecutadas

```powershell
git rev-parse --show-toplevel
Get-Content -Path AGENTS.md -Raw
Get-Content -Path chat-start/QA.md -Raw
Get-Content -Path tasks/TASK-278-assignment.md -Raw
Get-Content -Path docs/MVP_RELEASE_STATUS.md -Raw
Get-Content -Path docs/MVP_CRITERIA.md -Raw
Get-Content -Path docs/QA_TEST_PLAN.md -Raw
Get-Content -Path tasks/TASK-277-HANDOFF.md -Raw
Get-Content -Path tasks/TASK-276-HANDOFF.md -Raw
Invoke-WebRequest / Invoke-RestMethod contra Azure publico
Playwright Chromium headless contra Azure con API publica mockeada
```
