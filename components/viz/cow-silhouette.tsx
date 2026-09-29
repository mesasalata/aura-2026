import { cn } from "@/lib/utils";

/**
 * Abstract, editorial cow silhouette - a single flowing line, not a cartoon.
 * Reads as a Holstein profile with a soft "aura" bloom over the udder region.
 */
export function CowSilhouette({
  className,
  glow = true,
}: {
  className?: string;
  glow?: boolean;
}) {
  return (
    <svg
      viewBox="0 0 320 200"
      className={cn("w-full", className)}
      fill="none"
      aria-hidden
    >
      {glow && (
        <circle cx="212" cy="150" r="34" fill="url(#cowAura)" className="animate-aura" />
      )}
      {/* Body contour - one confident stroke */}
      <path
        d="M40 96
           C36 78 48 70 60 72
           C64 58 76 52 88 56
           C96 44 112 44 120 54
           C150 46 196 44 236 56
           C252 60 268 70 280 84
           C292 96 300 92 306 100
           C300 106 292 104 286 102
           C284 116 276 126 264 130
           L262 156 L250 156 L250 132
           C232 138 208 140 186 138
           L186 158 L174 158 L174 136
           C130 134 92 124 70 108
           C60 118 52 116 46 110
           C40 116 34 112 34 104 Z"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinejoin="round"
        strokeLinecap="round"
        className="text-ink"
        fill="none"
      />
      {/* Signature Holstein spots */}
      <path d="M150 78 C164 70 180 74 184 88 C176 100 156 100 150 90 Z" fill="currentColor" className="text-ink/70" />
      <path d="M210 96 C222 92 232 98 232 108 C224 116 210 112 208 104 Z" fill="currentColor" className="text-ink/70" />
      {/* Udder region marker (the signal source) */}
      <circle cx="212" cy="146" r="5" className="fill-pink" />
      <defs>
        <radialGradient id="cowAura" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="var(--color-pink)" stopOpacity="0.55" />
          <stop offset="45%" stopColor="var(--color-orange)" stopOpacity="0.28" />
          <stop offset="100%" stopColor="var(--color-butter)" stopOpacity="0" />
        </radialGradient>
      </defs>
    </svg>
  );
}
