# TASK-274: QA Azure - revalidar ajustes UX flujos web 2026-06-08

## Equipo asignado

QA.

## Contexto

Infra Azure debe completar `TASK-273`. Esta tarea revalida en el ambiente publicado los ajustes UX/copy derivados de la revision del 2026-06-08.

Ambiente:

```text
https://zealous-field-08fdd720f.7.azurestaticapps.net
```

## Tarea

Validar en Azure el bloque de ajustes UX de flujos web.

## Alcance

1. Pagina publica:
   - home carga;
   - catalogo vacio controlado si no hay servicios;
   - sin datos demo/referencias estaticas;
   - CTA de empresas funciona.
2. Contacto/cotizacion:
   - WhatsApp y formulario/email tienen copy claro;
   - no se envia lead sin `companyId + serviceId`.
3. Ficha/resultados:
   - servicio primero, empresa como contexto;
   - mobile sin overflow.
4. Registro:
   - confirmacion post-registro explica siguiente paso por correo.
5. Panel empresa:
   - estados visibles entendibles;
   - login/activacion no regresa.
6. Admin:
   - resumen de pendientes visible;
   - login admin sin prompt nativo;
   - approve/reject no regresa.

## No tocar

- No crear empresas reales salvo que se use una entidad QA controlada.
- No publicar secretos, tokens, cookies ni credenciales.
- No modificar datos productivos fuera del alcance QA.

## Verificacion

- Clasificar hallazgos P0/P1/P2/P3.
- Indicar si el bloque queda aprobado para test con primera empresa real.
- Confirmar commit/versiones si son visibles.

## Handoff esperado

Crear `tasks/TASK-274-HANDOFF.md` con:

- Resultado final.
- Evidencia por superficie.
- Riesgos aceptables.
- Recomendacion go/no-go.
