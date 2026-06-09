# TASK-203: Diseno/UX - guia visual minima marca y panel empresa

## Equipo asignado

Diseno / UX.

## Contexto

Se recibio feedback visual y una propuesta de marca premium para Punto Evento, ademas de una referencia para rediseñar el panel privado de empresas. Product / Architect / Release decidio no enviar esto directo a Web Dev: primero se necesita una guia minima implementable.

El MVP ya esta en go de pre-lanzamiento controlado. Este trabajo no debe abrir rediseño profundo de pagina publica, admin interno ni perfil publico.

Referencias visuales disponibles:

- `Reference Images/Propeusta logo e imagen de pagina.jpeg`
- `Reference Images/Propuesta Panel de Empresas.jpeg`

Lectura inicial Product / Architect / Release:

- Logo: monograma `PE`, negro/dorado, arco fino, estrellas, tagline en mayusculas.
- Tono: premium, editorial, limpio, fondo claro calido.
- Panel: sidebar izquierdo, logo arriba, menu vertical, area principal amplia, tarjetas blancas, acentos dorados, CTA oscuro.
- La referencia muestra `Inicio`; Diseno/UX debe decidir si se incluye como item real del MVP o si se mantiene fuera para no crear una vista nueva.

## Tarea

Convertir las referencias visuales en una guia corta, concreta e implementable para Web Dev.

## Alcance

Definir:

1. Uso del logo:
   - version recomendada;
   - ubicacion en panel;
   - reglas minimas de contraste/tamano.
2. Tagline:
   - confirmar o ajustar `Catalogo digital de proveedores para eventos`.
3. Paleta:
   - color primario;
   - color secundario/acento;
   - fondo;
   - texto;
   - estados disabled/active/error/success.
4. Tipografia:
   - familia sugerida o criterio si se mantiene la actual;
   - jerarquia basica de titulos, cuerpo, labels y botones.
5. Componentes base:
   - botones;
   - inputs;
   - tarjetas;
   - badges/estados;
   - sidebar active/disabled.
6. Panel empresa:
   - layout con sidebar;
   - area principal;
   - acciones superiores: volver a pagina publica, cerrar sesion;
   - tratamiento de hero/titulo superior;
   - tarjetas de resumen de empresa/plan/estado;
   - vista `Mi empresa`;
   - vista `Mis servicios`.
7. Menu MVP:
   - activos: `Mi empresa`, `Mis servicios`;
   - decidir si `Inicio` existe como item activo, alias de resumen o queda fuera por ahora;
   - visibles deshabilitados: `Mensajes`, `Configuracion`, `Ayuda/contacto`, `Metricas`, `Planes`, `Reportes`;
   - copy o badge `Proximamente`.
8. Lista explicita de pantallas incluidas/excluidas.

## No tocar

- No implementar codigo.
- No modificar archivos de producto.
- No cambiar API, modelo de datos, auth, emails ni reglas de moderacion.
- No proponer rediseño profundo de pagina publica, admin o perfil publico.
- No agregar features reales para Mensajes, Metricas, Planes o Reportes.

## Verificacion

La guia debe ser suficientemente especifica para que Web Dev pueda implementar sin reinterpretar:

- colores concretos;
- uso concreto de las referencias ubicadas en `Reference Images/`;
- layout del panel;
- items de menu;
- estados activos/deshabilitados;
- copy principal;
- alcance incluido/excluido.

## Handoff esperado

Crear `tasks/TASK-203-HANDOFF.md` con:

- Resumen visual.
- Referencias revisadas.
- Guia de marca minima.
- Guia de panel empresa.
- Copy sugerido.
- Pantallas incluidas/excluidas.
- Riesgos.
- Decisiones que debe tomar Product / Architect / Release antes de Web Dev.
