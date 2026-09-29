"use client";

import { motion, useTransform, type MotionValue } from "motion/react";
import { LINE } from "@/components/viz/sketch";
import { DoodadFrame, HandCaption } from "@/components/viz/doodads";
import { ART, artUrl } from "@/lib/art";
import { cn } from "@/lib/utils";

export const HERD_TOTAL = 24;
/** 1 in 3 at any given time. */
export const HERD_STAGE_ONE = 8;
/** ~55% over a year (47–65% reported range). */
export const HERD_STAGE_TWO = 13;

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

/* Where the sparkles sit around a marked cow (percent of the cell) and how big they are. */
const SPARKS = [
  { x: 8, y: 18, s: 1, rot: 10, pink: true },
  { x: 90, y: 12, s: 0.7, rot: -20, pink: false },
  { x: 96, y: 62, s: 0.85, rot: 25, pink: true },
  { x: 4, y: 74, s: 0.6, rot: -8, pink: false },
];

function HerdCow({ index, fill }: { index: number; fill: MotionValue<number> }) {
  const rank = RANK[index];
  // Each cow flushes over one "unit" of fill, so the marking travels cow to cow.
  const t = useTransform(fill, (f) => Math.min(1, Math.max(0, f - rank)));
  const healthy = useTransform(t, (v) => 1 - v);
  const scale = useTransform(t, (v) => 1 + v * 0.07);
  /* a pink glow that follows the cow's outline, instead of a disc behind it */
  const glow = useTransform(t, (v) => {
    if (v < 0.02) return "none";
    const px = (v * 5).toFixed(2);
    return `drop-shadow(0 0 ${px}px var(--color-pink-soft)) drop-shadow(0 0 ${px}px var(--color-pink-soft))`;
  });
  const sick = ART.cowSick;

  return (
    <div
      className="relative aspect-square"
      style={{ transform: `translateY(${NUDGE[index]}%) scale(${SIZE[index]})` }}
    >
      {SPARKS.map((sp, i) => (
        <Spark key={i} {...sp} t={t} order={i} />
      ))}
      {/* breathe animates `translate`, the flip uses `scale`, the mark bump uses `transform` - no overrides */}
      <motion.div
        style={{ scale, filter: glow, animationDelay: `${(index % 7) * -0.9}s` }}
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

/** A drawn four-point sparkle that pops in as the cow is marked, staggered by `order`. */
function Spark({ x, y, s, rot, pink, t, order }: (typeof SPARKS)[number] & { t: MotionValue<number>; order: number }) {
  const from = 0.35 + order * 0.15;
  const pop = useTransform(t, [from, Math.min(1, from + 0.3)], [0, 1], { clamp: true });
  const scale = useTransform(pop, (v) => 0.2 + v * 0.8);
  return (
    <motion.svg
      viewBox="0 0 24 24"
      aria-hidden
      className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-1/2"
      style={{ left: `${x}%`, top: `${y}%`, opacity: pop, scale, rotate: rot, width: `${22 * s}%`, height: `${22 * s}%` }}
    >
      <path
        d="M 12 2 C 12.6 8, 15 10.6, 22 12 C 15 13.4, 12.6 16, 12 22 C 11.4 16, 9 13.4, 2 12 C 9 10.6, 11.4 8, 12 2 Z"
        fill={pink ? "var(--color-pink-soft)" : "#fffdf5"}
        stroke={LINE}
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </motion.svg>
  );
}

/**
 * HerdField - twenty-four cows on cream. As `progress` runs, cows flush pink
 * one at a time in a scattered order: eight for "1 in 3", then on to thirteen.
 */
export function HerdField({ progress, className }: { progress: MotionValue<number>; className?: string }) {
  const fill = useTransform(progress, HERD_FILL_IN, HERD_FILL_OUT);

  return (
    <DoodadFrame
      role="img"
      aria-label={`A herd of ${HERD_TOTAL} cows; as you scroll, ${HERD_STAGE_ONE} and then ${HERD_STAGE_TWO} of them are marked as infected`}
      className={cn("pb-5", className)}
    >
      <div className="grid grid-cols-6 gap-x-1.5 gap-y-0.5 sm:gap-x-3 sm:gap-y-2">
        {Array.from({ length: HERD_TOTAL }, (_, i) => (
          <HerdCow key={i} index={i} fill={fill} />
        ))}
      </div>
      <HandCaption className="doodad-caption--herd">n = herd</HandCaption>
    </DoodadFrame>
  );
}
