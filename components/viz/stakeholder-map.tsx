"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { STAKEHOLDERS } from "@/lib/content";
import { ACCENT_HEX } from "@/components/ui/badge";
import { DropMark, FlaskMark } from "@/components/viz/marks";
import { Blob, LINE, SHINE, SOFT_ID, type BlobShape } from "@/components/viz/sketch";
import { HandCaption } from "@/components/viz/doodads";
import { cn } from "@/lib/utils";

const INK = LINE;
const SOFT = `url(#${SOFT_ID})`;
const TAN = "#d8bb8e";

/* ------------------------------------------------------------ glyphs */
/* Small drawn props for the people around the table, in the marks style:
   cocoa outline, flat fills, one white shine, the light wobble. */

function CowHeadGlyph() {
  return (
    <svg viewBox="0 0 60 60" className="h-10 w-10 overflow-visible" aria-hidden>
      <g filter={SOFT} strokeLinecap="round" strokeLinejoin="round">
        {/* horns */}
        <path d="M21 13 C 17 9, 12 10, 12 15 C 14 13, 18 13, 21 14 Z" fill="var(--color-cream)" stroke={INK} strokeWidth="1.8" />
        <path d="M39 13 C 43 9, 48 10, 48 15 C 46 13, 42 13, 39 14 Z" fill="var(--color-cream)" stroke={INK} strokeWidth="1.8" />
        {/* ears, out to the sides */}
        <path d="M17 20 C 11 17, 5 19, 6 23 C 8 26, 14 25, 18 23 Z" fill={TAN} stroke={INK} strokeWidth="2" />
        <path d="M43 20 C 49 17, 55 19, 54 23 C 52 26, 46 25, 42 23 Z" fill={TAN} stroke={INK} strokeWidth="2" />
        {/* face: broad forehead, long to the muzzle */}
        <path d="M17 16 C 19 9, 41 9, 43 16 C 45 24, 44 34, 42 42 C 40.5 50, 19.5 50, 18 42 C 16 34, 15 24, 17 16 Z" fill="var(--color-milk)" stroke={INK} strokeWidth="2.2" />
        {/* hide patch on the forehead */}
        <path d="M30 12 C 36 10, 42 14, 42 21 C 42 27, 35 29, 31 25 C 28 22, 26 14, 30 12 Z" fill={TAN} />
        {/* muzzle */}
        <path d="M21 40 C 21 34, 39 34, 39 40 C 39 47, 21 47, 21 40 Z" fill="var(--color-pink-soft)" stroke={INK} strokeWidth="2" />
        <ellipse cx="26" cy="41" rx="1.7" ry="1.2" fill={INK} />
        <ellipse cx="34" cy="41" rx="1.7" ry="1.2" fill={INK} />
        {/* eyes */}
        <circle cx="23.5" cy="27" r="1.7" fill={INK} />
        <circle cx="36.5" cy="27" r="1.7" fill={INK} />
        <ellipse cx="23" cy="16" rx="2.6" ry="1.4" fill={SHINE} transform="rotate(-20 23 16)" />
      </g>
    </svg>
  );
}

function StethoscopeGlyph() {
  return (
    <svg viewBox="0 0 60 60" className="h-10 w-10 overflow-visible" aria-hidden>
      <g filter={SOFT} strokeLinecap="round" strokeLinejoin="round" fill="none">
        <path d="M18 9 C 14 22, 18 32, 27 34 C 34 32, 38 22, 34 9" stroke={INK} strokeWidth="2.4" />
        <path d="M27 34 C 27 44, 34 47, 41 44" stroke={INK} strokeWidth="2.4" />
        <rect x="14.5" y="6" width="7" height="5" rx="2" fill="var(--color-cream)" stroke={INK} strokeWidth="1.8" />
        <rect x="30.5" y="6" width="7" height="5" rx="2" fill="var(--color-cream)" stroke={INK} strokeWidth="1.8" />
        <circle cx="45" cy="42" r="7" fill="var(--color-signal)" stroke={INK} strokeWidth="2.2" />
        <circle cx="45" cy="42" r="3" fill="var(--color-milk)" stroke={INK} strokeOpacity="0.35" strokeWidth="1.2" />
        <ellipse cx="42" cy="38" rx="2.2" ry="1.2" fill={SHINE} transform="rotate(-40 42 38)" />
      </g>
    </svg>
  );
}

function ChurnGlyph() {
  return (
    <svg viewBox="0 0 60 60" className="h-10 w-10 overflow-visible" aria-hidden>
      <g filter={SOFT} strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 22 L 17 48 Q 17 53 22 53 L 38 53 Q 43 53 43 48 L 42 22 Z" fill="var(--color-milk)" stroke={INK} strokeWidth="2.2" />
        <path d="M18 22 L 18.4 31 L 41.6 31 L 42 22 Z" fill="var(--color-bio)" fillOpacity="0.55" stroke={INK} strokeWidth="1.8" />
        <path d="M17.4 42 L 42.6 42" stroke={INK} strokeOpacity="0.35" strokeWidth="1.4" />
        {/* shoulder + lid */}
        <path d="M18 22 C 18 16, 42 16, 42 22 Z" fill="var(--color-cream)" stroke={INK} strokeWidth="2.2" />
        <path d="M24 17 C 24 10, 36 10, 36 17" fill="var(--color-milk)" stroke={INK} strokeWidth="2.2" />
        <rect x="27" y="6" width="6" height="4" rx="1.5" fill="var(--color-cream)" stroke={INK} strokeWidth="1.8" />
        <path d="M22 34 C 21.5 40, 22 45, 23 49 C 24.5 49.6, 25.4 48.8, 24.6 48 C 23.8 44, 23.7 39, 24.4 34 Z" fill={SHINE} />
      </g>
    </svg>
  );
}

function StampGlyph() {
  return (
    <svg viewBox="0 0 60 60" className="h-10 w-10 overflow-visible" aria-hidden>
      <g filter={SOFT} strokeLinecap="round" strokeLinejoin="round">
        <rect x="24" y="8" width="12" height="10" rx="4" fill="var(--color-cream)" stroke={INK} strokeWidth="2.2" />
        <path d="M27 18 L 27 26 L 33 26 L 33 18" fill="var(--color-milk)" stroke={INK} strokeWidth="2" />
        <path d="M13 34 C 13 28, 47 28, 47 34 L 47 40 Q 47 42 45 42 L 15 42 Q 13 42 13 40 Z" fill="var(--color-coral)" fillOpacity="0.8" stroke={INK} strokeWidth="2.2" />
        <path d="M17 30.5 C 22 27.5, 30 27, 36 28" fill="none" stroke={SHINE} strokeWidth="2.4" />
        {/* the impression */}
        <path d="M20 50 C 26 48.4, 34 48.4, 40 50" fill="none" stroke="var(--color-coral-deep)" strokeWidth="2.6" />
        <path d="M24 54 L 36 54" fill="none" stroke="var(--color-coral-deep)" strokeOpacity="0.55" strokeWidth="2" />
      </g>
    </svg>
  );
}

function GlassGlyph() {
  return (
    <svg viewBox="0 0 60 60" className="h-10 w-10 overflow-visible" aria-hidden>
      <g filter={SOFT} strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 9 L 23 50 Q 23.5 54 27.5 54 L 32.5 54 Q 36.5 54 37 50 L 41 9 Z" fill="var(--color-cream)" fillOpacity="0.5" />
        <path d="M20.3 22 L 23 50 Q 23.5 54 27.5 54 L 32.5 54 Q 36.5 54 37 50 L 39.7 22 Z" fill="var(--color-milk)" />
        <path d="M20.3 22 C 26 20, 34 24, 39.7 22" fill="none" stroke={INK} strokeOpacity="0.3" strokeWidth="1.4" />
        <path d="M19 9 L 23 50 Q 23.5 54 27.5 54 L 32.5 54 Q 36.5 54 37 50 L 41 9 Z" fill="none" stroke={INK} strokeWidth="2.2" />
        <path d="M18 9 L 42 9" stroke={INK} strokeWidth="2.2" />
        <path d="M24 26 C 24.6 34, 25.4 42, 26.6 48" fill="none" stroke={SHINE} strokeWidth="3" />
      </g>
    </svg>
  );
}

const GLYPHS: Record<string, React.ReactNode> = {
  farmer: <CowHeadGlyph />,
  vet: <StethoscopeGlyph />,
  processor: <ChurnGlyph />,
  regulator: <StampGlyph />,
  consumer: <GlassGlyph />,
  team: <FlaskMark className="h-10 w-auto" liquid="pink" />,
};

const WASH: BlobShape[] = ["a", "b", "c", "d", "b", "a"];

/* ------------------------------------------------------------ geometry */

const N = STAKEHOLDERS.length;
const R = 38; // % of the stage
/** Polar position of node i, as a percentage of the stage box. */
function at(i: number) {
  const angle = (i / N) * Math.PI * 2 - Math.PI / 2;
  return { x: 50 + Math.cos(angle) * R, y: 50 + Math.sin(angle) * R, angle };
}

/**
 * Pen lines from the drop to each stakeholder. Each is a lazy quadratic with
 * a small sideways bow so no two read as ruled; the wobble filter does the rest.
 */
function Threads({ active }: { active: string }) {
  return (
    <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full overflow-visible" aria-hidden>
      <g filter={SOFT} fill="none" strokeLinecap="round">
        {STAKEHOLDERS.map((s, i) => {
          const { angle } = at(i);
          const bow = (i % 2 === 0 ? 1 : -1) * 3.5;
          const mx = 50 + Math.cos(angle) * (R * 0.5) + Math.cos(angle + Math.PI / 2) * bow;
          const my = 50 + Math.sin(angle) * (R * 0.5) + Math.sin(angle + Math.PI / 2) * bow;
          const ex = 50 + Math.cos(angle) * (R - 11);
          const ey = 50 + Math.sin(angle) * (R - 11);
          const sx = 50 + Math.cos(angle) * 12;
          const sy = 50 + Math.sin(angle) * 12;
          const on = s.id === active;
          return (
            <path
              key={s.id}
              d={`M ${sx} ${sy} Q ${mx} ${my} ${ex} ${ey}`}
              stroke={on ? ACCENT_HEX[s.accent] : INK}
              strokeOpacity={on ? 0.9 : 0.28}
              strokeWidth={on ? 0.9 : 0.7}
              vectorEffect="non-scaling-stroke"
              style={{ transition: "stroke-opacity 300ms, stroke 300ms" }}
            />
          );
        })}
      </g>
    </svg>
  );
}

/* ------------------------------------------------------------ the map */

/**
 * StakeholderMap - the milk drop in the middle, the people around it as
 * drawn props on cow-spot washes. Selecting one reveals what we heard and
 * how it changed the design, on a page of the picture-book.
 */
export function StakeholderMap() {
  const [active, setActive] = useState(STAKEHOLDERS[0].id);
  const current = STAKEHOLDERS.find((s) => s.id === active)!;
  const currentHex = ACCENT_HEX[current.accent];

  return (
    <div data-stakeholder-map className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:items-center lg:gap-12">
      <div className="relative mx-auto aspect-square w-full min-w-0 max-w-[min(100%,280px)] sm:max-w-[320px] md:max-w-[400px]">
        <HandCaption className="doodad-caption--asked">who we asked</HandCaption>
        <Threads active={active} />

        {/* centre: the drop */}
        <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center">
          <DropMark tint="pink" className="h-16 w-auto sm:h-[4.75rem]" />
          <span className="font-display -mt-1 text-sm tracking-tight text-ink sm:text-base">AURA</span>
        </div>

        {STAKEHOLDERS.map((s, i) => {
          const { x, y } = at(i);
          const isActive = s.id === active;
          const hex = ACCENT_HEX[s.accent];
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => setActive(s.id)}
              onMouseEnter={() => setActive(s.id)}
              onFocus={() => setActive(s.id)}
              aria-pressed={isActive}
              aria-label={s.role}
              className={cn(
                "group absolute flex max-w-[5.5rem] -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1 rounded-lg sm:max-w-none",
                isActive && "z-10",
              )}
              style={{ left: `${x}%`, top: `${y}%` }}
            >
              <span
                className={cn(
                  "relative grid h-14 w-14 place-items-center sm:h-[4.5rem] sm:w-[4.5rem]",
                  isActive && "ring-2 ring-ink ring-offset-2 ring-offset-milk rounded-full",
                )}
              >
                <Blob
                  shape={WASH[i]}
                  fill={hex}
                  outline={isActive}
                  className={cn(
                    "absolute inset-0 h-full w-full transition-[opacity,transform] duration-300 ease-out group-hover:scale-105",
                    isActive ? "scale-105 opacity-55" : "opacity-30",
                  )}
                />
                <span className={cn("relative transition-transform duration-300 ease-out group-hover:scale-105", isActive && "scale-110")}>
                  {GLYPHS[s.id]}
                </span>
              </span>
              <span
                className={cn(
                  "max-w-full truncate text-center text-[0.65rem] font-semibold transition-colors duration-300 sm:text-xs",
                  isActive ? "font-bold text-ink underline decoration-ink/40 underline-offset-2" : "text-ink-55",
                )}
              >
                {s.role}
              </span>
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={current.id}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.3 }}
          className="painted p-6 sm:p-8"
        >
          <div className="flex items-center gap-3">
            <span className="relative grid h-11 w-11 shrink-0 place-items-center">
              <Blob shape={WASH[STAKEHOLDERS.indexOf(current)]} fill={currentHex} className="absolute inset-0 h-full w-full opacity-35" />
              <span className="relative scale-[0.78]">{GLYPHS[current.id]}</span>
            </span>
            <h4 className="font-display text-2xl text-ink sm:text-[1.7rem]">{current.role}</h4>
          </div>
          <div className="mt-5 space-y-5">
            <div>
              <p className="kicker" style={{ color: currentHex }}>
                What we heard
              </p>
              <p className="mt-1.5 text-[0.95rem] leading-relaxed text-ink-70">{current.heard}</p>
            </div>
            <div>
              <p className="kicker" style={{ color: currentHex }}>
                How it changed our design
              </p>
              <p className="mt-1.5 text-[0.95rem] leading-relaxed text-ink-70">{current.changed}</p>
            </div>
            <div className="border-t border-ink/10 pt-4">
              <p className="kicker text-ink-40">Remaining concern</p>
              <p className="mt-1.5 text-[0.95rem] leading-relaxed text-ink-55">{current.concern}</p>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
