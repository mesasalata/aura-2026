import type { Metadata } from "next";
import Content from "@/content/engagement/human-practices.mdx";
import { WikiMdxShell } from "@/components/site/wiki-mdx-shell";

export const metadata: Metadata = {
  title: "Human Practices",
  description: "Adapting AURA based on stakeholder feedback and responsible design: dairy farmers, a veterinarian, mastitis and bioelectronics experts, and Reatch.",
};

const TOC = [
  { id: "overview", label: "Overview" },
  { id: "farmers", label: "Farmers" },
  { id: "baumert", label: "Amandine Baumert" },
  { id: "romano", label: "Alicia Romano" },
  { id: "nakatsuka", label: "Nako Nakatsuka" },
  { id: "meyer", label: "Pitt Meyer" },
  { id: "reatch", label: "Reatch" },
  { id: "responsible", label: "Responsible implementation" },
  { id: "references", label: "References" },
];

export default function Page() {
  return (
    <WikiMdxShell
      kicker="Engagement · Human Practices"
      accent="pink"
      title="Adapting AURA based on stakeholder feedback and responsible design"
      lede="Human Practices helped us test AURA against real-world needs and change the project when our assumptions were wrong."
      current="/human-practices"
      toc={TOC}
    >
      <Content />
    </WikiMdxShell>
  );
}
