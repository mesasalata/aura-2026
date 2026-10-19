import type { Metadata } from "next";
import Content from "@/content/wet-lab/measurement.mdx";
import { WikiMdxShell } from "@/components/site/wiki-mdx-shell";

export const metadata: Metadata = {
  title: "Measurement",
  description: "How AURA used FAM/BHQ fluorescence, SNR and replicate statistics as a proxy for catapult probe opening and reset.",
};

const TOC = [
  { id: "overview", label: "Overview" },
  { id: "principle", label: "Principle" },
  { id: "quantities", label: "What we measured" },
  { id: "setup", label: "Setup" },
  { id: "snr", label: "SNR probe selection" },
  { id: "binding", label: "Binding at 39 °C" },
  { id: "controls", label: "Controls" },
  { id: "replicates", label: "Replicates" },
  { id: "analysis", label: "Data analysis" },
  { id: "rnaseh", label: "RNase H reduction" },
  { id: "redetection", label: "Re-detection" },
  { id: "validation", label: "Validation" },
  { id: "reproducibility", label: "Reproducibility" },
  { id: "protocol", label: "Protocol" },
  { id: "limitations", label: "Limitations" },
  { id: "beyond", label: "Beyond AURA" },
  { id: "conclusion", label: "Conclusion" },
]

export default function Page() {
  return (
    <WikiMdxShell
      kicker="Wet Lab · Measurement"
      accent="pink"
      title="Fluorescence as a proxy for probe opening"
      lede="Before testing an electrical readout, we needed a reliable way to measure whether our DNA catapult probe was behaving as intended."
      current="/measurement"
      toc={TOC}
    >
      <Content />
    </WikiMdxShell>
  );
}
