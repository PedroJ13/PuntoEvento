# Guion de prueba Product Owner - MVP Punto Evento

## Objetivo

Validar desde navegador que el flujo MVP principal ya permite:

- registrar una empresa;
- entrar al panel empresa;
- crear/editar servicios;
- subir imagenes;
- aprobar empresa, servicio e imagen desde admin;
- ver el servicio publicado en la pagina publica.

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

## Preparacion

Antes de iniciar:

1. Confirmar que el deploy mas reciente ya termino.
2. Tener a mano credencial admin por canal seguro.
3. Tener a mano una invitacion de empresa o pedir al equipo crear una.
4. Preparar 1 imagen JPG/PNG/WEBP menor a 5 MB.
5. No compartir capturas que muestren passwords, tokens, cookies, invitaciones completas ni URLs SAS.

## Flujo 1: Registro publico de empresa

1. Abrir `index.html#empresas`.
2. Completar el formulario con una empresa QA nueva.
3. Usar un nombre reconocible, por ejemplo:

```text
QA Owner Empresa 2026MMDD-HHMM
```

4. Enviar el formulario.
5. Verificar que aparece confirmacion clara.

Resultado esperado:

- La empresa queda creada en estado pendiente.
- No se muestran errores tecnicos.
- No se piden pagos.

## Flujo 2: Acceso al panel empresa

1. Abrir la invitacion generada para la empresa QA.
2. Confirmar que entra a `panel.html`.
3. Revisar que se ve el nombre de la empresa, estado y plan.
4. Crear un servicio nuevo.
5. Completar:

```text
Nombre: Servicio Owner QA
Categoria: una opcion valida del catalogo
Tipos de evento: al menos uno
Precio desde: CRC 120000
Descripcion: texto breve y realista
```

6. Subir una imagen valida.
7. Guardar.
8. Cerrar sesion.

Resultado esperado:

- El servicio queda guardado.
- La imagen queda pendiente de revision.
- El panel no muestra datos de otra empresa.
- No hay errores visibles.

## Flujo 3: Admin interno

1. Abrir `admin.html`.
2. Probar primero una credencial invalida.
3. Confirmar que no entra.
4. Ingresar con credencial admin valida.
5. Abrir la pestana `Modelo nuevo`.
6. Confirmar que cargan:

```text
Empresas pendientes
Servicios revisables
Uploads pendientes
```

7. Ubicar la empresa QA creada.
8. Aprobar la empresa.
9. Ubicar el servicio QA creado.
10. Aprobar el servicio.
11. Ubicar el upload QA creado.
12. Aprobar el upload.

Resultado esperado:

- Cada accion muestra feedback.
- El item aprobado sale de su lista o el contador baja.
- No aparece `sig=`.
- No aparecen campos internos como `tokenHash`, `sessionHash`, `pendingBlobUrl`, `uploadUrl`, `rowKey`, `partitionKey` o cookies.

## Flujo 4: Pagina publica

1. Abrir `index.html`.
2. Buscar por el nombre o categoria del servicio aprobado.
3. Confirmar que el resultado muestra el servicio y la empresa.
4. Abrir el perfil de empresa.
5. Revisar:

```text
servicio seleccionado destacado
otros servicios visibles si existen
imagenes publicas
CTA de presupuesto o WhatsApp
```

Resultado esperado:

- Solo aparece contenido publicado.
- El servicio aprobado se encuentra en busqueda.
- El perfil no muestra servicios pendientes, rechazados o inactivos.

## Criterios de aceptacion

PASS:

- Registro, panel, admin y pagina publica se pueden recorrer desde navegador.
- Admin aprueba empresa, servicio e imagen sin errores.
- El servicio aprobado aparece publicamente.
- No hay campos prohibidos en pantalla.
- No hay errores de consola visibles durante el flujo principal.

Bloqueo:

- No se puede iniciar sesion en panel o admin.
- No se puede crear servicio.
- No se puede aprobar desde admin.
- El servicio aprobado no aparece publico.
- Se expone `sig=`, tokens, hashes, cookies o URLs internas.
- Hay error de permisos entre empresas.

Riesgo aceptable MVP:

- Admin usa Basic Auth compartido para prueba controlada.
- Uploads del modelo nuevo no tienen preview visual en admin.
- Email automatico de registro/revision aun no esta activo.
- Puede quedar limpieza manual de datos QA.
- La decision de endpoint explicito `submit-review` sigue abierta si el flujo actual ya deja revisar los cambios guardados.

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

- definir limpieza de datos QA;
- decidir si se invita a primeras empresas reales;
- decidir si `submit-review` y email son antes o despues del piloto.

Si Product Owner no aprueba:

- crear tareas pequenas por hallazgo;
- priorizar P0/P1 antes de nuevas mejoras.
