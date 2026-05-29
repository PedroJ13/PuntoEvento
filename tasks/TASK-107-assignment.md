# TASK-107: Guion de prueba Product Owner del flujo MVP

## Equipo asignado

Product / Architect / Release.

## Contexto

`TASK-106` aprobo `admin.html` en Azure con `admin.js?v=12`:

- login admin valido e invalido;
- legacy `Revision` sin `sig=` en DOM;
- `Modelo nuevo` con Companies, Services y Uploads reales;
- approve real desde UI de Company, Service y Upload QA;
- sin campos prohibidos;
- responsive mobile/desktop;
- sin errores de consola.

Con esto, el flujo UI principal esta listo para preparar una prueba Product Owner controlada.

## Archivos que debes leer

- `AGENTS.md`
- `docs/MVP_RELEASE_STATUS.md`
- `docs/BACKLOG.md`
- `docs/API_CONTRACTS_MVP.md`
- `docs/QA_TEST_PLAN.md`
- `tasks/TASK-106-HANDOFF.md`
- `index.html`
- `panel.html`
- `admin.html`

## Objetivo

Crear un guion claro para que Product Owner pruebe el flujo completo MVP desde navegador, sin necesitar apoyo tecnico constante.

## Alcance

Crear un documento:

```text
docs/PRODUCT_OWNER_TEST_SCRIPT.md
```

Debe cubrir:

1. URLs a probar:
   - pagina publica;
   - registro empresa;
   - panel empresa;
   - admin interno.
2. Preparacion necesaria:
   - esperar deploy actual;
   - credenciales o invitaciones necesarias por canal seguro;
   - datos QA recomendados;
   - que no se deben publicar secretos en capturas/handoffs.
3. Flujo empresa:
   - registrar empresa;
   - aceptar/iniciar sesion;
   - revisar perfil;
   - crear/editar servicio;
   - subir foto;
   - logout.
4. Flujo admin:
   - login admin;
   - revisar `Modelo nuevo`;
   - aprobar/rechazar Company, Service y Upload;
   - verificar feedback/refresh.
5. Flujo publico:
   - buscar servicio publicado;
   - abrir perfil de empresa;
   - revisar carrusel/imagenes;
   - revisar CTA de cotizacion/contacto segun estado MVP.
6. Criterios de aceptacion:
   - que se considera PASS;
   - que se considera bloqueo;
   - que se considera riesgo aceptable MVP.
7. Riesgos MVP conocidos:
   - Basic Auth admin compartido;
   - uploads del modelo nuevo sin preview visual en admin;
   - posible decision pendiente de `submit-review`;
   - notificacion email pendiente;
   - datos QA pendientes en Azure.
8. Siguiente decision:
   - si Product Owner aprueba, pasar a limpieza/primeras empresas;
   - si Product Owner falla, crear tareas pequeñas por hallazgo.

## Tambien actualizar

- `docs/MVP_RELEASE_STATUS.md` con referencia al guion.
- `docs/BACKLOG.md` marcando el guion como hecho si se completa.
- `tasks/PRODUCT_ARCHITECT_PROCESSED_HANDOFFS.md` cuando se procese el handoff.

## Fuera de alcance

- Cambiar codigo.
- Rotar credenciales.
- Ejecutar la prueba en nombre del Product Owner.
- Hacer commit/push automatico salvo decision explicita de release.

## Entregable

Crear:

```text
tasks/TASK-107-HANDOFF.md
```

Debe incluir:

- Resultado general.
- Documento creado/modificado.
- Resumen del guion.
- Riesgos que deben aceptar Product/Owner.
- Proximo mensaje exacto para quien vaya a probar.

## Aviso al terminar

Cuando termines, avisa en el chat Product/Architect:

```text
Termine TASK-107. Product/Architect debe leer tasks/TASK-107-HANDOFF.md.
```
