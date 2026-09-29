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
import { BLOB, Blob, LINE, SHINE, SOFT_ID, type BlobShape } from "@/components/viz/sketch";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ *
 * SignalBeats - how a milk sample becomes a readable result, as one
 * long scroll-pinned stage. The same vial stays on screen through four
 * chapters (input, recognition, amplification, output) and the liquid
 * itself is scrubbed by scroll: it fills, the biomarker docks, the
 * colour blooms pink, and finally the sample is set beside a healthy
 * control. Same layout vocabulary as the impact beats.
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
    desc: "Each milking, a siphoned sip of milk enters the chamber. Fats, salts, and - if the cow is fighting bacteria - bta-miR-223 are all in here, invisible to the eye.",
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
    tag: "Current ticks",
    desc: "Opening the catapult moves charge away from the FET surface. The transistor reads that as a change in current between source and drain. Reference electrodes taste the milk first so salt does not raise a false flag.",
    accent: "var(--color-butter)",
    wash: "d",
    window: [0.51, 0.56, 0.71, 0.76],
  },
  {
    index: "04",
    label: "Output",
    tag: "A flag, not a verdict",
    desc: "A small on-farm model turns the residual current into a miR-223 load score. If it stays high across milkings, the parlour computer marks this cow - look closer, skip blanket antibiotics.",
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

/* --------------------------------------------------------- vial geometry */

const GLASS = "M54 48 L54 150 Q54 178 82 178 L118 178 Q146 178 146 150 L146 48 Z";
const CX = 100;
const SURFACE = 86;
const FLOOR = 178;
const VIEWBOX = "28 6 144 190";

/* receptor stroke goes from sensor teal to lit pink as the signal amplifies */
const RECEPTOR_IN = [0.5, 0.7];
const RECEPTOR_OUT = ["#5aaeb8", "#c4456e"];
const GLOW_IN = 0.5;
const GLOW_OUT = 0.82;

/* liquid colours: pale milk → the faintest tint → pink → hot pink */
const TINT_IN = [0.4, 0.5, 0.7, 0.86];
const FRONT_OUT = ["#f3ead8", "#f6e4dc", "#ffd1e3", "#ffc2d9"];
const BACK_OUT = ["#e4d7bd", "#e9d2ca", "#f7abcb", "#f09bb4"];

function buildWave(amp: number, wavelength: number, phase: number) {
  const pts: string[] = [];
  for (let x = -40; x <= 240; x += 8) {
    const y = SURFACE + amp * Math.sin((x / wavelength) * Math.PI * 2 + phase);
    pts.push(`${x === -40 ? "M" : "L"}${x} ${y.toFixed(3)}`);
  }
  pts.push("L240 300 L-40 300 Z");
  return pts.join(" ");
}
const WAVE = buildWave(3.5, 80, 0);

/* Suspended cells; fixed seed so server and client agree. */
type Mote = { cx: number; cy: number; r: number; phase: number; pink: boolean };
const MOTES: Mote[] = (() => {
  let s = 42;
  const rand = () => ((s = (s * 9301 + 49297) % 233280) / 233280);
  return Array.from({ length: 11 }, () => ({
    cx: 62 + rand() * 76,
    cy: 100 + rand() * 68,
    r: 1.2 + rand() * 2.4,
    phase: rand() * Math.PI * 2,
    pink: rand() > 0.7,
  }));
})();

const SITES = [78, 100, 122];
const RECEPTOR_Y = 130;
const STAR = "M0 -5 L1.2 -1.2 L5 0 L1.2 1.2 L0 5 L-1.2 1.2 L-5 0 L-1.2 -1.2 Z";
const SPARKLES = [
  { x: 80, y: 118, at: 0.6 },
  { x: 120, y: 106, at: 0.63 },
  { x: 100, y: 142, at: 0.66 },
  { x: 130, y: 140, at: 0.69 },
  { x: 72, y: 150, at: 0.72 },
];

/* Drawn marks around the glass: little stars and short dashes radiating away from it. */
type Mark = { kind: "star" | "dash"; x: number; y: number; angle: number; size: number; color: string; at: number };
const PINK_DEEP = "var(--color-pink-deep)";
const MARKS: Mark[] = [
  { kind: "dash", x: 47, y: 62, angle: -150, size: 7, color: PINK_DEEP, at: 0.62 },
  { kind: "star", x: 41, y: 92, angle: 0, size: 4.2, color: INK, at: 0.66 },
  { kind: "dash", x: 46, y: 124, angle: 180, size: 6, color: INK, at: 0.7 },
  { kind: "star", x: 44, y: 158, angle: 0, size: 3.4, color: PINK_DEEP, at: 0.76 },
  { kind: "dash", x: 152, y: 58, angle: -30, size: 7, color: INK, at: 0.64 },
  { kind: "star", x: 160, y: 84, angle: 0, size: 4.6, color: PINK_DEEP, at: 0.68 },
  { kind: "dash", x: 154, y: 118, angle: 0, size: 6, color: PINK_DEEP, at: 0.72 },
  { kind: "dash", x: 155, y: 146, angle: 25, size: 5, color: INK, at: 0.78 },
  { kind: "star", x: 130, y: 186, angle: 0, size: 3.2, color: INK, at: 0.8 },
  { kind: "dash", x: 72, y: 188, angle: 110, size: 5, color: PINK_DEEP, at: 0.82 },
];

/* --------------------------------------------------------- vial pieces */

function GlassOutline() {
  return (
    <g filter={`url(#${SOFT_ID})`} strokeLinecap="round" strokeLinejoin="round">
      <path d={GLASS} fill="none" stroke={INK} strokeWidth={2.4} />
      <path d="M62 48 L62 36 M138 48 L138 36" stroke={INK} strokeWidth={2.2} />
      <rect x={56} y={28} width={88} height={9} rx={3} fill="var(--color-cream)" stroke={INK} strokeWidth={2} />
      <path d="M62 60 C 60 90, 61 120, 65 150 C 69 152, 71 150, 69 148 C 66 120, 65 90, 67 60 Z" fill={SHINE} fillOpacity={0.75} />
    </g>
  );
}

function Receptor({ x, stroke, children }: { x: number; stroke: string | MotionValue<string>; children?: React.ReactNode }) {
  return (
    <g transform={`translate(${x} ${RECEPTOR_Y})`}>
      <motion.path d="M0 10 L0 0 M0 0 L-5 -7 M0 0 L5 -7" fill="none" style={{ stroke }} strokeWidth={2} strokeLinecap="round" />
      {children}
    </g>
  );
}

/** A short dash thrown off a bound site, one of four around the docked marker. */
function Ray({ angle, at, progress, stroke }: { angle: number; at: number; progress: MotionValue<number>; stroke: MotionValue<string> }) {
  const reach = useTransform(progress, [at, at + 0.08], [6, 12]);
  const opacity = useTransform(progress, [at, at + 0.03, at + 0.1, at + 0.16], [0, 0.9, 0.9, 0.55]);
  const rad = (angle * Math.PI) / 180;
  const x = useTransform(reach, (r) => Math.cos(rad) * r);
  const y = useTransform(reach, (r) => Math.sin(rad) * r);
  return (
    <motion.path
      d={`M0 -8 L${(Math.cos(rad) * 4).toFixed(3)} ${(-8 + Math.sin(rad) * 4).toFixed(3)}`}
      style={{ x, y, opacity, stroke }}
      strokeWidth={1.6}
      strokeLinecap="round"
      fill="none"
    />
  );
}

function OuterMark({ mark, progress }: { mark: Mark; progress: MotionValue<number> }) {
  const scale = useTransform(progress, [mark.at, mark.at + 0.06], [0.2, 1]);
  const opacity = useTransform(progress, [mark.at, mark.at + 0.06], [0, 1]);
  const rad = (mark.angle * Math.PI) / 180;
  return (
    <g transform={`translate(${mark.x} ${mark.y}) scale(${mark.kind === "star" ? mark.size / 5 : 1})`}>
      {mark.kind === "star" ? (
        <motion.path d={STAR} fill={mark.color} style={{ scale, opacity }} />
      ) : (
        <motion.path
          d={`M0 0 L${(Math.cos(rad) * mark.size).toFixed(3)} ${(Math.sin(rad) * mark.size).toFixed(3)}`}
          fill="none"
          stroke={mark.color}
          strokeWidth={1.8}
          strokeLinecap="round"
          style={{ scale, opacity }}
        />
      )}
    </g>
  );
}

function DriftingMote({ mote, progress, show }: { mote: Mote; progress: MotionValue<number>; show: MotionValue<number> }) {
  const y = useTransform(progress, (p) => Math.sin(p * Math.PI * 6 + mote.phase) * 5);
  return (
    <motion.g style={{ y, opacity: show }}>
      <circle cx={mote.cx} cy={mote.cy} r={mote.r} fill={mote.pink ? "var(--color-pink)" : INK} fillOpacity={mote.pink ? 0.4 : 0.16} />
    </motion.g>
  );
}

function DockingSite({ x, i, progress }: { x: number; i: number; progress: MotionValue<number> }) {
  const at = 0.33 + i * 0.025;
  const dockY = useTransform(progress, [at, at + 0.09], [-30, 0]);
  const dockIn = useTransform(progress, [at, at + 0.03], [0, 1]);
  const lockAt = at + 0.1;
  const lockScale = useTransform(progress, [lockAt, lockAt + 0.07], [0.5, 1.6]);
  const lockOpacity = useTransform(progress, [lockAt, lockAt + 0.02, lockAt + 0.07], [0, 0.8, 0]);
  const stroke = useSpan(progress, RECEPTOR_IN, RECEPTOR_OUT);
  const rayAt = 0.53 + i * 0.03;

  return (
    <Receptor x={x} stroke={stroke}>
      <motion.g style={{ y: dockY, opacity: dockIn }}>
        <circle cy={-8} r={3.4} fill="var(--color-pink)" />
      </motion.g>
      <motion.circle cy={-8} r={9} fill="none" stroke="var(--color-signal)" strokeWidth={1.2} vectorEffect="non-scaling-stroke" style={{ scale: lockScale, opacity: lockOpacity }} />
      {/* once bound, each site throws four short dashes - the signal leaving the receptor */}
      {[-135, -45, 45, 135].map((angle, k) => (
        <Ray key={angle} angle={angle} at={rayAt + k * 0.012} progress={progress} stroke={stroke} />
      ))}
    </Receptor>
  );
}

function Sparkle({ x, y, at, progress }: { x: number; y: number; at: number; progress: MotionValue<number> }) {
  const scale = useTransform(progress, [at, at + 0.06], [0.3, 1]);
  const opacity = useTransform(progress, [at, at + 0.06], [0, 0.95]);
  return (
    <g transform={`translate(${x} ${y})`}>
      <motion.path d={STAR} fill="var(--color-pink-deep)" style={{ scale, opacity }} />
    </g>
  );
}

/** The sample under test: fills, is read, and turns pink as you scroll. */
function SampleVial({ progress }: { progress: MotionValue<number> }) {
  const level = useTransform(progress, [0.03, 0.17], [FLOOR + 4, SURFACE]);
  const waveY = useTransform(level, (y) => y - SURFACE);
  const waveX = useTransform(progress, [0, 1], [0, -80]);
  const lineY = useTransform(level, (y) => y - 1);
  const front = useSpan(progress, TINT_IN, FRONT_OUT);
  const back = useSpan(progress, TINT_IN, BACK_OUT);
  const motesIn = useTransform(progress, [0.08, 0.2], [0, 1]);

  const dropY = useTransform(progress, [0.15, 0.22], [-34, SURFACE - 52]);
  const dropOpacity = useTransform(progress, [0.14, 0.16, 0.21, 0.225], [0, 1, 1, 0]);
  const rippleScale = useTransform(progress, [0.215, 0.3], [0.15, 1]);
  const rippleOpacity = useTransform(progress, [0.215, 0.23, 0.3], [0, 0.7, 0]);

  const receptorsIn = useTransform(progress, [0.26, 0.32], [0, 1]);

  /* the glow hugs the drawn silhouette: two stacked drop-shadows on the whole vial, no disc behind it */
  const glow = useTransform(progress, (p) => {
    const t = Math.min(1, Math.max(0, (p - GLOW_IN) / (GLOW_OUT - GLOW_IN)));
    if (t === 0) return "none";
    const tight = (t * 6).toFixed(1);
    const wide = (t * 18).toFixed(1);
    return `drop-shadow(0 0 ${tight}px var(--color-pink-soft)) drop-shadow(0 0 ${wide}px var(--color-pink-soft))`;
  });

  return (
    <motion.svg viewBox={VIEWBOX} className="block h-auto w-full overflow-visible" style={{ filter: glow }} aria-hidden>
      <defs>
        <clipPath id="signal-glass-sample">
          <path d={GLASS} />
        </clipPath>
      </defs>

      <g clipPath="url(#signal-glass-sample)">
        <motion.rect x={40} y={0} width={120} height={140} style={{ y: level, fill: back }} />
        <motion.path d={WAVE} style={{ x: waveX, y: waveY, fill: front }} />
        <motion.rect x={54} y={0} width={92} height={2} fill={INK} opacity={0.12} style={{ y: lineY }} />

        {MOTES.map((m, i) => (
          <DriftingMote key={i} mote={m} progress={progress} show={motesIn} />
        ))}

        <motion.ellipse
          cx={CX}
          cy={SURFACE}
          rx={32}
          ry={9}
          fill="none"
          stroke="var(--color-orange)"
          strokeWidth={1.4}
          vectorEffect="non-scaling-stroke"
          style={{ scale: rippleScale, opacity: rippleOpacity }}
        />

        <motion.g style={{ opacity: receptorsIn }}>
          {SITES.map((x, i) => (
            <DockingSite key={x} x={x} i={i} progress={progress} />
          ))}
        </motion.g>

        {SPARKLES.map((s) => (
          <Sparkle key={s.x} x={s.x} y={s.y} at={s.at} progress={progress} />
        ))}
      </g>

      {/* the last drop of the sample, drawn behind the lip so it reads as coming through the mouth */}
      <motion.g style={{ y: dropY, opacity: dropOpacity }}>
        <path d="M100 20 C106 30 112 36 112 44 A12 12 0 1 1 88 44 C88 36 94 30 100 20 Z" fill="var(--color-milk)" stroke={INK} strokeWidth={2} strokeLinejoin="round" />
        <path d="M95 40 C 94 43, 94 46, 95.5 49" fill="none" stroke={INK} strokeOpacity={0.3} strokeWidth={1.4} strokeLinecap="round" />
      </motion.g>

      <GlassOutline />

      {MARKS.map((m, i) => (
        <OuterMark key={i} mark={m} progress={progress} />
      ))}
    </motion.svg>
  );
}

/** The healthy control: same glass, same receptors, nothing docked, milk stays pale. */
function ControlVial() {
  return (
    <svg viewBox={VIEWBOX} className="block h-auto w-full overflow-visible" aria-hidden>
      <defs>
        <clipPath id="signal-glass-control">
          <path d={GLASS} />
        </clipPath>
      </defs>
      <g clipPath="url(#signal-glass-control)">
        <rect x={40} y={SURFACE} width={120} height={140} fill={BACK_OUT[0]} />
        <path d={WAVE} fill={FRONT_OUT[0]} transform="translate(-24 0)" />
        <rect x={54} y={SURFACE - 1} width={92} height={2} fill={INK} opacity={0.12} />
        {MOTES.filter((m) => !m.pink).map((m, i) => (
          <circle key={i} cx={m.cx} cy={m.cy} r={m.r} fill={INK} fillOpacity={0.16} />
        ))}
        {SITES.map((x) => (
          <Receptor key={x} x={x} stroke="var(--color-signal)" />
        ))}
      </g>
      <GlassOutline />
    </svg>
  );
}

/* --------------------------------------------------------- the visual */

type Readout = { title: string; verdict: string; note: string; accent: string };

const HEALTHY: Readout = {
  title: "Healthy milk",
  verdict: "No signal",
  note: "miR-223 score stays with the sample’s own baseline - no flag.",
  accent: "var(--color-bio)",
};
const INFECTED: Readout = {
  title: "Infected milk",
  verdict: "Signal fires",
  note: "Score stays high across milkings - the parlour marks this cow.",
  accent: "var(--color-pink)",
};

function Verdict({ r, opacity, y }: { r: Readout; opacity: MotionValue<number>; y: MotionValue<number> }) {
  return (
    <motion.div style={{ opacity, y }} className="mt-2 flex flex-col items-center text-center sm:mt-3">
      <span
        className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[0.6rem] font-semibold uppercase tracking-widest text-ink sm:px-3 sm:text-[0.68rem]"
        style={{ background: `color-mix(in srgb, ${r.accent} 28%, transparent)` }}
      >
        <Blob shape="c" fill={r.accent} className="h-2.5 w-2.5" soft={false} />
        {r.verdict}
      </span>
      <p className="mt-2 font-display text-base text-ink sm:text-lg">{r.title}</p>
      <p className="mt-1 hidden max-w-[22ch] text-sm leading-relaxed text-ink-70 sm:block">{r.note}</p>
    </motion.div>
  );
}

function SignalVisual({ progress, className }: { progress: MotionValue<number>; className?: string }) {
  const reduce = useReducedMotion();

  /* output: the sample slides to its column and the control appears beside it */
  const sampleX = useTransform(progress, [0.76, 0.88], ["-50%", "0%"]);
  const controlOpacity = useSpan(progress, [0.8, 0.9], [0, 1]);
  const controlX = useTransform(progress, [0.8, 0.9], [reduce ? "0%" : "-18%", "0%"]);
  const verdictOpacity = useSpan(progress, [0.88, 0.97], [0, 1] as number[]);
  const verdictY = useTransform(progress, [0.88, 0.97], [reduce ? 0 : 14, 0]);

  return (
    <div
      role="img"
      aria-label="A milk sample in a biosensor vial. As you scroll it is loaded, the biomarker is recognised, the signal amplified, and the result set beside a healthy control: healthy milk stays pale with no signal, infected milk turns pink as the signal fires."
      className={cn("relative grid w-full grid-cols-2", className)}
    >
      <motion.div style={{ opacity: controlOpacity, x: controlX }} className="flex flex-col items-center px-3 sm:px-6">
        <ControlVial />
        <Verdict r={HEALTHY} opacity={verdictOpacity} y={verdictY} />
      </motion.div>

      <motion.div style={{ x: sampleX }} className="flex flex-col items-center px-3 sm:px-6">
        <SampleVial progress={progress} />
        <Verdict r={INFECTED} opacity={verdictOpacity} y={verdictY} />
      </motion.div>

      <motion.div
        aria-hidden
        style={{ opacity: verdictOpacity }}
        className="pointer-events-none absolute left-1/2 top-[38%] -translate-x-1/2 -translate-y-1/2 text-center"
      >
        <p className="font-display text-sm text-ink-40">vs</p>
      </motion.div>
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
      <div className="font-display text-[clamp(2.5rem,6.6vw,6rem)] leading-[0.95] tracking-[-0.04em] text-ink">{stage.label}</div>
      <p className="mt-3 text-lg font-medium text-ink sm:mt-5 sm:text-2xl">{stage.tag}</p>
      <p className="mt-1.5 max-w-md text-[0.9rem] leading-relaxed text-ink-70 sm:mt-2 sm:text-lg">{stage.desc}</p>
    </motion.div>
  );
}

function Wash({ stage, i, progress }: { stage: Stage; i: number; progress: MotionValue<number> }) {
  const [a, , , d] = stage.window;
  const start = i === 0 ? 0 : a;
  const end = i === LAST ? 1 : d;
  const opacity = useSpan(
    progress,
    i === 0 ? [end - 0.05, end] : i === LAST ? [start, start + 0.05] : [start, start + 0.05, end - 0.05, end],
    i === 0 ? [0.11, 0] : i === LAST ? [0, 0.11] : [0, 0.11, 0.11, 0],
  );
  return (
    <motion.div style={{ opacity }} className="absolute inset-0">
      <Blob shape={stage.wash} fill={stage.accent} className="h-full w-full" />
    </motion.div>
  );
}

/* --------------------------------------------------------- the stage */

/**
 * One long pin, four chapters. Text sits left and the vial right on large
 * screens; below that the picture stacks above the copy. `prefers-reduced-
 * motion` renders the final readout, unpinned.
 */
export function SignalBeats() {
  return (
    <div className="relative">
      <SignalIntro />
      <SignalStage />
    </div>
  );
}

function SignalIntro() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const done = useMotionValue(1);
  const progress = reduce ? done : scrollYProgress;

  const enter = useSpan(progress, [0, 0.12], [0, 1]);
  const washY = useTransform(progress, [0, 1], [reduce ? 0 : 40, reduce ? 0 : -40]);
  const textY = useTransform(progress, [0, 1], [reduce ? 0 : 36, reduce ? 0 : -28]);

  return (
    <section
      ref={ref}
      className={cn("relative bg-milk", reduce ? "min-h-svh" : "h-[150vh]")}
      aria-label="How a sample becomes something you can read"
    >
      <div className={cn("top-0 h-svh overflow-hidden", reduce ? "relative" : "sticky")}>
        <motion.div
          aria-hidden
          style={{ y: washY }}
          className="pointer-events-none absolute left-1/2 top-1/2 h-[90vmin] w-[90vmin] -translate-x-1/2 -translate-y-1/2"
        >
          <Blob shape="a" fill="var(--color-signal)" className="h-full w-full opacity-[0.12]" />
        </motion.div>
        <motion.div
          style={{ opacity: enter, y: textY }}
          className="relative mx-auto flex h-full w-full max-w-4xl flex-col items-center justify-center px-6 text-center"
        >
          <div className="relative">
            {/* Milk-ring stain - marks this as the assay chapter, like a mug sat on the notes. */}
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
            <p className="font-display text-[clamp(2.4rem,5.6vw,4.6rem)] leading-[1.06] tracking-tight text-ink text-balance">
              How a siphoned sip becomes a flag
            </p>
          </div>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-70 text-pretty">
            Each milking, milk washes a DNA catapult on an FET. miR-223 opens it; current ticks;
            a small model decides whether to flag this cow.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

function SignalStage() {
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
          {STAGES.map((s, i) => (
            <Wash key={s.index} stage={s} i={i} progress={progress} />
          ))}
        </motion.div>

        <motion.div style={{ opacity: enter }} className="relative mx-auto flex h-full w-full max-w-7xl flex-col px-5 pt-16 pb-16 sm:px-8 sm:pt-20 sm:pb-10">
          <div className="grid flex-1 grid-rows-[minmax(0,1fr)_auto] items-center gap-4 max-lg:content-end lg:grid-cols-2 lg:grid-rows-1 lg:gap-12">
            <motion.div
              style={{ y: visualY, scale: visualScale }}
              className="relative flex min-h-0 w-full items-center justify-center max-lg:max-h-[36svh] max-lg:self-end max-lg:[&>*]:max-h-full lg:order-2"
            >
              <SignalVisual progress={progress} className="max-w-[38rem] max-lg:w-[min(100%,66svh)]" />
            </motion.div>

            <motion.div style={{ y: textY, x: textX }} className="relative lg:order-1">
              <div className="grid">
                {STAGES.map((s, i) => (
                  <Chapter key={s.index} stage={s} i={i} progress={progress} />
                ))}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
