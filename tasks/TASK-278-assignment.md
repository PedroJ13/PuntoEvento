# TASK-278: QA Azure - revalidar overflow ficha publica post-deploy

## Equipo asignado

QA.

## Contexto

`TASK-277` debe desplegar el fix de overflow de ficha publica.

Ambiente:

```text
https://zealous-field-08fdd720f.7.azurestaticapps.net
```

## Tarea

Revalidar en Azure que el P2 de overflow horizontal de ficha publica quedo corregido.

## Alcance

1. Confirmar versiones/commit desplegado por Infra.
2. Validar ficha publica con servicio mock/controlado si el catalogo real sigue vacio.
3. Confirmar:
   - desktop `1366x768`: `scrollWidth <= clientWidth`;
   - mobile `390x844`: sin overflow horizontal;
   - `.contact-note.full-note` y `Ver más servicios` no exceden viewport;
   - contacto/cotizacion sigue claro.
4. Smoke rapido de:
   - `/`
   - `/#bodas`
   - `/panel.html`
   - `/admin.html`

## No tocar

- No crear empresas reales salvo que Product lo indique.
- No enviar leads reales.
- No publicar secretos, tokens, cookies ni credenciales.

## Verificacion

- Clasificar hallazgos P0/P1/P2/P3.
- Indicar go/no-go para mostrar ficha publica real a usuarios externos.

## Handoff esperado

Crear `tasks/TASK-278-HANDOFF.md` con:

- Resultado final.
- Evidencia desktop/mobile.
- Riesgos aceptados si aplica.
- Recomendacion para Product / Architect / Release.
