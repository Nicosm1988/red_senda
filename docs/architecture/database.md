# Base de datos

## Estado

| Estado | Alcance |
| --- | --- |
| **Implementado** | Migraciones local/remotas, grants/RLS, catálogo, directorio, ranking, identidad/legal, vertical profesional/admin, leads, Storage privado, auditoría y outbox. |
| **Preparado** | Matching versionado, artículos, convenios, suscripciones y eventos de proveedor. |
| **Pendiente** | Conectar matching/contenidos/convenios a sus UIs y ampliar la integración RLS a más políticas fuera del vertical crítico. |

## Contrato

Supabase PostgreSQL 17 es la fuente de verdad. Supabase Auth administra identidad y Storage guarda archivos; la aplicación conserva dominio, autorización y auditoría. El esquema se versiona mediante migraciones imperativas en `supabase/migrations/`.

## Convenciones

- Identificadores y objetos en `snake_case` minúscula; tablas en plural.
- `auth.users.id` y entidades públicas usan `uuid`; tablas de eventos de alto volumen pueden usar `bigint generated always as identity`.
- `timestamptz` para tiempo, `numeric` para dinero, `boolean` para flags y `text` sin límites arbitrarios.
- Toda tabla tiene PK, timestamps coherentes y constraints de estado/rango/unicidad.
- Toda FK usada en join, cascada o RLS lleva índice; índices compuestos siguen filtros de igualdad antes que rango/orden.
- JSONB sólo para payloads acotados/versionados (UTM, proveedor, desglose); relaciones consultables se normalizan.
- Paginación de listados crecientes por cursor/keyset, no `OFFSET` profundo.

## Dominios y relaciones

### Identidad y profesionales

- `user_profiles`: 1:1 con `auth.users`; datos mínimos de cuenta.
- `roles` y `user_roles`: autorización administrada, separada de metadata editable.
- `private.legal_document_versions` y `private.legal_acceptances`: bundle vigente y evidencia histórica por documento/versión. La aplicación sólo agrega aceptaciones; `user_profiles.terms_*` es un cache de compatibilidad.
- `professional_profiles`: 0..1 por cuenta; slug, copy público, estado y publicación. La señal de completitud vive separada en `professional_ranking_signals`.
- `private.professional_contacts`: contacto y facturación no publicables.
- `professional_types`, `credential_types`, `verification_rules`: catálogo y requisitos por tipo.
- `private.credentials`: pertenece a profesional/tipo; metadata privada y ruta de Storage, nunca URL pública.
- `private.verifications`: revisión, resultado, reviewer, notas internas y timestamps.

Publicación de perfil: `DRAFT`, `PENDING_REVIEW`, `PUBLISHED`, `REJECTED`, `SUSPENDED`. Verificación, como eje separado: `NOT_VERIFIED`, `PENDING`, `VERIFIED`, `REJECTED`, `EXPIRED`.

### Catálogo

- `needs`, `services`, `specialties`, `audiences`, `career_stages`, `modalities`, `locations`, `languages`, `industries`.
- Tablas puente `professional_profile_types`, `professional_needs`, `professional_services`, `professional_specialties`, `professional_audiences`, `professional_career_stages`, `professional_modalities`, `professional_locations`, `professional_languages`, `professional_industries`.
- `professional_availability` conserva ventanas/estado, no promesas de agenda en tiempo real.

Cada catálogo tiene ID estable, nombre, slug único, estado y orden. Los slugs históricos requieren redirects.

### Demanda y confianza

- `leads`: shell operativo sin PII; profesional, usuario opcional, necesidad, source/campaign/UTM, consentimiento y estado.
- `private.lead_contacts` y `private.lead_status_history`: contacto/fingerprint y trazabilidad no públicos.
- `favorites`: unique `(user_id, professional_profile_id)`.
- `reviews`: autor auditable, profesional, lead opcional, rating/texto y moderación.
- `matching_questions`, `matching_options` y `matching_rules`: cuestionario y reglas versionadas con razón/peso.
- `matching_sessions`, `matching_answers` y `matching_recommendations`: entradas, score, explicación y versiones reproducibles.
- `private.matching_session_tokens`: ownership opaco de sesiones anónimas; nunca se guarda el token en claro.
- `notifications` + `private.notification_outbox`: estado visible y entrega transaccional. El payload persistido sólo referencia IDs; `claim_notification_outbox_from_backend` resuelve destinatario de forma efímera, reclama con lease y `lock_token`, y `complete_notification_outbox_from_backend` rechaza tokens vencidos/reclamados por otro worker.

### Monetización y B2B

- `plans`: capacidades/precio configurables, `pricing_status` y vigencia. En el piloto, `BASE`, `IMPULSO` y `REFERENTE` tienen precio nulo y `DRAFT`.
- `plan_entitlements`: capacidades y límites normalizados por plan.
- `subscriptions`: profesional, plan, período, estado y snapshots. Proveedor/IDs externos quedan en las tablas privadas de pago.
- `private.payment_customers` y `private.subscription_events`: IDs del proveedor y webhooks/idempotencia.
- `institutions`, `agreements`, `agreement_professionals`, `agreement_services`: convenio, reglas, vigencia y oferta participante.

### Contenido y control

- `article_categories` y `articles`: autor, slug, excerpt/body, taxonomía, metadata SEO y moderación.
- `professional_ranking_signals` y `professional_metrics_daily`: señales operativas separadas del perfil y agregados diarios.
- `analytics_events`: eventos de producto con payload acotado.
- `private.rate_limit_buckets`: contadores antiabuso sin PII directa.
- `private.audit_log`: actor, acción, entidad, campos cambiados, metadata mínima y fecha; append-only para la app, sin snapshots crudos before/after.

Estados de artículo/reseña: `DRAFT|PENDING|PUBLISHED|REJECTED` y `PENDING|APPROVED|REJECTED`, respectivamente.

Las tablas de artículos y convenios están preparadas y reciben datos demo en el seed, pero las páginas `/recursos` y `/convenios` todavía consumen el repositorio editorial estático. No deben interpretarse como una consola o publicación productiva activa.

## Público vs. privado

Los datos públicos se proyectan con `professional_directory`, una view `security_invoker` de perfiles `PUBLISHED`, y luego con DTOs del DAL. Email, teléfono, identificadores fiscales, matrícula completa, domicilio, mensajes de lead, notas internas, facturación y rutas de documentos nunca integran esa proyección. La separación `public`/`private` es una frontera deliberada; `private` no se agrega a los esquemas expuestos por PostgREST.

Las views accesibles a `anon`/`authenticated` usan `security_invoker = true`. Una función es `security invoker` por defecto; cualquier excepción `security definer` vive en un schema no expuesto, fija `search_path`, verifica actor y tiene `EXECUTE` revocado salvo roles exactos.

## Grants y RLS

`GRANT` habilita el objeto; RLS decide las filas. Ambos se declaran en la misma migración y se prueban por rol.

| Grupo | `anon` | `authenticated` | Privilegiado |
| --- | --- | --- | --- |
| Catálogo/perfiles publicados | `SELECT` con policy pública | `SELECT` | CRUD administrativo auditado |
| Datos propios/favoritos/matching | sin acceso directo salvo caso explícito | CRUD sólo propio | soporte justificado |
| Leads | sin lectura ni ejecución backend | lectura propia vía RPC y transición validada; creación sólo backend | operación/admin |
| Credenciales/verificaciones | ninguno | estados propios vía RPC y objeto propio vía Storage RLS; no aprueba | reviewer autorizado |
| Planes públicos | `SELECT` de activos | `SELECT` | gestión admin |
| Suscripciones/auditoría | ninguno | sólo la suscripción propia si aplica | acceso mínimo por función |

Reglas obligatorias:

- Revocar privilegios por defecto; cada tabla, secuencia y función se expone explícitamente.
- RLS en toda tabla de schema expuesto, y defensa en profundidad en tablas privadas.
- `TO authenticated` siempre se combina con ownership/permiso; no basta como autorización.
- `UPDATE` tiene policy `SELECT`, `USING` y `WITH CHECK`.
- En policies usar `(select auth.uid())` e indexar columnas de ownership.
- `service_role`/secret bypass RLS: sólo DAL privilegiado, con authz previa y alcance mínimo.

### Superficie RPC

- Públicas y de sólo lectura: `rank_professionals` y `explain_matching` para `anon|authenticated`.
- Backend-only: `consume_rate_limit_from_backend`, `create_lead_from_backend`, `record_analytics_event_from_backend`, `accept_terms_from_signup_backend`, `bootstrap_first_superadmin_from_backend`, `claim_notification_outbox_from_backend` y `complete_notification_outbox_from_backend`; sólo `service_role`.
- Profesional autenticado: `accept_current_terms`, `my_professional_profile`, `submit_professional_profile`, `select_professional_plan`, `submit_professional_credential`, `my_credential_statuses`, `my_professional_leads` y `update_professional_lead_status`; cada función relevante verifica ownership y aceptación legal vigente.
- Administración: `admin_pending_professional_profiles`, `admin_pending_credentials`, `admin_resolve_credential` y `admin_set_professional_publication`; el wrapper público exige sesión y la función privada vuelve a comprobar rol y aceptación legal.

Helpers privilegiados viven en `private`; los wrappers de `public` son `security invoker` y tienen `EXECUTE` explícito. El DAL usa estos contratos en vez de abrir tablas sensibles.

## Índices iniciales guiados por consultas

- `professional_profiles(slug)` unique; la view pública decide elegibilidad.
- `professional_profiles(publication_status, is_accepting_leads, updated_at desc, id)` para catálogo/moderación, con índice parcial sobre publicados.
- Índice en cada FK de tabla puente y unique compuesto para evitar duplicados.
- `leads(professional_profile_id, status, created_at desc)` y `leads(consumer_user_id, created_at desc)` cuando hay cuenta consumidora.
- `reviews(professional_profile_id, created_at desc) where status = 'APPROVED'`.
- `articles(author_profile_id, status, updated_at desc)`, `articles(category_id, published_at desc) where status = 'PUBLISHED'` y slug unique.
- `subscriptions(plan_id, status)` más unicidad parcial de una suscripción corriente por perfil.
- Columnas usadas por RLS (`user_id`, `professional_profile_id`, reviewer/actor) siempre indexadas.

No crear todos los índices posibles: confirmar con consultas y `EXPLAIN (ANALYZE, BUFFERS)` sobre volumen representativo.

## Migraciones y seed

1. Crear migración con CLI (`supabase migration new <nombre>`), no inventar orden manual.
2. Incluir schema, constraints, grants, RLS e índices como una unidad revisable.
3. `supabase db reset` y tests positivos/negativos por rol.
4. Ejecutar advisors y revisar el diff antes de push/deploy.
5. El seed actual contiene 16 perfiles, reseñas, artículos y convenios inequívocamente ficticios con `is_demo = true`, además del catálogo y los UUID de referencia. El primer release piloto lo aplica una sola vez y de forma intencional porque el catálogo inicial depende de esos UUID; luego no se reejecuta sin decisión documentada.

Las migraciones de producción son forward-only y compatibles con la versión anterior de la app cuando el despliegue lo requiera. Las dos migraciones, el seed piloto y la configuración Auth se aplicaron al proyecto alojado el 2026-08-15; los probes anónimos confirmaron directorio/ranking y denegación de `leads`, `analytics_events` y schema `private`. **Pendiente operativo:** política formal de backups, retención y eliminación de PII.

Referencias vigentes: [seguridad del Data API](https://supabase.com/docs/guides/api/securing-your-api), [RLS](https://supabase.com/docs/guides/database/postgres/row-level-security) y [cambio a grants explícitos](https://supabase.com/changelog/45329-breaking-change-tables-not-exposed-to-data-and-graphql-api-automatically).
