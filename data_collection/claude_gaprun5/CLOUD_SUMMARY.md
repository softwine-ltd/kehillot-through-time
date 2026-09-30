# Cloud gap run 5: summary

25 towns from `queue.csv` (Poland, Ukraine, Hungary, Lithuania, Italy, Portugal, France, Georgia, Albania, El
Salvador, South Africa), collected on 2026-09-30 by one subagent per town following `BRIEF.md`, in 5 batches.
All 25 are `done`; none failed and no usage or credit limit was hit. Every `city_data_*.csv` parses with the exact
header and 9 columns on every row, every row has a numeric Year of Data, no row is dated before Year Established,
and every Source URL is listed as fetched OK in the town's `sources_*.txt` (Beaune's locally-parsed PDF was added
to its log). The review pass below was done by me after the queue was empty.

"Numbers" = rows with a Population value (including 0). "Years" = span of Year of Data. Figures are after the
review fixes.

## Checks I ran on the agents' work
- I re-fetched every cited page and looked for each Population figure on it (plain numbers only; not `~N`
  family estimates or zeros). All figures were found except: Mszczonów 1940 2,100 (the agent's midpoint of a
  "2,000–2,200" range, now moved to Notes), Lyuboml 1939 3,141 (moved to Notes), and figures on pages that
  block a plain fetch (403): Lesko 1765, 1799, 1857, 1921 (2,338) and 1939 (`shtetlroutes.eu`) and Kaniv 1897
  (2,682) and 1939 (`kanivrada.com.ua`). Those agents fetched the pages successfully with WebFetch, so I treat
  them as unverified by me, not wrong.
- Szeged's agent said it had not checked that its facts are on the cited pages; my re-fetch found all 18
  figures on them.

## Main caveats
- **Thin searching.** The brief asks for 6–10 searches per town. Głowno, Lubartów, Wyszków, Parczew, Vyshnivets,
  Palermo, Kutaisi, Kaniv, Narodychi, Zhashkiv, Lesko, Beaune, Korsun, San Salvador and Vlorë reached 6 and
  Germiston ran 10; the other nine ran 3–5.
- **Few numbers for some towns.** San Salvador has none (every count found covers all of El Salvador), Beaune
  has none; Germiston and Castelo de Vide have 1, Mszczonów and Siedliszcze 2, and Piaski 3. These need a deeper pass
  or manual research.
- **Poll-tax counts.** Several 17th- and 18th-century figures count poll-tax payers or kahal members, not
  persons. I moved those where the source itself said so.

## Review fixes applied (19 rows tagged `[Review fix: ...]`, 0 rows deleted)
Numbers moved out of Population are kept in Notes. `grep "Review fix"` lists every edit.

Conventions applied (same as runs 2 and 4):
- **Population = Jews of the town only.** Kahal-level figures, figures that include surrounding villages and
  ghetto counts go to Notes; a documented prewar town population stays.
- **Poll-tax payers** go to Notes where the source says they are not all persons; a poll-tax count that a source
  presents as the town's Jewish population would stay (none in this run needed that).
- **Upper bounds and ranges** ("not more than 50", "2,000–2,200") go to Notes; lower bounds ("more than N") stay.
- **Returned-survivor counts** go to Notes (not a resident census).
- **Figures whose unit is ambiguous** (persons or families) go to Notes.
- **Population 0 only where absence is positively documented.** "Not reconstituted", "no Jewish community
  left" and "declared Judenfrei" (with survivors) are not enough.
- **Copies of another year's figure** whose date is doubtful go to Notes.
- **`~N` is reserved for families ×5 estimates.**

Rows changed:
- Moved to Notes: Brzeziny 1765 (243, includes villages); Kalvarija 1766 (1,055 poll-tax payers) and 1765 (~1,000,
  kahal); Kaniv 1765 (98, includes surrounding villages); Korsun 1785 (187 poll-tax payers, repeats 1765);
  Mszczonów 1940 (2,000 ghetto and 2,100 range midpoint); Palermo 1172 (1,500, persons or families) and 1904
  (50, upper bound); Parczew 1674 (84) and 1765 (303) poll-tax payers; Vyshnivets 1765 (475, Old City only) and
  1942 (2,669, ghetto-period figure); Lyuboml 1939 (3,141, repeats 1921); Chrzanów 1945 (105 returnees).
- Population 0 removed: Lubartów 1943 (about 40 survived); Lyuboml 1945 (not reconstituted); Piaski 1927
  (area-level statement); Lesko 1945 ("no Jewish community left").

## Still open (left as is)
- Conflicting figures kept as separate rows: Kalvarija 1895 / 1897 (7,930 / 3,581 / ~7,000); Kutaisi 1897 (3,419 /
  3,464 / 4,843); Kaniv 1897 (2,682 / 2,710) and 2001 / 2002 (18 / ~150); Lesko 1921 (2,400 / 2,338); Vlorë 1520
  (2,600 / ~2,640 / 3,600; the first two are the same Ottoman census); Wyszków 1939 (~5,000 and 0 after
  13 September 1939); Szeged; Lubartów 1939 (3,411 vs 818 after the expulsion).
- "Jewish society by the 1847 revision" figures (Kaniv 1,635; Narodychi 978) are kept; they may be kahal-level.
- Kept: Palermo 1860 = 0 (source: no Jews until 1861; JVL notes temporary readmissions 1695–1702 and 1740–46).
- Year Established: Wyszków 1650 is a century midpoint for a "probable" 17th-century settlement (documents
  mention Jews leasing distilleries; the earliest count is 1808); Siedliszcze 1889 is the earliest evidence the
  agent fetched and is probably too late; Castelo de Vide 1320 rests on one travel-magazine source; San Salvador
  1868 (Bernardo Haas) does not say he settled in San Salvador.
- Approximated years (century midpoints, publication years) are explained in each row's Notes.

## Per town
| Town | Rows | Numbers | Years | Check before merging |
|---|---|---|---|---|
| Szeged, Hungary | 26 | 18 | 1552–1958 | 3 searches; the 1831 note is muddled (367 men vs the JE reading as the community size); 1927 "nearly 8,000". |
| Kalvarija, Lithuania | 15 | 6 | 1713–2019 | 4 searches; three conflicting late-19th-c. figures; the "last Jew" in 2019 is presence, not 0. |
| Chrzanów, Poland | 11 | 7 | 1590–1945 | 5 searches; the 1745 synagogue date differs between sources (1745 / 1787); ghetto dated 1941 vs Jan 1940. |
| Brzeziny, Poland | 16 | 8 | 1547–1945 | 3 searches; 1827 ~860 = 172 families ×5; a "406 of 1,899" figure for 1921 left out as a misprint. |
| Głowno, Poland | 11 | 6 | 1753–1941 | Clean Pinkas series 1793–1939; ghetto counts in Notes. |
| Piaski, Poland | 8 | 3 | 1783–1927 | Piaski in Gostyń County (not near Lublin); 1795 (113) is the agent's approximation. |
| Parczew, Poland | 12 | 5 | 1564–1946 | Early rows count houses or households (blank); 1900 (3,392) not used. |
| Mszczonów, Poland | 11 | 2 | 1763–1941 | 3 searches; 1897 and 1900 both 2,523 (two sources); 1921 "about 5,000 (43%)" is ambiguous (Notes). |
| Lubartów, Poland | 14 | 8 | 1567–1943 | Ghetto counts in Notes; 1939 3,411 vs 818 remaining after the expulsion. |
| Wyszków, Poland | 12 | 8 | 1650–1946 | See Year Established note above. |
| Palermo, Italy | 11 | 5 | 598–2018 | 1488 ~4,250 = 850 families ×5; 1492 5,000; only 96 in the 1938 census. |
| Vyshnivets, Ukraine | 13 | 5 | 1597–1944 | The ~5,000 prewar figure conflicts with the census figures (Notes). |
| Castelo de Vide, Portugal | 10 | 1 | 1320–1972 | 4 searches; the only number is ~245 (49 families ×5) from one magazine. |
| Korsun, Ukraine | 24 | 10 | 1622–2016 | 1737 = 1 Jew; 1897 3,799 vs 3,800 (two sources). |
| Beaune, France | 5 | 0 | 1306–2008 | No counts found; Year Established 1306; 1390 year approximate. |
| Kutaisi, Georgia | 29 | 19 | 1815–2020 | Some figures (1908, 1912, 1970, 1979) from Hebrew Wikipedia only; 2020 year estimated. |
| Lyuboml, Ukraine | 17 | 6 | 1376–1945 | 4 searches; 1897 3,297 vs 3,300 (JE rounded); Year Established 1376 from a 1370–82 first mention. |
| Narodychi, Ukraine | 12 | 8 | 1683–2017 | 1858 (1,164) left out as a misdated copy; 1947 approximate. |
| Vlorë, Albania | 15 | 4 | 1426–1991 | 1938 ~75 = 15 families ×5; 1930 national count (204) in Notes. |
| Siedliszcze, Poland | 4 | 2 | 1889–1942 | 5 searches; Year Established probably too late; ghetto ~2,000 (mixed with deportees) in Notes. |
| Kaniv, Ukraine | 17 | 10 | 1622–2002 | 1900 2,683 (IJCP) nearly repeats 1897; 1845 1,802 vs 1847 1,635. |
| Zhashkiv, Ukraine | 10 | 4 | 1636–2012 | Nothing between 1897 and 2012; 1923 (393) and 1939 (877) seen only in snippets. |
| Lesko, Poland | 14 | 8 | 1542–1945 | Several figures unverifiable by me (see above); 1900 (2,701) not used. |
| San Salvador, El Salvador | 14 | 0 | 1868–2011 | Country-wide counts only (300 in 1969 to ~150 in 2011), all in Notes. |
| Germiston, South Africa | 6 | 1 | 1888–2001 | 10 searches; ~3,000 (c.1965) = ~600 families ×5; 2001 shul closure is not a 0. |
