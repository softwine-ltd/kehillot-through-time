# 13 — "Year Established" values that no text supports

## Source of the task
`DATA_COLLECTION_PIPELINE.md`:
- Line 1382: "`fix_yestab.py` caps it at each town's first documented row ... ~1,094 markers have an earlier Year Established that no text cites (`yestab_suspect.csv`), left unchanged."
- Line 1062: "Founding years still unsupported but untouched: Bovenden 1350, Bełżyce 1420, Gostynin 1450, Betschdorf 1507."
- Line 1293: "Still unsupported and left as the first data year: Betschdorf, Pontevedra, Berlanga de Duero, Sernancelhe."

## Current data
Today **924 of 21,939 markers** have a `year_estab` earlier than their first row. The most common values are round numbers: 1700 (44 markers), 1750 (38), 1850 (28), 1650 (27), 1600 (24), 1348 (23), 1800 (22), 1500 (13). Extreme examples: Vukovar "est 100" with its first row in 1835, Ruse "est 132" with its first row in 1810, and Nowy Sącz "est 0" with its first row in 1469. Some early values may rest on a tradition, which is why the check below looks for a citation before changing anything. Ifrane Anti-Atlas "est −500", from a local legend, is an example.

## Recommendation
**Cap them at the first documented row, the same rule that `fix_yestab.py` already applies to later values. Exception: keep a value where any row's Notes or source of that town cites it.**
1. Extend `yestab.py` to search the town's Notes and `process_notes` for the year (±5). If found, keep it. If not, set `year_estab` = first row's `year_start`.
2. Record the old value in `process_notes` (`[yestab capped: was 1700]`), so nothing is lost and a later source can restore it.
3. Treat the four 2026-10-17/18 cases (Betschdorf, Pontevedra, Berlanga de Duero, Sernancelhe) the same way. They already use their first data year, so they are done.

## Why
- The popup shows "Year Established" to visitors as a fact. An uncited round number (1700, 1750, 1348) is the same kind of placeholder the project removed elsewhere (the population-30 rows, the "established in the 19xxs" template).
- 1348 in particular is the Black Death list's year. It says a community was attacked then, not founded then, and it carries the legacy that was cleaned out in 2026-09-17.
- Capping at the first documented row loses no information, because the earlier value is kept in `process_notes`.

## Basis
The project's documents and my count over `kehilot.csv`. No outside source.
