/**
 * One banner picture per wiki page, drawn by the same hand as the keepers in
 * public/art/images. Nano Banana 2.1 edit gets the keepers as style references,
 * so the cow, the cocoa line and the flat fills carry over. The cutout is a
 * flood fill of the white page from the corners, not rembg: rembg turns the white
 * lab coat half-transparent, and the closed cocoa outline already fences it in.
 *
 *   node scripts/gen-heroes.mjs [n] [name ...]   # n candidates each → public/art/gen/review/<name>-N.png
 *   node scripts/gen-heroes.mjs pick <name> <N>  # promote → public/art/images/<name>.png
 *
 * Names are `hero-<page>` (or just `<page>`) and `prop-<thing>`.
 * Every page shows the lab-coat cow doing that page's own job. No two pages share a pose.
 * Props are single objects in the same hand, with no cow.
 */
import { mkdir, copyFile } from "node:fs/promises";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import path from "node:path";
import { ROOT, REVIEW, falRun, uploadToFal, download, cleanup } from "./fal.mjs";

const exec = promisify(execFile);

const IMAGES = path.join(ROOT, "public", "art", "images");

const STYLE =
  "Draw it in exactly the same hand as the reference images: the same cow character (white hide, dark-brown patches, pale pink muzzle, rosy cheeks, small dark-brown horns), the same thick even dark-brown marker outline, the same flat fills with no gradients and no shading. Make the colours a little bolder than the references: accents in dusty rose pink (#e45b88), butter yellow (#f7c65a) and soft teal (#5aaeb8); the lab coat stays white. One single figure with its props, centred, nothing else, every shape closed by the outline. Plain solid pure white background. No glow, no sparkles, no motion lines, no smoke, no ground shadow, no frame, no border, no text, no letters, no numbers, no watermark, no people.";

const PAGES = {
  description: "The lab-coat cow from image 1 proudly holds up, in both hooves, the inline milk sampling chamber from image 3 (clear tube with milk, little grey box), with a small pink light glowing on the box.",
  background: "The sick cow from image 2 sits down on a small butter-yellow straw bale, ears drooping, a rosy pink flushed udder, a pink hot-water bottle balanced on its head.",
  engineering: "The lab-coat cow from image 1 tightens a big teal wrench on a large DNA hairpin model shaped like a springy loop, the loop striped pink and teal.",
  results: "The lab-coat cow from image 1 cheers with one hoof up, holding a clipboard that shows a simple rising pink line chart with dots (no numbers, no words).",
  contribution: "The lab-coat cow from image 1 holds out an open butter-yellow gift box spilling short colourful DNA double-helix pieces in pink and teal.",
  experiments: "The lab-coat cow from image 1 wears safety goggles pushed up on its forehead and pipettes hot-pink liquid into a row of small tubes standing in a teal rack.",
  protocols: "The lab-coat cow from image 1 reads a long unrolled paper checklist scroll covered in tick boxes and plain lines (no words), a pencil tucked behind one ear.",
  parts: "The lab-coat cow from image 1 juggles three short DNA double-helix pieces, one pink, one butter yellow, one teal.",
  measurement: "The lab-coat cow from image 1 squints through a big magnifying glass at a single small sample tube glowing hot pink.",
  notebook: "The cow from image 4 sits cross-legged writing in an open lab notebook with a pencil, the pages covered in scribbled lines and a tiny doodled cow (no readable words).",
  model: "The lab-coat cow from image 1 stands beside a small butter-yellow easel holding a framed chart of an S-shaped teal curve with pink dots on it, and points at the curve with one hoof (no numbers, no words).",
  hardware: "The lab-coat cow from image 1 uses a screwdriver to fix the small grey sensor box from image 3 onto a curved clear milk hose.",
  software: "The lab-coat cow from image 1 holds up a big smartphone like the device in image 5, its screen showing one pink bell alert.",
  "human-practices": "The lab-coat cow from image 1 wears a butter-yellow straw farmer's hat over its lab coat, carrying a metal milk churn in one hoof and waving with the other.",
  "integrated-human-practices": "The lab-coat cow from image 1 holds a big round looping arrow, half pink and half teal, that circles back on itself.",
  education: "The lab-coat cow from image 1 stands beside a small easel chalkboard, chalk in hoof; the board shows a simple chalk doodle of a cow and a milk drop (no words).",
  sustainability: "The healthy cow from image 4 stands on a small tuft of grass and gently sniffs a single butter-yellow flower.",
  safety: "The lab-coat cow from image 1 wears clear safety goggles and teal gloves, carefully carrying a closed sample tube in a small tray.",
  team: "Three of the cow from image 1 stand together shoulder to shoulder, all in lab coats, each waving; one wears a pink scarf, one butter-yellow glasses, one a teal beanie.",
  attributions: "The lab-coat cow from image 1 hugs a big puffy pink heart with both hooves, eyes closed, smiling.",
  references: "The cow from image 4 sits on a tall stack of books, wearing small round glasses, reading one open book.",
  entrepreneurship: "The lab-coat cow from image 1 carries a small teal briefcase in one hoof and holds up a product box with the grey sensor box from image 3 printed on it in the other.",
};

/** White page → transparent, from the four corners, then trim and cap at 768px. */
async function cutWhite(src, dest) {
  const corners = ["0,0", "%[fx:w-1],0", "0,%[fx:h-1]", "%[fx:w-1],%[fx:h-1]"];
  await exec("magick", [
    src, "-alpha", "off", "-bordercolor", "white", "-border", "6", "-fuzz", "12%", "-fill", "none",
    ...corners.flatMap((c) => ["-draw", `color ${c} floodfill`]),
    "-shave", "6x6", "-trim", "+repage", "-resize", "768x768>", dest,
  ]);
}

/* Single objects for homepage beats. Same line and fills as the cast; no cow, no face on the object. */
const PROP_STYLE =
  "Draw only this one object, in exactly the same hand as the reference images: the same thick even dark-brown marker outline, the same flat fills with no gradients and no shading. Colours: butter yellow (#f7c65a), dusty rose pink (#e45b88), soft pink (#f09bb4), milk cream (#f6eee0), dark brown line. Absolutely no green. No cow, no character, no face or eyes on the object. Centred, every shape closed by the outline. Plain solid pure white background. No glow, no sparkles, no motion lines, no ground shadow, no frame, no text except the symbols named, no watermark.";

const PROPS = {
  note: "One single banknote, gently curved as if flapping in the wind, milk-cream paper with a dusty rose pink border band and a big pink euro sign (€) in a round medallion in the middle.",
  coin: "One single thick round coin seen at a slight tilt so its edge shows, butter yellow with a darker butter rim and a big embossed euro sign (€) on its face.",
  stack: "One short leaning stack of four thick butter-yellow coins, the top coin showing an embossed euro sign (€).",
  bottle: "One single glass milk bottle only half full of milk, milk-cream milk, a dusty rose pink cap, a small pink drip running down the outside.",
  vetbag: "One single classic doctor's bag for a vet, dusty rose pink leather with a butter-yellow clasp and a milk-cream cross patch on the front.",
  receipt: "One long paper receipt curling at the bottom, milk-cream paper with rows of short plain lines (no words) and a big round dusty-rose pink stamp near the bottom with a euro sign (€) in it.",
};

const REFS = ["cow-scientist.png", "cow-sick.png", "milk-inline-sensor.png", "cow-healthy.png", "phone-alert.png", "bill.png"];

async function generate(count, only) {
  await mkdir(REVIEW, { recursive: true });
  const refUrls = [];
  for (const f of REFS) refUrls.push(await uploadToFal(path.join(IMAGES, f), "image/png"));
  const jobs = [
    ...Object.entries(PAGES).map(([k, scene]) => [`hero-${k}`, `${scene} ${STYLE}`]),
    ...Object.entries(PROPS).map(([k, thing]) => [`prop-${k}`, `${thing} ${PROP_STYLE}`]),
  ].filter(([name]) => (only.length ? only.some((o) => name === o || name === `hero-${o}`) : name.startsWith("hero-")));
  await Promise.all(
    jobs.map(async ([page, prompt]) => {
      try {
        const out = await falRun(
          "google/nano-banana-2.1/edit",
          { prompt, image_urls: refUrls, num_images: count, aspect_ratio: "1:1", output_format: "png" },
          { tries: 200, wait: 3000 },
        );
        const images = out.images ?? [];
        if (!images.length) throw new Error(JSON.stringify(out).slice(0, 200));
        await Promise.all(
          images.map(async (img, i) => {
            const raw = path.join(REVIEW, `raw-${page}-${i + 1}.png`);
            await download(img.url, raw);
            await cutWhite(raw, path.join(REVIEW, `${page}-${i + 1}.png`));
          }),
        );
        console.log(`${page} ok (${images.length})`);
      } catch (e) {
        console.log(`${page} failed: ${e.message.slice(0, 200)}`);
      }
    }),
  );
}

const [cmd, ...rest] = process.argv.slice(2);
if (cmd === "pick") {
  const [raw, n] = rest;
  const name = /^(hero|prop)-/.test(raw) ? raw : `hero-${raw}`;
  const dest = path.join(IMAGES, `${name}.png`);
  await copyFile(path.join(REVIEW, `${name}-${n}.png`), dest);
  console.log(`→ ${dest}`);
} else {
  const count = Number(cmd) || 2;
  await generate(count, Number(cmd) ? rest : [cmd, ...rest].filter(Boolean));
}
await cleanup();
