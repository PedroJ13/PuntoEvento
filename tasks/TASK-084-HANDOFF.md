# TASK-084 Handoff

## Resultado general

`panel.html` queda convertido de demo local por defecto a panel real MVP para empresa autenticada por cookie de invitacion.

Al cargar sin sesion muestra el estado requerido:

```text
Necesitas abrir el enlace de invitacion para entrar al panel.
```

El modo demo local queda disponible solo con:

```text
panel.html?demo=local
```

## Archivos modificados

- `panel.html`
- `panel.css`
- `panel.js`

## Cambios realizados

- El panel ahora intenta aceptar invitacion desde `?invite=` o `?token=` y limpia el token de la URL con `history.replaceState`.
- Se carga la empresa autenticada desde API real.
- Se cargan servicios reales de la empresa autenticada.
- Se agrego estado claro cuando no hay sesion.
- Se agrego flujo real para crear servicios.
- Se agrego flujo real para editar servicios.
- Se agrego flujo real para desactivar servicios.
- Se agrego subida de cover con SAS sin mostrar token/SAS en UI.
- Se muestran estados `draft`, `pending`, `published`, `rejected` e `inactive`.
- Se agrego navegacion para volver a la pagina publica y cerrar sesion.
- Se muestra link publico solo cuando el servicio esta publicado.
- Se actualizo copy que seguia indicando que la demo no guardaba en Azure.
- Se actualizo cache busting a `panel.css?v=3` y `panel.js?v=3`.
- Se ajusto CSS para acciones de servicio, mensajes de exito/error, estado vacio y mobile.

## Endpoints integrados

- `POST /api/company-auth/accept-invite`
- `POST /api/company-auth/logout`
- `GET /api/companies/me`
- `GET /api/companies/me/services`
- `POST /api/companies/me/services`
- `PATCH /api/companies/me/services/{serviceId}`
- `DELETE /api/companies/me/services/{serviceId}`
- `POST /api/uploads/sign`
- `PUT <SAS>`
- `POST /api/uploads/confirm`

## Como se probo

- `node --check panel.js` con Node bundled de Codex: OK.
- `node --check admin.js` con Node bundled de Codex: OK.
- `git diff --check -- panel.html panel.css panel.js`: OK.
- Mocks en Node VM para:
  - sin sesion;
  - sesion valida;
  - listar servicios;
  - crear servicio;
  - editar servicio;
  - desactivar servicio;
  - upload feliz;
  - upload con error.
- Revision estatica de endpoints integrados con `rg`.

## Verificacion pendiente

- No se pudo completar smoke visual con Playwright porque el paquete local `playwright` falla al resolver `playwright-core`.
- Queda pendiente abrir `panel.html?demo=local` y un enlace real de invitacion en navegador para confirmar mobile 390px sin overflow y flujo Azure end-to-end.

## Riesgos pendientes

- Si la subida de cover falla despues de crear el servicio, el servicio puede quedar creado como draft sin cover. La UI muestra error, pero el retry queda manual.
- `POST /api/uploads/confirm` registra la imagen pendiente, pero la publicacion final depende del flujo admin.
- El panel no incluye boton real de "enviar a revision" porque el contrato actual no define endpoint para cambiar estado de servicio a `pending`.
- La seguridad real depende de que las cookies de sesion de empresa esten configuradas correctamente en Azure.

## Requiere commit/push antes de QA Azure

Si. Para que QA pruebe en Azure hay que commitear y pushear estos cambios, y esperar el workflow de Static Web Apps.

## Recomendacion para Product/Architect

Definir si el MVP necesita un endpoint explicito para solicitar revision de servicio, por ejemplo:

```text
POST /api/companies/me/services/{serviceId}/submit-review
```

Esto permitiria que el panel deje de depender solo de guardado draft + revision admin posterior.
