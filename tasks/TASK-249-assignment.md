# TASK-249: Web Dev - copy publico P1 pre-lanzamiento

## Equipo asignado

Web Dev.

## Contexto

Copy / Gramatica detecto riesgos P1 en superficies publicas antes de continuar con pruebas reales:

- La pagina se presenta como `demo`.
- Metricas publicas pueden prometer escala no verificada.
- `Cotizacion multiple` promete un flujo que no existe plenamente.
- `Planes demo` aparece en superficie publica.

Decision Product / Architect / Release:

- Punto Evento CR no debe presentarse como demo.
- No usar metricas numericas si no son verificables.
- No prometer cotizacion multiple en MVP.
- Los leads reales deben partir de un servicio publicado.

## Tarea

Ajustar el copy publico P1 para eliminar lenguaje de demo, metricas no verificadas y promesas de cotizacion multiple.

## Alcance

- `index.html`
- `app.js`
- Textos publicos normales de home, registro de empresas, planes/beneficios y CTA de solicitud/contacto.

Cambios esperados:

- Title sugerido: `Punto Evento CR | Proveedores para eventos en Costa Rica`.
- Meta description sugerida: `Encuentra y contacta proveedores para eventos en Costa Rica.`
- Quitar `demo`, `Demo propuesta`, `Punto Evento CR demo` de superficies publicas normales.
- Reemplazar `Cotizacion multiple` por `Enviar solicitud`, `Contactar proveedor` o `Solicitar cotizacion`, segun contexto.
- Reemplazar metricas no verificadas por beneficios sin numeros, salvo que ya exista dato real defendible documentado.
- Reemplazar `Planes demo` por `Planes para empresas` u `Opciones de visibilidad`.

## No tocar

- No implementar cotizacion multiple.
- No cambiar backend/API.
- No redisenar layout.
- No tocar admin/panel salvo referencias publicas compartidas inevitables.
- No cambiar nombres de variables, ids, endpoints, slugs ni claves tecnicas.

## Verificacion

- Cargar home publica.
- Navegar a registro de empresas.
- Abrir drawer/contacto desde un servicio publicado.
- Confirmar que no aparece `demo` en superficies publicas normales.
- Confirmar que no aparece `Cotizacion multiple` si no hay flujo multi-proveedor real.

## Handoff esperado

Crear `tasks/TASK-249-HANDOFF.md` con:

- Resumen de textos reemplazados.
- Archivos tocados.
- Evidencia de busqueda local de `demo`, `Demo propuesta`, `Cotizacion multiple` y `Planes demo`.
- Riesgos o textos pendientes.
