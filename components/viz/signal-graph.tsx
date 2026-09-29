"use client";

import { motion, useTransform, type MotionValue } from "motion/react";
import { cn } from "@/lib/utils";

const CURVE = "M40 168 C90 166 130 164 170 158 C210 150 240 120 270 84 C300 48 340 40 384 34";
const AREA = `${CURVE} L384 184 L40 184 Z`;

/**
 * SignalRevealGraph - the signal trace draws itself as you scroll. Clean stroke,
 * no glow. Area fills beneath; a marker lands where the trace crosses threshold.
 */
export function SignalRevealGraph({
  className,
  progress,
}: {
  className?: string;
  progress: MotionValue<number>;
}) {
  const pathLength = useTransform(progress, [0, 1], [0, 1]);
  const areaOpacity = useTransform(progress, [0, 0.65, 1], [0, 0, 1]);
  const markerOpacity = useTransform(progress, [0, 0.52, 0.64, 1], [0, 0, 1, 1]);
  const markerScale = useTransform(progress, [0, 0.52, 0.66, 1], [0.2, 0.2, 1, 1]);

  return (
    <svg
      viewBox="0 0 400 220"
      className={cn("w-full", className)}
      role="img"
      aria-label="Signal intensity rising above a detection threshold over time"
    >
      <defs>
        <linearGradient id="sig" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="var(--color-signal)" />
          <stop offset="58%" stopColor="var(--color-signal)" />
          <stop offset="72%" stopColor="var(--color-pink)" />
          <stop offset="100%" stopColor="var(--color-pink)" />
        </linearGradient>
        <linearGradient id="sigArea" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--color-pink)" stopOpacity="0.14" />
          <stop offset="55%" stopColor="var(--color-signal)" stopOpacity="0.06" />
          <stop offset="100%" stopColor="var(--color-signal)" stopOpacity="0" />
        </linearGradient>
      </defs>

      <line x1="40" y1="20" x2="40" y2="184" stroke="currentColor" strokeOpacity="0.18" />
      <line x1="40" y1="184" x2="384" y2="184" stroke="currentColor" strokeOpacity="0.18" />
      <text x="20" y="110" fontSize="9" fontFamily="var(--font-sans)" fill="currentColor" opacity="0.45" transform="rotate(-90 20 110)">signal</text>
      <text x="360" y="200" fontSize="9" fontFamily="var(--font-sans)" fill="currentColor" opacity="0.45">time</text>

      <line x1="40" y1="96" x2="384" y2="96" stroke="var(--color-coral)" strokeOpacity="0.65" strokeDasharray="5 5" />
      <text x="292" y="90" fontSize="9" fontFamily="var(--font-sans)" fontWeight="600" fill="var(--color-coral)">detection threshold</text>

      <motion.path d={AREA} fill="url(#sigArea)" style={{ opacity: areaOpacity }} />

      <motion.path
        d={CURVE}
        fill="none"
        stroke="url(#sig)"
        strokeWidth="3"
        strokeLinecap="round"
        style={{ pathLength }}
      />

      <motion.circle
        cx="252"
        cy="96"
        r="5.5"
        fill="var(--color-pink)"
        style={{ opacity: markerOpacity, scale: markerScale, transformOrigin: "252px 96px" }}
      />
    </svg>
  );
}
