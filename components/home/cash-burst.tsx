"use client";

import { motion, useReducedMotion, useTransform, type MotionValue } from "motion/react";
import { Art } from "@/components/viz/art";
import type { ArtId, ArtMotion } from "@/lib/art";

/**
 * What the bill is made of, on the flanks of the “very loud bill” beat: money
 * on one side, the three costs the paragraph names (less milk, the vet, the
 * invoice) mixed in. Each prop tumbles in from the edge once, then only bobs.
 */

type Prop = { id: ArtId; x: number; y: number; size: number; tilt: number; delay: number; idle: ArtMotion };

const PROPS: Record<"left" | "right", Prop[]> = {
  left: [
    { id: "prop-note", x: -10, y: -150, size: 150, tilt: -14, delay: 0, idle: "sway" },
    { id: "prop-receipt", x: 40, y: 10, size: 132, tilt: 8, delay: 0.05, idle: "bob" },
    { id: "prop-bottle", x: -30, y: 165, size: 104, tilt: -6, delay: 0.1, idle: "float" },
  ],
  right: [
    { id: "prop-coin", x: 20, y: -160, size: 112, tilt: 12, delay: 0.02, idle: "float" },
    { id: "prop-vetbag", x: -30, y: 0, size: 138, tilt: -7, delay: 0.07, idle: "bob" },
    { id: "prop-stack", x: 30, y: 165, size: 110, tilt: 6, delay: 0.12, idle: "breathe" },
  ],
};

export function CashBurst({ progress, side }: { progress: MotionValue<number>; side: "left" | "right" }) {
  const reduce = useReducedMotion();
  const dir = side === "left" ? -1 : 1;
  return (
    <div className="pointer-events-none relative h-full w-full" aria-hidden>
      {PROPS[side].map((prop) => (
        <Tumble key={prop.id} prop={prop} dir={dir} progress={progress} reduce={!!reduce} />
      ))}
    </div>
  );
}

function Tumble({ prop, dir, progress, reduce }: { prop: Prop; dir: -1 | 1; progress: MotionValue<number>; reduce: boolean }) {
  const t = useTransform(progress, [0.04 + prop.delay, 0.3 + prop.delay], [reduce ? 1 : 0, 1]);
  const x = useTransform(t, [0, 1], [prop.x + dir * 220, prop.x]);
  const rotate = useTransform(t, [0, 0.7, 1], [prop.tilt + dir * 60, prop.tilt - dir * 6, prop.tilt]);
  const scale = useTransform(t, [0, 0.7, 1], [0.5, 1.08, 1]);
  const opacity = useTransform(progress, [0, 0.04 + prop.delay, 0.12 + prop.delay, 0.62, 0.8, 1], [0, 0, 1, 1, 0, 0]);

  return (
    <motion.div
      className="absolute left-1/2 top-1/2"
      style={{ x, y: prop.y, rotate, scale, opacity, marginLeft: -prop.size / 2, marginTop: -prop.size / 2 }}
    >
      <Art id={prop.id} size={prop.size} motion={prop.idle} delay={prop.delay * 10} className="sticker" />
    </motion.div>
  );
}
