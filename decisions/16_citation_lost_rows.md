# 16 — Rows whose source is "(citation lost - legacy data entry error)"

## Source of the task
`DATA_COLLECTION_PIPELINE.md`:
- Lines 537–541: "109 rows across 44 Polish/Belarusian towns carry an isolated `(citation lost - legacy data entry error)` source on *one* row within an otherwise well-sourced multi-row timeline ... much lower priority than a whole-town placeholder, not investigated further."
- Line 556, item 3: "The 109-row '(citation lost)' remnants above, if worth the time."

## Current data
Today the phrase is in **238 rows in 98 towns** (Poland 104 rows, Germany 91, France 32, Italy 9). **171 of them carry a population number.** In 6 towns every row is citation-lost: Ailly-sur-Somme, Bizanos, Bourbon-l'Archambault, Bourg-Saint-Andéol (France), Bagni di Lucca (Italy), Friedland (Poland). Some carry large numbers that shape the map:
```
L88242: Poland | Białystok | 1897–1899 | 26880 → 41600  | (citation lost ...)
L88243: Poland | Białystok | 1900–1912 | 41600 → 60000  | (citation lost ...)
L88245: Poland | Białystok | 1913–1920 | 60000 → 39602  | (citation lost ...)
L88248: Poland | Białystok | 1939–1940 | 60000 → 2000   | (citation lost ...)
L90139: Poland | Działoszyce | 1939 | 10000 → 3 · L90158: 1942 | 10000 → 20
```

## Recommendation
**It is worth the time for the 171 rows with numbers. Run one pass with three outcomes:**
1. **Same number sourced elsewhere** in the same town (another row with the same year ±2 and a value within 5%) → delete the citation-lost row.
2. **Number findable** → run the usual sub-agent research for that one fact. Replace the source if found, for example Białystok's 1897 census figure.
3. **Not findable** → set `probability = low`, mark the Notes "source unknown", and make the row a point fact. Long ramps like 1939–1940 60,000 → 2,000 are the wartime-ramp error class.

For the 67 rows without numbers, and for the 6 towns whose every row is citation-lost: delete the rows unless a quick search confirms the fact. A marker with no source at all should not be on the map.

## Why
- The doc estimated 109 rows, "almost certainly a bridging row". The count has more than doubled to 238. Some of these are not bridges: Białystok has a whole 1897–1940 series on lost citations, and these rows decide what the map shows for one of the largest Polish communities.
- The project's standard since 2026-09-17 is that every number has a fetchable source. These rows are the remaining exceptions.
- Outcome 1 is free (a script), and outcome 3 costs nothing but honesty. Only outcome 2 costs research, and it can be limited to the rows with large numbers.

## Basis
The project's documents and my count over `kehilot.csv`. No outside source.
