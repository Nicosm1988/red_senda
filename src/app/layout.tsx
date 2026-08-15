import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

// A nonce-based CSP requires every HTML response to be rendered per request.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://redsenda.com.ar"),
  title: {
    default: "Red Senda · Decisiones profesionales acompañadas",
    template: "%s · Red Senda",
  },
  description:
    "Encontrá profesionales verificados para acompañar decisiones, búsquedas y transiciones de estudio, trabajo y carrera.",
  applicationName: "Red Senda",
  category: "career services",
  keywords: [
    "orientación vocacional",
    "cambio de carrera",
    "empleabilidad",
    "coaching de carrera",
    "mentoría profesional",
    "Argentina",
  ],
  openGraph: {
    type: "website",
    locale: "es_AR",
    siteName: "Red Senda",
    title: "Red Senda · Decisiones profesionales acompañadas",
    description: "Una red de especialistas para encontrar claridad y acompañamiento en tu próximo movimiento profesional.",
    images: ["/images/red-senda-conversation.webp"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Red Senda",
    description: "Decisiones profesionales acompañadas por personas.",
    images: ["/images/red-senda-conversation.webp"],
  },
};

export const viewport: Viewport = {
  colorScheme: "light",
  themeColor: "#fffdf8",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="es" data-scroll-behavior="smooth">
      <body>
        <a href="#contenido" className="skip-link">
          Saltar al contenido
        </a>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
