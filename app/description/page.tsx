import type { Metadata } from "next";
import { PageHero } from "@/components/site/page-hero";
import { WikiLayout, WikiSection } from "@/components/site/wiki-layout";
import { Callout } from "@/components/ui/callout";
import { BiosensorDiagram } from "@/components/viz/biosensor-diagram";
import { ReferenceList } from "@/components/ui/reference-list";
import { REFERENCES } from "@/lib/content";
import { sceneFor } from "@/lib/art";

export const metadata: Metadata = {
  title: "Description",
  description:
    "AURA is an inline FET biosensor for bta-miR-223 in milk - a flag for subclinical bacterial mastitis, not a veterinary diagnosis.",
};

const TOC = [
  { id: "abstract", label: "What AURA is" },
  { id: "mirna", label: "Why miR-223" },
  { id: "fet", label: "The FET catapult" },
  { id: "electrodes", label: "Reference electrodes" },
  { id: "model", label: "How it decides" },
  { id: "parlour", label: "In the parlour" },
  { id: "process", label: "Design process" },
  { id: "principles", label: "Design principles" },
  { id: "references", label: "References" },
];

const PRINCIPLES = [
  [
    "Farm tool first",
    "It has to sit in the milking line, cost less than the loss it prevents, and return a readout anyone can act on before the tank is mixed.",
  ],
  [
    "Earlier, and more specific",
    "miR-223 rises with bacterial inflammation before the udder looks wrong - so a hit can be earlier and more specific than a generic cell count.",
  ],
  [
    "A flag, not a verdict",
    "One noisy spike is not a diagnosis. Consecutive high scores mark the cow for a closer look, not blanket antibiotics.",
  ],
  [
    "Inline, low upkeep",
    "A siphoned sample over a FET surface, built into the parlour machine - minimal expertise, no extra trip to the lab.",
  ],
];

export default function DescriptionPage() {
  return (
    <>
      <PageHero
        kicker="Project · Description"
        accent="signal"
        scene={sceneFor("/description")}
        name="Description"
        title="An inline FET that listens for miR-223"
        lede="AURA is an easy-to-use diagnostic-support tool for subclinical bacterial mastitis: a field-effect transistor in the milking line that flags bta-miR-223 before the udder looks wrong."
      />
      <WikiLayout toc={TOC} current="/description">
        <WikiSection id="abstract" title="What AURA is" kicker="01">
          <p>
            AURA is an easy-to-use diagnostic-support tool for subclinical bacterial mastitis: it
            flags bta-miR-223 in the milking line so farmers can look closer and send samples for
            confirmatory testing - not a veterinary diagnosis. Used that way, it can help farmers
            care for their animals with more targeted therapy, fewer blanket antibiotics, and lower
            cost. That in turn should help cattle welfare, breed fewer resistant bacteria, and spare
            some veterinary bills.
          </p>
          <p>
            Our tool is an <strong>inline biosensor</strong> which uses FET (field-effect
            transistor) biotechnology to detect the up-regulation of miRNA specific to subclinical
            mastitis. It is a flag for follow-up - not a replacement for veterinary diagnosis, and
            not a claim that we have clinically validated the system.
          </p>
          <Callout variant="note" title="How to read this page">
            <p>
              Where wet-lab results are still pending, we mark them explicitly rather than implying
              outcomes. This page describes intent, design, and rationale.
            </p>
          </Callout>
        </WikiSection>

        <WikiSection id="mirna" title="Why miR-223" kicker="02">
          <p>
            The miRNA <strong>bta-miR-223</strong> (miR-223) is used to control inflammation and
            swelling due to bacterial infections. In cows with subclinical mastitis this miRNA
            exists in milk samples and can indicate bacterial subclinical mastitis before any
            physiological changes occur.
          </p>
          <p>
            Detection of miR-223 will help farmers not only to detect cases earlier but also to
            differentiate bacterial from other causes of mastitis. Consequently treatments can be
            better targeted to the root problem, helping prevent the overuse of antibiotics and
            reducing the need for costly veterinarian consults.
          </p>
        </WikiSection>

        <WikiSection id="fet" title="The FET catapult" kicker="03">
          <p>
            The FET surface would have a <strong>DNA catapult</strong> with a complementary region
            to the miRNA target strand (an invasion region), allowing it to associate and change
            form in its presence. Upon association with the catapult, the negative charges of the
            miRNA backbone will repel the invasion-region stem from the complementary DNA stem and
            cause it to open.
          </p>
          <p>
            As the invasion region moves away from the biosensor surface, the local electrical field
            changes, and the FET detects this as a change in electrical current between the source
            and the drain. By relying on electrical-field changes the device can be more specific
            and identify when the target miRNA has exceeded relative concentration limits.
          </p>
          <div className="not-prose my-6">
            <BiosensorDiagram />
          </div>
          <Callout variant="safety" title="Scope and claims">
            <p>
              AURA is diagnostic-support. It could support earlier decision-making and point toward
              confirmatory testing. It does not diagnose, cure, or eliminate the need for
              antibiotics or veterinary care.
            </p>
          </Callout>
        </WikiSection>

        <WikiSection id="electrodes" title="Reference electrodes" kicker="04">
          <p>
            Reference electrodes can be used to determine the ionic concentration and electrochemical
            activity of each milk sample and calibrate the analysis of the local electrical field.
            These electrodes would be placed before the sampling chamber and register the ionic
            activity, helping to offset the effects of highly ionic conditions on the biosensor
            surface and reduce the probability of false results.
          </p>
        </WikiSection>

        <WikiSection id="model" title="How the model decides, and how the farmer hears" kicker="05">
          <p>
            After each reading, the FET current is compared with a baseline built from that same
            sample’s reference electrodes - milk’s salt and electrochemical noise, measured just
            upstream of the chamber. A small on-farm model turns the residual into a miR-223 load
            score for that cow and that milking.
          </p>
          <p>
            One noisy spike is not a verdict: if the score stays above a threshold across consecutive
            sessions, the parlour computer marks the animal and sends a quiet alert to the farmer’s
            phone or the parlour display. The message is a flag, not a diagnosis - look at this cow,
            consider confirmatory testing, skip blanket treatment of the herd.
          </p>
        </WikiSection>

        <WikiSection id="parlour" title="In the parlour" kicker="06">
          <p>
            During each milking session a small sample of the collected milk will be siphoned to a
            smaller sampling chamber where the fluid will pass over the biosensor surface. This
            monitoring is consistent - each cow, many times a day - so a rise in miR-223 can be
            flagged before the udder looks wrong, and the cow marked for confirmatory testing rather
            than treated as a diagnosis.
          </p>
          <p>
            The sensor is designed to integrate into milking machines during construction and needs
            little upkeep or specialist expertise. The same design - a siphoned sample over a FET
            surface - could be retargeted to other biomarkers as flags for follow-up, not as
            standalone diagnoses.
          </p>
        </WikiSection>

        <WikiSection id="process" title="Overview of the design process" kicker="07">
          <p>
            We treated this as a farm tool first, a circuit second. Conversations with farmers and
            vets (see Human Practices) set the constraints: it has to sit in the milking line, cost
            less than the loss it prevents, and return a readout anyone can act on before the tank
            is mixed. That ruled out culture and PCR as the everyday test, and pointed us at an
            inline siphon instead of another trip to the lab.
          </p>
          <p>
            On the biology side we chose miR-223 because it rises with bacterial inflammation before
            the udder looks wrong, so a hit can be earlier <em>and</em> more specific than a generic
            inflammation count. Engineering cycles then asked how to read that molecule without a
            fluorescent workbench: a DNA catapult on an FET surface, current between source and
            drain as the output, reference electrodes when ionic milk proved noisy.
          </p>
          <p>
            Human Practices kept pushing the last mile - a cow-level flag to the farmer, not a
            courtroom diagnosis - and those loops are written up on Engineering and Integrated Human
            Practices.
          </p>
        </WikiSection>

        <WikiSection id="principles" title="Design principles" kicker="08">
          <div className="not-prose grid gap-4 sm:grid-cols-2">
            {PRINCIPLES.map(([title, body]) => (
              <div key={title} className="rounded-2xl border border-ink/10 bg-milk/60 p-5">
                <div className="flex items-center gap-2">
                  <span className="booklet-mark" aria-hidden />
                  <p className="font-medium text-ink">{title}</p>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-ink-70">{body}</p>
              </div>
            ))}
          </div>
        </WikiSection>

        <WikiSection id="references" title="References" kicker="09">
          <ReferenceList references={REFERENCES.slice(0, 6)} />
        </WikiSection>
      </WikiLayout>
    </>
  );
}
