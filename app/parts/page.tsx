import type { Metadata } from "next";
import Content from "@/content/wet-lab/parts.mdx";
import { WikiMdxShell } from "@/components/site/wiki-mdx-shell";

export const metadata: Metadata = {
  title: "Parts",
  description: "AURA's seven registry parts: four miR-223 catapult probes and three strand-displacement reset strands, plus the other oligonucleotides we used.",
};

const TOC = [
  { id: "overview", label: "Overview" },
  { id: "probes", label: "Probe parts" },
  { id: "reset", label: "Reset parts" },
  { id: "oligos", label: "Other oligos" },
]

export default function Page() {
  return (
    <WikiMdxShell
      kicker="Wet Lab · Parts"
      accent="butter"
      title="Registry parts & oligonucleotides"
      lede="Sequences, modifications and results for the seven DNA parts we submit."
      current="/parts"
      toc={TOC}
    >
      <Content />
    </WikiMdxShell>
  );
}
