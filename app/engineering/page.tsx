import type { Metadata } from "next";
import Engineering from "@/content/project/engineering.mdx";
import { WikiMdxShell } from "@/components/site/wiki-mdx-shell";

export const metadata: Metadata = {
  title: "Engineering",
  description:
    "Five Design–Build–Test–Learn cycles: miR-223, DNA catapult, FET current, inline siphon, and a flag not a verdict.",
};

const TOC = [
  { id: "overview", label: "Overview" },
  { id: "cycle-1", label: "Cycle 1 - Target" },
  { id: "cycle-2", label: "Cycle 2 - Catapult" },
  { id: "cycle-3", label: "Cycle 3 - FET" },
  { id: "cycle-4", label: "Cycle 4 - Siphon" },
  { id: "cycle-5", label: "Cycle 5 - Flag" },
  { id: "dbtl", label: "DBTL wheel" },
  { id: "pipeline", label: "Pipeline" },
];

export default function EngineeringPage() {
  return (
    <WikiMdxShell
      kicker="Project · Engineering"
      accent="butter"
      title="Five cycles from parlour constraint to flag"
      lede="Farm tool first: sit in the milking line, read miR-223 on a FET, send a quiet alert - not a courtroom diagnosis."
      current="/engineering"
      toc={TOC}
    >
      <Engineering />
    </WikiMdxShell>
  );
}
