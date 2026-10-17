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
 * One banner sprite per wiki page. `id` is the image title to draw, whether or
 * not that file is in `ART` yet. Missing files are shown as the id and `alt`, as text.
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
  description: { id: "inline-biosensor", alt: "An inline sensor sitting in a milking line", x: "58%", y: "56%", size: 220, motion: "breathe", depth: 0.3, glow: "signal" },
  background: { id: "mastitis-udder", alt: "A dairy cow with a quiet sign of udder infection", x: "58%", y: "56%", size: 220, motion: "breathe", depth: 0.3, glow: "pink" },
  engineering: { id: "catapult-cycle", alt: "A DNA catapult opening on a sensor surface", x: "58%", y: "56%", size: 220, motion: "float", depth: 0.3, glow: "butter" },
  results: { id: "fluorescence-readout", alt: "A fluorescence trace comparing four probe variants", x: "58%", y: "56%", size: 220, motion: "breathe", depth: 0.3, glow: "signal" },
  contribution: { id: "open-parts", alt: "Labeled DNA parts laid out for another team", x: "58%", y: "56%", size: 200, motion: "bob", depth: 0.3, glow: "pink" },
  experiments: { id: "binding-assay", alt: "A closed probe opening as a target strand binds", x: "58%", y: "56%", size: 240, motion: "breathe", depth: 0.35, glow: "pink" },
  protocols: { id: "bench-protocol", alt: "A written bench protocol beside a sample tube", x: "58%", y: "56%", size: 220, motion: "breathe", depth: 0.3, glow: "signal" },
  parts: { id: "dna-parts", alt: "Short DNA strands drawn as separate parts", x: "58%", y: "56%", size: 220, motion: "float", depth: 0.3, glow: "butter" },
  measurement: { id: "calibration-curve", alt: "A calibration curve of signal against concentration", x: "58%", y: "56%", size: 220, motion: "breathe", depth: 0.3, glow: "signal" },
  notebook: { id: "lab-notebook", alt: "An open lab notebook with a dated entry", x: "58%", y: "56%", size: 200, motion: "bob", depth: 0.3, glow: "butter" },
  model: { id: "signal-score", alt: "A load score rising from a sensor trace", x: "58%", y: "56%", size: 220, motion: "float", depth: 0.3, glow: "butter" },
  hardware: { id: "milking-chamber", alt: "A sampling chamber fitted to a milking machine", x: "58%", y: "56%", size: 240, motion: "breathe", depth: 0.35, glow: "signal" },
  software: { id: "parlour-display", alt: "A parlour screen showing a quiet cow alert", x: "58%", y: "56%", size: 200, motion: "bob", depth: 0.3, glow: "pink" },
  "human-practices": { id: "farm-visit", alt: "A farmer and a student talking in a parlour", x: "58%", y: "56%", size: 200, motion: "bob", depth: 0.3, glow: "pink" },
  "integrated-human-practices": { id: "feedback-loop", alt: "A loop from a farm conversation back to the sensor", x: "58%", y: "56%", size: 220, motion: "breathe", depth: 0.3, glow: "signal" },
  education: { id: "classroom", alt: "Students gathered around a table at a workshop", x: "58%", y: "56%", size: 200, motion: "bob", depth: 0.3, glow: "butter" },
  sustainability: { id: "grazing-herd", alt: "A small dairy herd grazing in a field", x: "58%", y: "56%", size: 220, motion: "breathe", depth: 0.3, glow: "pink" },
  safety: { id: "containment", alt: "A closed sample tube sitting in a lab tray", x: "58%", y: "56%", size: 200, motion: "breathe", depth: 0.25, glow: "signal" },
  team: { id: "team-portrait", alt: "The student team standing together", x: "58%", y: "56%", size: 180, motion: "breathe", depth: 0.25, glow: "pink" },
  attributions: { id: "advisors", alt: "Advisors standing beside the student team", x: "58%", y: "56%", size: 180, motion: "breathe", depth: 0.25, glow: "butter" },
  references: { id: "source-stack", alt: "A short stack of papers and citations", x: "58%", y: "56%", size: 180, motion: "float", depth: 0.25, glow: "signal" },
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
