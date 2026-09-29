import { NAV } from "@/lib/nav";
import { asset } from "@/lib/utils";

/**
 * Bitmap cast for the wiki.
 *
 * Prefer `/public/art/images/` (hand-picked keepers). Fall back to
 * `/public/art/gen/` only when there is no images/ equivalent — those entries
 * set `unsupported` with the reason.
 *
 * Resolve URLs with `artUrl(id)` so callers never hard-code a folder.
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
  /* —— images/ (preferred) —— */
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

  /* —— gen/ leftovers (no images/ equivalent) —— */
  mascot: {
    file: "mascot-scientist.png",
    source: "gen",
    alt: "Cow scientist holding a flask of pink liquid",
    w: 640,
    h: 640,
    unsupported: "No images/ replacement — prefer biofet or milkSensor for new casts.",
  },
  reader: {
    file: "cow-reading.png",
    source: "gen",
    alt: "Cow reading a pink book",
    w: 640,
    h: 640,
    unsupported: "No images/ replacement — prefer logo for team scenes.",
  },
  bill1: {
    file: "bill-1.png",
    source: "gen",
    alt: "Flying bill",
    w: 512,
    h: 512,
    unsupported: "Cash-burst props; no images/ bills yet.",
  },
  bill2: {
    file: "bill-2.png",
    source: "gen",
    alt: "Flying bill",
    w: 512,
    h: 512,
    unsupported: "Cash-burst props; no images/ bills yet.",
  },
  bill3: {
    file: "bill-3.png",
    source: "gen",
    alt: "Flying bill",
    w: 512,
    h: 512,
    unsupported: "Cash-burst props; no images/ bills yet.",
  },
} as const satisfies Record<string, ArtMeta>;

export type ArtId = keyof typeof ART;

/** Public URL for a catalog sprite. */
export function artUrl(id: ArtId): string {
  const meta = ART[id];
  return asset(`/art/${meta.source}/${meta.file}`);
}

/**
 * Files under public/art that are **not** in `ART` and are unused by the live
 * wiki (pipeline leftovers, superseded splash kit, etc.).
 */
export const ART_UNUSED = {
  images: [] as const, // every images/ file is catalogued above
  gen: [
    "cow-grazing.png", // replaced by images/cow-healthy.png
    "cow-sick.png", // replaced by images/cow-sick.png
    "splash.webm",
    "splash.mov",
    "splash.mp4",
    "splash-portrait.webm",
    "splash-portrait.mov",
    "splash-portrait.mp4",
    "splash-poster.png",
    "splash-poster-portrait.png",
    "splash-last.png",
    "splash-last-portrait.png",
    "splash-manifest.json",
    "cast-style-id.txt",
  ] as const,
  note: "Splash kit was superseded by public/art/video/pour.* for the homepage pour.",
} as const;

/**
 * Catalog entries still on gen/ — keep until images/ replacements exist.
 * Prefer images/ ids (biofet, milkSensor, logo, cow, cowSick, phoneAlert) in new UI.
 * `mascot` and `reader` remain catalogued for fallback but are no longer staged.
 */
export const ART_UNSUPPORTED = (Object.keys(ART) as ArtId[]).filter((id) => ART[id].source === "gen");

/** Catalog ids that are no longer mounted anywhere in the UI (still on disk via ART). */
export const ART_CATALOG_IDLE = ["mascot", "reader"] as const satisfies readonly ArtId[];

export type ArtScene = "project" | "wetlab" | "drylab" | "engagement" | "team";
export type ArtMotion = "none" | "breathe" | "bob" | "sway" | "float";
export type ArtGlow = "pink" | "signal" | "butter";

export type PlacedArt = {
  id: ArtId;
  /** CSS `left` - pin is centered on this point. */
  x: string;
  /** CSS `top`. */
  y: string;
  size: number;
  motion?: ArtMotion;
  /** Pointer / parallax depth. 0 = still, 1.4 = eager. */
  depth?: number;
  rotate?: number;
  flip?: boolean;
  delay?: number;
  glow?: ArtGlow;
  opacity?: number;
  hide?: "mobile" | "desktop";
};

const SCENE_BY_GROUP: Record<string, ArtScene> = {
  Project: "project",
  "Wet Lab": "wetlab",
  "Dry Lab": "drylab",
  Engagement: "engagement",
  Team: "team",
};

/** Which living illustration a wiki page should stage. */
export function sceneFor(href: string): ArtScene {
  for (const g of NAV) {
    if (g.links.some((l) => l.href === href)) return SCENE_BY_GROUP[g.label] ?? "project";
  }
  return "project";
}

/**
 * Cast for the page-hero diorama. Prefer images/ sprites.
 * Gen-only mascot/reader are no longer staged here.
 */
export const HERO_CAST: Record<ArtScene, PlacedArt[]> = {
  project: [{ id: "milkSensor", x: "58%", y: "56%", size: 220, motion: "breathe", depth: 0.3, glow: "signal" }],
  wetlab: [{ id: "biofet", x: "58%", y: "56%", size: 240, motion: "breathe", depth: 0.35, glow: "pink" }],
  drylab: [{ id: "biofet", x: "58%", y: "56%", size: 220, motion: "float", depth: 0.3, glow: "butter" }],
  engagement: [{ id: "phoneAlert", x: "58%", y: "56%", size: 200, motion: "bob", depth: 0.3, glow: "pink" }],
  team: [{ id: "logo", x: "58%", y: "56%", size: 180, motion: "breathe", depth: 0.25 }],
};

export type HeroProp = "pail" | "flask" | "drop" | "none";

/** Drawn SVG prop behind / instead of a bitmap when the cast is empty-feeling. */
export const HERO_PROP: Record<ArtScene, HeroProp> = {
  project: "none", // milkSensor carries the beat
  wetlab: "none",
  drylab: "none",
  engagement: "none",
  team: "none",
};
