import type { Metadata } from "next";
import Description from "@/content/project/description.mdx";
import { WikiMdxShell } from "@/components/site/wiki-mdx-shell";

export const metadata: Metadata = {
  title: "Description",
  description:
    "AURA is an inline FET biosensor for bta-miR-223 in milk - a flag for subclinical bacterial mastitis, not a veterinary diagnosis.",
};

const TOC = [
  { id: "overview", label: "What AURA is" },
  { id: "mirna", label: "bta-miR223" },
  { id: "fet", label: "The FET surface" },
  { id: "electrodes", label: "Reference electrodes" },
  { id: "model", label: "From the reading to the farmer" },
  { id: "parlour", label: "In the milking line" },
  { id: "process", label: "Design process" },
];

export default function DescriptionPage() {
  return (
    <WikiMdxShell
      kicker="Project · Description"
      accent="signal"
      title="An inline FET that listens for miR-223"
      lede="AURA is an easy-to-use diagnostic-support tool for subclinical bacterial mastitis: a field-effect transistor in the milking line that flags bta-miR-223 before the udder looks wrong."
      current="/description"
      toc={TOC}
    >
      <Description />
    </WikiMdxShell>
  );
}
