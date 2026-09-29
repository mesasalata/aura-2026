"use client";

import { useCallback, useRef, useState } from "react";
import { motion, useScroll, useTransform, useMotionValueEvent, useReducedMotion } from "motion/react";
import { Blob, LINE, SOFT_ID } from "@/components/viz/sketch";
import { RubberStamp } from "@/components/viz/doodads";
import { cn } from "@/lib/utils";

const PHASES = [
  { key: "design", letter: "D", label: "Design", accent: "var(--color-signal)", blurb: "Farm tool first: sit in the line, read miR-223, send a flag - not a diagnosis." },
  { key: "build", letter: "B", label: "Build", accent: "var(--color-butter)", blurb: "DNA catapult on a FET gate, siphon chamber, electrodes upstream." },
  { key: "test", letter: "T", label: "Test", accent: "var(--color-bio)", blurb: "Opening, current traces, and electrode baselines in milk matrix." },
  { key: "learn", letter: "L", label: "Learn", accent: "var(--color-pink)", blurb: "Ionic milk needs a baseline. One spike is not a verdict." },
];

const SIZE = 300;
const CENTER = SIZE / 2;
const RADIUS = 100;
const RING = 2 * Math.PI * RADIUS;
const INK = LINE;

/* a hand-drawn circle: four slightly-off arcs instead of a perfect <circle> */
const LOOP = `M ${CENTER} ${CENTER - RADIUS}
  C ${CENTER + 56} ${CENTER - RADIUS - 2}, ${CENTER + RADIUS + 2} ${CENTER - 54}, ${CENTER + RADIUS} ${CENTER}
  C ${CENTER + RADIUS - 2} ${CENTER + 56}, ${CENTER + 54} ${CENTER + RADIUS + 2}, ${CENTER} ${CENTER + RADIUS}
  C ${CENTER - 56} ${CENTER + RADIUS - 1}, ${CENTER - RADIUS - 1} ${CENTER + 54}, ${CENTER - RADIUS} ${CENTER}
  C ${CENTER - RADIUS + 1} ${CENTER - 56}, ${CENTER - 54} ${CENTER - RADIUS + 1}, ${CENTER} ${CENTER - RADIUS} Z`;

const PHASE_NODES = PHASES.map((_, i) => {
  const angle = (i / PHASES.length) * Math.PI * 2 - Math.PI / 2;
  return {
    x: Number((CENTER + Math.cos(angle) * RADIUS).toFixed(3)),
    y: Number((CENTER + Math.sin(angle) * RADIUS).toFixed(3)),
  };
});

/**
 * DbtlWheel - pins while you scroll through four phases. Drawn in the same
 * ink-and-flat-fill hand as the rest of the kit: a pencil loop, an accent
 * arc that fills as you go, and four inked discs lettered D · B · T · L.
 */
export function DbtlWheel({ className }: { className?: string }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const phaseRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [active, setActive] = useState(0);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setActive(Math.min(3, Math.floor(v * 4)));
  });

  const scrollToPhase = useCallback(
    (index: number) => {
      const el = ref.current;
      if (!el) return;
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const elTop = scrollTop + el.getBoundingClientRect().top;
      const scrollRange = Math.max(0, el.offsetHeight - window.innerHeight);
      const progress = (index + 0.5) / PHASES.length;
      window.scrollTo({
        top: elTop + scrollRange * progress,
        behavior: reduce ? "auto" : "smooth",
      });
      setActive(index);
    },
    [reduce],
  );

  const onPhaseKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    let next = index;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      next = (index + 1) % PHASES.length;
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      next = (index - 1 + PHASES.length) % PHASES.length;
    } else if (e.key === "Home") {
      next = 0;
    } else if (e.key === "End") {
      next = PHASES.length - 1;
    } else {
      return;
    }
    e.preventDefault();
    scrollToPhase(next);
    phaseRefs.current[next]?.focus();
  };

  const wheelY = useTransform(scrollYProgress, [0, 1], [reduce ? 0 : 24, reduce ? 0 : -24]);
  const textY = useTransform(scrollYProgress, [0, 1], [reduce ? 0 : -16, reduce ? 0 : 16]);
  const washRotate = useTransform(scrollYProgress, [0, 1], [-6, 6]);
  const phase = PHASES[active];

  return (
    <div ref={ref} className={cn("relative h-[120vh]", className)}>
      <div className="sticky top-0 flex min-h-screen flex-col items-center justify-center gap-8 overflow-hidden px-6 py-16 sm:gap-10 sm:py-20">
        {/* flat wash, re-tints per phase */}
        <motion.div
          className="pointer-events-none absolute left-1/2 top-[56%] z-0 h-[52vmin] w-[52vmin] -translate-x-[62%] -translate-y-1/2 [&_path]:transition-[fill] [&_path]:duration-700"
          style={{ rotate: washRotate }}
          aria-hidden
        >
          <Blob shape="d" fill={phase.accent} className="h-full w-full opacity-[0.12]" />
        </motion.div>

        <div className="relative max-w-2xl text-center">
          <span className="kicker text-butter">Engineering</span>
          <p className="mt-3 text-sm leading-relaxed text-ink-70 sm:text-base">
            We treated this as a farm tool first: each loop starts in the parlour and ends with a
            flag the farmer can use - or a reason to change the design.
          </p>
        </div>

        <div className="relative flex flex-col items-center gap-8 lg:flex-row lg:gap-12">
          <motion.div style={{ y: wheelY }} className="relative h-[300px] w-[300px] shrink-0">
            <RubberStamp className="doodad-stamp--cycle">cycle</RubberStamp>
            <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="absolute inset-0 h-full w-full overflow-visible" aria-hidden>
              <g filter={`url(#${SOFT_ID})`}>
                {/* pencil loop */}
                <path d={LOOP} fill="none" stroke={INK} strokeOpacity="0.28" strokeWidth="2" strokeDasharray="5 7" strokeLinecap="round" />
                {/* accent arc grows one quarter per phase */}
                <motion.circle
                  cx={CENTER}
                  cy={CENTER}
                  r={RADIUS}
                  fill="none"
                  stroke={PHASES[0].accent}
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeDasharray={RING}
                  strokeDashoffset={RING * 0.75}
                  initial={{ strokeDashoffset: RING * 0.75, stroke: PHASES[0].accent }}
                  animate={{ strokeDashoffset: RING * (1 - (active + 1) / 4), stroke: phase.accent }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  transform={`rotate(-90 ${CENTER} ${CENTER})`}
                />
                {/* arrowhead at the loop's return, drawn */}
                <path
                  d={`M ${CENTER - 10} ${CENTER - RADIUS - 9} L ${CENTER + 2} ${CENTER - RADIUS} L ${CENTER - 10} ${CENTER - RADIUS + 9}`}
                  fill="none"
                  stroke={INK}
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {PHASES.map((p, i) => {
                  const { x, y } = PHASE_NODES[i];
                  const isActive = i === active;
                  return (
                    <motion.g
                      key={p.key}
                      animate={{ scale: isActive ? 1.14 : 1 }}
                      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                      style={{ transformOrigin: `${x}px ${y}px` }}
                    >
                      {/* inked disc with a flat drop-shadow disc behind */}
                      <circle cx={x + 2} cy={y + 3} r="27" fill={INK} fillOpacity="0.12" />
                      <motion.circle
                        cx={x}
                        cy={y}
                        r="27"
                        stroke={INK}
                        strokeWidth={isActive ? 3.2 : 2.4}
                        fill="var(--color-milk)"
                        initial={{ fill: "var(--color-milk)" }}
                        animate={{ fill: isActive ? p.accent : "var(--color-milk)" }}
                        transition={{ duration: 0.4 }}
                      />
                      <ellipse cx={x - 9} cy={y - 11} rx="6" ry="3.5" fill="#fffdf5" fillOpacity="0.8" transform={`rotate(-35 ${x - 9} ${y - 11})`} />
                      <text
                        x={x}
                        y={y + 1}
                        textAnchor="middle"
                        dominantBaseline="central"
                        className="font-display"
                        fontSize="24"
                        fill="var(--color-ink)"
                        fontWeight={isActive ? 700 : 400}
                      >
                        {p.letter}
                      </text>
                    </motion.g>
                  );
                })}
              </g>
            </svg>

            <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
              <p className="kicker text-ink-40">cycle</p>
              <p className="font-display text-2xl text-ink">DBTL</p>
            </div>
          </motion.div>

          <motion.div style={{ y: textY }} className="max-w-sm px-2 text-center lg:text-left">
            <div
              role="radiogroup"
              aria-label="DBTL cycle phases"
              className="mb-5 flex flex-wrap justify-center gap-2 lg:justify-start"
            >
              {PHASES.map((p, i) => {
                const isActive = i === active;
                return (
                  <button
                    key={p.key}
                    ref={(el) => {
                      phaseRefs.current[i] = el;
                    }}
                    type="button"
                    role="radio"
                    aria-checked={isActive}
                    aria-current={isActive ? "step" : undefined}
                    aria-label={`${p.label}: ${p.blurb}`}
                    onClick={() => scrollToPhase(i)}
                    onKeyDown={(e) => onPhaseKeyDown(e, i)}
                    className={cn(
                      "rounded-full border-2 px-3 py-1.5 text-xs font-semibold uppercase tracking-widest transition-colors",
                      isActive
                        ? "border-ink bg-milk text-ink shadow-[0_0_0_2px_var(--color-milk),0_0_0_4px_var(--color-ink)]"
                        : "border-ink/20 bg-transparent text-ink-55 hover:border-ink/45 hover:text-ink",
                    )}
                    style={isActive ? { background: `color-mix(in srgb, ${p.accent} 22%, var(--color-milk))` } : undefined}
                  >
                    {p.label}
                  </button>
                );
              })}
            </div>

            <motion.div
              key={active}
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.35 }}
              aria-live="polite"
            >
              <div
                className="mb-3 inline-flex items-center gap-2 rounded-full px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-widest"
                style={{
                  background: `color-mix(in srgb, ${phase.accent} 22%, transparent)`,
                  color: "var(--color-ink)",
                }}
              >
                Phase {active + 1} / 4
              </div>
              <h4 className="font-display text-3xl text-ink">{phase.label}</h4>
              <p className="mt-2 leading-relaxed text-ink-70">{phase.blurb}</p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
