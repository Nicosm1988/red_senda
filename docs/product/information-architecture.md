# Arquitectura de información

Este documento separa la superficie existente del contrato objetivo. `Implementado` significa que la ruta existe en el repositorio; el resultado de cada gate local/remoto se registra por release.

## Público

| Ruta | Estado | Propósito/indexación actual |
| --- | --- | --- |
| `/` | **Implementado** | Propuesta y CTA; index. |
| `/profesionales` | **Implementado** | Directorio Supabase, filtros URL y orden; index. |
| `/profesionales/[slug]` | **Implementado** | Perfil `PUBLISHED`/elegible; index y badge sólo cuando el estado calculado es `VERIFIED`. |
| `/matching` | **Implementado inicial** | Cuestionario client-side con respuestas efímeras; la página genérica es indexable y está en sitemap. |
| `/para-profesionales`, `/planes` | **Implementado** | Adquisición y comparación sin precio/cobro activos; index. |
| `/profesionales/sumarse` | **Implementado** | Onboarding autenticado; noindex. |
| `/convenios`, `/convenios/[slug]` | **Implementado demo** | Propuesta y convenios ficticios rotulados desde fixtures; index. Acceso institucional real pendiente. |
| `/recursos`, `/recursos/[slug]` | **Implementado demo** | Recursos ficticios rotulados desde fixtures; index. Publicación desde DB pendiente. |
| `/terminos`, `/privacidad` | **Implementado** | Borradores legales públicos versionados; index. |
| `/ingresar`, `/registro`, `/recuperar-acceso`, `/actualizar-contrasena`, `/aceptar-terminos`, `/auth/callback` | **Implementado** | Acceso, recuperación y aceptación vigente; pantallas noindex y callback bajo `/auth/` bloqueado en robots. |
| `/profesionales/{necesidad|tipo|ubicacion}/[slug]` | **Pendiente** | Landings curadas; sólo deben indexarse con oferta y contenido propios. |

Los filtros del directorio viven en query params normalizados para persistir/compartir estado. Los namespaces explícitos evitan colisiones con el slug de perfil. No se generan combinaciones masivas sin contenido y demanda reales.

## Dashboard profesional

| Ruta | Estado | Módulo |
| --- | --- | --- |
| `/dashboard` | **Implementado** | Resumen, métricas agregadas, últimas 20 consultas con transiciones y estado de suscripción; usa anchors `#leads` y `#suscripcion`. |
| `/profesionales/sumarse` | **Implementado** | Crear/editar perfil, taxonomías, idioma, plan, documento privado y envío a revisión. |
| `/dashboard/{perfil|leads|estadisticas|suscripcion}` | **Pendiente** | Separar las secciones actuales en módulos dedicados cuando el volumen lo requiera. |
| `/dashboard/{articulos|opiniones|convenios|comunidad}` | **Pendiente** | Funciones posteriores; no deben presentarse como operativas. |

Todas son privadas; cada loader/action reautoriza. Un profesional suspendido conserva acceso al dashboard/cuenta, pero no visibilidad pública; un canal de soporte dedicado está pendiente.

## Administración

| Ruta | Estado | Permiso mínimo/módulo |
| --- | --- | --- |
| `/admin` | **Implementado** | `ADMIN|SUPERADMIN`; cola de credenciales con URL firmada de 5 minutos, decisión aprobar/rechazar, revisión de perfil y decisión publicar/rechazar/suspender. Muestra contadores de artículos/reseñas, pero no los modera. |
| `/admin/{profesionales|verificaciones}` | **Pendiente** | Separar el vertical existente en subrutas. |
| `/admin/{taxonomias|planes|suscripciones|leads|convenios|destacados}` | **Pendiente** | Consolas `ADMIN`. |
| `/admin/{articulos|opiniones}` | **Pendiente** | Moderación `EDITOR` con alcance o `ADMIN`. |
| `/admin/auditoria` | **Pendiente** | Consulta `ADMIN`; exportación sensible sólo `SUPERADMIN`. |

Ocultar navegación no es autorización. Cada ruta, consulta y mutación verifica el rol en servidor.

## Sistema

- `/api/leads`: intake validado, rate-limited e idempotente del formulario de contacto.
- `/api/analytics`: eventos de allowlist, payload mínimo y sin PII sensible.
- `/api/subscriptions/select`: selección server-side de plan; devuelve estado preparado si falta Mercado Pago.
- `/api/webhooks/mercado-pago`: endpoint preparado que falla cerrado; al habilitarlo debe verificar firma, replay e idempotencia, sin sesión de navegador.
- `/api/internal/notifications/process`: consumidor implementado del outbox; `GET` autenticado en tiempo constante con `CRON_SECRET`, sin cache.
- `/robots.txt` y `/sitemap.xml`: Metadata Routes; el sitemap obtiene slugs profesionales de Supabase y slugs de recursos/convenios del repositorio demo actual.
- OpenGraph, canonical, breadcrumbs y JSON-LD se resuelven en servidor.
- Nuevos Route Handlers requieren un consumidor real y un contrato estable; los formularios autenticados internos prefieren Server Actions finas.

## Navegación

**Global implementada:** Profesionales, Encontrar acompañamiento, Recursos, Convenios y Para profesionales; incluye Ingresar/Crear perfil. Un menú de cuenta plenamente adaptado a cada rol queda pendiente.

**Móvil:** búsqueda/matching y contacto permanecen visibles sin duplicar CTA. Filtros se abren como panel accesible, conservan query params y ofrecen resumen de filtros activos.

**Breadcrumbs:** obligatorios en perfiles, contenidos, landings de taxonomía y convenios publicables.

## Taxonomía visible

La entrada primaria es `Need` (situación). Se cruza con `ProfessionalType`, `Service`, `Specialty`, `Audience`, `CareerStage`, `Modality`, `Location`, `Language`, `Industry`, precio, disponibilidad y convenio.

Etiquetas internas y copy público no tienen que coincidir: los IDs son estables y los nombres/slugs son administrables. Mantener redirects al cambiar un slug es un requisito **pendiente**; no modificar slugs publicados hasta implementarlo.

## Estados transversales

Contrato objetivo para toda pantalla con datos:

- `loading` o skeleton sin layout shift significativo;
- `success`;
- `empty` con siguiente acción útil;
- `error` recuperable y sin datos internos;
- `unauthorized` (sin sesión) y `forbidden` (sin permiso) diferenciados.

Los formularios preservan campos no sensibles ante errores. Nunca se repuebla password, documento o token.

## SEO

- Indexar perfiles publicados/elegibles; mostrar badge sólo si están verificados. Recursos y convenios demo se indexan hoy con rótulo explícito; excluirlos o migrarlos a DB antes de contenido real es una decisión pendiente.
- El directorio canonicaliza variantes hacia `/profesionales`. Marcar combinaciones delgadas como `noindex` queda pendiente si se crean landings filtradas indexables.
- Sitemap toma perfiles desde `professional_directory`, excluye drafts/suspendidos/privados e incluye la página genérica `/matching`; no genera URLs para respuestas personales.
- `ProfessionalService`, `Article`, `Organization` y breadcrumbs se usan sólo cuando los datos cumplen el vocabulario.
- Slugs son únicos, legibles y estables; el título profesional no expone matrículas completas.
