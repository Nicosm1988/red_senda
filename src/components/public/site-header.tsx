import Link from "next/link";
import { buttonStyles } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Logo } from "@/components/public/logo";

const navigation = [
  { href: "/profesionales", label: "Profesionales" },
  { href: "/matching", label: "Orientarme" },
  { href: "/recursos", label: "Recursos" },
  { href: "/convenios", label: "Convenios" },
  { href: "/para-profesionales", label: "Para profesionales" },
] as const;

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper/95 supports-[backdrop-filter]:bg-paper/90 supports-[backdrop-filter]:backdrop-blur-md">
      <Container className="flex min-h-[72px] items-center justify-between gap-6">
        <Logo />
        <nav aria-label="Navegación principal" className="hidden items-center gap-1 lg:flex">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full px-3.5 py-2 text-sm font-medium text-muted transition-colors hover:bg-mist hover:text-ink focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-senda/35 motion-reduce:transition-none"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-2 lg:flex">
          <Link href="/ingresar" className={buttonStyles({ variant: "quiet", size: "sm" })}>
            Ingresar
          </Link>
          <Link href="/registro?next=/profesionales/sumarse" className={buttonStyles({ variant: "secondary", size: "sm" })}>
            Crear perfil
          </Link>
          <Link href="/profesionales" className={buttonStyles({ size: "sm" })}>
            Encontrar acompañamiento
          </Link>
        </div>
        <details className="mobile-nav relative lg:hidden">
          <summary className="flex min-h-11 cursor-pointer list-none items-center rounded-full border border-line px-4 text-sm font-semibold text-ink focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-senda/35">
            Menú
          </summary>
          <div className="absolute right-0 top-[calc(100%+12px)] w-[min(82vw,320px)] rounded-[1.25rem] border border-line bg-paper p-3 shadow-[0_18px_50px_rgba(30,39,36,0.12)]">
            <nav aria-label="Navegación móvil" className="flex flex-col">
              {navigation.map((item) => (
                <Link key={item.href} href={item.href} className="rounded-xl px-4 py-3 text-base font-medium text-ink hover:bg-mist">
                  {item.label}
                </Link>
              ))}
              <div className="my-2 border-t border-line" />
              <Link href="/ingresar" className="rounded-xl px-4 py-3 text-base font-medium text-ink hover:bg-mist">
                Ingresar
              </Link>
              <Link href="/registro?next=/profesionales/sumarse" className="rounded-xl px-4 py-3 text-base font-medium text-ink hover:bg-mist">
                Crear perfil profesional
              </Link>
              <Link href="/profesionales" className={`${buttonStyles({ size: "sm" })} mt-2`}>
                Encontrar acompañamiento
              </Link>
            </nav>
          </div>
        </details>
      </Container>
    </header>
  );
}
