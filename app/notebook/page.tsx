import type { Metadata } from "next";
import Content from "@/content/wet-lab/notebook.mdx";
import { WikiMdxShell } from "@/components/site/wiki-mdx-shell";

export const metadata: Metadata = {
  title: "Notebook",
  description: "Dated project notes from AURA's season, from defining the problem to consolidating the project direction.",
};

const TOC = [
  { id: "overview", label: "Overview" },
  { id: "april", label: "April" },
  { id: "may", label: "May" },
  { id: "june", label: "June" },
  { id: "july", label: "July" },
  { id: "august", label: "August" },
  { id: "september", label: "September" },
  { id: "october", label: "October" },
  { id: "reading", label: "Reading" },
]

export default function Page() {
  return (
    <WikiMdxShell
      kicker="Wet Lab · Notebook"
      accent="bio"
      title="Project notes"
      lede="Key dates in AURA's development, from April to October."
      current="/notebook"
      toc={TOC}
    >
      <Content />
    </WikiMdxShell>
  );
}
