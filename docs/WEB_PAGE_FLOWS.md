# Flujos principales de Punto Evento CR

## Objetivo

Este documento resume los flujos principales de la web de Punto Evento CR para que Product, QA, diseño, revisores externos o nuevos chats puedan entender como se conecta la pagina publica, el panel empresa, el admin interno y los endpoints MVP.

Documento relacionado:

- `docs/ROUTE_MAP_MVP.md`: mapa de rutas y APIs.
- `docs/MVP_RELEASE_STATUS.md`: estado operativo actual.
- `docs/MVP_CRITERIA.md`: criterios MVP.

## Superficies del producto

### Pagina publica

Archivo/ruta:

```text
/
/index.html
```

Uso:

- Mostrar catalogo publico.
- Buscar servicios.
- Ver perfiles de empresas.
- Contactar/cotizar servicios.
- Registrar nuevas empresas proveedoras.

### Panel privado de empresa

Archivo/ruta:

```text
/panel.html
```

Uso:

- Empresa accede a su panel.
- Gestiona datos de empresa.
- Crea, edita, carga fotos y desactiva servicios.
- Ve el estado de sus servicios.

### Admin interno

Archivo/ruta:

```text
/admin
/admin.html
```

Uso:

- Punto Evento revisa empresas y servicios.
- Aprueba o rechaza contenido.
- Publica servicios que luego aparecen en la pagina publica.

## Flujo 1: Usuario publico busca proveedor

Objetivo:

Una persona que organiza un evento busca servicios y contacta a una empresa proveedora.

Pasos:

1. Usuario entra a la pagina publica.
2. Ve la home y el catalogo.
3. Busca por categoria, servicio o texto libre.
4. La pagina consulta servicios publicados.
5. Se muestran resultados por servicio, no solo por empresa.
6. Cada resultado muestra contexto de la empresa.
7. Usuario abre el perfil/ficha publica de la empresa o servicio.
8. Ve el servicio seleccionado destacado y otros servicios de la misma empresa.
9. Usuario contacta/cotiza.

Canales MVP:

- WhatsApp como canal primario cuando exista WhatsApp de la empresa.
- Email como respaldo/trazabilidad de cotizacion cuando aplica.

Reglas:

- Solo servicios publicados deben aparecer.
- Servicios pendientes, rechazados o inactivos no deben aparecer.
- Si el catalogo real esta vacio, no se deben mostrar proveedores/demo como si fueran reales.

Rutas/API principales:

```text
GET /api/public/services
GET /api/public/companies/{slug}
POST /api/public/leads
```

## Flujo 2: Empresa se registra

Objetivo:

Una empresa proveedora solicita entrar a Punto Evento CR.

Pasos:

1. Empresa entra a la seccion de empresas.
2. Completa formulario de registro.
3. Envia datos de empresa y contacto.
4. Backend crea la empresa en estado pendiente.
5. Punto Evento recibe o puede revisar el registro en admin.
6. Admin decide si aprueba o rechaza.

Resultado esperado:

- La empresa queda registrada, pero no aparece publicamente hasta pasar por aprobacion y tener servicios publicados.

Ruta/API principal:

```text
POST /api/companies/register
```

## Flujo 3: Empresa obtiene acceso al panel

Objetivo:

Una empresa aprobada puede entrar de forma recurrente a su panel.

Pasos:

1. Admin aprueba la empresa.
2. El sistema genera invitacion de activacion.
3. La empresa recibe email de activacion.
4. Empresa abre el enlace.
5. Empresa activa acceso y define password si aplica.
6. Se crea sesion de empresa.
7. Empresa puede entrar al panel.
8. En siguientes visitas, entra con login recurrente.

Reglas:

- El frontend no decide `companyId`.
- El backend deriva la empresa desde sesion/cookie.
- No se debe depender de generar invitacion nueva cada vez que la empresa quiera volver.

Rutas/API principales:

```text
POST /api/company-auth/accept-invite
POST /api/company-auth/activate
POST /api/company-auth/login
POST /api/company-auth/logout
GET /api/companies/me
```

## Flujo 4: Empresa carga y gestiona servicios

Objetivo:

Una empresa crea y mantiene sus servicios desde el panel privado.

Pasos:

1. Empresa entra a `/panel.html`.
2. Revisa datos de `Mi empresa`.
3. Entra a `Mis servicios`.
4. Carga un servicio nuevo.
5. Completa:
   - nombre;
   - categoria;
   - tipos de evento;
   - descripcion;
   - precio desde;
   - portada;
   - galeria/fotos.
6. Guarda/carga el servicio segun el flujo vigente.
7. Puede editar o desactivar servicios.
8. Cuando el servicio queda aprobado/publicado, aparece en la pagina publica.

Reglas UX:

- Usar lenguaje simple para empresas.
- Usar `portada`, no `cover`.
- Evitar lenguaje tecnico o excesivamente burocratico.
- Items futuros del menu pueden mostrarse opacos/deshabilitados como `Proximamente`.

Rutas/API principales:

```text
GET /api/companies/me/services
POST /api/companies/me/services
PATCH /api/companies/me/services/{serviceId}
DELETE /api/companies/me/services/{serviceId}
POST /api/uploads/sign
POST /api/uploads/confirm
POST /api/companies/me/services/{serviceId}/submit-review
```

## Flujo 5: Admin aprueba empresa y servicios

Objetivo:

Punto Evento controla que solo empresas y servicios revisados aparezcan publicamente.

Pasos:

1. Admin entra a `/admin.html` o `/admin`.
2. Ingresa credencial interna.
3. Ve expedientes con actividad pendiente.
4. Si empresa esta pendiente, puede aprobar/rechazar empresa.
5. Si empresa ya esta aprobada pero tiene servicios pendientes, debe aprobar/rechazar servicios.
6. Al aprobar servicio, se publican tambien las imagenes pendientes asociadas segun reglas de cover/galeria.
7. Servicio aprobado aparece en pagina publica.

Reglas:

- No mostrar accion principal `Aprobar empresa` si la empresa ya esta publicada.
- Diferenciar visualmente empresa pendiente vs servicios pendientes.
- Admin debe recibir feedback claro despues de aprobar/rechazar.
- No usar endpoints legacy para nuevas features.

Rutas/API principales:

```text
GET /api/internal/companies/pending
POST /api/internal/companies/{companyId}/approve
POST /api/internal/companies/{companyId}/reject
GET /api/internal/services/pending
POST /api/internal/services/{companyId}/{serviceId}/approve
POST /api/internal/services/{companyId}/{serviceId}/reject
```

## Flujo 6: Servicio publicado aparece publicamente

Objetivo:

Un servicio aprobado queda disponible para busqueda y contacto.

Pasos:

1. Empresa crea servicio.
2. Admin aprueba empresa si aun esta pendiente.
3. Admin aprueba servicio.
4. Backend cambia estado del servicio a publicado.
5. Imagenes aprobadas quedan disponibles publicamente.
6. `GET /api/public/services` incluye el servicio.
7. Usuario publico puede verlo en catalogo/busqueda.
8. Usuario puede abrir perfil de empresa con ese servicio destacado.

Reglas:

- Empresa rechazada/inactiva no debe publicar servicios.
- Servicio rechazado/inactivo/pendiente no aparece.
- Las imagenes pendientes no deben exponerse por URL publica.

## Flujo 7: Contacto/cotizacion

Objetivo:

Usuario publico puede contactar a una empresa por un servicio especifico.

Decision MVP vigente:

```text
WhatsApp primario cuando exista y email como respaldo/trazabilidad.
```

Pasos:

1. Usuario encuentra servicio.
2. Elige contactar/cotizar.
3. Si hay WhatsApp de empresa, se abre contacto por WhatsApp.
4. Si se usa formulario/cotizacion, backend registra lead y envia email segun configuracion.
5. Empresa recibe aviso del lead.

Reglas:

- Botones no deben prometer email/cotizacion si el flujo no esta activo.
- El contacto debe estar asociado a un servicio especifico.
- El usuario debe entender que accion realizo.

API principal:

```text
POST /api/public/leads
```

## Flujo 8: Emails operativos

Objetivo:

Enviar notificaciones necesarias para operar el marketplace.

Proveedor MVP:

```text
Azure Communication Services Email
```

Casos:

- Aviso interno cuando una empresa se registra.
- Aviso interno cuando hay servicios por revisar si aplica.
- Email de activacion a empresa cuando es aprobada.
- Email de cotizacion/contacto a empresa si se usa formulario.
- Emails de bienvenida o confirmacion segun copy aprobado.

Reglas:

- No usar SendGrid como requisito MVP.
- No exponer secretos en frontend.
- Fallo de email no debe duplicar registros ni romper datos.
- Email debe tener tono profesional y marca Punto Evento CR.

## Flujo 9: Catalogo vacio

Objetivo:

La pagina publica debe manejar un catalogo real vacio sin mostrar datos falsos.

Pasos:

1. `GET /api/public/services` devuelve 0 servicios.
2. Pagina muestra estado vacio controlado.
3. No se muestran proveedores de referencia como si fueran reales.
4. CTAs deben orientar a registro/contacto sin confundir al usuario.

Reglas:

- No mezclar demo/reference data con catalogo productivo.
- Si la API falla, mostrar error/estado controlado.
- No llenar automaticamente con datos estaticos en productivo.

## Flujo 10: Primera empresa real

Objetivo:

Validar el MVP con una empresa real desde ambiente limpio.

Pasos sugeridos:

1. Empresa se registra desde pagina publica.
2. Punto Evento revisa en admin.
3. Admin aprueba empresa.
4. Empresa recibe email de activacion.
5. Empresa activa acceso y entra al panel.
6. Empresa carga al menos un servicio con portada/fotos.
7. Admin aprueba servicio.
8. Servicio aparece en pagina publica.
9. Usuario/contacto de prueba ejecuta WhatsApp o cotizacion.
10. Punto Evento confirma que lead/contacto llega al canal correcto.

Checks criticos:

- Registro crea empresa real.
- Login recurrente funciona.
- Admin aprueba entidad correcta.
- Servicio publicado aparece.
- Catalogo vacio deja de mostrarse cuando ya hay servicio real.
- Contacto/WhatsApp/email funcionan segun decision vigente.

## Estados principales

### Empresa

```text
pending
published / approved
rejected
inactive
```

### Servicio

```text
draft
pending
published
rejected
inactive
```

### Upload/imagen

```text
pending
published / approved
rejected
```

## Reglas de coordinacion

- Si cambia una ruta o API, actualizar `docs/ROUTE_MAP_MVP.md`.
- Si cambia un flujo de negocio, actualizar este documento y `docs/DECISION_LOG.md` si es decision durable.
- Si cambia el alcance MVP, actualizar `docs/MVP_RELEASE_STATUS.md`.
- Si cambia el copy de botones/contacto, coordinar con Copy / Gramatica y QA Flujo MVP.
- Si cambia apariencia, coordinar con Diseño/UX y QA Visual / Responsive.
