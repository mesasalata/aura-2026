import type { Metadata } from "next";
import Content from "@/content/team/attributions.mdx";
import { WikiMdxShell } from "@/components/site/wiki-mdx-shell";

export const metadata: Metadata = {
  title: "Attributions",
  description: "Who did what on AURA: team members, PIs and instructor, institutions, external advisors and collaborators, and AI tools.",
};

const TOC = [
  { id: "overview", label: "Overview" },
  { id: "team", label: "Team members" },
  { id: "pis", label: "PIs and instructor" },
  { id: "institutions", label: "Institutions" },
  { id: "advisors", label: "External advisors" },
  { id: "collaborators", label: "Collaborators" },
  { id: "ai", label: "AI tools" },
]

export default function Page() {
  return (
    <WikiMdxShell
      kicker="Team · Attributions"
      accent="pink"
      title="Who did what"
      lede="Team members, PIs, partners, external advisors and the AI tools we used, and what each contributed."
      current="/attributions"
      toc={TOC}
    >
      <Content />
    </WikiMdxShell>
  );
}
