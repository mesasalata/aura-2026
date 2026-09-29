"use client";

import { motion, useReducedMotion, useTransform, type MotionValue } from "motion/react";
import { LINE as PEN, SHINE, SOFT_ID } from "@/components/viz/sketch";
import { Asterisk, DoodadFrame, HandCaption } from "@/components/viz/doodads";
import { cn } from "@/lib/utils";

// A falling trace with a few dead-cat bounces. Slightly uneven steps so it reads drawn, not plotted.
const LINE = "M6 24 L21 31 L33 25 L47 41 L59 35 L73 59 L87 51 L101 75 L115 67 L129 97 L143 89 L154 111";
const AREA = `${LINE} L154 128 L6 128 Z`;

/**
 * PlungeChart - the bill going the wrong way. Flat coral line, flat wash
 * underneath, light pencil grid; the line draws and a milk-drop marker lands
 * at the end, all scrubbed by `progress`.
 */
export function PlungeChart({ className, progress }: { className?: string; progress: MotionValue<number> }) {
  const reduce = useReducedMotion();
  const start = reduce ? 1 : 0;
  const pathLength = useTransform(progress, [0, 0.1, 0.62, 1], [start, start, 1, 1]);
  const areaOpacity = useTransform(progress, [0, 0.3, 0.66, 1], [start, start, 1, 1]);
  const markerScale = useTransform(progress, [0, 0.6, 0.7, 1], [start, start, 1, 1]);

  return (
    <DoodadFrame className={className}>
      <HandCaption className="doodad-caption--est">
        <Asterisk className="doodad-asterisk--inline" />
        est.
      </HandCaption>
    <svg viewBox="0 0 168 136" className="w-full overflow-visible text-ink" aria-hidden>
      <defs>
        <linearGradient id="plungeWash" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--color-coral)" stopOpacity="0.28" />
          <stop offset="100%" stopColor="var(--color-coral)" stopOpacity="0.02" />
        </linearGradient>
      </defs>

      {/* pencil grid: slightly off-horizontal, short of the edges */}
      {[26, 52, 78, 104].map((y, i) => (
        <path
          key={y}
          d={`M 8 ${y + (i % 2 ? 0.6 : -0.4)} L 152 ${y + (i % 2 ? -0.5 : 0.5)}`}
          stroke="currentColor"
          strokeOpacity="0.12"
          strokeWidth="0.9"
          strokeLinecap="round"
          strokeDasharray="3 2.4"
        />
      ))}
      <path d="M 6 128.6 L 162 128.2" stroke={PEN} strokeOpacity="0.6" strokeWidth="1.6" strokeLinecap="round" filter={`url(#${SOFT_ID})`} />

      <motion.path d={AREA} fill="url(#plungeWash)" style={{ opacity: areaOpacity }} filter={`url(#${SOFT_ID})`} />
      <motion.path
        d={LINE}
        fill="none"
        stroke="var(--color-coral)"
        strokeWidth="4.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ pathLength }}
        filter={`url(#${SOFT_ID})`}
      />

      {/* a drop of milk hanging off the end of the line, resting on the floor */}
      <motion.g style={{ scale: markerScale, transformOrigin: "154px 108px" }}>
        <path
          d="M 154 108 C 158.5 114.5, 161 117.5, 161 121 C 161 125, 157.8 128, 154 128 C 150.2 128, 147 125, 147 121 C 147 117.5, 149.5 114.5, 154 108 Z"
          fill="var(--color-milk)"
          stroke={PEN}
          strokeWidth="1.8"
          strokeLinejoin="round"
          filter={`url(#${SOFT_ID})`}
        />
        <ellipse cx="151" cy="120" rx="1.6" ry="3" fill={SHINE} transform="rotate(14 151 120)" />
      </motion.g>
    </svg>
    </DoodadFrame>
  );
}
