# 08 — Birobidzhan: the settlement-plan-target row

## Source of the task
`DATA_COLLECTION_PIPELINE.md`:
- Lines 304–307: "a row's `pop_start` looks like it may be chained from an aspirational settlement-plan target ('10,000 Jewish families over five years') rather than an achieved population ... flagged, not fixed, because the source material on this one is too thin to be confident either way."
- Line 710, item 5: "Human calls left open: ... the Birobidzhan settlement-plan-target row."

## Current data (`kehilot.csv`)
```
L106450: Russia | Birobidzhan | 1928–1939 | 50000 → 12000 | high | jpost.com/diaspora/article-755164 | "The initial plan for the area was to settle 10,000 Jewish families over five years (Estimate based on families)."
L106452: 1932 | 5125   · L106453: 1934 | 7200 · L106454: 1939 | 10415   (Russian Jewish Encyclopedia)
L106455: Russia | Birobidzhan | 1940–2009 | 12000 → 1700 | high | jpost.com (same) | "Figure represents the number of local Jews who enlisted to fight the Nazis; there were 18 collective Jewish farms in the town."
L106456–L106460: 1959 10,435 · 1970 9,713 · 1979 8,934 · 1989 8,038 · 1999 ~9,000   (Russian Jewish Encyclopedia)
L106461: Russia | Birobidzhan | 2010–2024 | 1700 → (blank) | medium | jpost.com | "Estimated number of Jews remaining."
```
On the map, Birobidzhan shows **50,000 Jews in 1928**. That year it was the railway station Tikhonkaya, and the encyclopedia row L106451 says the town had 830 Jews in 1931. The 1940–2009 row draws a slow decline from 12,000 that overrides the sourced counts for 1960–2009 wherever it is higher.

## Recommendation
**The source is not thin. Its own words settle it: neither row is a population.**
1. **L106450:** blank the population. Keep the row as a 1928 point event: "Plan to settle 10,000 Jewish families within five years (a target, not achieved)." Set `probability = high` for the event.
2. **L106455:** blank the population and make it a 1941 point. Move "about 12,000 local Jews enlisted" to the Notes. An enlistment count is a subset, and the project's rule sends subsets to the Notes.
3. Keep the Russian Jewish Encyclopedia series as the population. Keep L106461 (about 1,700 in the 2010s) at `medium`.
4. Optional check: the encyclopedia's 10,415 for 1939 is described as "31.6% of the city". Wikipedia gives the city's 1939 total as 29,648, which would make the share about 35%. Either the share or the base differs. The figure is still plausible, but it was not confirmed by a second source.

## Why
- "The initial plan ... was to settle 10,000 Jewish families" describes an intention. The ×5 conversion turned it into 50,000 people. The Nisko Plan case was the same kind of error, and it was deleted.
- "The number of local Jews who enlisted" is by definition a subset of the population.
- With both rows gone, the remaining series is consistent: 5,125 (1932), 7,200 (1934), 10,415 (1939), then about 10,000 until 1959, a slow decline to 1989, and about 1,700 in the 2010s after emigration.
- *That Birobidzhan was the Tikhonkaya station before its 1931 founding as a town is in row L106451. The ~20% Jewish share in 1939 (World Jewish Congress) and the general history of the region (JAO founded 1934) are background that I checked only by a quick search.*

## Sources
- *Jerusalem Post*, article 755164 (the source of both rows) — https://www.jpost.com/diaspora/article-755164
- Russian Jewish Encyclopedia, "БИРОБИДЖАН" (link in rows L106451–L106460).
- Wikipedia, Birobidzhan (1939 city total 29,648) — https://en.wikipedia.org/wiki/Birobidzhan
- Swarthmore College, *Stalin's Forgotten Zion*, panel 16 (18,000 Jews in the whole region, 1939) — https://archive.swarthmore.edu/stalins-forgotten-zion/html/panel16.html
