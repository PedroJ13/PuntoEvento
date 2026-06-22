Equipo: Ejecucion Tecnica
Modo de ejecucion: Infra Azure
Tarea completada: TASK-371 - Infra Azure deploy de password-flows.
Archivos cambiados:
- `tasks/TASK-371-HANDOFF.md`

Archivos desplegados en commit:
- `admin.html`
- `admin.js`
- `panel.html`
- `panel.css`
- `panel.js`
- `api/shared/config.js`
- `api/shared/azure.js`
- `api/shared/companyAuth.js`
- `api/shared/email.js`
- `api/shared/companyPasswordResets.js`
- `api/company-auth-password/`
- `api/company-password-resets-request/`
- `api/company-password-resets-validate/`
- `api/company-password-resets-complete/`
- `api/internal-company-password-reset/`
- `docs/API_CONTRACTS_MVP.md`
- `docs/DECISION_LOG.md`
- `tasks/TASK-365-HANDOFF.md`
- `tasks/TASK-366-HANDOFF.md`
- `tasks/TASK-367-HANDOFF.md`
- `tasks/TASK-368-HANDOFF.md`
- `tasks/TASK-369-HANDOFF.md`
- `tasks/TASK-370-HANDOFF.md`

Verificacion ejecutada:
- Lectura de `AGENTS.md`, `codex-project-templates/EJECUCION_TECNICA.md`, `codex-project-templates/INFRA.md`, `codex-project-templates/CHAT_MODEL.md`, `docs/MVP_RELEASE_STATUS.md`, `docs/ARCHITECTURE.md`, `docs/API_CONTRACTS_MVP.md`, `tasks/TASK-370-HANDOFF.md` y `tasks/TASK-371-assignment.md`.
- Precondicion confirmada: `TASK-370-HANDOFF.md` indica `Resultado: aprobado con observaciones`, sin P0/P1.
- `git status --short --branch` antes de deploy: `main...origin/main` con paquete password-flows local pendiente de commit.
- `git diff --check`: sin errores; solo warnings esperados LF/CRLF.
- `az account show`: cuenta Azure disponible (`as_main`) sin imprimir secretos.
- `az staticwebapp appsettings set`: configurados settings no sensibles `AZURE_TABLE_COMPANY_PASSWORD_RESETS=CompanyPasswordResets` y `COMPANY_PASSWORD_RESET_EXPIRES_MINUTES=30`. Azure devolvio valores redactados.
- `az storage table create --name CompanyPasswordResets --account-name storagepuntoevento --auth-mode login`: `created: true`.
- Commit creado: `cdbea2a84b063834372ed2863810ec14a7ae8f79` (`Deploy company password flows`).
- Push a `origin/main`: OK.
- GitHub Actions `Azure Static Web Apps CI/CD`, run `27988335017`: `completed`, `success`.
- URL run: `https://github.com/PedroJ13/PuntoEvento/actions/runs/27988335017`.
- Smoke web publicado:
  - `https://puntoeventocr.com/panel.html?cb=task371` contiene `panel.js?v=20`.
  - `https://puntoeventocr.com/panel.html?cb=task371` contiene `data-reset-complete-form`.
  - `https://puntoeventocr.com/admin.html?cb=task371` contiene `admin.js?v=26`.
  - `https://puntoeventocr.com/admin.html?cb=task371` carga marcador de admin.
- Smoke API publicado no destructivo:
  - `GET /api/company-password-resets/validate?token=invalid-task371`: `200`, `valid=false`, `status=invalid`.
  - `POST /api/company-password-resets/complete` con token falso: `400`.
  - `POST /api/company-auth/password` sin sesion: `401`.
  - `POST /api/company-password-resets` con correo inexistente `.invalid`: `200`, respuesta generica `ok=true`.
  - `POST /api/internal/companies/company_task371/password-reset` sin credencial admin: `401`.
  - `GET /api/public/services?limit=1&cb=task371`: `200`.
  - `POST /api/company-auth/login` con credenciales falsas: `401`.

Resultado:
- Password-flows desplegado en Azure Static Web Apps desde `main`.
- Backend/API y Web quedaron publicados en el mismo commit, evitando UI contra endpoints inexistentes.
- Endpoints nuevos no responden `404`.
- Marcadores web de reset y cache busting estan publicados.
- Tabla `CompanyPasswordResets` creada/verificada.
- Settings no sensibles nuevos configurados sin imprimir valores secretos.
- Login recurrente no muestra regresion basica: credenciales falsas responden `401`, no `404/500`.
- No se ejecuto reset real ni envio de correo real.

Uso DB/storage cloud: Si, motivo: deploy Infra Azure y preparacion operativa del reset de password; alcance: configurar app settings no sensibles, crear/verificar tabla `CompanyPasswordResets`, consultar GitHub Actions y ejecutar smokes HTTPS no destructivos contra Azure publicado.

Riesgos o pendientes:
- `gh auth status` sigue reportando token invalido; para esta tarea se uso Git push con credenciales del sistema y GitHub API publica para runs.
- No se valido reset real con destinatario autorizado ni inbox; queda para QA Azure controlado.
- No se uso credencial admin real en smoke de `POST /api/internal/companies/{companyId}/password-reset`; solo se valido que el endpoint publicado no es `404` y exige `401`.
- Quedan archivos untracked de coordinacion/templates/assignments en el workspace que no fueron parte del commit de deploy para no mezclar alcance.

Siguiente recomendado:
- Ejecutar TASK-372 QA Azure con cuenta/destinatario autorizado para validar solicitud de reset, recepcion de correo, enlace, completado de reset, revocacion de sesiones y accion admin real sin exponer token/link.
