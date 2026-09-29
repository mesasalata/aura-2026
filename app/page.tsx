import Link from "next/link";
import type { Metadata } from "next";
import { HomeSmoothScroll } from "@/components/motion/home-smooth-scroll";
import { HomeTestHero } from "@/components/home-test/home-test-hero";
import { ImpactBeats } from "@/components/home/impact-beats";
import { HOME_TEST_SECTIONS } from "@/components/home-test/copy";
import { CREAM50, INK, MILK, WaveSeam } from "@/components/site/wave-seam";
import { Container } from "@/components/ui/container";
import { SectionHeader } from "@/components/site/section-header";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";
import { Parallax } from "@/components/motion/parallax";
import { Button } from "@/components/ui/button";
import { BiosensorDiagram } from "@/components/viz/biosensor-diagram";
import { FarmToLabPipeline } from "@/components/viz/farm-to-lab";
import { DbtlWheel } from "@/components/viz/dbtl-wheel";
import { IdeaCast } from "@/components/viz/art-cast";
import { Blob, BLOB, SOFT_ID } from "@/components/viz/sketch";
import {
  Asterisk,
  DoodadFrame,
  HandCaption,
  PaperCorner,
  RubberStamp,
  Staple,
  Tape,
} from "@/components/viz/doodads";
import { ArrowRight } from "lucide-react";
import "@/app/doodad-home.css";
import "@/app/doodad-viz.css";

export const metadata: Metadata = {
  title: "Home (test)",
  description:
    "Test homepage composed one-to-one from assets/keep/project-description.md.",
  robots: { index: false, follow: false },
};

/** Second paragraph of design process - italicize the MD *and*. */
function DesignProcessBody({ text }: { text: string }) {
  const marker = "earlier and more specific";
  const i = text.indexOf(marker);
  if (i < 0) return <>{text}</>;
  return (
    <>
      {text.slice(0, i)}
      earlier <em>and</em> more specific
      {text.slice(i + marker.length)}
    </>
  );
}

function MilkRingMark() {
  return (
    <div className="doodad-milk-ring" aria-hidden>
      <svg viewBox="0 0 100 100">
        <path
          d={BLOB.ring}
          fill="none"
          stroke="#8a6a4a"
          strokeWidth="8"
          strokeOpacity="0.22"
          filter={`url(#${SOFT_ID})`}
        />
        <path
          d={BLOB.ring}
          fill="none"
          stroke="#5a3d33"
          strokeWidth="2.4"
          strokeOpacity="0.12"
          transform="translate(10 9) scale(0.8)"
          filter={`url(#${SOFT_ID})`}
        />
      </svg>
    </div>
  );
}

export default function HomeTestPage() {
  const [what, decides, parlour, process] = HOME_TEST_SECTIONS;
  const [auraLead, mirna, fet, electrodes] = what.paragraphs;
  const [decideCopy] = decides.paragraphs;
  const [parlourCopy] = parlour.paragraphs;
  const [farmFirst, biologySide] = process.paragraphs;

  return (
    <>
      <HomeSmoothScroll />
      <HomeTestHero />

      <ImpactBeats through="herd" />

      <section id={what.id} className="relative overflow-hidden bg-cream/50">
        <Blob
          shape="b"
          fill="#eadfcb"
          className="pointer-events-none absolute -right-24 top-16 h-72 w-72 opacity-80"
        />
        <div className="py-20 sm:py-28">
          <Container className="relative">
            <Parallax speed={22}>
              <p className="doodad-hand-kicker">the brief</p>
              <SectionHeader accent={what.accent} kicker={what.kicker} title={what.title} />
            </Parallax>

            {/* Lead - full width, punchline swoosh */}
            <Reveal className="mt-10 max-w-3xl">
              <p className="text-xl leading-relaxed text-ink sm:text-2xl sm:leading-snug">
                {auraLead.slice(0, auraLead.indexOf("Our tool is an"))}
                <span className="doodad-swoosh">Our tool is an inline biosensor</span>
                {auraLead.slice(auraLead.indexOf("Our tool is an") + "Our tool is an inline biosensor".length)}
              </p>
            </Reveal>

            {/* miR-223 - scrap note + body */}
            <div className="mt-16 grid gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:items-start">
              <Reveal>
                <DoodadFrame className="relative max-w-sm rotate-[-1.5deg] bg-cream/70 px-5 py-6 sm:px-6 sm:py-7">
                  <Tape className="doodad-tape--pail -top-2! left-6!" />
                  <Staple className="doodad-staple--strip top-3! right-4! left-auto!" />
                  <HandCaption>bta-miR-223</HandCaption>
                  <p className="mt-3 font-display text-2xl leading-tight text-ink">
                    A molecule in the milk - before the udder looks wrong.
                  </p>
                  <Asterisk className="doodad-asterisk--inline mt-4" />
                </DoodadFrame>
              </Reveal>
              <Stagger className="space-y-4">
                <StaggerItem>
                  <p className="text-lg leading-relaxed text-ink-70">{mirna}</p>
                </StaggerItem>
              </Stagger>
            </div>

            {/* FET - offset figure + copy */}
            <div className="mt-20">
              <Reveal>
                <p className="doodad-home-fig mb-4">
                  <em>fig. 1</em> - DNA catapult on an FET surface
                </p>
                <BiosensorDiagram />
              </Reveal>
              <Reveal className="mx-auto mt-10 max-w-3xl">
                <p className="text-lg leading-relaxed text-ink-70">{fet}</p>
              </Reveal>
            </div>

            {/* Electrodes - cream band with corner + stamp */}
            <Reveal className="relative mt-16">
              <DoodadFrame className="overflow-hidden bg-cream/55 px-6 py-10 sm:px-10 sm:py-12">
                <PaperCorner className="doodad-corner--tr" />
                <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-12">
                  <div className="relative shrink-0 pt-2 lg:w-44">
                    <RubberStamp className="relative! top-auto! left-auto!">calibrate</RubberStamp>
                    <p className="doodad-hand-kicker mt-3">before the chamber</p>
                  </div>
                  <p className="max-w-2xl text-lg leading-relaxed text-ink-70">{electrodes}</p>
                </div>
              </DoodadFrame>
            </Reveal>
          </Container>
        </div>
      </section>

      <WaveSeam from={CREAM50} to={INK} />

      {/* -- How the model decides -- */}
      <section id={decides.id} className="section-dark relative overflow-hidden">
        <Container size="wide" className="relative py-24">
          <div className="flex items-center gap-10 lg:gap-16">
            <Reveal className="min-w-0 flex-1">
              <Parallax speed={28}>
                <SectionHeader
                  accent={decides.accent}
                  kicker={decides.kicker}
                  title={decides.title}
                  onDark
                />
              </Parallax>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <RubberStamp className="relative! top-auto! left-auto! opacity-90">a flag</RubberStamp>
                <HandCaption className="text-milk/55!">not a courtroom diagnosis</HandCaption>
              </div>

              <p className="mt-8 max-w-2xl text-lg leading-relaxed text-milk/70">{decideCopy}</p>

              <div className="mt-8">
                <Button asChild variant="signal">
                  <Link href="/model">
                    Model page <ArrowRight className="h-4 w-4" />
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

      <WaveSeam from={INK} to={CREAM50} />

      {/* -- In the parlour -- */}
      <section id={parlour.id} className="doodad-detection relative overflow-hidden bg-cream/50">
        <div className="py-20 sm:py-28">
          <Container className="relative">
            <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
              <Parallax speed={24}>
                <p className="doodad-hand-kicker">every milking</p>
                <SectionHeader
                  accent={parlour.accent}
                  kicker={parlour.kicker}
                  title={parlour.title}
                />
              </Parallax>
              <Reveal className="relative hidden h-10 w-28 sm:block">
                <RubberStamp className="relative! top-auto! left-auto!">inline</RubberStamp>
              </Reveal>
            </div>

            <Reveal className="mt-12">
              <p className="doodad-home-fig mb-4">
                <em>fig. 2</em> - farm to readout
              </p>
              <FarmToLabPipeline />
            </Reveal>

            <Reveal className="mx-auto mt-12 max-w-3xl">
              <div className="relative">
                <MilkRingMark />
                <p className="relative text-lg leading-relaxed text-ink-70">{parlourCopy}</p>
              </div>
            </Reveal>
          </Container>
        </div>
      </section>

      <WaveSeam from={CREAM50} to={MILK} />

      {/* -- Overview of the design process -- */}
      <section id={process.id} className="relative bg-milk">
        <Blob
          shape="a"
          fill="#f09bb4"
          className="pointer-events-none absolute -left-20 top-24 h-56 w-56 opacity-25"
        />
        <div className="pt-20 sm:pt-28">
          <Container>
            <SectionHeader
              accent={process.accent}
              kicker={process.kicker}
              title={process.title}
            />

            <div className="mt-12 grid gap-10 lg:grid-cols-2 lg:gap-14">
              <Reveal>
                <DoodadFrame className="relative h-full bg-cream/40 px-6 py-8 sm:px-8">
                  <Tape className="doodad-tape--pail -top-2! left-8!" />
                  <RubberStamp className="relative! top-auto! left-auto!">farm first</RubberStamp>
                  <p className="mt-6 text-lg leading-relaxed text-ink-70">{farmFirst}</p>
                </DoodadFrame>
              </Reveal>
              <Reveal delay={0.08}>
                <DoodadFrame className="relative h-full rotate-[0.6deg] bg-cream/40 px-6 py-8 sm:px-8">
                  <PaperCorner className="doodad-corner--tr" />
                  <HandCaption>biology · engineering · HP</HandCaption>
                  <p className="mt-6 text-lg leading-relaxed text-ink-70">
                    <DesignProcessBody text={biologySide} />
                  </p>
                </DoodadFrame>
              </Reveal>
            </div>
          </Container>
        </div>
        <DbtlWheel />
        <Container className="pb-20 sm:pb-28">
          <div className="flex flex-wrap justify-center gap-3">
            <Button asChild variant="outline">
              <Link href="/engineering">
                Engineering cycles <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/integrated-human-practices">
                Integrated Human Practices <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </Container>
      </section>
    </>
  );
}
