import Link from "next/link";
import type { Metadata } from "next";
import { HomeSmoothScroll } from "@/components/motion/home-smooth-scroll";
import { HomeHero } from "@/components/home/home-hero";
import { MastitisSummary } from "@/components/home/mastitis-summary";
import { CREAM50, INK, MILK, WaveSeam } from "@/components/site/wave-seam";
import { Container } from "@/components/ui/container";
import { SectionHeader } from "@/components/site/section-header";
import { ImpactBeats } from "@/components/home/impact-beats";
import { ParlourBeat } from "@/components/home/parlour-beat";
import { SignalBeats } from "@/components/home/signal-beats";
import { Button } from "@/components/ui/button";
import { Stagger, StaggerItem } from "@/components/motion/reveal";
import { Parallax } from "@/components/motion/parallax";
import { DbtlWheel } from "@/components/viz/dbtl-wheel";
import { IdeaZoom } from "@/components/home/idea-zoom";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: {
    absolute: "AURA - iGEM 2026",
  },
};

const DETECTION = [
  { name: "Somatic cell count (SCC)", limit: "Already widely used to monitor udder health and milk quality. When inflammation develops in the udder, the SCC generally increases as more immune cells enter the milk." },
  { name: "PCR and laboratory testing", limit: "Limitations include cost and treatment delays." },
  { name: "Pathogen-specific tests", limit: "A detection method targeting only one pathogen may not be suitable for every case." },
];

const IDEA_LINE =
  "AURA focuses on creating an easy to use diagnostic solution to help diagnosis subclinical mastitis in the dairy industry, an inline biosensor which uses FET (Field-Effect Transistor) biotechnology to detect the up-regulation of miRNA specific to subclinical mastitis.";

const IDEA_BLURB =
  "The FET surface would have a DNA catapult which has a complimentary region to the miRNA target strand, invasion region, allowing it to associate and change form in its presence. As a result, of the invasion region moving away from the biosensor surface, there is a change in the local electrical field and the FET detects this as a change in electrical current between the source and the drain.";

export default function HomePage() {
  return (
    <>
      <HomeSmoothScroll />
      <HomeHero />

      <MastitisSummary />

      <ImpactBeats />

      <WaveSeam from={MILK} to={CREAM50} />

      <section className="relative overflow-hidden bg-cream/50">
        <div className="py-20 sm:py-28">
        <Container className="relative">
          <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
            <Parallax speed={28}>
              <SectionHeader
                accent="butter"
                title="Existing monitoring, and what it already provides"
                lede="SCC is already widely used in dairy farming. The challenge is to produce a signal that could complement existing monitoring approaches rather than simply repeat what they already provide."
              />
            </Parallax>
            <Stagger className="space-y-5">
              {DETECTION.map((d, i) => (
                <StaggerItem key={d.name}>
                  <div
                    className={cn(
                      "hand flex gap-4 p-5",
                      ["bg-butter/70 -rotate-[0.6deg]", "bg-milk rotate-[0.5deg]", "bg-pink-soft/60 -rotate-[0.3deg]"][i % 3],
                    )}
                  >
                    <span className="num-pop bg-milk">{i + 1}</span>
                    <div>
                      <p className="font-display text-xl text-ink">{d.name}</p>
                      <p className="mt-1 leading-relaxed text-ink/80">{d.limit}</p>
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </Container>
        </div>
      </section>

      <WaveSeam from={CREAM50} to={INK} />

      <IdeaZoom
        title={
          <>
            What if a biosensor could detect{" "}
            <span className="text-aura">signs of the cow&apos;s response to infection</span>?
          </>
        }
        line={IDEA_LINE}
        blurb={IDEA_BLURB}
      />

      <SignalBeats />

      <WaveSeam from={MILK} to={CREAM50} />

      <section className="relative bg-cream/50">
        <DbtlWheel />
        <Container className="pb-20 sm:pb-28">
          <div className="flex justify-center">
            <Button asChild variant="outline">
              <Link href="/engineering">
                Engineering cycles <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </Container>
      </section>

      <ParlourBeat />
    </>
  );
}
