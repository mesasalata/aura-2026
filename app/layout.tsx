import type { Metadata } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import "./globals.css";
import { SiteNav } from "@/components/site/site-nav";
import { SiteFooter } from "@/components/site/site-footer";
import { ScrollProgress } from "@/components/motion/scroll-progress";
import { BackToTop } from "@/components/site/back-to-top";
import { SketchDefs } from "@/components/viz/sketch";
import { asset } from "@/lib/utils";

const teamBase = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space",
  subsets: ["latin"],
  display: "block",
  preload: true,
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(`https://2026.igem.wiki${teamBase}`),
  title: {
    default: "AURA - iGEM 2026 · Milk is quiet. Infection is not.",
    template: "%s · AURA - iGEM 2026",
  },
  description:
    "AURA is an iGEM 2026 inline FET biosensor for bta-miR-223 in milk - a flag for subclinical bacterial mastitis, not a veterinary diagnosis.",
  keywords: [
    "iGEM 2026",
    "AURA",
    "mastitis",
    "biosensor",
    "synthetic biology",
    "dairy",
    "early detection",
    "miR-223",
    "FET",
  ],
  authors: [{ name: "AURA iGEM 2026 Team" }],
  icons: {
    icon: [
      { url: asset("/favicon.ico"), sizes: "any" },
      { url: asset("/favicon.png"), type: "image/png" },
    ],
    apple: asset("/favicon.png"),
  },
  openGraph: {
    title: "AURA - iGEM 2026",
    description: "Milk is quiet. Infection is not. An inline FET for miR-223 in milk.",
    type: "website",
    siteName: "AURA - iGEM 2026",
    url: "/",
  },
  alternates: {
    canonical: "/",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-cream text-ink">
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <SketchDefs />
        <ScrollProgress />
        <SiteNav />
        <main id="main" className="flex-1">
          {children}
        </main>
        <SiteFooter />
        <BackToTop />
      </body>
    </html>
  );
}
