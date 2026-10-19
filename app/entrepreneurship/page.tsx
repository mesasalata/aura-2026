import type { Metadata } from "next";
import Content from "@/content/engagement/entrepreneurship.mdx";
import { WikiMdxShell } from "@/components/site/wiki-mdx-shell";

export const metadata: Metadata = {
  title: "Entrepreneurship",
  description:
    "How a sensor that detects miR-223 in milk to help identify mastitis could become a useful product for dairy farmers.",
};

const TOC = [
  { id: "overview", label: "Overview" },
  { id: "problem", label: "Problem & solution" },
  { id: "customers", label: "Customers" },
  { id: "existing-solutions", label: "Existing solutions" },
  { id: "business-model", label: "Business model" },
  { id: "development", label: "Development" },
  { id: "impact", label: "Long-term impact" },
];

export default function Page() {
  return (
    <WikiMdxShell
      kicker="Engagement · Entrepreneurship"
      accent="signal"
      title="From research to a product for farmers"
      lede="How our miR-223 milk sensor could become a useful product for dairy farmers, and what would need to be shown first."
      current="/entrepreneurship"
      toc={TOC}
    >
      <Content />
    </WikiMdxShell>
  );
}
