# Red Senda — contexto maestro

Actualizado: 2026-08-15. Este documento registra decisiones y contratos del producto; no prueba por sí solo que una funcionalidad esté implementada. El estado real se confirma con código, migraciones y tests.

## Resumen

Red Senda conecta una situación profesional con un tipo de acompañamiento y, finalmente, con una persona profesional adecuada:

`situación → acompañamiento → profesional → contacto`

Es una plataforma B2C/B2P/B2B de SENDA, pero no es el servicio boutique SENDA. La relación de marca debe permanecer configurable.

## Principios no negociables

- Producto original y **clean-room**: RedPsi es sólo un benchmark funcional. No hay scraping, copia de código, textos, datos, assets, identidad ni diseño.
- La persona no necesita conocer el nombre técnico del servicio que busca.
- El matching orienta; no diagnostica, prescribe ni suplanta a una persona profesional.
- B2C comienza gratuito. La monetización prioriza suscripciones B2P y convenios B2B.
- Relevancia antes que pago: cualquier resultado patrocinado se identifica y el plan sólo puede aplicar un impulso acotado.
- Privacidad por diseño: mínimo dato, autorización en servidor, Storage privado y trazabilidad de acciones sensibles.
- WCAG 2.2 AA, mobile-first, buen rendimiento y estados loading/empty/error/unauthorized/forbidden.
- Precios, taxonomías, reglas de verificación y planes tienen fuente administrable en base de datos. La UI inicial de matching es la excepción explícita: hoy usa preguntas y pesos locales hasta conectarse al modelo versionado.

## Stack decidido

| Capa | Decisión |
| --- | --- |
| Aplicación | Next.js 16.3 App Router, React 19, TypeScript 5 strict |
| UI | Tailwind CSS 4, primitives accesibles sólo cuando aporten valor |
| Formularios | Server Actions/`useActionState` + Zod; validación repetida en servidor |
| Datos | Supabase PostgreSQL 17, Auth y Storage privado |
| Acceso | DAL `server-only`, DTOs mínimos, grants explícitos y RLS |
| Email | Adaptador Resend; envío real sólo con dominio y credenciales válidas |
| Pagos | Adaptador Mercado Pago preparado para sandbox/producción |
| Analítica | Vercel Analytics/Speed Insights; eventos de negocio propios |
| Calidad | ESLint, `tsc`, Vitest y Playwright |
| Destino de producción | Vercel, runtime Node.js 24, GitHub `main` → Production; release remoto pendiente de validación |

Versiones exactas y lockfile se controlan en `package.json` y `package-lock.json`.

## Arquitectura en una página

- Server Components por defecto; Client Components sólo para interacción o APIs del navegador.
- Lecturas sensibles y operaciones privilegiadas pasan por módulos `server-only`. La excepción intencional es la carga directa al bucket privado desde el navegador con JWT, path propio y RLS; luego una RPC autenticada registra la credencial.
- Server Actions son controladores finos para formularios autenticados. Route Handlers cubren callback Auth, intake público, analytics, cron y webhooks.
- Las acciones se tratan como endpoints públicos: validan input, sesión, rol y propiedad en cada invocación.
- Supabase usa cliente SSR ligado a la sesión para operaciones con RLS; la clave secreta queda limitada a tareas privilegiadas y nunca compensa una autorización ausente.
- Cada objeto expuesto al Data API declara su `GRANT`; toda tabla expuesta tiene RLS. Las views usan `security_invoker = true`.
- Resend y Mercado Pago implementan puertos/adaptadores para que la falta de credenciales no bloquee el resto del producto.
- El ranking público usa `rank_professionals` y devuelve versión, componentes y razones. El modelo/RPC de matching está versionado, pero la UI inicial todavía no lo consume.

Detalle: [arquitectura](architecture/architecture.md), [base de datos](architecture/database.md) y [seguridad](architecture/security.md).

Dominios estables: shell público; directorio/filtros/cards; perfil/contacto; matching; onboarding y workspace profesional; administración/moderación; planes/pagos; contenidos; convenios. La UI compartida no contiene autorización ni reglas de negocio. Recursos y convenios permanecen como experiencia demo; sus esquemas productivos no son aún la fuente de esas páginas.

## Roles

| Rol | Alcance |
| --- | --- |
| `USER` | Buscar, contactar y gestionar sus propios datos. La tabla/policy de favoritos está preparada, pero su UI está pendiente. |
| `PROFESSIONAL` | Lo anterior más onboarding, perfil propio, credenciales, leads y suscripción. No se auto-verifica. |
| `EDITOR` | Tiene permisos de datos para moderar contenidos/reseñas dentro del alcance asignado; la consola UI está pendiente. No accede por defecto a credenciales privadas ni facturación. |
| `ADMIN` | El vertical UI revisa credenciales/publicación; el modelo autoriza taxonomías, planes, convenios y operaciones cuyas consolas están pendientes. Toda mutación sensible cubierta se audita. |
| `SUPERADMIN` | Configuración y recuperación excepcionales. Uso mínimo y reforzado. |

La autorización nunca depende de `user_metadata`. La fuente autoritativa es `user_roles`; si algún rol se refleja en `app_metadata`, los controles sensibles vuelven a verificarlo en servidor.

## Rutas canónicas y estado

- **Implementado — públicas:** `/`, `/profesionales`, `/profesionales/[slug]`, `/matching`, `/para-profesionales`, `/planes`, `/convenios`, `/convenios/[slug]`, `/recursos`, `/recursos/[slug]`, `/terminos` y `/privacidad`.
- **Implementado — cuenta y alta:** `/ingresar`, `/registro`, `/recuperar-acceso`, `/actualizar-contrasena`, `/aceptar-terminos`, `/profesionales/sumarse` y `/auth/callback`.
- **Implementado — privado:** `/dashboard` concentra perfil, últimas consultas, métricas y suscripción mediante secciones; `/admin` concentra revisión de credenciales y decisión de publicación.
- **Implementado — sistema:** `/api/leads`, `/api/analytics`, `/api/subscriptions/select`, `/api/webhooks/mercado-pago`, `/api/internal/notifications/process` y metadata routes para `robots.txt`/`sitemap.xml`. El webhook existe, pero responde cerrado y no procesa pagos.
- **Pendiente:** landings `/profesionales/{necesidad|tipo|ubicacion}/[slug]`, subrutas especializadas de dashboard y las consolas admin de taxonomías, planes, suscripciones, leads, reseñas, artículos, convenios y auditoría.

El contrato completo de navegación e indexación está en [arquitectura de información](product/information-architecture.md).

## Variables de entorno

Nombres canónicos:

- Base: `NEXT_PUBLIC_SITE_URL`.
- Supabase: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SECRET_KEY`.
- Seguridad operativa: `RATE_LIMIT_SALT`, `CRON_SECRET`.
- Resend: `RESEND_API_KEY`, `EMAIL_FROM`.
- Mercado Pago: `MERCADOPAGO_ACCESS_TOKEN`, `NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY`, `MERCADOPAGO_WEBHOOK_SECRET`.
- Preparadas pero sin adaptador activo: `NEXT_PUBLIC_POSTHOG_KEY`, `NEXT_PUBLIC_POSTHOG_HOST`, `SENTRY_DSN`; deben quedar vacías. `RED_SENDA_TEST_MODE` es exclusivo de tests.

No activar variables sin consumidor funcional. Todo `NEXT_PUBLIC_*` es visible en el navegador y queda embebido al construir. Matriz por ambiente: [despliegue en Vercel](deployment/vercel.md).

## Límites de credenciales externas

El dueño debe aportar o configurar fuera del repositorio:

- claves del proyecto Supabase y proveedores de Auth;
- dominio remitente verificado y API key de Resend;
- credenciales sandbox/producción y secreto de webhook de Mercado Pago;
- dominio público, DNS y variables de Vercel;
- cuentas de analítica/errores opcionales;
- alta y confirmación de la cuenta real que se promoverá una sola vez a primer `SUPERADMIN`.

Nunca se inventan valores ni se degradan integraciones reales a mocks silenciosos. Sin credenciales, el adaptador queda validable mediante contrato/fake de test y la UI comunica “integración no configurada”.

## Decisiones registradas

| ID | Decisión | Motivo |
| --- | --- | --- |
| D-001 | Supabase como Postgres/Auth/Storage | Menor carga operativa y controles de acceso coherentes. |
| D-002 | DAL exclusivamente de servidor | Centraliza auth/authz y minimiza datos serializados al cliente. |
| D-003 | Catálogo normalizado | Taxonomías y reglas cambian sin desplegar UI ni mantener JSON gigantes. |
| D-004 | Matching determinístico primero | Es explicable, testeable y seguro antes de introducir IA. |
| D-005 | Ranking con impulso comercial acotado | Preserva utilidad, diversidad y confianza. |
| D-006 | Credenciales en Storage privado | Documentos sólo por acceso autorizado y URL firmada breve. |
| D-007 | Adaptadores para email/pagos | Aísla proveedores y permite continuar sin credenciales externas. |
| D-008 | Node.js 24 en Vercel | Runtime estable único para aplicación e integraciones de servidor. |
| D-009 | Shell operativo en `public`, PII en `private` | Reduce exposición del Data API y limita el impacto de errores. |
| D-010 | Aceptaciones legales append-only por versión | Conserva evidencia histórica; `user_profiles` mantiene sólo un cache de la versión vigente. |
| D-011 | Seed demo intencional sólo para el piloto inicial | Permite arrancar el catálogo sin representar personas ni acuerdos reales; toda fila demo se identifica. |

Cualquier cambio irreversible, legal o económicamente relevante requiere una ADR breve o actualización de esta tabla.

## Política de eficiencia de tokens

Para toda tarea futura:

1. Leer este índice y sólo el documento especializado necesario.
2. Buscar con `rg` por símbolo, ruta, tabla o variable antes de abrir archivos completos.
3. No releer ni reimprimir contenido conocido salvo cambio real.
4. Agrupar inspecciones y verificaciones seguras.
5. Verificar antes de editar; preservar código sano y cambios ajenos.
6. Comunicar decisiones nuevas, no repetir diagnósticos.
7. Ejecutar el chequeo más pequeño que pruebe el cambio y ampliar según riesgo.
8. Actualizar esta documentación cuando cambie un contrato para no reconstruir contexto.

## Estado del MVP al 2026-08-15

| Área | Estado | Evidencia/límite |
| --- | --- | --- |
| Marketplace público y leads | **Implementado** | Directorio Supabase, filtros URL, perfil, API idempotente, PII privada y outbox por cada lead nuevo. El fallback en memoria sólo corre en tests o contra la URL inerte de ejemplo. |
| Auth, onboarding y dashboard | **Implementado** | Aceptación legal append-only, perfil, plan, documento privado, últimas 20 consultas, transiciones y métricas agregadas. |
| Verificación y moderación | **Implementado** | El vertical `/admin` revisa credenciales y decide publicación con RPC auditadas. Las demás consolas están pendientes. |
| Email — pipeline | **Implementado** | Claim con lease/`lock_token`, lote post-response, cron diario autenticado y reintentos; no guarda el cuerpo sensible en el email. |
| Email — entrega real | **Pendiente** | Requiere dominio, `RESEND_API_KEY`, `EMAIL_FROM` y smoke test. Sin ellos el outbox queda `FAILED` reintentable, no `SENT`. |
| Planes/pagos | **Preparado** | Los tres planes están `DRAFT`, sin importes; elegir crea/actualiza `PENDING_PAYMENT`. Checkout, firma y reconciliación Mercado Pago están pendientes. |
| Matching | **Preparado** | La UI local determinística y explicable está implementada; tablas y `explain_matching` existen. Conectar preguntas/reglas administrables y persistencia está pendiente. |
| Contenidos y convenios | **Preparado** | Páginas demo rotuladas y esquemas existen; lectura desde tablas y administración completa están pendientes. |
| Seguridad/QA local | **Preparado** | RLS/grants, Storage privado, CSP nonce, rate limit de leads/analytics, suites públicas y una integración local destructiva del vertical existen. Su ejecución final y un E2E de navegador autenticado se registran por release. |
| Primer `SUPERADMIN` | **Pendiente** | La RPC service-only está implementada; falta crear/confirmar la cuenta real y ejecutar el bootstrap único. |
| Producción | **Pendiente** | No se declara activa hasta completar push/configuración, deployment y smoke remoto. |

## Próxima iteración

1. Conectar matching UI a `matching_questions/options/rules` y `explain_matching`.
2. Servir artículos y convenios publicados desde Supabase en lugar del repositorio demo.
3. Ampliar `/admin` a taxonomías, planes, suscripciones, leads, reseñas, artículos y convenios.
4. Habilitar Resend y Mercado Pago sólo con dominio, precios y credenciales aprobados.
5. Incorporar MFA para roles administrativos y pruebas E2E autenticadas continuas contra un Supabase aislado.

## Mapa documental

- Producto: [visión](product/vision.md), [modelo de negocio](product/business-model.md), [benchmark](product/redpsi-benchmark.md), [IA](product/information-architecture.md), [matching](product/matching.md).
- Técnica: [arquitectura](architecture/architecture.md), [datos](architecture/database.md), [seguridad](architecture/security.md).
- Operación: [Vercel y ambientes](deployment/vercel.md).
