import { cn } from "@/lib/utils";

export const WAVE =
  "M0 36 C 160 4, 320 68, 500 28 C 680 0, 860 64, 1040 24 C 1200 4, 1340 52, 1440 36 L 1440 80 L 0 80 Z";

/** Page tones - cream/50 matches `bg-cream/50` over the milk body. */
export const MILK = "var(--color-milk)";
export const CREAM = "var(--color-cream)";
export const CREAM50 = "color-mix(in srgb, var(--color-cream) 50%, var(--color-milk))";
export const INK = "var(--color-ink)";
export const SUNSET_SKY = "#ffd6a8";
export const SUNSET_PEACH = "#f3d4b0";
export const SUNSET_DUSK = "#c24e42";

/**
 * A drawn milk-edge sitting between two page tones. `from` is the colour
 * above the wave; `to` is the colour that floods in underneath it.
 */
export function WaveSeam({
  from,
  to,
  className,
}: {
  from: string;
  to: string;
  className?: string;
}) {
  return (
    <div
      aria-hidden
      className={cn("relative z-10 h-14 w-full overflow-hidden sm:h-[4.5rem]", className)}
      style={{ background: from }}
    >
      <svg viewBox="0 0 1440 80" preserveAspectRatio="none" className="block h-full w-full">
        <path d={WAVE} fill={to} />
      </svg>
      {/* Covers the subpixel gap SVG leaves at y=80 so the seam doesn't read as a border. */}
      <span className="absolute inset-x-0 bottom-0 h-[2px]" style={{ background: to }} />
    </div>
  );
}

/** Long vertical fade. Use when a 4.5rem wave would read as a jump cut. */
export function ToneWash({
  stops,
  className,
}: {
  stops: string;
  className?: string;
}) {
  return (
    <div
      aria-hidden
      className={cn("relative w-full", className)}
      style={{ background: `linear-gradient(180deg, ${stops})` }}
    />
  );
}
