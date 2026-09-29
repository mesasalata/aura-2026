import { TeamCard } from "@/components/site/team-card";
import { TEAM_MEMBERS } from "@/lib/content";

const TRACKS = ["Wet Lab", "Dry Lab", "Engagement", "Design"] as const;

/** People directory - grouped by track, not an article grid. */
export function TeamRoster() {
  return (
    <div className="space-y-14">
      {TRACKS.map((track) => {
        const people = TEAM_MEMBERS.filter((m) => m.track === track);
        if (!people.length) return null;
        return (
          <section key={track}>
            <p className="kicker text-pink-deep">{track}</p>
            <div className="mt-5 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {people.map((m) => (
                <TeamCard key={m.name} member={m} />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
