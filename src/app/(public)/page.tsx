import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/seo/json-ld";
import { Badge } from "@/components/ui/badge";
import { buttonStyles } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

export const metadata: Metadata = {
  title: "Encontrá psicólogos y psicopedagogos",
  description:
    "Buscá psicólogos y psicopedagogos para decisiones de estudio, trabajo y carrera. Compará perfiles y contactá a la persona indicada.",
  alternates: { canonical: "/" },
};

const commonSearches = [
  ["elegir-estudios", "Elegir qué estudiar"],
  ["reinvencion", "Repensar mi carrera"],
  ["cambio-trabajo", "Cambiar de trabajo"],
  ["desarrollo", "Crecer profesionalmente"],
] as const;

export default function HomePage() {
  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Red Senda",
    url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://redsenda.com.ar",
    description:
      "Red de psicólogos y psicopedagogos para acompañar decisiones de estudio, trabajo y carrera.",
    areaServed: "AR",
  };

  return (
    <>
      <JsonLd data={organizationJsonLd} />

      <section className="flex min-h-[calc(100svh-7rem)] items-center bg-canvas py-5 sm:py-8 lg:py-10">
        <Container>
          <div className="overflow-hidden rounded-[1.6rem] border border-line bg-paper shadow-soft lg:grid lg:grid-cols-[minmax(0,.88fr)_minmax(480px,1.12fr)]">
            <div className="bg-ink px-5 py-7 text-white sm:px-8 sm:py-9 lg:flex lg:flex-col lg:justify-between lg:p-10">
              <div>
                <Badge tone="clay">Acompañamiento profesional</Badge>
                <h1 className="mt-5 max-w-xl font-display text-[clamp(1.9rem,3vw,2.5rem)] font-semibold leading-[1.04] tracking-[-0.04em] text-balance">
                  Encontrá tu profesional.
                </h1>
                <p className="mt-4 max-w-lg text-sm leading-6 text-white/72 sm:text-base">
                  Compará psicólogos y psicopedagogos por experiencia, modalidad y valoraciones. Elegí un perfil y enviá tu consulta de forma directa.
                </p>
              </div>

              <div className="mt-7 hidden border-t border-white/14 pt-5 sm:block">
                <ul className="flex flex-wrap gap-x-5 gap-y-2 text-xs font-semibold text-white/68" aria-label="Características del servicio">
                  <li>Buscar es gratis</li>
                  <li>Perfiles revisados</li>
                  <li>Opiniones visibles</li>
                </ul>
                <div className="mt-5 flex flex-wrap gap-3">
                  <Link href="/ingresar?next=/profesionales" className={buttonStyles({ variant: "inverse", size: "sm" })}>
                    Ingresar para contactar
                  </Link>
                  <Link
                    href="/registro?next=/profesionales"
                    className="inline-flex min-h-11 items-center justify-center rounded-full border border-white/28 px-4 text-xs font-semibold text-white transition-colors hover:border-white hover:bg-white/8 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-sand/50 motion-reduce:transition-none"
                  >
                    Crear cuenta gratuita
                  </Link>
                </div>
              </div>
            </div>

            <div className="px-5 py-7 sm:px-8 sm:py-9 lg:p-10">
              <p className="text-xs font-bold uppercase tracking-[0.12em] text-senda">Buscar en la red</p>
              <h2 className="mt-2 font-display text-2xl font-semibold tracking-[-0.035em] text-ink sm:text-3xl">
                Empezá tu búsqueda.
              </h2>

              <form action="/profesionales" method="get" className="mt-6" role="search">
                <label htmlFor="home-search" className="text-sm font-semibold text-ink">
                  ¿Qué necesitás trabajar?
                </label>
                <input
                  id="home-search"
                  name="q"
                  type="search"
                  autoComplete="off"
                  maxLength={80}
                  placeholder="Ej.: orientación vocacional…"
                  className="mt-2 min-h-12 w-full rounded-xl border border-line-strong bg-canvas px-4 text-sm text-ink placeholder:text-muted/75 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-senda/30"
                />

                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  <label className="sr-only" htmlFor="home-professional-type">
                    Profesional orientador
                  </label>
                  <select
                    id="home-professional-type"
                    name="type"
                    defaultValue=""
                    className="min-h-12 w-full rounded-xl border border-line-strong bg-paper px-4 text-sm text-ink focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-senda/30"
                  >
                    <option value="">Profesional orientador</option>
                    <option value="psicologia">Psicólogo/a</option>
                    <option value="psicopedagogia">Psicopedagogo/a</option>
                  </select>

                  <label className="sr-only" htmlFor="home-modality">
                    Modalidad
                  </label>
                  <select
                    id="home-modality"
                    name="modality"
                    defaultValue=""
                    className="min-h-12 w-full rounded-xl border border-line-strong bg-paper px-4 text-sm text-ink focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-senda/30"
                  >
                    <option value="">Online o presencial</option>
                    <option value="online">Online</option>
                    <option value="presencial">Presencial</option>
                  </select>
                </div>

                <button type="submit" className={`${buttonStyles({ size: "lg" })} mt-3 w-full`}>
                  Buscar profesionales
                </button>
              </form>

              <div className="mt-3 flex items-center justify-center gap-3 text-xs font-semibold sm:hidden">
                <Link
                  href="/ingresar?next=/profesionales"
                  className="rounded-sm text-senda-dark underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-senda/30"
                >
                  Ingresar para contactar
                </Link>
                <span aria-hidden="true" className="text-line-strong">·</span>
                <Link
                  href="/registro?next=/profesionales"
                  className="rounded-sm text-senda-dark underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-senda/30"
                >
                  Crear cuenta gratuita
                </Link>
              </div>

              <div className="mt-6 border-t border-line pt-5">
                <p className="text-xs font-semibold text-muted">Búsquedas frecuentes</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {commonSearches.map(([need, label]) => (
                    <Link
                      key={need}
                      href={`/profesionales?need=${need}`}
                      className="inline-flex min-h-11 items-center rounded-full border border-line bg-canvas px-4 text-xs font-semibold text-ink transition-colors hover:border-senda hover:bg-senda-soft focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-senda/30 motion-reduce:transition-none"
                    >
                      {label}
                    </Link>
                  ))}
                </div>
              </div>

              <p className="mt-5 text-xs leading-5 text-muted">
                Entrá a un perfil para conocer su enfoque, leer valoraciones y enviarle tus datos de contacto.
              </p>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
