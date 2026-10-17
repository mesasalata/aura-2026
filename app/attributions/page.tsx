import type { Metadata } from "next";
import Content from "@/content/team/attributions.mdx";
import { WikiMdxShell } from "@/components/site/wiki-mdx-shell";

export const metadata: Metadata = {
  title: "Attributions",
  description: "External advisors and collaborators who shaped AURA.",
};

const TOC = [
  { id: "overview", label: "Overview" },
  { id: "advisors", label: "Advisors" },
  { id: "collaborators", label: "Collaborators" },
];

export default function Page() {
  return (
    <WikiMdxShell
      kicker="Team · Attributions"
      accent="pink"
      title="Who helped"
      lede="External advisors and collaborators and what they contributed."
      current="/attributions"
      toc={TOC}
    >
      <Content />
    </WikiMdxShell>
  );
}
