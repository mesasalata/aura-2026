import type { Metadata } from "next";
import Results from "@/content/project/results.mdx";
import { WikiMdxShell } from "@/components/site/wiki-mdx-shell";

export const metadata: Metadata = {
  title: "Results",
  description:
    "What AURA measured and observed - with explicit placeholders where wet-lab data is still pending.",
};

const TOC = [
  { id: "overview", label: "Overview" },
  { id: "constructs", label: "Constructs" },
  { id: "binding", label: "Binding assays" },
  { id: "circuit", label: "Circuit performance" },
  { id: "device", label: "Device prototypes" },
  { id: "comparison", label: "Reference comparison" },
  { id: "modelling", label: "Modelling" },
  { id: "summary", label: "Summary" },
  { id: "next", label: "Next steps" },
];

export default function ResultsPage() {
  return (
    <WikiMdxShell
      kicker="Project · Results"
      accent="bio"
      title="What we found - and what's still running"
      lede="Honest reporting of construct work, assay design, and prototype readouts. Pending data is marked, not implied."
      current="/results"
      toc={TOC}
    >
      <Results />
    </WikiMdxShell>
  );
}
