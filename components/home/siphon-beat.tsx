"use client";

import { useRef } from "react";
import { motion, useMotionValue, useReducedMotion, useScroll, useTransform, type MotionValue } from "motion/react";
import { Blob } from "@/components/viz/sketch";
import { artUrl } from "@/lib/art";
import { cn } from "@/lib/utils";

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const ease = (t: number) => (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2);
/** 0→1 across [a, b], eased. Function transforms are not handed to native timelines, so they clamp. */
const useStep = (p: MotionValue<number>, a: number, b: number) => useTransform(p, (v) => ease(clamp01((v - a) / (b - a))));

const LINE_Y = 205;
const JUNCTION_X = 560;
const LEVEL_EMPTY = 548;
const LEVEL_FULL = 470;
const CHAMBER = "color-mix(in srgb, var(--color-signal) 30%, var(--color-milk))";
const CATAPULTS = [500, 540, 580, 620];

/**
 * “How a siphoned sample reaches the FET”, played out: milk runs in the line,
 * one sip is siphoned down into the sampling chamber, lands on the biosensor
 * surface, the catapults there flip, and the readout steps. The paragraph is
 * the team's; the scene only labels the parts it names.
 */
export function SiphonBeat() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const done = useMotionValue(1);
  const p = reduce ? done : scrollYProgress;

  const enter = useTransform(p, [0, 0.08, 1], [0, 1, 1]);

  return (
    <section
      ref={ref}
      className={cn("relative bg-milk", reduce ? "min-h-svh" : "h-[260vh]")}
      aria-label="How a siphoned sample reaches the FET"
    >
      <div className={cn("top-0 h-svh overflow-hidden", reduce ? "relative" : "sticky")}>
        <motion.div
          style={{ opacity: enter }}
          className="relative mx-auto grid h-full w-full max-w-7xl items-center gap-6 px-5 pb-8 pt-20 sm:px-8 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-10 lg:pt-16"
        >
          <div className="max-lg:self-end">
            <h2 className="pop-text font-display text-[clamp(2rem,4.2vw,3.6rem)] leading-[1.06] text-ink text-balance [--pop:var(--color-signal)]">
              How a siphoned sample reaches the FET
            </h2>
            <span className="rule-pop" style={{ background: "var(--color-signal)" }} aria-hidden />
            <p className="mt-5 max-w-lg text-base leading-relaxed text-ink/80 text-pretty sm:text-lg">
              During each milking session a small sample of milk is siphoned to a sampling chamber and
              passes over the biosensor surface. When miR-223 associates with the DNA catapult, the
              local electrical field changes and the FET detects a change in electrical current
              between the source and the drain.
            </p>
          </div>

          <div className="relative min-h-0 max-lg:self-start">
            <Blob
              shape="ring"
              fill="color-mix(in srgb, var(--color-butter) 40%, var(--color-milk))"
              outline
              className="absolute left-1/2 top-1/2 h-[92%] w-[92%] -translate-x-1/2 -translate-y-1/2"
            />
            <SiphonScene p={p} />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function SiphonScene({ p }: { p: MotionValue<number> }) {
  /* timeline */
  const run = useStep(p, 0.1, 0.34);
  const sip = useStep(p, 0.36, 0.5);
  const land = useStep(p, 0.5, 0.6);
  const flip = useStep(p, 0.6, 0.72);
  const read = useStep(p, 0.7, 0.8);

  /* the drop: down from the udder, along the line, then down the siphon */
  const dropX = useTransform(() => (run.get() < 0.12 ? 150 : 150 + ((run.get() - 0.12) / 0.88) * (JUNCTION_X - 150)));
  const dropY = useTransform(() => {
    const r = run.get();
    if (r < 0.12) return 140 + (r / 0.12) * (LINE_Y - 140);
    return LINE_Y + sip.get() * (LEVEL_FULL - 16 - LINE_Y);
  });
  const dropOpacity = useTransform(() => (p.get() < 0.1 || land.get() > 0.35 ? 0 : 1));
  const valve = useTransform(sip, [0, 1], [0, 270]);
  const level = useTransform(land, [0, 1], [LEVEL_EMPTY, LEVEL_FULL]);
  const levelH = useTransform(level, (y) => 556 - y);
  const ripple = useTransform(land, [0, 0.2, 1], [0.2, 0.5, 1.6]);
  const rippleOpacity = useTransform(land, [0, 0.15, 1], [0, 1, 0]);
  const trace = useTransform(read, [0, 1], [
    "M 744 640 L 790 640 L 800 640 L 812 640 L 874 640",
    "M 744 640 L 790 640 L 800 596 L 812 596 L 874 596",
  ]);
  const glow = useTransform(flip, [0, 1], [0, 1]);

  const siphonLabel = useTransform(p, (v) => (v > 0.38 ? 1 : 0));
  const chamberLabel = useTransform(land, [0, 0.4], [0, 1]);
  const surfaceLabel = useTransform(flip, [0, 0.4], [0, 1]);
  const currentLabel = useTransform(read, [0, 0.4], [0, 1]);

  return (
    <svg viewBox="0 0 900 720" className="relative block h-auto max-h-[72svh] w-full" aria-hidden>
      {/* cow at the start of the line */}
      <image href={artUrl("cow")} x={0} y={0} width={220} height={165} className="sticker" />

      {/* milking line, milk running in it */}
      <path d={`M 150 136 C 150 ${LINE_Y}, 190 ${LINE_Y}, 240 ${LINE_Y} L 900 ${LINE_Y}`} fill="none" stroke="var(--color-ink)" strokeWidth="32" strokeLinecap="round" />
      <path d={`M 150 136 C 150 ${LINE_Y}, 190 ${LINE_Y}, 240 ${LINE_Y} L 900 ${LINE_Y}`} fill="none" stroke="var(--color-milk)" strokeWidth="21" strokeLinecap="round" />
      <path
        d={`M 240 ${LINE_Y} L 900 ${LINE_Y}`}
        fill="none"
        stroke="var(--color-cream)"
        strokeWidth="7"
        strokeLinecap="round"
        strokeDasharray="14 26"
        className="[animation:dash-flow_14s_linear_infinite_reverse]"
      />
      <text x={880} y={LINE_Y - 30} textAnchor="end" className="fill-ink font-display" fontSize="22">to the tank →</text>

      {/* siphon branch and valve */}
      <path d={`M ${JUNCTION_X} ${LINE_Y} V 336`} fill="none" stroke="var(--color-ink)" strokeWidth="24" />
      <path d={`M ${JUNCTION_X} ${LINE_Y + 8} V 338`} fill="none" stroke="var(--color-milk)" strokeWidth="13" />
      <motion.g style={{ rotate: valve, transformBox: "fill-box", transformOrigin: "50% 50%" }}>
        <circle cx={JUNCTION_X} cy={262} r={19} fill="var(--color-pink)" stroke="var(--color-ink)" strokeWidth="4" />
        <path d={`M ${JUNCTION_X - 12} 262 H ${JUNCTION_X + 12} M ${JUNCTION_X} 250 V 274`} stroke="var(--color-ink)" strokeWidth="4" strokeLinecap="round" />
      </motion.g>
      <motion.text x={JUNCTION_X + 32} y={270} className="fill-pink-deep font-display" fontSize="24" style={{ opacity: siphonLabel }}>
        siphon
      </motion.text>

      {/* sampling chamber */}
      <rect x={440} y={330} width={240} height={226} rx={28} fill={CHAMBER} stroke="var(--color-ink)" strokeWidth="5" />
      <clipPath id="siphon-chamber">
        <rect x={442} y={332} width={236} height={222} rx={26} />
      </clipPath>
      <g clipPath="url(#siphon-chamber)">
        <motion.rect x={440} width={240} fill="var(--color-milk)" style={{ y: level, height: levelH }} />
        <motion.circle cx={JUNCTION_X} cy={LEVEL_FULL} r={30} fill="none" stroke="var(--color-ink)" strokeWidth="3" style={{ scale: ripple, opacity: rippleOpacity }} />
      </g>
      <motion.text x={696} y={352} className="fill-ink font-display" fontSize="22" style={{ opacity: chamberLabel }}>
        sampling chamber
      </motion.text>

      {/* biosensor surface with its catapults */}
      <motion.rect x={466} y={508} width={188} height={26} rx={6} fill="var(--color-butter)" stroke="var(--color-ink)" strokeWidth="4" style={{ opacity: 1 }} />
      <motion.rect x={460} y={502} width={200} height={38} rx={10} fill="none" stroke="var(--color-pink)" strokeWidth="4" style={{ opacity: glow }} />
      {CATAPULTS.map((x, i) => (
        <Flip key={x} x={x} t={flip} delay={i * 0.12} />
      ))}
      <motion.text x={560} y={590} textAnchor="middle" className="fill-ink font-display" fontSize="22" style={{ opacity: surfaceLabel }}>
        biosensor surface
      </motion.text>

      {/* readout */}
      <path d="M 654 521 C 712 521, 700 640, 744 640" fill="none" stroke="var(--color-ink)" strokeWidth="4" strokeLinecap="round" />
      <rect x={730} y={560} width={160} height={110} rx={18} fill="var(--color-milk)" stroke="var(--color-ink)" strokeWidth="5" />
      <motion.path d={trace} fill="none" stroke="var(--color-signal-deep)" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
      <motion.text x={810} y={700} textAnchor="middle" className="fill-ink font-display" fontSize="22" style={{ opacity: currentLabel }}>
        change in current
      </motion.text>

      {/* the sip */}
      <motion.circle r={11} fill="var(--color-milk)" stroke="var(--color-ink)" strokeWidth="3.5" style={{ cx: dropX, cy: dropY, opacity: dropOpacity }} />
    </svg>
  );
}

/** A small catapult on the chip: upright until its turn, then it tips open. */
function Flip({ x, t, delay }: { x: number; t: MotionValue<number>; delay: number }) {
  const a = useTransform(t, (v) => (clamp01((v - delay) / (1 - delay * 2)) * 32 * Math.PI) / 180);
  const d = useTransform(a, (r) => `M ${x} 508 L ${(x + Math.sin(r) * 30).toFixed(1)} ${(508 - Math.cos(r) * 30).toFixed(1)}`);
  const cx = useTransform(a, (r) => x + Math.sin(r) * 37);
  const cy = useTransform(a, (r) => 508 - Math.cos(r) * 37);
  return (
    <g>
      <motion.path d={d} stroke="var(--color-ink)" strokeWidth="4" strokeLinecap="round" />
      <motion.circle cx={cx} cy={cy} r={7} fill="var(--color-butter)" stroke="var(--color-ink)" strokeWidth="3" />
    </g>
  );
}
