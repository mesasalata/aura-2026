"use client";

import { useRef } from "react";
import dynamic from "next/dynamic";
import { useMotionValue, useReducedMotion, useScroll } from "motion/react";
import { Blob } from "@/components/viz/sketch";
import { cn } from "@/lib/utils";
import { COW_CALLS } from "@/components/home/cow-copy";

const CowScene = dynamic(() => import("@/components/home/cow-scene"), { ssr: false });

export function CowBeat() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const done = useMotionValue(1);
  const progress = reduce ? done : scrollYProgress;

  return (
    <section
      ref={ref}
      className={cn("relative bg-milk", reduce ? "min-h-svh" : "h-[240vh]")}
      aria-label="How AURA reads a cow"
    >
      <div className={cn("overflow-hidden", reduce ? "relative min-h-svh" : "sticky top-0 h-svh")}>
        {/* Hide-spots on the milk - same patches as the rest of the page, so the 3D cow sits in the drawing. */}
        <Blob
          shape="b"
          fill="#5c3d28"
          className="pointer-events-none absolute -left-16 top-10 h-48 w-48 opacity-70 sm:h-64 sm:w-64"
        />
        <Blob
          shape="a"
          fill="#4e3724"
          className="pointer-events-none absolute -right-20 bottom-8 h-56 w-56 opacity-55 sm:h-72 sm:w-72"
        />
        <Blob
          shape="c"
          fill="#6b4a32"
          className="pointer-events-none absolute left-[18%] bottom-6 h-16 w-16 opacity-80"
        />

        <CowScene progress={progress} reduce={!!reduce} />

        <ol className="sr-only">
          {COW_CALLS.map((call) => (
            <li key={call.id}>
              <p>{call.title}</p>
              <p>{call.body}</p>
            </li>
          ))}
        </ol>

        {/* Paper scrap taped to the sticky stage - tells you the cow is a scroll, not a still. */}
        <div className="doodad-cow-caption">
          <span className="doodad-cow-tape doodad-cow-tape-a" aria-hidden />
          <span className="doodad-cow-tape doodad-cow-tape-b" aria-hidden />
          <p>scroll the cow</p>
        </div>

        {reduce && (
          <ol className="relative z-10 mx-auto flex max-w-xl flex-col gap-4 px-5 pb-10 pt-[48vh]">
            {COW_CALLS.map((call) => (
              <li key={call.id} className="rounded-[1.6rem] bg-pink-soft/55 px-5 py-4 text-ink">
                <p className="font-display text-xl leading-tight">{call.title}</p>
                <p className="mt-2 text-sm leading-relaxed text-ink/80">{call.body}</p>
              </li>
            ))}
          </ol>
        )}
      </div>
    </section>
  );
}
