import { Badge } from "@/components/ui/badge";

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
}: {
  eyebrow: string;
  title: string;
  description?: string;
  align?: "left" | "center";
}) {
  return (
    <div className={align === "center" ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}>
      <Badge tone="senda">{eyebrow}</Badge>
      <h2 className="mt-5 font-display text-3xl font-semibold leading-[1.08] tracking-[-0.035em] text-ink text-balance sm:text-4xl lg:text-5xl">
        {title}
      </h2>
      {description ? <p className="mt-5 max-w-2xl text-base leading-7 text-muted text-pretty sm:text-lg">{description}</p> : null}
    </div>
  );
}
