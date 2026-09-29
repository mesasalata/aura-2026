"use client";

import { motion } from "motion/react";
import { Art } from "@/components/viz/art";
import { DropMark, FlaskMark } from "@/components/viz/marks";
import { Blob, LINE, SOFT_ID } from "@/components/viz/sketch";
import { DoodadFrame, Staple } from "@/components/viz/doodads";

const INK = LINE;

function DataGlyph() {
  return (
    <svg viewBox="0 0 60 60" className="h-9 w-9 overflow-visible" aria-hidden>
      <g filter={`url(#${SOFT_ID})`} strokeLinecap="round" strokeLinejoin="round" fill="none">
        <path d="M10 48 L10 12 M10 48 L50 48" stroke={INK} strokeOpacity="0.4" strokeWidth="1.8" />
        <path d="M14 40 C 20 38, 24 30, 30 30 C 36 30, 40 20, 48 16" stroke="var(--color-pink)" strokeWidth="3" />
        <circle cx="48" cy="16" r="3.2" fill="var(--color-milk)" stroke={INK} strokeWidth="1.8" />
      </g>
    </svg>
  );
}

type PipelineStep = { label: string; sub: string; accent: string; glyph: React.ReactNode };

const STEPS: PipelineStep[] = [
  { label: "Cow", sub: "Welfare first", accent: "var(--color-pink)", glyph: <Art id="cow" size={44} motion="none" /> },
  { label: "Siphon", sub: "Each milking", accent: "var(--color-orange)", glyph: <DropMark className="h-9 w-auto" /> },
  { label: "Catapult", sub: "miR-223 opens it", accent: "var(--color-signal)", glyph: <FlaskMark className="h-10 w-auto" liquid="pink" /> },
  { label: "FET", sub: "Current ticks", accent: "var(--color-butter)", glyph: <Art id="biofet" size={52} motion="none" /> },
  { label: "Score", sub: "This cow, this milking", accent: "var(--color-pink)", glyph: <DataGlyph /> },
  { label: "Flag", sub: "Look closer", accent: "var(--color-bio)", glyph: <Art id="phoneAlert" size={48} motion="none" /> },
];

/** FarmToLabPipeline - cow → milk → biosensor → readout → data → decision, drawn. */
export function FarmToLabPipeline() {
  return (
    <DoodadFrame>
      <Staple className="doodad-staple--strip" />
    <div className="flex flex-wrap items-start justify-center gap-x-2 gap-y-6 sm:gap-x-1">
      {STEPS.map((s, i) => (
        <motion.div
          key={s.label}
          className="flex items-start gap-1 sm:gap-2"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.4, delay: i * 0.06 }}
        >
          <div className="flex w-[4.5rem] flex-col items-center gap-1.5 text-center sm:w-20">
            <div className="relative grid h-14 w-14 place-items-center sm:h-16 sm:w-16">
              <Blob shape={(["a", "b", "c", "d"] as const)[i % 4]} fill={s.accent} className="absolute inset-0 h-full w-full opacity-25" />
              <div className="relative">{s.glyph}</div>
            </div>
            <div>
              <p className="text-xs font-semibold text-ink sm:text-sm">{s.label}</p>
              <p className="text-[0.65rem] leading-snug text-ink-55 sm:text-xs">{s.sub}</p>
            </div>
          </div>
          {i < STEPS.length - 1 && (
            <svg viewBox="0 0 24 12" className="mt-6 hidden h-3 w-6 text-ink-40 sm:block" aria-hidden>
              <path d="M2 6 C 8 5, 14 7, 21 6 M17 2 L22 6 L17 10" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </motion.div>
      ))}
    </div>
    </DoodadFrame>
  );
}
