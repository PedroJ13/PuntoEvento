# Product Owner Test - Registro, invite y panel empresa

## Objetivo

Validar el flujo de acceso recurrente de empresas en Azure, dejando fuera el flujo de cotizaciones.

Este guion confirma que una empresa puede:

1. Registrarse.
2. Recibir/usar invitacion.
3. Activar acceso con password.
4. Entrar nuevamente con email/password.
5. Ver y usar su panel.
6. Crear un servicio y enviarlo a revision.

## Ambiente

```text
Azure:
https://zealous-field-08fdd720f.7.azurestaticapps.net
```

Rutas principales:

```text
Registro empresa:
https://zealous-field-08fdd720f.7.azurestaticapps.net/index.html#empresas

Panel empresa:
https://zealous-field-08fdd720f.7.azurestaticapps.net/panel.html

Admin interno:
https://zealous-field-08fdd720f.7.azurestaticapps.net/admin.html
```

## Antes de empezar

- No pegar passwords, tokens de invite, cookies ni credenciales admin en chats o capturas.
- Usar datos de prueba claros, por ejemplo:

```text
Empresa: PO Test Eventos 2026-06-01
Email: un email controlado de prueba
WhatsApp: numero de prueba
Provincia: cualquiera valida
Descripcion: texto de prueba
```

- Si se captura pantalla, ocultar:
  - password;
  - token completo del invite;
  - credenciales admin;
  - cookies.

## Flujo 1 - Registro de empresa

1. Abrir:

```text
https://zealous-field-08fdd720f.7.azurestaticapps.net/index.html#empresas
```

2. Completar formulario de empresa.
3. Enviar registro.
4. Resultado esperado:

```text
La pagina muestra confirmacion de registro recibido.
No debe haber doble submit.
No debe mostrar errores tecnicos.
```

5. Anotar:

```text
Empresa registrada:
Email usado:
Resultado:
Observaciones:
```

## Flujo 2 - Generacion de invite

Este paso puede requerir apoyo de Admin/Infra/Product si el Product Owner no tiene acceso admin.

1. Entrar al admin interno:

```text
https://zealous-field-08fdd720f.7.azurestaticapps.net/admin.html
```

2. Iniciar sesion con credencial admin por canal seguro.
3. Buscar la empresa registrada.
4. Generar invitacion o pedir a Product/Infra que genere invitacion interna.
5. Resultado esperado:

```text
Se obtiene un enlace de invitacion para la empresa.
No se publica el token completo en chats ni capturas.
```

6. Anotar solo:

```text
Invite generado: si/no
Quien lo genero:
Observaciones:
```

## Flujo 3 - Activacion con password

1. Abrir el enlace de invitacion en una ventana nueva o privada.
2. Confirmar que el panel muestra:

```text
Activa tu acceso
```

3. Definir un password de prueba seguro.
4. Confirmar password.
5. Activar.
6. Resultado esperado:

```text
La activacion termina correctamente.
La empresa entra al panel.
No se muestran tokens, hashes ni errores tecnicos.
```

7. Anotar:

```text
Activacion exitosa: si/no
Errores visibles:
Observaciones:
```

## Flujo 4 - Login recurrente

1. Cerrar sesion desde el panel.
2. Abrir:

```text
https://zealous-field-08fdd720f.7.azurestaticapps.net/panel.html
```

3. Iniciar sesion con:

```text
Email de la empresa
Password definido en activacion
```

4. Resultado esperado:

```text
La empresa entra nuevamente al panel.
El panel muestra datos de la empresa.
Cerrar sesion funciona.
Credenciales incorrectas muestran error generico.
```

5. Probar password incorrecto una vez.
6. Resultado esperado:

```text
Mensaje generico, sin revelar si el email existe.
```

## Flujo 5 - Crear servicio

1. Con sesion activa en panel, crear un servicio de prueba.
2. Usar datos simples:

```text
Nombre: Servicio PO Test
Categoria: una categoria valida
Tipos de evento: uno o mas tipos validos
Descripcion: texto de prueba
Precio desde: texto de prueba
```

3. Guardar como borrador.
4. Resultado esperado:

```text
El servicio queda creado.
El panel no muestra errores tecnicos.
```

## Flujo 6 - Enviar servicio a revision

1. En el servicio creado, usar accion:

```text
Enviar a revision
```

2. Resultado esperado:

```text
El servicio pasa a estado pendiente/revision.
El panel indica que queda esperando revision.
```

3. Anotar:

```text
Servicio enviado a revision: si/no
Estado visible:
Observaciones:
```

## Flujo 7 - Revision admin visual

1. Entrar al admin interno.
2. Buscar expediente de la empresa de prueba.
3. Confirmar que el admin muestra:

```text
Datos de empresa
Contactos
Servicio enviado a revision
Acciones de aprobar/rechazar segun corresponda
```

4. No aprobar empresa/servicio real salvo que Product lo indique.

## Criterios de aprobacion

El flujo se considera aprobado si:

- Registro funciona.
- Invite se genera y permite activar password.
- Login recurrente email/password funciona.
- Logout funciona.
- Password incorrecto muestra error generico.
- Panel permite crear servicio.
- Panel permite enviar servicio a revision.
- Admin puede ver empresa/servicio pendiente.
- No se exponen tokens, hashes, cookies ni credenciales.

## Hallazgos

Registrar cada hallazgo asi:

```text
ID:
Paso:
Esperado:
Observado:
Impacto:
Prioridad sugerida: P0/P1/P2/P3
Captura: si/no
```

Clasificacion:

```text
P0: bloquea release o expone secreto/dato sensible.
P1: bloquea uso real de empresas.
P2: molesto pero aceptable para pre-lanzamiento controlado.
P3: mejora futura.
```

## Resultado final

Completar:

```text
Resultado: aprobado / no aprobado / aprobado con observaciones
Resumen:
P0:
P1:
P2:
P3:
Recomendacion:
```
