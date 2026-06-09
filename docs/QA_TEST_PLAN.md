# QA Test Plan MVP

## Objetivo

Definir la matriz de pruebas del MVP de Punto Evento para validar registro de empresa, login/admin, multiples servicios, carga de fotos, busqueda por servicio y regresion de la pagina publica actual.

## Alcance

- Pagina publica actual: `#inicio`, `#bodas`, `#proveedor/:id`, `#empresas`.
- Registro gratis de empresa.
- Login administrativo.
- Admin de empresa y servicios.
- Modelo `Empresa -> Servicios`.
- Carga de fotos de empresa y servicio.
- Busqueda publica por servicio.
- Perfil de empresa con varios servicios.
- Seguridad basica y permisos.
- Responsive desktop, tablet y mobile.

## Fuera de alcance

- Pagos reales.
- Ranking avanzado.
- CRM completo.
- Chat en tiempo real.
- App movil.
- Automatizacion de facturacion.

## Datos base de prueba

Empresa principal:

```text
Empresa: Aurisbel
Servicios publicados:
- Queques
- Wedding Planner
- Mesa dulce
```

Servicios adicionales para pruebas:

```text
Servicio draft: Decoracion infantil
Servicio pending: Barra de postres
Servicio rejected: Candy bar externo
Servicio inactive: Catering ejecutivo
```

Usuarios:

```text
admin@puntoevento.test        rol: internal_admin
owner-aurisbel@test.local     rol: company_owner, company: Aurisbel
owner-luzviva@test.local      rol: company_owner, company: Luz Viva
```

Archivos:

```text
foto-valida.jpg      image/jpeg, menor a 5 MB
foto-valida.webp     image/webp, menor a 5 MB
foto-pesada.jpg      image/jpeg, mayor a 5 MB
archivo.pdf          application/pdf
archivo-html.jpg     contenido HTML con extension .jpg
```

## Criterios de entrada

- App publica carga sin errores de consola.
- Ambiente local o Azure disponible.
- Variables de entorno configuradas para API cuando se pruebe integracion real.
- Datos demo o seed incluyen al menos una empresa con tres servicios.
- Credenciales de admin y de empresa disponibles para QA.

## Criterios de salida

- Sin bugs P0/P1 abiertos.
- Bugs P2 revisados y aceptados por Product / Architect / Release si no se corrigen.
- Registro, login, servicios, upload, busqueda y regresion publica validados.
- Riesgos de release documentados.

## Severidades

- P0: caida total, perdida de datos, exposicion grave de secretos o datos entre empresas.
- P1: flujo principal bloqueado o seguridad de permisos rota.
- P2: flujo importante degradado con workaround.
- P3: problema menor visual, copy, documentacion o mejora de robustez.

## Matriz MVP

| ID | Area | Prioridad | Caso | Tipo | Datos | Pasos | Resultado esperado |
| --- | --- | --- | --- | --- | --- | --- | --- |
| QA-001 | Regresion publica | P1 | Home carga | Smoke | `#inicio` | Abrir home | H1 visible, cards cargan, sin consola, sin imagenes rotas |
| QA-002 | Regresion publica | P1 | Landing bodas carga | Smoke | `#bodas` | Abrir bodas | Resultados visibles, filtros visibles, sin consola |
| QA-003 | Regresion publica | P1 | Ficha proveedor carga | Smoke | `#proveedor/casa-arboleda` | Abrir ficha | Galeria, resumen y CTA visibles |
| QA-004 | Regresion publica | P2 | Proveedor inexistente | Negativo | `#proveedor/no-existe` | Abrir hash invalido | Mensaje de proveedor no encontrado y link de retorno |
| QA-005 | Regresion publica | P1 | Carrusel | Interaccion | Ficha proveedor con galeria | Click siguiente, anterior y miniaturas | Imagen, contador y miniatura activa cambian correctamente |
| QA-006 | Cotizacion publica | P1 | Enviar cotizacion demo | Flujo | Nombre, WhatsApp, detalles | Abrir drawer, completar, enviar | Confirmacion visible, form oculto, no error consola |
| QA-007 | Cotizacion publica | P2 | Validacion requeridos | Negativo | Campos vacios | Enviar drawer sin requeridos | Browser bloquea o muestra validacion sin cerrar drawer |
| QA-008 | Registro empresa | P1 | Registro exitoso sin fotos | Flujo | Empresa nueva, terminos aceptados | Completar form y enviar | Empresa queda recibida; confirmacion clara |
| QA-009 | Registro empresa | P1 | Registro exitoso con fotos | Flujo | `foto-valida.jpg`, `foto-valida.webp` | Completar form, subir fotos, enviar | Provider/company pending, uploads pending, mensaje simple |
| QA-010 | Registro empresa | P1 | Campos requeridos | Negativo | Sin nombre, email, categoria o descripcion | Intentar enviar | No envia; muestra validacion del campo faltante |
| QA-011 | Registro empresa | P1 | Email invalido | Negativo | `correo-invalido` | Completar y enviar | No envia; campo email queda invalido |
| QA-012 | Registro empresa | P2 | Terminos no aceptados | Negativo | Checkbox vacio | Intentar enviar | No envia; requiere permiso de informacion e imagenes |
| QA-013 | Registro empresa | P2 | URL opcional invalida | Negativo | `abc` en website | Intentar enviar | Browser/API rechaza formato invalido |
| QA-014 | Login admin | P1 | Admin requiere login | Seguridad | `/admin` o `/admin.html` | Abrir panel sin credenciales | Login visible; lista admin oculta |
| QA-015 | Login admin | P1 | Login correcto | Flujo | `ADMIN_USERNAME`, `ADMIN_PASSWORD` | Ingresar credenciales validas | Lista de pendientes visible |
| QA-016 | Login admin | P1 | Password incorrecto | Negativo | Password malo | Intentar entrar | No muestra datos; mensaje de error claro |
| QA-017 | Login admin | P1 | Logout | Flujo | Sesion iniciada | Click cerrar sesion | Vuelve login; token local removido |
| QA-018 | Admin permisos | P1 | Endpoint admin sin auth | Seguridad | Sin `Authorization` | Llamar endpoint admin | Responde 401 o equivalente; no devuelve pendientes |
| QA-019 | Admin permisos | P1 | Empresa A no ve B | Seguridad | Owner Aurisbel vs Luz Viva | Acceder datos de otra empresa | Acceso denegado; no hay datos cruzados |
| QA-020 | Admin servicios | P1 | Lista multiples servicios | Flujo | Aurisbel con 3 servicios | Abrir admin servicios | Ve Queques, Wedding Planner y Mesa dulce |
| QA-021 | Admin servicios | P1 | Crear servicio | Flujo | Servicio nuevo | Completar nombre, categoria, precio, descripcion | Servicio queda draft o pending segun regla |
| QA-022 | Admin servicios | P1 | Editar servicio propio | Flujo | Mesa dulce | Cambiar precio/descripcion | Cambios guardan y se reflejan |
| QA-023 | Admin servicios | P1 | No editar servicio ajeno | Seguridad | Owner Luz Viva intenta editar Aurisbel | Enviar request o navegar directo | 403/404 sin modificar datos |
| QA-024 | Admin servicios | P2 | Desactivar servicio | Flujo | Servicio publicado | Cambiar a inactive | Deja de aparecer publico |
| QA-025 | Servicios multiples | P1 | Busqueda mesa dulce | Flujo publico | Query `mesa dulce` | Buscar | Resultado muestra servicio Mesa dulce y empresa Aurisbel |
| QA-026 | Servicios multiples | P1 | Link otros servicios | Flujo publico | Resultado Mesa dulce | Click ver otros servicios | Perfil Aurisbel muestra Queques, Wedding Planner y Mesa dulce |
| QA-027 | Servicios multiples | P1 | Servicio seleccionado destacado | Flujo publico | Entrar desde Mesa dulce | Abrir perfil | Mesa dulce aparece destacada y otros servicios visibles |
| QA-028 | Servicios multiples | P1 | Pendientes no publicos | Seguridad/publicacion | Servicio pending | Buscar o abrir URL directa | No aparece en resultados publicos |
| QA-029 | Servicios multiples | P1 | Rechazados no publicos | Seguridad/publicacion | Servicio rejected | Buscar o abrir URL directa | No aparece en resultados publicos |
| QA-030 | Upload fotos | P1 | Foto valida | Flujo | `foto-valida.jpg` | Subir en registro o servicio | Preview visible, reserva/upload/register OK |
| QA-031 | Upload fotos | P1 | Tipo no permitido | Negativo | `archivo.pdf` | Intentar subir | Rechaza antes de guardar; mensaje claro |
| QA-032 | Upload fotos | P1 | Tamano excedido | Negativo | `foto-pesada.jpg` | Intentar subir | Rechaza por maximo 5 MB |
| QA-033 | Upload fotos | P1 | MIME real no coincide | Seguridad | `archivo-html.jpg` | Subir y registrar | API rechaza por contentType real o validacion equivalente |
| QA-034 | Upload fotos | P2 | Limite cantidad | Negativo | 7 imagenes | Seleccionar 7 | Solo acepta 6 o bloquea con mensaje claro |
| QA-035 | Upload fotos | P1 | Imagen pendiente no publica | Seguridad | Imagen pending | Buscar servicio publico | Imagen no aparece hasta aprobacion |
| QA-036 | Aprobacion admin | P1 | Aprobar sin imagen | Negativo | Proveedor pending, todas desmarcadas | Click aprobar | UI/API bloquean; proveedor no pasa published |
| QA-037 | Aprobacion admin | P1 | Aprobar con imagen | Flujo | Proveedor pending con foto | Aprobar una imagen | Proveedor published, imagen published, `publicBlobUrl` lleno |
| QA-038 | Rechazo admin | P1 | Rechazar pending | Flujo | Proveedor pending | Rechazar con motivo | Provider rejected, imagenes pending rejected, slots liberados |
| QA-039 | Rechazo admin | P1 | Rechazar published | Negativo | Provider published | Llamar endpoint rechazo | Error `Provider is not pending` |
| QA-040 | Seguridad inputs | P1 | HTML peligroso | Seguridad | `<img onerror=alert(1)>` en nombre/descripcion | Registrar y renderizar | Se muestra escapado o se rechaza; no ejecuta JS |
| QA-041 | Seguridad uploads | P1 | SAS expirado | Negativo | Esperar vencimiento | Registrar upload vencido | API responde expirado; no ocupa cupo indefinido |
| QA-042 | Seguridad frontend | P1 | Secretos no expuestos | Seguridad | Build publico | Inspeccionar JS/HTML | No hay storage keys, SendGrid keys ni secrets |
| QA-043 | Responsive | P1 | Mobile publico | Responsive | 375px | Revisar home, bodas, ficha, empresas | Sin overflow de pagina; CTA usable |
| QA-044 | Responsive | P1 | Tablet publico/admin | Responsive | 768px | Revisar rutas publicas y admin | Layout usable y sin controles cortados |
| QA-045 | Responsive | P1 | Desktop | Responsive | 1366px | Revisar rutas publicas y admin | Layout estable, sin errores visuales graves |
| QA-046 | Release cache | P2 | Cache busters | Release | HTML desplegado | Revisar Network | Carga versiones esperadas de JS/CSS |
| QA-047 | Docs release | P3 | QA cambios recientes | Documentacion | `QA_CAMBIOS_RECIENTES.md` | Comparar doc vs codigo | No contradice versiones, rutas ni riesgos |

## Checklist por release

- [ ] Home publica carga.
- [ ] Landing bodas carga.
- [ ] Ficha proveedor carga.
- [ ] Carrusel funciona.
- [ ] Formulario de cotizacion valida requeridos.
- [ ] Registro de empresa guarda o muestra fallback esperado segun ambiente.
- [ ] Upload rechaza formatos no permitidos.
- [ ] Upload rechaza archivos mayores al limite.
- [ ] Admin requiere login.
- [ ] Admin no muestra datos sin credenciales.
- [ ] Empresa solo ve y edita sus propios datos.
- [ ] Empresa con tres servicios se muestra correctamente en admin.
- [ ] Busqueda por servicio muestra servicio y empresa.
- [ ] Perfil empresa muestra todos los servicios publicados.
- [ ] Servicios `draft`, `pending`, `rejected` e `inactive` no aparecen publicos.
- [ ] Aprobacion sin imagen no publica.
- [ ] Rechazo de proveedor publicado no se permite.
- [ ] Inputs peligrosos no ejecutan HTML/JS.
- [ ] Responsive validado en 375px, 768px y 1366px.
- [ ] No hay errores de consola en rutas principales.
- [ ] No hay imagenes rotas en rutas principales.
- [ ] Cache busters actualizados para archivos modificados.
- [ ] Riesgos aceptados quedan documentados.

## Pruebas de regresion publica

| Ruta | Validaciones minimas |
| --- | --- |
| `#inicio` | Hero, busqueda demo, categorias, proveedores destacados, CTA empresas |
| `#bodas` | Filtros visibles, resultados, paquetes, CTA cotizacion |
| `#proveedor` | Ficha default o primer proveedor, carrusel, resumen, paquetes |
| `#proveedor/casa-arboleda` | Ficha especifica, galeria, CTAs |
| `#empresas` | Formulario registro, upload preview, planes demo |

## Pruebas de seguridad basica

- Sin sesion no se debe acceder a datos admin.
- Sesion de empresa A no debe leer ni modificar empresa B.
- IDs en URL/body no deben permitir escalacion horizontal.
- HTML ingresado por usuario debe escapar al renderizar.
- Upload debe validar extension, MIME declarado, MIME real y tamano.
- SAS debe expirar y no permitir subir fuera del prefijo esperado.
- No exponer secrets en frontend ni en respuestas de error.

## Riesgos antes de release

- La arquitectura actual conserva endpoints `provider` por compatibilidad; el MVP objetivo requiere `companies/services`.
- La busqueda por servicio y perfil multi-servicio son bloqueantes si el release se presenta como MVP completo.
- Basic Auth propio en admin requiere hardening antes de produccion abierta.
- Falta cleanup global programado de uploads pendientes.
- Falta auditoria completa de acciones admin.
- Pruebas reales de email, Blob Storage y Table Storage dependen de ambiente Azure configurado.

## Recomendacion de automatizacion

- Automatizar smoke publico y admin con navegador headless.
- Automatizar validaciones API negativas para auth, upload y estados.
- Automatizar fixtures `Aurisbel -> Queques / Wedding Planner / Mesa dulce`.
- Mantener checklist manual para responsive visual y copy antes de release.
