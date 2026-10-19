import type { Metadata } from "next";
import Results from "@/content/project/results.mdx";
import { WikiMdxShell } from "@/components/site/wiki-mdx-shell";

export const metadata: Metadata = {
  title: "Results",
  description:
    "AURA's fluorescence proof of concept: probe selection, miR-223 RNA detection at 39 °C, and sensor reset experiments.",
};

const TOC = [
  { id: "overview", label: "Overview" },
  { id: "computational", label: "Computational design" },
  { id: "selection", label: "Probe selection" },
  { id: "temperature", label: "RNA at 39 °C" },
  { id: "reset", label: "RNase H reset" },
  { id: "beads", label: "Strand displacement" },
  { id: "summary", label: "Summary" },
]

export default function ResultsPage() {
  return (
    <WikiMdxShell
      kicker="Project · Results"
      accent="bio"
      title="A fluorescence proof of concept"
      lede="What our catapult probes did in the fluorescence assay, and what still needs a FET, raw milk and built hardware to show."
      current="/results"
      toc={TOC}
    >
      <Results />
    </WikiMdxShell>
  );
}
