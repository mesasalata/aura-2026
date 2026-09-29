/**
 * Hero pour overlay, drawn in the cast look (scripts/look.mjs):
 * Recraft still on green → colorkey → Kling 2.5 i2v on green → colorkey per frame → VP9/HEVC alpha.
 *
 *   node scripts/gen-pour.mjs candidates [n] [start]   # n pail stills → public/art/gen/review/pail-N.png (+ pail-N-raw.webp)
 *   node scripts/gen-pour.mjs pick <N>         # review/pail-N.png → pour-poster.png (alpha) + pour-frame.png (Kling start frame)
 *   node scripts/gen-pour.mjs video [seed]     # Kling pour from pour-frame.png → pour-raw.mp4
 *   node scripts/gen-pour.mjs matte [key|veed] # key (default): ffmpeg colorkey on the sampled green; veed: VEED rembg
 *   POUR_SIM=0.14 POUR_BLEND=0.12 node scripts/gen-pour.mjs matte   # tune the key
 *
 * Outputs in public/art/video/:
 *   pour.webm         VP9 + alpha, the overlay (Chrome / Firefox / Edge)
 *   pour.mov          HEVC + alpha for Safari (if hevc_videotoolbox is available)
 *   pour.mp4          flat-ink fallback (matches the hero background)
 *   pour-poster.png   transparent still of the resting pail, same framing as the clip
 *   pour-frame.png    the Kling start frame (pail on flat green)
 *
 * White milk is invisible to rembg (it eats the white), so every step keeps a
 * green screen and keys it with RGB-distance `colorkey` (see fal.mjs keyOut).
 * components/viz/bucket-pour.tsx scrubs the clip by currentTime: keep 1080x1920, 24 fps, 10 s.
 */
import { mkdir, readFile, writeFile, unlink } from "node:fs/promises";
import { existsSync } from "node:fs";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import path from "node:path";
import { ROOT, REVIEW, falRun, uploadToFal, download, toPng, keyOut, keyFilter, sampleColor, cleanup } from "./fal.mjs";
import { GREEN_BG, look, readStyleId } from "./look.mjs";

const exec = promisify(execFile);
const OUT = path.join(ROOT, "public", "art", "video");
const MANIFEST = path.join(OUT, "manifest.json");

const KLING = "fal-ai/kling-video/v2.5-turbo/pro/image-to-video";
const VEED = "veed/video-background-removal";

/* Clip geometry: 9:16, the pail small in the upper third so the stream has room to fall. */
const W = 1080;
const H = 1920;
const PAIL_H = 500;
const PAIL_Y = 150;
const INK = "0x1c140f"; // --color-ink
const GREEN = "00b140"; // the Kling start-frame green screen

/* No pink in the steering palette or the pail itself turns pink; the green swatch
 * is there because the white-trained style_id otherwise ignores the green screen. */
/* Any pink or tan in the steering palette ends up as bands on the pail, and bands
 * read as a layer cake. Ivory + cocoa + white only, plus green for the screen. */
const PAIL_COLORS = [
  { r: 246, g: 238, b: 224 },
  { r: 239, g: 230, b: 214 },
  { r: 90, g: 61, b: 51 },
  { r: 255, g: 253, b: 245 },
  { r: 0, g: 177, b: 64 },
];

/* Recraft only honours the green screen about half the time with this style_id;
 * `candidates` flags the misses, just run another batch and pick a green one. */
const PAIL_STILL = `ONLY one simple tapered galvanised bucket standing upright, side view, centred, on a bright green screen: wider at the top than the bottom, plain single-colour light ivory-grey body, NO stripes, NO bands, NO rings, NO layers, NOT a cake, NOT a barrel, just one flat colour with a single thin rim line at the top, one curved dark-brown wire handle arching over it, full to the brim with bright white milk with one flat white shine. Nothing else in the picture: no splash, no drips, no rays, no sparkles, no cow, no floor, no shadow. ${look("", GREEN_BG)}`;

const POUR =
  "Locked camera, no zoom, no pan, no shake. The whole background stays one completely flat solid bright green colour (green screen) for the entire clip, nothing else in the background. The plain ivory bucket slowly tips over to one side and pours one thick, smooth, continuous column of bright white milk from its rim, which falls straight down and out of the bottom edge of the frame. The stream stays attached to the lip the whole time, never a gap, never droplets. The pail keeps pouring until the end of the clip, rising a little as it tips. Nothing else enters the frame. Flat hand-drawn clip-art look: thick even dark-brown outlines, flat fills, the milk stream is a simple flat white shape with a dark-brown outline, 2D cartoon animation, no shading, no text, no people, no extra objects, no splash at the bottom, no pool.";

const NEGATIVE =
  "text, subtitles, watermark, logo, people, hands, cow, child, extra buckets, camera zoom, camera pan, shake, morphing, droplets, particles, splash, pool, floor, table, gradient background, vignette, shadow, live-action photoreal, metallic, pink, stripes, bands, cake, circular badge, sticker";

async function readManifest() {
  return existsSync(MANIFEST) ? JSON.parse(await readFile(MANIFEST, "utf8")) : {};
}

async function writeManifest(m) {
  await writeFile(MANIFEST, JSON.stringify(m, null, 2));
}

async function ffmpeg(args) {
  return exec("ffmpeg", ["-y", "-hide_banner", "-loglevel", "error", ...args]);
}

/* ----------------------------------------------------------- candidates */
async function candidates(count = 4, start = 1) {
  await mkdir(REVIEW, { recursive: true });
  const styleId = await readStyleId();
  if (!styleId) throw new Error("no cast-style-id.txt - run gen-cast.mjs lock first");
  const meta = {};
  await Promise.all(
    Array.from({ length: count }, (_, i) => i + start).map(async (n) => {
      const tag = `pail-${n}`;
      try {
        const still = await falRun("fal-ai/recraft-v3", {
          prompt: PAIL_STILL,
          image_size: "square_hd",
          colors: PAIL_COLORS,
          style_id: styleId,
        });
        const url = still.images?.[0]?.url;
        if (!url) throw new Error(`no image: ${JSON.stringify(still).slice(0, 200)}`);
        const raw = path.join(REVIEW, `${tag}-raw.webp`);
        const dest = path.join(REVIEW, `${tag}.png`);
        await download(url, raw);
        const key = await keyOut(raw, dest);
        await toPng(dest, 2048);
        meta[tag] = { url, key };
        // A near-white "green" means Recraft ignored the screen and the key ate the milk.
        const [r, g, b] = [0, 2, 4].map((i) => parseInt(key.slice(i, i + 2), 16));
        const warn = g - Math.max(r, b) < 12 ? " - background is not green, do not pick" : "";
        console.log(`${tag} ok (key ${key})${warn}`);
      } catch (e) {
        console.log(`${tag} failed: ${e.message.slice(0, 200)}`);
      }
    }),
  );
  await mkdir(OUT, { recursive: true });
  const manifest = await readManifest();
  manifest.candidates = { ...(manifest.candidates ?? {}), styleId, ...meta };
  await writeManifest(manifest);
  console.log("Candidates in public/art/gen/review/pail-*.png. Promote: node scripts/gen-pour.mjs pick <N>");
}

/* ----------------------------------------------------------------- pick */
/** Compose the transparent poster and the green-screen Kling start frame from one keyed still. */
async function pick(n) {
  const src = path.join(REVIEW, `pail-${n}.png`);
  if (!existsSync(src)) throw new Error(`no candidate ${src}`);
  await mkdir(OUT, { recursive: true });
  const poster = path.join(OUT, "pour-poster.png");
  const frame = path.join(OUT, "pour-frame.png");
  const place = `[1:v]scale=-1:${PAIL_H}[p];[0:v][p]overlay=(W-w)/2:${PAIL_Y}:format=auto`;
  await ffmpeg([
    "-f", "lavfi", "-i", `color=c=black@0.0:s=${W}x${H}:d=1,format=rgba`,
    "-i", src,
    "-filter_complex", `${place},format=rgba`,
    "-frames:v", "1", poster,
  ]);
  await ffmpeg([
    "-f", "lavfi", "-i", `color=c=0x${GREEN}:s=${W}x${H}:d=1`,
    "-i", src,
    "-filter_complex", `${place},format=rgb24`,
    "-frames:v", "1", frame,
  ]);
  const manifest = await readManifest();
  manifest.subject = "pail";
  manifest.still = {
    candidate: `review/pail-${n}.png`,
    ...(manifest.candidates?.[`pail-${n}`] ?? {}),
    poster: "pour-poster.png",
    frame: "pour-frame.png",
    frameGreen: GREEN,
  };
  await writeManifest(manifest);
  console.log(`pour-poster.png + pour-frame.png composed from candidate ${n}`);
}

/* ---------------------------------------------------------------- video */
async function generateVideo(seed) {
  const manifest = await readManifest();
  if (!manifest.still?.frame) throw new Error("Run pick first");

  process.stdout.write("Upload frame");
  const start = await uploadToFal(path.join(OUT, manifest.still.frame), "image/png");
  manifest.still.frameUrl = start;
  console.log(" ok");

  process.stdout.write("Kling 10s pour");
  const input = { prompt: POUR, image_url: start, duration: "10", cfg_scale: 0.6, negative_prompt: NEGATIVE };
  if (seed !== undefined) input.seed = Number(seed);
  const result = await falRun(KLING, input, { tries: 240, wait: 3000 });
  const url = result.video?.url;
  if (!url) throw new Error(`no video url: ${JSON.stringify(result).slice(0, 400)}`);

  const raw = path.join(OUT, "pour-raw.mp4");
  await download(url, raw);
  console.log(" ok → pour-raw.mp4");

  manifest.video = { url, prompt: POUR, seed: seed === undefined ? null : Number(seed) };
  await writeManifest(manifest);
}

/* ---------------------------------------------------------------- matte */
async function generateMatte(mode = "key") {
  const manifest = await readManifest();
  const src = manifest.video?.url;
  if (!src) throw new Error("Run video first");

  const raw = path.join(OUT, "pour-raw.mp4");
  if (!existsSync(raw)) await download(src, raw);

  const webm = path.join(OUT, "pour.webm");
  const mov = path.join(OUT, "pour.mov");
  const mp4 = path.join(OUT, "pour.mp4");
  const vp9 = ["-c:v", "libvpx-vp9", "-pix_fmt", "yuva420p", "-b:v", "0", "-crf", "28", "-row-mt", "1", "-g", "6", "-keyint_min", "6", "-auto-alt-ref", "0"];
  let matte;

  if (mode === "veed") {
    process.stdout.write("VEED video rembg");
    const result = await falRun(
      VEED,
      { video_url: src, output_codec: "vp9", refine_foreground_edges: true, subject_is_person: false },
      { tries: 240, wait: 3000 },
    );
    const url = result.video?.[0]?.url ?? result.video?.url;
    if (!url) throw new Error(`no matte url: ${JSON.stringify(result).slice(0, 400)}`);
    const webmRaw = path.join(OUT, "pour-alpha-raw.webm");
    await download(url, webmRaw);
    console.log(" ok");
    // Re-encode with dense keyframes so currentTime scrubbing is snappy.
    await ffmpeg(["-c:v", "libvpx-vp9", "-i", webmRaw, "-an", ...vp9, webm]);
    await unlink(webmRaw).catch(() => {});
    matte = { mode, url };
  } else {
    // Key the green screen per frame. Kling drifts the green a little, so sample
    // it from the first frame rather than trusting the start frame's value.
    const key = await sampleColor(raw);
    const similarity = Number(process.env.POUR_SIM ?? 0.14);
    const blend = Number(process.env.POUR_BLEND ?? 0.12);
    process.stdout.write(`colorkey 0x${key} (${similarity}/${blend})`);
    await ffmpeg(["-i", raw, "-an", "-vf", keyFilter(key, { similarity, blend }), ...vp9, webm]);
    console.log(" ok");
    matte = { mode, key, similarity, blend };
  }
  console.log("pour.webm encoded (g=6)");

  // Safari: HEVC with alpha via VideoToolbox. Best-effort.
  try {
    await ffmpeg([
      "-c:v", "libvpx-vp9", "-i", webm,
      "-an",
      "-c:v", "hevc_videotoolbox", "-alpha_quality", "0.8", "-q:v", "62",
      "-tag:v", "hvc1", "-pix_fmt", "bgra",
      "-g", "6",
      "-movflags", "+faststart",
      mov,
    ]);
    console.log("pour.mov (HEVC alpha) ok");
  } catch {
    console.log("pour.mov skipped (hevc_videotoolbox alpha unavailable)");
  }

  // Flat-ink fallback (no alpha): the overlay composited over the hero ink.
  await ffmpeg([
    "-f", "lavfi", "-i", `color=c=${INK}:s=${W}x${H}:r=24`,
    "-c:v", "libvpx-vp9", "-i", webm, "-an",
    "-filter_complex", "[0:v][1:v]overlay=format=auto:shortest=1,format=yuv420p[v]",
    "-map", "[v]",
    "-c:v", "libx264", "-preset", "slow", "-crf", "20",
    "-g", "6", "-keyint_min", "6",
    "-movflags", "+faststart",
    mp4,
  ]);
  console.log("pour.mp4 fallback ok");

  manifest.matte = { webm: "pour.webm", mov: existsSync(mov) ? "pour.mov" : null, mp4: "pour.mp4", ...matte };
  await writeManifest(manifest);
  // The 20 MB Kling master is not shipped; `matte` re-downloads it from the manifest URL.
  await unlink(raw).catch(() => {});
  console.log("Done.");
}

const [cmd = "candidates", ...rest] = process.argv.slice(2);
try {
  if (cmd === "candidates") await candidates(Number(rest[0] ?? 4), Number(rest[1] ?? 1));
  else if (cmd === "pick") await pick(rest[0] ?? "1");
  else if (cmd === "video") await generateVideo(rest[0]);
  else if (cmd === "matte") await generateMatte(rest[0] ?? "key");
  else {
    console.error("usage: node scripts/gen-pour.mjs candidates [n] [start] | pick <N> | video [seed] | matte [key|veed]");
    process.exit(1);
  }
} finally {
  await cleanup();
}
