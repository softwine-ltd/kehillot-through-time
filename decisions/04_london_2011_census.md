# 04 — London 2011: 150,329 (map) or 148,602 (DellaPergola)?

## Source of the task
`DELLAPERGOLA_REFERENCE.md`, section 9, "Numbers not added because they differ from existing rows (for the owner to decide)":

> London 2011: the map has 150,329 (JPR census table), DellaPergola's Table 13 has 148.6 thousand (2001 and 2021 agree: 149,789 / 145,466 vs 149.8 / 145.5).

## Current data (`kehilot.csv`)
```
L156921: United Kingdom | London | 2001–2010 | 149789 → 150329 | high | JPR | "Jewish population of the London region recorded in the 2001 census."
L156928: United Kingdom | London | 2011–2020 | 150329 → 145466 | high | JPR | "... recorded in the 2011 census."
L156932: United Kingdom | London | 2021–2022 | 145466 → (blank) | high | JPR | "... recorded in the 2021 census ..."
```

## Recommendation
**Keep 150,329. Do not add 148,602.** Add one sentence to the Note of L156928: "Revised figure: ONS corrected a processing error in 2015 that had counted 1,727 Jews in Camden, Islington and Tower Hamlets as non-respondents. The first published figure was 148,602."

## Why
- The two numbers are the same census before and after a correction: **148,602 + 1,727 = 150,329** exactly.
  - 148,602 is the first published 2011 count for the London region. The GLA briefing and Vision of Britain give it, and DellaPergola's 148.6 thousand matches.
  - In March 2015 the *Jewish Chronicle* reported that ONS had found a data-processing error in Camden, Islington and Tower Hamlets. That error had classed 1,727 Jewish respondents as non-respondents. The JPR table the map uses carries the corrected figure.
- So the map's figure is the better one, and there is no real conflict. DellaPergola rounded the unrevised figure.
- The arithmetic match is my own check. The two sources below give the parts.

## Sources
- GLA Intelligence Unit, 2011 Census Snapshot: Religion (148.6 thousand Jews in London) — https://data.london.gov.uk/download/intelligence-unit-briefings-2012/daca65f1-68eb-4322-9d36-70e486788e5a/CIS2012-08%2520Religion.pdf
- Vision of Britain, London Government Region, religious faiths (148,602 in 2011) — https://test.visionofbritain.org.uk/unit/10097836/cube/REL2001
- *Jewish Chronicle*, "Census revision means there's 1,727 more of us" (5 March 2015) — https://www.thejc.com/news/census-revision-means-theres-1-727-more-of-us-f1bltrdz
