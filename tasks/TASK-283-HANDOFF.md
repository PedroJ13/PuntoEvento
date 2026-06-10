# TASK-283 HANDOFF

Equipo: QA Azure

Tarea validada: `TASK-283` - reproducir envio directo de servicio con portada a revision desde dominio propio.

## Resultado final

Resultado: **no aprobado / bloqueado por falta de sesion autenticada controlada**.

No se pudo reproducir ni descartar formalmente el fallo del flujo:

```text
crear servicio nuevo con portada -> presionar Enviar servicio -> servicio queda en pending/revision
```

Motivo: QA no recibio empresa QA aprobada, login recurrente valido, invite, sesion controlada ni HAR redactado del usuario afectado. El panel en `https://puntoeventocr.com/panel.html` muestra login y no permite crear servicios sin sesion.

## Incidente

Estado QA: **sigue abierto como P1 candidato, no reproducido por QA**.

La evidencia de producto acota mejor el problema:

- El servicio si queda creado como borrador.
- Desde ese borrador, el envio manual a revision si funciona.
- El fallo esperado a reproducir esta en el camino directo desde formulario de creacion, especialmente con portada.

Sin sesion autenticada no se puede confirmar si:

- el frontend no llama `submit-review`;
- falla upload/sign/confirm;
- falla `submit-review`;
- todos los endpoints responden OK pero la UI muestra error generico;
- el servicio queda `draft` en vez de `pending`.

## Ambiente revisado

- Dominio principal: `https://puntoeventocr.com/panel.html`
- Navegador: Codex in-app browser / Chromium
- Viewport observado: `615px` de ancho efectivo en navegador integrado
- Fecha QA: `2026-06-09`
- No se imprimieron cookies, tokens, contrasenas, URLs firmadas ni datos personales.
- No se crearon servicios, uploads ni datos nuevos.

## Estado visible del panel

URL:

```text
https://puntoeventocr.com/panel.html
```

Texto visible:

```text
ACCESO EMPRESA
Iniciar sesión
Ingresa con el correo y la contraseña activados para tu empresa.
Correo
Contraseña
Iniciar sesión
Inicia sesión para entrar al panel.
```

Indicadores:

| Check | Resultado |
|---|---|
| Panel carga | OK |
| Login visible | OK |
| `Mi empresa` / `Mis servicios` visibles en menu | OK |
| Vista operativa autenticada | no disponible |
| Cookie `pe_company_session` legible | no |
| Crear servicio | no ejecutable sin sesion |
| Subir portada | no ejecutable sin sesion |
| Enviar directo a revision | no ejecutable sin sesion |

## Empresa QA usada

No hubo empresa QA utilizable.

| Opcion requerida | Estado |
|---|---|
| Empresa QA aprobada y autenticada | no disponible |
| Sesion controlada autorizada por Product | no disponible |
| Empresa afectada con acceso controlado | no disponible |
| HAR redactado del usuario afectado | no disponible |

## Tabla de requests

No hay secuencia autenticada capturada para esta tarea porque el flujo no pudo iniciarse.

Requests que debian observarse y quedaron pendientes:

| Metodo | Ruta | Estado QA |
|---|---|---|
| POST | `/api/companies/me/services` | pendiente de sesion |
| POST | `/api/uploads/sign` | pendiente de sesion |
| PUT | `<blob firmado>` | pendiente de sesion; no imprimir URL completa |
| POST | `/api/uploads/confirm` | pendiente de sesion |
| POST | `/api/companies/me/services/{serviceId}/submit-review` | pendiente de sesion |

Evidencia heredada de `TASK-281`/`TASK-282`:

- Sin sesion, endpoints privados responden `401 Unauthorized`, no `403`.
- No hay evidencia actual de bloqueo por `ALLOWED_ORIGINS`.

## Archivo probado

No se probo archivo.

Archivo recomendado para la siguiente pasada:

- `qa-task-283-cover.png` o `.jpg`
- MIME: `image/png` o `image/jpeg`
- Tamano: menor a 5 MB

## Hallazgos por severidad

### P0

- Ninguno.

### P1

- P1 candidato no cerrado: el flujo directo `crear con portada -> Enviar servicio -> pending` no pudo validarse por falta de sesion.

### P2

- Falta precondicion operativa para QA: empresa/sesion controlada o HAR redactado.

### P3

- Ninguno nuevo.

## Recomendacion de siguiente tarea

Responsable inmediato: **QA/Product**, antes de asignar fix tecnico.

Accion necesaria:

1. Proveer una empresa QA aprobada con login recurrente valido, o una sesion controlada autorizada.
2. Repetir exactamente:
   - crear servicio nuevo con campos requeridos y portada;
   - presionar `Enviar servicio` desde el formulario;
   - observar si se llama `submit-review`;
   - confirmar estado final `draft` o `pending`.
3. Repetir sin imagen para aislar portada/upload.
4. Capturar tabla de requests con status y response body redactado.

Derivacion futura segun evidencia:

- `POST /api/companies/me/services` crea draft y frontend no llama `submit-review`: **Web Dev**.
- Endpoints OK pero UI muestra error o estado inconsistente: **Web Dev**.
- Falla `uploads/sign`, `PUT blob`, `uploads/confirm` o `submit-review` con `400/409/413/415/500`: **Backend/API**.
- `403` en `/api`: **Infra Azure**.
- Solo falla con portada: sospecha principal en upload/portada; asignar segun request fallida.

## Checks ejecutados

```powershell
git rev-parse --show-toplevel
Get-Content -Path tasks/TASK-283-assignment.md -Raw
Get-Content -Path tasks/TASK-282-HANDOFF.md -Raw
Get-Content -Path docs/MVP_RELEASE_STATUS.md -Raw
Get-Content -Path chat-start/QA.md -Raw
Navegador integrado: abrir https://puntoeventocr.com/panel.html y verificar estado visible/sesion
```
