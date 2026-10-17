import type { Metadata } from "next";
import Content from "@/content/engagement/education.mdx";
import { WikiMdxShell } from "@/components/site/wiki-mdx-shell";

export const metadata: Metadata = {
  title: "Education",
  description:
    "Synthetic Biology Club, a learning website, a card game, and workshops for students from about age 8 through 17.",
};

const TOC = [
  { id: "overview", label: "What we taught" },
  { id: "club", label: "SynBio club" },
  { id: "website", label: "Website" },
  { id: "isl", label: "ISL workshop" },
  { id: "game", label: "Card game" },
  { id: "bake-sale", label: "Bake sale" },
  { id: "juniors", label: "Juniors" },
  { id: "bookfete", label: "Bookfête" },
  { id: "workshop", label: "Junior workshop" },
];

export default function Page() {
  return (
    <WikiMdxShell
      kicker="Engagement · Education"
      accent="butter"
      title="Synthetic biology, taught in the open"
      lede="A weekly club at Le Rosey, a public learning site, a card game, and workshops for students from about age 8 through 17."
      current="/education"
      toc={TOC}
    >
      <Content />
    </WikiMdxShell>
  );
}
