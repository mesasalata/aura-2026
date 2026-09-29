import type { Metadata } from "next";
import Content from "@/content/engagement/sustainability.mdx";
import { WikiMdxShell } from "@/components/site/wiki-mdx-shell";

export const metadata: Metadata = {
  title: "Sustainability",
  description: "Animal welfare, antimicrobial stewardship, environment, and SDG alignment for AURA.",
};

const TOC = [
  { id: "overview", label: "Overview" },
  { id: "welfare", label: "Welfare" },
  { id: "antibiotics", label: "Antibiotics" },
  { id: "environment", label: "Environment" },
  { id: "sdgs", label: "SDGs" },
  { id: "limits", label: "Limits" },
];

export default function Page() {
  return (
    <WikiMdxShell
      kicker="Engagement · Sustainability"
      accent="bio"
      title="Welfare, environment & the SDGs"
      lede="How AURA connects to animal health, farm resilience, and responsible antibiotic use - honestly scoped."
      current="/sustainability"
      toc={TOC}
    >
      <Content />
    </WikiMdxShell>
  );
}
