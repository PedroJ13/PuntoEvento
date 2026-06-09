# TASK-271: Web Dev - pulir catalogo vacio publico con CTA controlado

## Equipo asignado

Web Dev.

## Contexto

El catalogo publico vacio ya fue corregido para no mostrar referencias estaticas ni datos demo. La revision UX del 2026-06-08 recomienda que el estado vacio se sienta intencional y premium, con una orientacion clara para empresas.

Documentos base:

- `tasks/DISENO_UX_WEB_PAGE_FLOWS_REVIEW_2026-06-08.md`
- `docs/MVP_RELEASE_STATUS.md`

## Tarea

Pulir copy y CTA del estado vacio publico cuando no hay servicios reales publicados.

## Alcance

1. Mantener el catalogo vacio sin datos demo ni referencias como si fueran reales.
2. Usar copy controlado, por ejemplo:
   - `Estamos preparando el catalogo de proveedores verificados.`
   - `Si tienes una empresa de eventos, puedes solicitar acceso gratis.`
3. Agregar o ajustar CTA hacia registro de empresas si ya existe una ruta/seccion segura.
4. Mantener el tono premium alineado con Punto Evento CR.

## No tocar

- No agregar proveedores o servicios ficticios.
- No cambiar API publica.
- No crear contacto directo nuevo si no existe.
- No tocar admin ni panel empresa.

## Verificacion

- `/` con API en 0 items muestra estado vacio intencional.
- No aparecen paquetes/proveedores estaticos de referencia.
- CTA dirige a registro de empresas o seccion acordada.
- Mobile y desktop sin overflow.
- `git diff --check` sobre archivos tocados.

## Handoff esperado

Crear `tasks/TASK-271-HANDOFF.md` con:

- Archivos modificados.
- Copy final usado.
- Evidencia de estado vacio.
- Confirmacion de no datos demo.
