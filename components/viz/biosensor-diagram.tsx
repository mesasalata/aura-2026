"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Blob, LINE, SHINE, SOFT_ID } from "@/components/viz/sketch";
import { DoodadFrame, PaperCorner } from "@/components/viz/doodads";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ *
 * BiosensorDiagram - an interactive, illustrated "specimen viewer".
 * A glass vial of milk swishes continuously; stepping through the four
 * stages makes the liquid react: a droplet falls in, sensors bind the
 * biomarker, the signal cascades, and the milk visibly changes colour.
 * Auto-plays, pauses on interaction, and is fully clickable.
 * Drawn on paper in the kit's ink-outline hand - no glow, no chrome.
 * ------------------------------------------------------------------ */

const INK = LINE;

type Stage = {
  label: string;
  tag: string;
  accent: string;
  liquidFront: string;
  liquidBack: string;
  desc: string;
};

const STAGES: Stage[] = [
  {
    label: "Input",
    tag: "Milk sample loaded",
    accent: "var(--color-orange)",
    liquidFront: "#f3ead8",
    liquidBack: "#e4d7bd",
    desc: "Each milking, a siphoned sip of milk enters the chamber. Fats, salts, and - if the cow is fighting bacteria - bta-miR-223 are all in here, invisible to the eye.",
  },
  {
    label: "Recognition",
    tag: "Catapult binds miR-223",
    accent: "var(--color-signal)",
    liquidFront: "#e6f1ee",
    liquidBack: "#d1e4df",
    desc: "A DNA catapult on the FET surface has an invasion region complementary to miR-223. When the miRNA associates, the stem opens - a shape change, not a colour.",
  },
  {
    label: "Transduction",
    tag: "Current ticks",
    accent: "var(--color-butter)",
    liquidFront: "#f5ecd2",
    liquidBack: "#e9dbb3",
    desc: "Opening the catapult moves charge away from the FET surface. The transistor reads that as a change in current between source and drain. Reference electrodes taste the milk first so salt does not raise a false flag.",
  },
  {
    label: "Output",
    tag: "A flag, not a verdict",
    accent: "var(--color-pink)",
    liquidFront: "#ffd6e6",
    liquidBack: "#f7b9d2",
    desc: "A small on-farm model turns the residual current into a miR-223 load score. If it stays high across milkings, the parlour computer marks this cow - look closer, skip blanket antibiotics.",
  },
];

const SURFACE = 86; // y of the milk surface inside the vial
const CENTER_X = 100;

/* Wave surface path spanning wider than the viewBox so it can loop seamlessly. */
function buildWave(amp: number, wavelength: number, phase: number) {
  const pts: string[] = [];
  for (let x = -40; x <= 240; x += 8) {
    const y = SURFACE + amp * Math.sin((x / wavelength) * Math.PI * 2 + phase);
    pts.push(`${x === -40 ? "M" : "L"}${x} ${y.toFixed(3)}`);
  }
  pts.push("L240 200 L-40 200 Z");
  return pts.join(" ");
}

/* --- Ambient cells suspended in the milk (always present) --- */
type Mote = { cx: number; cy: number; r: number; delay: number; dur: number; pink: boolean };
const MOTES: Mote[] = (() => {
  let s = 42;
  const rand = () => ((s = (s * 9301 + 49297) % 233280) / 233280);
  return Array.from({ length: 11 }, () => ({
    cx: 60 + rand() * 80,
    cy: 100 + rand() * 70,
    r: 1.2 + rand() * 2.6,
    delay: rand() * 4,
    dur: 5 + rand() * 5,
    pink: rand() > 0.7,
  }));
})();

function useMotes() {
  return MOTES;
}

function AmbientMotes({ reduce }: { reduce: boolean }) {
  const motes = useMotes();
  return (
    <g opacity={0.5}>
      {motes.map((m, i) => (
        <motion.circle
          key={i}
          cx={m.cx}
          r={m.r}
          fill={m.pink ? "var(--color-pink)" : LINE}
          fillOpacity={m.pink ? 0.35 : 0.14}
          initial={{ cy: m.cy }}
          animate={reduce ? undefined : { cy: [m.cy, m.cy - 8, m.cy], opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: m.dur, delay: m.delay, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </g>
  );
}

/* --- Rising bubbles for a living, carbonated feel --- */
function Bubbles({ reduce, accent }: { reduce: boolean; accent: string }) {
  if (reduce) return null;
  const bubbles = [
    { x: 84, r: 2, delay: 0, dur: 4.2 },
    { x: 104, r: 1.4, delay: 1.4, dur: 3.6 },
    { x: 118, r: 2.4, delay: 2.6, dur: 4.8 },
    { x: 92, r: 1.6, delay: 3.2, dur: 4 },
  ];
  return (
    <g>
      {bubbles.map((b, i) => (
        <motion.circle
          key={i}
          cx={b.x}
          r={b.r}
          fill={accent}
          initial={{ cy: 172, opacity: 0 }}
          animate={{ cy: [172, SURFACE + 6], opacity: [0, 0.7, 0] }}
          transition={{ duration: b.dur, delay: b.delay, repeat: Infinity, ease: "easeOut" }}
        />
      ))}
    </g>
  );
}

/* ---------------- Per-stage scenes (inside the vial) ---------------- */

function InputScene({ reduce }: { reduce: boolean }) {
  return (
    <g>
      {!reduce && (
        <motion.circle
          cx={CENTER_X}
          r={5}
          fill="var(--color-milk)"
          stroke={INK}
          strokeWidth={1.4}
          initial={{ cy: 54, opacity: 0 }}
          animate={{ cy: [54, SURFACE], opacity: [0, 1, 1, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: [0.4, 0, 0.8, 1], times: [0, 0.15, 0.85, 1] }}
        />
      )}
      {[0, 1].map((i) => (
        <motion.ellipse
          key={i}
          cx={CENTER_X}
          cy={SURFACE}
          rx={34}
          ry={11}
          fill="none"
          stroke="var(--color-orange)"
          strokeWidth={1.4}
          vectorEffect="non-scaling-stroke"
          initial={{ opacity: 0, scale: 0.15 }}
          animate={reduce ? { opacity: 0.4, scale: 0.5 } : { scale: [0.15, 1], opacity: [0.7, 0] }}
          transition={{ duration: 1.8, delay: 1.05 + i * 0.18, repeat: Infinity, ease: "easeOut" }}
        />
      ))}
    </g>
  );
}

function RecognitionScene({ reduce }: { reduce: boolean }) {
  const sites = [78, 100, 122];
  return (
    <g>
      {sites.map((x, i) => (
        <g key={x} transform={`translate(${x} ${SURFACE + 40})`}>
          {/* Y-shaped receptor */}
          <path
            d="M0 10 L0 0 M0 0 L-5 -7 M0 0 L5 -7"
            fill="none"
            stroke="var(--color-signal)"
            strokeWidth={2}
            strokeLinecap="round"
          />
          {/* biomarker docking into the fork */}
          <motion.circle
            r={3.4}
            fill="var(--color-pink)"
            initial={{ cy: -34, opacity: 0 }}
            animate={reduce ? { cy: -8, opacity: 1 } : { cy: [-34, -8], opacity: [0, 1] }}
            transition={{ duration: 1.1, delay: i * 0.35, repeat: Infinity, repeatDelay: 1.6, ease: "easeIn" }}
          />
          <motion.circle
            r={7}
            fill="none"
            stroke="var(--color-signal)"
            strokeWidth={1}
            initial={{ opacity: 0 }}
            animate={reduce ? undefined : { r: [7, 13], opacity: [0.7, 0] }}
            transition={{ duration: 1.1, delay: 1.1 + i * 0.35, repeat: Infinity, repeatDelay: 1.6, ease: "easeOut" }}
            style={{ transformBox: "fill-box", transformOrigin: "center", translate: "0 -8px" }}
          />
        </g>
      ))}
    </g>
  );
}

const AMPLIFY_CY = 128;
const AMPLIFY_PARTICLES = [0, 1, 2, 3, 4, 5].map((i) => {
  const a = (i / 6) * Math.PI * 2;
  return {
    cxEnd: Number((CENTER_X + Math.cos(a) * 30).toFixed(3)),
    cyEnd: Number((AMPLIFY_CY + Math.sin(a) * 30).toFixed(3)),
  };
});

function AmplificationScene({ reduce }: { reduce: boolean }) {
  return (
    <g>
      {[0, 1, 2].map((i) => (
        <motion.circle
          key={i}
          cx={CENTER_X}
          cy={AMPLIFY_CY}
          fill="none"
          stroke="var(--color-butter)"
          strokeWidth={1.6}
          initial={{ r: 5, opacity: 0 }}
          animate={reduce ? { opacity: 0.4 } : { r: [5, 52], opacity: [0.8, 0] }}
          transition={{ duration: 1.8, delay: i * 0.55, repeat: Infinity, ease: "easeOut" }}
        />
      ))}
      {!reduce &&
        AMPLIFY_PARTICLES.map((p, i) => (
          <motion.circle
            key={`d${i}`}
            cx={CENTER_X}
            cy={AMPLIFY_CY}
            r={2.2}
            fill="var(--color-butter)"
            initial={{ opacity: 0 }}
            animate={{
              cx: [CENTER_X, p.cxEnd],
              cy: [AMPLIFY_CY, p.cyEnd],
              opacity: [1, 0],
            }}
            transition={{ duration: 1.6, delay: 0.3 + i * 0.08, repeat: Infinity, ease: "easeOut" }}
          />
        ))}
    </g>
  );
}

function OutputScene({ reduce }: { reduce: boolean }) {
  const sparkles = [
    { x: 80, y: 120, d: 0 },
    { x: 118, y: 108, d: 0.6 },
    { x: 100, y: 140, d: 1.2 },
    { x: 128, y: 138, d: 1.8 },
    { x: 74, y: 148, d: 0.9 },
  ];
  return (
    <g>
      {sparkles.map((s, i) => (
        <motion.path
          key={i}
          d="M0 -5 L1.2 -1.2 L5 0 L1.2 1.2 L0 5 L-1.2 1.2 L-5 0 L-1.2 -1.2 Z"
          fill="var(--color-pink-deep)"
          transform={`translate(${s.x} ${s.y})`}
          initial={{ opacity: 0, scale: 0.4 }}
          animate={reduce ? { opacity: 0.9, scale: 1 } : { opacity: [0, 1, 0], scale: [0.4, 1.2, 0.4] }}
          transition={{ duration: 2, delay: s.d, repeat: Infinity, ease: "easeInOut" }}
          style={{ transformBox: "fill-box", transformOrigin: "center" }}
        />
      ))}
    </g>
  );
}

const SCENES = [InputScene, RecognitionScene, AmplificationScene, OutputScene];

/* ---------------------------- The vial ---------------------------- */

function VialScene({ active, reduce }: { active: number; reduce: boolean }) {
  const stage = STAGES[active];
  const Scene = SCENES[active];

  const waveFront = useMemo(() => buildWave(3.5, 80, 0), []);
  const waveBack = useMemo(() => buildWave(4.5, 100, Math.PI / 2), []);

  return (
    <svg viewBox="0 0 200 210" className="h-full w-full overflow-visible" role="img" aria-label={`Biosensor stage: ${stage.label}`}>
      <defs>
        <clipPath id="vialInterior">
          <path d="M54 48 L54 150 Q54 178 82 178 L118 178 Q146 178 146 150 L146 48 Z" />
        </clipPath>
      </defs>

      {/* Flat colour wash behind the vial - re-tints with the active stage */}
      <motion.g
        initial={false}
        animate={{ scale: active === 3 ? 1.12 : 1, opacity: active === 3 ? 0.22 : 0.14 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        style={{ transformOrigin: `${CENTER_X}px 118px` }}
      >
        <motion.path
          d="M 100 22 C 150 18, 192 58, 188 110 C 184 162, 150 200, 100 198 C 50 196, 10 160, 14 108 C 18 56, 50 26, 100 22 Z"
          fill={STAGES[0].accent}
          initial={{ fill: STAGES[0].accent }}
          animate={{ fill: stage.accent }}
          transition={{ duration: 0.8 }}
          filter={`url(#${SOFT_ID})`}
        />
      </motion.g>

      {/* Milk inside the vial */}
      <g clipPath="url(#vialInterior)">
        {/* soft fill base so the vial is never empty below the waves */}
        <motion.rect
          x={40}
          y={SURFACE}
          width={120}
          height={120}
          fill={STAGES[0].liquidBack}
          initial={{ fill: STAGES[0].liquidBack }}
          animate={{ fill: stage.liquidBack }}
          transition={{ duration: 0.8 }}
        />
        {/* back wave */}
        <motion.path
          d={waveBack}
          fill={STAGES[0].liquidBack}
          initial={{ fill: STAGES[0].liquidBack, x: 0 }}
          animate={reduce ? { fill: stage.liquidBack } : { x: [0, -100], fill: stage.liquidBack }}
          transition={{
            x: { duration: 7, repeat: Infinity, ease: "linear" },
            fill: { duration: 0.8 },
          }}
          opacity={0.85}
        />
        {/* front wave */}
        <motion.path
          d={waveFront}
          fill={STAGES[0].liquidFront}
          initial={{ fill: STAGES[0].liquidFront, x: 0 }}
          animate={reduce ? { fill: stage.liquidFront } : { x: [0, -80], fill: stage.liquidFront }}
          transition={{
            x: { duration: 4.5, repeat: Infinity, ease: "linear" },
            fill: { duration: 0.8 },
          }}
        />

        <AmbientMotes reduce={reduce} />
        <Bubbles reduce={reduce} accent={stage.accent} />

        {/* Surface line, pencil-light */}
        <rect x={54} y={SURFACE - 1} width={92} height={2} fill={INK} opacity={0.12} />

        {/* Active stage overlay */}
        <AnimatePresence mode="wait">
          <motion.g
            key={active}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Scene reduce={reduce} />
          </motion.g>
        </AnimatePresence>
      </g>

      {/* Falling droplet for the Input stage sits above the milk surface */}
      {active === 0 && <InputDroplet reduce={reduce} />}

      {/* Glass vial, inked */}
      <g filter={`url(#${SOFT_ID})`} strokeLinecap="round" strokeLinejoin="round">
        <path
          d="M54 48 L54 150 Q54 178 82 178 L118 178 Q146 178 146 150 L146 48 Z"
          fill="none"
          stroke={INK}
          strokeWidth={2.4}
        />
        {/* neck + lip */}
        <path d="M62 48 L62 36 M138 48 L138 36" stroke={INK} strokeWidth={2.2} />
        <rect x={56} y={28} width={88} height={9} rx={3} fill="var(--color-cream)" stroke={INK} strokeWidth={2} />
        {/* glass shine */}
        <path d="M62 60 C 60 90, 61 120, 65 150 C 69 152, 71 150, 69 148 C 66 120, 65 90, 67 60 Z" fill={SHINE} fillOpacity={0.75} />
      </g>
    </svg>
  );
}

function InputDroplet({ reduce }: { reduce: boolean }) {
  if (reduce) return null;
  return (
    <motion.g
      initial={{ opacity: 0 }}
      animate={{ y: [0, 22], opacity: [0, 1, 1, 0] }}
      transition={{ duration: 1.8, repeat: Infinity, ease: [0.4, 0, 0.8, 1], times: [0, 0.15, 0.8, 1] }}
    >
      <path d="M100 20 C106 30 112 36 112 44 A12 12 0 1 1 88 44 C88 36 94 30 100 20 Z" fill="var(--color-milk)" stroke={INK} strokeWidth={2} strokeLinejoin="round" />
      <path d="M95 40 C 94 43, 94 46, 95.5 49" fill="none" stroke={INK} strokeOpacity={0.3} strokeWidth={1.4} strokeLinecap="round" />
    </motion.g>
  );
}

/* ---------------------------- Stepper ---------------------------- */

function StageButton({
  stage,
  index,
  active,
  onSelect,
  onKeyDown,
  buttonRef,
}: {
  stage: Stage;
  index: number;
  active: boolean;
  onSelect: () => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLButtonElement>) => void;
  buttonRef: (el: HTMLButtonElement | null) => void;
}) {
  return (
    <button
      ref={buttonRef}
      type="button"
      onClick={onSelect}
      onKeyDown={onKeyDown}
      aria-pressed={active}
      aria-label={`Step ${index + 1}, ${stage.label}: ${stage.tag}`}
      className={cn(
        "group relative flex w-full items-center gap-3 rounded-[14px_18px_12px_16px] border-2 p-3 text-left transition-all duration-300",
        active
          ? "border-ink bg-milk shadow-[0_0_0_2px_var(--color-milk),0_0_0_3px_var(--color-ink)]"
          : "border-ink/12 bg-transparent hover:border-ink/35",
      )}
    >
      {/* inked disc with the step number; fills with the stage colour when active */}
      <span className="relative h-10 w-10 shrink-0">
        <Blob
          shape="c"
          fill={active ? stage.accent : "var(--color-milk)"}
          className={cn("absolute inset-0 h-full w-full transition-opacity", !active && "opacity-0")}
        />
        <span
          className={cn(
            "absolute inset-0 grid place-items-center rounded-full border-2 font-display text-sm transition-colors",
            active ? "border-transparent text-ink" : "border-ink/60 text-ink/70",
          )}
        >
          {index + 1}
        </span>
      </span>
      <span className="min-w-0">
        <span className="block text-[0.6rem] font-semibold uppercase tracking-widest text-ink-40">
          Step 0{index + 1}
        </span>
        <span className="block truncate font-display text-base text-ink">{stage.label}</span>
      </span>
    </button>
  );
}

/* --------------------------- Component --------------------------- */

export function BiosensorDiagram() {
  const reduce = !!useReducedMotion();
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const stageRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const stage = STAGES[active];

  useEffect(() => {
    if (paused || reduce) return;
    const id = setInterval(() => setActive((a) => (a + 1) % STAGES.length), 4200);
    return () => clearInterval(id);
  }, [paused, reduce]);

  const selectStage = (index: number) => {
    setActive(index);
    stageRefs.current[index]?.focus();
  };

  const onStageKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    let next = index;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      next = (index + 1) % STAGES.length;
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      next = (index - 1 + STAGES.length) % STAGES.length;
    } else if (e.key === "Home") {
      next = 0;
    } else if (e.key === "End") {
      next = STAGES.length - 1;
    } else {
      return;
    }
    e.preventDefault();
    selectStage(next);
  };

  return (
    <DoodadFrame>
      <PaperCorner className="doodad-corner--tr" />
    <div
      className="painted overflow-hidden p-5 sm:p-8"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <div className="grid items-center gap-8 lg:grid-cols-[0.85fr_1.15fr]">
        {/* The illustrated vial */}
        <div className="relative mx-auto w-full max-w-[280px]">
          <VialScene active={active} reduce={reduce} />
        </div>

        {/* Controls + narration */}
        <div>
          <div role="group" aria-label="Biosensor stages" className="grid gap-2.5 sm:grid-cols-2">
            {STAGES.map((s, i) => (
              <StageButton
                key={s.label}
                stage={s}
                index={i}
                active={i === active}
                onSelect={() => selectStage(i)}
                onKeyDown={(e) => onStageKeyDown(e, i)}
                buttonRef={(el) => {
                  stageRefs.current[i] = el;
                }}
              />
            ))}
          </div>

          {/* Progress track */}
          <div className="mt-5 flex gap-1.5" aria-hidden>
            {STAGES.map((s, i) => (
              <div key={s.label} className="h-1 flex-1 overflow-hidden rounded-full bg-ink/10">
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: s.accent }}
                  initial={false}
                  animate={{ width: i <= active ? "100%" : "0%" }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                />
              </div>
            ))}
          </div>

          {/* Narration panel */}
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="mt-5 rounded-[16px_12px_18px_14px] border-2 border-dashed border-ink/15 p-5"
            >
              <span
                className="inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-[0.62rem] font-semibold uppercase tracking-widest text-ink"
                style={{ background: `color-mix(in srgb, ${stage.accent} 26%, transparent)` }}
              >
                {stage.tag}
              </span>
              <p className="mt-3 text-sm leading-relaxed text-ink-70">{stage.desc}</p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
    </DoodadFrame>
  );
}
