import type { Metadata } from "next";
import Content from "@/content/wet-lab/experiments.mdx";
import { WikiMdxShell } from "@/components/site/wiki-mdx-shell";

export const metadata: Metadata = {
  title: "Experiments",
  description:
    "Two FAM/BHQ experiments: screening catapult probes against a DNA analogue of miR-223, then miR-223 RNA at 39 °C and two reset strategies.",
};

const TOC = [
  { id: "methodology", label: "Exp 1: Methodology" },
  { id: "procedure", label: "Procedure" },
  { id: "refold", label: "Refold and QC" },
  { id: "assay", label: "Assay setup" },
  { id: "design", label: "Oligo design" },
  { id: "preparation", label: "Preparation" },
  { id: "timecourse", label: "Time course" },
  { id: "comparison", label: "Probe comparison" },
  { id: "limitations", label: "Limitations" },
  { id: "conclusion", label: "Conclusion" },
  { id: "exp2-methodology", label: "Exp 2: Methodology" },
  { id: "exp2-protocol", label: "Protocol" },
  { id: "exp2-temperature", label: "Binding at 39 °C" },
  { id: "exp2-rnaseh", label: "RNase H reset" },
  { id: "exp2-beads", label: "Bead strand displacement" },
  { id: "exp2-conclusion", label: "Overall conclusion" },
]

export default function Page() {
  return (
    <WikiMdxShell
      kicker="Wet Lab · Experiments"
      accent="bio"
      title="Which probes bind, and can they reset"
      lede="Experiment 1 screened catapult probe candidates against a DNA analogue of miR-223. Experiment 2 tested the probes with miR-223 RNA at 39 °C and tried two ways to reset them."
      current="/experiments"
      toc={TOC}
    >
      <Content />
    </WikiMdxShell>
  );
}
