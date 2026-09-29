"use client";

import { cn } from "@/lib/utils";

/**
 * The shared "clipart with a hand" kit: flat fills, organic shapes, one very
 * light wobble filter and a faint grain. Every SVG visual on the homepage
 * pulls from here so charts, blobs and accents read as one set.
 */

export const SOFT_ID = "aura-soft";
export const GRAIN_ID = "aura-grain";

/**
 * The outline colour for every drawn prop: warm cocoa, not black. Reads as
 * clip art with a hand in it rather than inked woodcut. Stroke weights in
 * the kit are ~2.2–2.6 on a 100–200 unit box.
 */
export const LINE = "#5a3d33";
/** Flat white highlight fill - the one clip-art cliché we keep, on purpose. */
export const SHINE = "#fffdf5";

/** Rendered once in the root layout. Filters are referenced by id across SVGs. */
export function SketchDefs() {
  return (
    <svg aria-hidden className="pointer-events-none absolute h-0 w-0">
      <defs>
        {/* generous region: it's relative to each shape's own bbox, and small marks
            (a drop, a coin) otherwise get their stroke + displacement clipped */}
        <filter id={SOFT_ID} x="-30%" y="-30%" width="160%" height="160%">
          <feTurbulence type="fractalNoise" baseFrequency="0.016 0.03" numOctaves="1" seed="5" result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="2" xChannelSelector="R" yChannelSelector="G" />
        </filter>
        <filter id={GRAIN_ID} x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="1" seed="9" stitchTiles="stitch" />
          <feColorMatrix values="0 0 0 0 0.14  0 0 0 0 0.09  0 0 0 0 0.06  0 0 0 0.22 0" />
        </filter>
      </defs>
    </svg>
  );
}

/*
 * Cow spots, 100×100. Lobed patches with pinched necks - the same silhouettes
 * as the tan patches on the cow sprite - so every wash, spot and accent on
 * the site is a bit of hide, not a rounded blob.
 */
export const BLOB = {
  a: "M 30 14 C 42 4, 60 8, 64 22 C 68 34, 84 30, 90 44 C 96 58, 84 66, 74 66 C 66 66, 66 78, 56 86 C 44 96, 26 92, 20 80 C 14 70, 22 62, 16 52 C 8 40, 6 28, 16 20 C 20 16, 26 16, 30 14 Z",
  b: "M 20 40 C 12 26, 26 14, 40 20 C 50 24, 56 12, 70 14 C 86 16, 92 32, 84 42 C 80 48, 92 56, 90 68 C 88 82, 72 88, 62 80 C 56 76, 50 86, 38 88 C 22 90, 10 78, 16 66 C 20 58, 10 52, 20 40 Z",
  c: "M 34 18 C 46 8, 64 12, 68 26 C 70 34, 62 40, 66 48 C 72 60, 86 58, 84 72 C 82 86, 62 90, 52 80 C 46 74, 38 82, 28 78 C 14 72, 12 56, 22 48 C 28 42, 22 36, 22 30 C 22 24, 28 22, 34 18 Z",
  d: "M 14 30 C 10 16, 28 8, 40 16 C 48 22, 58 14, 70 18 C 84 22, 88 38, 80 46 C 74 52, 86 60, 90 72 C 94 86, 78 96, 66 88 C 58 82, 52 90, 40 86 C 26 82, 28 70, 32 62 C 36 54, 20 52, 16 44 C 14 38, 16 34, 14 30 Z",
  /* rounder patch, for washes behind a character */
  ring: "M 50 8 C 66 4, 80 14, 84 28 C 88 40, 98 48, 92 62 C 86 76, 72 80, 62 90 C 52 100, 34 94, 26 84 C 18 74, 4 70, 6 54 C 8 40, 18 34, 22 24 C 26 14, 38 10, 50 8 Z",
} as const;

export type BlobShape = keyof typeof BLOB;

/**
 * A flat cow-spot patch. `soft` adds the light wobble; `outline` draws the
 * cocoa pen line around it (for spots that sit in the foreground, like the
 * ones on the cow - washes behind things stay unlined).
 */
export function Blob({
  shape = "a",
  fill = "currentColor",
  soft = true,
  outline = false,
  className,
  style,
}: {
  shape?: BlobShape;
  fill?: string;
  soft?: boolean;
  outline?: boolean;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <svg viewBox="0 0 100 100" aria-hidden className={cn("overflow-visible", className)} style={style}>
      <path
        d={BLOB[shape]}
        fill={fill}
        stroke={outline ? LINE : undefined}
        strokeWidth={outline ? 2.4 : undefined}
        strokeLinejoin="round"
        vectorEffect={outline ? "non-scaling-stroke" : undefined}
        filter={soft ? `url(#${SOFT_ID})` : undefined}
      />
    </svg>
  );
}

/** Short tapered dash - the accent rule under a kicker, drawn not ruled. */
export function BrushDash({ color = "currentColor", className }: { color?: string; className?: string }) {
  return (
    <svg viewBox="0 0 80 12" aria-hidden className={cn("h-3 w-20 overflow-visible", className)}>
      <path
        d="M 3 7 C 14 3, 30 2, 46 3.5 C 60 4.5, 72 4, 78 6 C 72 9, 58 10, 44 9.5 C 28 9, 12 10, 3 7 Z"
        fill={color}
        filter={`url(#${SOFT_ID})`}
      />
    </svg>
  );
}
