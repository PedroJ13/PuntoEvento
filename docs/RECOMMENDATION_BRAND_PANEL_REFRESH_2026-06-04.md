# Recomendacion Pulso: Refresh visual de marca y panel empresa 2026-06-04

## Contexto

Se recibio feedback sobre la apariencia de la web y se compartieron dos referencias visuales:

1. Logo propuesto de Punto Evento con paleta negro/dorado y tono mas premium.
2. Referencia para el panel privado de empresas, con menu lateral y una experiencia mas limpia/elegante.

La segunda imagen corresponde al panel privado de empresas, no al perfil publico de empresa.

## Lectura Pulso

Este cambio no parece implicar una modificacion grande de APIs ni modelo de datos. Es principalmente diseño, UX, branding, HTML/CSS y ajustes frontend.

Sin embargo, no conviene mandarlo directo a implementacion sin una mini definicion de Diseño/UX. La marca nueva afecta a todo el producto, aunque la pantalla que se rediseñara ahora sea solo el panel privado de empresas.

## Alcance recomendado

### Afecta globalmente

- Logo.
- Paleta de colores.
- Tono visual premium.
- Tagline.
- Variables CSS/base visual.
- Estilo general de botones, estados, acentos y tarjetas.

Tagline recomendado:

```text
Catalogo digital de proveedores para eventos
```

### Rediseño especifico ahora

- Panel privado de empresas.

### Fuera de alcance por ahora

- Rediseño profundo de pagina publica.
- Rediseño profundo de admin interno.
- Rediseño del perfil publico de empresa.
- Nuevos modulos de mensajes, metricas, planes o reportes.
- Cambios de API o modelo de datos.

## Panel privado de empresas

La referencia del panel propone:

- Layout con sidebar izquierdo.
- Logo arriba.
- Area principal clara.
- Acciones superiores:
  - volver a pagina publica;
  - cerrar sesion.
- Vista enfocada en cargar/gestionar servicios.
- Estilo mas elegante, limpio y comercial.

### Menu MVP

Activos:

- Mi empresa.
- Mis servicios.

Visibles pero deshabilitados/opacos:

- Mensajes.
- Configuracion.
- Ayuda/contacto.
- Metricas.
- Planes.
- Reportes.

Reglas UX para items deshabilitados:

- Deben verse como parte del roadmap, no como botones rotos.
- Usar opacidad baja o estado disabled.
- No deben navegar.
- Mostrar `Proximamente` si hay tooltip, badge o texto auxiliar.

## Prioridad sugerida

P2 alto / P1 comercial si habra demos proximas con empresas reales.

Motivo:

El flujo puede funcionar tecnicamente, pero la apariencia actual puede sentirse demo o inmadura. La marca nueva y el panel empresa elevan confianza comercial antes de mostrar el producto a mas proveedores.

## Orden recomendado

### TASK A: Diseño/UX define guia visual minima

Rol: Diseño/UX

Tarea:
Convertir las referencias visuales en una guia implementable para Web Dev.

Debe definir:

- Uso del logo.
- Version del tagline.
- Paleta principal/secundaria.
- Tipografia sugerida o criterio tipografico.
- Estilo de botones.
- Estilo de tarjetas/inputs/estados.
- Estados active/disabled para sidebar.
- Layout del panel empresa.
- Copy principal del panel.
- Que elementos deben quedar visibles pero deshabilitados.

No implementar codigo.

Salida esperada:

- Handoff o especificacion clara para Web Dev.
- Lista de pantallas incluidas/excluidas.

### TASK B: Product / Architect / Release aprueba alcance

Rol: Product / Architect / Release

Tarea:
Revisar el handoff de Diseño/UX y confirmar alcance de implementacion.

Decision esperada:

- Refresh visual global limitado a branding base.
- Rediseño implementable solo para panel privado de empresas.
- Admin y pagina publica quedan fuera de rediseño profundo por ahora.

Docs sugeridos:

- `docs/MVP_RELEASE_STATUS.md`
- `docs/BACKLOG.md`
- `docs/DECISION_LOG.md` si se formaliza la identidad visual como decision.

### TASK C: Web Dev implementa branding base y panel empresa

Rol: Web Dev

Tarea:
Implementar la guia aprobada en el panel privado de empresas.

Alcance probable:

- `panel.html`
- `panel.css`
- `panel.js` solo si la navegacion/sidebar requiere ajustes.
- Assets de logo si se agregan al repo.
- Variables o estilos compartidos si se decide aplicar branding base global.

No tocar:

- API.
- Admin interno salvo que Product lo pida.
- Rediseño completo de pagina publica.
- Perfil publico de empresa, salvo logo/colores globales aprobados.

Salida esperada:

- Panel empresa alineado con la nueva identidad.
- Menu lateral con items activos y futuros deshabilitados.
- Responsive basico desktop/mobile.

### TASK D: QA valida panel empresa y regresion visual minima

Rol: QA

Tarea:
Validar que el rediseño no rompa flujos existentes.

Casos:

- Empresa entra al panel.
- Ve Mi empresa y Mis servicios.
- Puede cargar/editar/desactivar servicios segun flujo actual.
- Items futuros se ven deshabilitados y no navegan.
- Volver a pagina publica funciona.
- Cerrar sesion funciona.
- Responsive basico desktop/mobile.
- Pagina publica no queda rota por cambios globales de branding.

Salida esperada:

- QA aprobado/no aprobado con P0/P1/P2.

## Riesgos

- Si Web Dev implementa sin guia, puede quedar una pantalla bonita pero inconsistente con el resto del producto.
- Si se cambia branding global sin control, se puede romper la pagina publica actual.
- Si se activan menu items futuros sin funcionalidad, el producto parecera incompleto o roto.
- Si se intenta rediseñar todo ahora, se abre un frente grande antes de cerrar pre-lanzamiento.

## Recomendacion final

Asignar primero a Diseño/UX.

Diseño/UX debe producir una guia corta e implementable. Luego Product / Architect / Release aprueba alcance y recien despues Web Dev implementa.

No atacar esto como una tarea directa de Web Dev sin definicion visual previa.
