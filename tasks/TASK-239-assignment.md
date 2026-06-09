# TASK-239: QA - validar refresh visual publico local/estructural

## Equipo asignado

QA.

## Contexto

`TASK-238` debe implementar un refresh visual acotado de pagina publica y ficha publica de empresa/proveedor, alineado al panel empresa.

## Tarea

Validar local/estructuralmente el refresh visual publico antes de deploy.

## Alcance

1. Leer:
   - `tasks/TASK-237-HANDOFF.md`;
   - `tasks/TASK-238-HANDOFF.md`.
2. Validar pagina publica:
   - home;
   - hero/buscador;
   - stats;
   - categorias/atajos;
   - flujo de conversion;
   - cards de servicios.
3. Validar ficha publica de empresa/proveedor:
   - galeria;
   - card de empresa;
   - servicio destacado;
   - CTAs;
   - datos clave;
   - servicios publicados.
4. Validar desktop y mobile.
5. Confirmar que no se rompio busqueda/listado/perfil/contacto.
6. Confirmar que admin y panel empresa no fueron afectados salvo regresion visual minima si comparten CSS.

## No tocar

- No implementar fixes.
- No desplegar.
- No cambiar datos.
- No cambiar credenciales.

## Verificacion

- Sin P0/P1 visuales o funcionales.
- Sin overflow horizontal.
- Logo correcto visible donde aplica.
- Tipografia y colores coherentes con panel empresa.
- CTAs funcionales y legibles.
- Menu superior/cintillo no debe evaluarse contra las imagenes de referencia, porque Product lo excluyo.

## Handoff esperado

Crear `tasks/TASK-239-HANDOFF.md` con:

- Resultado: aprobado / no aprobado.
- Superficies validadas.
- Evidencia desktop/mobile.
- Hallazgos por severidad.
- Recomendacion para Infra Azure `TASK-240` si aprueba.
