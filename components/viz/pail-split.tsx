"use client";

import { motion, useTransform, type MotionValue } from "motion/react";
import { LINE, SHINE, SOFT_ID } from "@/components/viz/sketch";
import { DoodadFrame, Tape } from "@/components/viz/doodads";
import { cn } from "@/lib/utils";

/**
 * PailSplit - where a euro lost to mastitis goes, drawn as a milk pail that
 * fills from the bottom as you scroll. The costs nobody invoices (culling,
 * discarded milk, lost yield) are the milk; the treatment bill is the thin
 * pink skin on top. Same ink-and-flat-fill hand as the hero pail.
 */

const INK = LINE;

type Layer = { key: string; label: string; note: string; share: number; fill: string };

/* bottom → top */
const LAYERS: Layer[] = [
  { key: "cull", label: "Early culling", note: "cows that leave the herd", share: 0.18, fill: "#cdbca3" },
  { key: "discard", label: "Discarded milk", note: "withheld during treatment", share: 0.22, fill: "#e0d3bd" },
  { key: "yield", label: "Lost yield", note: "milk the cow stops giving", share: 0.45, fill: "#f1e8d6" },
  { key: "treat", label: "Treatment", note: "the invoice you see", share: 0.15, fill: "var(--color-pink-soft)" },
];

/* pail geometry in a 0 0 460 320 box; interior runs from the rim to the base */
const TOP = 86;
const BOTTOM = 292;
const H = BOTTOM - TOP;
const BODY = "M 60 86 L 84 284 Q 85 296 98 296 L 178 296 Q 191 296 192 284 L 216 86 Z";

/* x of the pail's right wall at a given y (for leader lines) */
function wallX(y: number) {
  return 216 - ((y - TOP) / (296 - TOP)) * 24;
}

function LayerRect({ layer, offset, progress }: { layer: Layer; offset: number; progress: MotionValue<number> }) {
  const height = layer.share * H;
  const yBottom = BOTTOM - offset * H;
  /* the fill level rises through this layer's band of the scroll */
  const start = offset;
  const end = offset + layer.share;
  const h = useTransform(progress, [start, end], [0, height], { clamp: true });
  const y = useTransform(h, (v) => yBottom - v);
  return <motion.rect x={40} width={200} style={{ y, height: h }} fill={layer.fill} />;
}

function LayerLabel({ layer, offset, progress, index }: { layer: Layer; offset: number; progress: MotionValue<number>; index: number }) {
  const mid = BOTTOM - (offset + layer.share / 2) * H;
  const show = useTransform(progress, [offset + layer.share * 0.6, offset + layer.share], [0, 1], { clamp: true });
  const x = useTransform(show, [0, 1], [-10, 0]);
  const x1 = wallX(mid);
  const pct = Math.round(layer.share * 100);
  return (
    <motion.g style={{ opacity: show, x }}>
      <path d={`M ${x1} ${mid} L 256 ${mid}`} stroke={INK} strokeOpacity="0.4" strokeWidth="1.4" strokeDasharray="3 4" strokeLinecap="round" />
      <circle cx={x1} cy={mid} r="3.2" fill={layer.fill} stroke={INK} strokeWidth="1.4" />
      <text x={266} y={mid - 4} className="font-display" fontSize="16" fill="var(--color-ink)">
        {layer.label}
        <tspan dx="8" fontSize="13" fill={index === LAYERS.length - 1 ? "var(--color-pink-deep)" : "var(--color-ink)"} fillOpacity={index === LAYERS.length - 1 ? 1 : 0.55}>
          {pct}%
        </tspan>
      </text>
      <text x={266} y={mid + 13} fontSize="12" fill="var(--color-ink)" fillOpacity="0.55">
        {layer.note}
      </text>
    </motion.g>
  );
}

export function PailSplit({ progress, className }: { progress: MotionValue<number>; className?: string }) {
  /* the pail fills over the middle of the beat */
  const fill = useTransform(progress, [0.14, 0.78], [0, 1], { clamp: true });
  const offsets = LAYERS.map((_, i) => LAYERS.slice(0, i).reduce((s, l) => s + l.share, 0));

  return (
    <DoodadFrame className={cn("pt-3", className)}>
      <Tape className="doodad-tape--pail" />
    <svg
      viewBox="0 0 460 336"
      className="block h-auto w-full overflow-visible"
      role="img"
      aria-label="Of every euro lost to mastitis, roughly 15% is treatment; the rest is lost yield (45%), discarded milk (22%) and early culling (18%). Illustrative split."
    >
      <defs>
        <clipPath id="pail-split-interior">
          <path d={BODY} />
        </clipPath>
      </defs>

      <g filter={`url(#${SOFT_ID})`} strokeLinejoin="round" strokeLinecap="round">
        {/* bail */}
        <path d="M 62 82 C 58 12, 218 12, 214 82" fill="none" stroke={INK} strokeWidth="2.6" />
        <rect x="126" y="10" width="24" height="9" rx="3" fill="var(--color-cream)" stroke={INK} strokeWidth="2" />
        <circle cx="62" cy="83" r="4" fill="var(--color-cream)" stroke={INK} strokeWidth="1.8" />
        <circle cx="214" cy="83" r="4" fill="var(--color-cream)" stroke={INK} strokeWidth="1.8" />

        {/* empty pail: milk-white tin with two bands; the liquid paints over it like a cutaway */}
        <path d={BODY} fill="var(--color-milk)" />
        <path d="M 60 86 C 80 70, 196 70, 216 86 Z" fill="#e4dccc" />
        <path d="M 60 86 L 63 110 L 213 110 L 216 86 Z" fill="#d8d1c3" />
        <path d="M 86 264 L 84 284 Q 85 296 98 296 L 178 296 Q 191 296 192 284 L 190 264 Z" fill="#d8d1c3" />

        {/* filling layers */}
        <g clipPath="url(#pail-split-interior)">
          {LAYERS.map((l, i) => (
            <LayerRect key={l.key} layer={l} offset={offsets[i]} progress={fill} />
          ))}
          {/* faint pencil lines where layers meet */}
          {offsets.slice(1).map((o, i) => {
            const y = BOTTOM - o * H;
            return <path key={i} d={`M 40 ${y} L 240 ${y}`} stroke={INK} strokeOpacity="0.16" strokeWidth="1.2" strokeDasharray="2 5" />;
          })}
        </g>

        {/* body outline + bands */}
        <path d={BODY} fill="none" stroke={INK} strokeWidth="2.8" />
        <path d="M 63 110 L 213 110" stroke={INK} strokeWidth="2" />
        <path d="M 86 264 L 190 264" stroke={INK} strokeWidth="2" />
        {/* shine */}
        <path d="M 90 120 C 88 160, 90 210, 96 254 C 101 256, 104 254, 102 252 C 97 210, 96 160, 97 120 Z" fill={SHINE} fillOpacity="0.7" />
        <path d="M 60 86 C 80 70, 196 70, 216 86" fill="none" stroke={INK} strokeWidth="2.6" />
        {/* ground shadow */}
        <path d="M 78 302 C 100 310, 176 310, 200 302" fill="none" stroke={INK} strokeOpacity="0.18" strokeWidth="3" />
      </g>

      {LAYERS.map((l, i) => (
        <LayerLabel key={l.key} layer={l} offset={offsets[i]} progress={fill} index={i} />
      ))}

      <text x={40} y={326} fontSize="10.5" fill="var(--color-ink)" fillOpacity="0.45" letterSpacing="2.2" className="uppercase">
        of every euro lost · illustrative split
      </text>
    </svg>
    </DoodadFrame>
  );
}
