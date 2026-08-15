import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/seo/json-ld";
import { AnalyticsPageView } from "@/components/analytics/page-view";
import { Breadcrumbs } from "@/components/public/breadcrumbs";
import { ContactForm } from "@/components/public/contact-form";
import { ProfessionalCard } from "@/components/public/professional-card";
import { ResourceCard } from "@/components/public/resource-card";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { buttonStyles } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { publicRepository } from "@/lib/data/public-repository";
import { formatPrice, formatRating, getNeedLabel } from "@/lib/demo/public-data";

type ProfessionalPageProps = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return publicRepository.listProfessionalSlugs();
}

export async function generateMetadata({ params }: ProfessionalPageProps): Promise<Metadata> {
  const { slug } = await params;
  const professional = await publicRepository.getProfessional(slug);
  if (!professional) return { title: "Perfil no encontrado" };

  return {
    title: `${professional.name} · ${professional.role}`,
    description: `${professional.headline} Conocé su enfoque, experiencia, modalidades y disponibilidad en Red Senda.`,
    alternates: { canonical: `/profesionales/${professional.slug}` },
    openGraph: {
      type: "profile",
      title: `${professional.name} en Red Senda`,
      description: professional.headline,
      url: `/profesionales/${professional.slug}`,
    },
  };
}

export default async function ProfessionalProfilePage({ params }: ProfessionalPageProps) {
  const { slug } = await params;
  const professional = await publicRepository.getProfessional(slug);
  if (!professional) notFound();

  const [resources, compatible] = await Promise.all([
    publicRepository.listResources(),
    publicRepository.listProfessionals({ need: professional.needs, sort: "match" }),
  ]);
  const authoredResources = resources.filter((resource) => resource.professionalSlug === professional.slug);
  const otherProfessionals = compatible.filter((item) => item.slug !== professional.slug).slice(0, 2);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: professional.name,
    description: professional.headline,
    url: `${process.env.NEXT_PUBLIC_SITE_URL ?? "https://redsenda.com.ar"}/profesionales/${professional.slug}`,
    areaServed: { "@type": "Country", name: professional.country },
    address: {
      "@type": "PostalAddress",
      addressLocality: professional.city,
      addressCountry: "AR",
    },
    provider: {
      "@type": "Person",
      name: professional.name,
      jobTitle: professional.role,
    },
    aggregateRating: professional.reviewCount
      ? {
          "@type": "AggregateRating",
          ratingValue: professional.rating,
          reviewCount: professional.reviewCount,
          bestRating: 5,
        }
      : undefined,
    offers: professional.showPrice === false
      ? undefined
      : {
          "@type": "Offer",
          price: professional.priceFrom,
          priceCurrency: professional.currency,
          description: "Valor orientativo desde",
        },
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      <AnalyticsPageView eventName="professional_profile_viewed" professionalProfileId={professional.id} />

      <section className="border-b border-line bg-canvas py-9 sm:py-12">
        <Container>
          <Breadcrumbs items={[{ label: "Inicio", href: "/" }, { label: "Profesionales", href: "/profesionales" }, { label: professional.name }]} />
          <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_310px] lg:items-end">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
              <Avatar initials={professional.initials} size="xl" toneIndex={Number(professional.id.at(-1)) || 0} />
              <div>
                <div className="flex flex-wrap gap-2">
                  {professional.isDemo === false ? null : <Badge>Perfil demo</Badge>}
                  {professional.verified ? <Badge tone="senda">✓ Perfil verificado</Badge> : <Badge>Verificación en curso</Badge>}
                  {professional.featured ? <Badge tone="clay">Perfil destacado</Badge> : null}
                </div>
                <h1 className="mt-4 font-display text-4xl font-semibold leading-none tracking-[-0.045em] text-ink text-balance sm:text-6xl">{professional.name}</h1>
                <p className="mt-3 text-sm font-bold text-senda-dark sm:text-base">{professional.role}</p>
                <p className="mt-5 max-w-2xl text-lg font-medium leading-7 text-ink text-pretty">{professional.headline}</p>
                <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-xs text-muted">
                  <span>{professional.city}, {professional.country}</span>
                  <span>{professional.modalities.map((mode) => (mode === "online" ? "Online" : "Presencial")).join(" · ")}</span>
                  <span><span aria-hidden="true" className="text-clay">★</span> {formatRating(professional.rating)} · {professional.reviewCount} experiencias</span>
                </div>
              </div>
            </div>
            <div className="rounded-[1.35rem] border border-line bg-paper p-5">
              <p className="text-xs font-semibold text-muted">Valor orientativo</p>
              <p className="mt-1 font-display text-3xl font-semibold tracking-[-0.03em] text-ink">{professional.showPrice === false ? "A consultar" : `Desde ${formatPrice(professional)}`}</p>
              <p className="mt-3 text-sm font-semibold text-senda-dark">{professional.availabilityLabel}</p>
              {professional.acceptingLeads === false ? (
                <p className="mt-5 rounded-xl bg-mist px-4 py-3 text-sm font-semibold text-muted">Consultas pausadas por el momento</p>
              ) : (
                <Link href="#contactar" className={`${buttonStyles()} mt-5 w-full`}>Enviar una consulta</Link>
              )}
            </div>
          </div>
        </Container>
      </section>

      <div className="bg-paper py-14 sm:py-18 lg:py-20">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_310px] lg:gap-16">
            <div className="min-w-0">
              <section aria-labelledby="sobre-mi" className="border-b border-line pb-12">
                <p className="text-xs font-bold uppercase tracking-[0.12em] text-senda-dark">Conocer a la persona</p>
                <h2 id="sobre-mi" className="mt-3 font-display text-3xl font-semibold tracking-[-0.035em] text-ink sm:text-4xl">Sobre mí</h2>
                <p className="mt-6 max-w-3xl text-base leading-8 text-muted text-pretty">{professional.about}</p>
              </section>

              <section aria-labelledby="acompanar" className="border-b border-line py-12">
                <p className="text-xs font-bold uppercase tracking-[0.12em] text-senda-dark">Situaciones</p>
                <h2 id="acompanar" className="mt-3 font-display text-3xl font-semibold tracking-[-0.035em] text-ink sm:text-4xl">En qué puedo acompañarte</h2>
                <div className="mt-7 grid gap-3 sm:grid-cols-2">
                  {professional.needs.map((need, index) => (
                    <div key={need} className="rounded-[1.15rem] border border-line bg-canvas p-5">
                      <span className="text-xs font-bold text-clay">0{index + 1}</span>
                      <h3 className="mt-3 font-display text-xl font-semibold tracking-[-0.025em] text-ink">{getNeedLabel(need)}</h3>
                    </div>
                  ))}
                </div>
                <div className="mt-7">
                  <h3 className="text-sm font-bold text-ink">Especialidades</h3>
                  <ul className="mt-3 flex flex-wrap gap-2">
                    {professional.specialties.map((specialty) => <li key={specialty} className="rounded-full border border-line bg-paper px-3 py-1.5 text-xs font-medium text-muted">{specialty}</li>)}
                  </ul>
                </div>
              </section>

              <section aria-labelledby="como-trabajo" className="border-b border-line py-12">
                <p className="text-xs font-bold uppercase tracking-[0.12em] text-senda-dark">Enfoque</p>
                <h2 id="como-trabajo" className="mt-3 font-display text-3xl font-semibold tracking-[-0.035em] text-ink sm:text-4xl">Cómo trabajo</h2>
                <ol className="mt-7 space-y-4">
                  {professional.workingStyle.map((item, index) => (
                    <li key={item} className="grid grid-cols-[2.5rem_1fr] gap-4 rounded-[1.15rem] bg-canvas p-5">
                      <span className="font-display text-2xl font-semibold text-clay">{index + 1}</span>
                      <p className="text-sm leading-6 text-muted">{item}</p>
                    </li>
                  ))}
                </ol>
              </section>

              <section aria-labelledby="trayectoria" className="border-b border-line py-12">
                <div className="grid gap-10 md:grid-cols-2">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.12em] text-senda-dark">Recorrido</p>
                    <h2 id="trayectoria" className="mt-3 font-display text-3xl font-semibold tracking-[-0.035em] text-ink">Experiencia</h2>
                    <ol className="mt-6 space-y-6 border-l border-line pl-5">
                      {professional.experience.map((item) => (
                        <li key={`${item.role}-${item.organization}`}>
                          <h3 className="text-sm font-bold text-ink">{item.role}</h3>
                          <p className="mt-1 text-sm text-muted">{item.organization}</p>
                          <p className="mt-1 text-xs text-muted">{item.period}</p>
                        </li>
                      ))}
                    </ol>
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.12em] text-senda-dark">Formación</p>
                    <h2 className="mt-3 font-display text-3xl font-semibold tracking-[-0.035em] text-ink">Estudios</h2>
                    <ul className="mt-6 space-y-5">
                      {professional.education.map((item) => (
                        <li key={item.title} className="border-b border-line pb-5 last:border-0">
                          <h3 className="text-sm font-bold text-ink">{item.title}</h3>
                          <p className="mt-1 text-sm leading-5 text-muted">{item.institution}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </section>

              <section aria-labelledby="opiniones" className="border-b border-line py-12">
                <p className="text-xs font-bold uppercase tracking-[0.12em] text-senda-dark">Experiencias moderadas</p>
                <h2 id="opiniones" className="mt-3 font-display text-3xl font-semibold tracking-[-0.035em] text-ink sm:text-4xl">Opiniones</h2>
                {professional.testimonials.length ? (
                  <div className="mt-7 grid gap-4">
                    {professional.testimonials.map((testimonial) => (
                      <figure key={testimonial.quote} className="rounded-[1.25rem] border border-line bg-canvas p-6 sm:p-7">
                        <blockquote className="font-display text-xl font-medium leading-8 tracking-[-0.015em] text-ink">“{testimonial.quote}”</blockquote>
                        <figcaption className="mt-5 text-xs text-muted"><strong className="text-ink">{testimonial.author}</strong> · {testimonial.context}</figcaption>
                      </figure>
                    ))}
                  </div>
                ) : (
                  <p className="mt-6 rounded-[1.15rem] bg-canvas p-5 text-sm leading-6 text-muted">Este perfil todavía no tiene experiencias publicadas. Todas las opiniones pasan por moderación antes de aparecer.</p>
                )}
              </section>

              {authoredResources.length ? (
                <section aria-labelledby="recursos-publicados" className="pt-12">
                  <p className="text-xs font-bold uppercase tracking-[0.12em] text-senda-dark">Ideas compartidas</p>
                  <h2 id="recursos-publicados" className="mt-3 font-display text-3xl font-semibold tracking-[-0.035em] text-ink sm:text-4xl">Recursos publicados</h2>
                  <div className="mt-7 grid gap-5">{authoredResources.map((resource) => <ResourceCard key={resource.slug} article={resource} featured />)}</div>
                </section>
              ) : null}
            </div>

            <aside aria-label="Información práctica" className="space-y-5 lg:sticky lg:top-24 lg:self-start">
              <div className="rounded-[1.35rem] border border-line bg-canvas p-5">
                <h2 className="font-display text-xl font-semibold tracking-[-0.025em] text-ink">Información práctica</h2>
                <dl className="mt-5 space-y-4 text-sm">
                  <div className="border-b border-line pb-4"><dt className="text-xs font-semibold text-muted">Modalidad</dt><dd className="mt-1 text-ink">{professional.modalities.map((mode) => (mode === "online" ? "Online" : `Presencial en ${professional.city}`)).join(" · ")}</dd></div>
                  <div className="border-b border-line pb-4"><dt className="text-xs font-semibold text-muted">Idiomas</dt><dd className="mt-1 capitalize text-ink">{professional.languages.join(" · ")}</dd></div>
                  <div className="border-b border-line pb-4"><dt className="text-xs font-semibold text-muted">Públicos</dt><dd className="mt-1 text-ink">{professional.audiences.join(" · ")}</dd></div>
                  <div><dt className="text-xs font-semibold text-muted">Industrias</dt><dd className="mt-1 text-ink">{professional.industries.join(" · ")}</dd></div>
                </dl>
              </div>
              <div className="rounded-[1.35rem] border border-senda/20 bg-senda-soft p-5">
                <Badge tone="senda">{professional.verified ? "Verificación completa" : "En revisión"}</Badge>
                <ul className="mt-4 space-y-2 text-xs leading-5 text-muted">
                  {professional.credentials.map((credential) => <li key={credential} className="flex gap-2"><span aria-hidden="true" className="text-senda-dark">✓</span>{credential}</li>)}
                </ul>
                <p className="mt-4 border-t border-senda/15 pt-4 text-[0.7rem] leading-5 text-muted">La documentación respaldatoria es privada y sólo puede verla el equipo autorizado de verificación.</p>
              </div>
            </aside>
          </div>
        </Container>
      </div>

      <section id="contactar" aria-labelledby="contact-title" className="scroll-mt-24 bg-senda-dark py-14 text-white sm:py-18 lg:py-20">
        <Container>
          {professional.acceptingLeads === false ? (
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-xs font-bold uppercase tracking-[0.12em] text-sand">Agenda pausada</p>
              <h2 id="contact-title" className="mt-4 font-display text-4xl font-semibold tracking-[-0.04em]">Este perfil no recibe consultas por el momento.</h2>
              <p className="mt-5 text-sm leading-6 text-white/68">Podés comparar otros enfoques y disponibilidades en el directorio.</p>
              <Link href="/profesionales" className={`${buttonStyles({ variant: "inverse" })} mt-7`}>Ver otros perfiles</Link>
            </div>
          ) : (
          <div className="grid gap-10 lg:grid-cols-[.75fr_1.25fr] lg:gap-16">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.12em] text-sand">Primer contacto</p>
              <h2 id="contact-title" className="mt-4 font-display text-4xl font-semibold leading-[1.04] tracking-[-0.04em] text-balance sm:text-5xl">Iniciá una conversación con {professional.name.split(" ")[0]}.</h2>
              <p className="mt-5 text-sm leading-6 text-white/68">Contá sólo lo necesario para que pueda entender tu consulta. No incluyas información clínica, documentos ni datos sensibles.</p>
            </div>
            <div className="rounded-[1.5rem] bg-paper p-6 text-ink sm:p-8">
              <ContactForm
                professionalId={professional.id}
                professionalName={professional.name}
                isDemo={professional.isDemo !== false}
                needs={professional.contactNeeds?.length
                  ? professional.contactNeeds
                  : professional.needs.map((need) => ({ id: need, label: getNeedLabel(need) }))}
              />
            </div>
          </div>
          )}
        </Container>
      </section>

      {otherProfessionals.length ? (
        <section className="bg-canvas py-14 sm:py-18">
          <Container>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div><p className="text-xs font-bold uppercase tracking-[0.12em] text-senda-dark">Seguir comparando</p><h2 className="mt-3 font-display text-3xl font-semibold tracking-[-0.035em] text-ink">Otros enfoques compatibles</h2></div>
              <Link href="/profesionales" className={buttonStyles({ variant: "secondary" })}>Volver al buscador</Link>
            </div>
            <div className="mt-8 grid gap-5 lg:grid-cols-2">{otherProfessionals.map((item) => <ProfessionalCard key={item.id} professional={item} />)}</div>
          </Container>
        </section>
      ) : null}
    </>
  );
}
