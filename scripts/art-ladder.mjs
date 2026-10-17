/**
 * Pre-shrunk copies of every `ART` sprite, for the animated `Art` srcset.
 *
 *   node scripts/art-ladder.mjs     # writes public/art/ladder/<name>-<width>.webp
 *
 * Re-run after adding or replacing a sprite in lib/art-catalog.ts.
 */
import { mkdir, readdir, rm } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { ART, ladderFile, ladderWidths } from "../lib/art-catalog.ts";

const ROOT = path.resolve(import.meta.dirname, "..");
const OUT = path.join(ROOT, "public/art/ladder");

await mkdir(OUT, { recursive: true });
const keep = new Set();

for (const meta of Object.values(ART)) {
  const src = path.join(ROOT, "public/art", meta.source, meta.file);
  const { width, height } = await sharp(src).metadata();
  if (width !== meta.w || height !== meta.h) {
    throw new Error(`${meta.file} is ${width}×${height}, catalog says ${meta.w}×${meta.h}`);
  }
  for (const w of ladderWidths(meta.w)) {
    const name = ladderFile(meta, w);
    keep.add(name);
    await sharp(src)
      .resize({ width: w, kernel: "lanczos3" })
      .webp({ quality: 90, alphaQuality: 100, effort: 6 })
      .toFile(path.join(OUT, name));
  }
  console.log(`${meta.file}: ${ladderWidths(meta.w).length} copies`);
}

for (const name of await readdir(OUT)) {
  if (!keep.has(name)) await rm(path.join(OUT, name));
}
