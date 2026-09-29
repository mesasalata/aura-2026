import type { Metadata } from "next";
import Content from "@/content/engagement/human-practices.mdx";
import { WikiMdxShell } from "@/components/site/wiki-mdx-shell";

export const metadata: Metadata = {
  title: "Human Practices",
  description: "Stakeholders who shaped AURA - farmers, vets, processors, regulators, and consumers.",
};

const TOC = [
  { id: "overview", label: "Overview" },
  { id: "approach", label: "Approach" },
  { id: "map", label: "Stakeholder map" },
  { id: "themes", label: "Themes" },
  { id: "outreach", label: "Outreach" },
];

export default function Page() {
  return (
    <WikiMdxShell
      kicker="Engagement · Human Practices"
      accent="pink"
      title="Built with farms, not just labs"
      lede="How stakeholder interviews changed scope, readout, claims, and containment."
      current="/human-practices"
      toc={TOC}
    >
      <Content />
    </WikiMdxShell>
  );
}
