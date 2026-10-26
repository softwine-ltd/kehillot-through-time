# 02 — Berlin: DellaPergola/ZWST 2013 (10,214) against the map's 12,000 rows

## Source of the task
`DELLAPERGOLA_REFERENCE.md`, section 9, "Numbers not added because they differ from existing rows (for the owner to decide)", first bullet:

> Berlin 2013, 10,214 (ZWST) vs the map's 2014 row of 12,000 "registered members" (kehilalinks) and the row 2015-2024 12,000 (Hebrew Wikipedia: 12,000 Jews of whom about 8,200 community members). DellaPergola's 2023 figure (8,286) agrees with the "about 8,200 community members", so the 12,000 rows are a broader definition; the 2014 "12,000 registered members" is the contradicting one.

## Current data (`kehilot.csv`)
```
L29003: Germany | Berlin | 2010–2010 | 10599 → 10599 | high | zwst.org ... Mitgliederstatistik 2010
L29004: Germany | Berlin | 2014–2014 | 12000 → 12000 | high | kehilalinks.jewishgen.org/berlin/Ryker.html | "... with 12,000 registered members and eight synagogues"
L29005: Germany | Berlin | 2015–2024 | 12000 → (blank) | high | hamichlol.org.il/יהדות_ברלין | "12000 Jews in 2015 of whom about 8200 community members ..."
L29006: Germany | Berlin | 2020–2020 | 8702 → 8702 | high | ZWST 2020
L29007: Germany | Berlin | 2023–2023 | 8258 → 8258 | high | ZWST 2023
L29009: Germany | Berlin | 2025–2025 | 7992 → 7992 | high | ZWST 2025
```
Row L29005 has a blank `pop_end`, so it holds 12,000 for every year from 2015 to 2024. The map draws the highest value among rows covering a year. So Berlin shows **12,000 in 2020 and 2023**, not the ZWST counts of 8,702 and 8,258 in those same years.

## Recommendation
1. **Delete L29004 or move it to Notes.** It is "12,000 registered members" in 2014 from a genealogy page. The official register gives 10,599 (2010) and 10,214 (2013, ZWST via DellaPergola). It contradicts the primary count of the same thing.
2. **Make L29005 a point fact for 2015** (`year_end = 2015`) and set `probability = low`. Its own note says that only about 8,200 of the 12,000 were community members. It is a broader, unofficial estimate. As a point fact it stays visible without overriding nine years of ZWST counts.
3. **Add the 2013 count of 10,214** as a row. The best source is the ZWST Mitgliederstatistik 2013 itself, if it can be fetched, since DellaPergola's Table 15 cites ZWST. Otherwise use DellaPergola, AJYB 2023, Table 15, as was done for 2003.
4. While editing Berlin, look at the gap with no rows from 1991 to 2002, listed in `DATA_ERRORS_REPORT.md` §5. The ZWST yearly reports from the 1990s cover it.

## Why
- The project rule (`DATA_COLLECTION_PIPELINE.md` §4, "Data conventions"): conflicting estimates stay as separate rows, with the best-sourced one high and the others low. Here the best-sourced series is the ZWST register, which is consistent from year to year. The 12,000 figures are the outliers.
- The display rule means an open-ended high row hides every lower sourced count under it. Shortening it is what makes the sourced series visible.
- The broader figure (12,000 Jews, including non-members, plus a separately cited ~25,000 Israelis) is real information. Keeping it as one low-confidence point, with the Israelis in the Notes, preserves it without distorting the series.

## Sources
- DellaPergola, "World Jewish Population, 2023", AJYB 2023, Table 15 — https://link.springer.com/book/10.1007/978-3-031-67478-5
- ZWST Mitgliederstatistik (yearly reports linked from the existing rows), for example 2023: https://zwst.org/sites/default/files/2024-06/ZWST-Mitgliederstatistik-2023-RZ-web.pdf (row L29007; table "Wachstum der Gemeinden - Vergleich 1989/2023", PDF p. 17).
- My judgement that the ZWST series is "best-sourced" rests on what ZWST is (the central welfare body that collects member counts from every community). That is general knowledge, not taken from these files.
