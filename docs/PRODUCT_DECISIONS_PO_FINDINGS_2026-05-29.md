# Decisiones Product Owner Findings - 2026-05-29

## Estado

Estado: aprobado para orientar tareas.

Fuente:

```text
docs/PRODUCT_OWNER_TEST_FINDINGS_2026-05-29.md
```

## Decision 1: contacto de empresa

Para MVP, separar datos internos de contacto y datos publicos.

Campos obligatorios de registro:

- Nombre comercial.
- Email de contacto interno.
- WhatsApp comercial.
- Provincia/zona.
- Descripcion corta.

Campos opcionales:

- Telefono secundario.
- Sitio web.
- Instagram.
- Facebook.
- TikTok.

Visibilidad publica inicial:

- Publicos: WhatsApp, sitio web, Instagram, Facebook, TikTok si la empresa los provee.
- Internos: email de contacto y notas operativas de validacion.

Regla:

- No publicar email por defecto en el perfil publico.
- Los canales sociales deben validarse como URL o handle normalizado.
- Si no hay canal publico suficiente, el perfil no deberia publicarse.

## Decision 2: taxonomia

Mantener dos campos porque resuelven preguntas distintas.

`Categoria` responde:

```text
Que vende u ofrece la empresa?
```

Ejemplos:

- Salon y jardin.
- Catering.
- Fotografia.
- Video.
- Musica y DJ.
- Decoracion.
- Flores.
- Mesa dulce.
- Queques.
- Wedding planner.
- Mobiliario.
- Animacion.
- Alquiler de menaje.

`Tipos de evento` responde:

```text
Para que ocasion sirve?
```

Ejemplos:

- Bodas.
- Cumpleanos.
- Eventos corporativos.
- Baby Shower.
- Graduaciones.
- Fiestas infantiles.

Reglas:

- `Categoria` no debe contener nombres de ocasiones como `Bodas`.
- `Tipos de evento` no debe contener servicios como `Catering` o `Fotografia`.
- Ambos deben venir de catalogos controlados.
- En la UI se debe explicar con labels cortos: `Categoria del servicio` y `Tipos de evento donde aplica`.

## Decision 3: revision de servicios

Para MVP, la empresa no edita manualmente `status`.

Regla de flujo:

- Crear o editar servicio guarda como `draft`.
- La empresa usa un boton explicito `Enviar a revision`.
- Al enviar a revision, el servicio pasa a `pending`.
- Si un servicio `published` se edita en campos publicos, vuelve a `draft` hasta que la empresa lo envie de nuevo.

Razon:

- Evita publicar cambios incompletos.
- Hace visible para la empresa que hay un paso de revision.
- Desbloquea copy claro en el panel.

UI:

- Quitar `Estado` del formulario.
- Mostrar estado solo como etiqueta de lectura en card/listado.
- Reemplazar `Como se revisa` por ayuda breve o texto contextual junto a `Enviar a revision`.

## Decision 4: imagenes de servicio

MVP debe soportar cover y galeria.

Reglas:

- Cover del servicio: 1 imagen.
- Galeria del servicio: hasta 6 imagenes.
- Formatos: JPG, PNG, WEBP.
- Tamano maximo: 5 MB por imagen.
- Imagenes nuevas siempre quedan `pending` hasta aprobacion admin.

UI:

- Separar controles:
  - `Cover del servicio`.
  - `Fotos de galeria`.
- Quitar `Cantidad de fotos` como input manual.
- Mostrar conteo calculado como lectura en card/listado.

Admin:

- No se requiere preview visual para aprobar MVP si se mantiene la seguridad sin SAS.
- Un preview seguro futuro debe pasar por endpoint interno autenticado sin exponer SAS.

## Decision 5: moderacion admin

Mover la moderacion principal a expediente de empresa.

MVP recomendado:

- Mantener contadores globales.
- Agregar una vista principal por empresa:
  - datos de empresa;
  - servicios de esa empresa;
  - uploads de esa empresa;
  - acciones con contexto.

Regla:

- Las listas globales pueden quedar como resumen, pero la aprobacion operativa debe ocurrir desde el expediente.
- La UI debe reducir el riesgo de aprobar servicio/upload de otra empresa por accidente.

## Decision 6: cascadas de aprobacion/rechazo

No implementar cascadas silenciosas.

Reglas MVP:

- Aprobar empresa no publica automaticamente servicios ni uploads.
- Aprobar upload publica la imagen y la asocia a Company/Service segun `scope` e `imageType`.
- Aprobar servicio publica el servicio, pero no aprueba uploads pendientes automaticamente.
- Rechazar empresa no rechaza automaticamente servicios/uploads, salvo accion explicita con confirmacion.
- Rechazar servicio no rechaza automaticamente uploads, salvo accion explicita con confirmacion.

Acciones futuras recomendadas:

- `Aprobar expediente` con resumen visible:
  - empresa afectada;
  - servicios seleccionados;
  - uploads seleccionados.
- `Rechazar expediente` con resumen y razon obligatoria.

Hasta que exista esa UI, las acciones deben seguir siendo explicitas por entidad.

## Decision 7: registro exitoso

El formulario publico debe cerrar claramente el flujo.

Reglas:

- Deshabilitar submit durante envio.
- Evitar doble submit.
- En exito, limpiar u ocultar formulario.
- Mostrar confirmacion dominante.
- Mostrar accion `Registrar otra empresa`.
- En error, mantener datos y reactivar formulario.

Esta decision queda lista para Web Dev en `TASK-110`.

## Riesgos no aceptados para invitar empresas reales

- Credencial admin expuesta sin rotar.
- Registro exitoso que permite duda de doble submit.
- Taxonomia ambigua donde `Categoria` mezcla eventos y servicios.
- Panel empresa con `Estado` editable por empresa.
- Carga de imagenes sin galeria si Product Owner espera fotos adicionales para publicar servicios reales.
- Moderacion sin contexto de empresa si hay volumen real de empresas pendientes.

## Riesgos aceptables para prueba controlada

- Admin con Basic Auth compartido, siempre que se rote despues de exposiciones y se limite el acceso.
- Sin preview visual seguro de uploads en admin, si los nombres/metadatos bastan para la prueba.
- Email automatico pendiente, si las invitaciones se manejan manualmente por canal seguro.
- Limpieza manual de datos QA mientras el volumen sea pequeno.

## Secuencia recomendada

1. Infra rota credencial admin expuesta.
2. Web Dev corrige registro exitoso y doble submit.
3. Panel empresa ajusta formulario:
   - sin estado editable;
   - sin cantidad manual;
   - boton `Enviar a revision`;
   - cover + galeria.
4. Product/Data actualiza catalogos de categorias.
5. Admin/Web Dev disena expediente de empresa.
6. Backend/API agrega o ajusta endpoints para expediente y `submit-review`.
7. QA revalida flujo Product Owner.
