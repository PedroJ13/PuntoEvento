# TASK-167: QA - pasada visual/responsive pre-lanzamiento

Equipo: QA

Tarea validada: visual/responsive pre-lanzamiento en superficies principales.

Ambiente: local con servidor temporal y mocks API. No se valido Azure real en esta ronda.

Viewports: desktop `1366x768`, mobile `390x844`.

Resultado: aprobado localmente con observaciones; no-go para pre-lanzamiento hasta validar Azure y cerrar P1 de evidencia real en login/cotizacion/email.

## Resultado por superficie

| Superficie | Resultado | Evidencia |
| --- | --- | --- |
| Pagina publica home/listado/perfil | PASS local | Sin overflow horizontal, sin imagenes rotas detectadas, sin errores criticos no esperados. |
| Registro empresa | PASS local | `#empresas` visible en desktop/mobile, sin overflow horizontal. |
| Perfil publico/servicio | PASS local | Perfil `#proveedor/casa-arboleda` carga y mantiene CTAs visibles. |
| Panel empresa login recurrente | PASS mock | Sin sesion muestra `Iniciar sesion`, email/password, logout oculto, sin overflow. |
| Panel empresa activacion | PASS mock | `panel.html?invite=token_qa` muestra `Activa tu acceso`, password/confirmacion, logout oculto, sin overflow. |
| Admin interno | PASS local | Login visible, panel admin oculto sin credencial, sin overflow. |
| Cotizacion | PASS mock | Servicio publicado mock abre drawer, envia payload correcto y muestra confirmacion. |

## Bugs / riesgos

### P1 bloqueante pre-lanzamiento

- Falta validacion Azure real de login recurrente, cotizacion por email y emails internos. Las tareas base `TASK-158/159/161/162/164` y estas QA se ejecutaron local/estructuralmente.

### P2 aceptable con riesgo documentado

- Consola registra `401 Unauthorized` esperados durante mocks de panel sin sesion.
- No hay rate limiting/CAPTCHA visible para cotizacion publica.
- No hubo evidencia visual persistente en archivos; la validacion se documento por salida textual de Playwright.

### Post-MVP

- Hardening de auth recurrente: lockout/rate limiting y unicidad global de email antes de escalar.

## Recomendacion go/no-go pre-lanzamiento

No-go para pre-lanzamiento con empresas reales si se exige evidencia completa en Azure.

Go condicionado solo para demo local/controlada: la UI principal responde bien en desktop/mobile y los flujos mock de login, activacion y cotizacion se ven usables.

Siguiente recomendado: deploy/confirmacion Azure de assets actuales (`app.js?v=25`, `styles.css?v=19`, `panel.js?v=6`, `panel.css?v=7`) y repetir QA contra ambiente real con credenciales, servicio publicado y mailbox/logs observables.
