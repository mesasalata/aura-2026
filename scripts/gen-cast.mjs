/**
 * The bitmap cast, regenerated in one look: bold clip art with a hand in it.
 * Thick even cocoa outlines, flat fills, one flat white shine - the same
 * language as the SVG marks in components/viz/marks.tsx.
 *
 *   node scripts/gen-cast.mjs explore [n]        # n healthy-cow candidates in the base style → review/explore-N.png
 *   node scripts/gen-cast.mjs lock <file>        # create a style_id from a picked explore image → cast-style-id.txt
 *   node scripts/gen-cast.mjs cast [n]           # every character, n candidates each → review/<name>-N.png
 *   node scripts/gen-cast.mjs sick [n]           # Kontext-edit the picked cow-grazing into n sick variants → review/cow-sick-kN.png
 *   node scripts/gen-cast.mjs pick <name> <N>    # promote review/<name>-N.png → public/art/gen/<name>.png
 */
import { mkdir, writeFile, copyFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import path from "node:path";
import os from "node:os";
import { OUT, REVIEW, falRun, stillCutout, uploadToFal, download, toPng, cleanup } from "./fal.mjs";
import { BASE, COLORS, COW_LOOK as LOOK, STYLE_FILE, readStyleId } from "./look.mjs";

const exec = promisify(execFile);

const CAST = [
  {
    name: "cow-grazing",
    prompt: `ONLY one friendly healthy dairy cow, full body, standing, side view facing left, all four legs visible, gentle smile, bright open eyes, ears up. Its patches are LIGHT TAN BEIGE (caramel latte colour) - absolutely NO pink patches; the only pink is a small pink nose and a small tidy pink udder. ${LOOK}`,
  },
  {
    name: "cow-sick",
    prompt: `ONLY the exact same dairy cow, full body, standing, side view facing left, all four legs visible, with LIGHT TAN BEIGE patches, but clearly unwell with mastitis: whole face and belly flushed a warm rosy pink, both ears drooping straight down, eyes closed into tired downward arcs, mouth a small flat frown, one flat teardrop of sweat beside the head, and the udder swollen much larger than normal and bright hot pink. Gentle and cute, not gory, no thermometer, no bandage. ${LOOK}`,
  },
  {
    name: "mascot-scientist",
    prompt: `ONLY the same dairy cow standing upright on two legs like a mascot, wearing a white lab coat, holding up one Erlenmeyer flask of hot-pink liquid in a hoof, proud smile. ${LOOK}`,
  },
  {
    name: "cow-reading",
    prompt: `ONLY the same dairy cow sitting down, holding an open book in its front hooves and reading it, calm content expression, small round glasses. ${LOOK}`,
  },
];

async function explore(count = 4) {
  await mkdir(REVIEW, { recursive: true });
  await Promise.all(
    Array.from({ length: count }, (_, i) => i + 1).map(async (n) => {
      const tag = `explore-${n}`;
      try {
        await stillCutout({ prompt: CAST[0].prompt, style: BASE, colors: COLORS, dest: path.join(REVIEW, `${tag}.png`) });
        console.log(`${tag} ok`);
      } catch (e) {
        console.log(`${tag} failed: ${e.message.slice(0, 160)}`);
      }
    }),
  );
  console.log("Look in public/art/gen/review/explore-*.png, then: node scripts/gen-cast.mjs lock <file>");
}

/** Style-lock from one or more picked images so every character shares the hand. */
async function lock(files) {
  const tmp = path.join(os.tmpdir(), `aura-cast-${Date.now()}.zip`);
  await exec("zip", ["-j", tmp, ...files]);
  const zipUrl = await uploadToFal(tmp, "application/zip");
  const done = await falRun("fal-ai/recraft/v3/create-style", { images_data_url: zipUrl, base_style: "digital_illustration" });
  if (!done.style_id) throw new Error(`no style_id: ${JSON.stringify(done).slice(0, 300)}`);
  await writeFile(STYLE_FILE, done.style_id);
  console.log(`style locked → ${STYLE_FILE}`);
}

async function cast(count = 2, only) {
  await mkdir(REVIEW, { recursive: true });
  const styleId = await readStyleId();
  const jobs = CAST.filter((c) => !only || only.includes(c.name)).flatMap((c) =>
    Array.from({ length: count }, (_, i) => i + 1).map(async (n) => {
      const tag = `${c.name}-${n}`;
      try {
        await stillCutout({ prompt: c.prompt, style: BASE, styleId, colors: COLORS, dest: path.join(REVIEW, `${tag}.png`) });
        console.log(`${tag} ok`);
      } catch (e) {
        console.log(`${tag} failed: ${e.message.slice(0, 160)}`);
      }
    }),
  );
  await Promise.all(jobs);
  console.log("Candidates in public/art/gen/review/. Promote: node scripts/gen-cast.mjs pick <name> <N>");
}

const SICK_EDIT =
  "Keep this exact cow illustration: same pose, same outline style, same flat colours, same white background. Only make the cow look clearly unwell with mastitis: tint its whole body a soft rosy pink, make both ears droop straight down, close the eyes into tired downward arcs, turn the mouth into a small flat frown, add one flat teardrop of sweat next to its head, and make the udder visibly swollen, bigger and bright hot pink. Cute and gentle, not gory. No text, no extra objects.";

/** Edit the picked healthy cow so the sick one is the same drawing, just ill. */
async function sick(count = 3) {
  await mkdir(REVIEW, { recursive: true });
  const flat = path.join(os.tmpdir(), "aura-cow-flat.png");
  await exec("ffmpeg", [
    "-y", "-hide_banner", "-loglevel", "error",
    "-i", path.join(OUT, "cow-grazing.png"),
    "-filter_complex", "color=white:s=1024x1024[bg];[0:v]scale=880:880:force_original_aspect_ratio=decrease[c];[bg][c]overlay=(W-w)/2:(H-h)/2:format=auto,format=rgb24",
    "-frames:v", "1", flat,
  ]);
  const src = await uploadToFal(flat, "image/png");
  await Promise.all(
    Array.from({ length: count }, (_, i) => i + 1).map(async (n) => {
      const tag = `cow-sick-k${n}`;
      try {
        const out = await falRun("fal-ai/flux-pro/kontext", {
          prompt: SICK_EDIT,
          image_url: src,
          guidance_scale: 3 + n * 0.8,
          output_format: "png",
          safety_tolerance: "5",
          seed: 11 * n,
        });
        const url = out.images?.[0]?.url;
        if (!url) throw new Error(`no image: ${JSON.stringify(out).slice(0, 200)}`);
        const cut = await falRun("fal-ai/imageutils/rembg", { image_url: url }, { tries: 60, wait: 2000 });
        const cutUrl = cut.image?.url;
        if (!cutUrl) throw new Error("no cutout");
        const dest = path.join(REVIEW, `${tag}.png`);
        await download(cutUrl, dest);
        await toPng(dest);
        console.log(`${tag} ok`);
      } catch (e) {
        console.log(`${tag} failed: ${e.message.slice(0, 200)}`);
      }
    }),
  );
}

async function pick(name, n) {
  const src = path.join(REVIEW, `${name}-${n}.png`);
  if (!existsSync(src)) throw new Error(`no candidate ${src}`);
  await copyFile(src, path.join(OUT, `${name}.png`));
  console.log(`${name}.png ← candidate ${n}`);
}

const [cmd = "explore", ...rest] = process.argv.slice(2);
try {
  if (cmd === "explore") await explore(Number(rest[0] ?? 4));
  else if (cmd === "lock") await lock(rest);
  else if (cmd === "cast") await cast(Number(rest[0] ?? 2), rest.slice(1).length ? rest.slice(1) : undefined);
  else if (cmd === "sick") await sick(Number(rest[0] ?? 3));
  else if (cmd === "pick") await pick(rest[0], rest[1] ?? "1");
  else throw new Error(`unknown command ${cmd}`);
} finally {
  await cleanup();
}
