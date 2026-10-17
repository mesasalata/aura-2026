/**
 * Splits the fixed nav band into the part over dark page and the part over light page.
 *
 * Dark surfaces are `.section-dark` or `data-nav-tone="dark"`. `data-nav-tone="light"`
 * paints light back over them. Later elements in document order paint over earlier ones,
 * and anything unmarked is light. A marked element covers its box. A marked SVG `<path>`
 * covers the area under its top edge, down to the bottom of its `<svg>`, so wave seams and
 * the pour's meniscus cut the nav along the drawn curve. That `<svg>` must use
 * `preserveAspectRatio="none"`.
 */

const SELECTOR = ".section-dark, [data-nav-tone]";
/** Samples across the bar. Seam crests are ~500px apart, so ~30px steps follow the curve. */
const COLUMNS = 48;
/** Resolution of a path's top edge across its viewBox. */
const BUCKETS = 240;
/** Spans thinner than this are dropped, and ends this close to the band edge snap to it. */
const EPS = 0.25;

type Span = [number, number];
type Layer = {
  dark: boolean;
  left: number;
  right: number;
  bottom: number;
  top: (x: number) => number;
};

const edges = new WeakMap<SVGPathElement, { d: string; top: Float64Array }>();

/** Highest filled point of the path in each bucket, in viewBox units. */
function topEdge(path: SVGPathElement, vb: DOMRect) {
  const d = path.getAttribute("d") ?? "";
  const cached = edges.get(path);
  if (cached?.d === d) return cached.top;

  const top = new Float64Array(BUCKETS + 1).fill(Number.POSITIVE_INFINITY);
  const length = path.getTotalLength();
  const steps = Math.max(BUCKETS * 4, Math.ceil(length / 2));
  for (let i = 0; i <= steps; i++) {
    const p = path.getPointAtLength((length * i) / steps);
    const b = Math.round(((p.x - vb.x) / vb.width) * BUCKETS);
    if (b >= 0 && b <= BUCKETS && p.y < top[b]) top[b] = p.y;
  }

  let last = -1;
  for (let b = 0; b <= BUCKETS; b++) {
    if (!Number.isFinite(top[b])) continue;
    for (let k = last + 1; k < b; k++) {
      top[k] = last < 0 ? top[b] : top[last] + ((top[b] - top[last]) * (k - last)) / (b - last);
    }
    last = b;
  }
  for (let k = last + 1; k <= BUCKETS; k++) top[k] = last < 0 ? vb.y : top[last];

  edges.set(path, { d, top });
  return top;
}

function layersOver(band: number) {
  const layers: Layer[] = [];
  for (const el of document.querySelectorAll(SELECTOR)) {
    const dark = el.getAttribute("data-nav-tone") !== "light";
    const svg = el instanceof SVGPathElement ? el.ownerSVGElement : null;
    const box = (svg ?? el).getBoundingClientRect();
    if (box.bottom <= 0 || box.top >= band || box.width === 0) continue;
    const layer = { dark, left: box.left, right: box.right, bottom: box.bottom, top: () => box.top };

    const vb = svg?.viewBox.baseVal;
    if (svg && vb && vb.width > 0 && vb.height > 0) {
      let edge: Float64Array;
      try {
        edge = topEdge(el as SVGPathElement, vb);
      } catch {
        layers.push(layer);
        continue;
      }
      const { y: vy, height: vh } = vb;
      layers.push({
        ...layer,
        top: (x) => {
          const at = Math.min(Math.max((x - box.left) / box.width, 0), 1) * BUCKETS;
          const i = Math.min(Math.floor(at), BUCKETS - 1);
          const y = edge[i] + (edge[i + 1] - edge[i]) * (at - i);
          return box.top + ((y - vy) / vh) * box.height;
        },
      });
    } else {
      layers.push(layer);
    }
  }
  return layers;
}

/** Paint `[a, b]` dark or light over the dark spans of one column. */
function paint(spans: Span[], a: number, b: number, dark: boolean) {
  const out: Span[] = [];
  for (const [s, e] of spans) {
    if (e <= a || s >= b) {
      out.push([s, e]);
      continue;
    }
    if (s < a) out.push([s, a]);
    if (e > b) out.push([b, e]);
  }
  if (!dark) return out;
  out.push([a, b]);
  out.sort((p, q) => p[0] - q[0]);
  const merged: Span[] = [];
  for (const span of out) {
    const prev = merged[merged.length - 1];
    if (prev && span[0] <= prev[1] + EPS) prev[1] = Math.max(prev[1], span[1]);
    else merged.push([span[0], span[1]]);
  }
  return merged;
}

const HIDDEN = "inset(50%)";
const SHOWN = "none";

/**
 * `clip-path` values for the bar: `dark` keeps the part over dark page, `light` the rest.
 * `split` is true while a page edge crosses the bar.
 * Coordinates are the viewport's, so apply them to layers pinned at the top-left corner.
 */
export function navToneClips(width: number, band: number) {
  const layers = layersOver(band);
  const xAt = (i: number) => (i === 0 ? -1 : i === COLUMNS - 1 ? width + 1 : (width * i) / (COLUMNS - 1));

  const columns: Span[][] = [];
  for (let i = 0; i < COLUMNS; i++) {
    const x = (width * i) / (COLUMNS - 1);
    let spans: Span[] = [];
    for (const layer of layers) {
      if (x < layer.left - 0.5 || x > layer.right + 0.5) continue;
      const a = Math.max(0, layer.top(x));
      const b = Math.min(band, layer.bottom);
      if (b - a > EPS) spans = paint(spans, a, b, layer.dark);
    }
    columns.push(spans.filter(([s, e]) => e - s > EPS));
  }

  if (columns.every((c) => c.length === 0)) return { dark: HIDDEN, light: SHOWN, split: false };
  if (columns.every((c) => c.length === 1 && c[0][0] <= EPS && c[0][1] >= band - EPS)) {
    return { dark: SHOWN, light: HIDDEN, split: false };
  }

  const yAt = (y: number) => (y <= EPS ? -1 : y >= band - EPS ? band + 1 : y).toFixed(1);
  const shapes: string[] = [];
  const depth = Math.max(...columns.map((c) => c.length));
  for (let k = 0; k < depth; k++) {
    let run: number[] = [];
    const flush = () => {
      if (run.length > 1) {
        const upper = run.map((i) => `${xAt(i).toFixed(1)} ${yAt(columns[i][k][0])}`);
        const lower = run.map((i) => `${xAt(i).toFixed(1)} ${yAt(columns[i][k][1])}`).reverse();
        shapes.push(`M${upper.join("L")}L${lower.join("L")}Z`);
      }
      run = [];
    };
    for (let i = 0; i < COLUMNS; i++) {
      if (columns[i][k]) run.push(i);
      else flush();
    }
    flush();
  }

  const d = shapes.join("");
  return {
    dark: `path("${d}")`,
    light: `path(evenodd, "M-1 -1H${width + 1}V${band + 1}H-1Z${d}")`,
    split: true,
  };
}
