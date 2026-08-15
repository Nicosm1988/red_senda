import type { Metadata } from "next";
import { MatchingFlow, type MatchingProfessional } from "@/components/public/matching-flow";
import { PageHero } from "@/components/public/page-hero";
import { Container } from "@/components/ui/container";
import { publicRepository } from "@/lib/data/public-repository";

export const metadata: Metadata = {
  title: "Orientador de búsqueda profesional",
  description: "Respondé cuatro preguntas y recibí una orientación explicada sobre los tipos de acompañamiento que podrían resultarte útiles.",
  alternates: { canonical: "/matching" },
};

export default async function MatchingPage() {
  const professionals = await publicRepository.listProfessionals();
  const matchingProfessionals: MatchingProfessional[] = professionals.map((professional) => ({
    slug: professional.slug,
    name: professional.name,
    initials: professional.initials,
    role: professional.role,
    headline: professional.headline,
    professionalType: professional.professionalType,
    needs: professional.needs,
    modalities: professional.modalities,
    verified: professional.verified,
  }));

  return (
    <>
      <PageHero
        eyebrow="Orientador de búsqueda"
        title="Ponerle nombre a la pregunta también es parte del camino."
        description="Cuatro preguntas para reconocer qué formas de acompañamiento podrían servirte. Vas a ver el criterio completo detrás de cada sugerencia."
        breadcrumbs={[{ label: "Inicio", href: "/" }, { label: "Orientador" }]}
        aside={
          <div className="rounded-[1.25rem] border border-line bg-paper p-5 text-sm leading-6 text-muted">
            <strong className="block text-ink">Una orientación, no un diagnóstico</strong>
            No evaluamos tu salud mental ni indicamos tratamientos. El resultado abre opciones para que vos decidas qué explorar.
          </div>
        }
      />
      <section className="bg-canvas py-12 sm:py-16 lg:py-20">
        <Container className="max-w-[980px]">
          <MatchingFlow professionals={matchingProfessionals} />
          <p className="mx-auto mt-6 max-w-2xl text-center text-xs leading-5 text-muted">
            Tus respuestas permanecen en este dispositivo mientras completás el flujo y no se guardan al finalizar esta versión.
          </p>
        </Container>
      </section>
    </>
  );
}
