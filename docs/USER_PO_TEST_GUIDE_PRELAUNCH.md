# Guia de prueba de usuario - Pre-lanzamiento Punto Evento

## Objetivo

Validar como usuario que el flujo principal de Punto Evento funciona antes de invitar primeras empresas reales.

La prueba cubre:

- Registro de empresa.
- Email de confirmacion interna.
- Aprobacion por admin.
- Email de activacion para la empresa.
- Activacion de acceso con password.
- Login recurrente con email/password.
- Creacion de servicio.
- Envio de servicio a revision.
- Email interno de servicio enviado a revision.
- Busqueda publica sin datos de prueba viejos.

## Links de prueba

Sitio publico:

```text
https://zealous-field-08fdd720f.7.azurestaticapps.net/
```

Registro de empresa:

```text
https://zealous-field-08fdd720f.7.azurestaticapps.net/#empresas
```

Panel empresa:

```text
https://zealous-field-08fdd720f.7.azurestaticapps.net/panel.html
```

Admin interno:

```text
https://zealous-field-08fdd720f.7.azurestaticapps.net/admin.html
```

Busqueda publica API para confirmar catalogo limpio:

```text
https://zealous-field-08fdd720f.7.azurestaticapps.net/api/public/services?q=qa&limit=20
```

## Antes de empezar

Usar un correo al que puedas entrar durante la prueba.

No compartir en chats ni capturas:

- Password.
- Link completo de activacion.
- Token del enlace.
- Credenciales admin.

Datos sugeridos:

```text
Empresa: PO Test Eventos 2026-06-01
Email: correo de prueba accesible
WhatsApp: +506 8888 0000
Telefono: 2222-0000
Provincia: San Jose
Canton: Central
Descripcion: Empresa de prueba para validar pre-lanzamiento Punto Evento.
```

## Paso 1 - Revisar sitio publico

Abrir:

```text
https://zealous-field-08fdd720f.7.azurestaticapps.net/
```

Probar:

- La pagina carga correctamente.
- Se puede navegar en desktop o mobile.
- No aparecen errores visibles.

Resultado esperado:

```text
El sitio publico carga normal.
El catalogo puede estar vacio porque se limpiaron datos QA antes del primer lote real.
```

## Paso 2 - Registrar empresa

Abrir:

```text
https://zealous-field-08fdd720f.7.azurestaticapps.net/#empresas
```

Probar:

- Completar el formulario de registro.
- Enviar la empresa.
- Esperar mensaje de confirmacion.

Resultado esperado:

```text
El registro se envia correctamente.
La pagina muestra confirmacion.
No permite doble envio accidental.
```

Evidencia sugerida:

```text
Captura del mensaje de confirmacion.
Nombre de empresa usado.
Hora aproximada.
```

## Paso 3 - Confirmar email interno de nueva empresa

Revisar el buzon configurado para notificaciones internas.

Buscar asunto parecido a:

```text
Nueva empresa registrada
```

Resultado esperado:

```text
Llega un correo interno indicando que hay una empresa pendiente de revision.
El correo muestra datos basicos de la empresa registrada.
```

## Paso 4 - Aprobar empresa en admin

Abrir:

```text
https://zealous-field-08fdd720f.7.azurestaticapps.net/admin.html
```

Probar:

- Iniciar sesion con credencial admin por canal seguro.
- Buscar la empresa registrada.
- Revisar el expediente.
- Aprobar la empresa.

Resultado esperado:

```text
La empresa cambia a aprobada/publicada.
El admin muestra mensaje de invitacion enviada.
```

Si no tienes acceso admin, pide a Product/Infra que apruebe la empresa y sigue con el siguiente paso.

## Paso 5 - Confirmar email de activacion

Revisar el correo usado para registrar la empresa.

Buscar asunto:

```text
Activa tu acceso a Punto Evento
```

Resultado esperado:

```text
Llega el email de activacion.
El email contiene un link "Activar acceso".
```

No pegar el link completo en chats ni documentos.

## Paso 6 - Activar acceso

Abrir el link `Activar acceso` desde el correo.

Probar:

- La pagina muestra `Activa tu acceso`.
- Definir un password.
- Confirmar el password.
- Activar.

Resultado esperado:

```text
El acceso se activa correctamente.
La pagina entra al panel de empresa.
El panel muestra la empresa correcta.
```

## Paso 7 - Probar login recurrente

Desde el panel:

- Cerrar sesion.

Abrir:

```text
https://zealous-field-08fdd720f.7.azurestaticapps.net/panel.html
```

Probar:

- Iniciar sesion con el email de empresa.
- Usar el password definido en la activacion.

Resultado esperado:

```text
El login funciona.
El panel carga la empresa correcta.
Cerrar sesion funciona.
```

Prueba negativa opcional:

- Intentar entrar una vez con password incorrecto.

Resultado esperado:

```text
El sistema muestra error generico.
No revela datos sensibles.
```

## Paso 8 - Crear servicio

En el panel empresa, usar `Agregar servicio`.

Datos sugeridos:

```text
Nombre: Servicio PO Test 2026-06-01
Categoria: Catering
Tipos de evento: Bodas, Eventos corporativos
Precio desde: CRC 120000
Descripcion: Servicio de prueba para validar creacion y envio a revision.
```

Probar:

- Guardar el servicio.

Resultado esperado:

```text
El servicio se guarda como borrador.
El panel muestra el servicio creado.
```

## Paso 9 - Enviar servicio a revision

En el servicio creado, usar:

```text
Enviar a revision
```

Resultado esperado:

```text
El servicio queda en estado pendiente/revision.
El panel indica que ya esta en revision.
```

## Paso 10 - Confirmar email interno de servicio a revision

Revisar el buzon configurado para notificaciones internas.

Buscar asunto parecido a:

```text
Servicio enviado a revision
```

Resultado esperado:

```text
Llega email interno con datos de empresa y servicio.
```

## Paso 11 - Revisar en admin

Abrir:

```text
https://zealous-field-08fdd720f.7.azurestaticapps.net/admin.html
```

Probar:

- Buscar la empresa.
- Confirmar que el servicio aparece pendiente/revision.
- Revisar que los datos del expediente se vean correctamente.

Resultado esperado:

```text
Admin muestra empresa, contactos y servicio pendiente.
No aparecen datos sensibles como tokens, hashes o cookies.
```

No aprobar servicio si Product no lo pide.

## Paso 12 - Confirmar busqueda publica

Abrir:

```text
https://zealous-field-08fdd720f.7.azurestaticapps.net/
```

Probar busqueda por:

```text
qa
demo
smoke
PO Test
```

Resultado esperado:

```text
No aparecen datos viejos de QA/demo/smoke.
El catalogo puede estar vacio hasta que Product apruebe empresas/servicios reales.
```

## Como reportar resultados

Completar:

```text
Resultado general: aprobado / aprobado con observaciones / no aprobado

Empresa usada:
Email usado:
Fecha/hora:

Registro empresa: ok / falla
Email nueva empresa: ok / falla
Aprobacion admin: ok / falla
Email activacion: ok / falla
Activacion password: ok / falla
Login recurrente: ok / falla
Crear servicio: ok / falla
Enviar servicio a revision: ok / falla
Email servicio revision: ok / falla
Admin ve expediente: ok / falla
Busqueda publica limpia: ok / falla

Observaciones:
Capturas disponibles:
```

## Clasificacion de problemas

```text
P0: expone secreto, rompe seguridad o bloquea completamente el release.
P1: bloquea registro, activacion, login, panel, admin o emails principales.
P2: problema menor con workaround aceptable para pre-lanzamiento controlado.
P3: mejora futura o detalle visual menor.
```

