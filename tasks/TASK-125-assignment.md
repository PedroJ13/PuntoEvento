# TASK-125: Panel empresa - imagenes de servicio hasta 10 y cover

## Equipo asignado

Web Dev - Panel empresa.

## Superficie

```text
panel.html
panel.js
panel.css
```

## Contexto

Hallazgo Round 2:

- `PO2-001`: servicio debe permitir hasta 10 imagenes y seleccionar cover.

Decision Product/Architect:

- Maximo 10 imagenes por servicio.
- El cover cuenta dentro de las 10.
- Una sola imagen debe actuar como cover.
- Imagenes nuevas quedan pendientes hasta aprobacion admin.

## Archivos que debes leer

- `AGENTS.md`
- `chat-start/WEB_DEV.md`
- `docs/PRODUCT_OWNER_TEST_FINDINGS_2026-05-29_ROUND_2.md`
- `docs/PRODUCT_OWNER_TEST_FINDINGS_2026-05-29_ROUND_2_TRIAGE.md`
- `docs/DATA_MODEL.md`
- `docs/API_CONTRACTS_MVP.md`
- `panel.html`
- `panel.js`
- `panel.css`

## Objetivo

Mejorar el panel empresa para que un servicio pueda manejar hasta 10 imagenes con una seleccionada como cover.

## Alcance

1. UI para agregar multiples imagenes a un servicio, maximo 10.
2. Preview de imagenes antes de subir/guardar.
3. Marcar una imagen como cover.
4. Mostrar cuales imagenes van a galeria.
5. Permitir remover imagenes antes de guardar/enviar.
6. Validar:
   - maximo 10;
   - formatos JPG/PNG/WEBP;
   - maximo 5 MB por archivo.
7. Comunicar que imagenes nuevas quedan pendientes de aprobacion.
8. Mantener el flujo `Guardar borrador -> Enviar a revision`.

## Fuera de alcance

- Cambiar endpoints si aun no soportan limite/cover unico.
- Reordenamiento avanzado drag-and-drop si complica el MVP.
- Cambiar admin.
- Hacer commit/push.

## Dependencia

Coordinar con `TASK-127` si hacen falta validaciones API para multiples uploads/cover unico.

## Entregable

Crear:

```text
tasks/TASK-125-HANDOFF.md
```

Debe incluir:

- Resultado general.
- Archivos modificados.
- Flujo de imagenes implementado.
- Validaciones UI.
- Dependencias API pendientes.
- Verificacion desktop/mobile.

## Aviso al terminar

```text
Termine TASK-125. Product/Architect debe leer tasks/TASK-125-HANDOFF.md.
```
