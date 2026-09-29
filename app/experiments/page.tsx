import type { Metadata } from "next";
import Content from "@/content/wet-lab/experiments.mdx";
import { WikiMdxShell } from "@/components/site/wiki-mdx-shell";

export const metadata: Metadata = {
  title: "Experiments",
  description: "Experimental plan and rationale for AURA bench work across five DBTL cycles.",
};

const TOC = [
  { id: "overview", label: "Overview" },
  { id: "goals", label: "Goals" },
  { id: "assays", label: "Assay pipeline" },
  { id: "controls", label: "Controls" },
  { id: "samples", label: "Samples" },
  { id: "timeline", label: "Timeline" },
];

export default function Page() {
  return (
    <WikiMdxShell
      kicker="Wet Lab · Experiments"
      accent="bio"
      title="What we're testing and why"
      lede="Assays mapped to engineering cycles - each experiment answers one question before the next design commit."
      current="/experiments"
      toc={TOC}
    >
      <Content />
    </WikiMdxShell>
  );
}
