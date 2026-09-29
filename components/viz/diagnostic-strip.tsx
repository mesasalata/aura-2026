"use client";

import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

/**
 * DiagnosticStrip - lateral-flow style strip. On view: sample applied →
 * capillary fluid travels across → control + test signal bands appear.
 */
export function DiagnosticStrip({
  className,
  result = "positive",
}: {
  className?: string;
  result?: "positive" | "negative";
}) {
  const reduce = useReducedMotion();

  const bandTransition = { duration: 0.5, ease: "easeOut" as const };

  return (
    <div className={cn("w-full", className)}>
      <svg viewBox="0 0 400 120" className="w-full" role="img" aria-label="Lateral-flow diagnostic strip showing sample flow and signal bands">
        {/* Strip housing */}
        <rect x="8" y="34" width="384" height="52" rx="10" fill="var(--color-ink-3)" stroke="var(--color-slate)" />
        {/* Membrane window */}
        <rect x="120" y="42" width="230" height="36" rx="6" fill="var(--color-milk)" />
        {/* Sample well */}
        <circle cx="60" cy="60" r="20" fill="var(--color-ink-2)" stroke="var(--color-signal)" strokeOpacity="0.5" />
        <text x="60" y="100" textAnchor="middle" className="fill-milk/50" fontSize="9" fontFamily="var(--font-mono)">
          sample
        </text>

        {/* Capillary flow fill */}
        <motion.rect
          x="120"
          y="42"
          height="36"
          rx="6"
          fill="url(#flow)"
          initial={reduce ? { width: 230 } : { width: 0 }}
          whileInView={{ width: 230 }}
          viewport={{ once: true }}
          transition={{ duration: 1.6, ease: "easeInOut" }}
        />

        {/* Control band (always appears) */}
        <motion.rect
          x="250"
          y="42"
          width="10"
          height="36"
          fill="var(--color-signal)"
          initial={reduce ? { opacity: 1 } : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ ...bandTransition, delay: reduce ? 0 : 1.1 }}
        />
        {/* Test band (colour depends on result) */}
        <motion.rect
          x="300"
          y="42"
          width="10"
          height="36"
          fill={result === "positive" ? "var(--color-pink)" : "transparent"}
          initial={reduce ? { opacity: 1 } : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ ...bandTransition, delay: reduce ? 0 : 1.4 }}
        />

        {/* Labels */}
        <text x="255" y="100" textAnchor="middle" className="fill-milk/50" fontSize="9" fontFamily="var(--font-mono)">C</text>
        <text x="305" y="100" textAnchor="middle" className="fill-milk/50" fontSize="9" fontFamily="var(--font-mono)">T</text>

        <defs>
          <linearGradient id="flow" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="var(--color-signal)" stopOpacity="0.05" />
            <stop offset="100%" stopColor="var(--color-signal)" stopOpacity="0.22" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}
