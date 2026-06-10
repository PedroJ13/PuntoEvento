# Estado Release MVP

Este documento es la mesa de trabajo diaria para decidir si Punto Evento esta listo para invitar primeras empresas reales.

Responsable: `Product / Architect / Release`.

## Estado actual

Estado: `GO tecnico para pre-lanzamiento controlado; cleanup QA y mejora visual en curso`.

Resumen:

- Dominio publico propio configurado y validado en Azure Static Web Apps: `https://puntoeventocr.com/` y `https://www.puntoeventocr.com/` estan `Ready` con HTTPS `200`.
- Hallazgo 2026-06-09 cerrado: el registro publico de empresa fallaba desde `puntoeventocr.com` y `www` con `403` por configuracion de origen permitido. `TASK-279` ajusto `ALLOWED_ORIGINS` / `APP_PUBLIC_URL` y `TASK-280` aprobo registro funcional desde apex y `www`.
- `TASK-279` completo Infra Azure: `ALLOWED_ORIGINS` incluye apex, `www` y hostname anterior; `APP_PUBLIC_URL` apunta a `https://puntoeventocr.com`; smokes de registro desde apex y `www` respondieron `201`; empresas QA de Infra quedaron `rejected`.
- `TASK-280` completo QA Azure: registro desde `https://puntoeventocr.com/#empresas` y `https://www.puntoeventocr.com/#empresas` respondio `201`, la UI mostro confirmacion productiva y no reaparecio `REGISTRO NO ENVIADO`. Observaciones P2: limpiar/rechazar dos empresas QA pendientes y confirmar con credencial admin que el enlace de activacion usa `https://puntoeventocr.com`.
- Incidente productivo 2026-06-09: empresa real no pudo completar el envio directo de servicio desde panel empresa y vio `No se pudo guardar el servicio. Revisa los datos e intentalo de nuevo.` Evidencia nueva: el servicio si queda como borrador y desde ese borrador si se puede enviar a revision. Evidencia adicional: servicios publicados de la misma empresa aparecen con placeholders en lugar de imagen real. Se mantiene como P1 candidato porque el flujo esperado es `crear servicio con portada -> enviar directo a revision -> publicar con portada visible`, sin workaround manual.
- `TASK-281` completo QA Azure como inconcluso/no aprobado funcional: sin sesion autenticada no pudo validar flujo completo; endpoints privados sin cookie devuelven `401`, no `403`; no hay evidencia de bloqueo `ALLOWED_ORIGINS`; el usuario afectado reporto luego que si logro completar. No se abre fix directo a Infra/Backend/Web Dev.
- `TASK-282` queda cancelada/reemplazada por `TASK-283` porque la evidencia nueva acota el incidente a la secuencia automatica de creacion con portada y envio directo.
- `TASK-283` completo QA Azure como no aprobado/bloqueado: no se pudo reproducir ni descartar el P1 candidato porque QA no tenia empresa aprobada, login recurrente, sesion controlada ni HAR redactado.
- `TASK-284` completo por precondicion operativa: Product indico empresa existente `Aurisbel Pasteleria` con email de login para prueba controlada; la credencial no se documenta en repo.
- `TASK-285` completo QA Azure como no aprobado con evidencia P1: el flujo sin imagen llega directo a revision, pero el flujo con portada falla porque el `PUT` al blob firmado es bloqueado por CORS/preflight en Azure Blob Storage. No se ejecutan `uploads/confirm` ni `submit-review`.
- `TASK-286` queda cancelada/reemplazada porque `TASK-285` ya clasifico la causa.
- `TASK-287` completo Infra Azure: CORS de Blob Storage corregido para `PUT` firmado desde apex, `www` y hostname anterior; preflight tecnico `OPTIONS` devuelve `200` para origenes permitidos y `403` para origen no permitido. Falta QA funcional `TASK-288`.
- `TASK-288` completo QA Azure como aprobado: crear servicio con portada desde `puntoeventocr.com` ejecuta `POST services -> sign -> PUT blob -> uploads/confirm -> submit-review`; el servicio queda `pending` sin workaround manual y no aparece el error generico. Queda P2: validar que al aprobar desde admin la portada aparece en catalogo publico.
- Se crea `TASK-289` para QA Azure: aprobar/validar el servicio QA de `TASK-288` desde admin y confirmar portada visible publicamente.
- `TASK-289` completo QA Azure como aprobado: el servicio QA fue aprobado desde admin, aparece publicamente con `coverUrl`, la imagen responde `200 image/png` y la ficha publica usa imagen real, no placeholder.
- Se crea `TASK-290` para cleanup no destructivo de servicios QA visibles en Aurisbel y `TASK-291` para iniciar la especificacion UX del nuevo listado/drawer de servicios.
- Pagina publica preservada como base.
- Modelo `Empresa -> Servicios` definido y parcialmente implementado.
- Busqueda publica por servicios implementada y validada en local/Azure segun backlog.
- API MVP con registro, autenticacion por invitacion, servicios propios, uploads y aprobacion/rechazo mayormente implementada.
- Bloqueadores operativos recientes cerrados: `ADMIN_PASSWORD` rotado y galeria QA visual limpiada.
- QA Azure enfocado confirmo que el flujo completo funciona por API/manual.
- `admin.html` desplegado con `admin.js?v=12` fue aprobado por QA Azure: login, moderacion real, responsive y sin campos prohibidos en DOM.
- Guion Product Owner creado en `docs/PRODUCT_OWNER_TEST_SCRIPT.md`.
- Product Owner ejecuto prueba controlada y documento hallazgos en `docs/PRODUCT_OWNER_TEST_FINDINGS_2026-05-29.md`.
- Round 2 fue implementado localmente en pagina publica, panel empresa, admin y API (`TASK-124` a `TASK-127`).
- `TASK-131` desplego Round 2 a Azure en `main` commit `49bb02b975adc12eca7b57c4395a3cd12b31a1f1`; Azure ya sirve `app.js?v=22`, `styles.css?v=17`, `panel.js?v=5`, `panel.css?v=5`, `admin.js?v=13` y `admin.css?v=8`.
- QA post-deploy aprobo pagina publica (`TASK-133`) y panel empresa (`TASK-134`).
- QA post-deploy aprobo parcialmente admin/API (`TASK-132`): P0 backend cerrado, pero queda P1 en UI admin porque el expediente no muestra pendientes reales.
- Web Dev completo `TASK-135`: identifico y corrigio la causa local del P1 en `admin.js`; requiere deploy de `admin.html` con `admin.js?v=14`.
- Infra Azure completo `TASK-136`: desplego `admin.js?v=14` en Azure; queda pendiente QA enfocada de admin UI.
- QA aprobo `TASK-137`: admin UI ya carga pendientes reales, muestra expediente por empresa y bloqueos visuales. No quedan P0/P1 abiertos de Round 2 segun QA.
- Product Owner hizo nueva revision manual y pidio ajustes de programacion antes de cerrar MVP: imagenes dentro de servicio en admin, preview visible, quitar listas globales viejas, provincia como select y contactos ampliados en registro.
- Backend/API completo `TASK-138`: aprobar servicio publica sus imagenes pendientes asociadas y agrega preview interno autenticado.
- Backend/API completo `TASK-140`: registro y endpoints relacionados persisten/contactan campos ampliados.
- Web Dev completo `TASK-139`: admin muestra imagenes dentro del servicio, quita listas globales viejas y sube `admin.js?v=15` / `admin.css?v=9`.
- Web Dev completo `TASK-141`: registro empresa usa provincia como select, contactos ampliados y sube `app.js?v=23`.
- Infra Azure completo `TASK-142`: desplego ajustes Product Owner a Azure en `main` commit `306b3a5fc137c5f079af7bfd16a288eda5cba391`; Azure sirve `app.js?v=23`, `styles.css?v=17`, `admin.js?v=15` y `admin.css?v=9`.
- QA completo `TASK-143` como no aprobado: registro, imagenes dentro del servicio, aprobacion conjunta y catalogo publico pasaron; queda P1 Web Dev porque el expediente admin no muestra `phone`, `instagram`, `facebook`, `website` ni `tiktok`, aunque la API interna si los devuelve.
- Web Dev completo `TASK-144`: admin expediente renderiza contactos ampliados, filtra valores sensibles y sube cache busting a `admin.js?v=16` / `admin.css?v=10`; falta deploy.
- Infra Azure completo `TASK-145`: desplego fix admin contactos en `main` commit `e8c1e835c214903dedbe5ac476221e669851023b`; Azure sirve `admin.js?v=16` y `admin.css?v=10`.
- QA completo `TASK-146`: aprobo fix admin contactos con observacion menor de `404` no bloqueante; no quedan P0/P1 abiertos en los ajustes Product Owner.
- Product Owner ejecuto re-prueba positiva sin issues; el proyecto pasa a pre-lanzamiento controlado.
- Prioridades pre-lanzamiento formalizadas en `docs/PRELAUNCH_PRIORITIES.md` y tareas `TASK-158` a `TASK-167`.
- `TASK-158` a `TASK-167` completaron implementacion, UI, QA local/estructural y pulido visual de pre-lanzamiento.
- QA no aprobo pre-lanzamiento real todavia: falta deploy Azure, SendGrid/mailbox observable y validacion Azure de login recurrente, cotizacion y emails internos.
- `TASK-168` desplego pre-lanzamiento en Azure (`main` commit `7437baf`) y confirmo assets/endpoints nuevos. Quedo bloqueo parcial: falta configurar `SENDGRID_API_KEY` y `NOTIFICATION_EMAIL_FROM`.
- `TASK-169` aprobo login recurrente empresa en Azure.
- `TASK-170` no aprobo cotizacion por email real porque SendGrid no estaba listo.
- `TASK-171` no aprobo emails internos reales porque SendGrid no estaba listo.
- `TASK-172` aprobo visual/responsive Azure con observaciones; no-go global hasta cerrar email real.
- Product / Architect / Release acepto recomendacion de Pulso: proveedor email MVP sera Azure Communication Services Email, no SendGrid.
- `TASK-175` completo configuracion ACS Email en Azure con Azure Managed Domain, sender `donotreply` y smoke directo aprobado.
- `TASK-176` completo cambio backend a provider ACS Email local/estructuralmente.
- `TASK-177` no aprobo emails reales porque el backend ACS aun no estaba desplegado en Azure; `POST /api/public/leads` devolvio `502`.
- Product Owner confirmo recepcion del correo de smoke directo ACS `Punto Evento ACS smoke TASK-177 20260531175353`; queda validado mailbox/entrega directa ACS, pero no aun el envio end-to-end desde backend Punto Evento.
- `TASK-178` desplego backend ACS Email en Azure (`main` commit `dbb3f75`); `/api/public/leads` respondio `201` y genero `lead_141990b6-9044-4755-a30f-7c11a8f05f27`.
- Product Owner confirmo recepcion del correo de cotizacion `Nueva solicitud de cotizacion` para `Servicio Intertect 2`, con lead `lead_141990b6-9044-4755-a30f-7c11a8f05f27`.
- `TASK-179` aprobo tecnicamente emails reales ACS con observacion: cotizacion `201` y `emailStatus=sent`; faltaba confirmacion externa de tres asuntos, de los cuales Product Owner ya confirmo la cotizacion real.
- Product definio ultimo P1 de invitaciones: al aprobar una empresa, el sistema debe generar invite y enviar email de activacion automaticamente.
- `TASK-180` completo Backend/API local/estructuralmente: approve de empresa crea invite y envia email de activacion si no existe invite activo vigente.
- `TASK-181` completo Web Dev local/estructuralmente: admin muestra feedback por `invite.status` y sube cache busting a `admin.js?v=17` / `admin.css?v=12`.
- `TASK-182` no aprobo Azure porque el deploy aun sirve contrato anterior de approve y assets admin anteriores.
- `TASK-183` completo como inventario/propuesta: candidata clara de limpieza `SMASH Costa Rica` con 2 servicios publicados; no se ejecuto cleanup sin aprobacion explicita.
- `TASK-184` completo Infra Azure: auto-invite desplegado en `main/b83b066`; Azure sirve `admin.js?v=17` / `admin.css?v=12` y approve devuelve `invite.status=email_sent`.
- `TASK-185` aprobo backend/UI de auto-invite en Azure con observacion bloqueante para release: falta confirmar recepcion del email y completar activacion/login desde enlace porque QA no tenia acceso al mailbox.
- `TASK-186` completo Infra/API: soft cleanup de `SMASH Costa Rica` y 2 servicios aplicado sin hard delete; busqueda publica por `SMASH` devuelve 0 resultados.
- `TASK-187` no aprobo cierre final: Product confirmo email de activacion e internos, activacion crea sesion y carga panel, pero login recurrente devuelve `401` si hay usuarios duplicados con el mismo email.
- `TASK-188` completo Backend/API local/estructuralmente: login recurrente ya busca candidatos por email, verifica password y selecciona empresa permitida de forma deterministica.
- `TASK-189` no aprobo Azure porque `TASK-188` no estaba desplegada; el ultimo deploy observado seguia en `main/b83b066`.
- `TASK-190` completo Infra Azure: fix de login recurrente desplegado en `main/88a43ff`; ambiente Azure `Ready`.
- `TASK-191` aprobo activacion y login recurrente post-fix en Azure con observacion P2: QA no adjunto nueva captura de mailbox, pero uso invite controlado y Product ya habia confirmado recepcion del email de activacion.
- `TASK-192` completo Infra Azure: soft cleanup conservador aplicado a companias/servicios QA/test/demo en Azure; 39/39 companias y 43/43 servicios quedan `rejected`, busquedas publicas QA/demo/smoke devuelven 0, sin hard delete ni borrado de blobs.
- Prueba con cliente 2026-06-03 confirmo que el flujo base funciona, pero detecto fricciones de pre-lanzamiento en panel empresa, admin, pagina publica, contacto/cotizacion y emails.
- Product / Architect / Release decidio contacto/cotizacion MVP con ambos canales: WhatsApp primario cuando exista y email como respaldo/trazabilidad.
- Se crearon `TASK-193` a `TASK-200` para separar los hallazgos por superficie y cerrar ajuste pre-lanzamiento sin redisenio completo.
- `TASK-199` completo Infra Azure: ACS Email, sender, base URL publica y `panel.html` verificados; smoke directo ACS `Succeeded`; SendGrid no queda requerido para MVP.
- `TASK-193` a `TASK-198` quedaron completadas local/estructuralmente, pero no desplegadas aun en Azure.
- `TASK-200` no aprobo QA Azure porque el ambiente sigue sirviendo assets/versiones anteriores y backend email anterior.
- Se crearon `TASK-201` para deploy del bloque cliente y `TASK-202` para revalidacion QA Azure post-deploy.
- `TASK-201` completo Infra Azure: deploy del bloque cliente en `main/f3b8951`; Azure sirve `app.js?v=27`, `styles.css?v=20`, `panel.js?v=7`, `panel.css?v=8`, `admin.js?v=18`, `admin.css?v=13` y `/api/public/services` responde `200`.
- `TASK-202` aprobo QA Azure post-deploy con observaciones P2/P3 y sin bloqueantes P0/P1.
- Product / Architect / Release acepta los P2/P3 de `TASK-202` y declara go para pre-lanzamiento controlado.
- Feedback visual 2026-06-04 abre frente P2 alto/P1 comercial de marca/panel empresa, sin cambiar el go tecnico del MVP.
- Se crean `TASK-203` para Diseno/UX y `TASK-204` para aprobacion Product antes de Web Dev. No se abre rediseño profundo de pagina publica/admin/perfil publico.
- Referencias visuales disponibles en `Reference Images/`: logo premium y propuesta de panel empresa.
- `TASK-203` completo Diseno/UX: guia visual minima entregada.
- `TASK-204` completo Product / Architect / Release: alcance aprobado solo para branding base/panel empresa; se crean `TASK-205` Web Dev y `TASK-206` QA.
- `TASK-205` completo Web Dev local/estructuralmente: refresh visual del panel empresa implementado con `panel.css?v=9` y `panel.js?v=8`.
- `TASK-206` no aprobo Azure porque el deploy aun sirve `panel.css?v=8` y `panel.js?v=7`.
- Se crean `TASK-207` para deploy del refresh visual y `TASK-208` para revalidacion QA Azure post-deploy.
- `TASK-207` completo Infra Azure: refresh visual del panel empresa desplegado en `main/8180b44`; Azure sirve `panel.css?v=9` y `panel.js?v=8`, con smokes basicos `200`.
- `TASK-208` aprobo QA Azure post-deploy con observaciones P2/P3 y sin P0/P1: panel visual premium, activacion/login, servicios, upload/portada, guardar/enviar, desktop/mobile y regresion publica/admin validados.
- Product / Architect / Release acepta las observaciones P2/P3 de `TASK-208` y cierra el refresh visual del panel empresa.
- Product pidio ajustes finales acotados del panel empresa antes de primeras empresas: `Tipos de evento` como seleccion multiple tipo lista, logo basado en referencia e iconos simples en menu lateral.
- Se crean `TASK-209` a `TASK-212` para implementar, validar, desplegar y revalidar estos ajustes sin tocar backend, pagina publica ni admin.
- `TASK-209` completo Web Dev local/estructuralmente: `Tipos de evento` como seleccion multiple, logo de referencia e iconos simples en menu lateral; panel usa `panel.css?v=10` y `panel.js?v=9`.
- `TASK-210` aprobo QA local/estructuralmente con observaciones P3; sin P0/P1 y recomendado para deploy.
- `TASK-211` completo Infra Azure: ajustes finales panel empresa desplegados en `main/19df41b`; Azure sirve `panel.css?v=10`, `panel.js?v=9` y el logo JPEG local, con smokes basicos `200`.
- `TASK-212` aprobo QA Azure post-deploy con observaciones P3 y sin P0/P1/P2 nuevos: selector multiple funcional, multiples tipos preservados al crear/editar/enviar, logo e iconos visibles, desktop/mobile sin overflow y regresion publica/admin aprobada.
- Product / Architect / Release acepta las observaciones P3 de `TASK-212` y cierra los ajustes finales del panel empresa.
- Product detecto ajustes visuales pendientes en el panel empresa: overflow del sidebar izquierdo, botones superiores con demasiado texto para el nuevo estilo e imagen de logo con fondo perceptiblemente distinto al fondo del panel. Se abre `TASK-213` a `TASK-216` como P1 visual acotado antes de mostrar a primeras empresas.
- `TASK-213` completo Web Dev local/estructuralmente: overflow/sidebar/logo e icon buttons implementados en `panel.css?v=11`, manteniendo `panel.js?v=9`.
- `TASK-214` no aprobo QA local/estructural por P1: click real sobre icono de `Cerrar sesion` no ejecuta logout porque el handler apunta a `event.target.matches("[data-logout]")`.
- `TASK-215` bloqueado Infra Azure: no se desplego el fix visual final porque `TASK-214` no cumple la precondicion de aprobacion.
- Product decide renombrar la marca visible a `Punto Evento CR` para especificar Costa Rica y diferenciarse de paginas similares; se registra decision en `docs/DECISION_LOG.md` y se crean `TASK-217` a `TASK-221` como bloque siguiente, despues de cerrar el P1 visual actual.
- Se crean `TASK-222` a `TASK-225` para corregir y revalidar especificamente el P1 de logout del icon button antes de retomar deploy del fix visual final.
- `TASK-220` y `TASK-224` completos Infra Azure en deploy combinado `main/3a56d89`: Azure sirve `app.js?v=28`, `panel.css?v=11`, `panel.js?v=11`, marca `Punto Evento CR`, fix de logout con `closest("[data-logout]")` y API publica `200`. `NOTIFICATION_EMAIL_FROM_NAME` fue actualizado a `Punto Evento CR`.
- `TASK-221` aprobo QA Azure del renombre `Punto Evento CR` con observaciones P3: emails reales no revalidados en inbox y logo raster pendiente de asset final; sin P0/P1/P2 nuevos.
- `TASK-225` aprobo QA Azure del fix visual final del panel empresa con observacion P3 de logo raster; el P1 de logout queda cerrado en Azure.
- Product / Architect / Release acepta las observaciones P3 de `TASK-221` y `TASK-225`; renombre y fix visual final quedan cerrados para pre-lanzamiento controlado.
- Product entrega nuevo logo `Reference Images/Logo.jpeg` con marca `Punto Evento CR`; se crean `TASK-226` a `TASK-230` para preparar asset limpio, actualizar panel empresa, validar, desplegar y revalidar.
- `TASK-226` completo Diseno/UX: preparo `assets/images/logo-punto-evento-cr-panel.png` con fondo solido calido `#f8f5ef`.
- `TASK-227` completo Web Dev: panel empresa usa el nuevo PNG, `panel.css?v=12` y `panel.js?v=11`.
- `TASK-228` aprobo QA local/estructural con observacion P3: asset raster derivado de JPEG.
- `TASK-229` completo Infra Azure: nuevo logo desplegado en `main/28d731b`; Azure sirve `panel.css?v=12`, `panel.js?v=11` y el PNG `200`.
- `TASK-230` aprobo QA Azure del nuevo logo con observacion P3: raster no vectorial definitivo; sin P0/P1/P2 nuevos.
- Product / Architect / Release acepta la observacion P3 de `TASK-230`; el bloque del nuevo logo `Punto Evento CR` queda cerrado.
- Product decide extender la paleta del panel empresa a pagina publica, admin y emails, solo colores y sin redisenio profundo; se crean `TASK-231` a `TASK-236`.
- `TASK-231` a `TASK-236` completaron guia, implementacion, deploy y QA Azure de paleta global; Product / Architect / Release acepta las observaciones P3 y cierra el bloque.
- Product solicita refresh visual acotado de pagina publica y ficha publica de empresa/proveedor, alineado al panel empresa; se crean `TASK-237` a `TASK-241`.
- `TASK-237` a `TASK-241` completaron guia, implementacion, deploy y QA Azure del refresh visual publico.
- `TASK-241` aprobo QA Azure con observaciones P3; Product / Architect / Release acepta las observaciones y cierra el refresh visual publico para pre-lanzamiento controlado.
- Product detecta ajustes finales: nombres largos en ficha publica, escala de home al 100%, logo publico mas grande, remover opciones de nav publica, consistencia tipografica con panel empresa y error admin inline sin prompt nativo; se crean `TASK-242` a `TASK-247`.
- `TASK-242` a `TASK-247` completaron ajustes publicos finales, admin auth sin prompt nativo, deploy y QA Azure.
- `TASK-247` aprobo QA Azure con observaciones P3; Product / Architect / Release acepta las observaciones y cierra el bloque para pre-lanzamiento controlado.
- Product solicita limpieza total controlada de datos Azure antes de continuar pruebas o primeras empresas: no debe quedar ninguna empresa ni servicio registrado/operativo. Se crea `TASK-248` para Infra Azure.
- `TASK-248` completo Infra Azure: limpieza total controlada aplicada en Azure Table Storage; Companies/Services/Uploads quedan `rejected`, Users `inactive`, invites/sesiones activas `revoked`; `/api/public/services?limit=50` devuelve 0 y registro nuevo post-cleanup respondio `201` antes de limpiar el smoke.
- Product / Architect / Release procesa recomendaciones nuevas de QA Flujo MVP, QA Visual y Copy/Gramatica del 2026-06-06. Se crean `TASK-249` a `TASK-259` como bloque pre-lanzamiento acotado: copy publico P1, CTAs con servicio, admin sin demo productivo, fallback sin demo productivo, CTA mobile, definicion/implementacion mobile, tildes, emails, panel copy y QA final.
- `TASK-249` a `TASK-258` completaron implementacion local/estructural del bloque copy/flujo/mobile.
- `TASK-259` QA local/estructural no aprobo por P1: en modo productivo simulado, si falla `/api/public/services`, la pagina muestra mensaje controlado pero tambien paquetes/proveedores estaticos de referencia. Ademas Azure aun sirve assets anteriores al bloque. Se crean `TASK-260` a `TASK-263` para corregir P1, revalidar local, desplegar y revalidar Azure.
- `TASK-260` corrigio el P1 de fallback publico y subio cache busting a `app.js?v=31`.
- `TASK-261` aprobo QA local/estructural del P1 corregido y dio go para deploy.
- `TASK-262` completo Infra Azure: deploy en `main/70c242c`; Azure sirve `app.js?v=31`, `styles.css?v=25`, `panel.js?v=13`, `panel.css?v=13`, `admin.js?v=20` y `/api/public/services?limit=50` sigue en 0 items.
- `TASK-263` aprobo QA Azure con observacion P2: el P1 de API fallida quedo cerrado, pero con API OK y catalogo real vacio aun aparece banda estatica de paquetes/proveedores de referencia. Product / Architect / Release acepta go tecnico para test con primera empresa real y crea `TASK-264` para limpiar esa banda antes de mostrar catalogo vacio como experiencia publica.
- `TASK-264` completo Web Dev local/estructural: catalogo real vacio en productivo ya no muestra banda estatica de paquetes/proveedores de referencia; requiere deploy `TASK-265` y QA Azure `TASK-266`.
- `TASK-265` completo Infra Azure: fix de catalogo vacio publico desplegado en `main/7252b49`; Azure sirve `app.js?v=32` y `/api/public/services?limit=50` sigue en 0 items. Queda pendiente `TASK-266`.
- `TASK-266` aprobo QA Azure: catalogo real vacio no muestra referencias estaticas, `/api/public/services?limit=50` devuelve 0 items y no quedan P0/P1/P2/P3 abiertos en este alcance.
- `TASK-267` a `TASK-271` completaron local/estructuralmente los ajustes UX de flujos web 2026-06-08 y `TASK-272` aprobo QA local sin P0/P1.
- `TASK-273` completo Infra Azure: bloque UX 2026-06-08 desplegado en `main/7286682`; Azure sirve `app.js?v=33`, `styles.css?v=26`, `panel.js?v=14`, `admin.js?v=21` y `/api/public/services?limit=50` sigue en 0 items. Queda pendiente `TASK-274`.
- `TASK-274` aprobo QA Azure con observacion P2 visual: overflow horizontal en ficha publica desktop a 1366px. Se crean `TASK-275` a `TASK-278`.
- `TASK-275` corrigio localmente el overflow de ficha publica y `TASK-276` aprobo QA local/estructural sin P0/P1/P2.
- `TASK-277` completo Infra Azure: fix overflow ficha publica desplegado en `main/7ee2ab5`; Azure sirve `styles.css?v=27` y `/api/public/services?limit=50` sigue en 0 items.
- `TASK-278` aprobo QA Azure: el P2 de overflow horizontal queda cerrado en desktop `1366x768` y mobile `390x844`; go para mostrar ficha publica real dentro del alcance MVP.

## Alcance congelado MVP

Para invitar primeras empresas, el MVP debe cubrir:

- Empresa se registra gratis.
- Empresa acepta invitacion o inicia sesion mediante flujo MVP definido.
- Empresa ve su perfil.
- Empresa crea, edita, desactiva o elimina sus servicios.
- Empresa sube fotos de empresa o servicio.
- Admin interno aprueba o rechaza empresas, servicios e imagenes pendientes.
- Pagina publica muestra solo servicios publicados.
- Usuario publico busca por servicio y puede abrir perfil completo de empresa.
- Cotizacion/contacto funciona con WhatsApp primario cuando exista y email como respaldo/trazabilidad.

Fuera del MVP inicial:

- Pagos reales.
- Ranking avanzado.
- Dashboard complejo de reportes.
- CRM completo.
- App movil.
- Automatizacion avanzada de moderacion.

## Bloqueadores actuales

- P0 operacional cerrado: `ADMIN_PASSWORD` expuesto durante la prueba Product Owner fue rotado en `TASK-108`.
- Sin P0/P1 abiertos para los ajustes Product Owner recientes.
- P1 configuracion cerrado por Infra en `TASK-279` y aprobado por QA en `TASK-280`.
- P1 de upload con portada cerrado funcionalmente por `TASK-288` y `TASK-289`: el envio directo con portada llega a `pending`, la aprobacion admin publica la portada y la ficha publica no cae al placeholder.
- P2 operativo: limpiar servicios QA visibles de Aurisbel (`TASK-290`) antes de revision publica amplia.
- P2 operativo pendiente: limpiar/rechazar dos empresas QA de `TASK-280` y confirmar enlace de activacion canonico con credencial admin antes de aprobar empresa real.
- Riesgos P2/P3 aceptados por Product / Architect / Release despues de `TASK-202`.
- El mapa de rutas MVP quedo documentado en `docs/ROUTE_MAP_MVP.md`.

## Ambiente Azure

Estado: dominio, lectura publica, registro desde dominio propio, envio directo con portada y portada publica post-aprobacion aprobados.

Validado segun backlog:

- `POST /api/companies/register`.
- Auth por invitacion.
- `GET /api/companies/me`.
- CRUD de servicios propios.
- Upload firmado y confirmacion de upload.
- Aprobacion/rechazo interno.
- Imagen publica por `publicBlobUrl`.
- Endpoints publicos por servicio.

Pendiente:

- Preparar primer lote de empresas reales con monitoreo cercano despues de limpiar servicios QA visibles.
- Mantener observaciones P2/P3 como seguimiento no bloqueante.

## Ultimo deploy validado

Ultimo deploy validado:

```text
Fecha: 2026-06-08
Branch/commit: main / 7ee2ab5bec203f4a09d4981de9c78446c766b0d8
Ambiente: https://zealous-field-08fdd720f.7.azurestaticapps.net
Validado por: Infra Azure en TASK-277 y QA Azure en TASK-278
Checks ejecutados: `/`, `/#bodas`, `/panel.html`, `/admin.html`, `/api/public/services?limit=50`, `styles.css?v=27`; ficha publica mock/controlada desktop `1366x768` y mobile `390x844`; Azure Static Web Apps `Ready`.
Resultado: aprobado. El P2 de overflow horizontal de ficha publica queda cerrado en Azure.
Riesgos aceptados: la ficha se valido con mock/control porque el catalogo real de Azure sigue vacio; repetir smoke visual rapido cuando exista la primera empresa real publicada.
```

## Checklist para invitar primeras empresas

- [x] `ADMIN_PASSWORD` rotado y credenciales temporales cerradas.
- [x] Pagina publica carga en Azure sin errores criticos.
- [x] Registro de empresa validado en Azure por API.
- [x] Invitacion/login empresa validado en Azure por API.
- [x] Panel empresa permite ver perfil propio desde UI desplegada.
- [x] Panel empresa permite crear/editar/desactivar servicios propios desde UI desplegada.
- [x] Upload de imagenes validado con archivo real por API.
- [x] Admin interno aprueba/rechaza empresa, servicio e imagenes por API.
- [x] Servicio aprobado aparece en busqueda publica.
- [x] Servicio pendiente/rechazado/inactivo no aparece publico.
- [x] Perfil empresa muestra servicio seleccionado y otros servicios.
- [x] Cotizacion/contacto revisado y aceptado para MVP: WhatsApp primario cuando exista y email como respaldo/trazabilidad.
- [x] QA responsive minimo en mobile, tablet y desktop.
- [x] Sin bugs P0/P1 abiertos post prueba cliente 2026-06-03.
- [x] Riesgos P2 aceptados por Product / Architect / Release.
- [x] `docs/BACKLOG.md` y `docs/DECISION_LOG.md` alineados.

## Tablero operativo

Este tablero decide que se trabaja hoy. Mantenerlo corto.

### Ahora

- Infra Azure: `TASK-290` cleanup no destructivo de servicios QA visibles de Aurisbel.
- Diseno/UX: `TASK-291` especificar nuevo listado de servicios y drawer lateral para cargar/editar.
- Product/QA/Admin: mantener pendiente la limpieza de empresas QA de `TASK-280` y activacion canonica hasta cerrar el P1 candidato del panel.

### Siguiente

- Product / Architect / Release: cuando `TASK-291` entregue especificacion, activar `PLAN-TASK-292` Web Dev para implementar listado/drawer.
- QA/Product: reintentar primera empresa real solo cuando el panel empresa quede aprobado.

### Bloqueado

- Sin P0/P1 activos. Pendiente operativo P2: cleanup de servicios QA visibles.

### Hecho

- `TASK-287` Infra Azure: CORS de Azure Blob Storage corregido para `PUT` firmado desde `puntoeventocr.com`, `www` y hostname anterior; preflight `OPTIONS` permitido para esos origenes y bloqueado para origen externo.
- `TASK-288` QA Azure: upload de portada post-CORS aprobado; `PUT` Blob `201`, `uploads/confirm` `201`, `submit-review` `200`, estado final `pending` sin error generico.
- `TASK-289` QA Azure: portada publica post-aprobacion aprobada; catalogo y ficha publica muestran imagen real con `coverUrl`, sin placeholder.
- `TASK-279` Infra Azure: registro desde `puntoeventocr.com` y `www` habilitado via `ALLOWED_ORIGINS`; `APP_PUBLIC_URL` canonico actualizado; smokes `POST /api/companies/register` devolvieron `201`; empresas QA quedaron `rejected`.
- `TASK-280` QA Azure: registro desde apex y `www` aprobado con `201`; la UI ya no muestra `REGISTRO NO ENVIADO`; quedan observaciones P2 de limpieza QA y activacion canonica.
- `TASK-281` QA Azure: incidente panel no reproducido como `403`; endpoints privados sin sesion devuelven `401`; falta sesion autenticada controlada para cierre funcional.
- `TASK-282` QA/Product: cancelada/reemplazada por `TASK-283` tras evidencia nueva de que el servicio se crea como borrador y el envio manual desde borrador funciona.
- `TASK-283` QA Azure: no aprobada/bloqueada por falta de sesion autenticada controlada; el P1 candidato sigue abierto sin evidencia de request/status.
- `TASK-284` Infra Azure/Product: precondicion operativa satisfecha con empresa existente para prueba controlada; credencial no documentada en repo.
- `TASK-285` QA Azure: no aprobada; evidencia P1 capturada. El `PUT` al blob firmado falla por CORS/preflight en Azure Blob Storage; sin imagen el envio directo funciona.
- `TASK-286` QA Azure: cancelada/reemplazada por fix Infra porque `TASK-285` ya clasifico la causa.
- Dominio publico `puntoeventocr.com` conectado a Azure Static Web Apps con `www`, apex, HTTPS y rutas principales validadas (`/`, `/panel.html`, `/admin.html`, `/api/public/services?limit=50`).
- Busqueda publica por servicio.
- Endpoints publicos por servicio.
- CRUD de servicios propios.
- Upload firmado y confirmacion de upload.
- Aprobacion/rechazo interno.
- `TASK-277` deploy Azure del fix overflow ficha publica: `styles.css?v=27` servido y catalogo publico sigue en 0 items.
- `TASK-273` deploy Azure del lote UX 2026-06-08: assets nuevos servidos y catalogo publico sigue en 0 items.
- `TASK-265` deploy Azure del fix catalogo vacio publico: `app.js?v=32` servido y API publica sigue en 0 items.
- Product / Architect / Release proceso la revision UX de flujos web 2026-06-08 y creo `TASK-267` a `TASK-274` como bloque acotado sin cambio de API.
- `TASK-267` a `TASK-274` completaron UX/copy/jerarquia visual, deploy y QA Azure. QA Azure aprobo con observacion P2: overflow horizontal en ficha publica desktop a 1366px.
- `TASK-262` deploy Azure del bloque copy/flujo/mobile: assets nuevos servidos y catalogo publico sigue vacio.
- `TASK-248` limpieza total controlada de datos Azure: sin empresas/servicios/uploads operativos y sin usuarios/invites/sesiones activos previos.
- `ADMIN_PASSWORD` rotado despues de pruebas controladas.
- Galeria QA limpiada para demo visual.
- Matriz MVP enfocada contra Azure: flujo completo funciona por API/manual; UI completa aun pendiente.
- Registro publico `#empresas` conectado al modelo nuevo, aprobado por QA local y desplegado en Azure con validacion parcial.
- Submit visible de `#empresas` aprobado en Chrome normal contra Azure.
- `panel.html` conectado localmente a API real y aprobado por QA local.
- `panel.html` conectado a API real, desplegado y aprobado por QA Azure con sesion real, CRUD de servicios, upload cover y logout.
- `admin.html` muestra pestana `Modelo nuevo` con bloqueo claro y sin datos falsos cuando faltan listados internos.
- Backend/API implemento listados internos de Companies, Services y Uploads pendientes para moderacion nueva.
- QA local/estructural aprobo endpoints internos de listado para moderacion nueva.
- Backend/API corrigio enrutamiento de `POST` para que Azure pueda devolver `405` en listados internos.
- QA Azure aprobo endpoints internos de listado para moderacion nueva, incluyendo `POST -> 405`.
- Web Dev conecto `admin.html` a listados y acciones reales de Companies, Services y Uploads del modelo nuevo.
- QA local aprobo admin UI conectada al modelo nuevo con mocks, acciones y responsive basico.
- Deploy de `admin.html` conectado al modelo nuevo esta visible en Azure; QA Azure confirmo assets nuevos pero quedo bloqueado por credencial admin.
- Infra Azure / Product completo rotacion y validacion de credencial admin para QA Azure de `admin.html`.
- QA Azure confirmo que la credencial corregida funciona por API con `X-Punto-Admin-Credential`; la UI queda bloqueada por usar `Authorization`.
- Web Dev corrigio `admin.js` para enviar `X-Punto-Admin-Credential` y subio cache busting a `admin.js?v=11`.
- QA Azure con `admin.js?v=11` aprobo login, legacy, modelo nuevo, approve real de Company/Service/Upload y responsive; queda pendiente remover `sig=` legacy.
- Web Dev removio render de `image.previewUrl` legacy y subio cache busting a `admin.js?v=12`.
- QA Azure aprobo `admin.html` con `admin.js?v=12`: sin `sig=`, sin campos prohibidos, acciones reales y responsive.
- Product / Architect creo guion de prueba Product Owner.
- Product Owner ejecuto prueba controlada y documento hallazgos P0/P1/P2.
- Product / Architect cerro decisiones P1 de contacto, taxonomia, revision, imagenes, moderacion y cascadas.
- Infra Azure / Product roto `ADMIN_PASSWORD` expuesto y valido credencial nueva contra Azure.
- Web Dev completo `TASK-110`: registro publico evita doble submit, muestra estado de envio y confirma exito con `Registrar otra empresa`; queda pendiente QA Azure post-deploy.
- Backend/API completo `TASK-111`: endpoint `submit-review` y reglas de status de servicio implementadas.
- QA bloqueo `TASK-112` porque Azure aun sirve `index.html` con `app.js?v=20` y `styles.css?v=15`.
- QA aprobo `TASK-113` local/estructural de `submit-review`; queda pendiente deploy y smoke Azure.
- QA Azure aprobo `TASK-114`: registro publico con `app.js?v=21` y `styles.css?v=16` resuelve `PO-001`, evita doble submit y no crea duplicados visibles.
- QA Azure aprobo `TASK-115`: `submit-review` funciona en Azure real con sesion de empresa, Azure Table Storage y negativos `409/400/401/404`.
- Web Dev completo `TASK-116`: panel empresa separa `Guardar borrador -> Enviar a revision`, remueve estado editable y cantidad manual de fotos.
- QA Azure aprobo `TASK-117`: panel empresa desplegado usa `Guardar borrador -> Enviar a revision` con sesion real, requests reales y responsive basico OK.
- Product / Architect decidio en `TASK-118` crear una empresa demo limpia para Product Owner y no borrar datos QA sin tarea Infra/API dedicada.
- Product / Architect completo `TASK-119`: guion demo owner limpio actualizado con empresa `Demo Owner Jardines del Sol` y flujo `Guardar borrador -> Enviar a revision`.
- Infra/API completo `TASK-120` como inventario/propuesta: encontro 3 empresas QA y 6 servicios QA, recomendo soft cleanup sin ejecutar cambios.
- QA completo `TASK-121`: ambiente listo para Product Owner con guion enfocado; admin global limpio queda condicionado a soft cleanup.
- Infra/API completo `TASK-122`: soft cleanup aprobado y ejecutado; 4 empresas y 7 servicios QA/pre-demo fueron rechazados sin hard delete, y ya no quedan objetivos `QA TASK-*` en colas.
- Product / Architect proceso hallazgos Round 2 y dividio el alcance por superficie: pagina publica, panel empresa, admin interno y API.
- Web Dev completo `TASK-124`: pagina publica agrega busqueda libre por empresa y limpia filtros confusos localmente.
- Web Dev completo `TASK-125`: panel empresa soporta multiples imagenes por servicio, maximo 10 y seleccion de cover localmente.
- Web Dev completo `TASK-126`: admin interno agrega moderacion por expediente de empresa y bloqueos visuales localmente.
- Backend/API completo `TASK-127`: reglas backend de aprobacion, limites de imagenes y busqueda por empresa implementadas localmente.
- QA completo `TASK-128`, `TASK-129` y `TASK-130` como no aprobados en Azure: evidencia local OK, pero el ambiente desplegado aun sirve versiones anteriores; `TASK-130` detecto P0 porque Azure permitio aprobar un servicio de empresa pendiente.
- Infra Azure completo `TASK-131`: Round 2 desplegado en Azure; assets nuevos visibles y smoke API confirma `approve service with pending company -> 409`.
- QA completo `TASK-132`: aprobado parcialmente; P0 backend cerrado, reglas API correctas, pero P1 admin UI no muestra pendientes reales en expediente.
- QA aprobo `TASK-133`: pagina publica Round 2 post-deploy aprobada en desktop/mobile, busqueda por empresa y filtros limpios.
- QA aprobo `TASK-134`: panel empresa Round 2 post-deploy aprobado con sesion real, multiples imagenes, cover, galeria y validaciones.
- Web Dev completo `TASK-135`: corrigio bug de iteracion sobre `state.internal`, agrego normalizacion defensiva y subio cache busting a `admin.js?v=14`; falta deploy.
- Infra Azure completo `TASK-136`: deploy admin UI v14 aprobado; Azure sirve `admin.js?v=14` y `admin.css?v=8`.
- QA aprobo `TASK-137`: admin UI Round 2 post-fix aprobado en desktop/mobile; expediente carga pendientes reales y muestra bloqueos visuales.
- Backend/API completo `TASK-138`: aprobacion de servicio publica uploads pendientes asociados y expone preview interno autenticado.
- Backend/API completo `TASK-140`: contactos ampliados se aceptan, persisten y se exponen segun contrato sin publicar email.
- Web Dev completo `TASK-139`: admin agrupa imagenes dentro del servicio, elimina listas globales viejas y usa `admin.js?v=15` / `admin.css?v=9`.
- Web Dev completo `TASK-141`: registro usa provincia como select, agrega contactos ampliados y usa `app.js?v=23`.
- Infra Azure completo `TASK-142`: ajustes Product Owner desplegados en Azure con smokes basicos aprobados; queda QA funcional.
- QA completo `TASK-143`: no aprobado por P1 Web Dev en admin contactos; imagenes por servicio y registro/contactos API-publico pasaron.
- Web Dev completo `TASK-144`: fix admin contactos listo localmente con `admin.js?v=16` y `admin.css?v=10`; queda deploy.
- Infra Azure completo `TASK-145`: fix admin contactos desplegado y visible en Azure con smokes de assets.
- QA completo `TASK-146`: admin contactos aprobado en Azure con `admin.js?v=16`; no quedan P0/P1 abiertos del bloque Product Owner.
- Product / Architect / Release documento mapa unico de rutas MVP en `docs/ROUTE_MAP_MVP.md`.
- Product Owner aprobo re-prueba sin issues; se abrio bloque pre-lanzamiento con `TASK-158` a `TASK-167`.
- `TASK-158` a `TASK-167` completados local/estructuralmente; queda pendiente validacion Azure real mediante `TASK-168` a `TASK-172`.
- `TASK-168` deploy pre-lanzamiento completado en Azure con bloqueo parcial SendGrid.
- `TASK-169` login recurrente aprobado en Azure.
- `TASK-172` visual/responsive aprobado en Azure con observaciones.
- Decision tomada: reemplazar camino SendGrid por Azure Communication Services Email para MVP; `TASK-173` y `TASK-174` quedan canceladas.
- `TASK-175` ACS Email configurado y smoke directo aprobado.
- `TASK-176` backend ACS completado local/estructuralmente.
- `TASK-178` deploy backend ACS completado en Azure; cotizacion real recibida por Product Owner.
- `TASK-179` QA Azure aprobo tecnicamente emails ACS con observacion de confirmacion externa pendiente para emails internos.
- `TASK-180` Backend/API completo local/estructuralmente: invite automatico al aprobar empresa.
- `TASK-181` Web Dev completo local/estructuralmente: mensajes admin por `invite.status`.
- `TASK-182` QA Azure no aprobado por deploy pendiente; se reemplaza por `TASK-185` post-deploy.
- `TASK-183` Infra/API completo como inventario/propuesta; candidata de limpieza `SMASH Costa Rica`.
- `TASK-184` Infra Azure completo: auto-invite desplegado y visible en Azure.
- `TASK-185` QA Azure aprobo backend/UI de auto-invite; pendiente cierre del enlace recibido por email.
- `TASK-186` Infra/API completo: soft cleanup de `SMASH Costa Rica` ejecutado y busqueda publica limpia.
- `TASK-187` QA Azure no aprobado: email/activacion confirmados, login recurrente falla con email duplicado.
- `TASK-188` Backend/API completo local/estructuralmente: fix login recurrente con email duplicado listo.
- `TASK-189` QA Azure no aprobado por deploy pendiente; se reemplaza por `TASK-191` post-deploy.
- `TASK-190` Infra Azure completo: fix login recurrente desplegado en Azure.
- `TASK-191` QA Azure aprobado con observacion P2: activacion/login recurrente post-fix funciona en Azure.
- `TASK-192` Infra Azure completo: soft cleanup pre-lote real aplicado en Azure; catalogo publico queda limpio/vacio para primeras empresas reales.
- Decision tomada 2026-06-03: contacto/cotizacion MVP usara WhatsApp primario y email como respaldo/trazabilidad.
- `TASK-199` Infra Azure completo: ACS Email/base URLs pre-lanzamiento verificados y smoke directo ACS aprobado tecnicamente.
- `TASK-193` a `TASK-198` completadas local/estructuralmente.
- `TASK-200` QA Azure no aprobado por deploy pendiente.
- `TASK-201` Infra Azure completo: bloque cliente desplegado a Azure en `main/f3b8951`.
- `TASK-202` QA Azure aprobado con observaciones P2/P3; Product / Architect / Release acepta riesgos y declara go pre-lanzamiento controlado.
- `TASK-203` Diseno/UX completo: guia visual minima marca/panel empresa.
- `TASK-204` Product / Architect / Release completo: alcance refresh aprobado y tareas `TASK-205`/`TASK-206` creadas.
- `TASK-205` Web Dev completo local/estructuralmente: refresh visual panel empresa listo.
- `TASK-206` QA no aprobado en Azure por deploy pendiente.
- `TASK-207` Infra Azure completo: refresh visual panel empresa desplegado a Azure en `main/8180b44`.
- `TASK-208` QA Azure aprobado con observaciones P2/P3; Product / Architect / Release acepta riesgos y cierra refresh visual panel empresa.
- Product / Architect / Release creo `TASK-209` a `TASK-212` para ajustes finales acotados del panel empresa.
- `TASK-209` Web Dev completo local/estructuralmente: ajustes finales panel empresa listos.
- `TASK-210` QA local/estructural aprobado con observaciones P3.
- `TASK-211` Infra Azure completo: ajustes finales panel empresa desplegados a Azure en `main/19df41b`.
- `TASK-212` QA Azure aprobado con observaciones P3; Product / Architect / Release acepta riesgos y cierra ajustes finales panel empresa.
- Product / Architect / Release amplio `TASK-213` a `TASK-216` para corregir overflow del sidebar, convertir botones superiores a icon buttons e integrar el fondo del logo.
- `TASK-213` Web Dev completo local/estructuralmente: fix visual final listo.
- `TASK-214` QA no aprobado por P1 en logout icon button.
- `TASK-215` Infra Azure bloqueado/no desplegado por precondicion QA no aprobada.
- Product / Architect / Release creo `TASK-217` a `TASK-221` para renombrar marca visible a `Punto Evento CR`.
- Product / Architect / Release creo `TASK-222` a `TASK-225` para cerrar el P1 de logout y revalidar el fix visual final del panel empresa.
- `TASK-217` y `TASK-218` completaron renombre local/estructural en frontend y backend/email.
- `TASK-219` aprobo QA local/estructural del renombre con observacion P3 del logo raster.
- `TASK-222` corrigio el P1 de logout del icon button y `TASK-223` aprobo QA local/estructural.
- `TASK-220` y `TASK-224` completos Infra Azure: deploy combinado `main/3a56d89` con assets y smokes aprobados.
- `TASK-221` QA Azure aprobado con observaciones P3; Product / Architect / Release acepta riesgos y cierra renombre `Punto Evento CR`.
- `TASK-225` QA Azure aprobado con observacion P3; Product / Architect / Release acepta riesgos y cierra fix visual final del panel empresa.
- Product / Architect / Release creo `TASK-226` a `TASK-230` para reemplazar el logo del panel por el nuevo asset `Punto Evento CR`.
- `TASK-226`, `TASK-227` y `TASK-228` completaron preparacion, integracion y QA local/estructural del nuevo logo.
- `TASK-229` completo Infra Azure: nuevo logo panel empresa desplegado en `main/28d731b`.
- `TASK-230` QA Azure aprobado con observacion P3; Product / Architect / Release acepta riesgo y cierra bloque del nuevo logo `Punto Evento CR`.
- Product / Architect / Release creo `TASK-231` a `TASK-236` para aplicar paleta global `Punto Evento CR` solo con colores.
- `TASK-231` completo Diseno/UX: guia de paleta global.
- `TASK-232` completo Web Dev: paleta aplicada a pagina publica/admin.
- `TASK-233` completo Backend/API: paleta aplicada a emails HTML.
- `TASK-234` aprobo QA local/estructural con observaciones P3.
- `TASK-235` completo Infra Azure: paleta global desplegada en `main/1351203`.
- `TASK-236` QA Azure aprobado con observaciones P3; Product / Architect / Release acepta riesgos y cierra paleta global.
- Product / Architect / Release creo `TASK-237` a `TASK-241` para refresh visual publico alineado al panel empresa.
- `TASK-237` completo Diseno/UX: guia visual publica premium.
- `TASK-238` completo Web Dev: refresh visual publico local/estructural.
- `TASK-239` aprobo QA local/estructural con observaciones P3.
- `TASK-240` completo Infra Azure: refresh visual publico desplegado en `main/22558e4`.
- `TASK-241` QA Azure aprobado con observaciones P3; Product / Architect / Release acepta riesgos y cierra refresh visual publico.
- Product / Architect / Release creo `TASK-242` a `TASK-247` para ajustes finales publicos y login admin sin prompt nativo.
- `TASK-242` completo Web Dev: ajustes visuales publicos finales.
- `TASK-243` completo Backend/API: admin auth sin `WWW-Authenticate`.
- `TASK-244` completo Web Dev: mensaje inline admin y `admin.js?v=19`.
- `TASK-245` aprobo QA local/estructural con observaciones P3.
- `TASK-246` completo Infra Azure: deploy en `main/1cd2a6f`.
- `TASK-247` QA Azure aprobado con observaciones P3; Product / Architect / Release acepta riesgos y cierra ajustes publicos/login admin.
- Product / Architect / Release creo `TASK-248` para que Infra Azure deje el ambiente sin empresas ni servicios previos antes del siguiente test/pre-lote.
- `TASK-248` Infra Azure completo: ambiente Azure queda sin datos operativos previos y listo para registrar empresas desde cero.
- Product / Architect / Release creo `TASK-249` a `TASK-259` a partir de recomendaciones de QA Flujo MVP, QA Visual y Copy/Gramatica del 2026-06-06.
- `TASK-249` a `TASK-258` completadas local/estructuralmente.
- `TASK-259` no aprobado por P1 de datos de referencia visibles cuando falla API publica en productivo simulado; se crean `TASK-260` a `TASK-263`.
- `TASK-260` y `TASK-261` cerraron local/estructuralmente el P1 de fallback publico.
- `TASK-262` Infra Azure completo: bloque copy/flujo/mobile desplegado en Azure.
- `TASK-263` QA Azure aprobado con P2: go tecnico para test con primera empresa real; se crea `TASK-264` para ocultar banda de referencia cuando catalogo real esta vacio.
- `TASK-264` Web Dev completo local/estructuralmente; se crean `TASK-265` deploy y `TASK-266` QA Azure.
- `TASK-265` Infra Azure completo: fix catalogo vacio publico desplegado en Azure; queda `TASK-266`.
- `TASK-266` QA Azure aprobado: catalogo real vacio sin referencias; go para test con primera empresa real.
- `TASK-267` a `TASK-272` completadas local/estructuralmente.
- `TASK-273` Infra Azure completo: lote UX 2026-06-08 desplegado en Azure; queda `TASK-274`.
- `TASK-274` QA Azure aprobado con P2 de overflow horizontal en ficha publica desktop.
- `TASK-275` y `TASK-276` completaron fix y QA local del overflow.
- `TASK-277` Infra Azure completo: fix overflow desplegado en Azure.
- `TASK-278` QA Azure completo: overflow de ficha publica cerrado en Azure; no quedan P0/P1/P2/P3 nuevos.

## Como actualizar este documento

Actualizar cuando:

- Termina una tarea con handoff relevante.
- Cambia un bloqueador.
- Se valida o falla un deploy.
- Se acepta un riesgo de release.
- Cambia el alcance MVP.
- Un item del tablero operativo pasa de `Ahora` a `Hecho`, `Bloqueado` o `Siguiente`.

No usar este documento como backlog largo. Para tareas detalladas usar `docs/BACKLOG.md` o `tasks/`.

Regla operativa:

- `Ahora`: maximo 3 tareas activas.
- `Siguiente`: maximo 5 tareas candidatas.
- `Bloqueado`: solo tareas que no pueden avanzar sin decision, credencial, deploy o resultado externo.
- `Hecho`: resumen corto de logros recientes, no historial completo.
