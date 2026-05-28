# TASK-083: Conectar registro publico al modelo Company

## Equipo asignado

Web Dev.

## Contexto

`TASK-082` valido que el flujo completo funciona en Azure por API/manual, pero Product Owner no puede probarlo completo desde navegador.

Primer bloqueo UI:

```text
#empresas existe, pero usa flujo legacy register-provider/create-upload-url/register-upload.
```

El modelo nuevo usa:

```text
POST /api/companies/register
```

## Archivos que debes leer

- `AGENTS.md`
- `chat-start/WEB_DEV.md`
- `docs/BACKLOG.md`
- `docs/MVP_RELEASE_STATUS.md`
- `docs/API_CONTRACTS_MVP.md`
- `tasks/TASK-082-HANDOFF.md`
- `index.html`
- `app.js`
- `styles.css`
- `api/companies-register/index.js`

## Objetivo

Conectar el formulario publico de empresas (`index.html#empresas`) al flujo nuevo `Company` y alinear los botones/CTAs de la pagina principal con el recorrido nuevo:

```text
Pagina publica -> Registro empresa -> Invitacion/acceso -> Panel empresa -> Moderacion admin -> Publicacion
```

Sin romper la pagina publica actual.

## Alcance

1. Cambiar el submit de `#empresas` para que en Azure use:

```text
POST /api/companies/register
```

2. Enviar los campos requeridos por el contrato nuevo:

```text
companyName
email
whatsapp
province
canton
description
```

3. Mantener validaciones browser existentes.
4. Mostrar confirmacion clara al registrar:

```text
Registro recibido. Punto Evento revisara la empresa y enviara acceso al panel.
```

5. No intentar crear servicios ni uploads desde este formulario en esta tarea.
6. Quitar o reemplazar la experiencia vieja de "Fotos del perfil" dentro de `#empresas`, porque en el flujo nuevo las fotos de servicios se cargan desde el panel empresa despues de tener acceso.
7. Ajustar copy del formulario para explicar el nuevo flujo:

```text
Registra la empresa gratis. Luego recibes acceso al panel para crear servicios, subir fotos y enviarlos a revision.
```

8. Revisar todos los CTAs de la pagina principal relacionados con empresas:
   - `Crear perfil gratis`
   - `Publicar empresa`
   - `Crear empresa`
   - botones dentro de `#empresas`

   Deben apuntar a `#empresas` o al registro nuevo, no al flujo visual viejo.
9. Agregar un CTA secundario claro para empresas que ya tienen acceso:

```text
Ya tengo acceso
```

Debe abrir:

```text
panel.html
```

10. No agregar un boton publico prominente hacia `admin.html` en la pagina principal. El admin interno debe seguir como URL directa o documentada para el equipo, salvo que Product/Architect indique lo contrario.
11. Si hace falta conservar el flujo legacy como fallback local/demo, hacerlo sin afectar Azure.
12. No exponer IDs internos, secrets ni errores crudos al usuario.

## Fuera de alcance

- Login de empresa.
- Panel empresa real.
- Admin/moderacion.
- Upload nuevo desde registro.
- Email real.

## Verificacion local esperada

- `node --check app.js`.
- En modo local/demo, el formulario no se rompe.
- En modo Azure/API, mock o prueba controlada confirma que se llama a `/api/companies/register`.
- Los CTAs de empresas en home/empresas apuntan al registro nuevo o a `panel.html`, segun corresponda.
- La UI ya no muestra carga de fotos de perfil como parte del registro publico nuevo.
- Mobile 390px sin overflow.
- Sin errores JS no controlados.

## Entregable

Crear:

```text
tasks/TASK-083-HANDOFF.md
```

Debe incluir:

- Resultado general.
- Archivos modificados.
- Resumen de comportamiento nuevo.
- Confirmacion de CTAs revisados.
- Confirmacion de que se retiro/reemplazo la carga vieja de fotos de perfil en `#empresas`.
- Como se probo localmente.
- Riesgos pendientes.
- Si requiere commit/push antes de QA Azure.

## Nota para coordinacion

Al terminar, avisar en el chat de Product/Architect:

```text
Termine TASK-083. Product/Architect debe leer tasks/TASK-083-HANDOFF.md.
```
