import { readFileSync } from "node:fs";
import path from "node:path";

/**
 * Completion line for a wiki article.
 *
 * Read from the Wiki pages tables in assets/keep/copy-provenance.md.
 * There is no second list: edit that manifest and this line updates.
 */

type Completion = "done" | "in-progress" | "todo";

type PageStatus = {
  completion: Completion;
  notes: string;
};

const COMPLETION_CLASS: Record<Completion, string> = {
  done: "text-bio",
  "in-progress": "text-butter",
  todo: "text-coral",
};

const COMPLETION_LABEL: Record<Completion, string> = {
  done: "Done",
  "in-progress": "In progress",
  todo: "To do",
};

function plain(cell: string): string {
  return cell
    .replace(/`/g, "")
    .replace(/\*\*/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function wikiStatuses(markdown: string): Map<string, PageStatus> {
  const section = markdown.split(/^## Wiki pages\s*$/m)[1]?.split(/^## /m)[0] ?? "";
  const statuses = new Map<string, PageStatus>();

  for (const line of section.split("\n")) {
    if (!line.startsWith("| `")) continue;
    const cells = line.split("|").slice(1, -1).map((cell) => cell.trim());
    const route = plain(cells[0] ?? "");
    const completion = plain(cells[3] ?? "");
    const notes = plain(cells[4] ?? "");
    if (!route.startsWith("/")) continue;
    if (completion !== "done" && completion !== "in-progress" && completion !== "todo") continue;
    statuses.set(route, { completion, notes });
  }

  return statuses;
}

function statusFor(route: string): PageStatus | undefined {
  const file = path.join(process.cwd(), "assets/keep/copy-provenance.md");
  return wikiStatuses(readFileSync(file, "utf8")).get(route);
}

export function CopyStatus({ route }: { route: string }) {
  const status = statusFor(route);
  if (!status) return null;

  const detail =
    status.completion === "done"
      ? " Every unique string on this page is team-written."
      : status.notes
        ? ` Incomplete: ${status.notes}`
        : "";

  return (
    <p className={`max-w-3xl text-sm leading-relaxed ${COMPLETION_CLASS[status.completion]}`}>
      <span className="font-semibold">{COMPLETION_LABEL[status.completion]}.</span>
      {detail}
    </p>
  );
}
