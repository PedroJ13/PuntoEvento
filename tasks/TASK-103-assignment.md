# TASK-103: Corregir header admin en UI desplegada

## Equipo asignado

Web Dev.

## Contexto

`TASK-101` corrigio la credencial admin para Azure.

`TASK-102` confirmo que la credencial funciona por API directa cuando se envia con:

```text
X-Punto-Admin-Credential: Basic <redacted>
```

Pero la UI desplegada de `admin.html` sigue fallando porque `admin.js?v=10` envia:

```text
Authorization: Basic <redacted>
```

En Azure, ese header responde `401`. Por eso `admin.html` no puede pasar del login y QA no puede validar `Revision`, `Modelo nuevo` ni acciones approve/reject desde navegador.

Esto no parece depender del chat de QA. Es un desalineamiento entre el header que usa la UI y el header validado para Azure.

## Archivos que debes leer

- `AGENTS.md`
- `chat-start/WEB_DEV.md`
- `docs/API_CONTRACTS_MVP.md`
- `docs/MVP_RELEASE_STATUS.md`
- `tasks/TASK-101-HANDOFF.md`
- `tasks/TASK-102-HANDOFF.md`
- `api/shared/adminAuth.js`
- `admin.html`
- `admin.js`

## Objetivo

Hacer que `admin.html` autentique en Azure usando el header admin compatible:

```text
X-Punto-Admin-Credential
```

## Alcance

1. Cambiar `admin.js` para que `authHeaders()` envie:

```text
X-Punto-Admin-Credential: Basic <state.auth>
```

2. No enviar `Authorization` desde la UI admin para endpoints internos.
3. Mantener `Content-Type: application/json`.
4. Subir el cache busting de `admin.js` en `admin.html`:

```text
admin.js?v=11
```

5. Mantener funcionando:
   - login admin;
   - pestana `Revision`;
   - boton `Actualizar`;
   - pestana `Modelo nuevo`;
   - acciones approve/reject.

## Fuera de alcance

- Rotar credenciales.
- Cambiar endpoints Backend/API.
- Cambiar `api/shared/adminAuth.js` salvo que encuentres una razon tecnica real.
- Cambiar pagina publica o panel empresa.
- Ejecutar QA Azure completo.
- Hacer commit/push.

## Verificacion local esperada

- `node --check admin.js`.
- Revisar que `admin.js` ya no contenga `Authorization: \`Basic`.
- Revisar que `admin.js` contenga `X-Punto-Admin-Credential`.
- Revisar que `admin.html` apunte a `admin.js?v=11`.
- Si hay harness/mock local disponible, confirmar que las llamadas de admin usan el nuevo header.

## Entregable

Crear:

```text
tasks/TASK-103-HANDOFF.md
```

Debe incluir:

- Resultado general.
- Archivos modificados.
- Header anterior y nuevo, sin credenciales.
- Version de cache busting aplicada.
- Verificacion ejecutada.
- Riesgos pendientes.
- Recomendacion para Product/Architect: commit/push y luego repetir QA Azure.

## Aviso al terminar

Cuando termines, avisa en el chat Product/Architect:

```text
Termine TASK-103. Product/Architect debe leer tasks/TASK-103-HANDOFF.md.
```
