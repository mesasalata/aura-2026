"use client";

import { useRef } from "react";
import {
  motion,
  useMotionValue,
  useScroll,
  useTransform,
  useReducedMotion,
  type MotionValue,
} from "motion/react";
import { CountUp } from "@/components/motion/count-up";
import { PlungeChart } from "@/components/viz/plunge-chart";
import { HerdField, HERD_TOTAL, HERD_FILL_IN, HERD_FILL_OUT } from "@/components/viz/herd-field";
import { PailSplit } from "@/components/viz/pail-split";
import { Blob, type BlobShape } from "@/components/viz/sketch";
import { CashBurst } from "@/components/home/cash-burst";
import { CREAM50, MILK, WaveSeam } from "@/components/site/wave-seam";
import { ACCENT_HEX } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import "@/app/doodad-home.css";

/* ------------------------------------------------------------------ stage */

type BeatProps = {
  index: string;
  kicker: string;
  side: "left" | "right";
  accent: string;
  tone?: "milk" | "cream";
  /** Which flat blob sits behind the visual. */
  wash?: BlobShape;
  /** Scroll length of the pin. Longer = slower beat. */
  length?: string;
  text: (p: MotionValue<number>) => React.ReactNode;
  visual: (p: MotionValue<number>) => React.ReactNode;
  visualClassName?: string;
};

/**
 * One full-screen, scroll-pinned beat. The stage is sticky for the whole
 * section; every layer moves at its own rate off the same progress value so
 * the number, the picture and the wash separate in depth as you scroll.
 * `prefers-reduced-motion` renders the end state, unpinned.
 */
function Beat({ index, kicker, side, accent, tone = "milk", wash = "a", length = "h-[150vh]", text, visual, visualClassName }: BeatProps) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const done = useMotionValue(1);
  const progress = reduce ? done : scrollYProgress;

  const enter = useTransform(progress, [0, 0.1, 0.92, 1], [0, 1, 1, 1]);
  const washY = useTransform(progress, [0, 1], [reduce ? 0 : 60, reduce ? 0 : -60]);
  const visualY = useTransform(progress, [0, 1], [reduce ? 0 : 120, reduce ? 0 : -90]);
  const visualScale = useTransform(progress, [0, 0.35, 1], [reduce ? 1 : 0.9, 1, 1]);
  const textY = useTransform(progress, [0, 1], [reduce ? 0 : 70, reduce ? 0 : -50]);
  const textX = useTransform(progress, [0, 0.3], [reduce ? 0 : side === "left" ? -40 : 40, 0]);
  return (
    <section
      ref={ref}
      className={cn("relative", reduce ? "min-h-svh" : length, tone === "cream" ? "bg-cream/50" : "bg-milk")}
      aria-label={kicker}
    >
      <div className={cn("top-0 h-svh overflow-hidden", reduce ? "relative" : "sticky")}>
        {/* flat colour shape behind the picture - same family as the cow spots, not a blur */}
        <motion.div
          aria-hidden
          style={{ y: washY }}
          className={cn(
            "pointer-events-none absolute top-1/2 h-[88vmin] w-[88vmin] -translate-y-1/2",
            side === "left" ? "right-[-14vmin]" : "left-[-14vmin]",
          )}
        >
          <Blob shape={wash} fill={accent} className="h-full w-full opacity-[0.11]" />
        </motion.div>

        <motion.div style={{ opacity: enter }} className="relative mx-auto flex h-full w-full max-w-7xl flex-col px-5 pt-16 pb-6 sm:px-8 sm:pt-20 sm:pb-10">
          <div className="grid flex-1 grid-rows-[auto_minmax(0,1fr)] items-center gap-4 max-lg:content-start lg:grid-cols-2 lg:grid-rows-1 lg:gap-12">
            <motion.div
              style={{ y: textY, x: textX }}
              className={cn("relative max-lg:pt-2", side === "left" ? "lg:order-1" : "lg:order-2 lg:justify-self-end")}
            >
              {text(progress)}
            </motion.div>

            <motion.div
              style={{ y: visualY, scale: visualScale }}
              className={cn(
                "relative flex min-h-0 w-full items-center justify-center max-lg:max-h-[42svh] max-lg:self-end max-lg:[&>*]:max-h-full",
                side === "left" ? "lg:order-2" : "lg:order-1",
                visualClassName,
              )}
            >
              {visual(progress)}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function Big({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("font-display text-[clamp(3.6rem,11.5vw,10.5rem)] leading-[0.92] tracking-[-0.045em] text-ink", className)}>
      {children}
    </div>
  );
}

function Copy({ label, sub }: { label: string; sub: string }) {
  return (
    <>
      <p className="mt-4 text-xl font-medium text-ink sm:mt-5 sm:text-2xl">{label}</p>
      <p className="mt-1.5 max-w-md text-[0.95rem] leading-relaxed text-ink-70 sm:mt-2 sm:text-lg">{sub}</p>
    </>
  );
}

/* ------------------------------------------------------------------ beats */

/** Intro pin - “very loud bill”. */
export function ImpactIntroBeat() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const done = useMotionValue(1);
  const progress = reduce ? done : scrollYProgress;
  const enter = useTransform(progress, [0, 0.12], [0, 1]);
  const textY = useTransform(progress, [0, 1], [reduce ? 0 : 36, reduce ? 0 : -28]);
  const washY = useTransform(progress, [0, 1], [reduce ? 0 : 40, reduce ? 0 : -40]);

  return (
    <section
      ref={ref}
      className={cn("relative bg-milk", reduce ? "min-h-svh" : "h-[190vh]")}
      aria-label="A quiet problem with a very loud bill"
    >
      <div className={cn("top-0 h-svh overflow-hidden", reduce ? "relative" : "sticky")}>
        <motion.div
          aria-hidden
          style={{ y: washY }}
          className="pointer-events-none absolute left-1/2 top-1/2 h-[90vmin] w-[90vmin] -translate-x-1/2 -translate-y-1/2"
        >
          <Blob shape="b" fill={ACCENT_HEX.coral} className="h-full w-full opacity-[0.12]" />
        </motion.div>
        <motion.div
          style={{ opacity: enter, y: textY }}
          className="relative z-10 mx-auto grid h-full w-full max-w-6xl grid-cols-1 items-center px-5 sm:px-8 lg:grid-cols-[minmax(7rem,1fr)_minmax(0,36rem)_minmax(7rem,1fr)] lg:gap-3"
        >
          <div className="relative hidden h-[70%] lg:block">
            <CashBurst progress={progress} side="left" />
          </div>
          <div className="text-center">
            <p className="font-display text-[clamp(2.4rem,5.6vw,4.6rem)] leading-[1.06] tracking-tight text-ink text-balance">
              A quiet problem with a very loud bill
            </p>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-ink-70 text-pretty">
              Mastitis is one of the most economically significant diseases in dairy — and most of the
              cost never shows up on a treatment invoice. Three numbers, one herd.
            </p>
          </div>
          <div className="relative hidden h-[70%] lg:block">
            <CashBurst progress={progress} side="right" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/** €30B plunge chart beat. */
export function ImpactBillBeat() {
  return (
    <Beat
      index="01"
      kicker="The bill"
      side="left"
      accent={ACCENT_HEX.coral}
      wash="b"
      text={(p) => <BillCopy progress={p} />}
      visual={(p) => <PlungeChart progress={p} className="w-full max-w-176" />}
    />
  );
}

/**
 * The herd beat runs two chapters over one long pin: first every third cow
 * flushes pink (1 in 3 at any time), then the marking continues to roughly
 * half the herd (47–65% over a year).
 */
export function ImpactHerdBeat() {
  return (
    <Beat
      index="02"
      kicker="The herd"
      side="right"
      accent={ACCENT_HEX.pink}
      tone="cream"
      length="h-[420vh]"
      text={(p) => <HerdCopy progress={p} />}
      // 6×4 herd ≈ 3:2, so 40svh tall ⇒ ~60svh wide on small screens
      visual={(p) => <HerdField progress={p} className="w-full max-w-200 max-lg:w-[min(100%,60svh)]" />}
    />
  );
}

/** &lt;15% treatment slice beat. */
export function ImpactTreatmentBeat() {
  return (
    <Beat
      index="03"
      kicker="Where the money goes"
      side="left"
      accent={ACCENT_HEX.signal}
      wash="d"
      text={(p) => <TreatmentCopy progress={p} />}
      visual={(p) => <PailSplit progress={p} className="w-full max-w-152" />}
    />
  );
}

/**
 * Full economics chapter for the live homepage.
 * `through="herd"` stops after the first three beats (intro + bill + herd).
 */
export function ImpactBeats({ through = "treatment" }: { through?: "herd" | "treatment" }) {
  return (
    <div className="relative">
      <ImpactIntroBeat />
      <ImpactBillBeat />
      <WaveSeam from={MILK} to={CREAM50} />
      <ImpactHerdBeat />
      {through === "treatment" && (
        <>
          <WaveSeam from={CREAM50} to={MILK} />
          <ImpactTreatmentBeat />
        </>
      )}
    </div>
  );
}

function BillCopy({ progress }: { progress: MotionValue<number> }) {
  const count = useTransform(progress, [0.12, 0.62], [0, 1]);
  return (
    <>
      <p className="doodad-hand-kicker">the bill</p>
      <Big>
        <CountUp to={30} prefix="€" suffix="B" progress={count} />
      </Big>
      <Copy
        label="Lost every year"
        sub="Estimated global economic burden of mastitis on the dairy sector - and most of it never shows up on a treatment invoice."
      />
    </>
  );
}

function TreatmentCopy({ progress }: { progress: MotionValue<number> }) {
  const count = useTransform(progress, [0.12, 0.6], [0, 1]);
  return (
    <>
      <Big>
        &lt;<CountUp to={15} suffix="%" progress={count} />
      </Big>
      <Copy
        label="Is the treatment itself"
        sub="Direct treatment is a thin slice of the total. The rest hides in lost yield, discarded milk and cows culled early - which is why early detection pays."
      />
    </>
  );
}

function HerdCopy({ progress }: { progress: MotionValue<number> }) {
  const reduce = useReducedMotion();
  /* opacity ranges span the full 0–1 on purpose: motion hands scroll-linked
     opacity to a native timeline and interpolates toward the SSR value outside
     the given range instead of clamping, which fades chapters back out */
  const one = useTransform(progress, [0, 0.08, 0.5, 0.56, 1], [0, 1, 1, 0, 0]);
  const oneY = useTransform(progress, [0.5, 0.56], [0, reduce ? 0 : -24]);
  const two = useTransform(progress, [0, 0.56, 0.64, 1], [reduce ? 1 : 0, reduce ? 1 : 0, 1, 1]);
  const twoY = useTransform(progress, [0.56, 0.64], [reduce ? 0 : 24, 0]);
  const countTwo = useTransform(progress, [0.6, 0.86], [0, 1]);
  const marked = useTransform(progress, HERD_FILL_IN, HERD_FILL_OUT);
  const markedText = useTransform(marked, (m) => String(Math.round(m)));

  return (
    <div className="relative">
      {/* both chapters share one grid cell so the counter below never collides */}
      <div className="grid">
        <motion.div style={{ opacity: one, y: oneY }} className={cn("[grid-area:1/1]", reduce && "invisible")} aria-hidden={reduce ? true : undefined}>
          <Big>1 in 3</Big>
          <Copy
            label="Cows affected at any time"
            sub="Roughly one dairy cow in three is carrying mastitis right now - most of them without a single visible sign in the milk."
          />
        </motion.div>

        <motion.div style={{ opacity: two, y: twoY }} className="[grid-area:1/1]">
          <Big className="whitespace-nowrap text-[clamp(3.5rem,8.8vw,8rem)]">
            47–<CountUp from={47} to={65} progress={countTwo} suffix="%" />
          </Big>
          <Copy
            label="Infected over a year"
            sub="Reported herd-level incidence across dairy systems and regions. Same herd, longer window - the marking keeps going."
          />
        </motion.div>
      </div>

      <p className="mt-6 flex items-center gap-2 text-sm text-ink-55" aria-live="off">
        <Blob shape="c" fill="var(--color-pink)" className="h-3.5 w-3.5" />
        <motion.span className="font-display text-base text-ink">{markedText}</motion.span>
        <span>of {HERD_TOTAL} cows marked</span>
      </p>
    </div>
  );
}
