# 10 — Ramps that start from a presence marker (3 or 20) and climb to a large count

## Source of the task
`DATA_COLLECTION_PIPELINE.md`, lines 859–860 (status update 2026-09-22):

> (2) 278 rows go from a presence marker (≤ 25) to a number ≥ 20× larger over more than 10 years, which the app interpolates as smooth growth (New York 23 in 1654 → 40,000 in 1859). Both are converter/design choices that need a decision, not a quick fix.

## Current data
The same test today (start ≤ 25, end ≥ 20 × start, span > 10 years, not an estimate row) finds **576 rows**. They fall into three kinds:

| Kind | Example (`kehilot.csv` line) | What the map draws |
|---|---|---|
| Convention marker (3 or 20, "presence marker, population 20 by convention") chained to the first count | L71556 Israel, Modi'in, 1986–2002, 20 → 48,775 · L74641 Tel Aviv 1909–1922, 20 → 15,065 · L71903 Netanya 1929–1947, 20 → 11,600 | Steady growth from 20 that never happened that way |
| A real but subset count chained to a total | L140020 San Francisco 1891–1904, 12 → 17,000 ("Home for aged ... opened to 12 residents") · L146676 Drohobych 1813–1868, 23 → 8,055 ("6 Karaite families") · L93046 Koło 1898–1920, 20 → 5,159 ("Members in the Maccabees association") | A collapse to near zero before the next count |
| A real small early count with a long interval | L101590 Zduńska Wola 1806–1899, 20 → 7,257 ("Four Jewish families") | A straight line over 93 years |

## Recommendation
1. **Convention markers: never chain.** Set `pop_end` blank and `year_end = year_start` on every row whose start value is a convention presence marker (3 or 20 with the "by convention" note). Make the converters (`batch_convert_to_kehilot.py`, the merge scripts, `fix_boundary.py`) skip them when chaining. Their own year will show a hollow ring, and the series will start at the first real count.
2. **Subset counts: fix the row, not the rule.** These are errors of the CHAIN_SUBSET kind in `DATA_ERRORS_REPORT.md`. Move the number to the Notes, and leave the population blank.
3. **Real small counts:** keep the start value as a point fact, and let task 09's display bridge (≤ 30 years) cover the gap. Do not keep a stored straight line over 50–100+ years.
4. Add a check to `validate_kehilot.py`: warn when a row with start ≤ 25 has end ≥ 20 × start over more than 10 years.

## Why
- A presence marker means "Jews documented here, no count". Using it as the first value of a growth line turns a placeholder into a number. That violates the project's own convention that blank (shown as a ring) means presence without a count.
- For new localities such as Modi'in or Tel Aviv, the ramp invents a growth curve. CBS has real counts for those places, and for Tel Aviv the 1922 Mandate census exists.
- The subset kind is a data error, and it is also listed in the error report. A display rule would hide it rather than fix it.

## Basis
The project's documents and my count over `kehilot.csv`. The fix is my own recommendation.
