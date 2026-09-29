import type { Metadata } from "next";
import Content from "@/content/team/attributions.mdx";
import { WikiMdxShell } from "@/components/site/wiki-mdx-shell";

export const metadata: Metadata = {
  title: "Attributions",
  description: "Who did what on AURA - team, advisors, institutions, and thanks.",
};

const TOC = [
  { id: "overview", label: "Overview" },
  { id: "team", label: "Team" },
  { id: "advisors", label: "Advisors" },
  { id: "institutions", label: "Institutions" },
  { id: "thanks", label: "Thanks" },
];

export default function Page() {
  return (
    <WikiMdxShell
      kicker="Team · Attributions"
      accent="pink"
      title="Who did what"
      lede="Credits for team contributions, advisors, funders, and everyone who helped."
      current="/attributions"
      toc={TOC}
    >
      <Content />
    </WikiMdxShell>
  );
}
