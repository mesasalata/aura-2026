"use client";

import { Container } from "@/components/ui/container";
import type { Accent } from "@/components/ui/badge";
import { Art } from "@/components/viz/art";
import { Blob } from "@/components/viz/sketch";
import { heroArtId, heroCastFor, type ArtScene } from "@/lib/art";
import { WAVE } from "@/components/site/wave-seam";
import { cn } from "@/lib/utils";

/** Solid drops floating in the ink sky. Fixed positions so server and client agree. */
const BUBBLES = [
  { x: "6%", y: "30%", s: 14, c: "var(--color-butter)", d: 0 },
  { x: "44%", y: "18%", s: 10, c: "var(--color-pink-soft)", d: 1.4 },
  { x: "53%", y: "62%", s: 18, c: "var(--color-signal)", d: 2.2 },
  { x: "68%", y: "14%", s: 12, c: "var(--color-butter)", d: 0.8 },
  { x: "93%", y: "40%", s: 16, c: "var(--color-pink)", d: 3 },
  { x: "88%", y: "78%", s: 9, c: "var(--color-butter)", d: 2.6 },
];

const BLOB_FILL = { pink: "var(--color-pink)", signal: "var(--color-signal)", butter: "var(--color-butter)" } as const;

/**
 * Inner page banner: ink sky, fat milk title with a pink offset, this page's
 * own cow on a solid blob, and a two-tone wave into the milk page.
 */
export function PageHero({
  kicker,
  name,
  title,
  lede,
  page,
  notice,
}: {
  kicker: string;
  /** Short banner word. Falls back to `title`. */
  name?: string;
  title: React.ReactNode;
  lede?: string;
  accent?: Accent;
  /** Route for this banner, e.g. `/education`. Picks `HERO_CAST`, not the nav section. */
  page?: string;
  scene?: ArtScene;
  /** Copy-completion line. Rendered above the kicker, under the nav. */
  notice?: React.ReactNode;
}) {
  const word = name ?? (typeof title === "string" ? title : kicker);
  const sub = name && typeof title === "string" && title !== name ? title : undefined;
  const lead = heroCastFor(page);
  const artId = heroArtId(lead);

  return (
    <div className="overflow-x-clip">
      <section className="relative overflow-hidden bg-ink pt-20" data-nav-tone="dark">
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          {BUBBLES.map((b, i) => (
            <span
              key={i}
              className="animate-drift absolute rounded-full border-2 border-ink"
              style={{ left: b.x, top: b.y, width: b.s, height: b.s, background: b.c, animationDelay: `-${b.d}s` }}
            />
          ))}
        </div>

        {notice ? (
          <Container size="wide" className="relative z-10 pt-2">
            {notice}
          </Container>
        ) : null}

        <Container
          size="wide"
          className="relative z-10 grid items-end gap-6 pb-14 pt-6 sm:grid-cols-[minmax(0,1fr)_auto] sm:pb-16"
        >
          <div className="min-w-0 pb-2">
            <p className="chip-pop kicker">{kicker}</p>
            <h1 className="pop-text mt-5 max-w-4xl font-display text-milk display-hero">{word}</h1>
            {sub && (
              <p className="mt-5 max-w-2xl text-xl font-extrabold leading-snug text-butter text-pretty sm:text-2xl">
                {sub}
              </p>
            )}
            {lede && (
              <p className="mt-3 max-w-xl text-base leading-relaxed text-milk/85 text-pretty sm:text-lg">{lede}</p>
            )}
          </div>

          <div
            className={cn("relative mx-auto h-56 w-56 sm:mx-0 sm:h-72 sm:w-72 lg:h-80 lg:w-80", !artId && "hidden sm:block")}
            aria-hidden={artId ? true : undefined}
          >
            <Blob shape="ring" fill={BLOB_FILL[lead.glow ?? "pink"]} outline className="absolute -inset-[4%] h-[108%] w-[108%]" />
            <span className={cn("absolute right-[8%] top-[4%] h-7 w-7 rounded-full border-2 border-ink", lead.glow === "butter" ? "bg-pink" : "bg-butter")} />
            <span className={cn("absolute bottom-[10%] left-[2%] h-4 w-4 rounded-full border-2 border-ink", lead.glow === "signal" ? "bg-pink-soft" : "bg-signal")} />
            {artId ? (
              <Art
                id={artId}
                motion={lead.motion ?? "breathe"}
                decorative={false}
                alt={lead.alt}
                className="sticker absolute inset-[6%] !h-[88%] !w-[88%]"
              />
            ) : (
              <p className="absolute inset-0 grid place-items-center p-8 text-center font-display text-lg leading-snug text-milk">
                {lead.alt}
              </p>
            )}
          </div>
        </Container>

        <div aria-hidden className="relative z-10 h-16 w-full sm:h-20">
          <svg viewBox="0 0 1440 80" preserveAspectRatio="none" className="absolute inset-x-0 -top-3 block h-full w-full">
            <path d={WAVE} fill="var(--color-pink)" />
          </svg>
          <svg viewBox="0 0 1440 80" preserveAspectRatio="none" className="absolute inset-0 block h-full w-full">
            <path d={WAVE} fill="var(--color-milk)" data-nav-tone="light" />
          </svg>
          <span className="absolute inset-x-0 bottom-0 h-[2px] bg-milk" />
        </div>
      </section>
    </div>
  );
}
