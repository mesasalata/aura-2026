/**
 * Homepage section copy, taken from the human-written body of
 * `content/project/description.mdx`. The two INSERT blocks on that page
 * (model, design process) are not filled in here.
 */

export const HOME_SECTIONS = [
  {
    id: "what-aura-is",
    kicker: "01",
    title: "What AURA is",
    accent: "pink" as const,
    body: "AURA focuses on creating an easy to use diagnostic solution to help diagnosis subclinical mastitis in the dairy industry, helping farmers to better care for their animals and use less antibiotics and more targeted therapies at lower costs. This in turn should help improve dairy cattle welfare, breed less resistant bacterias, and help farmers to avoid veterinary costs. Our tool is an inline biosensor which uses FET (Field-Effect Transistor) biotechnology to detect the up-regulation of miRNA specific to subclinical mastitis.",
  },
  {
    id: "mirna",
    kicker: "02",
    title: "bta-miR223",
    accent: "pink" as const,
    body: "The miRNA bta-miR223 (mR223) is used to control inflation and swelling due to bacterial infections. In cows with subclinical mastitis this miRNA exists in milk samples and can be used to indicate bacterial subclinical mastitis before any physiological changes occur. Detection of mR223 will help farmers not only to detect cases earlier but also to differentiate bacterial from other causes of mastitis. Consequently treatments can be better targeted to the root problem and help prevent the over use of antibiotics and reduce the need for costly veterinarian consults.",
  },
  {
    id: "fet",
    kicker: "03",
    title: "The FET surface",
    accent: "signal" as const,
    body: "The FET surface would have a DNA catapult which has a complimentary region to the miRNA target strand, invasion region, allowing it to associate and change form in its presence. Upon association with the catapult, the negative charges of the miRNA backbone will repel the invasion region stem from the complementary DNA stem and cause it to open. As a result, of the invasion region moving away from the biosensor surface, there is a change in the local electrical field and the FET detects this as a change in electrical current between the source and the drain. By relying on electrical field changes the device can be more specific and identify when the target miRNA has exceeded relative concentration limits.",
  },
  {
    id: "electrodes",
    kicker: "04",
    title: "Reference electrodes",
    accent: "bio" as const,
    body: "Reference electrodes can be used to determine the ionic concentration and electrochemical activity of each milk sample and calibrate the analysis of the local electrical field. These electrodes would be placed before the sampling chamber and register the ionic activity, helping to offset the effects of highly ionic conditions on the biosensor surface and reduce the probability of false results.",
  },
  {
    id: "parlour",
    kicker: "05",
    title: "In the milking line",
    accent: "butter" as const,
    body: "During each milking session a small sample of the collected milk will be siphoned to a smaller sampling chamber where the fluid will pass over the biosensor surface. This monitoring will be consistent, checking each cow many times a day, allowing for the earliest diagnosis of mastitis. More so, this diagnostic tool is easily integrated into milking machines during construction and requires minimal upkeep costs and expertise. The design concepts behind this device can be applied to many different bacterial strands or other biomarkers to help create more specific and sensitive, cheaper, diagnostics for a variety of illnesses.",
  },
] as const;
