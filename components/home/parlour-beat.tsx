"use client";

import { useRef } from "react";
import Link from "next/link";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";
import { ArrowRight } from "lucide-react";
import { WAVE } from "@/components/site/wave-seam";
import { SectionHeader } from "@/components/site/section-header";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { StakeholderMap } from "@/components/viz/stakeholder-map";
import { cn } from "@/lib/utils";

/**
 * Sunset, then a milk tide with a drawn wave crest wipes over it.
 * The farms beat lives on that milk - same pin, no page cut.
 */

function useSpan(progress: MotionValue<number>, input: number[], output: number[]) {
  const i = [...input];
  const o = [...output];
  if (i[0] > 0) {
    i.unshift(0);
    o.unshift(o[0]);
  }
  if (i[i.length - 1] < 1) {
    i.push(1);
    o.push(o[o.length - 1]);
  }
  return useTransform(progress, i, o);
}

export function ParlourBeat() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const done = useMotionValue(1);
  const progress = reduce ? done : scrollYProgress;

  const enter = useSpan(progress, [0.04, 0.14], [0, 1]);
  const textY = useTransform(progress, [0, 0.55], [reduce ? 0 : 24, reduce ? 0 : -12]);
  const copyOut = useSpan(progress, [0.52, 0.66], [1, reduce ? 0 : 0]);
  const copyOpacity = useTransform([enter, copyOut], ([a, b]) => Number(a) * Number(b));
  const sunY = useTransform(progress, [0.1, 0.58], [reduce ? 36 : -8, 64]);
  const sunIn = useSpan(progress, [0.08, 0.24], [reduce ? 1 : 0, 1]);
  const sunOut = useSpan(progress, [0.56, 0.72], [1, reduce ? 0 : 0]);
  const sunOpacity = useTransform([sunIn, sunOut], ([a, b]) => Number(a) * Number(b));
  const warmIn = useSpan(progress, [0, 0.28], [reduce ? 1 : 0, 1]);
  const sunsetIn = useSpan(progress, [0.18, 0.5], [reduce ? 1 : 0, 1]);

  const lineTwo = useSpan(progress, [0.16, 0.3], [reduce ? 1 : 0, 1]);
  const lineTwoY = useTransform(progress, [0.16, 0.3], [reduce ? 0 : 16, 0]);
  const lineThree = useSpan(progress, [0.32, 0.46], [reduce ? 1 : 0, 1]);
  const lineThreeY = useTransform(progress, [0.32, 0.46], [reduce ? 0 : 16, 0]);

  const duskH = useTransform(progress, [0.16, 0.5, 0.62], [reduce ? 8 : 4, 26, 8]);
  const dusk = useTransform(duskH, (v) => `${v}%`);
  const duskIn = useSpan(progress, [0.14, 0.3], [reduce ? 0 : 0, 1]);
  const duskOut = useSpan(progress, [0.54, 0.68], [1, 0]);
  const duskOpacity = useTransform([duskIn, duskOut], ([a, b]) => Number(a) * Number(b));
  const duskFill = useTransform(progress, [0, 0.18, 0.5, 1], ["#e8a078", "#e8a078", "#c24e42", "#c24e42"]);
  const duskBg = useTransform(duskFill, (c) => `linear-gradient(180deg, transparent 0%, ${c} 42%, ${c} 100%)`);

  const tideH = useTransform(progress, [0.54, 0.78], [reduce ? 100 : 0, 100]);
  const tide = useTransform(tideH, (v) => `${v}%`);
  const farmsIn = useSpan(progress, [0.7, 0.84], [reduce ? 1 : 0, 1]);
  const farmsY = useTransform(progress, [0.7, 0.84], [reduce ? 0 : 36, 0]);

  return (
    <section
      ref={ref}
      className={cn("relative bg-milk", reduce ? "min-h-svh" : "h-[420vh]")}
      aria-label="Every morning, milk leaves the parlour"
    >
      <div className={cn("top-0 h-svh overflow-hidden", reduce ? "relative" : "sticky")}>
        <div aria-hidden className="absolute inset-0 bg-cream/50" />
        <motion.div
          aria-hidden
          style={{
            opacity: warmIn,
            background: "linear-gradient(180deg, #f4e4cc 0%, #ffd6a8 48%, #f5b888 100%)",
          }}
          className="absolute inset-0"
        />
        <motion.div
          aria-hidden
          style={{
            opacity: sunsetIn,
            background: "linear-gradient(180deg, #ffd6a8 0%, #ffb070 42%, #f07858 78%, #d45a48 100%)",
          }}
          className="absolute inset-0"
        />

        <motion.div
          aria-hidden
          style={{ y: sunY, opacity: sunOpacity }}
          className="pointer-events-none absolute left-1/2 top-[58%] -translate-x-1/2 -translate-y-1/2"
        >
          <div
            className="h-[88vmin] w-[88vmin] sm:h-[100vmin] sm:w-[100vmin] rounded-full"
            style={{
              background:
                "radial-gradient(circle at 50% 55%, #ffb35a 0%, #ff8c4a 16%, rgba(255, 120, 70, 0.42) 34%, rgba(255, 100, 60, 0.16) 52%, transparent 70%)",
            }}
          />
        </motion.div>

        <motion.div
          style={{ height: dusk, opacity: duskOpacity, background: duskBg }}
          className="pointer-events-none absolute inset-x-0 bottom-0"
        />

        <motion.div
          style={{ opacity: copyOpacity, y: textY }}
          className="relative z-10 mx-auto flex h-full w-full max-w-4xl flex-col items-center justify-center px-6 text-center"
        >
          <p className="font-display text-[clamp(2.6rem,6.2vw,5.2rem)] leading-[1.02] tracking-tight text-ink">
            Every morning
          </p>
          <motion.p
            style={{ opacity: lineTwo, y: lineTwoY }}
            className="mt-3 font-display text-[clamp(1.7rem,3.6vw,2.8rem)] leading-[1.15] tracking-tight text-ink"
          >
            milk leaves the parlour
          </motion.p>
          <motion.p
            style={{ opacity: lineThree, y: lineThreeY }}
            className="mt-3 font-display text-[clamp(1.7rem,3.6vw,2.8rem)] leading-[1.15] tracking-tight text-ink"
          >
            carrying a{" "}
            <StoryWord progress={progress} reduce={!!reduce} />{" "}
            no one can see yet.
          </motion.p>
        </motion.div>

        <motion.div
          style={{ height: tide }}
          className="absolute inset-x-0 bottom-0 z-20 overflow-hidden"
        >
          <svg
            aria-hidden
            viewBox="0 0 2880 80"
            preserveAspectRatio="none"
            className={cn(
              "absolute inset-x-0 top-0 h-16 w-[200%] sm:h-20",
              !reduce && "animate-milk-wave",
            )}
          >
            <path d={WAVE} fill="color-mix(in srgb, var(--color-cream) 40%, var(--color-milk))" />
            <path d={WAVE} fill="color-mix(in srgb, var(--color-cream) 40%, var(--color-milk))" transform="translate(1440 0)" />
          </svg>
          <svg
            aria-hidden
            viewBox="0 0 2880 80"
            preserveAspectRatio="none"
            className={cn(
              "absolute inset-x-0 top-3 h-16 w-[200%] sm:top-4 sm:h-20",
              !reduce && "animate-milk-wave",
            )}
            style={{ animationDelay: "-1.4s" }}
          >
            <path d={WAVE} fill="var(--color-milk)" />
            <path d={WAVE} fill="var(--color-milk)" transform="translate(1440 0)" />
          </svg>
          <div className="absolute inset-x-0 top-10 bottom-0 bg-milk sm:top-12" />

          <motion.div
            style={{ opacity: farmsIn, y: farmsY }}
            className="relative z-10 flex h-full items-center overflow-y-auto py-20"
          >
            <Container className="w-full">
              <SectionHeader
                accent="pink"
                title="Designed with farms, not just labs"
                lede="We spoke with farmers, vets, processors, regulators and consumers - and let what we heard change the design."
              />
              <div className="mt-8">
                <StakeholderMap />
              </div>
              <div className="mt-8">
                <Button asChild variant="pink">
                  <Link href="/human-practices">
                    How they shaped AURA <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </Container>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

function StoryWord({ progress, reduce }: { progress: MotionValue<number>; reduce: boolean }) {
  const tint = useTransform(progress, [0.44, 0.56], [reduce ? 1 : 0, 1]);
  const color = useTransform(tint, (t) => `color-mix(in srgb, #fff5e8 ${Math.round(t * 88)}%, var(--color-ink))`);

  return (
    <motion.span style={{ color }} className="italic">
      story
    </motion.span>
  );
}
