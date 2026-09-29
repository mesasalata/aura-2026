/**
 * Style-lock the keeper cows, then generate one-object props.
 * Recraft create-style (hand_drawn) → recraft-v3 + style_id → rembg.
 *
 * Writes candidates to public/art/gen/review/. Does not overwrite keepers.
 * Human-pick anything that is not a single object.
 *
 *   node scripts/gen-kit.mjs
 */
import { mkdir, readFile, writeFile, copyFile } from "node:fs/promises";
import { createWriteStream, existsSync } from "node:fs";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { pipeline } from "node:stream/promises";
import { Readable } from "node:stream";
import path from "node:path";
import os from "node:os";

const exec = promisify(execFile);
const ROOT = path.resolve(import.meta.dirname, "..");
const OUT = path.join(ROOT, "public", "art", "gen");
const REVIEW = path.join(OUT, "review");
const KEEPERS = ["mascot-scientist.png", "cow-grazing.png"];

const envText = await readFile(path.join(ROOT, ".env"), "utf8");
const KEY = Object.fromEntries(
  envText
    .split("\n")
    .filter((l) => l.includes("=") && !l.trim().startsWith("#"))
    .map((l) => {
      const i = l.indexOf("=");
      return [l.slice(0, i).trim(), l.slice(i + 1).trim()];
    }),
).FAL_API_KEY;

if (!KEY) {
  console.error("Missing FAL_API_KEY");
  process.exit(1);
}

const HAND =
  "Gouache picture-book still life, visible paper grain, soft colored-pencil edge, plump cream dairy-cow world with rosy cheeks. Isolated on plain solid white. NO text, NO letters, NO watermark, NO second object, NO people, NO children, NO landscape, NO circular badge, NO sticker frame, NO kawaii face on the object.";

const JOBS = [
  {
    file: "icon-bucket.png",
    prompt: `ONLY a single small farm milk pail, pewter grey, cream milk at the brim, simple wire handle. ${HAND}`,
  },
  {
    file: "milk-drop.png",
    prompt: `ONLY a single plump teardrop of cream milk, glossy highlight, no face, no eyes, no limbs. ${HAND}`,
  },
  {
    file: "icon-clot.png",
    prompt: `ONLY a small irregular soft-pink milk curd sitting in a tiny puddle of cream. Not a creature. ${HAND}`,
  },
  {
    file: "flask-pink.png",
    prompt: `ONLY a simple glass Erlenmeyer flask half-filled with glowing hot-pink liquid, a few bubbles. ${HAND}`,
  },
  {
    file: "flask-milk.png",
    prompt: `ONLY a simple glass Erlenmeyer flask half-filled with creamy ivory milk. ${HAND}`,
  },
  {
    file: "coin.png",
    prompt: `ONLY a single gold coin at a slight angle, plain face with a tiny teardrop mark, no letters, no numbers. ${HAND}`,
  },
];

async function falPost(model, input) {
  const res = await fetch(`https://queue.fal.run/${model}`, {
    method: "POST",
    headers: { Authorization: `Key ${KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error(`${model} submit ${res.status}: ${(await res.text()).slice(0, 500)}`);
  return res.json();
}

async function falAwait(model, requestId) {
  const parts = model.split("/");
  const base =
    parts.length <= 2
      ? model
      : model.startsWith("fal-ai/imageutils")
        ? "fal-ai/imageutils"
        : model;
  for (let i = 0; i < 90; i++) {
    const res = await fetch(`https://queue.fal.run/${base}/requests/${requestId}/status`, {
      headers: { Authorization: `Key ${KEY}` },
    });
    const text = await res.text();
    const data = text ? JSON.parse(text) : {};
    if (data.status === "COMPLETED") {
      const r = await fetch(`https://queue.fal.run/${base}/requests/${requestId}`, {
        headers: { Authorization: `Key ${KEY}` },
      });
      if (!r.ok) throw new Error(`${model} result ${r.status}`);
      return r.json();
    }
    if (data.status === "FAILED") throw new Error(`${model} failed: ${JSON.stringify(data).slice(0, 400)}`);
    await new Promise((r) => setTimeout(r, 2500));
  }
  throw new Error(`${model} timed out`);
}

async function download(url, dest) {
  const res = await fetch(url);
  if (!res.ok || !res.body) throw new Error(`download ${res.status}`);
  await pipeline(Readable.fromWeb(res.body), createWriteStream(dest));
}

async function pngToPng(file) {
  try {
    await exec("sips", ["-s", "format", "png", file, "--out", file]);
  } catch {
    /* sips missing or already png */
  }
}

await mkdir(REVIEW, { recursive: true });

const tmp = path.join(os.tmpdir(), `aura-keepers-${Date.now()}.zip`);
await exec("zip", ["-j", tmp, ...KEEPERS.map((f) => path.join(OUT, f))]);
const zipB64 = (await readFile(tmp)).toString("base64");
console.log("create-style from keepers…");
const styleJob = await falPost("fal-ai/recraft/v3/create-style", {
  images_data_url: `data:application/zip;base64,${zipB64}`,
  base_style: "digital_illustration/hand_drawn",
});
const styleDone = await falAwait("fal-ai/recraft/v3/create-style", styleJob.request_id);
const styleId = styleDone.style_id;
if (!styleId) throw new Error(`no style_id: ${JSON.stringify(styleDone).slice(0, 400)}`);
await writeFile(path.join(REVIEW, "style-id.txt"), styleId);
console.log("style_id saved");

for (const job of JOBS) {
  for (const n of [1, 2]) {
    const tag = `${job.file.replace(".png", "")}-${n}`;
    process.stdout.write(`${tag}: still… `);
    const submitted = await falPost("fal-ai/recraft-v3", {
      prompt: job.prompt,
      image_size: "square_hd",
      style_id: styleId,
    });
    const still = await falAwait("fal-ai/recraft-v3", submitted.request_id);
    const stillUrl = still.images?.[0]?.url;
    if (!stillUrl) throw new Error(`no image for ${tag}`);

    process.stdout.write("cutout… ");
    const cut = await falPost("fal-ai/imageutils/rembg", { image_url: stillUrl });
    const done = await falAwait("fal-ai/imageutils/rembg", cut.request_id);
    const url = done.image?.url;
    if (!url) throw new Error(`no cutout for ${tag}`);

    const dest = path.join(REVIEW, `${tag}.png`);
    await download(url, dest);
    await pngToPng(dest);
    console.log("ok");
  }
}

console.log("Candidates in public/art/gen/review/ - pick one object, throw away the rest.");
if (!existsSync(path.join(OUT, "style-id.txt"))) {
  await copyFile(path.join(REVIEW, "style-id.txt"), path.join(OUT, "style-id.txt"));
}
