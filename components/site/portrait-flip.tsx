"use client";

import { useState } from "react";
import { asset } from "@/lib/utils";

const FACE = "absolute inset-0 [backface-visibility:hidden] [-webkit-backface-visibility:hidden]";

/** Two-sided portrait: photo on the front, drawn portrait on the back. Hover (mouse) or tap to turn. */
export function PortraitFlip({
  name,
  illustration,
  photo,
}: {
  name: string;
  illustration: string;
  photo: string;
}) {
  const [flipped, setFlipped] = useState(false);

  return (
    <button
      type="button"
      aria-pressed={flipped}
      aria-label={flipped ? `Show photo of ${name}` : `Show drawn portrait of ${name}`}
      onClick={() => setFlipped((f) => !f)}
      onPointerEnter={(e) => e.pointerType === "mouse" && setFlipped(true)}
      onPointerLeave={(e) => e.pointerType === "mouse" && setFlipped(false)}
      className="group relative block aspect-[4/5] w-full cursor-pointer [perspective:1200px] focus-visible:outline-none"
    >
      <span
        className="relative block h-full w-full transition-transform duration-700 ease-[cubic-bezier(0.2,0.8,0.2,1)] [transform-style:preserve-3d]"
        style={{ transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)" }}
      >
        <span className={`${FACE} radius-hand overflow-hidden border-[2.25px] border-ink group-focus-visible:ring-2 group-focus-visible:ring-pink-deep`}>
          {/* eslint-disable-next-line @next/next/no-img-element -- static export + basePath via asset() */}
          <img
            src={asset(photo)}
            alt={`Photo of ${name}`}
            draggable={false}
            loading="lazy"
            className="h-full w-full select-none object-cover object-top"
          />
        </span>
        <span
          className={`${FACE} radius-hand overflow-hidden border-[2.25px] border-ink group-focus-visible:ring-2 group-focus-visible:ring-pink-deep`}
          style={{ transform: "rotateY(180deg)" }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element -- static export + basePath via asset() */}
          <img
            src={asset(illustration)}
            alt={`Drawn portrait of ${name}`}
            draggable={false}
            loading="lazy"
            className="h-full w-full select-none object-cover"
          />
        </span>
      </span>
      <span
        aria-hidden
        className="hand-chip pointer-events-none absolute bottom-3 right-3 border-ink bg-milk px-2.5 py-1 font-mono text-[0.6rem] uppercase tracking-widest text-ink transition-opacity duration-300"
      >
        {flipped ? "Real" : "Drawn"} ↻
      </span>
    </button>
  );
}
