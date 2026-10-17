import type { Metadata } from "next";
import Engineering from "@/content/project/engineering.mdx";
import { WikiMdxShell } from "@/components/site/wiki-mdx-shell";

export const metadata: Metadata = {
  title: "Engineering",
  description:
    "Two Design–Build–Test–Learn cycles: adapting the miR-21 catapult to miR-223, then comparing probe variants by fluorescence.",
};

const TOC = [
  { id: "design-1", label: "Design 1" },
  { id: "build-1", label: "Build 1" },
  { id: "test-1", label: "Test 1" },
  { id: "learn-1", label: "Learn 1" },
  { id: "design-2", label: "Design 2" },
  { id: "build-2", label: "Build 2" },
  { id: "test-2", label: "Test 2" },
  { id: "learn-2", label: "Learn 2" },
];

export default function EngineeringPage() {
  return (
    <WikiMdxShell
      kicker="Project · Engineering"
      accent="butter"
      title="Two cycles on the miR-223 catapult"
      lede="Cycle 1 adapted the miR-21 catapult to miR-223 and checked the fold in RNAfold. Cycle 2 compared probe variants by fluorescence and carried the strongest design forward."
      current="/engineering"
      toc={TOC}
    >
      <Engineering />
    </WikiMdxShell>
  );
}
