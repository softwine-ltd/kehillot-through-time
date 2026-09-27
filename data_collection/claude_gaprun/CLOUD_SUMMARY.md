# Cloud gap run: summary

Towns 59–91 of `queue.csv`, collected on 2026-09-27 by one subagent per town following `BRIEF.md`, in batches
of 6. All 33 are `done`; none failed. Every `city_data_*.csv` parses with the exact header and 9 columns on
every row, and every row has a numeric Year of Data. Each town also has a `sources_*.txt` fetch log.

Before the run, Providence's coordinates in `queue.csv` were corrected from -73.7329, 43.0006 (upstate New
York) to -71.4222, 41.8236 (Providence, Rhode Island).

"Numbers" = rows with a Population value (including 0). "Years" = span of Year of Data.

## Across all towns
- **Rows dated before Year Established** (Astrakhan, Bradford, Kecskemét, Krasnoyarsk, Kraśnik, Lucena,
  Palma de Mallorca): decide whether to drop them or move Year Established, so the map does not show presence
  early.
- **Inconsistent handling of similar figures across files:** Mountain-Jews-only counts are in Notes for
  Nalchik but in Population for Makhachkala. Upper bounds ("at most", "more than") are in Notes for Perm but
  in Population for Curitiba. Census counts by nationality are mixed with counts by religion (Rimavská
  Sobota, Trebišov). Pick one convention.
- **Post-Soviet community estimates** are often 2–4× the census figures (Chelyabinsk, Perm, Ufa, Nalchik,
  Krasnoyarsk, Oryol, Vladivostok). They are kept as separate rows; consider dropping them where a census
  exists.
- **Thin towns** that may need manual research: Lucena (1 number), Valparaíso (1), Tabriz (4), Segovia (5),
  Rimavská Sobota (7).

## Per town
| Town | Rows | Numbers | Years | Check before merging |
|---|---|---|---|---|
| Nalchik, Russia | 40 | 22 | 1818–2023 | 1980s community estimates (>10,000; >12,000; 17,500 before 1991) are 2–3× the 1970/1979 censuses (5,171/2,851); Year Established 1818 is approximate; 1897 1,040 vs 1,354 (unfetched source, left out). |
| Kursk, Russia | 46 | 20 | 1780–2024 | 1970: EJ ~9,000 vs RJE 4,370 (separate rows); Year Established 1790 approximates "end of the 18th c."; the ~2,000-member community figure is in Notes (city or region unclear). |
| Tula, Russia | 31 | 8 | 1835–2016 | **1890 ~4,000 was calculated by the agent** ("grew 8 times" × ~500), not stated, and conflicts with the 1897 census (2,334): drop it or move it to Notes. The ~3,500 "c.1900" rests on reading "2-го века" as the 20th c.: verify. No Soviet census figures for the city. |
| Chelyabinsk, Russia | 31 | 13 | 1845–2005 | 2005 ~10,000 (Lechaim estimate) vs 2000 ~4,500 and oblast census 2002 4,930: likely too high; 1926 ">1,500" vs 1,779 (LiveJournal); no 1939/1959 figures. |
| Perm, Russia | 54 | 19 | 1823–2021 | 2005 ~7,000 estimate vs 2002 census 2,218; 1897 942 vs 817; 1918 5,535 is the community's own estimate, including refugees. |
| Ufa, Russia | 38 | 11 | 1850–2021 | JVL's undated 10,000 was dated 2007 by the agent and conflicts with the censuses (781/1,605/943): likely drop; 2002→2010 jump (781→1,605): check city vs republic; no city figure 1926–1989. |
| Krasnoyarsk, Russia | 59 | 25 | 1805–2020 | 2002 "about 5,000" vs 1989 ~1,800 and krai 2020 census 618: likely a regional community estimate; Year Established 1822 but an 1805 exiles row exists. |
| Astrakhan, Russia | 66 | 28 | 1791–2019 | Two 1791 rows record only the legal right of residence, before Year Established 1805; 2002 3,000 is an estimate vs 1989 census 2,137; 1899 1,575 vs 1897 census 2,164. |
| Taganrog, Russia | 34 | 12 | 1805–2012 | 1805 "~5" applies ×5 to one named couple (2 people): use 2 or blank; 1845 ~890 vs 1847 413; 1859 748 vs 577; no postwar figures (the Rosstat PDF could not be fetched). |
| Vladivostok, Russia | 34 | 14 | 1878–2015 | 2008 "~6,000" rests on a blog ("double the heyday's 3,000"): likely drop; no city figures 1959–2010. |
| Makhachkala, Russia | 41 | 30 | 1862–2025 | 1880 (93) and 1912 (453) count Mountain Jews only but are in Population; Russian Wikipedia's Soviet figures (1959 4,589, 1970 6,006, 1979 9,825) are far above RJE/English Wikipedia (2,692/5,213/4,226); 2024 ~1,000 vs 300–430. |
| Oryol, Russia | 36 | 15 | 1845–2016 | 1941 ">7,000" (FEOR site) vs 1939 census 3,143: likely drop; post-1939 figures rest on Cyclowiki alone; Year Established is a decade midpoint. |
| Bradford, United Kingdom | 43 | 17 | 1825–2021 | Year Established 1838, but presence rows exist for 1825 and 1835 (decade midpoints); the 2001 census figure 356 is in Population (JVL, "in Bradford") and also in Notes as district-wide: make consistent. |
| Kecskemét, Hungary | 48 | 26 | 1650–2025 | 1650 and 1715 rows (Ottoman-era traders, fair visitors) come before Year Established 1746 and show visits, not residence; the 1939 figure's year is approximate. |
| Hódmezővásárhely, Hungary | 50 | 28 | 1748–2026 | 1848 ~635 is 127 *households* ×5 (the rule covers families); 1880 1,658 vs 1,685; ~40 dated 2015 from the page's update date; 1770 = 0 after the expulsion. |
| Szolnok, Hungary | 41 | 18 | 1830–1994 | "~350" (60–80 families): the source says 1818, the agent re-dated it to 1848, where it clashes with 60 Jews in 1848: likely drop; 1944 ghetto/mayor counts are in Population alongside the 1941 census 2,590; data ends 1994. |
| Baja, Hungary | 31 | 16 | 1725–2023 | 1929 2,400 (Magyar Zsidó Lexikon, dated by its publication year) vs 1930 census 1,648: may include villages. |
| Cegléd, Hungary | 32 | 14 | 1840–1965 | Clean census series (Pinkas Hakehillot); no data after 1965. |
| Balassagyarmat, Hungary | 30 | 9 | 1690–2022 | Only 9 numbers, none between 1784 and 1900; 1944 "about 2,000 local Jews in the ghetto" is in Population: check against the ghetto rule; 1920 2,401 vs 2,245. |
| Lučenec, Slovakia | 34 | 23 | 1725–2021 | Good series (Masaryk University thesis); 1880 and c.1939 each have two figures kept as separate rows. |
| Trebišov, Slovakia | 21 | 11 | 1736–2021 | 1922 "about 800" vs 1921 census 534; nationality and religion counts both present for 1921 and 2021. |
| Rimavská Sobota, Slovakia | 23 | 7 | 1848–2021 | Nationality counts (1921, 2001, 2011) mixed with religion counts (2011, 2021); no figure before 1921. |
| Lucena, Spain | 20 | 1 | 850–1550 | No head counts at all; 0 in 1146 but presence rows follow (1154, 1391, 1492); two 850 rows precede Year Established 853; the 1550 converso row is not a Jewish population. |
| Palma de Mallorca, Spain | 35 | 9 | 1114–2023 | 1435 has both 4,000 (Ynet) and 0 (the community ended): drop the 4,000; the 1114/1135 rows cover the whole island, before Year Established 1229; 1329–1350 are the source's own hearth ×4.5 estimates. |
| Segovia, Spain | 27 | 5 | 1215–1493 | All figures are family-based or rounded estimates; 1493 = 0 is a judgement ("the aljama disappears"); nothing after 1493. |
| Shumen, Bulgaria | 35 | 19 | 1750–2022 | 1945 1,000 probably includes expellees from Sofia; 1952 500 vs May 1949 88/84; 2021 census 11 vs 2022 community 40. |
| Kraśnik, Poland | 48 | 24 | 1377–1945 | The 1377 row (one JewishGen page, unsupported) precedes Year Established 1531: drop; 1945 = 0 vs a 1944 registration of up to 300; 1940/41 6,300 is likely inflated by refugees; nothing after 1945. |
| Urmia, Iran | 22 | 11 | 1025–2006 | 1902 350 (Hebrew Wikipedia) is likely 350 families misread: drop in favour of ~1,750; Year Established 1025 rests on "about a thousand years ago"; 0 in 1980/1982 vs 2 in 2006. |
| Tabriz, Iran | 21 | 4 | 1150–2026 | Only zeros and one 5; the c.1485 zero rests on "Jews only traded there", a weak basis for absence; 1828 = 0 vs an 1830 massacre row; 2008 5 vs 2026 0; no 19th–20th c. figures. |
| Curitiba, Brazil | 31 | 11 | 1889–2019 | 1980 "at most 2,500" is an upper bound in Population; 1913 ~77 mixes families ×5 with single men; the 1950 year is assumed; nothing at city level after 1980. |
| Valparaíso, Chile | 22 | 1 | 1850–2021 | The only number (1954, ~1,000 in 330 families) comes from a table titled Valparaíso–Viña del Mar, so it may cover the metro area. |
| Providence, USA | 46 | 20 | 1838–2005 | 1905 ~17,500 (3,500 families ×5) vs ~8,000 for 1905–09: drop; many pre-1900 figures are family ×5 estimates; nothing at city level after 1963. |
| Oakland, USA | 35 | 8 | 1852–2015 | 1905 227 repeats the 1880 figure (likely copied forward): drop; no city figure after 1942. |
