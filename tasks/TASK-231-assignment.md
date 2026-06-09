# TASK-231: Diseno UX - guia de paleta global Punto Evento CR

## Equipo asignado

Diseno UX.

## Contexto

Product quiere aplicar la misma paleta visual del panel empresa al resto de superficies, pero solo como ajuste de colores. El panel empresa ya funciona como referencia de marca premium para `Punto Evento CR`.

## Tarea

Definir una guia minima implementable para extender la paleta del panel empresa a pagina publica, admin interno y emails, sin cambiar layout ni componentes.

## Alcance

1. Revisar la paleta actual del panel empresa en `panel.css`.
2. Definir tokens o equivalencias de color para:
   - fondo principal;
   - fondo de secciones;
   - texto principal;
   - texto secundario;
   - color primario;
   - color secundario/acento;
   - bordes;
   - botones primarios/secundarios;
   - estados admin: pending, approved, rejected, draft, error/success/warning.
3. Indicar como aplicar esos colores en:
   - `index.html` / `styles.css`;
   - `admin.html` / `admin.css`;
   - templates de email si existen en backend.
4. Marcar colores que no deben usarse si reducen contraste.
5. Mantener el alcance en color, no en rediseno.

## No tocar

- No implementar CSS.
- No cambiar layout, estructura, copy, navegacion ni componentes.
- No redisenar pagina publica, admin ni perfil publico.
- No cambiar backend/API.
- No editar assets de logo.

## Verificacion

- La guia permite implementar sin decisiones ambiguas.
- La guia mantiene contraste legible en fondos claros y botones.
- La guia separa claramente pagina publica, admin y emails.
- La guia declara que el panel empresa es la referencia, pero no exige reescribir otras superficies.

## Handoff esperado

Crear `tasks/TASK-231-HANDOFF.md` con:

- Paleta/tokens recomendados.
- Aplicacion por superficie.
- Riesgos de contraste o exceso visual.
- Recomendacion para Web Dev `TASK-232`.
- Recomendacion para Backend/API `TASK-233`.
