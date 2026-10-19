import type { Metadata } from "next";
import Engineering from "@/content/project/engineering.mdx";
import { WikiMdxShell } from "@/components/site/wiki-mdx-shell";

export const metadata: Metadata = {
  title: "Engineering",
  description:
    "Five Design–Build–Test–Learn cycles: adapting the catapult probe to miR-223, improving its fluorescence response, validating it with RNA at 39 °C, and testing two reset strategies.",
};

const TOC = [
  { id: "rationale", label: "Rationale" },
  { id: "cycle-1", label: "Cycle 1: Adapt" },
  { id: "cycle-2", label: "Cycle 2: Reuse-ready" },
  { id: "cycle-3", label: "Cycle 3: RNA at 39 °C" },
  { id: "cycle-4", label: "Cycle 4: RNase H" },
  { id: "cycle-5", label: "Cycle 5: Strand displacement" },
  { id: "references", label: "References" },
]

export default function EngineeringPage() {
  return (
    <WikiMdxShell
      kicker="Project · Engineering"
      accent="butter"
      title="Engineering a reusable miR-223 catapult sensor"
      lede="Five Design–Build–Test–Learn cycles took the catapult probe from miR-21 to miR-223, to RNA at 39 °C, and to two attempts at resetting the sensor."
      current="/engineering"
      toc={TOC}
    >
      <Engineering />
    </WikiMdxShell>
  );
}
