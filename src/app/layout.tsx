import type { Metadata, Viewport } from "next";
import { IBM_Plex_Sans } from "next/font/google";
import { headers } from "next/headers";
import type { ReactNode } from "react";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: "variable",
  display: "swap",
  variable: "--font-ibm-plex-sans",
  fallback: ["Arial", "sans-serif"],
});

const themeInitializationScript = `
(function () {
  var storageKey = "red-senda-theme:v1";
  var theme = "light";
  try {
    var savedTheme = window.localStorage.getItem(storageKey);
    if (savedTheme === "light" || savedTheme === "dark") {
      theme = savedTheme;
    } else if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
      theme = "dark";
    }
  } catch (_) {}
  document.documentElement.dataset.theme = theme;
})();
`;

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
    images: ["/images/red-senda-hero-conversation-v2.webp"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Red Senda",
    description: "Decisiones profesionales acompañadas por personas.",
    images: ["/images/red-senda-hero-conversation-v2.webp"],
  },
};

export const viewport: Viewport = {
  colorScheme: "light dark",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fbfaf7" },
    { media: "(prefers-color-scheme: dark)", color: "#111815" },
  ],
};

export default async function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  const nonce = (await headers()).get("x-nonce") ?? undefined;

  return (
    <html
      lang="es"
      className={ibmPlexSans.variable}
      data-scroll-behavior="smooth"
      data-theme="light"
      suppressHydrationWarning
    >
      <head>
        <script nonce={nonce} dangerouslySetInnerHTML={{ __html: themeInitializationScript }} />
      </head>
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
