# TASK-204-HANDOFF: aprobacion alcance refresh visual antes de Web Dev

Equipo: Product / Architect / Release  
Fecha: 2026-06-04  
Estado: aprobado con alcance acotado

## Decision tomada

Se aprueba avanzar a implementacion Web Dev con un refresh visual acotado del panel privado de empresas, basado en la guia de `TASK-203`.

La aprobacion no cambia el go tecnico del MVP ni abre rediseño profundo de otras superficies.

## Alcance aprobado

Web Dev puede implementar:

- marca premium base dentro del panel empresa;
- paleta negro/dorado/fondo claro calido segun tokens de `TASK-203`;
- logo/lockup temporal implementable si no existe asset final limpio;
- tagline `Catalogo digital de proveedores para eventos`;
- panel empresa con sidebar izquierdo en desktop;
- navegacion activa:
  - `Mi empresa`;
  - `Mis servicios`;
- items futuros visibles como deshabilitados con `Proximamente`:
  - `Mensajes`;
  - `Configuracion`;
  - `Metricas`;
  - `Planes`;
  - `Reportes`;
- bloque de ayuda/contacto visual, sin crear modulo nuevo;
- botones, tarjetas, inputs, badges y estados alineados a la guia;
- responsive basico desktop/mobile;
- adaptacion visual del login/activacion dentro de `panel.html` si comparte superficie.

## Ajustes Product a la guia

- `Inicio`: no se aprueba como vista nueva en esta ronda.
- Si Web Dev necesita un item superior, puede usar `Mi empresa` como primera vista o un `Resumen` que reutilice datos existentes, sin dashboard nuevo.
- Fuentes externas: no bloquear implementacion por fuente web. Preferir fallback local/sistema:
  - titulos: `Georgia` o serif similar;
  - UI: `system-ui`.
- Logo: si no hay asset final vectorial, Web Dev puede recrear un lockup tipografico temporal en HTML/CSS. No depender de JPEG borroso como logo productivo.
- `Ayuda/contacto`: puede existir como bloque visual simple; no debe activar mensajeria ni soporte nuevo.

## Alcance excluido

No entra en esta ronda:

- rediseño profundo de pagina publica;
- rediseño profundo de admin interno;
- rediseño de perfil publico de empresa;
- cambios API/backend;
- nuevos modulos reales de mensajes, metricas, planes, reportes o configuracion avanzada;
- pagos, ranking, CRM o dashboard.

## Tareas creadas

- `TASK-205`: Web Dev - implementar branding base aprobado y refresh panel empresa.
- `TASK-206`: QA - validar refresh visual panel empresa y regresion minima.

## Docs actualizados

- `docs/DECISION_LOG.md`
- `docs/BACKLOG.md`
- `docs/MVP_RELEASE_STATUS.md`

## Riesgos

- Si el panel usa logo temporal, puede requerir reemplazo cuando exista asset final.
- Si se aplican tokens globales fuera de `panel.html` sin control, podria afectar pagina publica; QA debe revisar regresion minima.
- Items deshabilitados deben quedar claramente no interactivos para no parecer funciones rotas.

