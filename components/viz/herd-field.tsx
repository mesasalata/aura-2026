"use client";

import { motion, useTransform, type MotionValue } from "motion/react";
import { COLONY_TONE, InfectionBloom, type ColonyDot } from "@/components/viz/infection-bloom";
import { ART, artUrl } from "@/lib/art";
import { cn } from "@/lib/utils";

export const HERD_TOTAL = 24;
/** About 1 in 5 of the 24 cows. */
export const HERD_STAGE_ONE = 5;
/** About 70% of the herd, the top of the reported 40–70% range. */
export const HERD_STAGE_TWO = 17;

/**
 * Progress → how many cows have been marked. Two chapters with a hold between:
 * mark a third, sit with it, then keep going to roughly half the herd.
 */
export const HERD_FILL_IN = [0.1, 0.44, 0.58, 0.86];
export const HERD_FILL_OUT = [0, HERD_STAGE_ONE, HERD_STAGE_ONE, HERD_STAGE_TWO];

/* Cell indices in the order they get marked - scattered, never a row. */
const MARK_ORDER = [14, 3, 21, 8, 17, 1, 11, 22, 5, 19, 9, 15, 0, 12, 23, 6, 18, 2, 10, 20, 4, 16, 7, 13];
const RANK = MARK_ORDER.reduce<number[]>((acc, cell, rank) => ((acc[cell] = rank), acc), []);

/* Hand-placed feel: fixed per-cell facing, nudge and size (no Math.random → no hydration drift). */
const FLIP = [0, 1, 0, 0, 1, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 1, 1, 0, 0, 1, 0, 0, 1, 0];
const NUDGE = [2, -3, 1, -2, 3, 0, -1, 2, -3, 1, 0, -2, 3, -1, 2, 0, -2, 1, 3, -3, 0, 2, -1, 1];
const SIZE = [0.96, 1.02, 0.94, 1, 1.04, 0.97, 1.01, 0.95, 1.03, 0.98, 1, 0.96, 1.02, 0.99, 0.95, 1.03, 0.97, 1.01, 0.94, 1, 1.02, 0.98, 0.96, 1.04];
const TURN = [0, 140, 250, 60, 310, 190, 90, 220, 20, 280, 160, 330, 110, 40, 200, 300, 70, 170, 260, 10, 230, 120, 350, 80];

/*
 * One infection colony, in cell units (the cell is 0–100). It stays inside its
 * own cell so healthy cows keep clean cream around them; sick neighbours touch
 * and merge. Solid tints, so overlaps join into one patch instead of darkening.
 * `d` is how far into the cow's own marking each circle starts to grow.
 */
const COLONY: ColonyDot[] = [
  { x: 50, y: 55, r: 35.5, tone: 0, d: 0 },
  { x: 28, y: 61, r: 20, tone: 0, d: 0.1 },
  { x: 72, y: 50, r: 22.5, tone: 0, d: 0.12 },
  { x: 43, y: 31, r: 18.5, tone: 0, d: 0.2 },
  { x: 65, y: 78, r: 18.5, tone: 0, d: 0.24 },
  { x: 13, y: 46, r: 12, tone: 0, d: 0.34 },
  { x: 88, y: 66, r: 12.5, tone: 0, d: 0.38 },
  { x: 35, y: 83, r: 13.5, tone: 0, d: 0.42 },
  { x: 46, y: 58, r: 18.5, tone: 1, d: 0.14 },
  { x: 62, y: 44, r: 12.5, tone: 1, d: 0.24 },
  { x: 34, y: 72, r: 10, tone: 1, d: 0.32 },
  { x: 76, y: 66, r: 8.5, tone: 1, d: 0.4 },
  { x: 55, y: 61, r: 5, tone: 3, d: 0.3 },
  { x: 38, y: 48, r: 4, tone: 3, d: 0.38 },
  { x: 67, y: 38, r: 3.5, tone: 3, d: 0.46 },
  { x: 26, y: 73, r: 3.5, tone: 3, d: 0.5 },
  { x: 4, y: 31, r: 3.5, tone: 1, d: 0.56 },
  { x: 96, y: 38, r: 4, tone: 1, d: 0.6 },
  { x: 84, y: 89, r: 3, tone: 1, d: 0.62 },
  { x: 9, y: 83, r: 3.5, tone: 1, d: 0.58 },
];

/** How far (0–1) cow `index` has been marked. */
function useMark(fill: MotionValue<number>, index: number) {
  const rank = RANK[index];
  // Each cow is marked over one "unit" of fill, so the marking travels cow to cow.
  return useTransform(fill, (f) => Math.min(1, Math.max(0, f - rank)));
}

function Colony({ index, fill }: { index: number; fill: MotionValue<number> }) {
  const t = useMark(fill, index);
  return (
    <div className="relative aspect-square" style={{ transform: `translateY(${NUDGE[index]}%)` }}>
      <motion.svg
        viewBox="-50 -50 200 200"
        style={{ "--t": t } as React.ComponentProps<typeof motion.svg>["style"]}
        className="colony absolute left-[-50%] top-[-50%] h-[200%] w-[200%] overflow-visible"
      >
        <g transform={`rotate(${TURN[index]} 50 55)`}>
          {COLONY.map((c, i) => (
            <circle key={i} cx={c.x} cy={c.y} r={c.r} fill={COLONY_TONE[c.tone]} style={{ "--d": c.d } as React.CSSProperties} />
          ))}
        </g>
      </motion.svg>
    </div>
  );
}

function HerdCow({ index, fill }: { index: number; fill: MotionValue<number> }) {
  const t = useMark(fill, index);
  const healthy = useTransform(t, (v) => 1 - v);
  const scale = useTransform(t, (v) => 1 + v * 0.07);
  const sick = ART.cowSick;

  return (
    <div
      className="relative aspect-square"
      style={{ transform: `translateY(${NUDGE[index]}%) scale(${SIZE[index]})` }}
    >
      {/* breathe animates `translate`, the flip uses `scale`, the mark bump uses `transform` - no overrides */}
      <motion.div
        style={{ scale, animationDelay: `${(index % 7) * -0.9}s` }}
        className={cn("relative h-full w-full animate-herd-breathe", FLIP[index] === 1 && "-scale-x-100")}
      >
        <motion.img
          src={artUrl("cow")}
          alt=""
          width={ART.cow.w}
          height={ART.cow.h}
          draggable={false}
          style={sick ? { opacity: healthy } : undefined}
          className="pointer-events-none absolute inset-0 h-full w-full select-none object-contain"
        />
        {sick && (
          <motion.img
            src={artUrl("cowSick")}
            alt=""
            width={sick.w}
            height={sick.h}
            draggable={false}
            style={{ opacity: t }}
            className="pointer-events-none absolute inset-0 h-full w-full select-none object-contain"
          />
        )}
      </motion.div>
    </div>
  );
}

const GRID = "grid grid-cols-6 gap-x-1.5 gap-y-0.5 sm:gap-x-3 sm:gap-y-2";

/** Floor colonies for the 40–70% chapter. Still through “1 in 5”. */
export function HerdBloom({ progress }: { progress: MotionValue<number> }) {
  const share = useTransform(progress, [0, 0.58, 0.86, 1], [0, 0, 1, 1]);
  return <InfectionBloom t={share} />;
}

/**
 * HerdField - twenty-four cows on cream. As `progress` runs, cows turn sick one
 * at a time in a scattered order, each growing a pink colony behind it that
 * merges with its neighbours: five for about 1 in 5, then on to seventeen.
 */
export function HerdField({ progress, className }: { progress: MotionValue<number>; className?: string }) {
  const fill = useTransform(progress, HERD_FILL_IN, HERD_FILL_OUT);

  return (
    <div
      role="img"
      aria-label={`A herd of ${HERD_TOTAL} cows; as you scroll, ${HERD_STAGE_ONE} and then ${HERD_STAGE_TWO} of them are marked as infected`}
      className={cn("relative pb-5", className)}
    >
      <div aria-hidden className={cn(GRID, "absolute inset-x-0 top-0")}>
        {Array.from({ length: HERD_TOTAL }, (_, i) => (
          <Colony key={i} index={i} fill={fill} />
        ))}
      </div>
      <div className={cn(GRID, "relative")}>
        {Array.from({ length: HERD_TOTAL }, (_, i) => (
          <HerdCow key={i} index={i} fill={fill} />
        ))}
      </div>
    </div>
  );
}
