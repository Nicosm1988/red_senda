import Link from "next/link";

export function Logo({ inverse = false }: { inverse?: boolean }) {
  return (
    <Link
      href="/"
      aria-label="Red Senda, inicio"
      className={`group inline-flex shrink-0 items-center gap-2 whitespace-nowrap rounded-sm focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-senda/35 ${inverse ? "text-white" : "text-ink"}`}
    >
      <span
        aria-hidden="true"
        className={`relative block size-6.5 rounded-full border ${inverse ? "border-white/65" : "border-senda/50"}`}
      >
        <span className={`absolute left-[5px] top-[13px] h-px w-[16px] -rotate-[24deg] ${inverse ? "bg-current" : "bg-senda"}`} />
        <span className={`absolute left-[15px] top-[7px] size-1.5 rounded-full ${inverse ? "bg-sand" : "bg-clay"}`} />
      </span>
      <span className="font-display text-[1.05rem] font-semibold tracking-[-0.02em]">
        Red <span className={inverse ? "text-sand" : "text-senda"}>Senda</span>
      </span>
    </Link>
  );
}
