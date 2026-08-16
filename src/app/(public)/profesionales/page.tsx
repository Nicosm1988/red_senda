import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/public/breadcrumbs";
import { EmptyState } from "@/components/public/empty-state";
import { ProfessionalCard } from "@/components/public/professional-card";
import { ProfessionalFiltersForm } from "@/components/public/professional-filters";
import { buttonStyles } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { publicRepository } from "@/lib/data/public-repository";
import { getNeedLabel, type ProfessionalFilters } from "@/lib/demo/public-data";

export const metadata: Metadata = {
  title: "Psicólogos y psicopedagogos orientadores",
  description: "Buscá psicólogos y psicopedagogos por enfoque, modalidad, experiencia, opiniones y disponibilidad.",
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
    (filters.verified ? 1 : 0)
  );
}

export default async function ProfessionalsPage({ searchParams }: { searchParams: SearchParams }) {
  const filters = parseFilters(await searchParams);
  const professionals = await publicRepository.listProfessionals(filters);
  const activeCount = countActiveFilters(filters);

  return (
    <>
      <section className="border-b border-line bg-canvas py-6 sm:py-8">
        <Container>
          <Breadcrumbs items={[{ label: "Inicio", href: "/" }, { label: "Profesionales" }]} />
          <div className="mt-5 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div className="max-w-3xl">
              <p className="text-xs font-bold uppercase tracking-[0.12em] text-senda-dark">Psicología y psicopedagogía</p>
              <h1 className="mt-2 text-3xl font-semibold tracking-[-0.035em] text-ink text-balance sm:text-4xl">
                Encontrá a tu profesional orientador.
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-muted text-pretty">
                Buscá por lo que necesitás, compará credenciales y opiniones, y contactá directamente.
              </p>
            </div>
            <Link href="/ingresar?next=/profesionales" className={buttonStyles({ variant: "secondary", size: "sm" })}>
              Ingresar
            </Link>
          </div>
        </Container>
      </section>

      <section id="resultados" className="scroll-mt-24 bg-canvas py-6 sm:py-8 lg:py-10">
        <Container>
          <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)] lg:items-start">
            <aside aria-label="Filtros de profesionales" className="lg:sticky lg:top-24 lg:self-start">
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
                <div data-testid="professional-results" className="grid items-stretch gap-5 xl:grid-cols-2">
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
