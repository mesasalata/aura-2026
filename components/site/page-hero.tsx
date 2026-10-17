"use client";

import { Container } from "@/components/ui/container";
import type { Accent } from "@/components/ui/badge";
import { Art } from "@/components/viz/art";
import { Blob } from "@/components/viz/sketch";
import { heroArtId, heroCastFor, type ArtScene } from "@/lib/art";
import { MILK, WaveSeam } from "@/components/site/wave-seam";

/**
 * Illustrated page banner - ink sky, milk type, cream hide only under the fold.
 * Type never sits on a mixed ground.
 */
export function PageHero({
  kicker,
  name,
  title,
  lede,
  page,
  scene = "project",
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
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
          <Blob
            shape="d"
            fill="var(--color-pink)"
            className="absolute -right-[6%] top-[-8%] h-[16rem] w-[16rem] opacity-25"
          />
          <Blob
            shape="c"
            fill="var(--color-signal)"
            className="absolute right-[22%] top-[6%] h-28 w-28 opacity-15"
          />
        </div>

        <div
          className={`pointer-events-none absolute right-[8%] top-[26%] z-10 ${artId ? "hidden sm:block" : ""}`}
          aria-hidden={artId ? true : undefined}
        >
          {artId ? (
            <Art id={artId} size={188} motion={lead.motion ?? "breathe"} glow={lead.glow} decorative={false} alt={lead.alt} />
          ) : (
            <p className="max-w-[14rem] text-right font-display leading-snug text-milk">
              <span className="block text-lg font-medium">{lead.id}</span>
              <span className="mt-1 block text-sm font-normal text-milk/80">{lead.alt}</span>
            </p>
          )}
        </div>

        {notice ? (
          <Container size="wide" className="relative z-10 pt-2">
            {notice}
          </Container>
        ) : null}

        <Container
          size="wide"
          className="relative z-10 flex min-h-[17rem] flex-col justify-end pb-16 pt-6 sm:min-h-[20rem] sm:pb-20"
        >
          <p className="kicker text-pink-soft">{kicker}</p>
          <h1 className="mt-3 max-w-4xl font-display text-milk display-hero">{word}</h1>
          {sub && (
            <p className="mt-4 max-w-2xl font-display text-xl leading-snug text-milk/90 text-pretty sm:text-2xl">
              {sub}
            </p>
          )}
          {lede && (
            <p className="mt-3 max-w-xl text-base leading-relaxed text-milk/75 text-pretty sm:text-lg">
              {lede}
            </p>
          )}
        </Container>

        {/* Sit in the banner, behind the wave - no overflow clip on this section,
            so the spots keep their full silhouette down to the seam. */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-40" aria-hidden>
          <Blob
            shape="b"
            fill="var(--color-pink)"
            className="absolute -left-[8%] bottom-6 h-40 w-[30rem] sm:h-48 sm:w-[36rem] opacity-30"
          />
          <Blob
            shape="a"
            fill="var(--color-signal)"
            className="absolute left-[22%] bottom-5 h-36 w-[26rem] sm:h-44 sm:w-[32rem] opacity-10"
          />
          <Blob
            shape="d"
            fill="var(--color-pink-soft)"
            className="absolute -right-[6%] bottom-4 h-32 w-[22rem] opacity-70 sm:h-40 sm:w-[28rem]"
          />
        </div>

        <WaveSeam from="transparent" to={MILK} className="relative z-10" />
      </section>
    </div>
  );
}
