"use client";

import { motion, useTransform, type MotionValue } from "motion/react";
import { cn } from "@/lib/utils";

const LINE = "M36 36 L 360 168";

/** Milk quality falls as somatic cells climb - the mockup's second graph. */
export function QualityPlungeGraph({
  className,
  progress,
}: {
  className?: string;
  progress: MotionValue<number>;
}) {
  const pathLength = useTransform(progress, [0, 1], [0, 1]);
  const markerOpacity = useTransform(progress, [0, 0.7, 1], [0, 0, 1]);

  return (
    <svg
      viewBox="0 0 400 200"
      className={cn("w-full", className)}
      role="img"
      aria-label="Milk quality falling as somatic cell count rises"
    >
      <line x1="36" y1="20" x2="36" y2="176" stroke="currentColor" strokeOpacity="0.18" />
      <line x1="36" y1="176" x2="376" y2="176" stroke="currentColor" strokeOpacity="0.18" />
      <text
        x="16"
        y="108"
        fontSize="9"
        fontFamily="var(--font-sans)"
        fill="currentColor"
        opacity="0.45"
        transform="rotate(-90 16 108)"
      >
        milk quality
      </text>
      <text x="268" y="194" fontSize="9" fontFamily="var(--font-sans)" fill="currentColor" opacity="0.45">
        somatic cells
      </text>
      <motion.path
        d={LINE}
        fill="none"
        stroke="var(--color-coral)"
        strokeWidth="3"
        strokeLinecap="round"
        style={{ pathLength }}
      />
      <motion.circle
        cx="360"
        cy="168"
        r="5.5"
        fill="var(--color-pink)"
        style={{ opacity: markerOpacity }}
      />
    </svg>
  );
}
