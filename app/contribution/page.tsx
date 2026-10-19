import type { Metadata } from "next";
import Contribution from "@/content/project/contribution.mdx";
import { WikiMdxShell } from "@/components/site/wiki-mdx-shell";

export const metadata: Metadata = {
  title: "Contribution",
  description:
    "Registry parts, a fluorescence characterization workflow, reset experiments and software that AURA leaves for future iGEM teams.",
};

const TOC = [
  { id: "overview", label: "Overview" },
  { id: "probes", label: "miR-223 probes" },
  { id: "characterization", label: "Characterization" },
  { id: "rna", label: "RNA validation" },
  { id: "reset", label: "Reset and reuse" },
  { id: "software", label: "UdderNet" },
  { id: "future", label: "For future teams" },
]

export default function ContributionPage() {
  return (
    <WikiMdxShell
      kicker="Project · Contribution"
      accent="signal"
      title="Reusable parts, methods, and software for nucleic-acid biosensing"
      lede="Seven registry parts, a fluorescence workflow for comparing probes, two documented reset strategies, and open-source software."
      current="/contribution"
      toc={TOC}
    >
      <Contribution />
    </WikiMdxShell>
  );
}
