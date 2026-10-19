"use client";

import { useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";
import { BLOB } from "@/components/viz/sketch";
import { artUrl } from "@/lib/art";
import { cn } from "@/lib/utils";

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const ease = (t: number) => (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2);
/** 0→1 across [a, b], eased and clamped. */
const useStep = (p: MotionValue<number>, a: number, b: number) => useTransform(p, (v) => ease(clamp01((v - a) / (b - a))));
const after = (a: number) => (v: number) => clamp01((v - a) / (1 - a));

/* The team's two paragraphs, cut at sentence ends. Step n lights sentence n. */
const SENTENCES = [
  "When pathogens pass the teat canal, the cow\u2019s immune system sends white blood cells to the affected area.",
  "This immune response causes inflammation, which is a key feature of mastitis.",
  "In cows with subclinical mastitis, bta-miR223 exists in milk samples and can indicate bacterial subclinical mastitis before any physiological changes occur.",
];
const STEP_AT = [0.08, 0.46, 0.64];

/* Callout geometry, in the scene's viewBox. */
const CX = 390;
const CY = 372;
const R = 118;
const UDDER = { x: 252, y: 236 };
const CANAL_TOP = 300;
const VESSEL_TOP = CY - R - 8;
const CANAL_BOTTOM = CY + R;

const BACTERIA = [
  { to: { x: CX - 50, y: 322 }, d: 0, rot: -30 },
  { to: { x: CX + 48, y: 328 }, d: 0.05, rot: 25 },
  { to: { x: CX - 70, y: 364 }, d: 0.1, rot: 70 },
  { to: { x: CX + 72, y: 296 }, d: 0.14, rot: -10 },
];
const CELLS = [
  { from: { x: CX - 150, y: 300 }, to: { x: CX - 58, y: 284 }, d: 0 },
  { from: { x: CX + 150, y: 370 }, to: { x: CX + 64, y: 370 }, d: 0.04 },
  { from: { x: CX - 150, y: 420 }, to: { x: CX - 52, y: 404 }, d: 0.08 },
];
const HEAT = [
  { x: CX - 84, y: 262, r: -35 },
  { x: CX + 86, y: 268, r: 35 },
];
const MIRNA = [0, 0.05, 0.1, 0.15];

/**
 * “Mastitis can start before any physiological changes occur.” The cow on the
 * outside stays the healthy one; a callout on her udder plays the paragraph:
 * pathogens up the teat canal, white blood cells, inflammation, and miR-223
 * in the milk. Each sentence lights while its step plays.
 */
export function MastitisSummary() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const done = useMotionValue(1);
  const p = reduce ? done : scrollYProgress;
  const [step, setStep] = useState(reduce ? -1 : 0);
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    if (reduce) return;
    let s = -1;
    STEP_AT.forEach((at, i) => {
      if (v >= at) s = i;
    });
    setStep(s);
  });
  const enter = useTransform(p, [0, 0.05, 1], [0, 1, 1]);

  return (
    <section
      ref={ref}
      className={cn("relative bg-milk", reduce ? "py-20" : "h-[320vh]")}
      aria-labelledby="mastitis-summary"
    >
      <div className={cn("top-0 overflow-hidden", reduce ? "relative" : "sticky h-svh")}>
        <motion.div
          style={{ opacity: enter }}
          className="relative mx-auto grid h-full max-w-7xl items-center gap-6 px-5 pb-4 pt-16 sm:px-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-12 lg:pt-16"
        >
          <div className="max-lg:self-end">
            <h2 id="mastitis-summary" className="pop-text font-display display-1 text-ink text-balance [--pop:var(--color-pink)]">
              Mastitis can start before any physiological changes occur.
            </h2>
            <p className="mt-4 max-w-xl text-[0.95rem] sm:mt-6 leading-relaxed sm:text-lg">
              <Sentence on={step === 0} dim={step > 0}>{SENTENCES[0]}</Sentence>{" "}
              <Sentence on={step === 1} dim={step !== 1 && step >= 0}>{SENTENCES[1]}</Sentence>
            </p>
            <p className="mt-3 max-w-xl text-[0.95rem] sm:mt-4 leading-relaxed sm:text-lg">
              <Sentence on={step === 2} dim={step >= 0 && step < 2}>{SENTENCES[2]}</Sentence>
            </p>
          </div>

          <div className="relative min-h-0 max-lg:self-start">
            <UdderScene p={p} />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function Sentence({ on, dim, children }: { on: boolean; dim: boolean; children: React.ReactNode }) {
  return (
    <span
      className={cn(
        "box-decoration-clone rounded-md bg-no-repeat px-0.5 transition-[background-size,color] duration-500 ease-out-soft",
        "bg-[linear-gradient(var(--color-butter),var(--color-butter))] bg-[position:0_88%]",
        on ? "bg-[length:100%_42%] text-ink" : "bg-[length:0%_42%]",
        dim ? "text-ink/45" : !on && "text-ink/80",
      )}
    >
      {children}
    </span>
  );
}

function UdderScene({ p }: { p: MotionValue<number> }) {
  const zoom = useStep(p, 0.04, 0.12);
  const invade = useStep(p, 0.12, 0.3);
  const rush = useStep(p, 0.26, 0.44);
  const inflame = useStep(p, 0.48, 0.6);
  const release = useStep(p, 0.66, 0.86);

  /* scale about the view-box origin, translated so the callout grows out of the udder */
  const calloutScale = useTransform(zoom, (v) => 0.15 + 0.85 * v);
  const calloutX = useTransform(calloutScale, (s) => UDDER.x * (1 - s));
  const calloutY = useTransform(calloutScale, (s) => UDDER.y * (1 - s));
  const tissue = useTransform(inflame, [0, 1], ["#f6d9d8", "#f29a9f"]);
  const dropScale = useTransform(release, (v) => clamp01(v / 0.3));
  const dropLabel = useTransform(release, after(0.6));
  const pathogenLabel = useTransform(invade, after(0.4));
  const cellLabel = useTransform(rush, after(0.5));
  const inflameLabel = useTransform(inflame, after(0.4));

  return (
    <svg viewBox="0 0 600 600" className="mx-auto block h-auto max-h-[78svh] w-full max-lg:max-h-[40svh]" aria-hidden>
      <defs>
        <clipPath id="udder-callout">
          <circle cx={CX} cy={CY} r={R - 3} />
        </clipPath>
      </defs>

      <g transform="translate(20 40) scale(3.6)">
        <path d={BLOB.ring} fill="color-mix(in srgb, var(--color-pink) 32%, var(--color-milk))" stroke="var(--color-ink)" strokeWidth={0.7} />
      </g>

      {/* the cow looks fine from outside */}
      <image href={artUrl("cow")} x={10} y={60} width={360} height={270} className="sticker" />

      {/* magnifier cone from the udder to the callout */}
      <motion.g style={{ opacity: zoom }}>
        <path d={`M ${UDDER.x - 8} ${UDDER.y + 10} L ${CX - R + 6} ${CY + 30} M ${UDDER.x + 12} ${UDDER.y - 4} L ${CX - 30} ${CY - R + 4}`} stroke="var(--color-ink)" strokeWidth="3" strokeDasharray="7 7" strokeLinecap="round" />
        <circle cx={UDDER.x} cy={UDDER.y} r={16} fill="none" stroke="var(--color-butter)" strokeWidth="6" />
        <circle cx={UDDER.x} cy={UDDER.y} r={16} fill="none" stroke="var(--color-ink)" strokeWidth="2" />
      </motion.g>

      <motion.g style={{ x: calloutX, y: calloutY, scale: calloutScale, opacity: zoom, transformBox: "view-box", originX: 0, originY: 0 }}>
        <circle cx={CX} cy={CY} r={R} fill="var(--color-milk)" />
        <g clipPath="url(#udder-callout)">
          {/* udder tissue, warming as it inflames */}
          <motion.rect x={CX - R} y={CY - R} width={R * 2} height={R * 2} style={{ fill: tissue }} />
          {/* teat canal */}
          <path d={`M ${CX - 20} ${VESSEL_TOP} C ${CX - 20} 380, ${CX - 14} 440, ${CX - 14} ${CANAL_BOTTOM + 4}`} fill="none" stroke="var(--color-ink)" strokeWidth="5" />
          <path d={`M ${CX + 20} ${VESSEL_TOP} C ${CX + 20} 380, ${CX + 14} 440, ${CX + 14} ${CANAL_BOTTOM + 4}`} fill="none" stroke="var(--color-ink)" strokeWidth="5" />
          <path d={`M ${CX} ${VESSEL_TOP} L ${CX} ${CANAL_BOTTOM + 4}`} stroke="var(--color-milk)" strokeWidth="30" />
          {HEAT.map((h, i) => (
            <motion.path
              key={i}
              d={`M ${h.x} ${h.y} q 6 -10 0 -20 q -6 -10 0 -20`}
              fill="none"
              stroke="var(--color-pink-deep)"
              strokeWidth="4"
              strokeLinecap="round"
              transform={`rotate(${h.r} ${h.x} ${h.y})`}
              style={{ opacity: inflame }}
            />
          ))}
          {BACTERIA.map((b, i) => (
            <Bacterium key={i} b={b} t={invade} />
          ))}
          {CELLS.map((c, i) => (
            <Cell key={i} c={c} t={rush} />
          ))}
          {MIRNA.map((d, i) => (
            <MiRNA key={i} i={i} d={d} t={release} />
          ))}
        </g>
        <circle cx={CX} cy={CY} r={R} fill="none" stroke="var(--color-ink)" strokeWidth="9" />
        <circle cx={CX} cy={CY} r={R} fill="none" stroke="var(--color-butter)" strokeWidth="4" />

        <motion.text x={CX - R - 6} y={CY + 92} textAnchor="end" className="fill-ink font-display" fontSize="20" style={{ opacity: pathogenLabel }}>
          pathogens
        </motion.text>
        <motion.text x={590} y={CY - R - 16} textAnchor="end" className="fill-ink font-display" fontSize="20" style={{ opacity: cellLabel }}>
          white blood cells
        </motion.text>
        <motion.text x={590} y={CY + R + 24} textAnchor="end" className="fill-pink-deep font-display" fontSize="20" style={{ opacity: inflameLabel }}>
          inflammation
        </motion.text>
      </motion.g>

      {/* the milk that leaves the teat carries the signal */}
      <motion.g style={{ scale: dropScale, transformBox: "fill-box", originX: 0.5, originY: 0 }}>
        <path d={`M ${CX} ${CANAL_BOTTOM + 6} C ${CX + 26} ${CANAL_BOTTOM + 40}, ${CX + 30} ${CANAL_BOTTOM + 66}, ${CX} ${CANAL_BOTTOM + 78} C ${CX - 30} ${CANAL_BOTTOM + 66}, ${CX - 26} ${CANAL_BOTTOM + 40}, ${CX} ${CANAL_BOTTOM + 6} Z`} fill="var(--color-milk)" stroke="var(--color-ink)" strokeWidth="4" />
        <path d={`M ${CX - 12} ${CANAL_BOTTOM + 52} c 4 -7 8 -7 12 0 s 8 7 12 0`} fill="none" stroke="var(--color-pink)" strokeWidth="4" strokeLinecap="round" />
      </motion.g>
      <motion.text x={CX - 40} y={CANAL_BOTTOM + 56} textAnchor="end" className="fill-pink-deep font-display" fontSize="20" style={{ opacity: dropLabel }}>
        bta-miR223 in milk
      </motion.text>
    </svg>
  );
}

/* Particles are drawn at the origin and moved with x/y, which don't depend on transform-origin. */
const FILL_CENTER = { transformBox: "fill-box", originX: 0.5, originY: 0.5 } as const;

/** Swims up the teat canal, then spreads into the tissue. */
function Bacterium({ b, t }: { b: (typeof BACTERIA)[number]; t: MotionValue<number> }) {
  const k = useTransform(t, (v) => clamp01((v - b.d) / (1 - b.d)));
  const x = useTransform(k, (v) => (v < 0.6 ? CX : CX + (b.to.x - CX) * ((v - 0.6) / 0.4)));
  const y = useTransform(k, (v) => {
    const top = CANAL_TOP + 16;
    return v < 0.6 ? CANAL_BOTTOM + 20 - (CANAL_BOTTOM + 20 - top) * (v / 0.6) : top + (b.to.y - top) * ((v - 0.6) / 0.4);
  });
  const rotate = useTransform(k, (v) => 90 + (b.rot - 90) * clamp01((v - 0.5) * 2));
  return (
    <motion.rect x={-11} y={-6} width={22} height={12} rx={6} fill="var(--color-coral)" stroke="var(--color-ink)" strokeWidth="3" style={{ x, y, rotate, ...FILL_CENTER }} />
  );
}

function Cell({ c, t }: { c: (typeof CELLS)[number]; t: MotionValue<number> }) {
  const k = useTransform(t, (v) => ease(clamp01((v - c.d) / (1 - c.d))));
  const x = useTransform(k, (v) => c.from.x + (c.to.x - c.from.x) * v);
  const y = useTransform(k, (v) => c.from.y + (c.to.y - c.from.y) * v);
  return (
    <motion.g style={{ x, y }}>
      <circle r={17} fill="var(--color-milk)" stroke="var(--color-ink)" strokeWidth="3.5" />
      <path d="M -8 -2 c 0 -6 6 -6 6 0 c 0 -6 7 -6 7 0 c 0 5 -6 7 -7 3 c -2 4 -6 2 -6 -3 Z" fill="var(--color-signal)" stroke="var(--color-ink)" strokeWidth="2" />
    </motion.g>
  );
}

/** miR-223 released near the cells, drifting down the canal into the milk. */
function MiRNA({ i, d, t }: { i: number; d: number; t: MotionValue<number> }) {
  const k = useTransform(t, (v) => clamp01((v - d) / 0.7));
  const startX = CX + (i % 2 ? 34 : -34);
  const x = useTransform(k, (v) => startX + (CX - startX) * Math.min(1, v * 2));
  const y = useTransform(k, (v) => 300 + (CANAL_BOTTOM - 10 - 300) * v);
  const opacity = useTransform(k, (v) => (v <= 0 || v >= 1 ? 0 : Math.min(1, v / 0.08, (1 - v) / 0.1)));
  return (
    <motion.path d="M -10 0 c 3 -6 7 -6 10 0 s 7 6 10 0" fill="none" stroke="var(--color-pink)" strokeWidth="4.5" strokeLinecap="round" style={{ x, y, opacity }} />
  );
}
