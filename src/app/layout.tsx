import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { headers } from "next/headers";
import type { ReactNode } from "react";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { PointerIllumination } from "@/components/effects/pointer-illumination";
import "./globals.css";

// One local variable font powers body and display text, matching Universo
// Senda's identity. The licensed asset lives in the repo so production
// builds don't depend on Google Fonts availability.
const raleway = localFont({
  src: "./fonts/raleway-variable.ttf",
  variable: "--font-raleway",
  weight: "100 900",
  style: "normal",
  display: "swap",
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
    default: "Red Senda · Encontrá un profesional orientador",
    template: "%s · Red Senda",
  },
  description:
    "Encontrá psicólogos y psicopedagogos orientadores, compará perfiles y contactá al profesional que mejor se adapte a tu búsqueda.",
  applicationName: "Red Senda",
  category: "professional directory",
  keywords: [
    "orientación vocacional",
    "cambio de carrera",
    "empleabilidad",
    "psicología",
    "psicopedagogía",
    "Argentina",
  ],
  openGraph: {
    type: "website",
    locale: "es_AR",
    siteName: "Red Senda",
    title: "Red Senda · Encontrá un profesional orientador",
    description: "Buscá psicólogos y psicopedagogos orientadores, compará perfiles y contactá de forma directa.",
  },
  twitter: {
    card: "summary",
    title: "Red Senda",
    description: "Buscá psicólogos y psicopedagogos orientadores y contactá de forma directa.",
  },
};

export const viewport: Viewport = {
  colorScheme: "light dark",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fbf9fc" },
    { media: "(prefers-color-scheme: dark)", color: "#221b34" },
  ],
};

export default async function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  const nonce = (await headers()).get("x-nonce") ?? undefined;

  return (
    <html
      lang="es"
      className={raleway.variable}
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
        <PointerIllumination />
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
