import type { Metadata } from "next";
import Link from "next/link";
import { EmptyState } from "@/components/public/empty-state";
import { PageHero } from "@/components/public/page-hero";
import { ProfessionalCard } from "@/components/public/professional-card";
import { ProfessionalFiltersForm } from "@/components/public/professional-filters";
import { buttonStyles } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { publicRepository } from "@/lib/data/public-repository";
import { getNeedLabel, type ProfessionalFilters } from "@/lib/demo/public-data";

export const metadata: Metadata = {
  title: "Profesionales para decisiones y transiciones de carrera",
  description: "Compará especialistas en orientación, carrera, empleabilidad y mentoría por enfoque, modalidad, experiencia y disponibilidad.",
  alternates: { canonical: "/profesionales" },
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

const asArray = (value: string | string[] | undefined) => {
  if (!value) return undefined;
  return (Array.isArray(value) ? value : [value]).filter(Boolean);
};

function parseFilters(params: Record<string, string | string[] | undefined>): ProfessionalFilters {
  const single = (key: string) => {
    const value = params[key];
    return Array.isArray(value) ? value[0] : value;
  };

  return {
    q: single("q")?.slice(0, 80),
    need: asArray(params.need),
    type: asArray(params.type),
    modality: asArray(params.modality),
    location: asArray(params.location),
    language: asArray(params.language),
    verified: single("verified") === "true",
    price: single("price"),
    sort: single("sort") ?? "relevance",
  };
}

function countActiveFilters(filters: ProfessionalFilters) {
  return (
    (filters.q ? 1 : 0) +
    (filters.need?.length ?? 0) +
    (filters.type?.length ?? 0) +
    (filters.modality?.length ?? 0) +
    (filters.location?.length ?? 0) +
    (filters.language?.length ?? 0) +
    (filters.verified ? 1 : 0) +
    (filters.price ? 1 : 0)
  );
}

export default async function ProfessionalsPage({ searchParams }: { searchParams: SearchParams }) {
  const filters = parseFilters(await searchParams);
  const professionals = await publicRepository.listProfessionals(filters);
  const activeCount = countActiveFilters(filters);

  return (
    <>
      <PageHero
        eyebrow="Red profesional"
        title="Encontrá a alguien que comprenda el momento, no sólo el tema."
        description="Compará enfoques, experiencia, credenciales y formas de trabajo. Podés buscar por profesión o empezar por lo que te está pasando."
        breadcrumbs={[{ label: "Inicio", href: "/" }, { label: "Profesionales" }]}
        actions={
          <Link href="/matching" className={buttonStyles({ variant: "secondary" })}>
            No sé qué profesional necesito
          </Link>
        }
        aside={
          <dl className="grid grid-cols-2 gap-4 rounded-[1.35rem] border border-line bg-paper p-5 text-sm">
            <div>
              <dt className="text-muted">Perfiles visibles</dt>
              <dd className="mt-1 font-display text-3xl font-semibold text-ink">{professionals.length}</dd>
            </div>
            <div>
              <dt className="text-muted">Costo de buscar</dt>
              <dd className="mt-1 font-display text-3xl font-semibold text-ink">$0</dd>
            </div>
          </dl>
        }
      />

      <section className="bg-canvas py-10 sm:py-14 lg:py-16">
        <Container>
          <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)] lg:items-start">
            <aside aria-label="Filtros de profesionales" className="lg:sticky lg:top-24">
              <ProfessionalFiltersForm selected={filters} activeCount={activeCount} />
            </aside>

            <div>
              <div className="mb-6 flex flex-col gap-4 rounded-[1.25rem] border border-line bg-paper p-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-semibold text-ink">
                    {professionals.length === 1 ? "1 profesional coincide" : `${professionals.length} profesionales coinciden`}
                  </p>
                  <p className="mt-1 text-xs leading-5 text-muted">
                    El orden combina pertinencia, calidad del perfil y señales públicas. Los destacados siempre están identificados.
                  </p>
                </div>
                {filters.need?.length ? (
                  <div className="flex flex-wrap gap-2" aria-label="Necesidades seleccionadas">
                    {filters.need.map((need) => (
                      <span key={need} className="rounded-full bg-senda-soft px-3 py-1.5 text-xs font-semibold text-senda-dark">
                        {getNeedLabel(need)}
                      </span>
                    ))}
                  </div>
                ) : null}
              </div>

              {professionals.length ? (
                <div className="grid gap-5">
                  {professionals.map((professional, index) => (
                    <ProfessionalCard key={professional.id} professional={professional} priority={index === 0} />
                  ))}
                </div>
              ) : (
                <EmptyState />
              )}
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
