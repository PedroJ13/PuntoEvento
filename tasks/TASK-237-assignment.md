# TASK-237: Diseno UX - guia visual publica premium Punto Evento CR

## Equipo asignado

Diseno UX.

## Contexto

Product envio una nueva revision visual de usuarios para la pagina publica y la ficha publica de empresa/proveedor.

Ya se aplico paleta global `Punto Evento CR`, pero Product pide elevar la direccion visual publica para acercarla al estilo premium del panel empresa.

Referencias descritas por Product:

- Imagen 1: pagina publica principal.
- Imagen 2: continuacion de pagina publica principal.
- Imagen 3: pagina publica de empresa hacia clientes.

Instrucciones de Product:

- No prestar atencion al cintillo/menu superior de las referencias.
- El logo de la izquierda debe ser el mismo que se aplico en el panel de empresas.
- Revisar la imagen principal/hero y ajustar su tratamiento visual.
- Ajustar tipo de letra; puede ser el mismo estilo del panel empresa.
- Aplicar criterio parecido a la pagina/ficha publica de empresa.
- Mantener colores y estilo alineados al panel empresa.

## Tarea

Convertir la revision visual de Product en una guia implementable y acotada para Web Dev.

## Alcance

1. Definir alcance visual para:
   - home/pagina publica;
   - continuacion de pagina publica;
   - ficha publica de empresa/proveedor.
2. Definir uso del logo:
   - usar el mismo asset aprobado del panel empresa: `assets/images/logo-punto-evento-cr-panel.png`;
   - definir tamano, proporcion y tratamiento en header publico/ficha publica.
3. Definir tipografia recomendada:
   - headings con estilo premium alineado al panel empresa;
   - cuerpo legible para catalogo;
   - no introducir fuentes externas si no son necesarias.
4. Definir tratamiento del hero:
   - imagen principal mas premium y legible;
   - overlay o encuadre si aplica;
   - sin cambiar el flujo de busqueda.
5. Definir ajustes visuales para secciones de home:
   - stats;
   - categorias/atajos;
   - flujo de conversion;
   - cards de servicios;
   - seccion de precios/paquetes si existe.
6. Definir ajustes visuales para ficha publica:
   - galeria;
   - card de empresa;
   - servicio destacado;
   - CTAs;
   - datos clave;
   - lista de servicios publicados.
7. Mantener el alcance como refresh visual, no redisenio funcional.

## No tocar

- No implementar codigo.
- No cambiar navegacion superior/cintillo.
- No cambiar API/backend.
- No cambiar flujos de busqueda, contacto, WhatsApp, cotizacion ni registro.
- No cambiar admin interno.
- No cambiar panel empresa.
- No crear nuevas secciones funcionales.

## Verificacion

- La guia permite implementar sin ambiguedad.
- El alcance preserva la pagina publica actual y solo mejora direccion visual.
- Se identifica claramente que se debe mantener el menu superior fuera del alcance.
- Se identifican riesgos de contraste, responsive o imagenes.

## Handoff esperado

Crear `tasks/TASK-237-HANDOFF.md` con:

- Guia visual implementable.
- Asset de logo a usar.
- Reglas tipograficas.
- Tratamiento de hero/ficha publica.
- Lista de cambios permitidos y excluidos.
- Recomendacion para Web Dev `TASK-238`.
