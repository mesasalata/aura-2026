import type { Metadata } from "next";
import Content from "@/content/engagement/integrated-human-practices.mdx";
import { WikiMdxShell } from "@/components/site/wiki-mdx-shell";

export const metadata: Metadata = {
  title: "Integrated Human Practices",
  description: "How stakeholder feedback was woven into AURA's engineering and safety decisions.",
};

const TOC = [
  { id: "overview", label: "Overview" },
  { id: "farmer", label: "Farmers" },
  { id: "vet", label: "Veterinarians" },
  { id: "processor", label: "Processors" },
  { id: "regulator", label: "Regulators" },
  { id: "consumer", label: "Consumers" },
  { id: "loop", label: "Feedback loop" },
];

export default function Page() {
  return (
    <WikiMdxShell
      kicker="Engagement · Integrated HP"
      accent="coral"
      title="Feedback woven into design"
      lede="Specific things we heard - and the specific design moves they caused."
      current="/integrated-human-practices"
      toc={TOC}
    >
      <Content />
    </WikiMdxShell>
  );
}
