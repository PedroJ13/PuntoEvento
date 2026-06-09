# TASK-280: QA Azure - revalidar registro empresa en dominio propio

## Equipo asignado

QA.

## Contexto

`TASK-279` debe ajustar `ALLOWED_ORIGINS` y `APP_PUBLIC_URL` para el dominio propio.

Error observado antes del ajuste:

```text
POST /api/companies/register
Origin: https://puntoeventocr.com
Resultado: 403
```

La UI mostraba:

```text
REGISTRO NO ENVIADO
No pudimos completar el registro
```

## Tarea

Validar que el registro publico de empresa funciona desde el dominio propio despues del ajuste de Infra.

## Alcance

1. Confirmar que `TASK-279` fue completada.
2. Probar desde navegador real:
   - `https://puntoeventocr.com/#empresas`
   - `https://www.puntoeventocr.com/#empresas`
3. Completar formulario de empresa con datos QA controlados.
4. Confirmar que ya no aparece `REGISTRO NO ENVIADO`.
5. Confirmar respuesta esperada:
   - empresa creada en estado `pending`;
   - mensaje visible de registro recibido;
   - email interno de nueva empresa registrado si el mailbox/evidencia esta disponible.
6. Confirmar que `APP_PUBLIC_URL` genera enlaces de activacion con dominio canonico cuando Admin aprueba una empresa QA.

## No tocar

- No usar datos reales de clientes.
- No publicar correos privados, tokens, cookies ni credenciales.
- No dejar empresas QA publicadas.

## Verificacion adicional

Smoke rapido:

```text
https://puntoeventocr.com/
https://www.puntoeventocr.com/
https://puntoeventocr.com/panel.html
https://puntoeventocr.com/admin.html
https://puntoeventocr.com/api/public/services?limit=5
```

## Criterio de aprobacion

- P0/P1: ninguno abierto.
- Registro desde apex y `www`: aprobado.
- Si quedan empresas QA, deben quedar rechazadas o documentadas para limpieza.

## Handoff esperado

Crear `tasks/TASK-280-HANDOFF.md` con:

- Resultado final go/no-go.
- Evidencia de registro desde apex y `www`.
- IDs/slugs creados para QA.
- Riesgos o pendientes si aplica.
