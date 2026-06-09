# TASK-199: Infra Azure - verificar ACS Email y base URLs pre-lanzamiento

## Equipo asignado

Infra Azure.

## Contexto

La decision MVP mantiene email como canal de respaldo/trazabilidad y WhatsApp como contacto primario. Antes de validar con cliente/QA, Infra debe confirmar que ACS Email y las URLs publicas usadas en emails siguen correctas en Azure.

## Tarea

Verificar configuracion Azure necesaria para emails y enlaces de activacion/contacto en pre-lanzamiento.

## Alcance

1. Confirmar app settings relevantes de email sin imprimir secretos:
   - proveedor ACS;
   - remitente;
   - destinatario interno;
   - connection string o equivalente existe;
   - base URL publica para enlaces.
2. Ejecutar smoke seguro de email si ya existe mecanismo aprobado.
3. Confirmar que no queda dependencia activa de SendGrid para el MVP.
4. Revisar que la URL publica principal sea:
   - `https://zealous-field-08fdd720f.7.azurestaticapps.net`
5. Documentar cualquier setting faltante o dudoso.

## No tocar

- No rotar secretos salvo aprobacion explicita.
- No imprimir connection strings, keys, tokens, cookies ni password hashes.
- No cambiar dominio/remitente sin decision Product.
- No limpiar datos en esta tarea.

## Verificacion

- Settings requeridos existen.
- Smoke de email, si se ejecuta, llega o queda con status tecnico claro.
- SendGrid no es requerido para el flujo MVP.
- Base URL de activacion/contacto es la correcta.

## Handoff esperado

Crear `tasks/TASK-199-HANDOFF.md` con:

- Settings verificados, redactados.
- Resultado de smoke si aplica.
- Riesgos.
- Recomendacion para QA.
