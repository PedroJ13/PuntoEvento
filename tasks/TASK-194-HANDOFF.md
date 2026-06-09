# TASK-194 - Handoff Backend/API

## Estado

Completado.

## Contrato revisado

- `GET /api/public/services` ya expone datos publicos suficientes para contacto por WhatsApp en `items[].company.whatsapp`.
- `GET /api/public/companies/{slug}` ya expone `whatsapp` a nivel de perfil publico.
- `POST /api/public/leads` se mantiene sin cambio de ruta ni payload obligatorio para respaldo/trazabilidad por email.
- No se hicieron cambios de codigo porque `api/shared/publicCatalog.js` ya devuelve canales publicos permitidos y `api/public-leads/index.js` ya usa `Company.email` solo de forma interna.

## Campos publicos para Web Dev

En `GET /api/public/services`, cada `item.company` puede incluir:

- `id`
- `slug`
- `name`
- `whatsapp`
- `website`
- `instagram`
- `facebook`
- `tiktok`
- `province`
- `canton`
- `plan`
- `logoUrl`

En `GET /api/public/companies/{slug}`, el perfil publico puede incluir:

- `whatsapp`
- `website`
- `instagram`
- `facebook`
- `tiktok`
- datos publicos de ubicacion y servicios publicados

`Company.email` no se expone en endpoints publicos. Se usa solo para entregar emails desde `POST /api/public/leads`.

## Comportamiento de contacto/cotizacion

- Empresa con `whatsapp`: Web Dev puede usar WhatsApp como canal primario de contacto inmediato.
- Empresa con `whatsapp`: Web Dev puede seguir usando `POST /api/public/leads` como respaldo/trazabilidad por email si el usuario completa el formulario.
- Empresa sin `whatsapp`: Web Dev debe usar `POST /api/public/leads` como canal principal de cotizacion.
- Empresa sin `Company.email` interno: `POST /api/public/leads` responde `409` con `error: "Company cannot receive leads"`.
- ACS Email falla: el lead queda persistido, `emailStatus=failed`, y la API responde `502` con `leadId`.
- Email enviado: la API responde `201` con `{ "ok": true, "leadId": "..." }` y marca `emailStatus=sent`.
- Payload invalido: `400`.
- Empresa o servicio no publicado/no encontrado: `404`.

## Documentacion actualizada

- `docs/API_CONTRACTS_MVP.md`
  - Se documento `whatsapp` y redes/canales publicos en resultados de servicios.
  - Se aclaro que `Company.email` no se devuelve en endpoints publicos.
  - Se agrego el flujo MVP de contacto/cotizacion con WhatsApp primario y lead por email para respaldo/trazabilidad.
  - Se documento el caso `409` cuando falta email interno de empresa.

## Verificacion local/estructural

- `node --check api/shared/publicCatalog.js` OK.
- `node --check api/public-leads/index.js` OK.
- `git diff --check -- docs/API_CONTRACTS_MVP.md tasks/TASK-194-HANDOFF.md` OK.
- Git mostro aviso de normalizacion LF/CRLF para `docs/API_CONTRACTS_MVP.md`; no reporto errores de whitespace.

## Riesgos y notas

- No se hizo prueba real contra Azure Table Storage ni ACS Email desde local.
- El backend devuelve el valor almacenado de `whatsapp`; normalizacion final para link de WhatsApp debe coordinarse con Web Dev o definirse como validacion futura.
- `POST /api/public/leads` no incorpora rate limiting/CAPTCHA en esta tarea.
