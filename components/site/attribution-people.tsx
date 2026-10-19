import { Badge } from "@/components/ui/badge";
import { ATTRIBUTION_ENTRIES, type AttributionEntry, type AttributionPerson } from "@/lib/content";
import { asset } from "@/lib/utils";

function italicize(text: string) {
  const parts = text.split(/(\*[^*]+\*)/g);
  return parts.map((part, i) =>
    part.startsWith("*") && part.endsWith("*") ? (
      <em key={i}>{part.slice(1, -1)}</em>
    ) : (
      part
    ),
  );
}

function Portrait({ person }: { person: AttributionPerson }) {
  if (person.photo) {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- static export + basePath via asset()
      <img
        src={asset(person.photo)}
        alt={person.name}
        draggable={false}
        className="h-20 w-20 rounded-full object-cover object-[center_18%] ring-2 ring-ink/10"
      />
    );
  }
  return (
    <span
      className="flex h-20 w-20 items-center justify-center rounded-full bg-pink/15 font-display text-xl text-pink-deep ring-2 ring-ink/10"
      aria-hidden
    >
      {person.initials}
    </span>
  );
}

function AttributionCard({ entry }: { entry: AttributionEntry }) {
  const names = entry.people.map((p) => p.name).join(" and ");
  return (
    <article className="hand border-ink/15 bg-milk px-5 py-6 sm:px-6">
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          {entry.people.map((person) => (
            <Portrait key={person.name} person={person} />
          ))}
        </div>
        <div className="min-w-0">
          <h3 className="font-display text-xl text-ink">{names}</h3>
          <p className="mt-1 flex flex-wrap gap-1.5">
            <Badge accent="ink">{entry.kind}</Badge>
            <Badge accent="pink">{entry.role}</Badge>
          </p>
        </div>
      </div>
      <ol className="mt-5 space-y-3 pl-0">
        {entry.contributions.map((item, i) => (
          <li key={item.title} className="flex gap-3 text-sm leading-relaxed">
            <span className="mt-0.5 font-display text-base text-pink-deep">{i + 1}.</span>
            <p>
              <strong className="font-medium text-ink">{item.title}:</strong>{" "}
              <span className="text-ink-70">{italicize(item.body)}</span>
            </p>
          </li>
        ))}
      </ol>
    </article>
  );
}

export function AttributionList({ group }: { group: AttributionEntry["group"] }) {
  const entries = ATTRIBUTION_ENTRIES.filter((e) => e.group === group);
  return (
    <div className="not-prose my-2 grid gap-4">
      {entries.map((entry) => (
        <AttributionCard key={entry.id} entry={entry} />
      ))}
    </div>
  );
}
