# Plan refresh visual marca y panel empresa 2026-06-04

## Estado

El MVP esta en go de pre-lanzamiento controlado. Este frente visual no debe reabrir alcance profundo ni bloquear el flujo validado, salvo que Product decida usarlo antes de nuevas demos comerciales.

## Principio de alcance

- La marca afecta globalmente: logo, paleta, acentos, botones, estados y tono visual.
- La implementacion de pantalla por ahora aplica solo al panel privado de empresas.
- Pagina publica, admin interno y perfil publico quedan fuera de rediseño profundo.
- No se cambian API, modelo de datos, auth, emails ni reglas de moderacion.

## Referencias visuales

Ubicacion:

```text
Reference Images/
```

Archivos:

- `Propeusta logo e imagen de pagina.jpeg`
- `Propuesta Panel de Empresas.jpeg`

Lectura inicial:

- Marca premium con monograma `PE`, negro/dorado y tagline en mayusculas.
- Panel privado con sidebar izquierdo, fondo claro calido, tarjetas blancas, acentos dorados y CTAs oscuros.
- La referencia del panel incluye `Inicio`; Diseno/UX debe definir si entra al MVP o si se excluye para evitar una vista nueva.

## Secuencia obligatoria

1. `TASK-203`: Diseño/UX define guia visual minima implementable.
2. `TASK-204`: Product / Architect / Release aprueba alcance y decide que pasa a Web Dev.
3. Despues de `TASK-204`, se crean tareas Web Dev:
   - branding base aprobado;
   - panel empresa con sidebar/menu.
4. Despues de Web Dev, se crea tarea QA para validar panel, responsive y regresion minima.

## Decision pendiente

Product debe aprobar:

- uso del logo propuesto;
- paleta premium negro/dorado u otra variante;
- tagline final;
- nivel de aplicacion global del branding base;
- alcance exacto del panel empresa;
- si `Inicio` entra o no como item MVP del sidebar;
- items visibles/deshabilitados del sidebar.

## Fuera de alcance por ahora

- Rediseño profundo de pagina publica.
- Rediseño profundo de admin interno.
- Rediseño de perfil publico de empresa.
- Mensajeria real, metricas, planes, reportes o nuevos modulos.
- Cambios backend/API.
