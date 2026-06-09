# TASK-141: Web Dev - registro empresa provincia y contactos ampliados

## Equipo asignado

Web Dev.

## Contexto

Product Owner pidio ajustes en el formulario publico de registro:

1. `Provincia` debe ser una lista, usando la misma lista visible en el filtro publico.
2. El registro debe solicitar mas contactos:
   - WhatsApp;
   - telefono local;
   - Instagram;
   - Facebook;
   - pagina web;
   - otros contactos sociales razonables para MVP.

Depende de `TASK-140` para persistencia backend de campos nuevos.

## Archivos que debes leer

- `AGENTS.md`
- `chat-start/WEB_DEV.md`
- `tasks/TASK-140-HANDOFF.md` cuando exista.
- `docs/DATA_MODEL.md`
- `docs/API_CONTRACTS_MVP.md`
- `app.js`
- `styles.css`

## Objetivo

Actualizar el formulario `#empresas` para capturar provincia con select y contactos ampliados, enviando el payload correcto a `POST /api/companies/register`.

## Alcance

1. Reemplazar input libre `Provincia` por `<select>`.
2. Usar la misma lista que el filtro publico actual:
   - `San Jose`;
   - `Heredia`;
   - `Alajuela`;
   - `Guanacaste`;
   - y completar la lista si el filtro se actualiza con las 7 provincias.
3. Agregar campos:
   - telefono local;
   - Instagram;
   - Facebook;
   - pagina web;
   - mantener WhatsApp y email.
4. Enviar campos nuevos en `submitCompanyRegistration()`.
5. Mantener validaciones y estado de envio/doble submit.
6. Validar mobile/desktop basico, sin hacer rediseño grande.

## Fuera de alcance

- Rediseñar toda la landing.
- Cambiar backend.
- Implementar invitaciones automaticas.

## Verificacion minima esperada

- `node --check app.js`.
- Smoke local/DOM:
  - `province` es select;
  - opciones coinciden con filtro publico;
  - campos de contacto existen;
  - payload contiene campos nuevos.
- Si hay deploy disponible, indicar cache busting nuevo de `app.js`/`styles.css`.

## Entregable

Crear:

```text
tasks/TASK-141-HANDOFF.md
```

Debe incluir:

- archivos modificados;
- campos agregados;
- payload final;
- verificacion ejecutada;
- riesgos o pendientes;
- si requiere deploy.

## Aviso al terminar

```text
Termine TASK-141. Product/Architect debe leer tasks/TASK-141-HANDOFF.md.
```
