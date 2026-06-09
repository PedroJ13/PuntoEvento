# TASK-144 - Web Dev mostrar contactos ampliados en expediente admin

Equipo: Web Dev

## Contexto

QA no aprobo `TASK-143` por un P1 pequeno de UI admin:

- El registro publico ya captura contactos ampliados.
- La API interna ya devuelve esos contactos.
- El catalogo publico no expone email y el flujo de imagenes dentro del servicio fue aprobado.
- Pero `admin.html` / `admin.js?v=15` no muestran en el expediente admin todos los contactos ampliados para revision.

## Leer antes de trabajar

- `tasks/TASK-143-HANDOFF.md`
- `tasks/TASK-139-HANDOFF.md`
- `tasks/TASK-140-HANDOFF.md`
- `docs/API_CONTRACTS_MVP.md`
- `docs/DATA_MODEL.md`

## Objetivo

Actualizar el expediente admin para que la persona administradora pueda revisar todos los contactos enviados por una empresa antes de aprobarla.

## Alcance

En `admin.js`, revisar la funcion que renderiza el detalle de empresa en expediente, especialmente `caseCompanyDetail()` o su equivalente actual.

Mostrar cuando existan:

- Email
- WhatsApp
- Telefono local (`phone`)
- Instagram
- Facebook
- Sitio web (`website`)
- TikTok
- Zona/provincia/canton si ya se muestra

Mantener el comportamiento aprobado por QA:

- Imagenes siguen dentro del servicio.
- No vuelve el bloque global viejo de empresas/servicios/uploads.
- No hay columna separada de imagenes.
- No hay acciones primarias separadas para aprobar uploads.
- No se exponen tokens, SAS, `sig=`, `tokenHash`, `sessionHash`, `pendingBlobName`, `uploadUrl` ni datos sensibles.

## Cache busting

Si cambias `admin.js`, subir version en `admin.html` de:

```text
admin.js?v=15
```

a:

```text
admin.js?v=16
```

Si no cambias `admin.css`, no subir `admin.css?v=9`.

## Validacion local esperada

- Usar datos mock/locales si aplica para confirmar que los campos se renderizan cuando existen.
- Confirmar que el render no imprime `undefined`, `null` o campos vacios como ruido visual.
- Confirmar que no reaparecen selectores viejos:
  - `.internal-grid`
  - `[data-internal-list="uploads"]`
  - `[data-case-uploads]`

## Entregable

Actualizar `tasks/TASK-144-HANDOFF.md` con:

- Archivos modificados.
- Version final de cache busting.
- Validacion realizada.
- Riesgos o notas para Infra/QA.

No hacer deploy desde esta tarea salvo que Product / Architect lo indique despues.
