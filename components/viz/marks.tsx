"use client";

import { LINE, SHINE, SOFT_ID } from "@/components/viz/sketch";
import { cn } from "@/lib/utils";

/**
 * The drawn props. One language for every object that isn't a cow: a warm
 * cocoa outline, flat token fills, a flat white shine, a light wobble. The
 * clip-art half of "clip art with a hand in it".
 */

const BAND = "#ded4c2";
const SOFT = `url(#${SOFT_ID})`;

/** Farm milk pail - tapered, two bands, wire bail. Milk to the brim. */
export function PailMark({ className, fill = 1 }: { className?: string; fill?: number }) {
  const surfaceY = 96 + (1 - fill) * 100;
  return (
    <svg viewBox="0 0 200 240" className={cn("block overflow-visible", className)} aria-hidden>
      <g filter={SOFT} strokeLinejoin="round" strokeLinecap="round">
        {/* bail */}
        <path d="M 54 92 C 50 34, 150 34, 146 92" fill="none" stroke={LINE} strokeWidth="2.6" />
        <rect x="90" y="21" width="20" height="8" rx="3" fill="var(--color-cream)" stroke={LINE} strokeWidth="2" />
        <circle cx="54" cy="93" r="3.4" fill="var(--color-cream)" stroke={LINE} strokeWidth="1.8" />
        <circle cx="146" cy="93" r="3.4" fill="var(--color-cream)" stroke={LINE} strokeWidth="1.8" />
        {/* body */}
        <path
          d="M 52 96 L 68 208 Q 69 218 80 218 L 120 218 Q 131 218 132 208 L 148 96 Z"
          fill="var(--color-milk)"
          stroke={LINE}
          strokeWidth="2.6"
        />
        {/* bands */}
        <path d="M 52 96 L 55 116 L 145 116 L 148 96 Z" fill={BAND} stroke={LINE} strokeWidth="2" />
        <path d="M 70 190 L 68 208 Q 69 218 80 218 L 120 218 Q 131 218 132 208 L 130 190 Z" fill={BAND} stroke={LINE} strokeWidth="2" />
        {/* shine */}
        <path d="M 74 124 C 72 146, 74 168, 78 186 C 82 188, 84 186, 82 184 C 79 166, 78 146, 80 124 Z" fill={SHINE} />
        {/* rim + milk surface */}
        <ellipse cx="100" cy="96" rx="48" ry="11" fill="var(--color-milk)" stroke={LINE} strokeWidth="2.4" />
        <ellipse cx="100" cy="96" rx="40" ry="7" fill={SHINE} stroke={LINE} strokeOpacity="0.28" strokeWidth="1.2" />
        {fill < 1 && (
          <ellipse cx="100" cy={surfaceY} rx={48 - (surfaceY - 96) * 0.13} ry="9" fill="var(--color-milk)" stroke={LINE} strokeOpacity="0.3" strokeWidth="1.2" />
        )}
      </g>
    </svg>
  );
}

export function DropMark({ className, tint = "milk" }: { className?: string; tint?: "milk" | "pink" }) {
  return (
    <svg viewBox="0 0 80 100" className={cn("block overflow-visible", className)} aria-hidden>
      <g filter={SOFT}>
        <path
          d="M40 8 C44 22 68 48 68 68 C68 84 55 94 40 94 C25 94 12 84 12 68 C12 48 36 22 40 8 Z"
          fill={tint === "pink" ? "var(--color-pink-soft)" : "var(--color-milk)"}
          stroke={LINE}
          strokeWidth="2.4"
          strokeLinejoin="round"
        />
        <ellipse cx="30" cy="66" rx="6" ry="11" fill={SHINE} transform="rotate(12 30 66)" />
      </g>
    </svg>
  );
}

export function FlaskMark({ className, liquid = "pink" }: { className?: string; liquid?: "pink" | "milk" }) {
  const fill = liquid === "pink" ? "var(--color-pink-soft)" : "var(--color-cream)";
  return (
    <svg viewBox="0 0 100 140" className={cn("block overflow-visible", className)} aria-hidden>
      <g filter={SOFT} strokeLinejoin="round" strokeLinecap="round">
        <path
          d="M38 12 H62 V36 L84 108 C86 116 80 126 70 126 H30 C20 126 14 116 16 108 L38 36 Z"
          fill={SHINE}
          fillOpacity="0.6"
        />
        <path d="M40 78 L84 108 C86 116 80 126 70 126 H30 C20 126 14 116 16 108 L38 82 Z" fill={fill} />
        <path d="M24 100 C 40 96, 60 96, 76 100" fill="none" stroke={LINE} strokeOpacity="0.25" strokeWidth="1.6" />
        <path
          d="M38 12 H62 V36 L84 108 C86 116 80 126 70 126 H30 C20 126 14 116 16 108 L38 36 Z"
          fill="none"
          stroke={LINE}
          strokeWidth="2.4"
        />
        <rect x="35" y="8" width="30" height="9" rx="3" fill="var(--color-cream)" stroke={LINE} strokeWidth="2" />
        <path d="M30 60 L 24 96" fill="none" stroke={SHINE} strokeWidth="4" />
      </g>
    </svg>
  );
}
