import type { Metadata } from "next";
import Content from "@/content/wet-lab/protocols.mdx";
import { WikiMdxShell } from "@/components/site/wiki-mdx-shell";

export const metadata: Metadata = {
  title: "Protocols",
  description: "Bench methods for AURA's cell-free fluorescence assays: oligo preparation, refolding and QC, binding, 39 °C testing and two reset strategies.",
};

const TOC = [
  { id: "overview", label: "Overview" },
  { id: "preparation", label: "Preparation" },
  { id: "refold", label: "Refold and QC" },
  { id: "assay", label: "Binding assay" },
  { id: "temperature", label: "39 °C assay" },
  { id: "rnaseh", label: "RNase H reset" },
  { id: "strand-displacement", label: "Strand displacement" },
]

export default function Page() {
  return (
    <WikiMdxShell
      kicker="Wet Lab · Protocols"
      accent="signal"
      title="Reproducible methods"
      lede="The steps behind our fluorescence experiments, with the controls and plate-reader settings we used."
      current="/protocols"
      toc={TOC}
    >
      <Content />
    </WikiMdxShell>
  );
}
