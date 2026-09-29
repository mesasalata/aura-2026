/**
 * One-to-one copy from `assets/keep/project-description.md`.
 * Kept as a data module so the test homepage stays editable without drift.
 */

export const HOME_TEST_SECTIONS = [
  {
    id: "what-aura-is",
    title: "What AURA is",
    kicker: "01 · Project",
    accent: "pink" as const,
    paragraphs: [
      "AURA focuses on creating an easy-to-use diagnostic solution to help diagnose subclinical mastitis in the dairy industry, helping farmers better care for their animals and use fewer antibiotics and more targeted therapies at lower cost. This in turn should help improve dairy cattle welfare, breed fewer resistant bacteria, and help farmers avoid veterinary costs. Our tool is an inline biosensor which uses FET (field-effect transistor) biotechnology to detect the up-regulation of miRNA specific to subclinical mastitis.",
      "The miRNA bta-miR-223 (miR-223) is used to control inflammation and swelling due to bacterial infections. In cows with subclinical mastitis this miRNA exists in milk samples and can indicate bacterial subclinical mastitis before any physiological changes occur. Detection of miR-223 will help farmers not only to detect cases earlier but also to differentiate bacterial from other causes of mastitis. Consequently treatments can be better targeted to the root problem, helping prevent the overuse of antibiotics and reducing the need for costly veterinarian consults.",
      "The FET surface would have a DNA catapult with a complementary region to the miRNA target strand (an invasion region), allowing it to associate and change form in its presence. Upon association with the catapult, the negative charges of the miRNA backbone will repel the invasion-region stem from the complementary DNA stem and cause it to open. As the invasion region moves away from the biosensor surface, the local electrical field changes, and the FET detects this as a change in electrical current between the source and the drain. By relying on electrical-field changes the device can be more specific and identify when the target miRNA has exceeded relative concentration limits.",
      "Reference electrodes can be used to determine the ionic concentration and electrochemical activity of each milk sample and calibrate the analysis of the local electrical field. These electrodes would be placed before the sampling chamber and register the ionic activity, helping to offset the effects of highly ionic conditions on the biosensor surface and reduce the probability of false results.",
    ],
  },
  {
    id: "how-it-decides",
    title: "How the model decides, and how the farmer hears",
    kicker: "02 · Signal",
    accent: "signal" as const,
    paragraphs: [
      "After each reading, the FET current is compared with a baseline built from that same sample’s reference electrodes - milk’s salt and electrochemical noise, measured just upstream of the chamber. A small on-farm model turns the residual into a miR-223 load score for that cow and that milking. One noisy spike is not a verdict: if the score stays above a threshold across consecutive sessions, the parlour computer marks the animal and sends a quiet alert to the farmer’s phone or the parlour display. The message is a flag, not a diagnosis - look at this cow, consider confirmatory testing, skip blanket treatment of the herd.",
    ],
  },
  {
    id: "in-the-parlour",
    title: "In the parlour",
    kicker: "03 · Hardware",
    accent: "butter" as const,
    paragraphs: [
      "During each milking session a small sample of the collected milk will be siphoned to a smaller sampling chamber where the fluid will pass over the biosensor surface. This monitoring will be consistent, checking each cow many times a day, allowing for the earliest diagnosis of mastitis. The diagnostic tool is designed to integrate into milking machines during construction and requires minimal upkeep costs and expertise. The design concepts behind this device can be applied to many different bacterial strands or other biomarkers to help create more specific and sensitive, cheaper diagnostics for a variety of illnesses.",
    ],
  },
  {
    id: "design-process",
    title: "Overview of the design process",
    kicker: "04 · Engineering",
    accent: "coral" as const,
    paragraphs: [
      "We treated this as a farm tool first, a circuit second. Conversations with farmers and vets (see Human Practices) set the constraints: it has to sit in the milking line, cost less than the loss it prevents, and return a readout anyone can act on before the tank is mixed. That ruled out culture and PCR as the everyday test, and pointed us at an inline siphon instead of another trip to the lab.",
      "On the biology side we chose miR-223 because it rises with bacterial inflammation before the udder looks wrong, so a hit can be earlier and more specific than a generic inflammation count. Engineering cycles then asked how to read that molecule without a fluorescent workbench: a DNA catapult on an FET surface, current between source and drain as the output, reference electrodes when ionic milk proved noisy. Human Practices kept pushing the last mile - a cow-level flag to the farmer, not a courtroom diagnosis - and those loops are written up on Engineering and Integrated Human Practices.",
    ],
    /** Preserve the MD emphasis: earlier *and* more specific. */
    emphasizeAndInSecond: true,
  },
] as const;
