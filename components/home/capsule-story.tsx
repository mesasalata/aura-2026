"use client";

import { useId, useLayoutEffect, useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionTemplate,
  useReducedMotion,
  useMotionValueEvent,
  type MotionValue,
} from "motion/react";
import { Container } from "@/components/ui/container";
import { Blob, type BlobShape } from "@/components/viz/sketch";
import { cn } from "@/lib/utils";

/**
 * The "milk thing": four pink capsules staggered right/left on a milk page,
 * brown cow spots creeping in from the edges, and hand-drawn curly arrows
 * that draw themselves as you scroll from one capsule to the next.
 */

const STEPS = [
  {
    n: "01",
    side: "right",
    kicker: "In the pail",
    title: "Milk is quiet.",
    body: "Mastitis usually starts subclinical. The milk still looks like cream while inflammation is already writing itself into the sample.",
  },
  {
    n: "02",
    side: "left",
    kicker: "On the farm",
    title: "You pay for what you cannot see.",
    body: "Roughly one cow in three is affected. Most of the cost is lost yield, discarded milk and early culling, not the treatment invoice.",
  },
  {
    n: "03",
    side: "right",
    kicker: "In the milk line",
    title: "AURA screens the flow.",
    body: "An inline sensor is designed to check milk during milking, without turning every screen into a separate lab workflow.",
  },
  {
    n: "04",
    side: "left",
    kicker: "On the screen",
    title: "A signal becomes an alert.",
    body: "A BioFET detects a specific microRNA and sends an electronic signal to a phone or computer, flagging a cow for a closer check.",
  },
] as const;

/* Brown cow spots, anchored to the edges like the sketch. */
const SPOTS = [
  { className: "-left-16 top-8 h-56 w-56 sm:-left-12 sm:h-72 sm:w-72", fill: "#5c3d28", shape: "a" },
  { className: "-right-24 top-[34%] h-72 w-72 sm:-right-20 sm:h-96 sm:w-96", fill: "#4e3724", shape: "b" },
  { className: "-left-10 top-[56%] h-20 w-20 sm:h-24 sm:w-24", fill: "#6b4a32", shape: "c" },
] as const satisfies readonly { className: string; fill: string; shape: BlobShape }[];

export function CapsuleStory() {
  const reduce = useReducedMotion();

  return (
    <section className="relative overflow-hidden bg-milk pt-8 pb-24 sm:pt-10 sm:pb-32" aria-labelledby="capsule-story">
      {SPOTS.map((spot) => (
        <Spot key={spot.shape} {...spot} reduce={!!reduce} />
      ))}

      <Container className="relative">
        <div className="mx-auto max-w-4xl text-center">
          <h2 id="capsule-story" className="font-display display-1 text-ink text-balance">
            From quiet milk to an early alert.
          </h2>
        </div>

        <ol className="relative mx-auto mt-8 flex max-w-5xl flex-col gap-2 sm:mt-10">
          {STEPS.map((step, i) => (
            <li key={step.n} className="relative">
              <Capsule step={step} reduce={!!reduce} />
              {i < STEPS.length - 1 && (
                <CurlyArrow side={STEPS[i + 1].side} reduce={!!reduce} />
              )}
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}

function Spot({
  className,
  fill,
  shape,
  reduce,
}: {
  className: string;
  fill: string;
  shape: BlobShape;
  reduce: boolean;
}) {
  return (
    <motion.div
      aria-hidden
      className={cn("pointer-events-none absolute", className)}
      initial={reduce ? false : { scale: 0.6, opacity: 0 }}
      whileInView={{ scale: 1, opacity: 1 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
    >
      <Blob shape={shape} fill={fill} soft={false} className="h-full w-full" />
    </motion.div>
  );
}

/*
 * Four different gouache pill shapes (600×200 box, stretched to the capsule).
 * Each capsule gets its own so the column doesn't read as a repeated stamp.
 */
const BLOBS = [
  "M 18 22 C 90 4, 200 10, 320 8 C 430 6, 530 14, 582 36 C 598 62, 596 128, 568 164 C 536 194, 420 190, 320 196 C 210 202, 100 194, 40 172 C 8 154, 4 88, 18 22 Z",
  "M 22 18 C 110 2, 240 12, 360 8 C 470 4, 560 16, 586 48 C 600 86, 592 150, 552 176 C 508 198, 380 192, 260 198 C 150 204, 60 188, 24 154 C 2 128, 4 60, 22 18 Z",
  "M 16 28 C 80 6, 210 8, 340 10 C 450 12, 540 8, 580 40 C 598 72, 594 136, 560 168 C 522 196, 400 192, 280 198 C 160 204, 70 190, 28 160 C 4 138, 2 78, 16 28 Z",
  "M 20 20 C 100 6, 230 14, 350 8 C 460 4, 550 18, 584 46 C 600 80, 590 146, 554 174 C 514 198, 390 190, 270 196 C 150 202, 56 184, 22 150 C 4 124, 4 62, 20 20 Z",
] as const;

/**
 * A capsule is a flat pink shape with a hand in it: organic outline, a very
 * light wobble, a deeper shade along the bottom edge, faint grain. It wipes in
 * with a feathered edge as it scrolls into view. The copy sits on the colour.
 */
function Capsule({ step, reduce }: { step: (typeof STEPS)[number]; reduce: boolean }) {
  const right = step.side === "right";
  const idx = Number(step.n) - 1;
  const blob = BLOBS[idx % BLOBS.length];
  const uid = useId().replace(/:/g, "");
  const ref = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 94%", "start 42%"],
  });
  // Stroke sweeps in from the side the capsule hangs off; copy follows the brush.
  // Feathered edge rather than a hard clip so the paint looks like it's wetting in.
  const reveal = useTransform(scrollYProgress, [0, 0.72], [reduce ? 112 : -12, 112]);
  const fromLeft = useMotionTemplate`linear-gradient(90deg, #000 calc(${reveal}% - 12%), transparent calc(${reveal}% + 4%))`;
  const fromRight = useMotionTemplate`linear-gradient(270deg, #000 calc(${reveal}% - 12%), transparent calc(${reveal}% + 4%))`;
  const textOpacity = useTransform(scrollYProgress, [0.28, 0.8], [reduce ? 1 : 0, 1]);
  const textX = useTransform(scrollYProgress, [0.28, 0.85], [reduce ? 0 : right ? 22 : -22, 0]);

  return (
    <article
      ref={ref}
      className={cn(
        "relative isolate w-full max-w-none px-14 py-14 text-ink sm:w-[90%] sm:px-16 sm:py-16",
        right ? "ml-auto" : "mr-auto",
      )}
    >
      <div className="pointer-events-none absolute inset-0 -z-10">
        <motion.svg
          viewBox="0 0 600 200"
          preserveAspectRatio="none"
          aria-hidden
          style={{ maskImage: right ? fromRight : fromLeft, WebkitMaskImage: right ? fromRight : fromLeft }}
          className={cn("h-full w-full", right && "-scale-x-100")}
        >
          <defs>
            <filter id={`${uid}-soft`} x="-6%" y="-10%" width="112%" height="120%">
              <feTurbulence type="fractalNoise" baseFrequency="0.01 0.02" numOctaves="1" seed={idx * 7 + 3} result="n" />
              <feDisplacementMap in="SourceGraphic" in2="n" scale="2" xChannelSelector="R" yChannelSelector="G" />
            </filter>
          </defs>
          <path d={blob} fill="var(--color-pink-soft)" fillOpacity="0.7" filter={`url(#${uid}-soft)`} />
        </motion.svg>
      </div>

      <motion.div style={{ opacity: textOpacity, x: textX }}>
        <h3 className={cn("font-display display-2 text-ink text-balance", right && "text-right")}>
          {step.title}
        </h3>
        <p className={cn("mt-5 max-w-prose text-base leading-relaxed text-ink/80 sm:mt-6 sm:text-lg", right && "ml-auto text-right")}>
          {step.body}
        </p>
      </motion.div>
    </article>
  );
}

/**
 * Hand-drawn curly arrow. Starts at the edge of the capsule above, loops once,
 * lands on the capsule below. Mirrored when the next capsule sits on the right.
 * The stroke draws with scroll position, not on a timer.
 */
function CurlyArrow({ side, reduce }: { side: "left" | "right"; reduce: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 88%", "end 52%"],
  });
  const stem = useTransform(scrollYProgress, [0, 0.8], [reduce ? 1 : 0, 1]);
  const head = useTransform(scrollYProgress, [0.72, 1], [reduce ? 1 : 0, 1]);

  return (
    <div
      ref={ref}
      aria-hidden
      className={cn(
        "relative h-24 w-28 sm:h-32 sm:w-36",
        side === "left" ? "ml-[6%] sm:ml-[9%]" : "mr-[6%] ml-auto sm:mr-[9%]",
      )}
    >
      <svg
        viewBox="0 0 100 120"
        className={cn("h-full w-full overflow-visible text-[#5a3d33]", side === "right" && "-scale-x-100")}
      >
        <Draw
          d="M 82 4 C 54 -6, 28 18, 46 34 C 62 48, 70 22, 52 20 C 32 18, 26 52, 34 76 C 38 88, 40 98, 42 110"
          progress={stem}
        />
        <Draw d="M 24 92 L 42 112 L 60 94" progress={head} />
      </svg>
    </div>
  );
}

function Draw({ d, progress }: { d: string; progress: MotionValue<number> }) {
  const ref = useRef<SVGPathElement>(null);

  const apply = (p: number) => {
    if (ref.current) ref.current.style.strokeDashoffset = String(1 - p);
  };

  useLayoutEffect(() => apply(progress.get()), [progress]);
  useMotionValueEvent(progress, "change", apply);

  return (
    <path
      ref={ref}
      d={d}
      fill="none"
      stroke="currentColor"
      strokeWidth="5.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      pathLength={1}
      strokeDasharray="1"
      strokeDashoffset="1"
    />
  );
}
