"use client";

import { useRef } from "react";
import Link from "next/link";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  type MotionValue,
} from "motion/react";
import { BucketPour } from "@/components/viz/bucket-pour";
import { Button } from "@/components/ui/button";
import { ArrowRight, ChevronDown } from "lucide-react";

const LEDE =
  "AURA focuses on creating an easy to use diagnostic solution to help diagnose subclinical mastitis in the dairy industry.";

export function HomeHero() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  if (reduce) return <StaticHero />;

  return (
    <section ref={ref} className="section-dark relative h-[260vh]" aria-label="AURA">
      <div className="sticky top-0 h-screen overflow-hidden">
        <CinematicField progress={scrollYProgress} />
      </div>
    </section>
  );
}

function DescriptionLink({ className }: { className?: string }) {
  return (
    <Button asChild variant="pink" size="lg" className={className}>
      <Link href="/description" data-description-cta>
        Read the description <ArrowRight className="h-4 w-4" />
      </Link>
    </Button>
  );
}

function CinematicField({ progress }: { progress: MotionValue<number> }) {
  const titleY = useTransform(progress, [0, 0.14, 0.34, 1], [0, 0, -580, -580]);
  const descY = useTransform(progress, [0, 0.14, 0.34, 1], [0, 0, 620, 620]);
  const textFade = useTransform(progress, [0.42, 0.56], [1, 0]);
  const scrollHint = useTransform(progress, [0, 0.08], [1, 0]);

  return (
    <>
      <BucketPour progress={progress} />

      <motion.div
        style={{ y: titleY, opacity: textFade }}
        className="absolute inset-x-0 top-[28%] z-10 px-6 text-center sm:top-[26%]"
      >
        <h1 className="pop-text font-display text-milk text-[clamp(2.4rem,6.2vw,5.4rem)] leading-[1.02] text-balance">
          <span className="block">Milk is quiet.</span>
          <span className="block text-aura">Infection is not.</span>
        </h1>
      </motion.div>

      <motion.div
        style={{ y: descY, opacity: textFade }}
        className="absolute inset-x-0 top-[28%] z-10 flex flex-col items-center px-6 pt-[clamp(7.2rem,16.5vw,11rem)] text-center sm:top-[26%]"
      >
        <p className="hidden max-w-xl pt-5 text-base leading-relaxed text-milk/70 text-pretty min-[640px]:block sm:text-lg">
          {LEDE}
        </p>
        <div className="mt-6">
          <DescriptionLink />
        </div>
      </motion.div>

      <motion.div
        style={{ opacity: scrollHint }}
        className="pointer-events-none absolute inset-x-0 bottom-5 z-10 flex justify-center"
      >
        <span className="flex items-center gap-1 text-milk/35">
          <span className="kicker">Scroll</span>
          <ChevronDown className="h-4 w-4" />
        </span>
      </motion.div>
    </>
  );
}

function StaticHero() {
  return (
    <section className="section-dark relative overflow-hidden" aria-label="AURA">
      <div className="relative mx-auto flex min-h-[80vh] max-w-3xl flex-col items-center justify-center px-6 py-24 text-center">
        <h1 className="pop-text font-display text-milk display-hero text-balance">
          <span className="block">Milk is quiet.</span>
          <span className="block text-aura">Infection is not.</span>
        </h1>
        <p className="mt-7 max-w-xl text-lg leading-relaxed text-milk/70">{LEDE}</p>
        <div className="mt-9">
          <DescriptionLink />
        </div>
      </div>
    </section>
  );
}
