/**
 * Floppy green bills bursting on a blue screen (not green - the notes are green).
 * Recraft still → Kling 2.5 i2v → colorkey → VP9/HEVC alpha.
 *
 *   node scripts/gen-cash.mjs stills [n]
 *   node scripts/gen-cash.mjs pick <N>
 *   node scripts/gen-cash.mjs video [seed]
 *   node scripts/gen-cash.mjs matte
 *   node scripts/gen-cash.mjs all          # stills + pick greenest-blue + video + matte
 */
import { mkdir, readFile, writeFile, unlink, copyFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import path from "node:path";
import { ROOT, REVIEW, OUT as GEN, falRun, uploadToFal, download, toPng, keyOut, keyFilter, sampleColor, stillCutout, cleanup } from "./fal.mjs";
import { BASE, look, readStyleId } from "./look.mjs";

const exec = promisify(execFile);
const OUT = path.join(ROOT, "public", "art", "video");
const MANIFEST = path.join(OUT, "cash-manifest.json");
const KLING = "fal-ai/kling-video/v2.5-turbo/pro/image-to-video";
const BLUE = "0090ff";
const MILK = "0xf6eee0";

const BLUE_BG =
  "The whole background is one flat solid bright blue colour (chroma key blue #0090ff), nothing else in the background. NOT green.";

const COLORS = [
  { r: 107, g: 181, b: 111 },
  { r: 47, g: 111, b: 66 },
  { r: 90, g: 61, b: 51 },
  { r: 246, g: 238, b: 224 },
  { r: 0, g: 144, b: 255 },
];

const STILL = `A burst of floppy green paper banknotes exploding outward from the centre, mid-flight, some crumpled and bending, some twisting, paper-soft and wavy, flat clip-art money with thick dark-brown outlines, no numbers, no letters, a small milk-drop stamp on each note. About a dozen notes, different sizes, filling the frame. ${look("", BLUE_BG)}`;

const BURST =
  "Locked camera, no zoom, no pan. The whole background stays one completely flat solid bright blue colour for the entire clip. Individual green paper banknotes explode outward in every direction from the centre of the frame, flying to the edges. Each note is floppy paper: it bends in the middle, flaps, ripples, folds and tumbles as it flies, like money thrown in the air, never a rigid card, never a fan that stays together. Notes spin and wave independently. Flat 2D cartoon clip-art, thick even dark-brown outlines, no text, no people, no coins, no pail.";

const NEGATIVE =
  "text, numbers, watermark, logo, people, coins, gold, pail, bucket, camera zoom, photoreal, 3D, metallic, rigid cards, green screen, pink, cow";

async function readManifest() {
  return existsSync(MANIFEST) ? JSON.parse(await readFile(MANIFEST, "utf8")) : {};
}
async function writeManifest(m) {
  await writeFile(MANIFEST, JSON.stringify(m, null, 2));
}
function ffmpeg(args) {
  return exec("ffmpeg", ["-y", "-hide_banner", "-loglevel", "error", ...args]);
}

function isBlue(hex) {
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);
  return b - Math.max(r, g) > 20;
}

async function stills(count = 3, start = 1) {
  await mkdir(REVIEW, { recursive: true });
  const styleId = await readStyleId();
  if (!styleId) throw new Error("no cast-style-id.txt");
  const meta = {};
  await Promise.all(
    Array.from({ length: count }, (_, i) => i + start).map(async (n) => {
      const tag = `cash-${n}`;
      try {
        const still = await falRun("fal-ai/recraft-v3", {
          prompt: STILL,
          image_size: "landscape_16_9",
          colors: COLORS,
          style_id: styleId,
        });
        const url = still.images?.[0]?.url;
        if (!url) throw new Error("no image");
        const raw = path.join(REVIEW, `${tag}-raw.webp`);
        const dest = path.join(REVIEW, `${tag}.png`);
        await download(url, raw);
        const key = await keyOut(raw, dest);
        await toPng(dest, 1920);
        meta[tag] = { url, key, blue: isBlue(key) };
        console.log(`${tag} ok (key ${key})${isBlue(key) ? "" : " - background is not blue, skip"}`);
      } catch (e) {
        console.log(`${tag} failed: ${e.message.slice(0, 200)}`);
      }
    }),
  );
  const manifest = await readManifest();
  manifest.candidates = { ...(manifest.candidates ?? {}), styleId, ...meta };
  await writeManifest(manifest);
}

async function pick(n) {
  const src = path.join(REVIEW, `cash-${n}.png`);
  if (!existsSync(src)) throw new Error(`no candidate ${src}`);
  await mkdir(OUT, { recursive: true });
  const poster = path.join(OUT, "cash-poster.png");
  const frame = path.join(OUT, "cash-frame.png");
  await copyFile(src, poster);
  // Recraft still is already keyed; rebuild a blue-screen frame for Kling.
  await ffmpeg([
    "-f", "lavfi", "-i", `color=c=0x${BLUE}:s=1920x1080:d=1`,
    "-i", src,
    "-filter_complex", "[1:v]scale=1920:1080:force_original_aspect_ratio=decrease[p];[0:v][p]overlay=(W-w)/2:(H-h)/2:format=auto,format=rgb24",
    "-frames:v", "1",
    frame,
  ]);
  const manifest = await readManifest();
  manifest.still = { candidate: `review/cash-${n}.png`, poster: "cash-poster.png", frame: "cash-frame.png" };
  await writeManifest(manifest);
  console.log(`cash-poster + cash-frame from candidate ${n}`);
}

async function generateVideo(seed) {
  const manifest = await readManifest();
  if (!manifest.still?.frame) throw new Error("Run pick first");
  process.stdout.write("Upload frame");
  const start = await uploadToFal(path.join(OUT, manifest.still.frame), "image/png");
  console.log(" ok");
  process.stdout.write("Kling 10s cash burst");
  const input = { prompt: BURST, image_url: start, duration: "10", cfg_scale: 0.55, negative_prompt: NEGATIVE };
  if (seed !== undefined) input.seed = Number(seed);
  const result = await falRun(KLING, input, { tries: 240, wait: 3000 });
  const url = result.video?.url;
  if (!url) throw new Error(`no video: ${JSON.stringify(result).slice(0, 300)}`);
  await download(url, path.join(OUT, "cash-raw.mp4"));
  console.log(" ok");
  manifest.video = { url, prompt: BURST, seed: seed === undefined ? null : Number(seed) };
  await writeManifest(manifest);
}

async function generateMatte() {
  const manifest = await readManifest();
  const raw = path.join(OUT, "cash-raw.mp4");
  if (!existsSync(raw)) {
    if (!manifest.video?.url) throw new Error("Run video first");
    await download(manifest.video.url, raw);
  }
  const key = await sampleColor(raw);
  const similarity = Number(process.env.CASH_SIM ?? 0.16);
  const blend = Number(process.env.CASH_BLEND ?? 0.14);
  const webm = path.join(OUT, "cash.webm");
  const mov = path.join(OUT, "cash.mov");
  const mp4 = path.join(OUT, "cash.mp4");
  const vp9 = ["-c:v", "libvpx-vp9", "-pix_fmt", "yuva420p", "-b:v", "0", "-crf", "28", "-row-mt", "1", "-g", "6", "-keyint_min", "6", "-auto-alt-ref", "0"];
  process.stdout.write(`colorkey 0x${key} (${similarity}/${blend})`);
  await ffmpeg(["-i", raw, "-an", "-vf", keyFilter(key, { similarity, blend }), ...vp9, webm]);
  console.log(" ok");
  try {
    await ffmpeg([
      "-c:v", "libvpx-vp9", "-i", webm, "-an",
      "-c:v", "hevc_videotoolbox", "-alpha_quality", "0.8", "-q:v", "62",
      "-tag:v", "hvc1", "-pix_fmt", "bgra", "-g", "6", "-movflags", "+faststart", mov,
    ]);
    console.log("cash.mov ok");
  } catch {
    console.log("cash.mov skipped");
  }
  await ffmpeg([
    "-f", "lavfi", "-i", `color=c=${MILK}:s=1920x1080:r=24`,
    "-c:v", "libvpx-vp9", "-i", webm, "-an",
    "-filter_complex", "[0:v][1:v]overlay=format=auto:shortest=1,format=yuv420p[v]",
    "-map", "[v]", "-c:v", "libx264", "-preset", "slow", "-crf", "20",
    "-g", "6", "-keyint_min", "6", "-movflags", "+faststart", mp4,
  ]);
  console.log("cash.mp4 ok");
  manifest.matte = { webm: "cash.webm", mov: existsSync(mov) ? "cash.mov" : null, mp4: "cash.mp4", key, similarity, blend };
  await writeManifest(manifest);
  await unlink(raw).catch(() => {});
}

const NOTE_POSES = [
  "slightly bent in the middle like soft paper, tilted a little left",
  "gently curved, one corner flopped down, tilted a little right",
  "almost flat, a soft wave through the paper, sitting level",
];

async function notes() {
  await mkdir(GEN, { recursive: true });
  await mkdir(REVIEW, { recursive: true });
  const styleId = await readStyleId();
  if (!styleId) throw new Error("no cast-style-id.txt");
  await Promise.all(
    NOTE_POSES.map(async (pose, i) => {
      const n = i + 1;
      const dest = path.join(GEN, `bill-${n}.png`);
      const prompt = `ONLY one small green paper banknote, ${pose}, bold sticker clip-art, thick even dark-brown outline, flat grass-green fill, one simple circle stamp in the middle, no numbers, no letters, no other notes, no burst, no rays, no explosion. ${look("", "Plain solid white background.")}`;
      try {
        await stillCutout({
          prompt,
          style: BASE,
          styleId,
          dest,
          size: "square_hd",
          colors: COLORS.filter((c) => c.b < 200),
          maxPx: 512,
        });
        console.log(`bill-${n} ok → ${dest}`);
      } catch (e) {
        console.log(`bill-${n} failed: ${e.message.slice(0, 200)}`);
      }
    }),
  );
}

async function all() {
  await stills(3, 1);
  const manifest = await readManifest();
  const picks = Object.entries(manifest.candidates ?? {})
    .filter(([k, v]) => k.startsWith("cash-") && v.blue)
    .map(([k]) => k.replace("cash-", ""));
  const n = picks[0] ?? "1";
  console.log(`picking cash-${n}`);
  await pick(n);
  await generateVideo();
  await generateMatte();
}

const [cmd = "all", ...rest] = process.argv.slice(2);
try {
  if (cmd === "stills") await stills(Number(rest[0] ?? 3), Number(rest[1] ?? 1));
  else if (cmd === "pick") await pick(rest[0] ?? "1");
  else if (cmd === "video") await generateVideo(rest[0]);
  else if (cmd === "matte") await generateMatte();
  else if (cmd === "notes") await notes();
  else if (cmd === "all") await all();
  else {
    console.error("usage: stills | pick <N> | video | matte | notes | all");
    process.exit(1);
  }
} finally {
  await cleanup();
}
