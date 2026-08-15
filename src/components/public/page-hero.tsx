import type { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { Container } from "@/components/ui/container";
import { Breadcrumbs, type BreadcrumbItem } from "@/components/public/breadcrumbs";

export function PageHero({
  eyebrow,
  title,
  description,
  breadcrumbs,
  actions,
  aside,
}: {
  eyebrow: string;
  title: string;
  description: string;
  breadcrumbs?: BreadcrumbItem[];
  actions?: ReactNode;
  aside?: ReactNode;
}) {
  return (
    <section className="relative overflow-hidden border-b border-line bg-canvas py-12 sm:py-16 lg:py-20">
      <div aria-hidden="true" className="absolute -right-20 -top-28 size-64 rounded-[42%_58%_65%_35%/56%_45%_55%_44%] border border-senda/15" />
      <Container>
        {breadcrumbs ? <Breadcrumbs items={breadcrumbs} /> : null}
        <div className={`mt-8 grid items-end gap-10 ${aside ? "lg:grid-cols-[1.3fr_.7fr]" : ""}`}>
          <div className="max-w-4xl">
            <Badge tone="senda">{eyebrow}</Badge>
            <h1 className="mt-5 font-display text-[clamp(2.45rem,7vw,5.25rem)] font-semibold leading-[0.98] tracking-[-0.052em] text-ink text-balance">
              {title}
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-7 text-muted text-pretty sm:text-lg">{description}</p>
            {actions ? <div className="mt-8 flex flex-wrap gap-3">{actions}</div> : null}
          </div>
          {aside ? <div>{aside}</div> : null}
        </div>
      </Container>
    </section>
  );
}
