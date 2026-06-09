# TASK-140: Backend API - persistir contactos ampliados de empresa

## Equipo asignado

Backend API.

## Contexto

Product Owner pidio que al registrar empresas se soliciten mas contactos:

- WhatsApp;
- telefono local;
- Instagram;
- Facebook;
- pagina web;
- otros contactos sociales razonables para MVP.

El modelo ya documenta campos opcionales, pero `POST /api/companies/register` hoy solo persiste `email`, `whatsapp`, `province`, `canton` y `description`.

## Archivos que debes leer

- `AGENTS.md`
- `chat-start/BACKEND_API.md`
- `docs/DATA_MODEL.md`
- `docs/API_CONTRACTS_MVP.md`
- `api/shared/validation.js`
- `api/companies-register/index.js`
- `api/companies-me/index.js`
- `api/shared/internalPending.js`
- `api/shared/publicCatalog.js`

## Objetivo

Aceptar, validar y persistir campos de contacto ampliados en el registro nuevo de empresas.

## Alcance

1. Extender validacion de `validateCompanyRegistrationPayload()` para aceptar opcionales:
   - `phone`;
   - `website`;
   - `instagram`;
   - `facebook`;
   - `tiktok` si se decide mantenerlo;
   - cualquier alias razonable que el frontend envie.
2. Persistir esos campos en `Companies`.
3. Devolverlos en `GET /api/companies/me`.
4. Exponerlos en endpoints internos admin donde corresponde.
5. Exponer solo campos publicos definidos en `publicCatalog`:
   - `whatsapp`;
   - `website`;
   - `instagram`;
   - `facebook`;
   - `tiktok` si existe.
   - No publicar `email` por defecto.
6. Mantener compatibilidad con registros existentes que no tienen esos campos.

## Fuera de alcance

- Cambiar UI del formulario publico.
- Cambiar diseno del perfil publico.
- Implementar email automatico.

## Verificacion minima esperada

- `node --check` en archivos modificados.
- Prueba local/estructural de `POST /api/companies/register` con campos nuevos.
- Confirmar que `email` no sale en endpoints publicos.

## Entregable

Crear:

```text
tasks/TASK-140-HANDOFF.md
```

Debe incluir:

- campos aceptados/persistidos;
- endpoints afectados;
- verificacion ejecutada;
- riesgos o pendientes;
- si requiere deploy.

## Aviso al terminar

```text
Termine TASK-140. Product/Architect debe leer tasks/TASK-140-HANDOFF.md.
```
