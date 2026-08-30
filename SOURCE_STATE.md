# SOURCE_STATE

Auditoría previa a la división Red Senda → Universo Psi + Red Senda vertical.

## Base para Universo Psi

**Base: HEAD actual de `main` (commit `4de373c`).** No existe en el historial de Git
(15 commits totales, desde `eceb8ae` hasta `4de373c`) ninguna versión anterior que
represente un marketplace amplio de salud mental. La única "amplitud" histórica
documentada (D-013, migración `20260815233718_restrict_public_catalog_to_orientation_professionals.sql`)
es sobre profesiones de **orientación de carrera** (coaching, recruiting, mentoría
ejecutiva/tecnológica, marca personal), no sobre salud mental (no hay psiquiatría,
musicoterapia, neuropsicología, etc. en ningún commit ni seed).

Lo que sí existe en HEAD es la **infraestructura genérica data-driven** para
soportar cualquier taxonomía: tablas `professional_types`, `credential_types`,
`verification_rules`, `needs`, `services`, `specialties`, `audiences`, `modalities`,
`locations`, `career_stages`, más auth, onboarding, verificación admin, leads,
dashboard, RLS y búsqueda ya construidos y estables.

**Decisión:** aplica la regla C del prompt maestro — "si HEAD contiene toda la
infraestructura y sólo existe un filtro/restricción, reutilizar HEAD y ampliar
la taxonomía". Universo Psi parte de HEAD completo (código, arquitectura, UI) y
agrega un seed/taxonomía nueva de salud mental; no se reconstruye desde cero ni
se recupera un commit antiguo (no existe).

## Diferencias respecto de Red Senda actual

- Contenido de catálogo (`needs`/`services`/`specialties`/`professional_types`)
  está orientado 100% a carrera/orientación laboral — no sirve para Universo Psi
  y debe reemplazarse por un seed de salud mental.
- La función `private.has_supported_professional_types` y la migración de
  restricción fijan el contrato público a `psychology_orientation` +
  `psychopedagogy` — debe generalizarse/ampliarse para Universo Psi.
- Branding, copy, metadata, SEO están escritos para "Red Senda" / orientación
  vocacional-laboral.
- README documentaba producción en commit `de0fbef`, pero el último deploy de
  producción real en Vercel (verificado vía API) es `4de373c` — la documentación
  estaba desactualizada, no hay discrepancia de código real. Se corrige en el
  checkpoint de docs.

## Elementos que deben separarse

- Proyecto Supabase (DB, Auth, Storage, RLS, migraciones aplicadas desde cero,
  seed demo nuevo).
- Proyecto Vercel + variables de entorno (ya existe `universo-psi` vacío,
  vinculado a `Universo_Psi`, sin dominios ni deploys).
- Repositorio Git (`Universo_Psi`, vacío en GitHub).
- Branding/identidad (nombre, textos, metadata, footer, legales).
- Seed de taxonomía y contenido editorial.

## Para Red Senda (vertical)

Los catálogos `needs`/`services`/`specialties` ya existentes (elección de
estudios, cambio de trabajo, reinvención profesional, transición a tecnología,
liderazgo, cambio de industria) están alineados casi 1:1 con las categorías de
"orientación a lo largo de la vida" pedidas (carrera, reconversión, transiciones
laborales). Se reutilizan y ajustan; no se reconstruyen. Los `professional_types`
inactivos de coaching/recruiting/mentoring **no** se activan como tipos de
marketplace (regla: sólo Psicólogo/a y Psicopedagogo/a) — quedan como están
(inactivos, preservados por integridad referencial).
