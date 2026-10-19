import type { Metadata } from "next";
import Content from "@/content/engagement/sustainability.mdx";
import { WikiMdxShell } from "@/components/site/wiki-mdx-shell";

export const metadata: Metadata = {
  title: "Sustainability",
  description: "How AURA relates to SDGs 2, 3, 9 and 12: earlier mastitis detection for healthier cows, more resilient farms, and more efficient dairy production.",
};

const TOC = [
  { id: "overview", label: "Overview" },
  { id: "sdg2", label: "SDG 2" },
  { id: "sdg3", label: "SDG 3" },
  { id: "sdg9", label: "SDG 9" },
  { id: "sdg12", label: "SDG 12" },
  { id: "bigger-picture", label: "Bigger picture" },
  { id: "references", label: "References" },
];

export default function Page() {
  return (
    <WikiMdxShell
      kicker="Engagement · Sustainability"
      accent="bio"
      title="Sustainable Development Goals"
      lede="Earlier mastitis detection for healthier cows, more resilient farms, and more efficient dairy production."
      current="/sustainability"
      toc={TOC}
    >
      <Content />
    </WikiMdxShell>
  );
}
