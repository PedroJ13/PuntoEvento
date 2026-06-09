# TASK-273: Infra Azure - deploy ajustes UX flujos web 2026-06-08

## Equipo asignado

Infra Azure.

## Contexto

QA local debe aprobar `TASK-272` antes de desplegar. El bloque incluye ajustes de UI/copy derivados de la revision UX del 2026-06-08.

## Tarea

Desplegar a Azure los ajustes aprobados del bloque `TASK-267` a `TASK-271`.

## Alcance

1. Confirmar que `TASK-272-HANDOFF.md` aprueba deploy.
2. Revisar diff y archivos tocados.
3. Desplegar a Azure Static Web Apps.
4. Confirmar assets/versiones servidas.
5. Ejecutar smokes basicos:
   - `/`
   - `/#bodas`
   - `/#empresas`
   - `/panel.html`
   - `/admin.html`
   - `/api/public/services?limit=50`

## No tocar

- No cambiar app settings salvo que el handoff QA lo pida explicitamente.
- No limpiar datos.
- No rotar credenciales.
- No imprimir secretos.

## Verificacion

- Azure sirve las versiones nuevas.
- Endpoints basicos responden.
- Catalogo publico sigue sin datos demo si la API devuelve 0 items.

## Handoff esperado

Crear `tasks/TASK-273-HANDOFF.md` con:

- Commit/branch desplegado.
- Versiones de assets observadas.
- Smokes ejecutados.
- Riesgos o bloqueos.
