"use client";

import { useReducedMotion, useTransform, type MotionValue } from "motion/react";
import { motion } from "motion/react";
import { artUrl, type ArtId } from "@/lib/art";
import { cn } from "@/lib/utils";

/**
 * Recraft notes on the flanks. Scroll brings them in and fades them;
 * a looping flutter keeps the paper flopping so they never sit still.
 * Bills remain on gen/ — no images/ equivalent yet (see ART.bill1…3).
 */

const BILLS = (["bill1", "bill2", "bill3"] as const satisfies ArtId[]).map(artUrl);

type Note = {
  x0: number;
  y0: number;
  drift: number;
  spin: number;
  size: number;
  delay: number;
  flutter: number;
  src: string;
};

function notesFor(side: -1 | 1): Note[] {
  return Array.from({ length: 6 }, (_, i) => ({
    x0: side * (8 + (i % 3) * 18),
    y0: (i - 2.5) * 46,
    drift: side * (22 + (i % 3) * 10),
    spin: ((i * 31) % 44) - 22,
    size: 48 + (i % 3) * 8,
    delay: (i % 3) * 0.03,
    flutter: 2.1 + (i % 5) * 0.35,
    src: BILLS[i % BILLS.length],
  }));
}

export function CashBurst({
  progress,
  side,
}: {
  progress: MotionValue<number>;
  side: "left" | "right";
}) {
  const reduce = useReducedMotion();
  const dir = side === "left" ? -1 : 1;
  return (
    <div className={cn("pointer-events-none relative h-full w-full")} aria-hidden>
      {notesFor(dir).map((note, i) => (
        <FlyingBill key={i} note={note} progress={progress} reduce={!!reduce} />
      ))}
    </div>
  );
}

function FlyingBill({
  note,
  progress,
  reduce,
}: {
  note: Note;
  progress: MotionValue<number>;
  reduce: boolean;
}) {
  const t = useTransform(progress, [0.06 + note.delay, 0.42 + note.delay], [reduce ? 1 : 0, 1]);
  const x = useTransform(t, (v) => note.x0 + note.drift * v);
  const y = useTransform(t, (v) => note.y0);
  const opacity = useTransform(
    progress,
    [0, 0.06 + note.delay, 0.16 + note.delay, 0.58, 0.78, 1],
    [0, 0, 1, 1, 0, 0],
  );

  return (
    <motion.div
      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
      style={{ x, y, opacity, width: note.size }}
    >
      <motion.div
        className="origin-center"
        animate={
          reduce
            ? undefined
            : {
                rotate: [note.spin - 10, note.spin + 16, note.spin - 8, note.spin + 6, note.spin - 10],
                y: [0, -16, 8, -10, 0],
                x: [0, 6, -8, 4, 0],
                skewX: [-10, 12, -6, 8, -10],
                skewY: [4, -5, 3, -4, 4],
                scale: [1, 1.06, 0.96, 1.04, 1],
              }
        }
        transition={{
          duration: note.flutter,
          repeat: Infinity,
          ease: "easeInOut",
          delay: note.delay * 4,
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={note.src} alt="" draggable={false} className="h-auto w-full select-none" />
      </motion.div>
    </motion.div>
  );
}
