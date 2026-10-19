import { NAV } from "@/lib/nav";
import { asset } from "@/lib/utils";
import { ART, ladderFile, ladderWidths } from "./art-catalog";

export { ART, LADDER_STEP, type ArtMeta, type ArtSource } from "./art-catalog";

export type ArtId = keyof typeof ART;

/** Public URL for a catalog sprite. */
export function artUrl(id: ArtId): string {
  const meta = ART[id];
  return asset(`/art/${meta.source}/${meta.file}`);
}

/** `srcset` over the original file and its pre-shrunk copies, with `w` descriptors. */
export function artSrcSet(id: ArtId): string {
  const meta = ART[id];
  const copies = ladderWidths(meta.w).map((w) => `${asset(`/art/ladder/${ladderFile(meta, w)}`)} ${w}w`);
  return [`${artUrl(id)} ${meta.w}w`, ...copies].join(", ");
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
    "bill-1.png", // replaced by images/bill.png
    "bill-2.png",
    "bill-3.png",
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
 * Catalog entries still on gen/ - keep until images/ replacements exist.
 * Prefer images/ ids (biofet, milkSensor, logo, cow, cowSick, phoneAlert, bill) in new UI.
 * `mascot` and `reader` remain catalogued for fallback but are no longer staged.
 */
export const ART_UNSUPPORTED = (Object.keys(ART) as ArtId[]).filter((id) => ART[id].source === "gen");

/** Catalog ids that are no longer mounted anywhere in the UI (still on disk via ART). */
export const ART_CATALOG_IDLE = ["mascot", "reader"] as const satisfies readonly ArtId[];

export type ArtScene = "project" | "wetlab" | "drylab" | "engagement" | "team";
export type ArtMotion = "none" | "breathe" | "bob" | "sway" | "float";
export type ArtGlow = "pink" | "signal" | "butter";

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
 * One banner sprite per wiki page: the lab-coat cow doing that page's job.
 * `id` is the `ART` key; a missing file is shown as its `alt`, as text.
 */
export type HeroCast = {
  id: string;
  /** What the picture shows. Used as alt text, and as plaintext when the file is missing. */
  alt: string;
  x: string;
  y: string;
  size: number;
  motion?: ArtMotion;
  depth?: number;
  glow?: ArtGlow;
};

export const HERO_CAST = {
  default: { id: "logo", alt: "AURA wordmark crest", x: "58%", y: "56%", size: 180, motion: "breathe", depth: 0.25, glow: "pink" },
  description: { id: "hero-description", alt: "The lab-coat cow holding up the inline milk sampling chamber", x: "58%", y: "56%", size: 220, motion: "breathe", depth: 0.3, glow: "signal" },
  background: { id: "hero-background", alt: "The cow, unwell with mastitis, sitting on a straw bale", x: "58%", y: "56%", size: 220, motion: "breathe", depth: 0.3, glow: "pink" },
  engineering: { id: "hero-engineering", alt: "The lab-coat cow tightening a wrench on a DNA hairpin", x: "58%", y: "56%", size: 220, motion: "float", depth: 0.3, glow: "butter" },
  results: { id: "hero-results", alt: "The lab-coat cow cheering beside a rising chart", x: "58%", y: "56%", size: 220, motion: "breathe", depth: 0.3, glow: "signal" },
  contribution: { id: "hero-contribution", alt: "The lab-coat cow holding out a box of DNA parts", x: "58%", y: "56%", size: 200, motion: "bob", depth: 0.3, glow: "pink" },
  experiments: { id: "hero-experiments", alt: "The lab-coat cow pipetting pink liquid into tubes", x: "58%", y: "56%", size: 240, motion: "breathe", depth: 0.35, glow: "pink" },
  protocols: { id: "hero-protocols", alt: "The lab-coat cow reading a long checklist", x: "58%", y: "56%", size: 220, motion: "breathe", depth: 0.3, glow: "signal" },
  parts: { id: "hero-parts", alt: "The lab-coat cow juggling three DNA pieces", x: "58%", y: "56%", size: 220, motion: "float", depth: 0.3, glow: "butter" },
  measurement: { id: "hero-measurement", alt: "The lab-coat cow inspecting a pink sample through a magnifying glass", x: "58%", y: "56%", size: 220, motion: "breathe", depth: 0.3, glow: "signal" },
  notebook: { id: "hero-notebook", alt: "The lab-coat cow writing in a lab notebook", x: "58%", y: "56%", size: 200, motion: "bob", depth: 0.3, glow: "butter" },
  model: { id: "hero-model", alt: "The lab-coat cow pointing at an S-shaped curve on an easel", x: "58%", y: "56%", size: 220, motion: "float", depth: 0.3, glow: "butter" },
  hardware: { id: "hero-hardware", alt: "The lab-coat cow fixing a sensor box onto a milk hose", x: "58%", y: "56%", size: 240, motion: "breathe", depth: 0.35, glow: "signal" },
  software: { id: "hero-software", alt: "The lab-coat cow holding up a phone with a cow alert", x: "58%", y: "56%", size: 200, motion: "bob", depth: 0.3, glow: "pink" },
  "human-practices": { id: "hero-human-practices", alt: "The lab-coat cow in a farmer's hat carrying a milk churn", x: "58%", y: "56%", size: 200, motion: "bob", depth: 0.3, glow: "pink" },
  "integrated-human-practices": { id: "hero-integrated-human-practices", alt: "The lab-coat cow holding a looping arrow", x: "58%", y: "56%", size: 220, motion: "breathe", depth: 0.3, glow: "signal" },
  education: { id: "hero-education", alt: "The lab-coat cow teaching at a small chalkboard", x: "58%", y: "56%", size: 200, motion: "bob", depth: 0.3, glow: "butter" },
  sustainability: { id: "hero-sustainability", alt: "A healthy cow sniffing a flower on a tuft of grass", x: "58%", y: "56%", size: 220, motion: "breathe", depth: 0.3, glow: "pink" },
  safety: { id: "hero-safety", alt: "The lab-coat cow in goggles carrying a closed sample tube", x: "58%", y: "56%", size: 200, motion: "breathe", depth: 0.25, glow: "signal" },
  team: { id: "hero-team", alt: "Three lab-coat cows waving together", x: "58%", y: "56%", size: 180, motion: "breathe", depth: 0.25, glow: "pink" },
  attributions: { id: "hero-attributions", alt: "The lab-coat cow hugging a big pink heart", x: "58%", y: "56%", size: 180, motion: "breathe", depth: 0.25, glow: "butter" },
  references: { id: "hero-references", alt: "The cow reading on a tall stack of books", x: "58%", y: "56%", size: 180, motion: "float", depth: 0.25, glow: "signal" },
  entrepreneurship: { id: "hero-entrepreneurship", alt: "The lab-coat cow with a briefcase and a boxed sensor", x: "58%", y: "56%", size: 200, motion: "bob", depth: 0.3, glow: "signal" },
} as const satisfies Record<string, HeroCast>;

export type HeroPage = keyof typeof HERO_CAST;

/** Banner sprite for a route (`/education` or `education`). Unknown routes use `default`. */
export function heroCastFor(page?: string): HeroCast {
  const key = page?.replace(/^\//, "") || "default";
  if (key in HERO_CAST) return HERO_CAST[key as HeroPage];
  return HERO_CAST.default;
}

/** Catalog id to draw, or null when that image title is not in `ART` yet. */
export function heroArtId(cast: HeroCast): ArtId | null {
  if (cast.id in ART) return cast.id as ArtId;
  return null;
}
