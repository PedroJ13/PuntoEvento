# Guion demo Product Owner - MVP Punto Evento

## Objetivo

Validar en Azure, desde navegador, que el flujo corregido ya permite:

- registrar una empresa demo limpia;
- entrar al panel empresa mediante invitacion;
- guardar un servicio como borrador;
- enviar el servicio a revision;
- moderar empresa, servicio e imagen desde admin;
- ver el servicio publicado en la pagina publica.

Este guion reemplaza el guion inicial de QA owner. No usar entidades creadas por smokes `QA TASK-*`.

## Ambiente

Usar Azure Static Web Apps:

```text
https://zealous-field-08fdd720f.7.azurestaticapps.net/
```

Rutas:

```text
Pagina publica: https://zealous-field-08fdd720f.7.azurestaticapps.net/index.html
Registro empresa: https://zealous-field-08fdd720f.7.azurestaticapps.net/index.html#empresas
Panel empresa: https://zealous-field-08fdd720f.7.azurestaticapps.net/panel.html
Admin interno: https://zealous-field-08fdd720f.7.azurestaticapps.net/admin.html
```

Assets esperados:

```text
Pagina publica: app.js?v=21, styles.css?v=16
Panel empresa: panel.js?v=4, panel.css?v=4
Admin interno: admin.js?v=12
```

## Datos demo recomendados

Empresa:

```text
Nombre comercial: Demo Owner Jardines del Sol
Email contacto: demo-owner-jardines@example.test
WhatsApp comercial: 50688888888
Provincia / zona: Santa Ana, San Jose
Categoria principal: Salon y jardin
Precio desde: CRC 28500 / pers.
Sitio web o Instagram: https://instagram.com/demo-owner-jardines
Descripcion corta: Salon y jardin para bodas, celebraciones familiares y eventos corporativos con montaje, mobiliario y coordinacion base.
```

Servicio principal:

```text
Nombre: Boda jardin esencial
Categoria: Salon y jardin
Tipos de evento: Bodas, Eventos corporativos
Precio desde: CRC 28500 / pers.
Descripcion: Paquete para celebraciones al aire libre con salon, jardin, mobiliario base, montaje, iluminacion ambiental y apoyo de coordinacion durante el evento.
```

Servicio opcional si se quiere probar multiples servicios:

```text
Nombre: Recepcion corporativa verde
Categoria: Salon y jardin
Tipos de evento: Eventos corporativos
Precio desde: CRC 22000 / pers.
Descripcion: Espacio para reuniones empresariales y recepciones con montaje flexible, mobiliario base, zona verde y apoyo logistico.
```

Imagen:

```text
Formato: JPG, PNG o WEBP
Tamano: menor a 5 MB
Contenido sugerido: salon, jardin, montaje de mesas o decoracion de boda
```

## Preparacion

Antes de iniciar:

1. Confirmar que el deploy mas reciente termino.
2. Confirmar que `local-secrets/qa-admin.ps1` tiene la credencial admin vigente.
3. Tener acceso al chat/equipo que puede crear invitacion interna para la empresa demo.
4. Preparar una imagen valida menor a 5 MB.
5. No usar empresas, emails o servicios con prefijo `QA TASK-*`.
6. No compartir capturas con passwords, tokens, cookies, invitaciones completas, headers de autenticacion ni URLs SAS.

## Flujo 1: Registro publico de empresa

1. Abrir `index.html#empresas`.
2. Completar el formulario con los datos de `Demo Owner Jardines del Sol`.
3. Enviar el formulario.
4. Confirmar durante envio:
   - el boton se deshabilita;
   - aparece estado de envio;
   - no hay doble submit visible.
5. Confirmar exito:
   - aparece `Registro recibido`;
   - el formulario queda limpio u oculto;
   - aparece `Registrar otra empresa`.

Resultado esperado:

- La empresa queda creada en estado pendiente.
- No se muestran errores tecnicos.
- No se piden pagos.

## Flujo 2: Invitacion y acceso al panel empresa

1. Pedir al equipo admin/infra crear invitacion para:

```text
demo-owner-jardines@example.test
```

2. Abrir la invitacion de forma segura.
3. Confirmar que entra a `panel.html`.
4. Confirmar que el panel muestra:
   - nombre de la empresa;
   - estado;
   - plan `free` o equivalente.

Resultado esperado:

- La empresa solo ve su propio perfil.
- No aparecen datos de otra empresa.

## Flujo 3: Crear borrador de servicio

1. En el panel, crear servicio nuevo.
2. Confirmar que el formulario no muestra:
   - selector editable `Estado`;
   - campo `Cantidad de fotos`;
   - texto `Como se revisa`.
3. Completar los datos del servicio `Boda jardin esencial`.
4. Subir una imagen valida si el campo de cover esta disponible.
5. Presionar `Guardar borrador`.

Resultado esperado:

- El boton principal dice `Guardar borrador`.
- El servicio queda como `Borrador`.
- El request de guardado no envia `status`.
- Si se sube cover, la imagen queda pendiente de revision.

## Flujo 4: Enviar servicio a revision

1. En la card o formulario del servicio, presionar `Enviar a revision`.
2. Confirmar que el panel muestra estado de carga o feedback.
3. Confirmar que el servicio cambia a `Pendiente`.
4. Confirmar que la accion `Enviar a revision` desaparece o queda deshabilitada.
5. Si se intenta repetir la accion, debe verse mensaje claro o la API debe responder `409`.

Campos minimos requeridos antes de enviar:

```text
Nombre
Categoria
Al menos un tipo de evento
Descripcion
Precio desde
```

Resultado esperado:

- El endpoint usado es `POST /api/companies/me/services/{serviceId}/submit-review`.
- El body es `{}` o vacio equivalente.
- La respuesta correcta deja el servicio en `pending`.

## Flujo 5: Admin interno

1. Abrir `admin.html`.
2. Probar primero una credencial invalida y confirmar que no entra.
3. Ingresar con credencial admin valida.
4. Abrir la pestana `Modelo nuevo`.
5. Ubicar la empresa demo:

```text
Demo Owner Jardines del Sol
```

6. Aprobar la empresa.
7. Ubicar el servicio demo:

```text
Boda jardin esencial
```

8. Aprobar el servicio.
9. Si se subio imagen, ubicar y aprobar el upload relacionado.

Resultado esperado:

- Cada accion muestra feedback.
- El item aprobado sale de su lista o el contador baja.
- No aparece `sig=`.
- No aparecen campos internos como `tokenHash`, `sessionHash`, `pendingBlobUrl`, `uploadUrl`, `rowKey`, `partitionKey` o cookies.

## Flujo 6: Pagina publica

1. Abrir `index.html`.
2. Buscar por:

```text
Boda jardin esencial
Salon y jardin
Demo Owner Jardines del Sol
```

3. Confirmar que el resultado muestra el servicio y la empresa.
4. Abrir el perfil de empresa.
5. Revisar:

```text
servicio seleccionado destacado
otros servicios visibles si existen
imagenes publicas aprobadas
CTA de presupuesto o WhatsApp
```

Resultado esperado:

- Solo aparece contenido publicado.
- El servicio aprobado se encuentra en busqueda.
- El perfil no muestra servicios pendientes, rechazados o inactivos.

## Criterios de aceptacion

PASS:

- Registro, panel, admin y pagina publica se recorren desde navegador.
- El registro exitoso no deja dudas ni doble submit.
- El panel usa `Guardar borrador -> Enviar a revision`.
- Admin aprueba empresa, servicio e imagen sin errores.
- El servicio aprobado aparece publicamente.
- No hay campos prohibidos en pantalla.
- No hay errores de consola visibles durante el flujo principal.

Bloqueo:

- No se puede iniciar sesion en panel o admin.
- No se puede crear borrador.
- No se puede enviar a revision.
- No se puede aprobar desde admin.
- El servicio aprobado no aparece publico.
- Se expone `sig=`, tokens, hashes, cookies o URLs internas.
- Hay error de permisos entre empresas.

Riesgo aceptable MVP:

- Admin usa Basic Auth compartido para prueba controlada.
- Email automatico de registro/revision aun no esta activo.
- Puede quedar limpieza controlada de datos QA como tarea separada.
- La galeria completa por servicio todavia puede requerir refinamiento futuro; para demo basta cover/imagen aprobada si el flujo esta disponible.

## Notas para reportar hallazgos

Cuando algo falle, reportar:

- ruta exacta;
- paso del guion;
- resultado esperado;
- resultado observado;
- captura sin secretos;
- si bloquea la prueba o es mejora.

No pegar:

- passwords;
- tokens;
- cookies;
- invitaciones completas;
- URLs con `sig=`;
- headers completos de autenticacion.

## Decision despues de la prueba

Si Product Owner aprueba:

- ejecutar o cerrar limpieza controlada de datos QA;
- decidir si se invita a primeras empresas reales;
- definir si catalogos finales de categorias/tipos bloquean o pueden seguir como mejora.

Si Product Owner no aprueba:

- crear tareas pequenas por hallazgo;
- priorizar P0/P1 antes de nuevas mejoras.
