# 09 — Towns that disappear from the map between two counts

## Source of the task
`DATA_COLLECTION_PIPELINE.md`, lines 856–860 (status update 2026-09-22):

> (1) the map draws a town only where a row with a positive population covers the year, and numeric rows are chained only to the immediately following row, so a town with sparse census points blinks out between them — Milan is absent 1933–1944, 431 towns blink and 78 of them peaked above 5,000 ... Both are converter/design choices that need a decision, not a quick fix.

## What the task is
In `helpers.js` (around lines 765–805), a row is active only from its `year_start` to its `year_end`. A point fact (`year_start == year_end`) is drawn in that single year. Since the 2026-09-17 fix, new rows default to point facts, and the sub-agent method writes them that way. So the effect has grown. My rough count today: **6,714 of the 18,704 towns that have a count** have at least one year after 1800, between their first and last count, with no row drawn. **348** of them peaked at 5,000 or more. Examples include Warsaw, Paris, Kyiv, Odesa, Berlin, Vilnius, Haifa and Beersheba.

Some of these gaps are real: a community that ended and was later re-founded. The map cannot tell those apart from simple lack of data.

## Recommendation
**Fix it in the display, not in the data. Bridge short gaps, never across a documented break, and show the bridge as an estimate.**
1. In `helpers.js`, when a town has no active row in year *y*, take the nearest numeric rows before (A) and after (B). Interpolate between them, but only if all of the following hold:
   - the gap B.year_start − A.year_end is at most a set limit (start with **30 years**);
   - no row between them has population **0** (documented absence);
   - for Europe and North Africa, the gap does not span **1939–1945**. A bridge across the Holocaust is exactly the error that has had to be removed by hand several times.
2. Draw bridged years in the "estimate" style that already exists (amber, `getConfidenceColor`). In the popup, add: "Interpolated between <A> and <B>, not a source."
3. Leave `kehilot.csv` unchanged. The data stays a list of sourced facts, and the rule can be tuned without rewriting rows.

## Why
- Changing the data (chaining every point into a ramp) is what created the false ramps and subset chains documented in `DATA_ERRORS_REPORT.md`. Doing it in the display keeps the CSV honest.
- A city that vanishes from the map for twenty years tells visitors the community was gone, which is false. A clearly marked estimate is less misleading than absence.
- The 0-row and 1939–1945 guards keep the two cases where a bridge would be wrong: a documented end, and the Holocaust.
- The 30-year limit is a judgement call: one generation, and about the interval between two censuses with one missed. Larger gaps stay visible as gaps.

## Basis
`helpers.js` logic and my own count over `kehilot.csv`. The count treats every year with no active numeric row as a gap, and it may include some genuine absences. The recommendation is my own design judgement.
