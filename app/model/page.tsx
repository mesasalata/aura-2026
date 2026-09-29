import type { Metadata } from "next";
import Content from "@/content/dry-lab/model.mdx";
import { WikiMdxShell } from "@/components/site/wiki-mdx-shell";

export const metadata: Metadata = {
  title: "Model",
  description: "On-farm miR-223 load scores: FET residual against the sample’s own reference electrodes, flagged only when it stays high.",
};

const TOC = [
  { id: "overview", label: "Overview" },
  { id: "baseline", label: "Baseline" },
  { id: "score", label: "Load score" },
  { id: "thresholds", label: "Thresholds" },
  { id: "limits", label: "Limits" },
];

export default function Page() {
  return (
    <WikiMdxShell
      kicker="Dry Lab · Model"
      accent="signal"
      title="A score for this cow, this milking"
      lede="Subtract the sample’s own salt, score miR-223 load, flag only when it stays high - a note, not a verdict."
      current="/model"
      toc={TOC}
    >
      <Content />
    </WikiMdxShell>
  );
}
