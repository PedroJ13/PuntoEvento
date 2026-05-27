# Equipo QA: nuevo enfoque Punto Evento

## Contexto

La pagina publica ya existe. El nuevo alcance agrega:

- Registro de empresas.
- Login administrativo.
- Panel de empresa.
- Multiples servicios/eventos por empresa.
- Carga de fotos.
- Busqueda publica basada en servicios.
- Perfil de empresa con todos sus servicios.

QA debe validar tanto la experiencia publica como la administrativa.

## Areas de prueba

## 1. Registro de empresa

Validar:

- Campos requeridos.
- Email valido.
- Password y confirmacion.
- Categoria principal.
- Multiples categorias/servicios.
- Tipos de evento.
- Provincia/canton/distrito.
- Telefono y WhatsApp.
- Terminos/permiso de imagenes.
- Mensajes de error claros.
- Mensaje de exito claro.

Casos:

- Registro correcto.
- Registro sin email.
- Registro con email invalido.
- Password diferente a confirmacion.
- Empresa ya registrada.
- Categoria vacia.
- Imagen demasiado pesada.
- Imagen con formato no permitido.

## 2. Login administrativo

Validar:

- Login correcto.
- Password incorrecto.
- Usuario inexistente.
- Recuperar password.
- Cierre de sesion.
- Acceso a `/admin` sin login.
- Empresa solo ve sus propios datos.

## 3. Panel de empresa

Validar:

- Ver perfil de empresa.
- Editar perfil.
- Guardar cambios.
- Ver estado: borrador, pendiente, publicado.
- Crear servicio.
- Editar servicio.
- Eliminar/desactivar servicio.
- Cargar fotos por servicio.
- Reordenar fotos si aplica.
- Enviar cambios a revision.

## 4. Multiples servicios por empresa

Ejemplo:

```text
Empresa: Aurisbel
Servicios:
  - Queques
  - Wedding Planner
  - Mesa dulce
```

Validar:

- Los 3 servicios se muestran en admin.
- Cada servicio tiene categoria propia.
- Cada servicio puede tener fotos propias.
- Cada servicio puede tener precio propio.
- Cada servicio puede aparecer en su busqueda correspondiente.
- El perfil de empresa muestra los 3 servicios.

## 5. Busqueda publica

Escenario clave:

El usuario busca "mesa dulce".

Validar opcion recomendada:

- Aparece el servicio "Mesa dulce".
- Se muestra que pertenece a la empresa.
- Hay boton para cotizar ese servicio.
- Hay link para ver otros servicios de la empresa.
- Al abrir perfil, se destaca "Mesa dulce" y tambien se ven los otros servicios.

Casos:

- Buscar por categoria exacta.
- Buscar por tipo de evento.
- Buscar por provincia.
- Buscar empresa con varios servicios.
- Servicios inactivos no aparecen.
- Servicios pendientes no aparecen.
- Servicios destacados aparecen arriba segun reglas.

## 6. Fotos

Validar:

- Upload de logo.
- Upload de portada.
- Upload de galeria.
- Vista previa.
- Limite de cantidad.
- Limite de peso.
- Formatos permitidos.
- Imagen rota usa fallback.
- Imagen pendiente no aparece publica hasta aprobar.

## 7. Planes y posicionamiento

Por ahora el registro es gratis.

Validar:

- Empresa gratis se publica normalmente.
- Empresa gratis no aparece como destacada.
- Servicio destacado aparece arriba solo si tiene plan activo.
- Plan vencido deja de destacar.
- No se rompe el ordenamiento si varias empresas tienen plan destacado.

## 8. Seguridad basica

Validar:

- Empresa A no puede editar Empresa B.
- Rutas admin protegidas.
- Inputs no permiten HTML peligroso.
- Upload no acepta archivos no imagen.
- No se exponen tokens o secretos en frontend.

## 9. Responsive

Probar:

- 375px mobile.
- 768px tablet.
- 1366px desktop.
- Formulario largo en mobile.
- Admin en mobile.
- Carga de fotos en mobile.
- Carrusel en mobile.

## 10. Regresion pagina publica

Cada cambio admin no debe romper:

- Home.
- Landing bodas.
- Ficha de proveedor.
- Carrusel.
- Formulario de cotizacion.
- Navegacion.

## Entregables de QA

1. Matriz de pruebas.
2. Casos principales por flujo.
3. Checklist por release.
4. Reporte de bugs con severidad.
5. Pruebas responsive.
6. Pruebas de datos Empresa/Servicio.
7. Pruebas de permisos.

