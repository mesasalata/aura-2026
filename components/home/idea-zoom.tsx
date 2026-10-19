"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";
import { Art } from "@/components/viz/art";
import { Blob } from "@/components/viz/sketch";
import { Container } from "@/components/ui/container";
import { INK, MILK, WaveSeam } from "@/components/site/wave-seam";

/** The close-up's liquid: the chamber's pale teal, solid. */
const CLOSEUP = "color-mix(in srgb, var(--color-signal) 30%, var(--color-milk))";

/* Where the sensor box sits inside the 240px milk-sensor sprite, from its centre. */
const BOX_DX = 25;
const BOX_DY = 81;
const ORIGIN = `calc(var(--ox) + ${BOX_DX}px) calc(var(--oy) + ${BOX_DY}px)`;

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);
const useSpan = (p: MotionValue<number>, a: number, b: number) => useTransform(p, (v) => easeInOut(clamp01((v - a) / (b - a))));

/* Catapult probes on the FET gate, viewBox units. */
const PROBES = [660, 770, 880, 990, 1100, 1210];
const OPEN_AT = (i: number) => 0.56 + i * 0.04;
const GLOBULES = [
  { x: 180, y: 150, r: 34, d: 0 },
  { x: 420, y: 90, r: 18, d: 2 },
  { x: 760, y: 120, r: 26, d: 4 },
  { x: 1130, y: 80, r: 40, d: 1 },
  { x: 1340, y: 260, r: 20, d: 3 },
  { x: 560, y: 330, r: 14, d: 5 },
];

/**
 * “What if a biosensor…”: the first paragraph beside the milk sensor, then the
 * camera dives into the sensor box and a lens opens onto the FET surface, where
 * the catapults open as miR-223 lands. The second paragraph reads over that.
 */
export function IdeaZoom({ title, line, blurb }: { title: React.ReactNode; line: string; blurb: string }) {
  const reduce = useReducedMotion();
  if (reduce) return <IdeaStatic title={title} line={line} blurb={blurb} />;
  return <IdeaPinned title={title} line={line} blurb={blurb} />;
}

function IdeaPinned({ title, line, blurb }: { title: React.ReactNode; line: string; blurb: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const lensRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ["start start", "end end"] });

  const maxR = useMotionValue(1600);
  useEffect(() => {
    const measure = () => maxR.set(Math.hypot(window.innerWidth, window.innerHeight) * 1.05);
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [maxR]);

  const enter = useTransform(p, [0, 0.04, 1], [0, 1, 1]);
  const dive = useSpan(p, 0.16, 0.42);
  const lens = useSpan(p, 0.24, 0.46);
  const card = useSpan(p, 0.44, 0.56);

  const introOpacity = useTransform(p, [0, 0.04, 0.18, 0.3, 1], [0, 1, 1, 0, 0]);
  const introX = useTransform(dive, [0, 1], [0, -80]);
  const sensorScale = useTransform(dive, [0, 1], [1, 9]);
  const sensorOpacity = useTransform(p, [0, 0.4, 0.46, 1], [1, 1, 0, 0]);
  const radius = useTransform(() => lens.get() * maxR.get());
  const clipPath = useTransform(radius, (r) => `circle(${r.toFixed(1)}px at ${ORIGIN})`);
  const rimScale = useTransform(radius, (r) => r / 100);
  const rimOpacity = useTransform(p, [0, 0.24, 0.26, 0.4, 0.46, 1], [0, 0, 1, 1, 0, 0]);
  const cardY = useTransform(card, [0, 1], [40, 0]);

  /* The nav reads data-nav-tone, not clip-path: mark the close-up light once the lens covers the bar. */
  useMotionValueEvent(p, "change", (v) => {
    lensRef.current?.setAttribute("data-nav-tone", v > 0.4 ? "light" : "none");
  });

  return (
    <>
      <section ref={ref} className="section-dark relative h-[480vh]" aria-label="What if a biosensor could detect signs of the cow's response to infection?">
        <motion.div
          style={{ opacity: enter }}
          className="sticky top-0 h-svh overflow-hidden [--ox:50%] [--oy:70%] lg:[--ox:74%] lg:[--oy:54%]"
        >
          <motion.div
            style={{ opacity: introOpacity, x: introX }}
            className="relative z-10 mx-auto flex h-full max-w-7xl flex-col px-5 pt-24 sm:px-8 lg:justify-center lg:pt-16"
          >
            <div className="max-w-xl lg:max-w-[46%]">
              <h2 className="pop-text font-display text-[clamp(1.7rem,2.6vw+0.6rem,2.9rem)] leading-[1.15] text-milk">{title}</h2>
              <p className="mt-6 text-base leading-relaxed text-milk/85 sm:text-lg">{line}</p>
            </div>
          </motion.div>

          <motion.div
            aria-hidden
            style={{
              scale: sensorScale,
              opacity: sensorOpacity,
              transformOrigin: `calc(50% + ${BOX_DX}px) calc(50% + ${BOX_DY}px)`,
            }}
            className="absolute left-[var(--ox)] top-[var(--oy)] h-80 w-80 -translate-x-1/2 -translate-y-1/2 max-lg:h-64 max-lg:w-64"
          >
            <Blob shape="c" fill="var(--color-signal)" outline className="absolute inset-0 h-full w-full" />
            <span className="absolute right-6 top-4 h-6 w-6 rounded-full border-2 border-ink bg-butter" />
            <span className="absolute bottom-8 left-4 h-4 w-4 rounded-full border-2 border-ink bg-pink" />
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <Art id="milkSensor" size={240} className="sticker" />
            </div>
          </motion.div>

          <motion.div
            ref={lensRef}
            data-nav-tone="none"
            style={{ clipPath, background: CLOSEUP }}
            className="absolute inset-0 z-20"
          >
            <FetCloseUp progress={p} />
            <motion.div
              style={{ opacity: card, y: cardY }}
              className="absolute inset-x-5 top-24 sm:inset-x-8 lg:left-[6%] lg:right-auto lg:top-1/2 lg:w-[30rem] lg:-translate-y-1/2"
            >
              <div className="hand bg-milk p-6 sm:p-7">
                <p className="chip-pop kicker">Inside the sensor</p>
                <p className="mt-4 text-[0.95rem] leading-relaxed text-ink/85 sm:text-base">{blurb}</p>
              </div>
            </motion.div>
          </motion.div>

          <LensRim scale={rimScale} opacity={rimOpacity} />
        </motion.div>
      </section>
      <WaveSeam from="transparent" to={MILK} className="z-40 -mt-14 sm:-mt-[4.5rem]" />
    </>
  );
}

/** The magnifier's rim, drawn at a constant stroke while its circle grows with the lens. */
function LensRim({ scale, opacity }: { scale: MotionValue<number>; opacity: MotionValue<number> }) {
  return (
    <motion.div
      aria-hidden
      style={{ scale, opacity, left: `calc(var(--ox) + ${BOX_DX}px)`, top: `calc(var(--oy) + ${BOX_DY}px)` }}
      className="pointer-events-none absolute z-30 -ml-[100px] -mt-[100px] h-[200px] w-[200px]"
    >
      <svg viewBox="0 0 200 200" className="h-full w-full overflow-visible">
        <circle cx="100" cy="100" r="100" fill="none" stroke="var(--color-ink)" strokeWidth="18" vectorEffect="non-scaling-stroke" />
        <circle cx="100" cy="100" r="100" fill="none" stroke="var(--color-butter)" strokeWidth="11" vectorEffect="non-scaling-stroke" />
      </svg>
    </motion.div>
  );
}

/** Reduced motion: the end state, unpinned. Paragraph, close-up, paragraph. */
function IdeaStatic({ title, line, blurb }: { title: React.ReactNode; line: string; blurb: string }) {
  const done = useMotionValue(1);
  return (
    <>
      <section className="section-dark relative">
        <Container size="wide" className="py-24">
          <h2 className="pop-text max-w-3xl font-display text-[clamp(1.7rem,2.6vw+0.6rem,2.9rem)] leading-[1.15] text-milk">{title}</h2>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-milk/85">{line}</p>
          <div className="hand relative mt-10 aspect-[16/9] overflow-hidden" style={{ background: CLOSEUP }}>
            <FetCloseUp progress={done} />
          </div>
          <p className="mt-8 max-w-2xl text-base leading-relaxed text-milk/80">{blurb}</p>
        </Container>
      </section>
      <WaveSeam from={INK} to={MILK} />
    </>
  );
}

/**
 * Inside the box: milk globules over the FET gate. Six DNA catapults stand on
 * the gate; each opens when a miR-223 strand lands on it, and the current trace
 * in the channel gets louder as more of them open.
 */
const NARROW = "(max-width: 1023px)";
function useNarrow() {
  return useSyncExternalStore(
    (cb) => {
      const mq = window.matchMedia(NARROW);
      mq.addEventListener("change", cb);
      return () => mq.removeEventListener("change", cb);
    },
    () => window.matchMedia(NARROW).matches,
    () => false,
  );
}

function FetCloseUp({ progress }: { progress: MotionValue<number> }) {
  const narrow = useNarrow();
  const last = OPEN_AT(PROBES.length - 1) + 0.05;
  const trace = useTransform(progress, [0, OPEN_AT(0), last, 1], [0.25, 0.25, 1, 1]);
  return (
    <svg
      viewBox={narrow ? "600 380 800 540" : "0 0 1440 900"}
      preserveAspectRatio={narrow ? "xMidYMax meet" : "xMaxYMax slice"}
      className="absolute inset-0 h-full w-full"
      aria-hidden
    >
      {GLOBULES.map((g, i) => (
        <circle
          key={i}
          cx={g.x}
          cy={g.y}
          r={g.r}
          fill="var(--color-milk)"
          stroke="var(--color-ink)"
          strokeWidth="3"
          className="animate-drift"
          style={{ animationDelay: `-${g.d}s` }}
        />
      ))}

      {/* gate, channel, source and drain */}
      <rect x="500" y="700" width="980" height="56" fill="var(--color-butter)" stroke="var(--color-ink)" strokeWidth="5" />
      <rect x="500" y="756" width="980" height="160" fill="#9aa1ab" stroke="var(--color-ink)" strokeWidth="5" />
      <rect x="440" y="680" width="120" height="240" rx="14" fill="#6f7782" stroke="var(--color-ink)" strokeWidth="5" />
      <rect x="1330" y="680" width="120" height="240" rx="14" fill="#6f7782" stroke="var(--color-ink)" strokeWidth="5" />
      <text x="500" y="800" textAnchor="middle" className="fill-milk font-display" fontSize="30">Source</text>
      <text x="1390" y="800" textAnchor="middle" className="fill-milk font-display" fontSize="30">Drain</text>
      <motion.path
        d="M 560 838 C 640 812, 700 864, 780 838 S 920 812, 1000 838 S 1140 864, 1220 838 S 1300 820, 1330 838"
        fill="none"
        stroke="var(--color-signal-deep)"
        strokeWidth="9"
        strokeLinecap="round"
        strokeDasharray="26 18"
        className="[animation:dash-flow_12s_linear_infinite]"
        style={{ opacity: trace }}
      />

      {PROBES.map((x, i) => (
        <Catapult key={x} x={x} at={OPEN_AT(i)} progress={progress} label={i === 1} />
      ))}
      <text x="935" y="740" textAnchor="middle" className="fill-ink font-display" fontSize="28">
        DNA catapults on the FET surface
      </text>
    </svg>
  );
}

/*
 * One catapult, as the description puts it: the complementary DNA stem stays on
 * the surface; miR-223 binds the complementary region and the invasion region
 * swings away from the surface. The arm turns about its base and keeps its
 * length; the loop rides the tip at one size throughout.
 */
const LOOP_R = 20;
const ARM = 132;
const BASE_Y = 700;
const f1 = (v: number) => v.toFixed(1);

/**
 * The arm at angle `a` (radians from upright), with a slight bow. `off` slides it
 * sideways for the paired strand; `from`/`to` are distances along the arm.
 */
function armPath(bx: number, a: number, bow: number, off = 0, from = 0, to = ARM) {
  const dx = Math.sin(a), dy = -Math.cos(a), nx = Math.cos(a), ny = Math.sin(a);
  const pt = (along: number, side: number) => [bx + dx * along + nx * side, BASE_Y + dy * along + ny * side];
  const [x0, y0] = pt(from, off);
  const [x1, y1] = pt(from + (to - from) / 3, off - bow);
  const [x2, y2] = pt(from + ((to - from) * 2) / 3, off - bow * 0.6);
  const [x3, y3] = pt(to, off);
  return `M ${f1(x0)} ${f1(y0)} C ${f1(x1)} ${f1(y1)}, ${f1(x2)} ${f1(y2)}, ${f1(x3)} ${f1(y3)}`;
}

/* The paired strand sits this far beside the arm. It starts where it meets the
   surface and ends where it meets the loop. */
const PAIR_OFF = 11;
const pairFrom = (a: number) => PAIR_OFF * Math.tan(a) + 3;
const PAIR_TO = ARM + LOOP_R - Math.sqrt(LOOP_R ** 2 - PAIR_OFF ** 2) + 2;

function Catapult({ x, at, progress, label }: { x: number; at: number; progress: MotionValue<number>; label: boolean }) {
  const bx = x - 6;
  const tilt = (34 * Math.PI) / 180;
  const open = useTransform(progress, (v) => easeInOut(clamp01((v - at) / 0.06)));
  const strand = useTransform(open, (t) => armPath(bx, t * tilt, 10 * t));
  const paired = useTransform(open, (t) => armPath(bx, t * tilt, 10 * t, PAIR_OFF, pairFrom(t * tilt), PAIR_TO));
  const foot = useTransform(open, (t) => `M ${x + 8} ${BASE_Y} V ${f1(BASE_Y - ARM * (1 - clamp01(t * 1.6)))}`);
  const footOpacity = useTransform(open, (t) => (t > 0.6 ? 0 : 1));
  const loopX = useTransform(open, (t) => Math.sin(t * tilt) * (ARM + LOOP_R) - 7);
  const loopY = useTransform(open, (t) => (1 - Math.cos(t * tilt)) * (ARM + LOOP_R));
  const zip = useTransform(progress, (v) => clamp01((v - at - 0.01) / 0.06));
  const zipOpacity = useTransform(progress, [0, at, at + 0.01, 1], [0, 0, 1, 1]);
  const strandY = useTransform(progress, [0, at - 0.1, at, 1], [-260, -260, 0, 0]);
  const strandOpacity = useTransform(progress, [0, at - 0.1, at - 0.07, at, at + 0.015, 1], [0, 0, 1, 1, 0, 0]);
  const labelOpacity = useTransform(progress, [0, at + 0.04, at + 0.07, 1], [0, 0, 1, 1]);

  return (
    <g>
      {/* closed hairpin's second strand: folds away as the arm opens */}
      <motion.path d={foot} stroke="var(--color-ink)" strokeWidth="5" strokeLinecap="round" style={{ opacity: footOpacity }} />

      {/* invasion region: turns away from the surface as the target binds */}
      <motion.path d={strand} fill="none" stroke="var(--color-ink)" strokeWidth="6" strokeLinecap="round" />

      {/* miR-223 paired along the arm */}
      <motion.path d={paired} fill="none" stroke="var(--color-pink)" strokeWidth="8" strokeLinecap="round" style={{ pathLength: zip, opacity: zipOpacity }} />

      <motion.circle
        cx={x + 1}
        cy={BASE_Y - ARM - LOOP_R}
        r={LOOP_R}
        fill="var(--color-butter)"
        stroke="var(--color-ink)"
        strokeWidth="5"
        style={{ x: loopX, y: loopY }}
      />

      {/* incoming miR-223, landing on the loop */}
      <motion.path
        d={`M ${x + 26} 520 c 10 -18, 22 -18, 30 0 s 20 18, 30 0`}
        fill="none"
        stroke="var(--color-pink)"
        strokeWidth="8"
        strokeLinecap="round"
        style={{ y: strandY, opacity: strandOpacity }}
      />

      {label && (
        <motion.text x={x + 70} y={500} className="fill-pink-deep font-display" fontSize="30" style={{ opacity: labelOpacity }}>
          miR-223
        </motion.text>
      )}
    </g>
  );
}
