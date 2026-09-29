"use client";

import { motion, useReducedMotion } from "motion/react";
import { ArrowRight, BellRing, CircuitBoard, Milk } from "lucide-react";
import Image from "next/image";
import { Container } from "@/components/ui/container";
import { ART, artUrl, type ArtId } from "@/lib/art";
import { cn } from "@/lib/utils";

const STEPS = [
  {
    n: "01",
    label: "During milking",
    title: "Milk passes the sensor",
    body: "AURA is designed to sit inline with the milk flow, so screening can happen during the normal milking routine instead of as a separate lab errand.",
    art: "milkSensor" as const satisfies ArtId,
    icon: Milk,
    imageClass: "h-56 sm:h-64",
  },
  {
    n: "02",
    label: "At the BioFET",
    title: "A specific miRNA is detected",
    body: "The proposed BioFET sensing surface targets a mastitis-associated microRNA in milk and converts recognition into an electronic signal.",
    art: "biofet" as const satisfies ArtId,
    icon: CircuitBoard,
    imageClass: "h-44 sm:h-52",
  },
  {
    n: "03",
    label: "For the farmer",
    title: "The signal becomes an alert",
    body: "A computer or phone receives the signal and flags possible mastitis, prompting an earlier check and veterinary assessment when needed.",
    art: "phoneAlert" as const satisfies ArtId,
    icon: BellRing,
    imageClass: "h-52 sm:h-60",
  },
] as const;

export function ConceptFlow({ compact = false }: { compact?: boolean }) {
  const reduce = useReducedMotion();

  return (
    <div className={cn("relative", !compact && "bg-milk py-20 sm:py-28")}>
      <Container size="wide" className={compact ? "px-0" : undefined}>
        {!compact && (
          <div className="mx-auto max-w-3xl text-center">
            <p className="kicker text-signal-deep">The AURA concept</p>
            <h2 className="mt-4 font-display display-1 text-ink text-balance">
              Detect miRNA. Send an alert.
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-ink-70 text-pretty">
              The poster describes one direct chain: an inline sensor reads milk during milking,
              a BioFET detects a specific microRNA, and an electronic signal reaches a phone or computer.
            </p>
          </div>
        )}

        <ol className={cn("relative grid gap-5 lg:grid-cols-3", compact ? "mt-2" : "mt-12 sm:mt-16")}>
          {STEPS.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.li
                key={step.n}
                initial={reduce ? false : { opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.65, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="relative flex min-h-full flex-col rounded-[2rem] border border-ink/10 bg-cream/45 p-5 sm:p-6"
              >
                <div className="flex items-center justify-between">
                  <span className="font-display text-sm font-semibold tracking-[0.18em] text-pink-deep">
                    {step.n}
                  </span>
                  <Icon className="h-5 w-5 text-signal-deep" aria-hidden />
                </div>

                <div className="my-5 flex min-h-64 items-center justify-center rounded-[1.5rem] bg-milk/75 p-4 sm:min-h-72">
                  <Image
                    src={artUrl(step.art)}
                    alt={ART[step.art].alt}
                    width={ART[step.art].w}
                    height={ART[step.art].h}
                    draggable={false}
                    className={cn("w-full object-contain", step.imageClass)}
                  />
                </div>

                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-ink-55">{step.label}</p>
                <h3 className="mt-2 font-display text-2xl font-semibold leading-tight text-ink">{step.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-ink-70 sm:text-base">{step.body}</p>

                {index < STEPS.length - 1 && (
                  <span
                    aria-hidden
                    className="absolute -right-4 top-[43%] z-10 hidden h-9 w-9 items-center justify-center rounded-full bg-pink text-milk shadow-lg lg:flex"
                  >
                    <ArrowRight className="h-4 w-4" />
                  </span>
                )}
              </motion.li>
            );
          })}
        </ol>

        <p className={cn("text-center text-xs font-medium text-ink-55", compact ? "mt-5" : "mt-8")}>
          Concept under development · Performance still to be validated · Diagnostic support, not a veterinary diagnosis
        </p>
      </Container>
    </div>
  );
}
