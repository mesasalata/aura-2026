"use client";

import { Art } from "@/components/viz/art";
import { Blob } from "@/components/viz/sketch";
import { cn } from "@/lib/utils";

export function IdeaCast({ className }: { className?: string }) {
  return (
    <div className={cn("relative flex h-80 w-80 items-center justify-center", className)}>
      <Blob shape="c" fill="var(--color-signal)" outline className="absolute inset-0 h-full w-full" />
      <span className="absolute right-6 top-4 h-6 w-6 rounded-full border-2 border-ink bg-butter" />
      <span className="absolute bottom-8 left-4 h-4 w-4 rounded-full border-2 border-ink bg-pink" />
      <Art
        id="milkSensor"
        motion="breathe"
        size={250}
        decorative={false}
        alt="Inline milk biosensor chamber on the milking line"
        className="sticker"
      />
    </div>
  );
}
