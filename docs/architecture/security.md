# Seguridad y privacidad

## Estado

| Estado | Alcance |
| --- | --- |
| **Implementado** | Grants/RLS, autorización por ownership/rol, CSP con nonce, origen en mutaciones de navegador, Storage privado, evidencia legal append-only, rate limit de leads/analytics y outbox con lease/token. |
| **Preparado** | Endpoint de pagos cerrado, adaptador Resend, eventos/auditoría y scripts de calidad. |
| **Pendiente** | MFA admin, eventual BFF para sesión HttpOnly, antimalware de documentos, firma/reconciliación Mercado Pago, proveedor de alertas, revisión legal y validaciones remotas del release. |

## Modelo

Defensa en profundidad: navegador no confiable → validación/autorización Next.js → grants/RLS PostgreSQL → acceso de Storage → auditoría. Ninguna capa sustituye a otra.

## Clasificación de datos

| Clase | Ejemplos | Regla |
| --- | --- | --- |
| Público | nombre profesional, headline, servicios, ciudad general | sólo perfil `PUBLISHED` y elegible; badge únicamente si está `VERIFIED` |
| Cuenta | email de acceso, favoritos, preferencias | propietario y soporte justificado |
| Confidencial | lead, teléfono, mensaje, suscripción | mínimo acceso y logs redactados |
| Altamente sensible | credencial, matrícula completa, documento, notas de revisión | Storage privado, URL breve, admin autorizado |

No guardar CUIT, documento, domicilio privado u otra PII si el caso no lo exige. Los textos legales son borradores hasta revisión profesional; no afirmar cumplimiento garantizado.

## Auth y autorización

- Supabase Auth con cookies SSR renovadas por `proxy.ts`, `SameSite=Lax` y `Secure` en producción. Por el cliente browser de `@supabase/ssr`, la cookie de sesión actual es legible por JavaScript (`HttpOnly=false`); no se documenta como cookie HttpOnly.
- No autorizar con `user_metadata`/`raw_user_meta_data`, porque la persona puede editarlo.
- `user_roles` es la fuente autoritativa. Si se usan claims para acelerar lecturas, sólo `app_metadata`; considerar su posible desactualización hasta renovar JWT.
- Para acciones admin críticas, verificar sesión y rol actual en DAL además del claim.
- Diferenciar 401 (sin identidad) y 403 (identidad sin permiso) sin filtrar existencia de recursos.
- Revocar sesiones antes de eliminar/bloquear cuentas sensibles; mantener expiración razonable.
- `secure_password_change = true` está versionado en `supabase/config.toml`; su aplicación al proyecto alojado se verifica con `config push` y smoke de recuperación/cambio.
- Las aceptaciones se insertan por documento y versión en `private.legal_acceptances` con timestamp del servidor. El alta usa `accept_terms_from_signup_backend`; una sesión desactualizada debe pasar por `accept_current_terms`. No se sobreescribe evidencia histórica.

Cada Server Action y Route Handler es invocable directamente: valida sesión, rol, ownership y transición de estado dentro del entrypoint/caso de uso.

## Supabase Data API

- Privilegios por defecto revocados; `GRANT` explícito y mínimo para `anon`, `authenticated` y `service_role`.
- RLS habilitado en toda tabla expuesta; policy separada por operación cuando mejora claridad.
- `TO authenticated` no basta: siempre existe predicado de ownership o permiso.
- `UPDATE` incluye policy `SELECT`, `USING` y `WITH CHECK`.
- Views expuestas llevan `security_invoker = true` en PostgreSQL 17.
- `SECURITY DEFINER` no se usa para tapar errores. Si es imprescindible: schema privado, `search_path` vacío/fijo, validación de actor y `EXECUTE` mínimo.
- La clave secreta/service role nunca llega al cliente y no se usa como cliente general.

## Storage de credenciales

- Bucket privado exacto `professional-credentials`; nunca `/public` ni bucket público.
- Ruta opaca `<auth.uid()>/...`, sin documento o email en el filename.
- Límite inicial 10 MiB y allowlist PDF/JPEG/PNG; verificar tipo real y considerar escaneo antimalware antes de revisión humana.
- Policies de `storage.objects` restringen upload al namespace propio, lectura al propietario o admin y borrado del propietario sólo mientras el objeto todavía no fue registrado como credencial.
- URLs firmadas se crean en servidor, por pocos minutos y después de reautorizar cada solicitud.
- No registrar la URL firmada. Su expiración no reemplaza eliminación/revocación operativa del objeto.
- La carga actual usa `upsert: false`; un objeto registrado como credencial queda inmutable para su dueño y sólo puede ser leído por propietario/admin conforme a RLS.

## Validación y abuso

- Zod en servidor para body, params, searchParams, headers y payload externo.
- Límites de longitud, formatos, listas permitidas y normalización antes de persistir.
- **Implementado:** rate limit server-side por fingerprint de red y por perfil/email en contacto; rate limit separado para analytics.
- **Pendiente:** límites específicos para login, uploads y webhook cuando se habilite. El matching actual no persiste respuestas, por lo que sólo emite eventos bajo el límite de analytics.
- **Implementado:** honeypot, idempotencia/deduplicación diaria y límites por red/destinatario para leads. **Pendiente según abuso:** tiempo mínimo y captcha.
- Sanitizar contenido enriquecido con allowlist; React escaping no cubre HTML arbitrario.
- Queries parametrizadas mediante SDK/driver; nunca concatenar filtros u órdenes.
- Cookies Auth con `SameSite=Lax` y `Secure` en producción; hoy `HttpOnly=false` por la arquitectura browser de Supabase SSR. CSP con nonce, ausencia de HTML arbitrario, escaping de React, validación de origen y payloads acotados reducen riesgo XSS/CSRF, pero no vuelven HttpOnly a la cookie. Migrar Auth a un BFF que mantenga tokens sólo en servidor queda **pendiente** si el riesgo/alcance lo exige.

## Integraciones

- **Implementado en código:** Resend recibe destinatarios/templates server-side; los emails de lead omiten mensaje y datos de contacto. La entrega requiere `RESEND_API_KEY` y `EMAIL_FROM`; si faltan, la fila queda reintentable y nunca se marca `SENT`.
- **Pendiente:** verificar dominio/remitente Resend y ejecutar un smoke real. No existe una variable de destinatario global: cada receptor se resuelve desde el lead/usuario al reclamar el outbox.
- **Preparado y cerrado:** Mercado Pago. El Route Handler devuelve 503 y no modifica suscripciones hasta implementar firma sobre payload original, tolerancia temporal, ID único, idempotencia y reconciliación.
- No confiar en monto, plan, estado o `professional_id` enviados por el navegador; reconciliar contra datos internos/proveedor.
- Separar credenciales sandbox y producción. Un fake de tests jamás opera en producción silenciosamente.

## Auditoría y observabilidad

**Implementado:** triggers de auditoría para roles, perfiles, verificaciones, suscripciones, planes, reseñas, artículos y convenios; las RPC críticas agregan decisiones/metadata sin PII sensible.

**Pendiente:** unificar `request_id`, resultado operativo y auditoría de cada apertura/generación de URL firmada. El contrato objetivo cubre:

- aprobación/rechazo/suspensión de profesional;
- apertura/decisión sobre credenciales;
- cambios de rol, plan, suscripción y convenio;
- moderación de reseñas/artículos;
- generación de URL firmada y operaciones administrativas sensibles.

No registrar tokens, passwords, API keys, archivos, mensajes completos, emails/teléfonos completos ni payloads crudos de pago. Acceso y retención de logs se restringen.

## Riesgos prioritarios

| Riesgo | Control principal |
| --- | --- |
| IDOR/BOLA en dashboard/admin | authz por recurso en DAL + RLS + tests negativos |
| Exposición de documentos | bucket privado + policy + signed URL breve |
| Service key filtrada | `server-only`, variables Vercel y escaneo de secretos |
| Spam/abuso de leads | rate limit, validación, dedupe y moderación |
| Falso “Verificado” | estado sólo por workflow admin auditado |
| Webhook falsificado/repetido | endpoint cerrado; firma, timestamp e idempotencia pendientes antes de activarlo |
| XSS en artículos/bios | escaping React + CSP; sanitización allowlist obligatoria si se habilita HTML enriquecido |
| Inferencia clínica | reglas de copy, tests y revisión del matching |

## Gate de producción

| Estado | Control |
| --- | --- |
| **Implementado** | Secrets server-only, bucket privado de 10 MiB con MIME allowlist, autorización repetida en RPC/actions, CSP/headers, contacto con honeypot, idempotencia y rate limit. |
| **Preparado** | Lint, typecheck, unitarias, build, Playwright público, fixture SQL transaccional, `test:integration` RLS y E2E autenticado profesional/admin con limpieza; advisors y su ejecución forman parte del release. |
| **Pendiente** | Ampliar cobertura RLS fuera del vertical, verificación de variables/bundle/logs remotos y smoke de URLs firmadas. |
| **Pendiente externo** | MFA administrativa, escaneo antimalware, sandbox Mercado Pago completo, entrega Resend, retención/eliminación de PII y revisión profesional de privacidad/términos/base legal. |

Referencias: [Data API](https://supabase.com/docs/guides/api/securing-your-api), [RLS](https://supabase.com/docs/guides/database/postgres/row-level-security) y [Storage privado](https://supabase.com/docs/guides/storage/buckets/fundamentals).
