import Link from "next/link";
import { HomeHero } from "@/components/home/home-hero";
import { CowBeat } from "@/components/home/cow-beat";
import { CREAM50, INK, MILK, WaveSeam } from "@/components/site/wave-seam";
import { Container } from "@/components/ui/container";
import { SectionHeader } from "@/components/site/section-header";
import { ImpactBeats } from "@/components/home/impact-beats";
import { ParlourBeat } from "@/components/home/parlour-beat";
import { SignalBeats } from "@/components/home/signal-beats";
import { Button } from "@/components/ui/button";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";
import { Parallax } from "@/components/motion/parallax";
import { DbtlWheel } from "@/components/viz/dbtl-wheel";
import { IdeaCast } from "@/components/viz/art-cast";
import { ArrowRight } from "lucide-react";

const DETECTION = [
  { name: "Somatic cell count (SCC)", limit: "Reflects inflammation, but often measured periodically - a spike can be missed between tests." },
  { name: "Electrical conductivity", limit: "Cheap and fast, yet noisy and affected by many non-mastitis factors." },
  { name: "Bacterial culture", limit: "Informative for the pathogen, but slow - results can take a day or more." },
  { name: "PCR / molecular", limit: "Sensitive and specific, but equipment-heavy and hard to deploy on every farm." },
];

export default function Home() {
  return (
    <>
      <HomeHero />

      <CowBeat />

      <ImpactBeats />

      <WaveSeam from={MILK} to={CREAM50} />

      <section className="doodad-detection relative overflow-hidden bg-cream/50">
        <div className="py-20 sm:py-28">
        <Container className="relative">
          <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
            <Parallax speed={28}>
              <SectionHeader
                accent="butter"
                title="Good tools - but rarely early, cheap, and in the line"
                lede="Culture and PCR are informative but not the everyday parlour test. Conversations with farmers ruled them out and pointed us at an inline siphon."
              />
            </Parallax>
            <Stagger className="space-y-3">
              <p className="doodad-home-fig">
                <em>fig. 1</em> - what farms try today
              </p>
              {DETECTION.map((d) => (
                <StaggerItem key={d.name}>
                  <div className="border-b border-ink/10 py-4">
                    <p className="font-medium text-ink">{d.name}</p>
                    <p className="mt-1 text-sm leading-relaxed text-ink-70">{d.limit}</p>
                  </div>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </Container>
        </div>
      </section>

      <WaveSeam from={CREAM50} to={INK} />

      <section className="section-dark relative overflow-hidden">
        <Container size="wide" className="relative py-24">
          <div className="flex items-center gap-10 lg:gap-16">
            <Reveal className="min-w-0 flex-1">
              <Parallax speed={30}>
                <p className="font-display text-[clamp(1.55rem,2.4vw+0.5rem,2.55rem)] leading-[1.22] tracking-tight text-milk">
                  What if each milking siphoned a sip of milk onto an{" "}
                  <span className="text-aura">FET that listens for miR-223</span>?
                </p>
              </Parallax>
              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-milk/70">
                AURA is a flag for subclinical bacterial mastitis - not a replacement for veterinary
                diagnosis.
              </p>
              <div className="mt-8">
                <Button asChild variant="signal">
                  <Link href="/description">
                    Read the approach <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </Reveal>
            <Reveal className="relative hidden shrink-0 lg:block">
              <IdeaCast />
            </Reveal>
          </div>
        </Container>
      </section>

      <WaveSeam from={INK} to={MILK} />

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
