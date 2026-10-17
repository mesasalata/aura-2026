"use client";

import { Art } from "@/components/viz/art";
import { cn } from "@/lib/utils";

export function IdeaCast({ className }: { className?: string }) {
  return (
    <div className={cn("flex h-72 w-64 items-center justify-center", className)}>
      <Art
        id="milkSensor"
        motion="breathe"
        size={240}
        decorative={false}
        alt="Inline milk biosensor chamber on the milking line"
      />
    </div>
  );
}
