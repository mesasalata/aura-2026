import type { Metadata } from "next";
import Content from "@/content/wet-lab/experiments.mdx";
import { WikiMdxShell } from "@/components/site/wiki-mdx-shell";

export const metadata: Metadata = {
  title: "Experiments",
  description:
    "FAM/BHQ proof-of-concept methods and results for catapult probes against a DNA analogue of miR-223.",
};

const TOC = [
  { id: "methodology", label: "Methodology" },
  { id: "procedure", label: "Procedure" },
  { id: "refold", label: "Refold and QC" },
  { id: "assay", label: "Assay setup" },
  { id: "design", label: "Oligo design" },
  { id: "preparation", label: "Preparation" },
  { id: "timecourse", label: "Time course" },
  { id: "comparison", label: "Probe comparison" },
  { id: "dbtl", label: "DBTL" },
  { id: "limitations", label: "Limitations" },
  { id: "conclusion", label: "Conclusion" },
  { id: "next", label: "Next steps" },
];

export default function Page() {
  return (
    <WikiMdxShell
      kicker="Wet Lab · Experiments"
      accent="bio"
      title="Which catapult probes bind"
      lede="A FAM/BHQ proof of concept: probe candidates against a DNA analogue of miR-223, and which design opened the clearest."
      current="/experiments"
      toc={TOC}
    >
      <Content />
    </WikiMdxShell>
  );
}
