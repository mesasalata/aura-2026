"use client";

import { Art } from "@/components/viz/art";
import { Blob } from "@/components/viz/sketch";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/motion/reveal";
import { Parallax } from "@/components/motion/parallax";

/**
 * Quiet problem beat: what mastitis is, with the sick-cow sprite.
 * CapsuleStory is kept but unmounted from `/` for now.
 */
export function MastitisSummary() {
  return (
    <section
      className="relative overflow-hidden bg-milk py-20 sm:py-28"
      aria-labelledby="mastitis-summary"
    >
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <Parallax speed={20}>
              <h2
                id="mastitis-summary"
                className="mt-3 font-display display-1 text-ink text-balance"
              >
                Mastitis can start before any physiological changes occur.
              </h2>
            </Parallax>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-70 text-pretty">
              When pathogens pass the teat canal, the cow&apos;s immune system sends white blood cells to
              the affected area. This immune response causes inflammation, which is a key feature of
              mastitis.
            </p>
            <p className="mt-4 max-w-xl text-lg leading-relaxed text-ink-70 text-pretty">
              In cows with subclinical mastitis, bta-miR223 exists in milk samples and can indicate
              bacterial subclinical mastitis before any physiological changes occur.
            </p>
          </Reveal>

          <Reveal className="relative flex justify-center lg:justify-end" delay={0.08}>
            <div
              aria-hidden
              className="pointer-events-none absolute left-1/2 top-1/2 h-[min(72vmin,28rem)] w-[min(72vmin,28rem)] -translate-x-1/2 -translate-y-1/2"
            >
              <Blob shape="a" fill="var(--color-pink)" className="h-full w-full opacity-[0.12]" />
            </div>
            <Art
              id="cowSick"
              size={340}
              motion="breathe"
              glow={undefined}
              decorative={false}
              alt="The same dairy cow, unwell with mastitis"
              className="relative"
            />
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
