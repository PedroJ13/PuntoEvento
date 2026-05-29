# TASK-109 Handoff - Decisiones P1 Product Owner

## Resultado general

Completado.

Se cerraron las decisiones P1 de producto/datos derivadas de los hallazgos Product Owner.

## Documento creado

```text
docs/PRODUCT_DECISIONS_PO_FINDINGS_2026-05-29.md
```

## Decisiones tomadas

1. Contacto de empresa:
   - Obligatorios: nombre comercial, email interno, WhatsApp comercial, provincia/zona y descripcion.
   - Opcionales: telefono, website, Instagram, Facebook, TikTok.
   - Publicos: WhatsApp y redes/sitio si existen.
   - Interno: email por defecto.

2. Taxonomia:
   - Mantener `Categoria` + `Tipos de evento`.
   - `Categoria` = que vende la empresa.
   - `Tipos de evento` = ocasiones donde aplica.
   - Evitar que `Categoria` use nombres de eventos como `Bodas`.

3. Revision de servicios:
   - Empresa no edita `status`.
   - Crear/editar guarda `draft`.
   - Accion explicita `Enviar a revision` cambia a `pending`.
   - Servicio publicado que cambia contenido publico vuelve a `draft`.

4. Imagenes:
   - MVP soporta cover + galeria.
   - Cover: 1 imagen.
   - Galeria: hasta 6 imagenes.
   - JPG, PNG, WEBP, maximo 5 MB cada una.

5. Moderacion admin:
   - La accion principal debe migrar a expediente de empresa.
   - Las listas globales pueden quedar como resumen.

6. Cascadas:
   - No se aceptan cascadas silenciosas.
   - Aprobar empresa no publica servicios/uploads.
   - Aprobar servicio no aprueba uploads.
   - Rechazos relacionados requieren accion futura explicita con confirmacion.

7. Registro exitoso:
   - Debe bloquear doble submit.
   - En exito debe limpiar/ocultar formulario y mostrar `Registrar otra empresa`.

## Docs modificados

- `docs/PRODUCT_DECISIONS_PO_FINDINGS_2026-05-29.md`
- `docs/DATA_MODEL.md`
- `docs/API_CONTRACTS_MVP.md`
- `docs/BACKLOG.md`
- `docs/MVP_RELEASE_STATUS.md`
- `tasks/PRODUCT_ARCHITECT_PROCESSED_HANDOFFS.md`

## Tareas recomendadas siguientes

Infra Azure / Product:

- Completar `TASK-108`: rotar `ADMIN_PASSWORD` expuesto.

Web Dev:

- Completar `TASK-110`: registro exitoso y doble submit.

Panel empresa:

- Quitar `Estado` editable del formulario.
- Quitar `Cantidad de fotos` manual.
- Reemplazar `Como se revisa` por ayuda breve o boton real `Enviar a revision`.
- Separar `Cover del servicio` y `Fotos de galeria`.
- Mostrar conteo de imagenes como lectura.

Backend/API:

- Implementar `POST /api/companies/me/services/{serviceId}/submit-review`.
- Asegurar que create/update no acepta `status` desde empresa.
- Si servicio publicado cambia contenido publico, volverlo `draft`.
- Validar limites de cover/galeria.

Admin UI/API:

- Disenar expediente de empresa con Company, Services y Uploads relacionados.
- Mantener acciones por entidad sin cascadas silenciosas.
- Evaluar endpoints de listado por `companyId`.

QA:

- Revalidar Product Owner despues de P0/P1.
- Agregar casos para taxonomia, submit-review, galeria y expediente admin.

## Riesgos aceptados

- Basic Auth admin puede seguir para prueba controlada, siempre que se roten credenciales expuestas.
- Sin preview visual seguro de uploads en admin por ahora.
- Email automatico puede quedar pendiente si el flujo de invitacion se maneja por canal seguro.

## Riesgos no aceptados para empresas reales

- Credencial admin expuesta sin rotar.
- Categoria/eventTypes ambiguos.
- Estado editable por empresa.
- Falta de accion clara para enviar a revision.
- Moderacion sin contexto si aumenta el volumen.

## Aviso

Termine TASK-109. Product/Architect debe leer tasks/TASK-109-HANDOFF.md.
