# Cloud gap run 4: summary

20 towns from `queue.csv` (US cities plus French, Swiss, Polish, Mexican, Canadian and Israeli towns), collected
on 2026-09-30 by one subagent per town following `BRIEF.md`, in 4 batches. All 20 are `done`; none failed and no
usage or credit limit was hit. Every `city_data_*.csv` parses with the exact header and 9 columns on every row,
every row has a numeric Year of Data, no row is dated before Year Established, and every Source URL is listed as
fetched OK in the town's `sources_*.txt` (Toledo's locally-read 1994 survey PDF was added to its log). The review
pass below was done by me after the queue was empty.

"Numbers" = rows with a Population value (including 0). "Years" = span of Year of Data. Figures are after the
review fixes.

## Main caveats
- **Thin searching.** The brief asks for 6–10 searches per town. Only Portland (7), San Jose, Nevers and
  Thornhill (6 each) reached it; the rest ran 3–5.
- **Few city-level series.** For US cities the American Jewish Year Book tables, Brandeis studies and JVL pages
  often failed to load, and most surviving figures are metro-area or state totals, which the rules keep out of
  Population. Result: **Las Vegas, Portland (Oregon), Nevers and Yehud-Monosson have no Population numbers at
  all**, and Sarcelles, San Jose, Orlando, Veracruz, Thornhill, Toledo and Boston have 1–3. Only Chełm,
  Włocławek, Louisville, Milwaukee, Newark and Oświęcim have a usable series. These towns need a second, deeper
  pass (or manual research) before their data is relied on.
- **Metro vs city is the main risk.** Several kept figures for Boston, Louisville, Milwaukee and Newark do not say
  whether they cover the city or the wider community (see per-town notes).

## Review fixes applied (9 rows tagged `[Review fix: ...]`, 1 row deleted)
Numbers moved out of Population are kept in Notes. `grep "Review fix"` lists every edit.

Conventions applied:
- **Population = Jews of the city/town only.** Metro-area, county, state, canton, department and kahal-district
  figures go to Notes; figures whose area is stated as unclear or unspecified go to Notes too.
- **Ghetto counts** go to Notes; a documented prewar or 1939/1941 town population stays in Population.
- **Upper bounds** ("somewhat less than N") go to Notes; lower bounds ("more than N") stay in Population.
- **Arrival or transit counts** (new arrivals, immigrants passing through) go to Notes.
- **Conflicting figures:** where a source's figure clashes with a census-table figure and matches another year's
  figure, it goes to Notes; otherwise both are kept as separate rows (as the brief asks).
- **`~N` is reserved for families ×5 estimates**; "about N" is written as N.
- **Population 0 only where absence is positively documented** (kept: Geneva 1490 expulsion, Włocławek 1969).
- **Year Established = earliest documented Jewish presence;** converso-only rows before it were deleted.
- **Derived figures** (Thornhill, where the agent summed the two published parts of the town) were kept because
  both parts come from one table and are listed in Notes.

Rows changed:
- Moved to Notes: Milwaukee 2001 (21,000, area not specified, equals the 1996 metro figure) and 1856 (200, unit
  unclear); Chełm 1942 (11,000 ghetto-period count) and 1931 (18,000, conflicts with the census table 13,537);
  Geneva 1900 (1,076, city or canton unclear); Toledo 2005 (4,000, upper bound); Włocławek 1940 (3,000 ghetto);
  Boston 1860 (~1,000 new arrivals, not residents).
- Population changed: Geneva 1859 ~200 → 200 (not a families ×5 estimate).
- Deleted: Veracruz 1550 (conversos settled in Mexican ports, before Year Established 1600, no documented
  Jewish presence).

## Still open (left as is)
- Kept but uncertain scope: Milwaukee 1925, 1927 and 1968 (22,000 / 25,000 / 23,900; the 1927 row is a city
  listing, the others do not say); Boston 1915 (85,000, midpoint of 80,000–90,000, may include neighbouring
  towns); Louisville 1927–1984 ("reported figure", city vs community unclear); Toledo 1944 (6,100; the 1994 study
  gives 6,370 for Greater Toledo); Orlando 1876 and 1885 (families ×5 "in the Orlando area"); Thornhill (the
  area is defined as South Steeles–North Highway 7 in a Toronto study).
- Conflicting figures kept as separate rows: Newark 1900 / 1904 / 1910 (5,500 / 20,000 / 22,000); Chełm 1921
  (share 51.1% vs 25% vs 42.1%) and 1895 vs 1893/1900; Oświęcim 1939 (8,000 vs 9,000).
- Approximated years (century midpoints, publication years, inferred dates) are explained in each row's Notes:
  for example Chicago 1902, Newark 1930 and 1950, Galveston ~1968, Sarcelles ~2017, Oświęcim 2010.
- Sarcelles 2017 (13,500) is the midpoint of a 12,000–15,000 range.
- Newark 1977 (500) against an 80,000 peak: check it is the city, not a congregation.

## Per town
| Town | Rows | Numbers | Years | Check before merging |
|---|---|---|---|---|
| Chicago, USA | 11 | 4 | 1832–2020 | 3 searches; no city figures 1880–1900, 1910–1920, 1940–1980; 1902 year is the JE publication year; 1930/1959 metro figures in Notes. |
| Boston, USA | 16 | 3 | 1649–2016 | 4 searches; Year Established 1649 is a single visitor (Solomon Franco); 1915 85,000 may include neighbouring towns; nothing after 1915 at city level. |
| Las Vegas, USA | 9 | 0 | 1905–2021 | 3 searches; no city count found (1995–2013 figures are metro-scale, in Notes). |
| Newark, USA | 13 | 7 | 1844–2015 | 5 searches; conflicting 1900/1904/1910 rows; 1930 and 1950 years inferred; 1977 = 500 needs a check. |
| Portland (Oregon), USA | 11 | 0 | 1849–2023 | 7 searches; 1860 census counts Jewish adults only (84, in Notes); metro 25,000–57,000 in Notes; 2023 year assumed. |
| San Jose, USA | 9 | 2 | 1861–2015 | 2 numbers (1880: 265; 1948: 1,200); 2005 and 2015 are metro-scale (Notes). |
| Milwaukee, USA | 16 | 7 | 1836–2026 | 3 searches; 1925/1927/1968 scope (see above). |
| Orlando, USA | 7 | 2 | 1876–2005 | 3 searches; only two families ×5 estimates; Florida figures 1962–2005 are regional (Notes). |
| Louisville, USA | 17 | 7 | 1814–2024 | 3 searches; 1927–1984 scope unclear; Federation figures (1991+) in Notes. |
| Toledo, USA | 11 | 3 | 1837–2005 | 3 searches; 1944 6,100 may be metro; 1895 1,500 is a city-directory estimate. |
| Galveston, USA | 11 | 5 | 1838–1968 | 4 searches; 1968 year derived ("twenty years after 1948"); 1937 and 1948 both 1,200; no data after 1968. |
| Geneva, Switzerland | 13 | 4 | 1300–2023 | 3 searches; Year Established 1300 is later than a late-12th-c. settlement mentioned by sources; ~65 (1400) and ~330 (1852) are families ×5; 2000/2023 city vs canton unclear (Notes); no 1910–1970 figures. |
| Nevers, France | 8 | 0 | 1150–1942 | 6 searches; no Nevers-only count (Nièvre department figures in Notes); Year Established 1150 is the midpoint of the 12th century. |
| Sarcelles, France | 5 | 1 | 1962–2017 | 3 searches; one range-midpoint figure; no pre-1960 series. |
| Chełm, Poland | 22 | 14 | 1492–2000 | 3 searches; sztetl, EJ, eleven.co.il and Pinkas never tried; duplicate 1921 and 1939 rows (two sources each); 1700 ~400 is a century midpoint. |
| Włocławek, Poland | 14 | 10 | 1803–1969 | 5 searches; no 1921 census figure; 1938 ~12,000 approximate; 1939 13,500 includes refugees. |
| Oświęcim, Poland | 16 | 6 | 1563–2010 | 3 searches; 2010 year is the agent's midpoint for an undated "fewer than 10 Jews today"; kahal and district figures (1765, 1773, 1780) correctly in Notes. |
| Veracruz, Mexico | 5 | 1 | 1600–2004 | 4 searches; Year Established 1600 rests on a vague "by the end of the 16th c."; the only number (~150, 2004) is 30 families ×5. |
| Thornhill, Canada | 7 | 3 | 1971–2011 | 6 searches; Population = sum of the Vaughan and Markham parts (both in Notes); 1971 covers only the Markham part (blank); no pre-1971 data. |
| Yehud-Monosson, Israel | 10 | 0 | 1884–2026 | 3 searches; only total-population figures found (Jewish share 97.4%/99.8% in Notes); a Jewish count could be derived as total × share but was not entered. |
