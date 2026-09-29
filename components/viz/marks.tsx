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

export function CurdMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 90 70" className={cn("block overflow-visible", className)} aria-hidden>
      <g filter={SOFT} strokeLinejoin="round">
        <ellipse cx="45" cy="54" rx="30" ry="8" fill="var(--color-milk)" stroke={LINE} strokeWidth="1.8" />
        <path
          d="M18 44 C16 28 32 16 48 20 C62 10 78 22 74 38 C84 42 78 56 62 54 C52 62 28 60 18 44 Z"
          fill="var(--color-pink-soft)"
          stroke={LINE}
          strokeWidth="2.2"
        />
        <ellipse cx="38" cy="34" rx="9" ry="5" fill={SHINE} fillOpacity="0.85" />
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

/** A sticker-cut green banknote - chunky clip-art, one wobble, two flats. */
export function BillMark({ className, kind = 0 }: { className?: string; kind?: 0 | 1 | 2 }) {
  const body =
    kind === 1
      ? "M 8 18 C 6 10, 18 6, 36 8 C 62 4, 90 8, 110 12 C 118 16, 116 50, 108 54 C 86 60, 50 58, 22 54 C 8 52, 6 28, 8 18 Z"
      : kind === 2
        ? "M 10 14 C 8 8, 22 4, 48 8 C 78 6, 104 10, 112 18 C 118 28, 114 50, 104 56 C 80 62, 40 58, 18 52 C 6 48, 6 22, 10 14 Z"
        : "M 6 16 C 8 6, 28 8, 56 6 C 84 4, 108 10, 114 20 C 118 34, 112 52, 100 56 C 72 62, 36 58, 16 52 C 4 48, 4 26, 6 16 Z";
  return (
    <svg viewBox="0 0 120 64" className={cn("block overflow-visible", className)} aria-hidden>
      <g filter={SOFT} strokeLinejoin="round" strokeLinecap="round">
        <path d={body} fill="#5aaa5e" stroke={LINE} strokeWidth="2.8" />
        <path d="M 16 14 L 16 50" fill="none" stroke="#3d7a44" strokeWidth="7" strokeLinecap="round" />
        <path d="M 104 16 L 104 48" fill="none" stroke="#3d7a44" strokeWidth="7" strokeLinecap="round" />
        <circle cx="60" cy="32" r="13" fill="#fffdf5" stroke={LINE} strokeWidth="2.4" />
        <circle cx="60" cy="32" r="6" fill="#5aaa5e" stroke={LINE} strokeWidth="2" />
        <ellipse cx="26" cy="20" rx="7" ry="3.2" fill={SHINE} transform="rotate(-20 26 20)" />
      </g>
    </svg>
  );
}

export function CoinMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 72 72" className={cn("block overflow-visible", className)} aria-hidden>
      <g filter={SOFT} strokeLinejoin="round">
        <circle cx="36" cy="39" r="26" fill="#d9a53c" stroke={LINE} strokeWidth="2.2" />
        <circle cx="36" cy="34" r="26" fill="var(--color-butter)" stroke={LINE} strokeWidth="2.2" />
        <circle cx="36" cy="34" r="19" fill="none" stroke={LINE} strokeOpacity="0.3" strokeWidth="1.2" />
        <path
          d="M36 22 C38 28 47 37 47 44 C47 50 42 54 36 54 C30 54 25 50 25 44 C25 37 34 28 36 22 Z"
          fill="var(--color-milk)"
          stroke={LINE}
          strokeWidth="1.8"
        />
        <ellipse cx="24" cy="22" rx="5" ry="3" fill={SHINE} transform="rotate(-35 24 22)" />
      </g>
    </svg>
  );
}
