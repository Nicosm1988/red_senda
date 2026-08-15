import Link from "next/link";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { buttonStyles } from "@/components/ui/button";
import { formatPrice, formatRating, getNeedLabel, type Professional } from "@/lib/demo/public-data";

export function ProfessionalCard({ professional, priority = false }: { professional: Professional; priority?: boolean }) {
  return (
    <article
      className={`group relative overflow-hidden rounded-[1.6rem] border bg-paper p-5 transition-[border-color,transform] duration-200 hover:-translate-y-0.5 hover:border-senda/45 motion-reduce:transform-none motion-reduce:transition-none sm:p-6 ${
        professional.featured ? "border-clay/35" : "border-line"
      }`}
    >
      {priority ? <span className="sr-only">Resultado recomendado. </span> : null}
      <div className="flex items-start gap-4">
        <Avatar initials={professional.initials} size="lg" toneIndex={Number(professional.id.at(-1)) || 0} />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            {professional.isDemo === false ? null : <Badge tone="neutral">Perfil demo</Badge>}
            {professional.featured ? <Badge tone="clay">Perfil destacado</Badge> : null}
            {professional.verified ? <Badge tone="senda">✓ Verificado</Badge> : null}
          </div>
          <h2 className="mt-3 font-display text-2xl font-semibold tracking-[-0.03em] text-ink">
            <Link
              href={`/profesionales/${professional.slug}`}
              className="rounded-sm after:absolute after:inset-0 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-senda/35"
            >
              {professional.name}
            </Link>
          </h2>
          <p className="mt-1 text-sm font-semibold text-senda-dark">{professional.role}</p>
        </div>
      </div>

      <p className="mt-5 text-base font-medium leading-6 text-ink text-pretty">{professional.headline}</p>

      <ul aria-label="Necesidades que acompaña" className="relative mt-5 flex flex-wrap gap-2">
        {professional.needs.slice(0, 3).map((need) => (
          <li key={need} className="rounded-full border border-line bg-canvas px-3 py-1.5 text-xs font-medium text-muted">
            {getNeedLabel(need)}
          </li>
        ))}
      </ul>

      <dl className="relative mt-5 grid grid-cols-2 gap-x-4 gap-y-3 border-y border-line py-4 text-xs sm:grid-cols-4">
        <div>
          <dt className="font-semibold text-muted">Modalidad</dt>
          <dd className="mt-1 text-ink">{professional.modalities.map((item) => (item === "online" ? "Online" : "Presencial")).join(" · ")}</dd>
        </div>
        <div>
          <dt className="font-semibold text-muted">Ubicación</dt>
          <dd className="mt-1 text-ink">{professional.city}</dd>
        </div>
        <div>
          <dt className="font-semibold text-muted">Experiencia</dt>
          <dd className="mt-1 text-ink">{professional.yearsExperience} años</dd>
        </div>
        <div>
          <dt className="font-semibold text-muted">Valor orientativo</dt>
          <dd className="mt-1 text-ink">{professional.showPrice === false ? "A consultar" : `Desde ${formatPrice(professional)}`}</dd>
        </div>
      </dl>

      <div className="relative mt-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-senda-dark">{professional.availabilityLabel}</p>
          <p className="mt-1 text-xs text-muted">
            <span aria-hidden="true" className="text-clay">★</span> {formatRating(professional.rating)} · {professional.reviewCount} experiencias
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link className={buttonStyles({ variant: "secondary", size: "sm" })} href={`/profesionales/${professional.slug}`}>
            Ver perfil
          </Link>
          <Link className={buttonStyles({ size: "sm" })} href={`/profesionales/${professional.slug}#contactar`}>
            Contactar
          </Link>
        </div>
      </div>
    </article>
  );
}
