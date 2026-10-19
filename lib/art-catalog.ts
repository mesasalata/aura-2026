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

  /* -- page banners: the lab-coat cow doing each page's job (scripts/gen-heroes.mjs) -- */
  "hero-description": {
    file: "hero-description.png",
    source: "images",
    alt: "The lab-coat cow holding up the inline milk sampling chamber",
    w: 493,
    h: 640,
  },
  "hero-background": {
    file: "hero-background.png",
    source: "images",
    alt: "The cow, unwell with mastitis, sitting on a straw bale",
    w: 420,
    h: 640,
  },
  "hero-engineering": {
    file: "hero-engineering.png",
    source: "images",
    alt: "The lab-coat cow tightening a wrench on a DNA hairpin",
    w: 640,
    h: 608,
  },
  "hero-results": {
    file: "hero-results.png",
    source: "images",
    alt: "The lab-coat cow cheering beside a rising chart",
    w: 504,
    h: 640,
  },
  "hero-contribution": {
    file: "hero-contribution.png",
    source: "images",
    alt: "The lab-coat cow holding out a box of DNA parts",
    w: 429,
    h: 640,
  },
  "hero-experiments": {
    file: "hero-experiments.png",
    source: "images",
    alt: "The lab-coat cow pipetting pink liquid into tubes",
    w: 428,
    h: 640,
  },
  "hero-protocols": {
    file: "hero-protocols.png",
    source: "images",
    alt: "The lab-coat cow reading a long checklist",
    w: 468,
    h: 640,
  },
  "hero-parts": {
    file: "hero-parts.png",
    source: "images",
    alt: "The lab-coat cow juggling three DNA pieces",
    w: 450,
    h: 640,
  },
  "hero-measurement": {
    file: "hero-measurement.png",
    source: "images",
    alt: "The lab-coat cow inspecting a pink sample through a magnifying glass",
    w: 458,
    h: 640,
  },
  "hero-notebook": {
    file: "hero-notebook.png",
    source: "images",
    alt: "The lab-coat cow writing in a lab notebook",
    w: 444,
    h: 640,
  },
  "hero-model": {
    file: "hero-model.png",
    source: "images",
    alt: "The lab-coat cow pointing at an S-shaped curve on an easel",
    w: 640,
    h: 598,
  },
  "hero-hardware": {
    file: "hero-hardware.png",
    source: "images",
    alt: "The lab-coat cow fixing a sensor box onto a milk hose",
    w: 439,
    h: 640,
  },
  "hero-software": {
    file: "hero-software.png",
    source: "images",
    alt: "The lab-coat cow holding up a phone with a cow alert",
    w: 520,
    h: 640,
  },
  "hero-human-practices": {
    file: "hero-human-practices.png",
    source: "images",
    alt: "The lab-coat cow in a farmer's hat carrying a milk churn",
    w: 465,
    h: 640,
  },
  "hero-integrated-human-practices": {
    file: "hero-integrated-human-practices.png",
    source: "images",
    alt: "The lab-coat cow holding a looping arrow",
    w: 584,
    h: 640,
  },
  "hero-education": {
    file: "hero-education.png",
    source: "images",
    alt: "The lab-coat cow teaching at a small chalkboard",
    w: 618,
    h: 640,
  },
  "hero-sustainability": {
    file: "hero-sustainability.png",
    source: "images",
    alt: "A healthy cow sniffing a flower on a tuft of grass",
    w: 640,
    h: 410,
  },
  "hero-safety": {
    file: "hero-safety.png",
    source: "images",
    alt: "The lab-coat cow in goggles carrying a closed sample tube",
    w: 387,
    h: 640,
  },
  "hero-team": {
    file: "hero-team.png",
    source: "images",
    alt: "Three lab-coat cows waving together",
    w: 640,
    h: 465,
  },
  "hero-attributions": {
    file: "hero-attributions.png",
    source: "images",
    alt: "The lab-coat cow hugging a big pink heart",
    w: 418,
    h: 640,
  },
  "hero-references": {
    file: "hero-references.png",
    source: "images",
    alt: "The cow reading on a tall stack of books",
    w: 300,
    h: 640,
  },
  "hero-entrepreneurship": {
    file: "hero-entrepreneurship.png",
    source: "images",
    alt: "The lab-coat cow with a briefcase and a boxed sensor",
    w: 527,
    h: 640,
  },

  /* -- homepage props: single objects in the cast's hand (scripts/gen-heroes.mjs) -- */
  "prop-note": {
    file: "prop-note.png",
    source: "images",
    alt: "A euro banknote flapping",
    w: 480,
    h: 399,
  },
  "prop-coin": {
    file: "prop-coin.png",
    source: "images",
    alt: "A gold euro coin",
    w: 442,
    h: 480,
  },
  "prop-stack": {
    file: "prop-stack.png",
    source: "images",
    alt: "A leaning stack of euro coins",
    w: 368,
    h: 480,
  },
  "prop-receipt": {
    file: "prop-receipt.png",
    source: "images",
    alt: "A long bill with a pink euro stamp",
    w: 263,
    h: 480,
  },
  "prop-bottle": {
    file: "prop-bottle.png",
    source: "images",
    alt: "A milk bottle only half full",
    w: 206,
    h: 480,
  },
  "prop-vetbag": {
    file: "prop-vetbag.png",
    source: "images",
    alt: "A vet's bag",
    w: 480,
    h: 454,
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
