"use client";

import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

/**
 * Floaty - an endless, gentle bob + drift for decorative accents (icons, dots,
 * small shapes). Deterministic per `seed` so several can coexist without moving
 * in lockstep. Respects reduced-motion (renders static).
 */
export function Floaty({
  children,
  className,
  amount = 12,
  duration = 7,
  delay = 0,
  rotate = 0,
}: {
  children?: React.ReactNode;
  className?: string;
  /** Vertical travel in px. */
  amount?: number;
  duration?: number;
  delay?: number;
  /** Degrees of gentle sway. */
  rotate?: number;
}) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={cn(className)}
      animate={{
        y: [0, -amount, 0, amount * 0.6, 0],
        rotate: rotate ? [0, rotate, 0, -rotate, 0] : undefined,
      }}
      transition={{ duration, delay, repeat: Infinity, ease: "easeInOut" }}
    >
      {children}
    </motion.div>
  );
}

/**
 * AuraDrift - a soft coloured bloom that slowly breathes and drifts in place.
 * Use behind section content for ambient depth. Colour comes from `className`
 * (e.g. an `aura-bloom` utility) or inline `style`.
 */
export function AuraDrift({
  className,
  style,
  duration = 16,
  delay = 0,
  drift = 24,
}: {
  className?: string;
  style?: React.CSSProperties;
  duration?: number;
  delay?: number;
  /** Positional drift in px. */
  drift?: number;
}) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={cn(className)} style={style} aria-hidden />;
  return (
    <motion.div
      aria-hidden
      className={cn(className)}
      style={style}
      animate={{
        x: [0, drift, -drift * 0.5, 0],
        y: [0, -drift * 0.7, drift * 0.4, 0],
        scale: [1, 1.08, 0.96, 1],
        opacity: [0.85, 1, 0.8, 0.85],
      }}
      transition={{ duration, delay, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}
