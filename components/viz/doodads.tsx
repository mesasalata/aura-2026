"use client";

import "@/app/doodad-viz.css";
import { LINE, SHINE, SOFT_ID } from "@/components/viz/sketch";
import { cn } from "@/lib/utils";

const SOFT = `url(#${SOFT_ID})`;
const TAPE_FILL = "#f3e4c4";
const TAPE_PINK = "#f6d4c8";

/** Masking tape for the corner of a card. */
export function Tape({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 96 20" aria-hidden className={cn("doodad doodad-tape", className)}>
      <g filter={SOFT} strokeLinejoin="round">
        <path
          d="M 2 5 L 6 2.4 L 9 5.2 L 14 1.8 L 22 3.2 L 40 2.2 L 62 3.4 L 78 2 L 84 4.6 L 88 2.8 L 93 5.4 L 94 8.2 L 92 15.6 L 87 17.8 L 82 14.6 L 74 17.2 L 52 16.2 L 30 17.6 L 18 15.4 L 11 18 L 6 15.2 L 2.4 16.8 Z"
          fill={TAPE_FILL}
          stroke={LINE}
          strokeWidth="1.05"
          strokeOpacity="0.4"
        />
        <path
          d="M 16 5 C 30 7.4, 48 4.6, 70 6.8"
          fill="none"
          stroke={TAPE_PINK}
          strokeWidth="2.6"
          strokeOpacity="0.4"
          strokeLinecap="round"
        />
        <path
          d="M 12 10 C 28 9, 46 12, 68 9.4 C 78 8.4, 86 11, 90 10"
          fill="none"
          stroke={LINE}
          strokeWidth="0.65"
          strokeOpacity="0.16"
          strokeLinecap="round"
        />
        <ellipse cx="20" cy="7" rx="5" ry="1.3" fill={SHINE} fillOpacity="0.5" transform="rotate(-8 20 7)" />
      </g>
    </svg>
  );
}
