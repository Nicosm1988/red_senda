import type { Metadata } from "next";
import Link from "next/link";
import { AgreementCard } from "@/components/public/agreement-card";
import { ProfessionalCard } from "@/components/public/professional-card";
import { ResourceCard } from "@/components/public/resource-card";
import { SectionHeading } from "@/components/public/section-heading";
import { JsonLd } from "@/components/seo/json-ld";
import { Badge } from "@/components/ui/badge";
import { buttonStyles } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { publicRepository } from "@/lib/data/public-repository";

export const metadata: Metadata = {
  title: "Tu próximo movimiento profesional",
  description: "Encontrá especialistas para pensar y atravesar decisiones de estudio, trabajo y carrera con claridad y acompañamiento humano.",
  alternates: { canonical: "/" },
};

const situations = [
  ["elegir-estudios", "No sé qué estudiar", "Explorar intereses y construir criterios propios."],
  ["reinvencion", "Mi profesión ya no me representa", "Pensar un cambio sin borrar lo recorrido."],
  ["cambio-trabajo", "Quiero cambiar de trabajo", "Ordenar una búsqueda y elegir el próximo contexto."],
  ["transicion-digital", "Quiero pasar a tecnología", "Reconocer capacidades y probar roles posibles."],
  ["entrevistas", "Tengo entrevistas", "Preparar una narrativa clara y ejemplos concretos."],
  ["desarrollo", "Quiero crecer profesionalmente", "Trabajar liderazgo, dirección y próximos desafíos."],
] as const;

export default async function HomePage() {
  const [featuredProfessionals, resources, agreements] = await Promise.all([
    publicRepository.getFeaturedProfessionals(3),
    publicRepository.listResources(),
    publicRepository.listAgreements(),
  ]);

  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Red Senda",
    url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://redsenda.com.ar",
    description: "Red de profesionales para acompañar trayectorias, decisiones y transiciones profesionales.",
    areaServed: "AR",
  };

  return (
    <>
      <JsonLd data={organizationJsonLd} />

      <section className="overflow-hidden bg-ink py-10 text-white sm:py-12 lg:py-16">
        <Container>
          <div className="grid items-center gap-9 lg:grid-cols-[1.08fr_.92fr] lg:gap-12">
            <div>
              <Badge tone="clay">Personas para momentos profesionales</Badge>
              <h1 className="mt-5 max-w-3xl font-display text-[clamp(2.35rem,5vw,4.65rem)] font-semibold leading-[0.98] tracking-[-0.045em] text-balance">
                Tu próximo movimiento no tiene por qué pensarse a solas.
              </h1>
              <p className="mt-5 max-w-2xl text-sm leading-6 text-white/72 text-pretty sm:text-base">
                Red Senda conecta lo que te está pasando con especialistas capaces de acompañarte a explorar, decidir y avanzar con criterio propio.
              </p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <Link href="/profesionales" className={buttonStyles({ variant: "inverse", size: "lg" })}>
                  Encontrar un profesional
                </Link>
                <Link href="/matching" className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/30 px-6 text-base font-semibold text-white transition-colors hover:border-white hover:bg-white/8 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-sand/50 motion-reduce:transition-none">
                  No sé qué ayuda necesito
                </Link>
              </div>
              <div className="mt-7 flex flex-wrap gap-x-5 gap-y-2 text-xs font-semibold text-white/55">
                <span>Acceso gratuito para personas</span>
                <span>Perfiles revisados</span>
                <span>Sin rankings opacos</span>
              </div>
            </div>

            <div className="relative aspect-[4/3] overflow-hidden rounded-[1.5rem] border border-white/15 bg-senda-dark shadow-[0_24px_70px_rgba(0,0,0,0.2)]">
              {/* These pre-optimized local assets use native img elements because
                  next/image emits inline styles blocked by our style-src-attr CSP. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/red-senda-hero-conversation-v2.webp"
                alt="Dos personas conversan con atención en un espacio de trabajo sereno."
                width={1448}
                height={1086}
                loading="eager"
                fetchPriority="high"
                decoding="async"
                className="absolute inset-0 h-full w-full object-cover"
              />
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-canvas py-16 sm:py-20 lg:py-24">
        <Container>
          <SectionHeading
            eyebrow="Empezar por lo que te pasa"
            title="Una misma pregunta puede necesitar acompañamientos distintos."
            description="No hace falta conocer la profesión correcta de antemano. Elegí la situación más cercana y compará perfiles con distintos enfoques."
          />
          <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {situations.map(([value, title, description], index) => (
              <Link
                key={value}
                href={`/profesionales?need=${value}`}
                className="group rounded-[1.35rem] border border-line bg-paper p-5 transition-[border-color,transform] hover:-translate-y-0.5 hover:border-senda/45 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-senda/30 motion-reduce:transform-none motion-reduce:transition-none sm:p-6"
              >
                <span className="text-xs font-bold text-clay">0{index + 1}</span>
                <h2 className="mt-4 font-display text-2xl font-semibold leading-tight tracking-[-0.03em] text-ink">{title}</h2>
                <p className="mt-3 text-sm leading-6 text-muted">{description}</p>
                <span className="mt-6 inline-block text-sm font-bold text-senda-dark">Explorar especialistas →</span>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-y border-line bg-paper py-16 sm:py-20 lg:py-24">
        <Container>
          <div className="grid items-center gap-12 lg:grid-cols-[.85fr_1.15fr] lg:gap-20">
            <div className="relative min-h-[380px] overflow-hidden rounded-[1.75rem] bg-senda-soft shadow-soft">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/red-senda-conversation.webp"
                alt="Dos personas conversan con atención frente a un cuaderno en una biblioteca luminosa."
                width={1599}
                height={900}
                loading="lazy"
                decoding="async"
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute inset-x-5 bottom-5 rounded-[1.15rem] bg-ink/90 p-5 text-white backdrop-blur-sm sm:inset-x-7 sm:bottom-7">
                <p className="text-xs font-bold uppercase tracking-[0.1em] text-sand">Acompañamiento humano</p>
                <p className="mt-2 font-display text-xl font-semibold leading-tight tracking-[-0.025em]">
                  Una conversación que ordena sin decidir por vos.
                </p>
              </div>
            </div>
            <div>
              <SectionHeading
                eyebrow="Cuando todavía no sabés qué buscar"
                title="Una orientación breve para convertir la duda en una primera hipótesis."
                description="Nuestro cuestionario conecta tu situación, el momento de la decisión y el tipo de conversación que necesitás. No diagnostica ni decide por vos: muestra por qué ciertas formas de acompañamiento podrían ser útiles."
              />
              <Link href="/matching" className={`${buttonStyles({ size: "lg" })} mt-8`}>
                Orientar mi búsqueda
              </Link>
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-canvas py-16 sm:py-20 lg:py-24">
        <Container>
          <div className="flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
            <SectionHeading
              eyebrow="Perfiles para conocer"
              title="Trayectorias distintas para momentos distintos."
              description="Cada perfil cuenta cómo trabaja, qué credenciales revisamos y en qué situaciones puede acompañarte."
            />
            <Link href="/profesionales" className={buttonStyles({ variant: "secondary" })}>Ver toda la red</Link>
          </div>
          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {featuredProfessionals.map((professional, index) => (
              <ProfessionalCard key={professional.id} professional={professional} priority={index === 0} />
            ))}
          </div>
          <p className="mt-5 text-xs leading-5 text-muted">
            “Destacado” identifica visibilidad contratada. La verificación, las valoraciones y el encaje se muestran por separado.
          </p>
        </Container>
      </section>

      <section className="bg-paper py-16 sm:py-20 lg:py-24">
        <Container>
          <SectionHeading
            eyebrow="Cómo funciona"
            title="Menos ruido. Más contexto para elegir."
            description="Red Senda facilita el encuentro. Después, cada profesional y cada persona deciden cómo continuar."
            align="center"
          />
          <ol className="mt-12 grid gap-8 md:grid-cols-3">
            {[
              ["01", "Contanos tu momento", "Buscá directamente o usá el orientador para reconocer qué tipos de acompañamiento explorar."],
              ["02", "Compará con criterio", "Leé enfoques, credenciales, modalidades, experiencia y valores orientativos en un formato comparable."],
              ["03", "Iniciá una conversación", "Enviá una consulta breve. El profesional la recibe y coordina con vos si puede acompañarte."],
            ].map(([number, title, description]) => (
              <li key={number} className="border-t border-line-strong pt-6">
                <span className="font-display text-4xl font-semibold text-clay">{number}</span>
                <h2 className="mt-6 font-display text-2xl font-semibold tracking-[-0.03em] text-ink">{title}</h2>
                <p className="mt-3 text-sm leading-6 text-muted">{description}</p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      <section className="bg-senda-dark py-16 text-white sm:py-20">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[1.1fr_.9fr] lg:items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-sand">Confianza con matices</p>
              <h2 className="mt-5 max-w-3xl font-display text-4xl font-semibold leading-[1.03] tracking-[-0.04em] text-balance sm:text-5xl">
                Verificar bien no significa verificar a todos de la misma manera.
              </h2>
              <p className="mt-6 max-w-2xl text-base leading-7 text-white/70">
                Una matrícula, una certificación de coaching y una trayectoria ejecutiva requieren evidencias diferentes. Nuestro criterio se adapta al tipo profesional y el badge aparece sólo después de una revisión.
              </p>
            </div>
            <ul className="grid gap-3 text-sm text-white/78">
              {[
                "Identidad y datos profesionales revisados",
                "Credenciales evaluadas según cada disciplina",
                "Documentación sensible siempre privada",
                "Distinción clara entre verificación y visibilidad paga",
              ].map((item) => (
                <li key={item} className="flex gap-3 rounded-xl border border-white/12 p-4">
                  <span aria-hidden="true" className="text-sand">✓</span>{item}
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </section>

      <section className="bg-canvas py-16 sm:py-20 lg:py-24">
        <Container>
          <div className="flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
            <SectionHeading eyebrow="Ideas para orientarte" title="Antes de una respuesta, a veces hace falta una pregunta mejor." />
            <Link href="/recursos" className={buttonStyles({ variant: "secondary" })}>Explorar recursos</Link>
          </div>
          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {resources.slice(0, 3).map((article) => <ResourceCard key={article.slug} article={article} />)}
          </div>
        </Container>
      </section>

      <section className="border-t border-line bg-paper py-16 sm:py-20">
        <Container>
          <div className="grid items-center gap-8 lg:grid-cols-[1fr_auto]">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.12em] text-senda-dark">Programas institucionales</p>
              <h2 className="mt-4 max-w-3xl font-display text-3xl font-semibold leading-tight tracking-[-0.035em] text-ink sm:text-4xl">
                Acercamos acompañamiento a comunidades, equipos y estudiantes.
              </h2>
              <p className="mt-4 max-w-2xl text-sm leading-6 text-muted">Convenios claros, profesionales adheridos y condiciones visibles para cada comunidad.</p>
            </div>
            <Link href="/convenios" className={buttonStyles({ variant: "secondary" })}>Conocer convenios</Link>
          </div>
          <div className="mt-9 grid gap-5 lg:grid-cols-3">
            {agreements.map((agreement) => <AgreementCard key={agreement.slug} agreement={agreement} />)}
          </div>
        </Container>
      </section>

      <section className="bg-clay-soft py-16 sm:py-20">
        <Container>
          <div className="mx-auto max-w-4xl text-center">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-clay-dark">Para profesionales</p>
            <h2 className="mt-5 font-display text-4xl font-semibold leading-[1.02] tracking-[-0.04em] text-ink text-balance sm:text-5xl">
              Que tu experiencia llegue a las personas a quienes realmente puede servir.
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-muted">Una presencia profesional cuidada, contactos con contexto y una red para construir autoridad sin promesas vacías.</p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link href="/para-profesionales" className={buttonStyles({ size: "lg" })}>Conocer Red Senda</Link>
              <Link href="/planes" className={buttonStyles({ variant: "secondary", size: "lg" })}>Ver planes</Link>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
