"use client";

import { Art, ArtPin, ArtStage } from "@/components/viz/art";
import { CoinMark, DropMark, FlaskMark, PailMark } from "@/components/viz/marks";
import { HERO_CAST, HERO_PROP, type ArtScene, type PlacedArt } from "@/lib/art";
import { cn } from "@/lib/utils";

function Cast({ pieces }: { pieces: PlacedArt[] }) {
  return (
    <>
      {pieces.map((p, i) => (
        <ArtPin key={`${p.id}-${i}`} x={p.x} y={p.y} depth={p.depth} hide={p.hide}>
          <Art
            id={p.id}
            motion={p.motion}
            size={p.size}
            rotate={p.rotate}
            flip={p.flip}
            delay={p.delay}
            glow={p.glow}
            opacity={p.opacity}
          />
        </ArtPin>
      ))}
    </>
  );
}

/** Living illustration that sits beside a page title. */
export function HeroDiorama({
  scene,
  className,
}: {
  scene: ArtScene;
  className?: string;
}) {
  const prop = HERO_PROP[scene];
  return (
    <ArtStage className={cn("h-full w-full", className)}>
      <Cast pieces={HERO_CAST[scene]} />
      {prop !== "none" && (
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" aria-hidden>
          <div className="animate-drift">
            {prop === "pail" && <PailMark className="h-56 w-auto sm:h-64 lg:h-80" />}
            {prop === "flask" && <FlaskMark className="h-52 w-auto sm:h-60 lg:h-72" liquid="pink" />}
            {prop === "drop" && <DropMark className="h-44 w-auto sm:h-52 lg:h-64" />}
          </div>
        </div>
      )}
    </ArtStage>
  );
}

export function CostSpill({ className }: { className?: string }) {
  return (
    <div className={cn("relative h-64 w-64", className)} aria-hidden>
      <div className="absolute left-1/2 top-4 w-40 -translate-x-1/2 rotate-[-32deg]">
        <PailMark className="h-auto w-full" />
      </div>
      <div className="absolute bottom-10 left-8 w-12 animate-drift">
        <CoinMark className="h-auto w-full" />
      </div>
      <div className="absolute bottom-16 right-10 w-10 rotate-12" style={{ animation: "drift 7.5s ease-in-out infinite" }}>
        <CoinMark className="h-auto w-full" />
      </div>
      <div className="absolute bottom-6 left-1/2 w-9 -translate-x-1/2 -rotate-8">
        <CoinMark className="h-auto w-full" />
      </div>
    </div>
  );
}

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
