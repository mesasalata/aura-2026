/**
 * Bitmap cast for the wiki.
 *
 * Prefer `/public/art/images/` (hand-picked keepers). Fall back to
 * `/public/art/gen/` only when there is no images/ equivalent - those entries
 * set `unsupported` with the reason.
 *
 * No imports: `scripts/art-ladder.mjs` loads this file directly in Node.
 * Resolve URLs with `artUrl(id)` from `lib/art.ts` so callers never hard-code a folder.
 */

export type ArtSource = "images" | "gen";

export type ArtMeta = {
  file: string;
  source: ArtSource;
  alt: string;
  /** Intrinsic pixel size of the file (width × height). */
  w: number;
  h: number;
  /**
   * Set when `source` is `"gen"` because images/ has no replacement yet.
   * Do not add new gen-only sprites without documenting why.
   */
  unsupported?: string;
};

export const ART = {
  /* -- images/ (preferred) -- */
  cow: {
    file: "cow-healthy.png",
    source: "images",
    alt: "A plump dairy cow",
    w: 640,
    h: 480,
  },
  cowSick: {
    file: "cow-sick.png",
    source: "images",
    alt: "The same dairy cow, unwell with mastitis",
    w: 640,
    h: 480,
  },
  biofet: {
    file: "biofet-sensor.png",
    source: "images",
    alt: "BioFET sensor chip with a pink signal",
    w: 1024,
    h: 512,
  },
  milkSensor: {
    file: "milk-inline-sensor.png",
    source: "images",
    alt: "Inline milk sampling chamber on a milking line",
    w: 1024,
    h: 960,
  },
  phoneAlert: {
    file: "phone-alert.png",
    source: "images",
    alt: "Phone showing a quiet cow alert from the parlour",
    w: 1024,
    h: 768,
  },
  logo: {
    file: "logo.png",
    source: "images",
    alt: "AURA wordmark crest",
    w: 640,
    h: 480,
  },
  bill: {
    file: "bill.png",
    source: "images",
    alt: "A waving banknote",
    w: 820,
    h: 676,
  },

  /* -- gen/ leftovers (no images/ equivalent) -- */
  mascot: {
    file: "mascot-scientist.png",
    source: "gen",
    alt: "Cow scientist holding a flask of pink liquid",
    w: 640,
    h: 640,
    unsupported: "No images/ replacement - prefer biofet or milkSensor for new casts.",
  },
  reader: {
    file: "cow-reading.png",
    source: "gen",
    alt: "Cow reading a pink book",
    w: 640,
    h: 640,
    unsupported: "No images/ replacement - prefer logo for team scenes.",
  },
} as const satisfies Record<string, ArtMeta>;

/**
 * Pre-shrunk copies of each sprite, in `public/art/ladder/`, written by `scripts/art-ladder.mjs`.
 * Each copy is `LADDER_STEP` times narrower than the one above it.
 */
export const LADDER_STEP = 1.12;
const LADDER_MIN = 40;

/** Widths of the pre-shrunk copies, largest first. The original file is not included. */
export function ladderWidths(w: number): number[] {
  const out: number[] = [];
  for (let x = w / LADDER_STEP; x >= LADDER_MIN; x /= LADDER_STEP) out.push(Math.round(x));
  return out;
}

/** File name of one pre-shrunk copy. */
export function ladderFile(meta: ArtMeta, width: number): string {
  return `${meta.file.replace(/\.png$/, "")}-${width}.webp`;
}
