# Flujo de registro y publicacion de empresas

## Decision actual

El registro inicial es gratis.

La publicacion no debe ser completamente automatica en MVP. Se recomienda revision manual antes de publicar empresas o servicios.

Motivo:

- Evita spam.
- Evita imagenes o contenido no autorizado.
- Protege calidad del marketplace.
- Permite aprender de los primeros registros.

## Flujo recomendado

## 1. Registro

La empresa completa:

- Nombre comercial.
- Email.
- Password.
- WhatsApp.
- Categoria principal.
- Provincia/canton.
- Descripcion corta.
- Aceptacion de terminos y permiso de uso de imagenes.

Resultado:

```text
Company.status = pending
User.status = active o pending_email_verification
Company.plan = free
```

## 2. Primer ingreso admin

La empresa entra a su panel y ve:

- Estado del perfil.
- Datos faltantes.
- Boton para crear primer servicio.
- Mensaje: "Tu perfil se publicara despues de revision."

## 3. Perfil empresa

Puede editar:

- Logo.
- Portada.
- Descripcion.
- Ubicacion.
- Contacto.
- Redes.

## 4. Servicios

La empresa puede crear N servicios.

Cada servicio incluye:

- Nombre.
- Categoria.
- Tipos de evento.
- Descripcion.
- Precio desde.
- Fotos.
- Paquetes opcionales.

Estados:

```text
draft -> pending -> published
draft -> pending -> rejected
published -> pending_changes -> published
```

## 5. Revision interna

El admin revisa:

- Datos de empresa.
- Fotos.
- Descripciones.
- Categoria.
- Coherencia del servicio.

Puede:

- Aprobar.
- Rechazar con motivo.
- Pedir cambios.

## 6. Publicacion

Cuando un servicio se aprueba:

- Aparece en busquedas/listados.
- Aparece en perfil de empresa.
- Puede recibir cotizaciones.

## 7. Planes futuros

Por ahora:

```text
free = publicado normal
```

Despues:

```text
featured = mejor posicion en categoria
premium = portada/top principal/campanas
```

Los campos deben existir desde temprano:

- `plan`
- `isFeatured`
- `featuredUntil`
- `sortBoost`

## Preguntas pendientes

- Se requiere verificacion de email en MVP?
- El admin interno sera una cuenta separada o lista blanca de emails?
- Cuantas imagenes maximas por servicio?
- Peso maximo por imagen?
- Se permitira publicar cambios automaticamente despues de una primera aprobacion?
