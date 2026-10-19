"use client";

import { motion, type MotionValue } from "motion/react";
import { cn } from "@/lib/utils";

/** Solid pink-on-cream tints, lightest first. Solid so overlaps merge instead of darkening. */
export const COLONY_TONE = [
  "color-mix(in srgb, var(--color-pink-soft) 48%, var(--color-cream))",
  "color-mix(in srgb, var(--color-pink-soft) 82%, var(--color-cream))",
  "color-mix(in srgb, var(--color-pink) 64%, var(--color-cream))",
  "color-mix(in srgb, var(--color-pink) 80%, var(--color-cream))",
];

export type ColonyDot = { x: number; y: number; r: number; tone: 0 | 1 | 2 | 3; d: number };

/* Park–Miller: the same dots on the server and the client. */
function seeded(seed: number) {
  let s = seed;
  return () => (s = (s * 16807) % 2147483647) / 2147483647;
}
const round = (v: number) => Math.round(v * 100) / 100;

/**
 * A colony growing out of one edge point. `sx`/`sy` stretch it along the edge
 * (and point it into the frame); `d` rises with distance so it spreads outward.
 */
function grow(ax: number, ay: number, sx: number, sy: number, count: number, seed: number): ColonyDot[] {
  const rand = seeded(seed);
  const dots: ColonyDot[] = [];
  // base: big lobes hugging the edge, so the mass reads as one colony and not bubbles
  for (let i = 0; i < count / 6; i++) {
    const a = rand() * Math.PI * 0.5;
    const k = 0.15 + rand() * 0.6;
    dots.push({ x: round(ax + Math.cos(a) * k * sx), y: round(ay + Math.sin(a) * k * sy), r: round(12 + rand() * 10), tone: 0, d: round(k * 0.5) });
  }
  for (let i = 0; i < count; i++) {
    const a = rand() * Math.PI * 0.5;
    const k = Math.sqrt(rand());
    const big = 1 - k;
    const roll = rand();
    const tone = roll < 0.5 ? 0 : roll < 0.88 ? 1 : 2;
    dots.push({
      x: round(ax + Math.cos(a) * k * sx),
      y: round(ay + Math.sin(a) * k * sy),
      r: round((tone === 0 ? 6 + big * 12 : tone === 1 ? 3 + big * 7 : 2 + big * 4) * (0.7 + rand() * 0.5)),
      tone,
      d: round(k * 0.6),
    });
  }
  // pits: small deep dots sitting on the mass, like the darker cells in a colony
  for (let i = 0; i < count / 3; i++) {
    const a = rand() * Math.PI * 0.5;
    const k = Math.sqrt(rand()) * 0.8;
    dots.push({ x: round(ax + Math.cos(a) * k * sx), y: round(ay + Math.sin(a) * k * sy), r: round(0.8 + rand() * 1.8), tone: 3, d: round(k * 0.6 + 0.05) });
  }
  // spores: loose dots just past the edge of the mass
  for (let i = 0; i < count / 4; i++) {
    const a = rand() * Math.PI * 0.5;
    const k = 1.05 + rand() * 0.35;
    dots.push({ x: round(ax + Math.cos(a) * k * sx), y: round(ay + Math.sin(a) * k * sy), r: round(0.7 + rand() * 1.3), tone: 2, d: round(0.5 + rand() * 0.12) });
  }
  return dots.sort((p, q) => p.tone - q.tone);
}

/** Crop a mass to the part on the frame side of its anchor edge (the floor, and its own side wall). */
function mass(dots: ColonyDot[], side: "left" | "right") {
  const top = Math.floor(Math.min(...dots.map((c) => c.y - c.r)));
  const x0 = side === "left" ? 0 : Math.floor(Math.min(...dots.map((c) => c.x - c.r)));
  const x1 = side === "left" ? Math.ceil(Math.max(...dots.map((c) => c.x + c.r))) : 160;
  return { dots, side, viewBox: `${x0} ${top} ${x1 - x0} ${100 - top}` };
}

/* Laid out on a 160×100 frame: a big mass under the herd, a smaller one under the copy; they meet along the floor. */
const MASSES = [
  { ...mass(grow(0, 100, 112, -30, 80, 7), "left"), className: "left-0 w-[78%] max-lg:w-[92%]" },
  { ...mass(grow(160, 100, -70, -24, 50, 23), "right"), className: "right-0 w-[50%] max-lg:w-[60%]" },
];

/* Lobes along the whole floor, so the bloom meets the seam below as one pink edge.
   `d` stays under ~0.6 so every lobe is full size by the end of the chapter. */
const FLOOR: ColonyDot[] = (() => {
  const rand = seeded(41);
  const dots: ColonyDot[] = [];
  for (let x = -4; x <= 164; x += 7 + rand() * 3) {
    dots.push({ x: round(x), y: round(102.5 + rand() * 1.5), r: round(6 + rand() * 4), tone: 0, d: round(0.25 + rand() * 0.35) });
  }
  return dots;
})();

/** The bloom's floor tone. The seam under the herd beat starts on it. */
export const COLONY_FLOOR = COLONY_TONE[0];

/**
 * InfectionBloom - the herd beat's backdrop: pink colonies creeping in along
 * the floor as `t` (0–1, the share of the herd marked) rises.
 */
export function InfectionBloom({ t, className }: { t: MotionValue<number>; className?: string }) {
  return (
    <motion.div
      aria-hidden
      style={{ "--t": t } as React.ComponentProps<typeof motion.div>["style"]}
      className={cn("colony pointer-events-none absolute inset-0 overflow-hidden", className)}
    >
      {MASSES.map((m) => (
        <svg
          key={m.side}
          viewBox={m.viewBox}
          preserveAspectRatio={m.side === "left" ? "xMinYMax meet" : "xMaxYMax meet"}
          className={cn("absolute bottom-0 h-auto", m.className)}
        >
          {m.dots.map((c, i) => (
            <circle key={i} cx={c.x} cy={c.y} r={c.r} fill={COLONY_TONE[c.tone]} style={{ "--d": c.d } as React.CSSProperties} />
          ))}
        </svg>
      ))}
      <svg viewBox="0 90 160 10" preserveAspectRatio="xMidYMax slice" className="absolute inset-x-0 bottom-0 h-[clamp(3.5rem,6.25vw,6rem)] w-full">
        {FLOOR.map((c, i) => (
          <circle key={i} cx={c.x} cy={c.y} r={c.r} fill={COLONY_FLOOR} style={{ "--d": c.d } as React.CSSProperties} />
        ))}
      </svg>
    </motion.div>
  );
}
