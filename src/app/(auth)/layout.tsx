import Link from "next/link";
import type { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <main id="contenido" className="min-h-[calc(100svh-5rem)] bg-mist px-5 py-12 sm:py-20">
      <div className="mx-auto max-w-xl">
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-ink underline-offset-4 hover:underline"
        >
          <span aria-hidden="true">←</span> Volver a Red Senda
        </Link>
        <div className="rounded-[2rem] border border-line bg-paper p-6 shadow-[0_24px_70px_rgba(29,38,35,0.08)] sm:p-10">
          {children}
        </div>
      </div>
    </main>
  );
}
