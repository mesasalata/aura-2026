import type { Metadata } from "next";
import Content from "@/content/engagement/integrated-human-practices.mdx";
import { WikiMdxShell } from "@/components/site/wiki-mdx-shell";

export const metadata: Metadata = {
  title: "Integrated Human Practices",
  description: "How conversations with farmers, a veterinarian, mastitis and bioelectronics experts, and Reatch changed AURA.",
};

const TOC = [
  { id: "overview", label: "Overview" },
  { id: "farmers", label: "Farmers" },
  { id: "baumert", label: "Amandine Baumert" },
  { id: "romano", label: "Alicia Romano" },
  { id: "nakatsuka", label: "Nako Nakatsuka" },
  { id: "meyer", label: "Pitt Meyer" },
  { id: "reatch", label: "Reatch" },
  { id: "references", label: "References" },
];

export default function Page() {
  return (
    <WikiMdxShell
      kicker="Engagement · Integrated HP"
      accent="coral"
      title="How Human Practices changed AURA"
      lede="What each conversation changed: our target farms, the inline design, future detection targets, and how we tested the probe."
      current="/integrated-human-practices"
      toc={TOC}
    >
      <Content />
    </WikiMdxShell>
  );
}
