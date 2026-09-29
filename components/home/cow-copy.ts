import { BLOB, type BlobShape } from "@/components/viz/sketch";

export type CowLandmark = "head" | "milk" | "fet" | "herd";

export type CowCall = {
  id: CowLandmark;
  blob: BlobShape;
  rotate: number;
  title: string;
  body: string;
  /** Scroll windows: fade in start, full, hold until, fade out. */
  show: readonly [number, number, number, number];
};

/**
 * Splotches that ride the cow. Copy is derived from
 * `assets/keep/project-description.md` - silent disease, miR-223 in the milk,
 * inline FET + DNA catapult, then a cow-level flag to the farmer.
 */
export const COW_CALLS: readonly CowCall[] = [
  {
    id: "head",
    blob: "a",
    rotate: -6,
    title: "She still looks well.",
    body: "Subclinical mastitis hides in milk that looks like cream. No swelling yet - the cow can walk into the parlour as if nothing were wrong.",
    show: [0.05, 0.12, 0.28, 0.38],
  },
  {
    id: "milk",
    blob: "b",
    rotate: 5,
    title: "A molecule in the pail.",
    body: "bta-miR-223 rises to keep bacterial inflammation in check. Finding it in milk flags the infection before the udder shows it - and points at a bacterial cause, not just “something’s off.”",
    show: [0.22, 0.32, 0.46, 0.56],
  },
  {
    id: "fet",
    blob: "d",
    rotate: -3,
    title: "An inline FET.",
    body: "Each milking, a siphoned stream washes a DNA catapult on a field-effect transistor. When miR-223 binds, the catapult opens and current between source and drain ticks. Reference electrodes taste the milk first so salty samples don’t raise a false flag.",
    show: [0.42, 0.52, 0.7, 0.8],
  },
  {
    id: "herd",
    blob: "c",
    rotate: 7,
    title: "A note, not a verdict.",
    body: "A small on-farm model compares that current to the sample’s own baseline. If the score stays high across milkings, the parlour computer flags this cow - look closer, treat on purpose, skip blanket antibiotics.",
    show: [0.62, 0.74, 0.96, 1],
  },
];

export const CALL_BY_ID = Object.fromEntries(COW_CALLS.map((c) => [c.id, c])) as Record<
  CowLandmark,
  CowCall
>;

export function splotchMarkup(call: CowCall) {
  const d = BLOB[call.blob];
  return `<div class="cow-splotch" data-id="${call.id}" style="--tilt:${call.rotate}deg">
  <span class="cow-splotch-pin" aria-hidden="true"></span>
  <div class="cow-splotch-hang">
    <svg class="cow-splotch-fill" viewBox="0 0 100 100" aria-hidden="true">
      <path d="${d}" />
    </svg>
    <div class="cow-splotch-copy">
      <p class="cow-splotch-title">${escapeHtml(call.title)}</p>
      <p class="cow-splotch-body">${escapeHtml(call.body)}</p>
    </div>
  </div>
</div>`;
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
