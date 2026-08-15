# Red Senda

Marketplace argentino de profesionales para acompañar decisiones de estudio, trabajo y carrera. El vertical implementado conecta búsqueda, perfiles, consultas, alta profesional, revisión de credenciales, publicación y gestión básica de leads.

El directorio y los perfiles publicados se leen desde Supabase. El seed piloto contiene 16 perfiles inequívocamente ficticios con `is_demo = true`; `RED_SENDA_TEST_MODE=true` habilita el repositorio en memoria únicamente para pruebas automatizadas. Recursos y convenios todavía se sirven desde ese repositorio editorial demo y se rotulan como tales.

## Estado actual

| Estado | Alcance |
| --- | --- |
| **Implementado** | Directorio Supabase, filtros y ranking; perfil y lead idempotente; Auth; aceptación legal append-only; onboarding con documento privado; dashboard de leads; revisión admin de credencial y publicación; outbox con lease/token, intento post-response y cron autenticado. |
| **Preparado** | Modelo/RPC de matching administrable; planes en `DRAFT`, selección en `PENDING_PAYMENT`; esquemas de artículos y convenios; adaptadores de Resend y Mercado Pago que permanecen cerrados sin configuración válida. |
| **Pendiente** | Conectar la UI de matching a `explain_matching`; servir recursos/convenios desde Supabase; precio y checkout aprobados; credenciales y smoke tests de proveedores; primer `SUPERADMIN`; release y smoke remoto. |

## Stack

- Node.js 24, Next.js 16, React 19 y TypeScript estricto.
- Tailwind CSS 4 y componentes propios accesibles.
- Supabase Postgres, Auth y Storage con RLS.
- Configuración de Vercel y componentes de Analytics/Speed Insights; su activación se confirma recién con el deployment.
- Zod, Vitest y Playwright.

## Puesta en marcha

Requisitos: Node 24, npm y Docker para Supabase local.

```bash
npm ci
cp .env.example .env.local
npx supabase start
npm run db:reset
npm run dev
```

Completá `.env.local` con valores del ambiente local. `SUPABASE_SECRET_KEY`, `RATE_LIMIT_SALT` y `CRON_SECRET` son exclusivamente de servidor; `CRON_SECRET` necesita al menos 32 caracteres cuando se habilita el consumidor programado. Resend y Mercado Pago son opcionales y deben quedar sin configurar hasta contar con credenciales y pruebas válidas.

La aplicación queda disponible en [http://localhost:3000](http://localhost:3000).

## Comandos

```bash
npm run lint       # ESLint sin warnings
npm run typecheck  # TypeScript estricto
npm run test       # pruebas unitarias
npm run test:db:workflow # workflow SQL transaccional; requiere stack local
npm run test:integration # vertical Supabase local; requiere SUPABASE_TEST_*
npm run build      # build de producción
npm run test:e2e   # build + flujos Playwright
npm run test:e2e:auth # vertical UI autenticado; requiere Supabase local
npm run check      # lint + tipos + unitarias + build

npm run db:reset   # reconstruye Supabase local y carga seed
npm run db:push    # aplica migraciones al proyecto enlazado
npm run db:types   # regenera tipos desde Supabase local
```

`RED_SENDA_TEST_MODE=true` hace que las rutas E2E validen los contratos sin generar leads, eventos ni suscripciones reales. Nunca debe configurarse así en producción.

La integración destructiva `tests/integration/supabase-vertical.test.ts` y el E2E autenticado sólo aceptan una URL Supabase local por HTTP; fallan o se omiten si faltan `SUPABASE_TEST_URL`, `SUPABASE_TEST_PUBLISHABLE_KEY` o `SUPABASE_TEST_SECRET_KEY`. Ejecutalos después de `npm run db:reset`; crean y limpian usuarios, perfiles y objetos exclusivos de prueba y validan RLS, aceptación legal, onboarding, bootstrap admin, credencial privada, publicación, plan, lead idempotente, analítica y reset de moderación. `test:db:workflow` ejecuta además una fixture SQL dentro de una transacción que siempre termina en rollback.

`npm run db:reset` carga el seed demo local. Para el primer release piloto se decidió aplicar ese seed una sola vez y de forma explícita con `npx supabase@2.114.0 db push --linked --include-seed --yes`; no debe repetirse en releases posteriores sin una nueva decisión documentada.

## Límites de confianza

- El navegador usa sólo la publishable key; la secret key queda en módulos `server-only` usados por handlers, actions y workers acotados.
- La sesión Supabase usa cookies `SameSite=Lax` y `Secure` en producción. Son legibles por JavaScript (`HttpOnly=false`) por el cliente browser actual; CSP con nonce y controles XSS son compensatorios, y un BFF HttpOnly queda como evolución de seguridad.
- Leads y analytics entran por APIs con validación, origen y rate limit; los leads además usan idempotencia.
- Cada lead nuevo crea notificaciones transaccionales en outbox; se procesa un lote después de responder y el cron autenticado con `CRON_SECRET` recupera reintentos o leases vencidos.
- La PII de consultas, credenciales, auditoría, pagos y outbox vive en `private`.
- Los documentos se cargan en un bucket privado con rutas por usuario.
- La autorización real se evalúa en Postgres/RLS y en RPCs; nunca desde metadata editable.
- Los precios permanecen en `DRAFT`; una elección de plan queda en `PENDING_PAYMENT` y no activa cobro. El webhook de Mercado Pago falla cerrado hasta implementar y verificar firma y reconciliación en sandbox.
- Sin `RESEND_API_KEY` y un `EMAIL_FROM` verificado, los emails quedan reintentables y nunca se marcan falsamente como enviados.

## Documentación

- [Documento maestro](docs/RED_SENDA_MASTER.md)
- [Arquitectura](docs/architecture/architecture.md)
- [Base de datos](docs/architecture/database.md)
- [Seguridad](docs/architecture/security.md)
- [Producto](docs/product/vision.md)
- [Matching](docs/product/matching.md)
- [Despliegue](docs/deployment/vercel.md)

Los perfiles y textos demo son ficticios. No representan recomendaciones, diagnósticos ni profesionales reales.
