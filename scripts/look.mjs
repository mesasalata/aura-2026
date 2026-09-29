/**
 * The one look every generated bitmap shares: bold clip art with a hand in it.
 * Imported by gen-cast.mjs (characters) and gen-pour.mjs (hero pail) so the
 * Recraft base style, the locked style_id, the palette and the style sentence
 * never drift apart.
 */
import { readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { OUT } from "./fal.mjs";

export const BASE = "digital_illustration/hand_drawn_outline";
export const STYLE_FILE = path.join(OUT, "cast-style-id.txt");

/* Recraft palette steering: ivory, tan, pink, cocoa line, white. */
export const COLORS = [
  { r: 246, g: 238, b: 224 },
  { r: 201, g: 166, b: 124 },
  { r: 240, g: 155, b: 180 },
  { r: 90, g: 61, b: 51 },
  { r: 255, g: 253, b: 245 },
];

const HAND =
  "Bold flat clip-art with a hand-drawn feel: thick even warm dark-brown outline, slightly wobbly marker line, flat fills only, no gradients, no texture, no shading.";
const RULES = "Chunky, sticker-like, friendly, simple.";
const NEGATIVES = "NO text, NO watermark, NO second animal, NO people, NO background, NO frame.";

export const WHITE_BG = "Plain solid white background.";
/* White milk on a white page is invisible to rembg, so milk subjects ask for a
 * green screen and get keyed with ffmpeg colorkey (see fal.mjs keyOut). */
export const GREEN_BG =
  "The whole background is one flat solid bright green colour (green screen), nothing else in the background.";

/* Recraft caps prompts at 1000 chars - keep the detail short. */
export const look = (detail = "", bg = WHITE_BG) => [HAND, detail, RULES, bg, NEGATIVES].filter(Boolean).join(" ");
export const LOOK = look();
export const COW_LOOK = look("Off-white ivory cream body, small pale horns, dark-brown hooves.");

/** The style_id locked by `gen-cast.mjs lock`, or null before locking. */
export async function readStyleId() {
  return existsSync(STYLE_FILE) ? (await readFile(STYLE_FILE, "utf8")).trim() : null;
}
