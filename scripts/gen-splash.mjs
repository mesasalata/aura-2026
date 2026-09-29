/**
 * MilkBurst seam clip, drawn in the cast look (scripts/look.mjs):
 * Recraft still on green → Kling 2.5 i2v on green → colorkey per frame → VP9/HEVC alpha.
 * The bucket goes over and the milk floods the whole frame, so the last frame is
 * the next section's background.
 *
 *   node scripts/gen-splash.mjs stills [n] [start] [landscape|portrait]  # → review/splash-still-N.png (+ -raw.webp)
 *   node scripts/gen-splash.mjs pick <N> [landscape|portrait]            # → review/splash-frame[-portrait].png (Kling start frame)
 *   node scripts/gen-splash.mjs video <tag> [seed] [landscape|portrait]  # Kling → review/splash-video-<tag>.mp4 + contact sheet
 *   node scripts/gen-splash.mjs matte <tag> [landscape|portrait]         # → splash[-portrait].{webm,mov,mp4} + posters
 *   node scripts/gen-splash.mjs inspect <tag> [landscape|portrait]       # keyed frames over cream + ink → review sheet
 *   SPLASH_SIM=0.14 SPLASH_BLEND=0.12 node scripts/gen-splash.mjs matte <tag>
 *
 * Outputs in public/art/gen/ (landscape; portrait variants get a -portrait suffix):
 *   splash.webm / splash.mov / splash.mp4   alpha clip (VP9 / HEVC) + opaque fallback over --color-milk
 *   splash-poster.png                        keyed first frame
 *   splash-last.png                          keyed last frame (for review: how white does it end?)
 *   splash-manifest.json
 * Intermediates (stills, start frames, raw Kling clips, contact sheets) stay in the gitignored review/.
 *
 * White milk is invisible to rembg (it eats the white), so every step keeps a
 * green screen and keys it with RGB-distance `colorkey` (see fal.mjs keyOut).
 */
import { mkdir, readFile, writeFile, copyFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import path from "node:path";
import { OUT, REVIEW, falRun, uploadToFal, download, toPng, keyOut, keyFilter, sampleColor, cleanup } from "./fal.mjs";
import { GREEN_BG, look, readStyleId } from "./look.mjs";

const exec = promisify(execFile);
const MANIFEST = path.join(OUT, "splash-manifest.json");
const KLING = "fal-ai/kling-video/v2.5-turbo/pro/image-to-video";
const MILK = "0xf6eee0"; // --color-milk, the section after the seam

/* Ivory, white, cocoa only - tan/pink in the steering palette is what produced pink,
 * banded buckets. The green swatch makes the white-trained style_id honour the screen. */
const COLORS = [
  { r: 246, g: 238, b: 224 },
  { r: 255, g: 253, b: 245 },
  { r: 90, g: 61, b: 51 },
  { r: 0, g: 177, b: 64 },
];

const BUCKET =
  "ONLY one simple tapered galvanised milk bucket, wider at the top than at the bottom, with a plain single-colour pale ivory-grey body: NO stripes, NO bands, NO rings, NO layers, NOT a cake, NOT a barrel, no pattern on the body at all. A thin rim and one curved dark-brown handle. The bucket is small, tilted steeply forward, placed high in the picture with lots of empty green below it, and a thick wave of bright white milk is just starting to gush out of its open mouth and fall downward, with a few round white droplets. Side view, the bucket takes up only about a third of the picture height.";

const STILL = `${BUCKET} ${look("", GREEN_BG)}`;

const SPLASH =
  "Flat 2D cartoon animation, static locked camera, no zoom, no pan. The whole background is one flat solid bright green colour (green screen) until the milk covers it. The tipped ivory bucket rocks forward and a huge wave of bright white milk explodes out of its mouth with big splashes and round droplets. The milk keeps pouring and surging, piles up at the bottom and rises steadily up the frame as one growing wave, in smooth continuous motion, until it covers the bucket and completely fills the entire frame with flat solid white by the end of the clip; the very last frame is solid plain white milk edge to edge, nothing else visible. One continuous shot, no cuts, no fades. Thick even dark-brown outlines on the bucket and the milk edge, flat colours, no shading, no gradients, no text.";

const NEGATIVE =
  "text, subtitles, watermark, logo, people, hands, cow, extra buckets, camera zoom, camera pan, shake, cut, jump cut, fade, flash, live-action, photoreal, 3D render, glossy, gradient background, vignette, shadow, floor, table, grey milk, transparent milk, stripes, bands";

const SIZES = { landscape: "landscape_16_9", portrait: "portrait_16_9" };

const suffix = (variant) => (variant === "portrait" ? "-portrait" : "");
const name = (base, variant, ext) => `${base}${suffix(variant)}${ext}`;

async function readManifest() {
  return existsSync(MANIFEST) ? JSON.parse(await readFile(MANIFEST, "utf8")) : {};
}
async function writeManifest(m) {
  await writeFile(MANIFEST, JSON.stringify(m, null, 2));
}
async function ffmpeg(args) {
  return exec("ffmpeg", ["-y", "-hide_banner", "-loglevel", "error", ...args]);
}
async function probe(file) {
  const { stdout } = await exec("ffprobe", ["-v", "error", "-select_streams", "v:0", "-show_entries", "stream=width,height,r_frame_rate,nb_frames:format=duration", "-of", "json", file]);
  const j = JSON.parse(stdout);
  const s = j.streams[0];
  const [n, d] = s.r_frame_rate.split("/").map(Number);
  return { width: s.width, height: s.height, fps: n / d, frames: Number(s.nb_frames) || null, duration: Number(j.format.duration) };
}
/** Contact sheet of a clip at 2 fps so the whole arc can be judged in one image. */
async function sheet(src, dest, { fps = 2, cols = 5, w = 384 } = {}) {
  const { duration } = await probe(src);
  const rows = Math.max(1, Math.ceil(Math.round(duration * fps) / cols));
  const decode = src.endsWith(".webm") ? ["-c:v", "libvpx-vp9"] : [];
  await ffmpeg([...decode, "-i", src, "-vf", `fps=${fps},scale=${w}:-2,tile=${cols}x${rows}:padding=4:color=0x333333`, "-frames:v", "1", dest]);
}

/* --------------------------------------------------------------- stills */
async function stills(count = 4, start = 1, variant = "landscape") {
  await mkdir(REVIEW, { recursive: true });
  const styleId = await readStyleId();
  if (!styleId) throw new Error("no cast-style-id.txt - run gen-cast.mjs lock first");
  const meta = {};
  await Promise.all(
    Array.from({ length: count }, (_, i) => i + start).map(async (n) => {
      const tag = `splash-still${suffix(variant)}-${n}`;
      try {
        const still = await falRun("fal-ai/recraft-v3", { prompt: STILL, image_size: SIZES[variant], colors: COLORS, style_id: styleId });
        const url = still.images?.[0]?.url;
        if (!url) throw new Error(`no image: ${JSON.stringify(still).slice(0, 200)}`);
        const raw = path.join(REVIEW, `${tag}-raw.webp`);
        const dest = path.join(REVIEW, `${tag}.png`);
        await download(url, raw);
        const key = await keyOut(raw, dest);
        await toPng(dest, 2048);
        meta[tag] = { url, key };
        const [r, g, b] = [0, 2, 4].map((i) => parseInt(key.slice(i, i + 2), 16));
        const warn = g - Math.max(r, b) < 12 ? " - background is not green, do not pick" : "";
        console.log(`${tag} ok (key ${key})${warn}`);
      } catch (e) {
        console.log(`${tag} failed: ${e.message.slice(0, 200)}`);
      }
    }),
  );
  const manifest = await readManifest();
  manifest.candidates = { ...(manifest.candidates ?? {}), styleId, ...meta };
  await writeManifest(manifest);
}

/* ----------------------------------------------------------------- pick */
/** The raw (un-keyed) green still becomes the Kling start frame, as a full-res PNG. */
async function pick(n, variant = "landscape") {
  const tag = `splash-still${suffix(variant)}-${n}`;
  const raw = path.join(REVIEW, `${tag}-raw.webp`);
  if (!existsSync(raw)) throw new Error(`no candidate ${raw}`);
  const frame = path.join(REVIEW, name("splash-frame", variant, ".png"));
  await ffmpeg(["-i", raw, "-vf", "format=rgb24", "-frames:v", "1", frame]);
  const manifest = await readManifest();
  manifest[variant] = { ...(manifest[variant] ?? {}), still: { candidate: `review/${tag}.png`, ...(manifest.candidates?.[tag] ?? {}), frame: `review/${path.basename(frame)}` } };
  await writeManifest(manifest);
  console.log(`${path.relative(OUT, frame)} ← candidate ${n}`);
}

/* ---------------------------------------------------------------- video */
async function video(tag, seed, variant = "landscape") {
  if (!tag) throw new Error("video needs a tag, e.g. `video a`");
  const manifest = await readManifest();
  const still = manifest[variant]?.still;
  if (!still?.frame) throw new Error("Run pick first");

  if (!still.frameUrl) {
    process.stdout.write("Upload frame");
    still.frameUrl = await uploadToFal(path.join(OUT, still.frame), "image/png");
    await writeManifest(manifest);
    console.log(" ok");
  }

  process.stdout.write(`Kling 5s splash (${tag})`);
  const input = { prompt: SPLASH, image_url: still.frameUrl, duration: "5", cfg_scale: 0.5, negative_prompt: NEGATIVE };
  if (seed !== undefined && seed !== "") input.seed = Number(seed);
  const result = await falRun(KLING, input, { tries: 240, wait: 3000 });
  const url = result.video?.url;
  if (!url) throw new Error(`no video url: ${JSON.stringify(result).slice(0, 400)}`);

  const raw = path.join(REVIEW, `splash-video${suffix(variant)}-${tag}.mp4`);
  await download(url, raw);
  const sheetFile = raw.replace(/\.mp4$/, "-sheet.png");
  await sheet(raw, sheetFile);
  console.log(` ok → ${path.relative(OUT, raw)} (+ sheet)`);

  manifest[variant].videos = { ...(manifest[variant].videos ?? {}), [tag]: { url, seed: input.seed ?? null, prompt: SPLASH, raw: path.basename(raw) } };
  await writeManifest(manifest);
}

/* ---------------------------------------------------------------- matte */
async function matte(tag, variant = "landscape") {
  const manifest = await readManifest();
  const v = manifest[variant]?.videos?.[tag];
  if (!v) throw new Error(`no video ${tag} for ${variant} - run video first`);
  const raw = path.join(REVIEW, v.raw);
  if (!existsSync(raw)) await download(v.url, raw);

  const webm = path.join(OUT, name("splash", variant, ".webm"));
  const mov = path.join(OUT, name("splash", variant, ".mov"));
  const mp4 = path.join(OUT, name("splash", variant, ".mp4"));
  const poster = path.join(OUT, name("splash-poster", variant, ".png"));
  const last = path.join(OUT, name("splash-last", variant, ".png"));
  const vp9 = ["-c:v", "libvpx-vp9", "-pix_fmt", "yuva420p", "-b:v", "0", "-crf", "28", "-row-mt", "1", "-g", "6", "-keyint_min", "6", "-auto-alt-ref", "0"];

  // Kling drifts the green, so sample the first frame (the last frames are milk).
  const key = await sampleColor(raw);
  const similarity = Number(process.env.SPLASH_SIM ?? 0.14);
  const blend = Number(process.env.SPLASH_BLEND ?? 0.12);
  const filter = keyFilter(key, { similarity, blend });
  process.stdout.write(`colorkey 0x${key} (${similarity}/${blend})`);
  await ffmpeg(["-i", raw, "-an", "-vf", filter, ...vp9, webm]);
  console.log(` ok → ${path.basename(webm)} (g=6)`);

  let hasMov = false;
  try {
    await ffmpeg([
      "-c:v", "libvpx-vp9", "-i", webm, "-an",
      "-c:v", "hevc_videotoolbox", "-alpha_quality", "0.8", "-q:v", "62",
      "-tag:v", "hvc1", "-pix_fmt", "bgra", "-g", "6", "-movflags", "+faststart",
      mov,
    ]);
    hasMov = true;
    console.log(`${path.basename(mov)} (HEVC alpha) ok`);
  } catch {
    console.log(`${path.basename(mov)} skipped (hevc_videotoolbox alpha unavailable)`);
  }

  const { width, height, fps, duration } = await probe(raw);
  await ffmpeg([
    "-f", "lavfi", "-i", `color=c=${MILK}:s=${width}x${height}:r=${Math.round(fps)}`,
    "-c:v", "libvpx-vp9", "-i", webm, "-an",
    "-filter_complex", "[0:v][1:v]overlay=format=auto:shortest=1,format=yuv420p[v]",
    "-map", "[v]",
    "-c:v", "libx264", "-preset", "slow", "-crf", "20", "-g", "6", "-keyint_min", "6", "-movflags", "+faststart",
    mp4,
  ]);
  console.log(`${path.basename(mp4)} fallback ok`);

  await ffmpeg(["-i", raw, "-vf", filter, "-frames:v", "1", poster]);
  // `-update 1` keeps overwriting one PNG, so what is left is the final frame.
  await ffmpeg(["-i", raw, "-vf", filter, "-update", "1", last]);
  console.log(`${path.basename(poster)} + ${path.basename(last)} ok`);

  manifest[variant].matte = {
    source: tag,
    key,
    similarity,
    blend,
    width,
    height,
    fps,
    duration,
    webm: path.basename(webm),
    mov: hasMov ? path.basename(mov) : null,
    mp4: path.basename(mp4),
    poster: path.basename(poster),
    last: path.basename(last),
  };
  await writeManifest(manifest);
}

/* -------------------------------------------------------------- inspect */
/** Keyed frames composited over cream and ink, side by side, to hunt for fringing. */
async function inspect(tag, variant = "landscape") {
  const manifest = await readManifest();
  const v = manifest[variant]?.videos?.[tag];
  if (!v) throw new Error(`no video ${tag}`);
  const raw = path.join(REVIEW, v.raw);
  const key = await sampleColor(raw);
  const similarity = Number(process.env.SPLASH_SIM ?? 0.14);
  const blend = Number(process.env.SPLASH_BLEND ?? 0.12);
  const filter = keyFilter(key, { similarity, blend });
  const { width, height } = await probe(raw);
  const dest = path.join(REVIEW, `splash-video${suffix(variant)}-${tag}-key.png`);
  await ffmpeg([
    "-f", "lavfi", "-i", `color=c=0xeadfcb:s=${width}x${height}:r=2`,
    "-f", "lavfi", "-i", `color=c=0x1c140f:s=${width}x${height}:r=2`,
    "-i", raw,
    "-filter_complex",
    `[2:v]${filter},fps=2,split[a][b];[0:v][a]overlay=format=auto:shortest=1,scale=384:-2,tile=5x3:padding=4:color=0x333333[c];[1:v][b]overlay=format=auto:shortest=1,scale=384:-2,tile=5x3:padding=4:color=0x333333[d];[c][d]vstack`,
    "-frames:v", "1", dest,
  ]);
  console.log(`${path.relative(OUT, dest)} (key 0x${key})`);
}

const [cmd = "stills", ...rest] = process.argv.slice(2);
try {
  if (cmd === "stills") await stills(Number(rest[0] ?? 4), Number(rest[1] ?? 1), rest[2] ?? "landscape");
  else if (cmd === "pick") await pick(rest[0] ?? "1", rest[1] ?? "landscape");
  else if (cmd === "video") await video(rest[0], rest[1], rest[2] ?? "landscape");
  else if (cmd === "matte") await matte(rest[0], rest[1] ?? "landscape");
  else if (cmd === "inspect") await inspect(rest[0], rest[1] ?? "landscape");
  else {
    console.error("usage: node scripts/gen-splash.mjs stills [n] [start] [variant] | pick <N> [variant] | video <tag> [seed] [variant] | matte <tag> [variant] | inspect <tag> [variant]");
    process.exit(1);
  }
} finally {
  await cleanup();
}
