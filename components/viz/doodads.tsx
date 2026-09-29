"use client";

import "@/app/doodad-viz.css";
import { LINE, SHINE, SOFT_ID } from "@/components/viz/sketch";
import { cn } from "@/lib/utils";

/** Shared cocoa - same ink as the sketch kit. */
export const DOODAD_COCOA = "#5a3d33";

const SOFT = `url(#${SOFT_ID})`;
const TAPE_FILL = "#f3e4c4";
const TAPE_PINK = "#f6d4c8";

type MarkProps = {
  className?: string;
};

/**
 * A scrap of masking tape - cream with a faint pink wash, cocoa fibers.
 * Sit it on a printed chart as if the page was stuck into the notebook.
 */
export function Tape({ className }: MarkProps) {
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

/** A wire staple seen slightly off-angle - holds a strip onto the page. */
export function Staple({ className }: MarkProps) {
  return (
    <svg viewBox="0 0 28 18" aria-hidden className={cn("doodad doodad-staple", className)}>
      <g filter={SOFT} fill="none" stroke={LINE} strokeLinecap="round" strokeLinejoin="round">
        <path d="M 5 14 L 5 5.5 L 23 5.5 L 23 14" strokeWidth="2.1" />
        <path d="M 5 14 C 5 16.2, 7.4 16.6, 8.2 14.6" strokeWidth="1.7" />
        <path d="M 23 14 C 23 16.2, 20.6 16.6, 19.8 14.6" strokeWidth="1.7" />
        <path d="M 8 6.2 L 20 6.2" stroke={SHINE} strokeWidth="1.1" strokeOpacity="0.7" />
      </g>
    </svg>
  );
}

/** Crooked student rubber stamp. Pink wash, cocoa ink, one word. */
export function RubberStamp({ children, className }: { children: string; className?: string }) {
  const wide = children.length > 6;
  const w = wide ? 108 : 90;
  const cx = w / 2;
  return (
    <svg viewBox={`0 0 ${w} 38`} aria-hidden className={cn("doodad doodad-stamp", className)}>
      <g filter={SOFT} strokeLinejoin="round">
        <ellipse
          cx={cx}
          cy="19"
          rx={wide ? 50 : 41}
          ry="15.5"
          fill="var(--color-pink-soft)"
          fillOpacity="0.14"
          stroke={LINE}
          strokeWidth="1.8"
          strokeDasharray="11 2.2 7 1.6 9 2"
        />
        <ellipse
          cx={cx}
          cy="19"
          rx={wide ? 44 : 35.5}
          ry="11.2"
          fill="none"
          stroke={LINE}
          strokeWidth="0.85"
          strokeOpacity="0.45"
          strokeDasharray="6 1.8 4 1.2"
        />
        <text x={cx} y="22" textAnchor="middle" className="doodad-stamp-text">
          {children}
        </text>
      </g>
    </svg>
  );
}

/** Margin note in display italic, with a pencil underline. */
export function HandCaption({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={cn("doodad doodad-caption", className)}>
      {children}
      <svg viewBox="0 0 64 6" className="doodad-caption-rule" aria-hidden>
        <path
          d="M 1.5 3.2 C 14 1.2, 28 4.8, 42 2.4 C 51 1.2, 58 4.1, 62.5 3"
          fill="none"
          stroke={LINE}
          strokeWidth="1.15"
          strokeLinecap="round"
          filter={SOFT}
        />
      </svg>
    </span>
  );
}

/** Six-stroke notebook asterisk. */
export function Asterisk({ className }: MarkProps) {
  return (
    <svg viewBox="0 0 20 20" aria-hidden className={cn("doodad doodad-asterisk", className)}>
      <g filter={SOFT} stroke={LINE} strokeWidth="1.5" strokeLinecap="round" fill="none">
        <path d="M 10 2.4 L 10 17.4" />
        <path d="M 3.2 6.4 L 16.6 13.8" />
        <path d="M 16.8 6.2 L 3.4 14" />
      </g>
    </svg>
  );
}

/** Folded paper dog-ear - milk triangle with a cocoa crease. */
export function PaperCorner({ className }: MarkProps) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden className={cn("doodad doodad-corner", className)}>
      <g filter={SOFT} strokeLinejoin="round" strokeLinecap="round">
        <path d="M 32 0 L 32 22 L 10 0 Z" fill="var(--color-cream)" stroke={LINE} strokeWidth="1.35" />
        <path d="M 10 0 L 32 22" stroke={LINE} strokeWidth="1.15" />
        <path d="M 18 3 C 22 6, 26 10, 29 14" fill="none" stroke={LINE} strokeWidth="0.7" strokeOpacity="0.28" />
        <ellipse cx="26" cy="6" rx="2.2" ry="1" fill={SHINE} transform="rotate(-28 26 6)" />
      </g>
    </svg>
  );
}

/** Relative wrap so marks can sit on a chart without rewriting it. */
export function DoodadFrame({
  children,
  className,
  ...rest
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("doodad-frame", className)} {...rest}>
      {children}
    </div>
  );
}
