import type { MDXComponents } from "mdx/types";
import { WikiFigure, WikiSection } from "@/components/site/wiki-layout";
import { Callout, Placeholder } from "@/components/ui/callout";
import { ScienceExplainer } from "@/components/ui/science-explainer";
import { BiosensorDiagram } from "@/components/viz/biosensor-diagram";
import { DbtlWheel } from "@/components/viz/dbtl-wheel";
import { FarmToLabPipeline } from "@/components/viz/farm-to-lab";
import { ReferenceList } from "@/components/ui/reference-list";
import { REFERENCES } from "@/lib/content";
import {
  GlossaryGrid,
  NotebookBlock,
  SafetyBlock,
  StakeholderMapBlock,
  StripDemo,
  TeamGrid,
} from "@/components/mdx/blocks";
import { AttributionList } from "@/components/site/attribution-people";
import { MemberGrid, MemberProfile } from "@/components/site/member-profile";
import { DataTable } from "@/components/ui/data-table";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h2: ({ children }) => (
      <div className="mb-6">
        <h2 className="font-display text-ink display-2">{children}</h2>
        <span className="rule-pop" aria-hidden />
      </div>
    ),
    h3: ({ children }) => (
      <h3 className="mb-3 mt-2 font-display text-xl text-pink-deep">{children}</h3>
    ),
    p: ({ children }) => (
      <p className="text-ink/80 leading-relaxed text-pretty">{children}</p>
    ),
    ul: ({ children }) => (
      <ul className="list-disc space-y-2 pl-5 text-ink/80 marker:text-pink">{children}</ul>
    ),
    ol: ({ children }) => (
      <ol className="list-decimal space-y-2 pl-5 text-ink/80 marker:font-extrabold marker:text-pink-deep">{children}</ol>
    ),
    li: ({ children }) => <li className="leading-relaxed">{children}</li>,
    table: ({ children }) => (
      <div className="hand not-prose my-4 overflow-x-auto border-ink">
        <table className="w-full text-left text-sm">{children}</table>
      </div>
    ),
    thead: ({ children }) => <thead className="border-b-[2.25px] border-ink bg-butter/55">{children}</thead>,
    tbody: ({ children }) => <tbody className="divide-y divide-ink/15">{children}</tbody>,
    tr: ({ children }) => <tr>{children}</tr>,
    th: ({ children }) => (
      <th className="px-4 py-3 font-extrabold text-ink">{children}</th>
    ),
    td: ({ children }) => (
      <td className="px-4 py-3 text-ink/80">{children}</td>
    ),
    strong: ({ children }) => <strong className="font-extrabold text-ink">{children}</strong>,
    a: ({ children, href }) => (
      <a
        href={href}
        className="font-semibold text-pink-deep underline decoration-pink/50 decoration-[3px] underline-offset-[3px] transition-colors hover:decoration-pink"
      >
        {children}
      </a>
    ),
    em: ({ children }) => <em className="text-ink">{children}</em>,
    Section: WikiSection,
    WikiFigure,
    Callout,
    Placeholder,
    ScienceExplainer,
    BiosensorDiagram,
    DbtlWheel,
    FarmToLabPipeline,
    ReferenceList,
    References: () => <ReferenceList references={REFERENCES} />,
    StakeholderMap: StakeholderMapBlock,
    NotebookTimeline: NotebookBlock,
    TeamGrid,
    AttributionList,
    MemberGrid,
    MemberProfile,
    DataTable,
    GlossaryGrid,
    SafetyBlock,
    StripDemo,
    ...components,
  };
}
