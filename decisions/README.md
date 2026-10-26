# Open decisions for the owner

The repository's documents leave a number of questions for the owner to decide. Some are marked "for the owner to decide", "open owner decision", "needs a human call" or "need a decision". Others are open items that are a choice rather than plain work. Each file below gives the source of the task, the current data, a recommendation, the reasons, and its sources. Where a recommendation rests on my own knowledge rather than a cited source, the file says so.

Written 2026-10-26 against `kehilot.csv` as of commit `95719fb`.

| # | Decision | Where it comes from | Recommendation in one line |
|---|---|---|---|
| [01](01_source_detail_links_display.md) | Show the moved `[Source detail]`, `[Also reported by]` and `Further sources` links to visitors? | `DATA_COLLECTION_PIPELINE.md` l. 1403 | Yes, as a separate "More sources" line in the popup |
| [02](02_berlin_2013_2014_conflict.md) | Berlin: ZWST 10,214 (2013) against the 12,000 rows | `DELLAPERGOLA_REFERENCE.md` §9 | Drop the 2014 row, make the 2015 row a low point, add 2013 |
| [03](03_hamburg_conflict.md) | Hamburg: ZWST against 3,500 and 2,445 | `DELLAPERGOLA_REFERENCE.md` §9 | Probably no real conflict; shorten the long rows, add 2013 |
| [04](04_london_2011_census.md) | London 2011: 150,329 or 148,602? | `DELLAPERGOLA_REFERENCE.md` §9 | Keep 150,329: it is the ONS-corrected figure |
| [05](05_bremen_2023.md) | Bremen 2023: 739 or 729? | `DELLAPERGOLA_REFERENCE.md` §9 | No change: different year-ends of the same register |
| [06](06_dellapergola_migration_events.md) | Add the three proposed migration events? | `DELLAPERGOLA_REFERENCE.md` §M.10 | Already covered by events added in `e2beaaa`; close |
| [07](07_romanian_cities_iasi_bacau_galati.md) | Iași / Bacău / Galați wartime rows | `DATA_COLLECTION_PIPELINE.md` l. 295–303, 334, 709 | Replace Iași's 1899–2006 row with Pinkas points; Bacău and Galați are fine |
| [08](08_birobidzhan_plan_target.md) | Birobidzhan settlement-plan-target row | `DATA_COLLECTION_PIPELINE.md` l. 304–307, 710 | Blank both JPost numbers (a plan and an enlistment count) |
| [09](09_towns_blinking_between_counts.md) | Towns disappear between sparse counts | `DATA_COLLECTION_PIPELINE.md` l. 856–860 | Bridge gaps of 30 years or less in the display, marked as estimates, never across 1939–45 or a 0 row |
| [10](10_presence_marker_ramps.md) | Ramps from a presence marker to a large count | `DATA_COLLECTION_PIPELINE.md` l. 859–860 | Never chain convention markers; fix subset rows |
| [11](11_conflicting_1897_census_figures.md) | Orynin / Dzyarechyn / Vidzy 1897 figures disagree | `DATA_COLLECTION_PIPELINE.md` l. 1305–1306 | Census or ЕЭБЕ table high, others low; check Vidzy |
| [12](12_metro_vs_suburb_overlap.md) | Metro markers overlapping suburb markers | `DATA_COLLECTION_PIPELINE.md` l. 1377 | A marker is the municipality; metro counts go to Notes |
| [13](13_unsupported_year_established.md) | ~900 uncited early "Year Established" values | `DATA_COLLECTION_PIPELINE.md` l. 1062, 1293, 1382 | Cap at the first row unless the year is cited; keep the old value in `process_notes` |
| [14](14_extraction_model_choice.md) | Gemini Historian model: Pro or 3.8 Flash | `DATA_COLLECTION_PIPELINE.md` l. 715–807 | Keep Pro; Flash only for a small-town batch before 2026-12-31 |
| [15](15_old_backup_files.md) | 956 backup files, ~40 GB (on the owner's machine) | `DATA_COLLECTION_PIPELINE.md` l. 1385, 1405 | Delete those older than the last commit; stop syncing them |
| [16](16_citation_lost_rows.md) | Rows with "(citation lost)" sources | `DATA_COLLECTION_PIPELINE.md` l. 537–541, 556 | Worth doing: now 238 rows, including Białystok's 1897–1940 series |

Suggested order, by effect on what visitors see: 07, 08, 02, 03, 10, 09, 16, 12, 01, 13. Items 04, 05 and 06 need no data change, only closing; 14 and 15 do not touch the site.

## Open items found already resolved (no file)
- **Bogdanovka geocoded to the wrong place** (pipeline doc l. 308–310): the marker was deleted on 2026-09-20 (l. 686), and no rows remain.
- **Country-label typos** (`Polamd`, `Czech`, `Slovakia ` etc., l. 337–341): none left in `kehilot.csv`.
- **`Poland/Lviv` duplicate pin** (l. 862): Lviv is now one marker under Ukraine.
- **EmailJS "TODO: Replace with your ... key"** comments in `helpers.js` (around lines 2238 and 2277): the real public key, service and template IDs are already set, so the comments are stale and can be deleted. This is not a decision.

## Not included
Plain backlog work that the docs list as "still open" without a choice in it is not covered here. That includes the ~700 unresolved gazetteer names, the 94 towns without numbers, the pages blocked to agents, and the ~40 Israeli settlements without CBS records. The fixes in `DATA_ERRORS_REPORT.md` are also not repeated here, except where a decision above touches them.
