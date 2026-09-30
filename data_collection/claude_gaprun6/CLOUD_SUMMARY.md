# Cloud gap run 6: summary

12 towns from `queue.csv` (Belarus, Ukraine, Hungary, Poland, Austria, Colombia), collected on 2026-09-30 by one
subagent per town following `BRIEF.md`, in 2 batches. All 12 are `done`; none failed and no usage or credit limit
was hit. Every `city_data_*.csv` parses with the exact header and 9 columns on every row, every row has a numeric
Year of Data, no row is dated before Year Established, and every Source URL is listed as fetched OK in the town's
`sources_*.txt`. The review pass below was done by me after the queue was empty.

"Numbers" = rows with a Population value (including 0). "Years" = span of Year of Data. Figures are after the
review fixes.

## Checks I ran on the agents' work
- **Column check caught one error.** Lipno had two rows with 10 fields, because a Source URL contains a comma
  (`.../95048,Zaglada-...html`). I quoted that URL in the two rows (no data changed).
- **Figure check.** I re-fetched every cited page and looked for each Population figure on it (plain numbers
  only, not `~N` family estimates or zeros). All were found except: Kamyenyets 1925 (3,200, derived by the agent;
  moved to Notes), Bácsalmás 1880 (189, one of two rows; the other source has it) and Cartagena 2024 (200). The
  Bácsalmás and Cartagena pages block a plain fetch, so I treat them as unverified by me, not wrong.
- Judenburg's agent reported five zero rows; the file has three (1496, 1939, 1945), all positively documented
  (expulsion from Styria, "judenrein", "not a single Jew can be found").

## Main caveats
- **Very thin towns:** Bojanów has one row (a single undated figure, year assumed as 1939, and Year Established
  left blank because no first presence was documented), Maciejowice 3 rows and 1 number (8 of 13 fetches failed;
  several figures seen only in search snippets), Cali 0 numbers, Cartagena 5 rows. These need a second pass.
- **Search depth:** Bácsalmás ran only 3 searches (the brief asks for at least 6); the other 11 ran 6–9.
- **Blank Year Established:** Bojanów's column is empty, which may break a merge that expects a number.

## Review fixes applied (6 rows tagged `[Review fix: ...]`, 2 rows deleted)
Numbers moved out of Population are kept in Notes. `grep "Review fix"` lists every edit.

Conventions applied (as in earlier runs, with one change: this brief says a source that gives only a range is
entered as its midpoint in Population with a note, so range midpoints were **kept**):
- **Population = Jews of the town only.** Kahal-level figures, membership counts and district/county totals go to
  Notes; a documented prewar town population stays.
- **Derived figures** (calculated from a percentage by the collector) go to Notes.
- **Uncertain dates:** a figure whose date is uncertain and inconsistent with its neighbours goes to Notes.
- **Repeats:** where a second source repeats a dated census figure under another year, the repeat is deleted.
- **Population 0 only where absence is positively documented.**

Rows changed:
- Moved to Notes: Cali 2026 (~3,500 "members", undated, may include the wider area); Kamyenyets 1766 (886,
  kahal), 1925 (3,200, derived from 80% of 4,000) and 1878 (5,900, date uncertain and inconsistent with 1,517 in
  1830 and 2,722 in 1897); Bácsalmás 1854 (120 community members).
- Population 0 removed: Voranava 1946 (the agent's inference from "entirely destroyed").
- Deleted: Kamyenyets 1900 (2,722) and Voranava 1900 (1,432), which repeat the 1897 census figures.

## Still open (left as is)
- Conflicting figures kept as separate rows: Vetka 1847 (984 vs 1,770); Lipno 1808 (707 vs 777); Voranava 1865 and
  1884 (both 333); Bácsalmás 1880 (189, two sources).
- Maciejowice 1939 (~1,500, "over 1,500", year assumed): the agent found it high beside a 1921 figure of 739 that
  it saw only in a search snippet; it may include surrounding areas.
- Year Established values that are not firm dates: Voranava 1650 (mid-17th century, no row before 1715),
  Kamyenyets 1465 ("passing through or residing temporarily"; the first firm document is 1525), Vinkivtsi 1550
  (a midpoint from a settlement claim; the earliest count is 1784), Maciejowice 1825 (cemetery midpoint),
  Cali 1926 (first attempt to found a cemetery), Cartagena 1610 (an Inquisition tribunal trying crypto-Jews).
- Bácsalmás 1854 (120) was moved, but its 1890 row (186, "52 families 186 souls") stays.
- Sulejów 1940 (1,150) and 1942 (1,577) are wartime counts from Pinkas; the ghetto period may include
  outsiders.

## Per town
| Town | Rows | Numbers | Years | Check before merging |
|---|---|---|---|---|
| Voranava, Belarus | 10 | 7 | 1715–1946 | Year Established 1650 is a mid-17th c. claim; 1890 (~1,200) is an approximate year; 1921 (980) seen only in a snippet. |
| Kamyenyets, Belarus | 14 | 5 | 1465–1944 | See moved rows; 1700 (200) is a scholarly estimate from head-tax records; 1921 excludes 375 Jews in the surrounding gmina. |
| Vetka, Belarus | 17 | 8 | 1798–1950 | 1847 conflict (984 / 1,770); 1908 peak 7,336; 1950 minyan year approximate. |
| Vinkivtsi, Ukraine | 15 | 6 | 1550–1945 | Year Established is a midpoint; 1897 (1,768) from two sources; Zinkov's 3,719 correctly excluded. |
| Bácsalmás, Hungary | 19 | 9 | 1750–1956 | 3 searches; census series from a locally-parsed study (Pinkas data); 1944 ghetto in Notes. |
| Lipno, Poland | 15 | 8 | 1677–1939 | Lipno in Dobrzyń Land; 1939 = 0 ("Judenrein by end of December 1939"); county 3,036 in Notes. |
| Sulejów, Poland | 15 | 8 | 1791–1942 | Clean Pinkas series 1808–1921; wartime counts (see above). |
| Maciejowice, Poland | 3 | 1 | 1825–1942 | Thin; one assumed-year figure; 614 (1860), 739 (1921), ~750 (1942) not in the CSV (snippets). |
| Judenburg, Austria | 12 | 5 | 1290–2019 | Three documented zeros (1496, 1939, 1945); only 2 positive counts (1880: 92; 1938: 42). |
| Cartagena, Colombia | 5 | 3 | 1610–2024 | Two 2018 rows (~50, two sources); 2024 (~200) unverifiable by me; country totals in Notes. |
| Cali, Colombia | 6 | 0 | 1926–2026 | No city count found; the one figure (~3,500 members) is in Notes. |
| Bojanów, Poland | 1 | 1 | 1939–1939 | Podkarpackie town; single undated figure (122), Year Established blank; Bojanowo (Greater Poland) figures excluded as a different town. |
