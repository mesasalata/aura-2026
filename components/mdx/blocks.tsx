import { TeamCard } from "@/components/site/team-card";
import { NotebookTimeline } from "@/components/viz/notebook-timeline";
import { StakeholderMap } from "@/components/viz/stakeholder-map";
import { DiagnosticStrip } from "@/components/viz/diagnostic-strip";
import { GlossaryCard } from "@/components/ui/glossary-card";
import { SafetyChecklist } from "@/components/ui/safety-checklist";
import {
  GLOSSARY,
  NOTEBOOK_ENTRIES,
  SAFETY_COMMITMENTS,
  TEAM_MEMBERS,
} from "@/lib/content";

export function StakeholderMapBlock() {
  return (
    <div className="not-prose my-6">
      <StakeholderMap />
    </div>
  );
}

export function NotebookBlock() {
  return (
    <div className="not-prose my-6">
      <NotebookTimeline entries={NOTEBOOK_ENTRIES} />
    </div>
  );
}

export function TeamGrid() {
  return (
    <div className="not-prose my-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {TEAM_MEMBERS.map((m) => (
        <TeamCard key={m.name} member={m} />
      ))}
    </div>
  );
}

export function GlossaryGrid() {
  return (
    <div className="not-prose my-6 grid gap-4 sm:grid-cols-2">
      {GLOSSARY.map((t) => (
        <GlossaryCard key={t.term} term={t} />
      ))}
    </div>
  );
}

export function SafetyBlock() {
  return (
    <div className="not-prose my-6 grid gap-4 sm:grid-cols-2">
      {SAFETY_COMMITMENTS.map((s) => (
        <SafetyChecklist key={s.title} title={s.title} items={s.items} />
      ))}
    </div>
  );
}

export function StripDemo({ result = "positive" }: { result?: "positive" | "negative" }) {
  return (
    <div className="hand not-prose my-6 border-milk/20 bg-ink p-6">
      <DiagnosticStrip result={result} />
    </div>
  );
}
