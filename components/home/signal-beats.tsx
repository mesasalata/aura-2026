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
import { Blob, LINE, type BlobShape } from "@/components/viz/sketch";
import { cn } from "@/lib/utils";
import { SiphonBeat } from "@/components/home/siphon-beat";

/* ------------------------------------------------------------------ *
 * SignalBeats - how a milk sample becomes a readable result, as one
 * long scroll-pinned stage. A current readout stays on screen through four
 * chapters (input, recognition, transduction, output): the baseline draws,
 * miR-223 binds, the current steps, and a no-target control stays flat.
 * Same layout vocabulary as the impact beats.
 * ------------------------------------------------------------------ */

const INK = LINE;

type Stage = {
  index: string;
  label: string;
  tag: string;
  desc: string;
  accent: string;
  wash: BlobShape;
  /** [fade in start, fully in, hold until, faded out] */
  window: [number, number, number, number];
};

const STAGES: Stage[] = [
  {
    index: "01",
    label: "Input",
    tag: "Milk sample loaded",
    desc: "During each milking session a small sample of the collected milk is siphoned to a smaller sampling chamber. In cows with subclinical mastitis, bta-miR223 exists in the milk.",
    accent: "var(--color-orange)",
    wash: "b",
    window: [0, 0.05, 0.21, 0.26],
  },
  {
    index: "02",
    label: "Recognition",
    tag: "Catapult binds miR-223",
    desc: "A DNA catapult on the FET surface has an invasion region complementary to miR-223. When the miRNA associates, the stem opens - a shape change, not a colour.",
    accent: "var(--color-signal)",
    wash: "a",
    window: [0.26, 0.31, 0.46, 0.51],
  },
  {
    index: "03",
    label: "Transduction",
    tag: "Current changes",
    desc: "As the invasion region moves away from the biosensor surface, the local electrical field changes and the FET detects this as a change in electrical current between the source and the drain. Reference electrodes placed before the sampling chamber register ionic activity, helping to offset highly ionic conditions and reduce the probability of false results.",
    accent: "var(--color-butter)",
    wash: "d",
    window: [0.51, 0.56, 0.71, 0.76],
  },
  {
    index: "04",
    label: "Output",
    tag: "Current changes",
    desc: "As the invasion region moves away from the biosensor surface, the local electrical field changes, and the FET detects this as a change in electrical current between the source and the drain.",
    accent: "var(--color-pink)",
    wash: "a",
    window: [0.76, 0.81, 1, 1],
  },
];

const LAST = STAGES.length - 1;

/**
 * Scroll-linked `opacity` on HTML elements is handed to a native ViewTimeline
 * animation by motion, which uses the input range verbatim as keyframe
 * offsets - outside that range the browser falls back to the element's inline
 * value instead of clamping. Pad every range to [0, 1] so the ends hold.
 */
function useSpan<T extends number | string>(progress: MotionValue<number>, input: number[], output: T[]) {
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

/* --------------------------------------------------------- the readout */

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
/** 0→1 across [a, b], clamped. Function transforms are not handed to native timelines. */
const useRamp = (p: MotionValue<number>, a: number, b: number) => useTransform(p, (v) => clamp01((v - a) / (b - a)));

const BASE_Y = 300;
const STEP_Y = 150;
const BIND_X = 330;
const END_X = 560;
/* the main trace: flat until miR-223 binds, then the current steps */
const TRACE = `M 70 ${BASE_Y} L ${BIND_X} ${BASE_Y} C ${BIND_X + 34} ${BASE_Y}, ${BIND_X + 26} ${STEP_Y}, ${BIND_X + 60} ${STEP_Y} L ${END_X} ${STEP_Y}`;
const TRACE_FLAT_SHARE = (BIND_X - 70) / (BIND_X - 70 + 170 + (END_X - BIND_X - 60));

/**
 * A current readout that follows the chapters: the baseline draws while the
 * sample is loaded, miR-223 binds at the marker, the current steps, and the
 * no-target control stays flat beside it. The signal is a current, never a colour.
 */
function CurrentReadout({ progress, className }: { progress: MotionValue<number>; className?: string }) {
  const base = useRamp(progress, 0.04, 0.22);
  const bind = useRamp(progress, 0.3, 0.44);
  const step = useRamp(progress, 0.55, 0.7);
  const control = useRamp(progress, 0.8, 0.92);
  const trace = useTransform(() => base.get() * TRACE_FLAT_SHARE + step.get() * (1 - TRACE_FLAT_SHARE));
  const dot = useTransform(bind, (t) => {
    const k = clamp01(t / 0.45);
    return k < 0.7 ? (k / 0.7) * 1.25 : 1.25 - 0.25 * ((k - 0.7) / 0.3);
  });
  const pulse = useTransform(bind, (t) => 1 + 1.8 * clamp01((t - 0.4) / 0.6));
  const pulseOpacity = useTransform(bind, (t) => (t < 0.4 || t >= 1 ? 0 : 1 - (t - 0.4) / 0.6));
  const marker = useTransform(bind, (t) => clamp01((t - 0.7) / 0.3));
  const stepLabel = useTransform(step, (t) => clamp01((t - 0.6) / 0.4));

  return (
    <div
      role="img"
      aria-label="A current readout. While the sample is loaded the current holds a flat baseline; when miR-223 binds the DNA catapult the current steps; a control without the target stays flat."
      className={cn("hand relative w-full bg-milk p-3 sm:p-5", className)}
    >
      <svg viewBox="0 0 620 400" className="block h-auto w-full" aria-hidden>
        {/* axes */}
        <path d={`M 70 60 V ${BASE_Y + 40} H ${END_X + 30}`} fill="none" stroke={INK} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        <text x={46} y={200} textAnchor="middle" transform="rotate(-90 46 200)" className="fill-ink font-display" fontSize="22">current</text>
        <text x={END_X + 30} y={BASE_Y + 74} textAnchor="end" className="fill-ink font-display" fontSize="22">time</text>

        {/* the no-target control: flat all the way */}
        <motion.path d={`M 70 ${BASE_Y} H ${END_X}`} fill="none" stroke="var(--color-bio)" strokeWidth="7" strokeDasharray="2 14" strokeLinecap="round" style={{ pathLength: control }} />
        <motion.text x={END_X} y={BASE_Y + 32} textAnchor="end" className="fill-ink font-display" fontSize="20" style={{ opacity: control }}>
          without the target
        </motion.text>

        {/* binding marker: a red dot where miR-223 binds */}
        <motion.path d={`M ${BIND_X + 20} 70 V ${BASE_Y + 36}`} stroke={INK} strokeWidth="3" strokeDasharray="6 8" strokeLinecap="round" style={{ opacity: marker }} />
        <motion.text x={BIND_X + 34} y={84} className="fill-pink-deep font-display" fontSize="22" style={{ opacity: marker }}>
          miR-223 binds
        </motion.text>

        {/* the sample's trace */}
        <motion.path d={TRACE} fill="none" stroke="var(--color-signal)" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" style={{ pathLength: trace }} />

        <motion.circle cx={BIND_X + 20} cy={BASE_Y} r={14} fill="none" stroke="var(--color-coral-deep)" strokeWidth="4" vectorEffect="non-scaling-stroke" style={{ scale: pulse, opacity: pulseOpacity }} />
        <motion.circle cx={BIND_X + 20} cy={BASE_Y} r={14} fill="var(--color-coral-deep)" stroke={INK} strokeWidth="4" style={{ scale: dot }} />
        <motion.text x={END_X} y={STEP_Y - 22} textAnchor="end" className="fill-ink font-display" fontSize="20" style={{ opacity: stepLabel }}>
          change in current
        </motion.text>
      </svg>
    </div>
  );
}

/* --------------------------------------------------------- the copy */

function Chapter({ stage, i, progress }: { stage: Stage; i: number; progress: MotionValue<number> }) {
  const reduce = useReducedMotion();
  const last = i === LAST;
  const [a, b, c, d] = stage.window;
  const opacity = useSpan(progress, [a, b, c, d], [0, 1, 1, last ? 1 : 0]);
  const y = useTransform(progress, [a, b, c, d], [reduce ? 0 : 24, 0, 0, last || reduce ? 0 : -24]);

  return (
    <motion.div
      style={{ opacity, y }}
      className={cn("[grid-area:1/1]", reduce && !last && "invisible")}
      aria-hidden={reduce && !last ? true : undefined}
    >
      <div className="pop-text font-display text-[clamp(2.4rem,6.2vw,5.6rem)] leading-[0.98] text-ink [--pop:var(--color-pink)]">{stage.label}</div>
      <p className="mt-4 text-lg font-extrabold text-ink sm:mt-6 sm:text-2xl">{stage.tag}</p>
      <p className="mt-1.5 max-w-md text-[0.9rem] leading-relaxed text-ink/80 sm:mt-2 sm:text-lg">{stage.desc}</p>
    </motion.div>
  );
}

/* Each stage's accent mixed 38% into milk, as solid hex so Motion can blend them. */
const WASH_TONES = ["#f9c8a8", "#bbd6d0", "#f6dfad", "#efb6bf"];

/** One solid wash behind the vial. It changes colour between chapters and never fades. */
function SolidWash({ progress }: { progress: MotionValue<number> }) {
  const input: number[] = [0];
  const output: string[] = [WASH_TONES[0]];
  STAGES.forEach((stage, i) => {
    if (i === 0) return;
    input.push(STAGES[i - 1].window[2], stage.window[1]);
    output.push(WASH_TONES[i - 1], WASH_TONES[i]);
  });
  input.push(1);
  output.push(WASH_TONES[LAST]);
  const fill = useTransform(progress, input, output);
  return (
    <motion.div className="absolute inset-0" style={{ "--wash": fill } as React.ComponentProps<typeof motion.div>["style"]}>
      <Blob shape="b" fill="var(--wash)" outline className="h-full w-full" />
    </motion.div>
  );
}

/* --------------------------------------------------------- the stage */

/**
 * One long pin, four chapters. Text sits left and the vial right on large
 * screens; below that the picture stacks above the copy. `prefers-reduced-
 * motion` renders the final readout, unpinned.
 *
 * `intro` is the “siphoned sip becomes a flag” pin.
 */
export function SignalBeats({
  intro = true,
  caption,
}: {
  intro?: boolean;
  caption?: string;
} = {}) {
  return (
    <div className="relative">
      {intro && <SiphonBeat />}
      <SignalStage caption={caption} />
    </div>
  );
}

function SignalStage({ caption }: { caption?: string }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const done = useMotionValue(1);
  const progress = reduce ? done : scrollYProgress;

  const enter = useSpan(progress, [0, 0.04], [0, 1]);
  const washY = useTransform(progress, [0, 1], [reduce ? 0 : 60, reduce ? 0 : -60]);
  const visualY = useTransform(progress, [0, 1], [reduce ? 0 : 40, reduce ? 0 : -30]);
  const visualScale = useTransform(progress, [0, 0.1], [reduce ? 1 : 0.9, 1]);
  const textY = useTransform(progress, [0, 1], [reduce ? 0 : 30, reduce ? 0 : -30]);
  const textX = useTransform(progress, [0, 0.1], [reduce ? 0 : -40, 0]);
  return (
    <section
      ref={ref}
      className={cn("relative bg-milk", reduce ? "min-h-svh" : "h-[640vh]")}
      aria-label="From milk to signal"
    >
      <div className={cn("top-0 h-svh overflow-hidden", reduce ? "relative" : "sticky")}>
        <motion.div
          aria-hidden
          style={{ y: washY }}
          className="pointer-events-none absolute right-[-14vmin] top-1/2 h-[88vmin] w-[88vmin] -translate-y-1/2"
        >
          <SolidWash progress={progress} />
        </motion.div>

        <motion.div style={{ opacity: enter }} className="relative mx-auto flex h-full w-full max-w-7xl flex-col px-5 pt-24 pb-16 sm:px-8 sm:pt-20 sm:pb-10">
          <div className="grid flex-1 grid-rows-[auto_minmax(0,1fr)] items-center gap-4 max-lg:content-start lg:grid-cols-2 lg:grid-rows-1 lg:gap-12">
            <motion.div style={{ y: textY, x: textX }} className="relative max-lg:pt-2 lg:order-1">
              {caption && <p className="kicker mb-4 text-pink-deep">{caption}</p>}
              <div className="grid">
                {STAGES.map((s, i) => (
                  <Chapter key={s.index} stage={s} i={i} progress={progress} />
                ))}
              </div>
            </motion.div>

            <motion.div
              style={{ y: visualY, scale: visualScale }}
              className="relative flex min-h-0 w-full items-center justify-center max-lg:max-h-[42svh] max-lg:self-start max-lg:[&>*]:max-h-full lg:order-2"
            >
              <CurrentReadout progress={progress} className="max-w-[38rem] max-lg:w-[min(100%,58svh)]" />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
